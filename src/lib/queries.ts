import "server-only";
import { db } from "./db";

/** Safely parse a JSON settings/page string. */
function parseJSON<T>(value: string | undefined | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await db.setting.findUnique({ where: { key } });
  return parseJSON<T>(row?.value, fallback);
}

export async function getPage(key: string) {
  const page = await db.page.findUnique({ where: { key } });
  if (!page) return null;
  return { ...page, data: parseJSON<Record<string, unknown>>(page.content, {}) };
}

export async function getMarquee() {
  const [m, speedSetting] = await Promise.all([
    db.marquee.findFirst({ orderBy: { updatedAt: "desc" } }),
    db.setting.findUnique({ where: { key: "marquee_speed" } }),
  ]);
  if (!m?.enabled) return null;
  return {
    ...m,
    speed: speedSetting ? parseInt(speedSetting.value) || 8 : 8,
  };
}

// --- Achievements ---
export async function getAchievements(opts?: { category?: string; take?: number }) {
  return db.achievement.findMany({
    where: {
      published: true,
      ...(opts?.category && opts.category !== "all"
        ? { category: opts.category }
        : {}),
    },
    orderBy: { date: "desc" },
    take: opts?.take,
    include: { media: { orderBy: { order: "asc" } } },
  });
}

export async function getAchievement(slug: string) {
  return db.achievement.findUnique({
    where: { slug },
    include: { media: { orderBy: { order: "asc" } } },
  });
}

// --- Events ---
export async function getEvents(opts?: { status?: string; take?: number }) {
  return db.event.findMany({
    where: {
      published: true,
      ...(opts?.status && opts.status !== "all" ? { status: opts.status } : {}),
    },
    orderBy: { date: opts?.status === "completed" ? "desc" : "asc" },
    take: opts?.take,
    include: {
      media: { orderBy: { order: "asc" } },
      attachments: true,
      committee: { select: { id: true, name: true, slug: true } },
      committees: { select: { id: true, name: true, slug: true } },
    },
  });
}

export async function getUpcomingEvents(take = 3) {
  return db.event.findMany({
    where: { published: true, status: "upcoming" },
    orderBy: { date: "asc" },
    take,
    include: {
      media: true,
      committee: { select: { id: true, name: true, slug: true } },
      committees: { select: { id: true, name: true, slug: true } },
    },
  });
}

export async function getEvent(slug: string) {
  return db.event.findUnique({
    where: { slug },
    include: {
      media: { orderBy: { order: "asc" } },
      attachments: true,
      gallery: { include: { photos: { orderBy: { position: "asc" } } } },
      registrationForm: true,
      committee: { select: { id: true, name: true, slug: true } },
      committees: { select: { id: true, name: true, slug: true } },
    },
  });
}

// --- Notifications ---
export async function getNotifications(take?: number) {
  return db.notification.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
    take,
  });
}

export async function getNotification(slug: string) {
  return db.notification.findUnique({ where: { slug } });
}

// --- Interventions ---
export async function getInterventions(opts?: {
  category?: string;
  q?: string;
  take?: number;
  publishedOnly?: boolean;
}) {
  const publishedOnly = opts?.publishedOnly ?? true;
  const where: Record<string, unknown> = {
    ...(publishedOnly ? { published: true } : {}),
    ...(opts?.category && opts.category !== "all" ? { category: opts.category } : {}),
  };

  if (opts?.q) {
    const term = opts.q.trim();
    if (term) {
      where.OR = [
        { title: { contains: term } },
        { description: { contains: term } },
      ];
    }
  }

  return db.intervention.findMany({
    where,
    orderBy: [{ pinned: "desc" }, { date: "desc" }],
    take: opts?.take,
  });
}

export async function getIntervention(slug: string) {
  return db.intervention.findUnique({ where: { slug } });
}

// --- Finance ---
export async function getFinance() {
  const entries = await db.financeEntry.findMany({ orderBy: { date: "desc" } });
  const income = entries.filter((e) => e.kind === "income");
  const expenditure = entries.filter((e) => e.kind === "expenditure");
  const totalIncome = income.reduce((s, e) => s + e.amount, 0);
  const totalExpenditure = expenditure.reduce((s, e) => s + e.amount, 0);
  return {
    entries,
    income,
    expenditure,
    totalIncome,
    totalExpenditure,
    balance: totalIncome - totalExpenditure,
  };
}

// --- Emergency ---
export async function getEmergencyContacts() {
  return db.emergencyContact.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { category: "asc" }],
  });
}

export async function getHomepageEmergencyContacts() {
  // Check if the section is enabled
  const sectionEnabled = await getSetting("homepage_emergency_section", { enabled: true });
  if (!sectionEnabled.enabled) return [];

  // Fetch contacts marked for homepage (no take limit so all checked items appear)
  const homepage = await db.emergencyContact.findMany({
    where: { active: true, showOnHomepage: true },
    orderBy: [{ order: "asc" }, { category: "asc" }],
  });

  // If admin hasn't marked any, fall back to Emergency Services category or first active
  if (homepage.length === 0) {
    return db.emergencyContact.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { category: "asc" }],
      take: 6,
    });
  }

  return homepage;
}

export async function getEmergencyPdf(): Promise<{ url: string; name: string } | null> {
  try {
    const row = await db.setting.findUnique({ where: { key: "emergency_registry_pdf" } });
    if (row?.value) {
      const parsed = JSON.parse(row.value);
      if (parsed?.deleted) return null;
      if (parsed?.url) {
        return { url: parsed.url, name: parsed.name || "Emergency Registry.pdf" };
      }
    }
  } catch (e) {
    console.error("Error fetching emergency PDF setting:", e);
  }
  // Default official copy fallback
  return {
    url: "/documents/emergency-registry.pdf",
    name: "Emergency Directory - TDMC Alappuzha.pdf",
  };
}


// --- Committees ---
export async function getCommittees() {
  return db.committee.findMany({
    orderBy: { order: "asc" },
    include: { members: { orderBy: { order: "asc" } } },
  });
}

export async function getCommittee(slug: string) {
  return db.committee.findUnique({
    where: { slug },
    include: { members: { orderBy: { order: "asc" } } },
  });
}

export async function getCommitteeEvents(committeeId: string) {
  return db.event.findMany({
    where: {
      published: true,
      OR: [
        { committeeId },
        { committees: { some: { id: committeeId } } },
      ],
    },
    orderBy: { date: "desc" },
    include: {
      media: { orderBy: { order: "asc" } },
      attachments: true,
      committee: { select: { id: true, name: true, slug: true } },
      committees: { select: { id: true, name: true, slug: true } },
    },
  });
}

export async function getCommitteesList() {
  return db.committee.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });
}

const STATIC_PAGES = [
  {
    title: "Advaya Annual Fest — Homepage",
    href: "/",
    description: "Alappuzha Medical College (TDMC) Union Annual Arts & Cultural Fest 2026.",
    keywords: "advaya fest annual college tdmc alappuzha union arts cultural home main index 2026 website portal medical",
  },
  {
    title: "About Advaya & TDMC",
    href: "/about",
    description: "Learn about the history, heritage, College Union, and leadership of TDMC Alappuzha.",
    keywords: "about history college medical tdmc alappuzha principal union heritage executive leadership team campus information",
  },
  {
    title: "Events & Competitions",
    href: "/events",
    description: "Browse all cultural, technical, and sports events, schedules, and delegate registrations.",
    keywords: "events competitions dance music cultural sports register schedule rules prizes guidelines fest arts programs",
  },
  {
    title: "Emergency Registry & Directory",
    href: "/emergency",
    description: "24x7 emergency contacts, ambulance, hospital helpdesk, police, fire force, and blood bank.",
    keywords: "emergency directory ambulance police hospital 112 100 108 blood bank watchman sergeant help safety security contacts doctor medical numbers helpline",
  },
  {
    title: "Social Interventions",
    href: "/interventions",
    description: "Social welfare campaigns, community healthcare initiatives, and student outreach programs.",
    keywords: "interventions social welfare campaigns community healthcare outreach donation awareness projects blood donation camps charity help support",
  },
  {
    title: "Subcommittees & Organizing Teams",
    href: "/subcommittee",
    description: "Explore all organizing committees, stage managers, coordinators, and student teams.",
    keywords: "subcommittees committees organizing teams coordinators members volunteers crew leaders management event team student council",
  },
  {
    title: "Submit a Complaint / Grievance",
    href: "/complaints",
    description: "Confidential student helpdesk and grievance redressal system for campus complaints.",
    keywords: "complaints grievance report issue helpdesk confidential ragging harassment feedback problem dispute resolution redressal help",
  },
  {
    title: "Contact Us",
    href: "/contact",
    description: "Get in touch with the Advaya College Union, address details, phone numbers, and email.",
    keywords: "contact email phone reach address location tdmc alappuzha map directions queries help union office support",
  },
  {
    title: "Student Achievements",
    href: "/achievements",
    description: "Celebrating academic, cultural, and sports triumphs of TDMC Alappuzha students.",
    keywords: "achievements awards winners champions honors glory students sports cultural medals competition results records",
  },
  {
    title: "Announcements & Notifications",
    href: "/notifications",
    description: "Official notices, circulars, schedule updates, and breaking news from Advaya.",
    keywords: "notifications announcements notices circulars updates news breaking alerts schedule bulletins general information",
  },
  {
    title: "UG Delegate Registrations",
    href: "/ug",
    description: "Undergraduate delegate passes and registration portal for Advaya events.",
    keywords: "ug undergraduate mbbs students delegates registration pass ticket entry general cultural sports fest form",
  },
  {
    title: "PG Delegate Registrations",
    href: "/pg",
    description: "Postgraduate doctor and delegate passes for Advaya medical fest.",
    keywords: "pg postgraduate doctors residents delegates registration pass ticket entry medical fest form",
  },
  {
    title: "Union Public Finance",
    href: "/finance",
    description: "Transparent budget breakdown, income, and expenditures of the TDMC College Union.",
    keywords: "finance budget expenditure income transparency money accounting treasury union audit balance sheet expenses",
  },
];

// --- Global search ---
export async function searchAll(q: string) {
  const query = q.trim();
  if (!query) {
    return {
      pages: [],
      achievements: [],
      events: [],
      notifications: [],
      interventions: [],
      emergencyContacts: [],
      subcommittees: [],
    };
  }

  const contains = { contains: query, mode: "insensitive" as const };
  const lowerQ = query.toLowerCase();
  const qWords = lowerQ.split(/\s+/).filter(Boolean);
  const pages = STATIC_PAGES.filter((p) => {
    const text = `${p.title} ${p.description} ${p.keywords}`.toLowerCase();
    return qWords.every((word) => text.includes(word)) || text.includes(lowerQ);
  });

  const [
    achievements,
    events,
    notifications,
    interventions,
    emergencyContacts,
    subcommittees,
  ] = await Promise.all([
    db.achievement.findMany({
      where: {
        published: true,
        OR: [{ title: contains }, { description: contains }],
      },
      take: 10,
      orderBy: { date: "desc" },
    }),
    db.event.findMany({
      where: {
        published: true,
        OR: [
          { title: contains },
          { description: contains },
          { venue: contains },
          { status: contains },
        ],
      },
      take: 10,
      orderBy: { date: "desc" },
    }),
    db.notification.findMany({
      where: {
        published: true,
        OR: [{ title: contains }, { description: contains }],
      },
      take: 10,
      orderBy: { date: "desc" },
    }),
    db.intervention.findMany({
      where: {
        published: true,
        OR: [
          { title: contains },
          { description: contains },
          { category: contains },
        ],
      },
      take: 10,
      orderBy: { date: "desc" },
    }),
    db.emergencyContact.findMany({
      where: {
        active: true,
        OR: [
          { name: contains },
          { category: contains },
          { phone: contains },
          { description: contains },
        ],
      },
      take: 10,
      orderBy: { order: "asc" },
    }),
    db.committee.findMany({
      where: {
        OR: [{ name: contains }, { description: contains }],
      },
      take: 10,
      orderBy: { order: "asc" },
    }),
  ]);

  return {
    pages,
    achievements,
    events,
    notifications,
    interventions,
    emergencyContacts,
    subcommittees,
  };
}

// --- Dashboard stats ---
export async function getDashboardStats() {
  const [achievements, events, notifications, complaints, recentComplaints] =
    await Promise.all([
      db.achievement.count(),
      db.event.count(),
      db.notification.count(),
      db.complaint.count(),
      db.complaint.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);
  return { achievements, events, notifications, complaints, recentComplaints };
}

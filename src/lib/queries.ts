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

// --- Global search ---
export async function searchAll(q: string) {
  const query = q.trim();
  if (!query) return { achievements: [], events: [], notifications: [] };
  const contains = { contains: query };
  const [achievements, events, notifications] = await Promise.all([
    db.achievement.findMany({
      where: { published: true, OR: [{ title: contains }, { description: contains }] },
      take: 8,
      orderBy: { date: "desc" },
    }),
    db.event.findMany({
      where: { published: true, OR: [{ title: contains }, { description: contains }] },
      take: 8,
      orderBy: { date: "desc" },
    }),
    db.notification.findMany({
      where: { published: true, OR: [{ title: contains }, { description: contains }] },
      take: 8,
      orderBy: { date: "desc" },
    }),
  ]);
  return { achievements, events, notifications };
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

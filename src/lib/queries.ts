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
  const m = await db.marquee.findFirst({ orderBy: { updatedAt: "desc" } });
  return m?.enabled ? m : null;
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
    include: { media: { orderBy: { order: "asc" } }, attachments: true },
  });
}

export async function getUpcomingEvents(take = 3) {
  return db.event.findMany({
    where: { published: true, status: "upcoming" },
    orderBy: { date: "asc" },
    take,
    include: { media: true },
  });
}

export async function getEvent(slug: string) {
  return db.event.findUnique({
    where: { slug },
    include: { media: { orderBy: { order: "asc" } }, attachments: true },
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

// --- Committees ---
export async function getCommittees() {
  return db.committee.findMany({
    orderBy: { order: "asc" },
    include: { members: { orderBy: { order: "asc" } } },
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

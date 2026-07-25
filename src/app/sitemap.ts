import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;

  const staticRoutes = [
    "",
    "/achievements",
    "/events",
    "/notifications",
    "/finance",
    "/complaints",
    "/emergency",
    "/subcommittee",
    "/ug",
    "/pg",
    "/about",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const [achievements, events, notifications] = await Promise.all([
    db.achievement.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.event.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.notification.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const dynamic = [
    ...achievements.map((a) => ({ url: `${base}/achievements/${a.slug}`, lastModified: a.updatedAt })),
    ...events.map((e) => ({ url: `${base}/events/${e.slug}`, lastModified: e.updatedAt })),
    ...notifications.map((n) => ({ url: `${base}/notifications/${n.slug}`, lastModified: n.updatedAt })),
  ];

  return [...staticRoutes, ...dynamic];
}

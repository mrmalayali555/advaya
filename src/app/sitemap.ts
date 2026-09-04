import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE.url.replace(/\/$/, "");

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/subcommittee`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/interventions`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/achievements`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/notifications`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/emergency`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const [events, committees, interventions, achievements, notifications, registrations] =
      await Promise.all([
        db.event.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
        db.committee.findMany({ select: { slug: true, createdAt: true } }),
        db.intervention.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
        db.achievement.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
        db.notification.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
        db.registrationForm.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      ]);

    const eventRoutes: MetadataRoute.Sitemap = events.map((e) => ({
      url: `${baseUrl}/events/${e.slug}`,
      lastModified: e.updatedAt || new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    }));

    const committeeRoutes: MetadataRoute.Sitemap = committees.map((c) => ({
      url: `${baseUrl}/subcommittee/${c.slug}`,
      lastModified: c.createdAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const interventionRoutes: MetadataRoute.Sitemap = interventions.map((i) => ({
      url: `${baseUrl}/interventions/${i.slug}`,
      lastModified: i.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const achievementRoutes: MetadataRoute.Sitemap = achievements.map((a) => ({
      url: `${baseUrl}/achievements/${a.slug}`,
      lastModified: a.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const notificationRoutes: MetadataRoute.Sitemap = notifications.map((n) => ({
      url: `${baseUrl}/notifications/${n.slug}`,
      lastModified: n.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const registrationRoutes: MetadataRoute.Sitemap = registrations.map((r) => ({
      url: `${baseUrl}/registration/${r.slug}`,
      lastModified: r.updatedAt || new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));

    return [
      ...staticRoutes,
      ...eventRoutes,
      ...committeeRoutes,
      ...interventionRoutes,
      ...achievementRoutes,
      ...notificationRoutes,
      ...registrationRoutes,
    ];
  } catch (error) {
    console.error("Error generating sitemap routes:", error);
    return staticRoutes;
  }
}

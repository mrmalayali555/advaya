import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all tables
    const [
      achievements,
      committees,
      complaints,
      events,
      interventions,
      emergencyContacts,
      notifications,
      pages,
      settings,
      marquee,
      media,
      admins
    ] = await Promise.all([
      db.achievement.findMany(),
      db.committee.findMany(),
      db.complaint.findMany(),
      db.event.findMany(),
      db.intervention.findMany(),
      db.emergencyContact.findMany(),
      db.notification.findMany(),
      db.page.findMany(),
      db.setting.findMany(),
      db.marquee.findMany(),
      db.media.findMany(),
      db.admin.findMany({ select: { id: true, email: true, name: true, role: true } }), // Omit passwords
    ]);

    const backup = {
      timestamp: new Date().toISOString(),
      version: "1.0",
      data: {
        achievements,
        committees,
        complaints,
        events,
        interventions,
        emergencyContacts,
        notifications,
        pages,
        settings,
        marquee,
        media,
        admins,
      }
    };

    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="advaya-backup-${new Date().toISOString().split('T')[0]}.json"`
      }
    });

  } catch (error) {
    console.error("Backup failed:", error);
    return NextResponse.json({ error: "Failed to generate backup" }, { status: 500 });
  }
}

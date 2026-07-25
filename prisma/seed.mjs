import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

async function main() {
  console.log("🌱 Seeding ADVAYA database…");

  // --- Admin ---
  const email = process.env.ADMIN_EMAIL || "admin@advaya.local";
  const password = process.env.ADMIN_PASSWORD || "advaya123";
  const name = process.env.ADMIN_NAME || "ADVAYA Admin";
  const passwordHash = await bcrypt.hash(password, 12);

  await db.admin.upsert({
    where: { email },
    update: { passwordHash, name, role: "superadmin" },
    create: { email, name, passwordHash, role: "superadmin" },
  });
  console.log(`   ✓ Admin: ${email} / ${password}`);

  // --- Marquee ---
  await db.marquee.deleteMany();
  await db.marquee.create({
    data: {
      enabled: true,
      text: "Welcome to ADVAYA — Union Day celebrations begin 15 August. Registrations now open.",
      buttonText: "View Details",
      buttonUrl: "/events",
    },
  });

  // --- Settings (contact, socials, hero, about summary) ---
  const settings = {
    hero: {
      badge: "Alappuzha Government Medical College",
      title: "The voice of every student.",
      subtitle:
        "ADVAYA is the official college union — celebrating achievements, powering events, and standing for every student at Alappuzha Medical College.",
    },
    contact: {
      address:
        "Alappuzha Government Medical College, Vandanam, Alappuzha, Kerala 688005",
      phone: "+91 477 000 0000",
      email: "advaya.union@example.com",
    },
    stats: {
      students: 1200,
      events: 48,
      achievements: 96,
      committees: 12,
    },
  };
  for (const [key, value] of Object.entries(settings)) {
    await db.setting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
  }

  // --- Pages (about / ug / pg) ---
  const pages = [
    {
      key: "about",
      title: "About the Union",
      content: JSON.stringify({
        history:
          "ADVAYA (അദ്വയ) is the elected student union of Alappuzha Government Medical College, representing undergraduate and postgraduate students across all departments.",
        mission:
          "To give every student a voice, nurture talent in arts, sports and academics, and build a college community rooted in fairness and care.",
        vision:
          "A medical college where students lead, support one another, and grow into compassionate professionals.",
        chairperson:
          "It is my privilege to serve the students of Alappuzha Medical College. Together we will make this a year of achievement, unity and unforgettable memories.",
      }),
    },
    {
      key: "ug",
      title: "Undergraduate (UG)",
      content: JSON.stringify({
        intro:
          "Information, resources and union activities for MBBS undergraduate students.",
      }),
    },
    {
      key: "pg",
      title: "Postgraduate (PG)",
      content: JSON.stringify({
        intro:
          "Information, resources and union activities for postgraduate residents and scholars.",
      }),
    },
  ];
  for (const p of pages) {
    await db.page.upsert({
      where: { key: p.key },
      update: { title: p.title, content: p.content },
      create: p,
    });
  }

  // --- Achievements ---
  await db.achievementMedia.deleteMany();
  await db.achievement.deleteMany();
  const achievements = [
    {
      title: "Inter-Medical Football Championship 2026",
      slug: "inter-medical-football-2026",
      category: "sports",
      description:
        "Our team lifted the state inter-medical football trophy after a thrilling final, defeating the hosts 2–1 in extra time.",
      date: daysFromNow(-20),
    },
    {
      title: "First Prize — State Youth Festival (Music)",
      slug: "state-youth-festival-music",
      category: "arts",
      description:
        "ADVAYA's music troupe secured first place in the group song category at the state medical youth festival.",
      date: daysFromNow(-40),
    },
    {
      title: "Best Research Paper — National Med Conclave",
      slug: "best-research-paper-med-conclave",
      category: "academics",
      description:
        "A final-year student's research on rural healthcare access won best paper at the national medical students' conclave.",
      date: daysFromNow(-8),
    },
    {
      title: "Gold in Inter-College Athletics Meet",
      slug: "gold-inter-college-athletics",
      category: "sports",
      description:
        "Three golds and a new meet record in the 4x100m relay at the university athletics meet.",
      date: daysFromNow(-60),
    },
  ];
  for (const a of achievements) {
    await db.achievement.create({ data: a });
  }

  // --- Events ---
  await db.eventMedia.deleteMany();
  await db.event.deleteMany();
  const events = [
    {
      title: "ADVAYA Union Day 2026",
      slug: "advaya-union-day-2026",
      description:
        "The flagship celebration of the year — cultural performances, awards, food stalls and a night of music.",
      date: daysFromNow(21),
      time: "5:00 PM",
      venue: "College Main Auditorium",
      status: "upcoming",
    },
    {
      title: "Blood Donation Camp",
      slug: "blood-donation-camp",
      description:
        "In association with the district blood bank. Every donor counts — be a lifesaver.",
      date: daysFromNow(9),
      time: "9:00 AM",
      venue: "OPD Block, Ground Floor",
      status: "upcoming",
    },
    {
      title: "Freshers' Welcome 2026",
      slug: "freshers-welcome-2026",
      description:
        "A warm welcome to the incoming batch with performances, games and mentorship pairing.",
      date: daysFromNow(-15),
      time: "6:00 PM",
      venue: "Open Air Theatre",
      status: "completed",
    },
  ];
  for (const e of events) {
    await db.event.create({ data: e });
  }

  // --- Notifications ---
  await db.notification.deleteMany();
  const notifications = [
    {
      title: "Union Day registrations open",
      slug: "union-day-registrations-open",
      description:
        "Register for cultural and sports events before 10 August. Slots are limited.",
      date: daysFromNow(-1),
    },
    {
      title: "Revised internal exam timetable",
      slug: "revised-internal-exam-timetable",
      description:
        "The internal assessment schedule has been revised. Please check the attached notice.",
      date: daysFromNow(-3),
    },
    {
      title: "Holiday declared on 15 October",
      slug: "holiday-15-october",
      description:
        "The college will remain closed on 15 October on account of the local festival.",
      date: daysFromNow(-6),
    },
  ];
  for (const n of notifications) {
    await db.notification.create({ data: n });
  }

  // --- Finance ---
  await db.financeEntry.deleteMany();
  await db.financeEntry.createMany({
    data: [
      { kind: "income", category: "Union Fund", label: "Annual union fund collection", amount: 480000 },
      { kind: "income", category: "Other Income", label: "Sponsorships & donations", amount: 125000 },
      { kind: "expenditure", category: "Union Expenditure", label: "Union Day 2025 arrangements", amount: 210000 },
      { kind: "expenditure", category: "Union Expenditure", label: "Sports equipment & kits", amount: 86000 },
    ],
  });

  // --- Emergency contacts ---
  await db.emergencyContact.deleteMany();
  await db.emergencyContact.createMany({
    data: [
      { category: "Ambulance", name: "College Ambulance", phone: "108", order: 1 },
      { category: "Hospital", name: "Casualty / Emergency", phone: "+91 477 000 0001", order: 2 },
      { category: "Police", name: "Vandanam Police Station", phone: "100", order: 3 },
      { category: "Fire Force", name: "Alappuzha Fire Station", phone: "101", order: 4 },
      { category: "Blood Bank", name: "Medical College Blood Bank", phone: "+91 477 000 0002", order: 5 },
    ],
  });

  // --- Committees ---
  await db.committeeMember.deleteMany();
  await db.committee.deleteMany();
  const arts = await db.committee.create({
    data: {
      name: "Arts & Cultural Committee",
      slug: "arts-cultural",
      description: "Organises cultural fests, music, dance and drama.",
      order: 1,
    },
  });
  const sports = await db.committee.create({
    data: {
      name: "Sports Committee",
      slug: "sports",
      description: "Runs tournaments, teams and the annual athletics meet.",
      order: 2,
    },
  });
  await db.committeeMember.createMany({
    data: [
      { committeeId: arts.id, name: "Convenor — Arts", position: "Convenor", order: 1 },
      { committeeId: arts.id, name: "Joint Convenor — Arts", position: "Joint Convenor", order: 2 },
      { committeeId: sports.id, name: "Convenor — Sports", position: "Convenor", order: 1 },
    ],
  });

  // --- Interventions ---
  await db.intervention.deleteMany();
  const interventions = [
    {
      title: "Representation regarding Hostel Library & 24/7 Study Room Facility",
      slug: "representation-hostel-library-247-study-room",
      category: "Infrastructure",
      description:
        "The Union submitted a formal representation to the Principal requesting the installation of air conditioning and 24/7 lighting/Wi-Fi access in the Men's and Women's hostel reading rooms prior to university exams.",
      date: daysFromNow(-4),
      pinned: true,
      published: true,
    },
    {
      title: "Request for Immediate Repair of OPD Block Elevator & Ramp Access",
      slug: "request-opd-elevator-ramp-repair",
      category: "Campus Safety",
      description:
        "Official letter submitted to the Medical Superintendent highlighting difficulties faced by wheel-chair bound patients and clinical postings students due to non-functioning elevators.",
      date: daysFromNow(-12),
      pinned: false,
      published: true,
    },
    {
      title: "Memorandum on Stipend Disbursal Schedule for PG Residents & House Surgeons",
      slug: "memorandum-stipend-disbursal-schedule",
      category: "Academic & Welfare",
      description:
        "Official petition addressed to the Directorate of Medical Education (DME) ensuring timely monthly credit of stipends for senior and junior resident doctors.",
      date: daysFromNow(-25),
      pinned: false,
      published: true,
    },
  ];
  for (const inv of interventions) {
    await db.intervention.create({ data: inv });
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

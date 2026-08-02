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

  // --- Emergency contacts (Official Directory 2025-26) ---
  await db.emergencyContact.deleteMany();
  await db.emergencyContact.createMany({
    data: [
      { category: "Emergency Services", name: "National Emergency Number", phone: "112", description: "All-in-one national emergency helpline", order: 1, active: true },
      { category: "Emergency Services", name: "Police Helpline", phone: "100", description: "Police control room", order: 2, active: true },
      { category: "Emergency Services", name: "Fire Force", phone: "101", description: "Fire and rescue control room", order: 3, active: true },
      { category: "Emergency Services", name: "Ambulance / Disaster Management", phone: "102, 108", description: "Emergency medical transport & disaster response", order: 4, active: true },
      { category: "Emergency Services", name: "Woman Helpline", phone: "1091", description: "24x7 women safety and emergency helpline", order: 5, active: true },
      { category: "Emergency Services", name: "KSEB Electricity", phone: "9496010101", description: "Kerala State Electricity Board emergency helpline", order: 6, active: true },
      { category: "College & Hospital", name: "College Contact Number", phone: "0477 2282611", description: "Govt T.D. Medical College Alappuzha official office", order: 10, active: true },
      { category: "College & Hospital", name: "Hospital Help Desk", phone: "0477 2282367", description: "T.D. Medical College Hospital help desk & reception", order: 11, active: true },
      { category: "College & Hospital", name: "Hospital Ambulance", phone: "80864 13064", description: "T.D. Medical College Hospital 24x7 ambulance", order: 12, active: true },
      { category: "College & Hospital", name: "Sergeant (Mr. Abhaya Kumar)", phone: "88488 22576", description: "Campus security sergeant", order: 13, active: true },
      { category: "College Union", name: "Sann Mariya (Chairperson)", phone: "85908 80366", description: "Sattva College Union Chairperson", order: 20, active: true },
      { category: "College Union", name: "Mahadevan (General Secretary)", phone: "94964 75272", description: "Sattva College Union General Secretary", order: 21, active: true },
      { category: "College Union", name: "Mina Younus (UUC)", phone: "85475 36746", description: "University Union Councillor (UUC)", order: 22, active: true },
      { category: "Men's Hostel", name: "Muhammed Nishad (MH 1 Secretary)", phone: "85903 97925", description: "Men's Hostel 1 Secretary", order: 30, active: true },
      { category: "Men's Hostel", name: "Jazeel (MH 2 Secretary)", phone: "81369 94226", description: "Men's Hostel 2 Secretary", order: 31, active: true },
      { category: "Men's Hostel", name: "Ralchim (MH 3 Secretary)", phone: "93492 79201", description: "Men's Hostel 3 Secretary", order: 32, active: true },
      { category: "Men's Hostel", name: "Dr. Jamshad (Warden)", phone: "98468 35786", description: "Men's Hostel Warden", order: 33, active: true },
      { category: "Men's Hostel", name: "Dr. Alan (Assistant Warden)", phone: "94962 19851", description: "Men's Hostel Assistant Warden", order: 34, active: true },
      { category: "Ladies' Hostel", name: "Adithya P (LH 1 Secretary)", phone: "90480 32076", description: "Ladies' Hostel 1 Secretary", order: 40, active: true },
      { category: "Ladies' Hostel", name: "Anjana Rajesh (LH 2 Secretary)", phone: "70342 73129", description: "Ladies' Hostel 2 Secretary", order: 41, active: true },
      { category: "Ladies' Hostel", name: "Dr. Rani Raphael (Warden)", phone: "94463 39030", description: "Ladies' Hostel Warden", order: 42, active: true },
      { category: "Ladies' Hostel", name: "Dr. Mekha (Assistant Warden)", phone: "97459 05537", description: "Ladies' Hostel Assistant Warden", order: 43, active: true },
      { category: "Police Station", name: "Punnapra Police Station", phone: "0477 2287669", description: "Jurisdiction police station for Vandanam / TDMC Campus", order: 50, active: true },
      { category: "Auto-Drivers (Night)", name: "Mr. Saleem (Night Auto)", phone: "98951 55452", description: "Night auto driver service for campus & hospital", order: 60, active: true },
      { category: "Auto-Drivers (Night)", name: "Mr. Jabbar (Night Auto)", phone: "80860 92812", description: "Night auto driver service for campus & hospital", order: 61, active: true },
      { category: "College Watchmen", name: "Mr. Krishnakumar (Watchman)", phone: "99466 41956", description: "College security watchman", order: 70, active: true },
      { category: "College Watchmen", name: "Mr. Satheesh (Watchman)", phone: "91422 29998", description: "College security watchman", order: 71, active: true },
      { category: "College Watchmen", name: "Mr. Sebastian (Watchman)", phone: "96455 33771", description: "College security watchman", order: 72, active: true },
      { category: "College Watchmen", name: "Mr. Anandu (Watchman)", phone: "98463 81767", description: "College security watchman", order: 73, active: true },
      { category: "College Watchmen", name: "Mr. Harikrishnan (Watchman)", phone: "80787 88043", description: "College security watchman", order: 74, active: true },
      { category: "College Watchmen", name: "Mr. Renjith (Watchman)", phone: "62829 97904", description: "College security watchman", order: 75, active: true },
      { category: "College Watchmen", name: "Mr. Sujith (Watchman)", phone: "90741 94761", description: "College security watchman", order: 76, active: true },
      { category: "College Watchmen", name: "Mr. Saran (Watchman)", phone: "79946 68518", description: "College security watchman", order: 77, active: true },
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

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const EMERGENCY_CONTACTS = [
  // --- Category: Emergency Services (National & State) ---
  {
    category: "Emergency Services",
    name: "National Emergency Number",
    phone: "112",
    description: "All-in-one national emergency helpline",
    order: 1,
    active: true,
    showOnHomepage: true,
  },
  {
    category: "Emergency Services",
    name: "Police Helpline",
    phone: "100",
    description: "Police control room",
    order: 2,
    active: true,
    showOnHomepage: true,
  },
  {
    category: "Emergency Services",
    name: "Fire Force",
    phone: "101",
    description: "Fire and rescue control room",
    order: 3,
    active: true,
    showOnHomepage: true,
  },
  {
    category: "Emergency Services",
    name: "Ambulance / Disaster Management",
    phone: "102, 108",
    description: "Emergency medical transport & disaster response",
    order: 4,
    active: true,
    showOnHomepage: true,
  },
  {
    category: "Emergency Services",
    name: "Woman Helpline",
    phone: "1091",
    description: "24x7 women safety and emergency helpline",
    order: 5,
    active: true,
    showOnHomepage: true,
  },
  {
    category: "Emergency Services",
    name: "KSEB Electricity",
    phone: "9496010101",
    description: "Kerala State Electricity Board emergency helpline",
    order: 6,
    active: true,
    showOnHomepage: true,
  },

  // --- Category: College & Hospital ---
  {
    category: "College & Hospital",
    name: "College Contact Number",
    phone: "0477 2282611",
    description: "Govt T.D. Medical College Alappuzha official office",
    order: 10,
    active: true,
  },
  {
    category: "College & Hospital",
    name: "Hospital Help Desk",
    phone: "0477 2282367",
    description: "T.D. Medical College Hospital help desk & reception",
    order: 11,
    active: true,
  },
  {
    category: "College & Hospital",
    name: "Hospital Ambulance",
    phone: "80864 13064",
    description: "T.D. Medical College Hospital 24x7 ambulance",
    order: 12,
    active: true,
  },
  {
    category: "College & Hospital",
    name: "Sergeant (Mr. Abhaya Kumar)",
    phone: "88488 22576",
    description: "Campus security sergeant",
    order: 13,
    active: true,
  },

  // --- Category: College Union ---
  {
    category: "College Union",
    name: "Sann Mariya (Chairperson)",
    phone: "85908 80366",
    description: "Sattva College Union Chairperson",
    order: 20,
    active: true,
  },
  {
    category: "College Union",
    name: "Mahadevan (General Secretary)",
    phone: "94964 75272",
    description: "Sattva College Union General Secretary",
    order: 21,
    active: true,
  },
  {
    category: "College Union",
    name: "Mina Younus (UUC)",
    phone: "85475 36746",
    description: "University Union Councillor (UUC)",
    order: 22,
    active: true,
  },

  // --- Category: Men's Hostel ---
  {
    category: "Men's Hostel",
    name: "Muhammed Nishad (MH 1 Secretary)",
    phone: "85903 97925",
    description: "Men's Hostel 1 Secretary",
    order: 30,
    active: true,
  },
  {
    category: "Men's Hostel",
    name: "Jazeel (MH 2 Secretary)",
    phone: "81369 94226",
    description: "Men's Hostel 2 Secretary",
    order: 31,
    active: true,
  },
  {
    category: "Men's Hostel",
    name: "Ralchim (MH 3 Secretary)",
    phone: "93492 79201",
    description: "Men's Hostel 3 Secretary",
    order: 32,
    active: true,
  },
  {
    category: "Men's Hostel",
    name: "Dr. Jamshad (Warden)",
    phone: "98468 35786",
    description: "Men's Hostel Warden",
    order: 33,
    active: true,
  },
  {
    category: "Men's Hostel",
    name: "Dr. Alan (Assistant Warden)",
    phone: "94962 19851",
    description: "Men's Hostel Assistant Warden",
    order: 34,
    active: true,
  },

  // --- Category: Ladies' Hostel ---
  {
    category: "Ladies' Hostel",
    name: "Adithya P (LH 1 Secretary)",
    phone: "90480 32076",
    description: "Ladies' Hostel 1 Secretary",
    order: 40,
    active: true,
  },
  {
    category: "Ladies' Hostel",
    name: "Anjana Rajesh (LH 2 Secretary)",
    phone: "70342 73129",
    description: "Ladies' Hostel 2 Secretary",
    order: 41,
    active: true,
  },
  {
    category: "Ladies' Hostel",
    name: "Dr. Rani Raphael (Warden)",
    phone: "94463 39030",
    description: "Ladies' Hostel Warden",
    order: 42,
    active: true,
  },
  {
    category: "Ladies' Hostel",
    name: "Dr. Mekha (Assistant Warden)",
    phone: "97459 05537",
    description: "Ladies' Hostel Assistant Warden",
    order: 43,
    active: true,
  },

  // --- Category: Police Station ---
  {
    category: "Police Station",
    name: "Punnapra Police Station",
    phone: "0477 2287669",
    description: "Jurisdiction police station for Vandanam / TDMC Campus",
    order: 50,
    active: true,
  },

  // --- Category: Auto-Drivers (Night) ---
  {
    category: "Auto-Drivers (Night)",
    name: "Mr. Saleem (Night Auto)",
    phone: "98951 55452",
    description: "Night auto driver service for campus & hospital",
    order: 60,
    active: true,
  },
  {
    category: "Auto-Drivers (Night)",
    name: "Mr. Jabbar (Night Auto)",
    phone: "80860 92812",
    description: "Night auto driver service for campus & hospital",
    order: 61,
    active: true,
  },

  // --- Category: College Watchmen ---
  {
    category: "College Watchmen",
    name: "Mr. Krishnakumar (Watchman)",
    phone: "99466 41956",
    description: "College security watchman",
    order: 70,
    active: true,
  },
  {
    category: "College Watchmen",
    name: "Mr. Satheesh (Watchman)",
    phone: "91422 29998",
    description: "College security watchman",
    order: 71,
    active: true,
  },
  {
    category: "College Watchmen",
    name: "Mr. Sebastian (Watchman)",
    phone: "96455 33771",
    description: "College security watchman",
    order: 72,
    active: true,
  },
  {
    category: "College Watchmen",
    name: "Mr. Anandu (Watchman)",
    phone: "98463 81767",
    description: "College security watchman",
    order: 73,
    active: true,
  },
  {
    category: "College Watchmen",
    name: "Mr. Harikrishnan (Watchman)",
    phone: "80787 88043",
    description: "College security watchman",
    order: 74,
    active: true,
  },
  {
    category: "College Watchmen",
    name: "Mr. Renjith (Watchman)",
    phone: "62829 97904",
    description: "College security watchman",
    order: 75,
    active: true,
  },
  {
    category: "College Watchmen",
    name: "Mr. Sujith (Watchman)",
    phone: "90741 94761",
    description: "College security watchman",
    order: 76,
    active: true,
  },
  {
    category: "College Watchmen",
    name: "Mr. Saran (Watchman)",
    phone: "79946 68518",
    description: "College security watchman",
    order: 77,
    active: true,
  },
];

async function main() {
  console.log("🚑 Importing 33 emergency directory contacts from PDF...");

  // Delete existing placeholder contacts to avoid duplicates
  await db.emergencyContact.deleteMany();

  // Create all contacts
  await db.emergencyContact.createMany({
    data: EMERGENCY_CONTACTS,
  });

  const count = await db.emergencyContact.count();
  console.log(`✅ Successfully imported ${count} emergency contacts.`);
}

main()
  .catch((e) => {
    console.error("❌ Error importing emergency contacts:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

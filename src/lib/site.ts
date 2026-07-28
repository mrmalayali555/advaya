/**
 * Site-wide configuration. Values here are defaults; anything the admin
 * can edit is also stored in the DB and overrides these at runtime.
 */
export const SITE = {
  name: "ADVAYA",
  nameMalayalam: "അദ്വയ",
  tagline: "Govt TD Medical College Alappuzha Union",
  description:
    "ADVAYA is the official union of Govt TD Medical College Alappuzha — achievements, events, notifications, and student services in one premium hub.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://advaya.example.com",
  college: "Govt TD Medical College Alappuzha",
  email: "advaya.union@example.com",
  phone: "+91 00000 00000",
  address: "Govt TD Medical College, Vandanam, Alappuzha, Kerala 688005",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.0!2d76.33!3d9.46!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAlappuzha%20Medical%20College!5e0!3m2!1sen!2sin!4v1700000000000",
  socials: {
    instagram: "https://www.instagram.com/tdmcunion26_27/",
    whatsapp: "https://chat.whatsapp.com/HTnGS3oE7cIEzlGg9oloku?mode=gi_t",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
    twitter: "https://twitter.com/",
  },
} as const;

/** Primary public navigation. */
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Interventions", href: "/interventions" },
  { label: "Achievements", href: "/achievements" },
  { label: "Events", href: "/events" },
  { label: "Notifications", href: "/notifications" },
  { label: "Finance", href: "/finance" },
  { label: "Subcommittee", href: "/subcommittee" },
  {
    label: "Academics",
    href: "#",
    children: [
      { label: "UG", href: "/ug" },
      { label: "PG", href: "/pg" },
      { label: "About Union", href: "/about" },
    ],
  },
  { label: "Emergency", href: "/emergency" },
  { label: "Contact", href: "/contact" },
] as const;

/** Quick-link tiles shown on the home page. */
export const QUICK_LINKS = [
  { label: "Interventions", href: "/interventions", icon: "FileText" },
  { label: "Notifications", href: "/notifications", icon: "Bell" },
  { label: "Events", href: "/events", icon: "CalendarDays" },
  { label: "Achievements", href: "/achievements", icon: "Trophy" },
  { label: "Drop Suggestion", href: "/complaints", icon: "MessageSquareWarning" },
  { label: "Finance", href: "/finance", icon: "Wallet" },
  { label: "Emergency", href: "/emergency", icon: "Siren" },
  { label: "Subcommittee", href: "/subcommittee", icon: "Users" },
  { label: "Contact", href: "/contact", icon: "Mail" },
] as const;

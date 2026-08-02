export interface WatchmenShift {
  time: string; // e.g. "6 AM to 2 PM", "2 PM to 10 PM", "10 PM to 6 AM"
  names: string; // e.g. "Mr. KRISHNA KUMAR, Mr. HARIKRISHNAN"
}

export interface WatchmenDaySchedule {
  day: string; // e.g. "Monday"
  shifts: WatchmenShift[];
}

export interface WatchmanContact {
  name: string;
  phone: string;
}

export interface WatchmenScheduleData {
  schedule: WatchmenDaySchedule[];
  contacts: WatchmanContact[];
}

export const DEFAULT_WATCHMEN_SCHEDULE: WatchmenScheduleData = {
  contacts: [
    { name: "Mr. KRISHNAKUMAR", phone: "99466 41956" },
    { name: "Mr. SATHEESH", phone: "91422 29998" },
    { name: "Mr. SEBASTIAN", phone: "96455 33771" },
    { name: "Mr. ANANDU", phone: "98463 81767" },
    { name: "Mr. HARIKRISHNAN", phone: "80787 88043" },
    { name: "Mr. RENJITH", phone: "62829 97904" },
    { name: "Mr. SUJITH", phone: "90741 94761" },
    { name: "Mr. SARAN DAS", phone: "79946 68518" },
    { name: "Mr. BICHU", phone: "" },
  ],
  schedule: [
    {
      day: "Monday",
      shifts: [
        { time: "6 AM to 2 PM", names: "Mr. KRISHNA KUMAR, Mr. HARIKRISHNAN" },
        { time: "2 PM to 10 PM", names: "Mr. SEBASTIAN, Mr. SARAN DAS" },
        { time: "10 PM to 6 AM", names: "Mr. ANANDU, Mr. RENJITH, Mr. SEBASTIAN, Mr. SARAN DAS" },
      ],
    },
    {
      day: "Tuesday",
      shifts: [
        { time: "6 AM to 2 PM", names: "Mr. ANANDU, Mr. RENJITH" },
        { time: "2 PM to 10 PM", names: "Mr. SATHEESH, Mr. HARIKRISHNAN" },
        { time: "10 PM to 6 AM", names: "Mr. KRISHNAKUMAR, Mr. BICHU, Mr. SATHEESH, Mr. HARIKRISHNAN" },
      ],
    },
    {
      day: "Wednesday",
      shifts: [
        { time: "6 AM to 2 PM", names: "Mr. KRISHNA KUMAR, Mr. BICHU" },
        { time: "2 PM to 10 PM", names: "Mr. SEBASTIAN, Mr. SARAN DAS" },
        { time: "10 PM to 6 AM", names: "Mr. SUJITH, Mr. ANANDU, Mr. SEBASTIAN, Mr. SARAN DAS" },
      ],
    },
    {
      day: "Thursday",
      shifts: [
        { time: "6 AM to 2 PM", names: "Mr. SUJITH, Mr. ANANDU" },
        { time: "2 PM to 10 PM", names: "Mr. BICHU, Mr. RENJITH" },
        { time: "10 PM to 6 AM", names: "Mr. HARIKRISHNAN, Mr. RENJITH, Mr. SATHEESH, Mr. BICHU" },
      ],
    },
    {
      day: "Friday",
      shifts: [
        { time: "6 AM to 2 PM", names: "Mr. SATHEESH, Mr. HARIKRISHNAN" },
        { time: "2 PM to 10 PM", names: "Mr. KRISHNA KUMAR" },
        { time: "10 PM to 6 AM", names: "Mr. SUJITH, Mr. KRISHNA KUMAR, Mr. SEBASTIAN" },
      ],
    },
    {
      day: "Saturday",
      shifts: [
        { time: "6 AM to 2 PM", names: "Mr. SUJITH, Mr. SEBASTIAN" },
        { time: "2 PM to 10 PM", names: "Mr. ANANDU, Mr. RENJITH" },
        { time: "10 PM to 6 AM", names: "Mr. SARAN DAS, Mr. ANANDU, Mr. SATHEESH, Mr. RENJITH" },
      ],
    },
    {
      day: "Sunday",
      shifts: [
        { time: "6 AM to 2 PM", names: "Mr. SATHEESH, Mr. SARAN DAS" },
        { time: "2 PM to 10 PM", names: "Mr. SUJITH, Mr. BICHU" },
        { time: "10 PM to 6 AM", names: "Mr. SUJITH, Mr. KRISHNA KUMAR, Mr. BICHU, Mr. HARIKRISHNAN" },
      ],
    },
  ],
};

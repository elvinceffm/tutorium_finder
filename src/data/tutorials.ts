export interface Tutorial {
  id: string;
  courseName: string;
  group: string;
  weekday: string;
  time: string;
  location: string;
  locationUrl: string;
  instructor: string;
  notes: string;
  language?: "de" | "en";
}

export const tutorials: Tutorial[] = [
  {
    id: "1",
    courseName: "Einführung in die Methoden der empirischen Sozialforschung",
    group: "Gruppe 1",
    weekday: "Montag",
    time: "13:15",
    location: "H.003, Seminarraum (2910.EG.003)",
    locationUrl: "https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/pl/ui/$ctx/ris.einzelRaum?raumKey=66720",
    instructor: "",
    notes: "",
    language: "de",
  },
  {
    id: "2",
    courseName: "Einführung in die Methoden der empirischen Sozialforschung",
    group: "Gruppe 2",
    weekday: "Dienstag",
    time: "11:30",
    location: "H.003, Seminarraum (2910.EG.003)",
    locationUrl: "https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/pl/ui/$ctx/ris.einzelRaum?raumKey=66720",
    instructor: "",
    notes: "",
    language: "de",
  },
  {
    id: "3",
    courseName: "Einführung in die Methoden der empirischen Sozialforschung",
    group: "Gruppe 3",
    weekday: "Mittwoch",
    time: "11:30",
    location: "H.003, Seminarraum (2910.EG.003)",
    locationUrl: "https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/pl/ui/$ctx/ris.einzelRaum?raumKey=66720",
    instructor: "",
    notes: "",
    language: "de",
  },
  {
    id: "4",
    courseName: "Einführung in die Politische Theorie",
    group: "Gruppe 1",
    weekday: "Dienstag",
    time: "09:45",
    location: "H.004, CIP-Raum (2910.EG.004)",
    locationUrl: "https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/pl/ui/$ctx/ris.einzelRaum?raumKey=66721",
    instructor: "Stehr, Philipp",
    notes: "",
    language: "de",
  },
  {
    id: "5",
    courseName: "Einführung in die Politische Theorie",
    group: "Gruppe 2",
    weekday: "Dienstag",
    time: "11:30",
    location: "H.004, CIP-Raum (2910.EG.004)",
    locationUrl: "https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/pl/ui/$ctx/ris.einzelRaum?raumKey=66721",
    instructor: "Westphal, Manon",
    notes: "",
    language: "de",
  },
  {
    id: "6",
    courseName: "Fundamentals of Comparative Politics",
    group: "Group 1",
    weekday: "Mittwoch",
    time: "13:15",
    location: "H.004, CIP-Raum (2910.EG.004)",
    locationUrl: "https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/pl/ui/$ctx/ris.einzelRaum?raumKey=66721",
    instructor: "Pradel-Sinasi, Franziska",
    notes: "",
    language: "en",
  },
  {
    id: "7",
    courseName: "Fundamentals of Comparative Politics",
    group: "Group 2",
    weekday: "Donnerstag",
    time: "08:45",
    location: "H.001, Seminarraum (2910.EG.001)",
    locationUrl: "https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/pl/ui/$ctx/ris.einzelRaum?raumKey=66718",
    instructor: "Theocharis, Ioannis",
    notes: "",
    language: "en",
  },
  {
    id: "8",
    courseName: "Fundamentals of Comparative Politics",
    group: "Group 3",
    weekday: "Donnerstag",
    time: "10:30",
    location: "H.001, Seminarraum (2910.EG.001)",
    locationUrl: "https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/pl/ui/$ctx/ris.einzelRaum?raumKey=66718",
    instructor: "Theocharis, Ioannis",
    notes: "",
    language: "en",
  },
  {
    id: "9",
    courseName: "Einführung in das Recht der digitalen Gesellschaft",
    group: "",
    weekday: "Mittwoch",
    time: "15:00",
    location: "H.206, Seminarraum (2910.02.206)",
    locationUrl: "https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/pl/ui/$ctx/ris.einzelRaum?raumKey=66777",
    instructor: "Arnold, Philipp",
    notes: "",
    language: "de",
  },
  {
    id: "10",
    courseName: "Mathematik für PolitikwissenschaftlerInnen",
    group: "",
    weekday: "Freitag",
    time: "09:45",
    location: "1180, Hörsaal ohne exp. Bühne (0501.01.180)",
    locationUrl: "https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/pl/ui/$ctx/ris.einzelRaum?raumKey=8298",
    instructor: "Prenkay, Bardh",
    notes: "",
    language: "de",
  },
];

export const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];

export const getCourseColor = (courseName: string): string => {
  const colors = [
    "bg-calendar-event1",
    "bg-calendar-event2",
    "bg-calendar-event3",
    "bg-calendar-event4",
  ];
  
  // Simple hash function to assign consistent colors to courses
  let hash = 0;
  for (let i = 0; i < courseName.length; i++) {
    hash = courseName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

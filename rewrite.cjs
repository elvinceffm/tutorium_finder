const fs = require('fs');

const fileContent = `export interface Tutorial {
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
  semester: 1 | 2;
  type: "Übung" | "Vorlesung" | "Seminar";
}

export const tutorials: Tutorial[] = [
  { id: "1", courseName: "Einführung in die Methoden der empirischen Sozialforschung", group: "Gruppe 1", weekday: "Montag", time: "13:15", location: "H.003, Seminarraum (2910.EG.003)", locationUrl: "", instructor: "", notes: "", language: "de", semester: 1, type: "Übung" },
  { id: "2", courseName: "Einführung in die Methoden der empirischen Sozialforschung", group: "Gruppe 2", weekday: "Dienstag", time: "11:30", location: "H.003, Seminarraum (2910.EG.003)", locationUrl: "", instructor: "", notes: "", language: "de", semester: 1, type: "Übung" },
  { id: "3", courseName: "Einführung in die Methoden der empirischen Sozialforschung", group: "Gruppe 3", weekday: "Mittwoch", time: "11:30", location: "H.003, Seminarraum (2910.EG.003)", locationUrl: "", instructor: "", notes: "", language: "de", semester: 1, type: "Übung" },
  { id: "4", courseName: "Einführung in die Politische Theorie", group: "Gruppe 1", weekday: "Dienstag", time: "09:45", location: "H.004, CIP-Raum (2910.EG.004)", locationUrl: "", instructor: "Stehr, Philipp", notes: "", language: "de", semester: 1, type: "Übung" },
  { id: "5", courseName: "Einführung in die Politische Theorie", group: "Gruppe 2", weekday: "Dienstag", time: "11:30", location: "H.004, CIP-Raum (2910.EG.004)", locationUrl: "", instructor: "Westphal, Manon", notes: "", language: "de", semester: 1, type: "Übung" },
  { id: "6", courseName: "Fundamentals of Comparative Politics", group: "Group 1", weekday: "Mittwoch", time: "13:15", location: "H.004, CIP-Raum (2910.EG.004)", locationUrl: "", instructor: "Pradel-Sinasi, Franziska", notes: "", language: "en", semester: 1, type: "Übung" },
  { id: "7", courseName: "Fundamentals of Comparative Politics", group: "Group 2", weekday: "Donnerstag", time: "08:45", location: "H.001, Seminarraum (2910.EG.001)", locationUrl: "", instructor: "Theocharis, Ioannis", notes: "", language: "en", semester: 1, type: "Übung" },
  { id: "8", courseName: "Fundamentals of Comparative Politics", group: "Group 3", weekday: "Donnerstag", time: "10:30", location: "H.001, Seminarraum (2910.EG.001)", locationUrl: "", instructor: "Theocharis, Ioannis", notes: "", language: "en", semester: 1, type: "Übung" },
  { id: "9", courseName: "Einführung in das Recht der digitalen Gesellschaft", group: "", weekday: "Mittwoch", time: "15:00", location: "H.206, Seminarraum (2910.02.206)", locationUrl: "", instructor: "Arnold, Philipp", notes: "", language: "de", semester: 1, type: "Vorlesung" },
  { id: "10", courseName: "Mathematik für PolitikwissenschaftlerInnen", group: "", weekday: "Freitag", time: "09:45", location: "1180, Hörsaal ohne exp. Bühne (0501.01.180)", locationUrl: "", instructor: "Prenkay, Bardh", notes: "", language: "de", semester: 1, type: "Übung" },
  
  { id: "201", courseName: "Computer-Assisted Data Analysis (SOT82145)", group: "Standardgruppe", weekday: "Donnerstag", time: "18:30", location: "H.001, Seminarraum (2910.EG.001)", locationUrl: "", instructor: "Ali, Dalia", notes: "", language: "en", semester: 2, type: "Übung" },
  { id: "202", courseName: "Computer-Assisted Data Analysis (SOT82145)", group: "Standardgruppe", weekday: "Donnerstag", time: "16:15", location: "H.001, Seminarraum (2910.EG.001)", locationUrl: "", instructor: "Ali, Dalia", notes: "", language: "en", semester: 2, type: "Seminar" },
  { id: "203", courseName: "Economics II (Macroeconomics)", group: "Group 1", weekday: "Freitag", time: "11:30", location: "Theresianum; 0606, Hörsaal", locationUrl: "", instructor: "", notes: "", language: "en", semester: 2, type: "Übung" },
  { id: "204", courseName: "Economics II (Macroeconomics)", group: "Group 2", weekday: "Donnerstag", time: "15:00", location: "1100, Hörsaal", locationUrl: "", instructor: "", notes: "", language: "en", semester: 2, type: "Übung" },
  { id: "205", courseName: "Economics II (Macroeconomics)", group: "Group 3", weekday: "Dienstag", time: "09:45", location: "2750, Karl Max von Bauernfeind Hörsaal", locationUrl: "", instructor: "", notes: "", language: "en", semester: 2, type: "Übung" },
  { id: "206", courseName: "Economics II (Macroeconomics)", group: "Group 4", weekday: "Donnerstag", time: "09:45", location: "N 1070 ZG, Lothar-Rohde-Hörsaal", locationUrl: "", instructor: "", notes: "", language: "en", semester: 2, type: "Übung" },
  { id: "207", courseName: "Economics II (Macroeconomics)", group: "Group 5", weekday: "Montag", time: "15:00", location: "1100, Hörsaal", locationUrl: "", instructor: "", notes: "", language: "en", semester: 2, type: "Übung" },
  { id: "208", courseName: "Economics II (Macroeconomics)", group: "Group 6", weekday: "Freitag", time: "09:45", location: "0670ZG, Hör-Lehrsaal", locationUrl: "", instructor: "", notes: "", language: "en", semester: 2, type: "Übung" },
  { id: "209", courseName: "Economics II (Macroeconomics)", group: "Standardgruppe", weekday: "Mittwoch", time: "09:45", location: "0880, Audimax", locationUrl: "", instructor: "Hottenrott, Hanna", notes: "", language: "en", semester: 2, type: "Vorlesung" },
  { id: "210", courseName: "Politische Theorie - Aufbau (POL10400)", group: "Seminar 1", weekday: "Montag", time: "16:45", location: "H.001, Seminarraum (2910.EG.001)", locationUrl: "", instructor: "Stehr, P.; Westphal, M.", notes: "", language: "de", semester: 2, type: "Seminar" },
  { id: "211", courseName: "Politische Theorie - Aufbau (POL10400)", group: "Seminar 2", weekday: "Dienstag", time: "09:45", location: "H.003, Seminarraum (2910.EG.003)", locationUrl: "", instructor: "Westphal, Manon", notes: "", language: "de", semester: 2, type: "Seminar" },
  { id: "212", courseName: "Politische Theorie - Aufbau (POL10400)", group: "Seminar 3", weekday: "Dienstag", time: "11:30", location: "H.103, CIP-Raum", locationUrl: "", instructor: "Stehr, P.; Westphal, M.", notes: "", language: "de", semester: 2, type: "Seminar" },
  { id: "213", courseName: "Internationale Beziehungen - Grundlagen", group: "Gruppe 1", weekday: "Mittwoch", time: "11:30", location: "H.003, Seminarraum (2910.EG.003)", locationUrl: "", instructor: "Ullmann, Andreas", notes: "", language: "de", semester: 2, type: "Übung" },
  { id: "214", courseName: "Internationale Beziehungen - Grundlagen", group: "Gruppe 2", weekday: "Mittwoch", time: "13:15", location: "H.003, Seminarraum (2910.EG.003)", locationUrl: "", instructor: "Baydag, Rena Melis", notes: "", language: "de", semester: 2, type: "Übung" },
  { id: "215", courseName: "Internationale Beziehungen - Grundlagen", group: "Gruppe 3", weekday: "Mittwoch", time: "16:45", location: "H.003, Seminarraum (2910.EG.003)", locationUrl: "", instructor: "Ullmann, Andreas", notes: "", language: "de", semester: 2, type: "Übung" },
  { id: "216", courseName: "Internationale Beziehungen - Grundlagen", group: "Gruppe 4", weekday: "Donnerstag", time: "13:15", location: "H.003, Seminarraum (2910.EG.003)", locationUrl: "", instructor: "Ullmann, Andreas", notes: "", language: "de", semester: 2, type: "Übung" },
  { id: "217", courseName: "Internationale Beziehungen - Grundlagen", group: "Standardgruppe", weekday: "Dienstag", time: "13:15", location: "0360, Theodor-Fischer-Hörsaal", locationUrl: "", instructor: "da Conceicao-Heldt; Ullmann", notes: "", language: "de", semester: 2, type: "Vorlesung" },
  { id: "218", courseName: "Politikfeldanalyse - Grundlagen", group: "Gruppe 1", weekday: "Dienstag", time: "15:00", location: "H.001, Seminarraum (2910.EG.001)", locationUrl: "", instructor: "Klotz, Thomas", notes: "", language: "de", semester: 2, type: "Übung" },
  { id: "219", courseName: "Politikfeldanalyse - Grundlagen", group: "Gruppe 2", weekday: "Dienstag", time: "16:45", location: "H.001, Seminarraum (2910.EG.001)", locationUrl: "", instructor: "Klotz, Thomas", notes: "", language: "de", semester: 2, type: "Übung" },
  { id: "220", courseName: "Politikfeldanalyse - Grundlagen", group: "Standardgruppe", weekday: "Montag", time: "11:30", location: "2750, Karl Max von Bauernfeind Hörsaal", locationUrl: "", instructor: "Wurster, Stefan", notes: "", language: "de", semester: 2, type: "Vorlesung" },
];

export const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];

export const getCourseColor = (courseName: string): string => {
  const colors = [
    "bg-calendar-event1",
    "bg-calendar-event2",
    "bg-calendar-event3",
    "bg-calendar-event4",
    "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100",
    "bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100",
  ];
  
  let hash = 0;
  for (let i = 0; i < courseName.length; i++) {
    hash = courseName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};
`;

fs.writeFileSync('src/data/tutorials.ts', fileContent);

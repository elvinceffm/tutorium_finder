const fs = require('fs');

function updateOverview() {
  const file = 'src/components/TutorialOverview.tsx';
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(
    'export const TutorialOverview = () => {',
    'export const TutorialOverview = ({ selectedSemester }: { selectedSemester: number }) => {'
  );
  
  content = content.replace(
    'return Array.from(new Set(tutorials.map((t) => t.courseName))).sort();',
    'return Array.from(new Set(tutorials.filter(t => t.semester === selectedSemester).map((t) => t.courseName))).sort();'
  );
  
  content = content.replace(
    'return tutorials.filter((tutorial) => {',
    'return tutorials.filter((tutorial) => {\n      if (tutorial.semester !== selectedSemester) return false;'
  );
  
  content = content.replace(
    '[searchQuery, selectedWeekday, selectedCourse]);',
    '[searchQuery, selectedWeekday, selectedCourse, selectedSemester]);'
  );
  
  fs.writeFileSync(file, content);
}

function updateCalendar() {
  const file = 'src/components/WeekCalendar.tsx';
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(
    'import { MapPin, User } from "lucide-react";',
    'import { MapPin, User, BookOpen } from "lucide-react";'
  );
  
  content = content.replace(
    'export const WeekCalendar = () => {',
    'export const WeekCalendar = ({ selectedSemester }: { selectedSemester: number }) => {'
  );
  
  content = content.replace(
    'return tutorials.filter((t) => t.weekday === day);',
    'return tutorials.filter((t) => t.weekday === day && t.semester === selectedSemester);'
  );
  
  content = content.replace(
    '{/* Course name - single line, readable */}',
    `{/* Course name - single line, readable */}
                          {tutorial.type === "Vorlesung" && (
                            <div className="absolute top-0 right-0 bg-primary/20 backdrop-blur-md rounded-bl-lg px-1 py-0.5">
                              <BookOpen className="w-3 h-3" />
                            </div>
                          )}`
  );
  
  content = content.replace(
    '<div className="font-semibold truncate">',
    `<div className="font-semibold truncate">
                              {tutorial.type === "Vorlesung" ? "📚 Vorlesung: " : ""}`
  );
  
  // also add visual ring if vorlesung
  content = content.replace(
    'className={`absolute left-1 right-1 ${colorClass}',
    'className={`absolute left-1 right-1 ${tutorial.type === "Vorlesung" ? "ring-2 ring-white/50 border border-white/20" : ""} ${colorClass}'
  );
  
  fs.writeFileSync(file, content);
}

updateOverview();
updateCalendar();

import { useState, useMemo } from "react";
import { TutorialCard } from "./TutorialCard";
import { TutorialFilters } from "./TutorialFilters";
import { tutorials } from "@/data/tutorials";

export const TutorialOverview = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWeekday, setSelectedWeekday] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");

  const availableCourses = useMemo(() => {
    return Array.from(new Set(tutorials.map((t) => t.courseName))).sort();
  }, []);

  const filteredTutorials = useMemo(() => {
    return tutorials.filter((tutorial) => {
      const matchesSearch =
        searchQuery === "" ||
        tutorial.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutorial.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutorial.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesWeekday =
        selectedWeekday === "all" || tutorial.weekday === selectedWeekday;

      const matchesCourse =
        selectedCourse === "all" || tutorial.courseName === selectedCourse;

      return matchesSearch && matchesWeekday && matchesCourse;
    });
  }, [searchQuery, selectedWeekday, selectedCourse]);

  return (
    <div className="animate-in fade-in duration-500">
      <TutorialFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedWeekday={selectedWeekday}
        setSelectedWeekday={setSelectedWeekday}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        availableCourses={availableCourses}
      />

      {filteredTutorials.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Keine Tutorien gefunden. Versuche andere Suchkriterien.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {filteredTutorials.length} {filteredTutorials.length === 1 ? "Tutorium" : "Tutorien"} gefunden
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

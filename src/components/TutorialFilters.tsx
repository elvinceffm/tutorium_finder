import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { weekdays } from "@/data/tutorials";

interface TutorialFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedWeekday: string;
  setSelectedWeekday: (weekday: string) => void;
  selectedCourse: string;
  setSelectedCourse: (course: string) => void;
  availableCourses: string[];
}

export const TutorialFilters = ({
  searchQuery,
  setSearchQuery,
  selectedWeekday,
  setSelectedWeekday,
  selectedCourse,
  setSelectedCourse,
  availableCourses,
}: TutorialFiltersProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Suche nach Kurs, Dozent oder Raum..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Select value={selectedWeekday} onValueChange={setSelectedWeekday}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Alle Wochentage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Wochentage</SelectItem>
              {weekdays.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Alle Kurse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Kurse</SelectItem>
              {availableCourses.map((course) => (
                <SelectItem key={course} value={course}>
                  {course.length > 40 ? course.substring(0, 40) + "..." : course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

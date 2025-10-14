import { useMemo } from "react";
import { tutorials, weekdays, getCourseColor } from "@/data/tutorials";
import { Card } from "@/components/ui/card";
import { MapPin, User } from "lucide-react";

export const WeekCalendar = () => {
  // Generate time slots from 8:00 to 18:00
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return slots;
  }, []);

  const getPositionForTime = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    const startMinutes = 8 * 60; // 8:00 AM
    return ((totalMinutes - startMinutes) / 60) * 80; // 80px per hour
  };

  const getTutorialsForDay = (day: string) => {
    return tutorials.filter((t) => t.weekday === day);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <div className="min-w-[800px]">
            {/* Header with weekdays */}
            <div className="grid grid-cols-6 border-b bg-muted/30">
              <div className="p-4 border-r text-sm font-medium text-muted-foreground">
                Zeit
              </div>
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="p-4 text-center font-semibold border-r last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-6 relative">
              {/* Time column */}
              <div className="border-r bg-muted/10">
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="h-20 border-b px-2 py-1 text-xs text-muted-foreground font-medium"
                  >
                    {time}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="relative border-r last:border-r-0 bg-calendar-bg"
                >
                  {/* Hour lines */}
                  {timeSlots.map((_, index) => (
                    <div
                      key={index}
                      className="h-20 border-b border-calendar-hourLine"
                    />
                  ))}

                  {/* Tutorial blocks */}
                  <div className="absolute inset-0">
                    {getTutorialsForDay(day).map((tutorial) => {
                      const top = getPositionForTime(tutorial.time);
                      const colorClass = getCourseColor(tutorial.courseName);

                      return (
                        <div
                          key={tutorial.id}
                          className={`absolute left-1 right-1 ${colorClass} text-white rounded-md p-2 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer overflow-hidden group`}
                          style={{
                            top: `${top}px`,
                            height: "72px", // ~1.5 hour blocks
                          }}
                        >
                          {/* Course name - single line, readable */}
                          <div className="text-xs font-semibold leading-tight truncate mb-1">
                            {tutorial.courseName}
                          </div>
                          
                          {/* Compact info row */}
                          <div className="flex items-center justify-between gap-2 text-[11px] opacity-95">
                            {/* Left: group (if any) */}
                            <div className="min-w-0 truncate">
                              {tutorial.group && (
                                <span className="truncate">{tutorial.group}</span>
                              )}
                            </div>
                            
                            {/* Right: location (icon + short code) clickable */}
                            <a
                              href={tutorial.locationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 inline-flex items-center gap-1 hover:underline"
                              title={tutorial.location}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MapPin className="w-3 h-3" />
                              <span className="hidden sm:inline truncate max-w-[90px]">
                                {tutorial.location.split(",")[0]}
                              </span>
                            </a>
                          </div>
                          
                          {/* Tooltip on hover - concise + clear link */}
                          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-md flex flex-col justify-center text-xs gap-1">
                            <div className="font-semibold truncate">
                              {tutorial.courseName}
                            </div>
                            <div className="font-medium">
                              {tutorial.time} Uhr
                            </div>
                            {tutorial.group && (
                              <div className="truncate">{tutorial.group}</div>
                            )}
                            {tutorial.instructor && (
                              <div className="truncate">{tutorial.instructor}</div>
                            )}
                            <a
                              href={tutorial.locationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center gap-1 underline underline-offset-2 hover:text-accent"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MapPin className="w-3 h-3" />
                              {tutorial.location}
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

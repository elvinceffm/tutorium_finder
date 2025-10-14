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
                          <div className="text-xs font-semibold mb-1 line-clamp-2">
                            {tutorial.courseName}
                          </div>
                          {tutorial.group && (
                            <div className="text-xs opacity-90 mb-1">
                              {tutorial.group}
                            </div>
                          )}
                          <div className="text-xs opacity-90 flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">
                              {tutorial.location.split(",")[0]}
                            </span>
                          </div>
                          {tutorial.instructor && (
                            <div className="text-xs opacity-90 flex items-center gap-1 mt-1">
                              <User className="w-3 h-3 shrink-0" />
                              <span className="truncate">
                                {tutorial.instructor}
                              </span>
                            </div>
                          )}
                          
                          {/* Tooltip on hover */}
                          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-md flex flex-col justify-center text-xs">
                            <div className="font-semibold mb-1">
                              {tutorial.time} Uhr
                            </div>
                            <a
                              href={tutorial.locationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-accent"
                              onClick={(e) => e.stopPropagation()}
                            >
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

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
                          className={`absolute left-1 right-1 ${colorClass} text-white rounded-md p-1.5 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer overflow-hidden group`}
                          style={{
                            top: `${top}px`,
                            height: "72px", // ~1.5 hour blocks
                          }}
                        >
                          {/* Course name - full width */}
                          <div className="text-[10px] font-semibold leading-tight line-clamp-1 mb-1">
                            {tutorial.courseName}
                          </div>
                          
                          {/* Two column layout for remaining info */}
                          <div className="flex gap-1 text-[9px] opacity-90">
                            {/* Left column */}
                            <div className="flex-1 min-w-0">
                              {tutorial.group && (
                                <div className="truncate font-medium">{tutorial.group}</div>
                              )}
                              {tutorial.instructor && (
                                <div className="truncate mt-0.5">{tutorial.instructor}</div>
                              )}
                            </div>
                            
                            {/* Right column - location icon only */}
                            <div className="flex items-start">
                              <MapPin className="w-3 h-3 shrink-0" />
                            </div>
                          </div>
                          
                          {/* Tooltip on hover */}
                          <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-md flex flex-col justify-center text-xs">
                            <div className="font-semibold mb-1">
                              {tutorial.courseName}
                            </div>
                            <div className="font-medium mb-1">
                              {tutorial.time} Uhr
                            </div>
                            {tutorial.group && (
                              <div className="mb-1">{tutorial.group}</div>
                            )}
                            {tutorial.instructor && (
                              <div className="mb-1">{tutorial.instructor}</div>
                            )}
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

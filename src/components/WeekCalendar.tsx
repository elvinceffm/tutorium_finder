import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { tutorials, weekdays, getCourseColor } from "@/data/tutorials";
import { Card } from "@/components/ui/card";
import { MapPin, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

// Utility to calculate overlap groups
const calculateOverlaps = (events: any[]) => {
  if (!events || events.length === 0) return [];
  
  const parsedEvents = events.map(event => {
    const [hours, minutes] = event.time.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + 90;
    return { ...event, startMinutes, endMinutes };
  }).sort((a, b) => a.startMinutes - b.startMinutes);

  let clusters: any[][] = [];
  let currentCluster: any[] = [];
  let clusterEnd = 0;

  parsedEvents.forEach(event => {
    if (currentCluster.length > 0 && event.startMinutes >= clusterEnd) {
      clusters.push(currentCluster);
      currentCluster = [];
      clusterEnd = 0;
    }
    currentCluster.push(event);
    if (event.endMinutes > clusterEnd) {
      clusterEnd = event.endMinutes;
    }
  });
  if (currentCluster.length > 0) {
    clusters.push(currentCluster);
  }

  clusters.forEach(cluster => {
    let columns: any[][] = [];
    cluster.forEach(event => {
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        const colLastEvent = columns[i][columns[i].length - 1];
        if (colLastEvent.endMinutes <= event.startMinutes) {
          columns[i].push(event);
          event.col = i;
          placed = true;
          break;
        }
      }
      if (!placed) {
        event.col = columns.length;
        columns.push([event]);
      }
    });
    cluster.forEach(event => {
      event.maxCol = columns.length;
    });
  });
  
  return parsedEvents;
};

export const WeekCalendar = ({ selectedSemester, aiPlanIds }: { selectedSemester: number, aiPlanIds?: string[] | null }) => {
  const [activeMobileDay, setActiveMobileDay] = useState("Montag");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const defaultDays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    const todayIndex = new Date().getDay();
    let todayName = defaultDays[todayIndex];
    if (todayIndex === 0 || todayIndex === 6) {
      todayName = "Montag";
    }
    setActiveMobileDay(todayName);

    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(hour.toString().padStart(2, "0") + ":00");
    }
    return slots;
  }, []);

  const getPositionForTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    const startMinutes = 8 * 60;
    return ((totalMinutes - startMinutes) / 60) * 80;
  };

  const getTutorialsForDay = (day) => {
    const dayTutorials = tutorials.filter((t) => 
      t.weekday === day && 
      t.semester === selectedSemester &&
      (!aiPlanIds || aiPlanIds.includes(t.id))
    );
    return calculateOverlaps(dayTutorials);
  };

  const daysToShow = isMobile ? [activeMobileDay] : weekdays;
  
  const handlePrevDay = () => {
    const idx = weekdays.indexOf(activeMobileDay);
    if (idx > 0) setActiveMobileDay(weekdays[idx - 1]);
  };
  
  const handleNextDay = () => {
    const idx = weekdays.indexOf(activeMobileDay);
    if (idx < weekdays.length - 1) setActiveMobileDay(weekdays[idx + 1]);
  };

  return (
    <div className="animate-in fade-in duration-500">
      
      {isMobile && (
        <div className="flex items-center justify-between mb-4 bg-card rounded-lg p-2 border shadow-sm">
          <Button variant="ghost" size="icon" onClick={handlePrevDay} disabled={activeMobileDay === weekdays[0]}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="font-semibold text-lg">{activeMobileDay}</div>
          <Button variant="ghost" size="icon" onClick={handleNextDay} disabled={activeMobileDay === weekdays[weekdays.length - 1]}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}

      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <div className={"min-w-full " + (!isMobile ? "lg:min-w-[800px]" : "")}>
            <div className={"grid border-b bg-muted/30 " + (isMobile ? "grid-cols-[60px_1fr]" : "grid-cols-[60px_repeat(5,1fr)]")}>
              <div className="p-2 lg:p-4 border-r text-xs lg:text-sm font-medium text-muted-foreground flex items-center justify-center">
                Zeit
              </div>
              {daysToShow.map((day) => (
                <div key={day} className="p-2 lg:p-4 text-center text-sm lg:text-base font-semibold border-r last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            <div className={"grid relative " + (isMobile ? "grid-cols-[60px_1fr]" : "grid-cols-[60px_repeat(5,1fr)]")}>
              <div className="border-r bg-muted/10">
                {timeSlots.map((time) => (
                  <div key={time} className="h-20 border-b px-1 lg:px-2 py-1 text-[10px] lg:text-xs text-muted-foreground font-medium flex justify-center">
                    {time}
                  </div>
                ))}
              </div>

              {daysToShow.map((day) => (
                <div key={day} className="relative border-r last:border-r-0 bg-calendar-bg">
                  {timeSlots.map((_, index) => (
                    <div key={index} className="h-20 border-b border-calendar-hourLine" />
                  ))}

                  <div className="absolute inset-0">
                    {getTutorialsForDay(day).map((tutorial) => {
                      const top = getPositionForTime(tutorial.time);
                      const colorClass = getCourseColor(tutorial.courseName);
                      
                      const width = "calc(" + (100 / tutorial.maxCol) + "% - 4px)";
                      const left = "calc(" + ((100 / tutorial.maxCol) * tutorial.col) + "% + 2px)";
                      const endTimeStr = Math.floor(tutorial.endMinutes / 60).toString().padStart(2, "0") + ":" + (tutorial.endMinutes % 60).toString().padStart(2, "0");

                      return (
                        <div key={tutorial.id} className={"absolute " + (tutorial.type === "Vorlesung" ? "ring-2 ring-white/50 border border-white/20 " : "") + colorClass + " text-white rounded-md p-1.5 lg:p-2 shadow-md hover:shadow-xl transition-all duration-200 z-10 hover:z-50 cursor-pointer overflow-hidden group flex flex-col"} style={{ top: top + "px", height: "120px", width: width, left: left }}>
                          {tutorial.type === "Vorlesung" && (
                            <div className="absolute top-0 right-0 bg-primary/20 backdrop-blur-md rounded-bl-lg px-0.5 py-0.5 z-0">
                              <BookOpen className="w-3 h-3" />
                            </div>
                          )}
                          <div className="text-[10px] lg:text-xs font-semibold leading-tight line-clamp-2 lg:truncate mb-0.5 lg:mb-1 relative z-10 pr-3">
                            {tutorial.courseName}
                          </div>
                          
                          <div className="flex items-center justify-between gap-1 text-[9px] lg:text-[11px] opacity-95 relative z-10 mt-auto">
                            <div className="min-w-0 truncate hidden sm:block">
                              {tutorial.group && <span className="truncate">{tutorial.group}</span>}
                            </div>
                            
                            <a href={tutorial.locationUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex items-center gap-0.5 hover:underline bg-black/10 px-1 py-0.5 rounded pointer-events-auto" title={tutorial.location} onClick={(e) => e.stopPropagation()}>
                              <MapPin className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                              <span className="truncate max-w-[50px] lg:max-w-[70px]">
                                {tutorial.location.split(",")[0]}
                              </span>
                            </a>
                          </div>
                          
                          <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-md flex-col justify-center text-xs gap-1 hidden lg:flex z-20">
                            <div className="font-semibold line-clamp-2">
                              {tutorial.type === "Vorlesung" ? "📚 Vorlesung: " : ""}
                              {tutorial.courseName}
                            </div>
                            <div className="font-medium text-blue-200">
                              {tutorial.time} - {endTimeStr} Uhr
                            </div>
                            {tutorial.group && <div className="truncate text-gray-300">{tutorial.group}</div>}
                            {tutorial.instructor && <div className="truncate">{tutorial.instructor}</div>}
                            <a href={tutorial.locationUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 underline underline-offset-2 hover:text-blue-300 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="line-clamp-2">{tutorial.location}</span>
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

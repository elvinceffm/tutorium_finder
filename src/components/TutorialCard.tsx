import { Clock, MapPin, User, Languages, BookOpen, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tutorial, getCourseColor } from "@/data/tutorials";

interface TutorialCardProps {
  tutorial: Tutorial;
}

export const TutorialCard = ({ tutorial }: TutorialCardProps) => {
  const colorClass = getCourseColor(tutorial.courseName);
  
  return (
    <Card className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden ${tutorial.type === "Vorlesung" ? "border-primary/50 ring-1 ring-primary/20" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
            {tutorial.courseName}
          </CardTitle>
          <div className="flex flex-col gap-1 shrink-0 items-end z-10">
            {tutorial.language && (
              <Badge variant="outline" className="shrink-0 w-fit">
                <Languages className="w-3 h-3 mr-1" />
                {tutorial.language.toUpperCase()}
              </Badge>
            )}
            <Badge variant={tutorial.type === "Vorlesung" ? "default" : "secondary"} className="shrink-0 w-fit">
              {tutorial.type === "Vorlesung" ? <BookOpen className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
              {tutorial.type}
            </Badge>
          </div>
        </div>
        {tutorial.group && (
          <Badge className={`w-fit mt-2 ${colorClass} text-white`}>
            {tutorial.group}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="font-medium">{tutorial.weekday}</span>
          <span className="text-muted-foreground">um {tutorial.time} Uhr</span>
        </div>
        
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <a
            href={tutorial.locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline hover:text-primary-hover transition-colors"
          >
            {tutorial.location}
          </a>
        </div>
        
        {tutorial.instructor && (
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>{tutorial.instructor}</span>
          </div>
        )}
        
        {tutorial.notes && (
          <p className="text-sm text-muted-foreground italic mt-2">
            {tutorial.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

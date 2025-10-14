import { Clock, MapPin, User, Languages } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tutorial, getCourseColor } from "@/data/tutorials";

interface TutorialCardProps {
  tutorial: Tutorial;
}

export const TutorialCard = ({ tutorial }: TutorialCardProps) => {
  const colorClass = getCourseColor(tutorial.courseName);
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
            {tutorial.courseName}
          </CardTitle>
          {tutorial.language && (
            <Badge variant="outline" className="shrink-0">
              <Languages className="w-3 h-3 mr-1" />
              {tutorial.language.toUpperCase()}
            </Badge>
          )}
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

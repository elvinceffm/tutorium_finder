import { useState } from "react";
import { Calendar, List, GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TutorialOverview } from "@/components/TutorialOverview";
import { WeekCalendar } from "@/components/WeekCalendar";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSemester, setSelectedSemester] = useState<number>(2);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                  TUM Politik-Tutorien
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Finde dein passendes Tutorium
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col items-center mb-8 gap-4">
          <div className="bg-muted/50 p-1 rounded-full inline-flex relative items-center ring-1 ring-border/50">
            <div 
              className="absolute bg-background rounded-full shadow-sm transition-transform duration-300 h-9 w-[140px]"
              style={{ transform: `translateX(${selectedSemester === 1 ? '0%' : '100%'})` }}
            />
            <button 
              onClick={() => setSelectedSemester(1)}
              className={`relative z-10 w-[140px] h-9 text-sm font-medium transition-colors ${selectedSemester === 1 ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              WiSe 25/26
            </button>
            <button 
              onClick={() => setSelectedSemester(2)}
              className={`relative z-10 w-[140px] h-9 text-sm font-medium transition-colors ${selectedSemester === 2 ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              SoSe 2026
            </button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Übersicht
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Kalender
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <TutorialOverview selectedSemester={selectedSemester} />
          </TabsContent>

          <TabsContent value="calendar">
            <WeekCalendar selectedSemester={selectedSemester} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 bg-card/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} TUM Politik-Tutorien Navigator
          </p>
          <p className="mt-2">
            Alle Angaben ohne Gewähr. Bitte überprüfe die Termine in TUMonline.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

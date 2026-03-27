import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AiPreferencePayload, AiPlan, AiPlanResponse } from '@/types/ai';
import { Cpu, Loader2, Sparkles, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { tutorials } from '@/data/tutorials';

const loadingMemes = [
  "Prompting 70 billion parameters for a 3-day weekend...",
  "Synthesizing constraints via multi-head attention...",
  "Optimizing schedule logic to minimize early mornings...",
  "Aligning vectors to avoid 8 AM lectures...",
  "Reticulating academic splines...",
  "Solving NP-Hard scheduling... poorly, but fast...",
  "Deducing optimal nap intervals..."
];

interface AiScheduleWizardProps {
  semester: number;
  onPlanGenerated: (plan: AiPlan) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const AiScheduleWizard = ({ semester, onPlanGenerated, isOpen, setIsOpen }: AiScheduleWizardProps) => {
  const [step, setStep] = useState<'form' | 'loading' | 'review'>('form');
  const [optimizationGoal, setOptimizationGoal] = useState<'compact' | 'balanced'>('compact');
  const [timePreference, setTimePreference] = useState<'morning' | 'afternoon' | 'any'>('any');
  const [seminarPreference, setSeminarPreference] = useState('');
  const [freeformText, setFreeformText] = useState('');
  
  const [generatedPlans, setGeneratedPlans] = useState<AiPlan[]>([]);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'loading') {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingMemes.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleGenerate = async () => {
    setStep('loading');
    setLoadingTextIndex(0);
    setGeneratedPlans([]);
    
    // Filter catalog for the selected semester to save tokens
    const relevantCatalog = tutorials.filter(t => t.semester === semester);
    
    const payload: AiPreferencePayload = {
      semester,
      optimizationGoal,
      timePreference,
      seminarPreference,
      freeformText,
      catalog: relevantCatalog
    };

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate plan');
      }
      
      const data: AiPlanResponse = await response.json();
      if (data.plans && data.plans.length > 0) {
        // Enforce valid unique generated IDs
        const verifiedPlans = data.plans.map((p, i) => ({
          ...p,
          id: p.id || `plan-${i}-${Date.now()}`
        }));
        setGeneratedPlans(verifiedPlans);
        setCurrentPlanIndex(0);
        setStep('review');
      } else {
        throw new Error('No plans generated');
      }
    } catch (error: any) {
      console.error(error);
      alert(\`Error generating schedule: \${error.message}\`);
      setStep('form');
    }
  };

  const handleAccept = () => {
    if (generatedPlans.length > 0) {
      onPlanGenerated(generatedPlans[currentPlanIndex]);
      setIsOpen(false);
      // reset state for next time
      setTimeout(() => setStep('form'), 500);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            AI Schedule Optimizer
          </DialogTitle>
          <DialogDescription>
            Let advanced LP constraint logic (and a 70B LLM) figure out your semester.
          </DialogDescription>
        </DialogHeader>

        {step === 'form' && (
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label>Schedule Density</Label>
              <ToggleGroup 
                type="single" 
                value={optimizationGoal} 
                onValueChange={(v) => v && setOptimizationGoal(v as any)}
                className="justify-start"
              >
                <ToggleGroupItem value="compact" aria-label="Compact">
                  Compact (Max free days)
                </ToggleGroupItem>
                <ToggleGroupItem value="balanced" aria-label="Balanced">
                  Balanced
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-3">
              <Label>Time Preference</Label>
              <ToggleGroup 
                type="single" 
                value={timePreference} 
                onValueChange={(v) => v && setTimePreference(v as any)}
                className="justify-start"
              >
                <ToggleGroupItem value="morning">Morning</ToggleGroupItem>
                <ToggleGroupItem value="afternoon">Afternoon</ToggleGroupItem>
                <ToggleGroupItem value="any">Flexible</ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <div className="space-y-3">
              <Label>Seminar Preferences (e.g. Pol. Theorie, Dalia Ali)</Label>
              <Textarea 
                placeholder="I definitely want the seminar by Dalia Ali, keep that."
                value={seminarPreference}
                onChange={(e) => setSeminarPreference(e.target.value)}
                className="resize-none h-16"
              />
            </div>

            <div className="space-y-3">
              <Label>Strict Context & Constraints</Label>
              <Textarea 
                placeholder="Must have a 2 hour lunch break on Wednesdays. No classes on Friday."
                value={freeformText}
                onChange={(e) => setFreeformText(e.target.value)}
                className="resize-none h-20"
              />
            </div>

            <Button onClick={handleGenerate} className="w-full gap-2">
              <Sparkles className="w-4 h-4" />
              Initialize Generation
            </Button>
          </div>
        )}

        {step === 'loading' && (
          <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="min-h-[40px] flex items-center justify-center">
              <p className="text-muted-foreground animate-pulse text-sm font-medium">
                {loadingMemes[loadingTextIndex]}
              </p>
            </div>
          </div>
        )}

        {step === 'review' && generatedPlans.length > 0 && (
          <div className="space-y-6 py-4">
            <div className="bg-muted p-4 rounded-lg text-sm space-y-2 border border-border">
              <h4 className="font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" /> Model Reasoning
              </h4>
              <p>{generatedPlans[currentPlanIndex].reasoning}</p>
            </div>

            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPlanIndex(Math.max(0, currentPlanIndex - 1))}
                disabled={currentPlanIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <span className="text-sm font-medium">
                Plan {currentPlanIndex + 1} of {generatedPlans.length}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPlanIndex(Math.min(generatedPlans.length - 1, currentPlanIndex + 1))}
                disabled={currentPlanIndex === generatedPlans.length - 1}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep('form')} className="flex-1">
                Discard
              </Button>
              <Button onClick={handleAccept} className="flex-1">
                Save Schedule
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
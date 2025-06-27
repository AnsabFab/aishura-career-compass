
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

interface UserPersona {
  careerStage: string;
  goals: string[];
  challenges: string[];
  personality: string;
  emotionalState: string;
}

interface OnboardingFlowProps {
  onComplete: (persona: UserPersona) => void;
}

const questions = [
  {
    id: 'careerStage',
    title: 'Where are you in your career journey?',
    subtitle: 'Help us understand your current professional stage',
    options: [
      { value: 'Just starting out', emoji: '🌱', desc: 'New to the professional world' },
      { value: 'Early career (1-3 years)', emoji: '🚀', desc: 'Building foundational experience' },
      { value: 'Mid-career (3-7 years)', emoji: '💼', desc: 'Developing expertise and leadership' },
      { value: 'Senior level (7+ years)', emoji: '👑', desc: 'Established professional with deep experience' },
      { value: 'Career transition', emoji: '🔄', desc: 'Changing paths or industries' }
    ]
  },
  {
    id: 'goals',
    title: 'What are your career aspirations?',
    subtitle: 'Select all goals that resonate with you',
    multiple: true,
    options: [
      { value: 'Land my dream job', emoji: '🎯', desc: 'Find the perfect role match' },
      { value: 'Get promoted', emoji: '📈', desc: 'Advance in current organization' },
      { value: 'Switch careers', emoji: '🔄', desc: 'Transition to new field' },
      { value: 'Master new skills', emoji: '💡', desc: 'Develop technical/soft skills' },
      { value: 'Build my network', emoji: '🤝', desc: 'Expand professional connections' },
      { value: 'Start my own business', emoji: '🚀', desc: 'Entrepreneurial journey' }
    ]
  },
  {
    id: 'emotionalState',
    title: 'How are you feeling about your career?',
    subtitle: 'Your emotional state helps us provide better support',
    options: [
      { value: 'Excited & motivated', emoji: '😊', desc: 'Ready to take on new challenges' },
      { value: 'Anxious & worried', emoji: '😟', desc: 'Feeling uncertain about the future' },
      { value: 'Frustrated & stuck', emoji: '😤', desc: 'Feeling blocked or held back' },
      { value: 'Hopeful but uncertain', emoji: '🤔', desc: 'Optimistic but need direction' },
      { value: 'Overwhelmed & stressed', emoji: '😵', desc: 'Too much happening at once' },
      { value: 'Confident & ready', emoji: '💪', desc: 'Prepared for next steps' }
    ]
  }
];

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<UserPersona>>({
    goals: [],
    challenges: []
  });
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  const handleOptionSelect = (value: string) => {
    if (currentQuestion.multiple) {
      const newSelection = selectedOptions.includes(value)
        ? selectedOptions.filter(opt => opt !== value)
        : [...selectedOptions, value];
      setSelectedOptions(newSelection);
    } else {
      setSelectedOptions([value]);
    }
  };

  const handleNext = () => {
    const newAnswers = { ...answers };
    if (currentQuestion.multiple) {
      (newAnswers as any)[currentQuestion.id] = selectedOptions;
    } else {
      (newAnswers as any)[currentQuestion.id] = selectedOptions[0] || '';
    }
    setAnswers(newAnswers);
    setSelectedOptions([]);

    if (isLastStep) {
      // Complete onboarding
      onComplete({
        careerStage: newAnswers.careerStage || '',
        goals: newAnswers.goals || [],
        challenges: newAnswers.challenges || [],
        personality: newAnswers.personality || '',
        emotionalState: newAnswers.emotionalState || ''
      });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const canProceed = selectedOptions.length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-cosmic-900/20 via-background to-aurora-900/20">
      <Card className="w-full max-w-4xl glass-effect border-cosmic-500/20 bg-gradient-to-br from-cosmic-900/5 to-aurora-900/5">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <img 
                src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
                alt="AIShura Logo" 
                className="w-16 h-16 object-contain"
              />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-aurora-400 to-neon-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          <div>
            <CardTitle className="text-3xl font-orbitron text-gradient bg-gradient-to-r from-cosmic-400 via-aurora-400 to-neon-400 bg-clip-text mb-2">
              Welcome to AIShura
            </CardTitle>
            <p className="text-lg text-muted-foreground">
              Let's personalize your career companion experience
            </p>
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center gap-3">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index < currentStep ? 'bg-gradient-to-r from-cosmic-500 to-aurora-500' 
                  : index === currentStep ? 'bg-gradient-to-r from-aurora-500 to-neon-500 animate-pulse' 
                  : 'bg-cosmic-500/20'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-8 pb-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              {currentQuestion.title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {currentQuestion.subtitle}
            </p>
          </div>

          <div className="grid gap-4 max-w-3xl mx-auto">
            {currentQuestion.options.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                className={`h-auto p-6 text-left justify-start transition-all duration-300 ${
                  selectedOptions.includes(option.value)
                    ? 'bg-gradient-to-r from-cosmic-500/20 to-aurora-500/20 border-cosmic-400 shadow-lg'
                    : 'hover:bg-gradient-to-r hover:from-cosmic-500/10 hover:to-aurora-500/10 hover:border-aurora-500/50'
                }`}
                onClick={() => handleOptionSelect(option.value)}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="text-2xl">{option.emoji}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-base flex items-center gap-2">
                      {option.value}
                      {selectedOptions.includes(option.value) && (
                        <CheckCircle className="w-4 h-4 text-cosmic-400" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {option.desc}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {currentQuestion.multiple && selectedOptions.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedOptions.map((option) => (
                <Badge
                  key={option}
                  variant="secondary"
                  className="bg-cosmic-500/20 text-cosmic-300 border-cosmic-500/30"
                >
                  {option}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              size="lg"
              className="bg-gradient-to-r from-cosmic-600 to-aurora-600 hover:from-cosmic-700 hover:to-aurora-700 text-white px-8 py-3 text-lg"
            >
              {isLastStep ? 'Complete Setup' : 'Continue'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

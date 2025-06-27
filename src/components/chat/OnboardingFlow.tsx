
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, CheckCircle, MapPin, User, Briefcase, Heart, Star } from 'lucide-react';

interface UserPersona {
  name: string;
  location: string;
  industry: string;
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
    id: 'name',
    title: 'Hey there, beautiful soul! ✨',
    subtitle: 'What should I call you? Your name will help me create a deeply personal connection.',
    type: 'input',
    placeholder: 'Enter your name',
    emoji: '👋',
    gradient: 'from-purple-400 via-pink-400 to-red-400'
  },
  {
    id: 'location',
    title: 'Where are you conquering the world from? 🌍',
    subtitle: 'Your location helps me find the most relevant opportunities in your area.',
    type: 'input',
    placeholder: 'City, Country',
    emoji: '📍',
    gradient: 'from-blue-400 via-cyan-400 to-teal-400'
  },
  {
    id: 'industry',
    title: 'What industry ignites your passion? 🔥',
    subtitle: 'Tell me your specific field to get the most precise opportunities.',
    type: 'input',
    placeholder: 'e.g., Software Development, Data Science, UX Design',
    emoji: '💼',
    gradient: 'from-green-400 via-emerald-400 to-cyan-400'
  },
  {
    id: 'careerStage',
    title: 'Where are you on your epic career journey? 🚀',
    subtitle: 'Understanding your stage helps me provide the perfect level of guidance.',
    type: 'select',
    emoji: '🌱',
    gradient: 'from-orange-400 via-red-400 to-pink-400',
    options: [
      { value: 'Just starting out', emoji: '🌱', desc: 'Fresh graduate or new to work' },
      { value: 'Early career (1-3 years)', emoji: '🚀', desc: 'Building foundational experience' },
      { value: 'Mid-career (3-7 years)', emoji: '💼', desc: 'Developing expertise' },
      { value: 'Senior level (7+ years)', emoji: '👑', desc: 'Established professional' },
      { value: 'Career transition', emoji: '🔄', desc: 'Changing paths or industries' },
      { value: 'Entrepreneur', emoji: '🦄', desc: 'Building my own empire' }
    ]
  },
  {
    id: 'goals',
    title: 'What dreams are you chasing? ✨',
    subtitle: 'Select all goals that make your heart race with excitement!',
    type: 'multiple',
    emoji: '🎯',
    gradient: 'from-indigo-400 via-purple-400 to-pink-400',
    options: [
      { value: 'Land my dream job', emoji: '🎯', desc: 'Find the perfect role' },
      { value: 'Get promoted', emoji: '📈', desc: 'Advance in current role' },
      { value: 'Switch careers', emoji: '🔄', desc: 'Transition to new field' },
      { value: 'Master new skills', emoji: '💡', desc: 'Develop abilities' },
      { value: 'Build my network', emoji: '🤝', desc: 'Connect with people' },
      { value: 'Start my own business', emoji: '🚀', desc: 'Create something new' }
    ]
  },
  {
    id: 'emotionalState',
    title: 'How is your heart feeling about your career? 💭',
    subtitle: 'Your emotions guide how I support you - there are no wrong answers here.',
    type: 'select',
    emoji: '💖',
    gradient: 'from-pink-400 via-rose-400 to-red-400',
    options: [
      { value: 'Excited & motivated', emoji: '😊', desc: 'Ready to conquer!' },
      { value: 'Anxious & worried', emoji: '😟', desc: 'Feeling uncertain' },
      { value: 'Frustrated & stuck', emoji: '😤', desc: 'Ready for breakthrough' },
      { value: 'Hopeful but uncertain', emoji: '🤔', desc: 'Need direction' },
      { value: 'Overwhelmed & stressed', emoji: '😵', desc: 'Too much happening' },
      { value: 'Confident & ready', emoji: '💪', desc: 'Prepared for next level' }
    ]
  }
];

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<UserPersona>>({
    name: '',
    location: '',
    industry: '',
    careerStage: '',
    goals: [],
    challenges: [],
    personality: '',
    emotionalState: ''
  });
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  const handleOptionSelect = (value: string) => {
    if (currentQuestion.type === 'multiple') {
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
    
    if (currentQuestion.type === 'input') {
      (newAnswers as any)[currentQuestion.id] = inputValue;
    } else if (currentQuestion.type === 'multiple') {
      (newAnswers as any)[currentQuestion.id] = selectedOptions;
    } else {
      (newAnswers as any)[currentQuestion.id] = selectedOptions[0] || '';
    }
    
    setAnswers(newAnswers);
    setSelectedOptions([]);
    setInputValue('');

    if (isLastStep) {
      onComplete({
        name: newAnswers.name || '',
        location: newAnswers.location || '',
        industry: newAnswers.industry || '',
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

  const canProceed = currentQuestion.type === 'input' 
    ? inputValue.trim().length > 0 
    : selectedOptions.length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-cosmic-900/30 via-background to-aurora-900/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb w-96 h-96 top-10 left-10 opacity-20" style={{ animationDelay: '0s' }} />
        <div className="floating-orb w-64 h-64 top-1/2 right-10 opacity-15" style={{ animationDelay: '2s' }} />
        <div className="floating-orb w-48 h-48 bottom-10 left-1/3 opacity-25" style={{ animationDelay: '4s' }} />
      </div>

      <Card className="w-full max-w-md glass-effect border-cosmic-500/30 bg-gradient-to-br from-cosmic-900/10 to-aurora-900/10 backdrop-blur-xl shadow-2xl animate-scale-in">
        <CardHeader className="text-center space-y-3 pb-3">
          <div className="relative mx-auto w-12 h-12 flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${currentQuestion.gradient} opacity-20 animate-pulse`}></div>
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-r from-cosmic-500/20 to-aurora-500/20 flex items-center justify-center border border-cosmic-500/30">
              <img 
                src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
                alt="AIShura Logo" 
                className="w-5 h-5 object-contain animate-pulse-glow"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-aurora-400 to-neon-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xs animate-bounce">{currentQuestion.emoji}</span>
            </div>
          </div>
          
          <div>
            <CardTitle className="text-lg font-orbitron text-gradient bg-gradient-to-r from-cosmic-400 via-aurora-400 to-neon-400 bg-clip-text mb-1">
              AIShura Career Companion
            </CardTitle>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Heart className="w-3 h-3 text-red-400 animate-pulse" />
              <span>Powered by Emotional Intelligence</span>
              <Sparkles className="w-3 h-3 text-aurora-400 animate-pulse" />
            </div>
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center gap-1 mt-3">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-700 ${
                  index < currentStep ? 'w-4 bg-gradient-to-r from-cosmic-500 to-aurora-500' 
                  : index === currentStep ? 'w-6 bg-gradient-to-r from-aurora-500 to-neon-500 animate-pulse' 
                  : 'w-1 bg-cosmic-500/30'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pb-4">
          <div className="text-center space-y-2">
            <h2 className="text-base font-bold text-foreground leading-tight">
              {currentQuestion.title}
            </h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {currentQuestion.subtitle}
            </p>
          </div>

          {currentQuestion.type === 'input' ? (
            <div className="space-y-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="h-9 text-center bg-background/50 border-cosmic-500/30 focus:border-aurora-500 rounded-lg text-sm"
                autoFocus
              />
            </div>
          ) : (
            <div className="grid gap-1.5 max-w-sm mx-auto">
              {currentQuestion.options?.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className={`h-auto p-2.5 text-left justify-start transition-all duration-300 ${
                    selectedOptions.includes(option.value)
                      ? `bg-gradient-to-r ${currentQuestion.gradient} bg-opacity-20 border-aurora-400 shadow-lg`
                      : 'hover:bg-gradient-to-r hover:from-cosmic-500/10 hover:to-aurora-500/10 hover:border-aurora-500/50'
                  }`}
                  onClick={() => handleOptionSelect(option.value)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="text-sm">{option.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs flex items-center gap-1">
                        {option.value}
                        {selectedOptions.includes(option.value) && (
                          <CheckCircle className="w-3 h-3 text-aurora-400 animate-pulse" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {option.desc}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'multiple' && selectedOptions.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {selectedOptions.map((option) => (
                <Badge
                  key={option}
                  variant="secondary"
                  className="bg-cosmic-500/20 text-cosmic-300 border-cosmic-500/30 animate-fade-in text-xs px-2 py-0.5"
                >
                  {option}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              size="sm"
              className={`bg-gradient-to-r ${currentQuestion.gradient} hover:opacity-90 text-white px-5 py-2 text-sm font-semibold shadow-lg transition-all duration-300 disabled:opacity-50`}
            >
              {isLastStep ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Launch My Journey
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

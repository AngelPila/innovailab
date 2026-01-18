import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
  completed: boolean;
}

interface CheckListProps {
  title?: string;
  description?: string;
  initialSteps?: Step[];
  accentColor?: string;
  onClose?: () => void;
  onStepToggle?: (stepId: number, completed: boolean) => void;
}

const CheckList: React.FC<CheckListProps> = ({
  title = 'Getting Started',
  description = "You're gonna be a Saleshandy superstar!",
  initialSteps = [
    { id: 1, label: 'Account Setup', completed: true },
    { id: 2, label: 'Connect Email', completed: false },
    { id: 3, label: 'Create Sequence', completed: false },
    { id: 4, label: 'Add Prospect', completed: false },
  ],
  accentColor = '#FFD41D',
  onClose,
  onStepToggle,
}) => {
  const [steps, setSteps] = useState<Step[]>(initialSteps);

  const completedCount = steps.filter(step => step.completed).length;
  const progress = (completedCount / steps.length) * 100;

  const toggleStep = (id: number) => {
    setSteps(prevSteps => {
      const newSteps = prevSteps.map(step => {
        if (step.id === id) {
          const newCompleted = !step.completed;
          if (onStepToggle) {
            onStepToggle(id, newCompleted);
          }
          return { ...step, completed: newCompleted };
        }
        return step;
      });
      return newSteps;
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        <p className="text-gray-600 mb-6">
          {description}
        </p>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${progress}%`,
                backgroundColor: accentColor
              }}
            />
          </div>
        </div>

        {/* Progress Text */}
        <p className="text-sm text-gray-700 mb-6">
          {progress}% Completado
        </p>

        {/* Steps List */}
        <div className="space-y-4">
          {steps.map((step) => (
            <div 
              key={step.id}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => toggleStep(step.id)}
            >
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  step.completed 
                    ? 'border-2' 
                    : 'border-2 border-gray-300'
                }`}
                style={step.completed ? { 
                  backgroundColor: accentColor,
                  borderColor: accentColor
                } : {}}
              >
                {step.completed && <Check size={16} className="text-white" />}
              </div>
              <span 
                className={`text-base ${
                  step.completed 
                    ? 'text-gray-400 line-through' 
                    : 'text-gray-900'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckList;
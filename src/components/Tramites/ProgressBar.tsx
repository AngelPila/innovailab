import { CheckCircle2, ChevronRight } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-white border-b border-gray-100 px-6 py-4">
      {/* Barra de progreso visual */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">
            Paso {currentStep} de {totalSteps}
          </span>
          <span className="text-sm font-semibold text-yellow-600">
            {Math.round(progressPercent)}%
          </span>
        </div>
        
        {/* Barra lineal */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Steps indicators - Solo visible en pantallas medianas */}
        <div className="hidden md:flex items-center justify-between mt-4">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-yellow-400 text-white ring-2 ring-yellow-300'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stepNumber}
                </div>
                <p className="text-xs font-medium text-gray-600 mt-2 text-center max-w-20 truncate">
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

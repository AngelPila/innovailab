import { CheckCircle2, ChevronRight, Circle } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onStepSelect?: (stepNumber: number) => void;
}

export function ProgressBar({ currentStep, totalSteps, stepLabels, onStepSelect }: ProgressBarProps) {
  return (
    <div className="w-full bg-white border-b border-gray-100 px-3 md:px-6 py-2 md:py-3">
      <div className="w-full">
        {/* Flujo horizontal que ocupa todo el ancho */}
        <div className="flex items-center gap-2 md:gap-3 w-full">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isClickable = !!onStepSelect && stepNumber <= currentStep;

            return (
              <div
                key={index}
                className="flex items-center gap-2 md:gap-3 flex-1 min-w-0"
              >
                {/* Paso */}
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => onStepSelect && onStepSelect(stepNumber)}
                  className={`flex flex-col items-center min-w-[56px] md:min-w-[64px] focus:outline-none ${
                    isClickable ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div
                    className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 text-white shadow-sm'
                        : isCurrent
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md ring-2 ring-yellow-200'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 md:w-5 md:h-5" />
                    ) : (
                      <span>{stepNumber}</span>
                    )}
                  </div>
                  <p className={`text-xs md:text-sm font-medium mt-1 text-center truncate ${
                    isCurrent ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {label}
                  </p>
                </button>

                {/* Conector - ocupa el espacio restante entre pasos */}
                {index < stepLabels.length - 1 && (
                  <div className={`flex-1 h-0.5 mb-5 md:mb-6 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

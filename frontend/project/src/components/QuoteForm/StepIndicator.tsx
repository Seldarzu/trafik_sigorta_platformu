import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.number}
            className={`relative ${
              stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''
            }`}
          >
            {/* Connector Line */}
            {stepIdx !== steps.length - 1 && (
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div
                  className={`h-0.5 w-full ${
                    step.number < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              </div>
            )}

            {/* Step Circle */}
            <div className="relative flex items-center">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  step.number < currentStep
                    ? 'bg-blue-600'
                    : step.number === currentStep
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                }`}
              >
                {step.number < currentStep ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      step.number === currentStep ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {step.number}
                  </span>
                )}
              </div>
              
              {/* Step Text */}
              <div className="ml-4 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    step.number <= currentStep ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default StepIndicator;
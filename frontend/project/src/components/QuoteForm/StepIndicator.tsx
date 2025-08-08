import React from 'react'
import { Check } from 'lucide-react'

interface Step { number: number; title: string; description: string }
interface Props { steps: Step[]; currentStep: number }

const StepIndicator: React.FC<Props> = ({ steps, currentStep }) => (
  <nav aria-label="Progress">
    <ol className="flex items-center">
      {steps.map((s, i) => (
        <li key={s.number} className={`${i<steps.length-1?'pr-8 sm:pr-20':''} relative`}>
          {i<steps.length-1 && (
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className={`h-0.5 w-full ${s.number<currentStep?'bg-blue-600':'bg-gray-200'}`} />
            </div>
          )}
          <div className="relative flex items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
              s.number<currentStep?'bg-blue-600':s.number===currentStep?'bg-blue-600':'bg-gray-200'}`}>
              {s.number<currentStep
                ? <Check className="h-5 w-5 text-white" />
                : <span className={`text-sm font-medium ${s.number===currentStep?'text-white':'text-gray-500'}`}>{s.number}</span>}
            </div>
            <div className="ml-4 min-w-0">
              <p className={`text-sm font-medium ${s.number<=currentStep?'text-blue-600':'text-gray-500'}`}>{s.title}</p>
              <p className="text-xs text-gray-500">{s.description}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  </nav>
)

export default StepIndicator

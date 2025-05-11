import React from "react";
import { FaCheck } from "react-icons/fa";

const StepIndicator = ({ currentStep, stepLabels, skipStep, skipCondition }) => {
  return (
    <div className="flex justify-between mb-8">
      {stepLabels.map((label, index) => {
        const stepNumber = index + 1;

        if (skipStep === stepNumber && skipCondition) {
          return null;
        }

        let displayStep = stepNumber;
        if (skipCondition && skipStep && stepNumber > skipStep) {
          displayStep = stepNumber - 1;
        }

        const isComplete = currentStep > stepNumber;
        const isActive = currentStep === stepNumber;
        const isSkipped = skipCondition && skipStep === stepNumber;

        if (isSkipped) return null;

        return (
          <React.Fragment key={stepNumber}>
            {index > 0 && !isSkipped && (
              <div className="flex-1 flex items-center justify-center">
                <div
                  className={`h-1 w-full ${
                    isComplete || isActive ? "bg-blue-600" : "bg-gray-200"
                  }`}
                ></div>
              </div>
            )}
            <div
              className={`flex flex-col items-center ${
                isComplete || isActive ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isComplete
                    ? "bg-blue-600 text-white"
                    : isActive
                    ? "bg-blue-100 border-2 border-blue-600"
                    : "bg-gray-100"
                }`}
              >
                {isComplete ? (
                  <FaCheck className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{displayStep}</span>
                )}
              </div>
              <span className="mt-2 text-sm font-medium text-center">{label}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;

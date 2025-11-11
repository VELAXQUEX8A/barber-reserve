import React from 'react';
import '../styles/components/StepIndicator.css';

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="step-indicator">
      {steps.map((step) => (
        <div 
          key={step.id} 
          className={`step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
        >
          <div className="step-number">{step.number}</div>
          <span className="step-label">{step.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;

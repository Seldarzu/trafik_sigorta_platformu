import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { QuoteFormData } from '../../types';
import VehicleInfoStep from './VehicleInfoStep';
import DriverInfoStep from './DriverInfoStep';
import ReviewStep from './ReviewStep';
import StepIndicator from './StepIndicator';

interface QuoteFormProps {
  onBack: () => void;
  onQuoteCreated: (quote: any) => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ onBack, onQuoteCreated }) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    vehicle: {},
    driver: {},
    currentStep: 1
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { number: 1, title: 'Araç Bilgileri', description: 'Sigortalanacak araç bilgilerini girin' },
    { number: 2, title: 'Sürücü Bilgileri', description: 'Sürücü ve risk bilgilerini girin' },
    { number: 3, title: 'Teklif Özeti', description: 'Bilgileri kontrol edin ve teklif alın' }
  ];

  const updateFormData = (field: 'vehicle' | 'driver', data: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], ...data }
    }));
  };

  const nextStep = () => {
    if (formData.currentStep < 3) {
      setFormData(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const prevStep = () => {
    if (formData.currentStep > 1) {
      setFormData(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const canProceed = () => {
    switch (formData.currentStep) {
      case 1:
        return formData.vehicle.plateNumber && 
               formData.vehicle.brand && 
               formData.vehicle.model && 
               formData.vehicle.year;
      case 2:
        return formData.driver.firstName && 
               formData.driver.lastName && 
               formData.driver.tcNumber && 
               formData.driver.birthDate;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock quote
    const quote = {
      id: `Q-${Date.now()}`,
      vehicle: formData.vehicle,
      driver: formData.driver,
      premium: Math.floor(Math.random() * 3000) + 1500,
      coverageAmount: 500000,
      riskScore: Math.floor(Math.random() * 40) + 60,
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      status: 'active',
      agentId: 'agent-1',
      companyName: 'Anadolu Sigorta',
      discounts: [],
      totalDiscount: 0,
      finalPremium: Math.floor(Math.random() * 3000) + 1500
    };

    setIsSubmitting(false);
    onQuoteCreated(quote);
  };

  const renderStep = () => {
    switch (formData.currentStep) {
      case 1:
        return (
          <VehicleInfoStep
            data={formData.vehicle}
            onChange={(data) => updateFormData('vehicle', data)}
          />
        );
      case 2:
        return (
          <DriverInfoStep
            data={formData.driver}
            onChange={(data) => updateFormData('driver', data)}
          />
        );
      case 3:
        return (
          <ReviewStep
            vehicleData={formData.vehicle}
            driverData={formData.driver}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Dashboard'a Dön
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Yeni Trafik Sigortası Teklifi</h1>
        <p className="mt-2 text-gray-600">
          Aşağıdaki formu doldurarak hızlıca teklif alabilirsiniz
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator steps={steps} currentStep={formData.currentStep} />

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
        <div className="px-6 py-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        {formData.currentStep < 3 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              onClick={prevStep}
              disabled={formData.currentStep === 1}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Geri
            </button>
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              İleri
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteForm;
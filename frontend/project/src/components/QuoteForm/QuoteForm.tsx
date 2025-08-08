import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VehicleInfoStep from './VehicleInfoStep';
import DriverInfoStep from './DriverInfoStep';
import ReviewStep from './ReviewStep';
import StepIndicator from './StepIndicator';
import { QuoteService } from '../../services/QuoteService';
import { CustomerService } from '../../services/CustomerService';
import {
  CreateQuoteDto,
  CreateDriverDto,
  CreateVehicleDto,
  Customer,
  Quote
} from '../../types';

type Vehicle = CreateVehicleDto;
type Driver  = CreateDriverDto;

interface QuoteFormData {
  vehicle: Partial<Vehicle>;
  driver: Partial<Driver>;
  currentStep: 1 | 2 | 3;
}

interface QuoteFormProps {
  onBack: () => void;
  onQuoteCreated: (quote: Quote) => void;
  customerId?: string;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ onBack, onQuoteCreated, customerId }) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    vehicle: {},
    driver:  {},
    currentStep: 1
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const [customers, setCustomers]     = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(customerId);

  // “Sürücü müşteriyle aynı” toggle’u
  const [driverSameAsCustomer, setDriverSameAsCustomer] = useState(true);

  useEffect(() => {
    if (!customerId) {
      CustomerService.list()
        .then(setCustomers)
        .catch(() => setCustomers([]));
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId) setSelectedCustomerId(customerId);
  }, [customerId]);

  // Müşteri seçilince (veya toggle açıkken) sürücü alanlarını otomatik doldur
  useEffect(() => {
    if (!selectedCustomerId || !driverSameAsCustomer) return;

    CustomerService.get(selectedCustomerId)
      .then((c) => {
        setFormData(prev => ({
          ...prev,
          driver: {
            ...prev.driver,
            firstName: c.firstName || '',
            lastName:  c.lastName  || '',
            tcNumber:  c.tcNumber  || '',
            birthDate: c.birthDate || '',
          }
        }));
      })
      .catch(() => { /* sessiz */ });
  }, [selectedCustomerId, driverSameAsCustomer]);

  const steps = [
    { number: 1, title: 'Araç Bilgileri',   description: 'Sigortalanacak araç bilgilerini girin' },
    { number: 2, title: 'Sürücü Bilgileri', description: 'Sürücü ve risk bilgilerini girin' },
    { number: 3, title: 'Teklif Özeti',     description: 'Bilgileri kontrol edin ve teklif alın' }
  ];

  const updateFormData = (field: 'vehicle' | 'driver', data: any) => {
    setFormData(prev => ({ ...prev, [field]: { ...prev[field], ...data } }));
  };

  const nextStep = () => {
    if (formData.currentStep < 3) {
      setFormData(prev => ({ ...prev, currentStep: (prev.currentStep + 1) as 2 | 3 }));
    }
  };
  const prevStep = () => {
    if (formData.currentStep > 1) {
      setFormData(prev => ({ ...prev, currentStep: (prev.currentStep - 1) as 1 | 2 }));
    }
  };

  const canProceed = () => {
    if (!selectedCustomerId) return false;
    if (formData.currentStep === 1)
      return !!(formData.vehicle.plateNumber && formData.vehicle.brand && formData.vehicle.model && formData.vehicle.year);
    if (formData.currentStep === 2)
      return !!(formData.driver.firstName && formData.driver.lastName && formData.driver.tcNumber && formData.driver.birthDate);
    return true;
  };

  // basit hesap
  const calcRiskScore = useMemo(() => (drv: Partial<Driver>) => {
    let score = 20;
    if (drv.birthDate) {
      const birth = new Date(drv.birthDate);
      const age = Math.max(0, Math.floor((Date.now() - birth.getTime()) / (365.25*24*3600*1000)));
      if (age < 25) score += 25;
      else if (age < 35) score += 15;
      else if (age < 50) score += 5;
      else score += 10;
    }
    if (drv.licenseDate) {
      const d = new Date(drv.licenseDate);
      const years = Math.max(0, Math.floor((Date.now() - d.getTime()) / (365.25*24*3600*1000)));
      score += Math.max(0, 10 - Math.min(10, years));
    }
    if (drv.hasAccidents)  score += 10 + (drv.accidentCount ?? 0) * 5;
    if (drv.hasViolations) score += 5  + (drv.violationCount ?? 0) * 2;
    return Math.max(0, Math.min(100, score));
  }, []);

  const calcPremium = useMemo(() => (veh: Partial<Vehicle>, drv: Partial<Driver>) => {
    let base = 1800;
    if (veh.year) {
      const age = new Date().getFullYear() - veh.year;
      base += Math.max(-200, Math.min(400, age * 30));
    }
    if (veh.engineSize) {
      const e = parseFloat(veh.engineSize);
      if (!Number.isNaN(e)) base += (e - 1.6) * 150;
    }
    if (veh.usage === 'commercial' || veh.usage === 'taxi' || veh.usage === 'truck') base += 350;
    const rs = calcRiskScore(drv);
    base += rs * 12;
    return Math.max(1000, Math.round(base));
  }, [calcRiskScore]);

  const handleSubmit = async () => {
    if (!selectedCustomerId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const driver: CreateDriverDto = {
        firstName:      formData.driver.firstName!,
        lastName:       formData.driver.lastName!,
        tcNumber:       formData.driver.tcNumber!,
        birthDate:      formData.driver.birthDate!,
        licenseDate:    formData.driver.licenseDate,
        gender:         formData.driver.gender,
        maritalStatus:  formData.driver.maritalStatus,
        education:      formData.driver.education,
        profession:     formData.driver.profession,
        hasAccidents:   !!formData.driver.hasAccidents,
        accidentCount:  formData.driver.hasAccidents ? (formData.driver.accidentCount ?? 1) : 0,
        hasViolations:  !!formData.driver.hasViolations,
        violationCount: formData.driver.hasViolations ? (formData.driver.violationCount ?? 1) : 0
      };

      const vehicle: CreateVehicleDto = {
        plateNumber: formData.vehicle.plateNumber!,
        brand:       formData.vehicle.brand!,
        model:       formData.vehicle.model!,
        year:        formData.vehicle.year!,
        // TS hatası veren alanları boş string ile garanti altına alıyoruz
        engineSize:  formData.vehicle.engineSize ?? '',
        fuelType:    formData.vehicle.fuelType,
        usage:       formData.vehicle.usage,
        cityCode:    formData.vehicle.cityCode ?? ''
      };

      const payload: CreateQuoteDto = {
        customerId:    selectedCustomerId,
        riskScore:     calcRiskScore(driver),
        premiumAmount: calcPremium(vehicle, driver),
        vehicle,
        driver
      };

      const created = await QuoteService.create(payload);
      onQuoteCreated(created);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Teklif oluşturulamadı.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (formData.currentStep) {
      case 1:
        return (
          <VehicleInfoStep
            data={formData.vehicle}
            onChange={(d) => updateFormData('vehicle', d)}
          />
        );
      case 2:
        return (
          <DriverInfoStep
            data={formData.driver}
            onChange={(d) => updateFormData('driver', d)}
            lockCore={driverSameAsCustomer}
            onToggleLock={() => setDriverSameAsCustomer(v => !v)}
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
      <div className="mb-8">
        <button onClick={onBack} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Dashboard'a Dön
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Yeni Trafik Sigortası Teklifi</h1>
        <p className="mt-2 text-gray-600">Aşağıdaki formu doldurarak hızlıca teklif alabilirsiniz</p>

        {!customerId && (
          <div className="mt-4">
            <label className="block text-sm text-gray-700 mb-1">Müşteri *</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={selectedCustomerId ?? ''}
              onChange={(e) => setSelectedCustomerId(e.target.value || undefined)}
            >
              <option value="">Müşteri seçiniz</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} — {c.tcNumber}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <StepIndicator steps={steps} currentStep={formData.currentStep} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
        <div className="px-6 py-8">
          {renderStep()}
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>

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

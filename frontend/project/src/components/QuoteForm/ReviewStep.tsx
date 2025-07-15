import React from 'react';
import { Car, User, Shield, Clock, Loader2 } from 'lucide-react';
import { Vehicle, Driver } from '../../types';

interface ReviewStepProps {
  vehicleData: Partial<Vehicle>;
  driverData: Partial<Driver>;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  vehicleData,
  driverData,
  onSubmit,
  isSubmitting
}) => {
  const getFuelTypeText = (fuelType: string) => {
    const types = {
      gasoline: 'Benzin',
      diesel: 'Dizel',
      lpg: 'LPG',
      electric: 'Elektrik',
      hybrid: 'Hibrit'
    };
    return types[fuelType as keyof typeof types] || fuelType;
  };

  const getUsageText = (usage: string) => {
    const usages = {
      personal: 'Özel',
      commercial: 'Ticari',
      taxi: 'Taksi',
      truck: 'Kamyon'
    };
    return usages[usage as keyof typeof usages] || usage;
  };

  const getGenderText = (gender: string) => {
    return gender === 'male' ? 'Erkek' : gender === 'female' ? 'Kadın' : gender;
  };

  const getMaritalStatusText = (status: string) => {
    const statuses = {
      single: 'Bekar',
      married: 'Evli',
      divorced: 'Boşanmış',
      widowed: 'Dul'
    };
    return statuses[status as keyof typeof statuses] || status;
  };

  const getEducationText = (education: string) => {
    const educations = {
      primary: 'İlkokul',
      secondary: 'Ortaokul',
      high_school: 'Lise',
      university: 'Üniversite',
      postgraduate: 'Yüksek Lisans/Doktora'
    };
    return educations[education as keyof typeof educations] || education;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Teklif Özeti</h2>
        <p className="text-gray-600 mb-6">
          Lütfen girdiğiniz bilgileri kontrol edin ve teklif almak için onaylayın.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Araç Bilgileri */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Car className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Araç Bilgileri</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Plaka:</span>
              <span className="font-medium text-gray-900">{vehicleData.plateNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Marka/Model:</span>
              <span className="font-medium text-gray-900">
                {vehicleData.brand} {vehicleData.model}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Model Yılı:</span>
              <span className="font-medium text-gray-900">{vehicleData.year}</span>
            </div>
            {vehicleData.engineSize && (
              <div className="flex justify-between">
                <span className="text-gray-600">Motor Hacmi:</span>
                <span className="font-medium text-gray-900">{vehicleData.engineSize}</span>
              </div>
            )}
            {vehicleData.fuelType && (
              <div className="flex justify-between">
                <span className="text-gray-600">Yakıt Tipi:</span>
                <span className="font-medium text-gray-900">
                  {getFuelTypeText(vehicleData.fuelType)}
                </span>
              </div>
            )}
            {vehicleData.usage && (
              <div className="flex justify-between">
                <span className="text-gray-600">Kullanım Amacı:</span>
                <span className="font-medium text-gray-900">
                  {getUsageText(vehicleData.usage)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sürücü Bilgileri */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Sürücü Bilgileri</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Ad Soyad:</span>
              <span className="font-medium text-gray-900">
                {driverData.firstName} {driverData.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">T.C. Kimlik:</span>
              <span className="font-medium text-gray-900">{driverData.tcNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Doğum Tarihi:</span>
              <span className="font-medium text-gray-900">
                {driverData.birthDate && new Date(driverData.birthDate).toLocaleDateString('tr-TR')}
              </span>
            </div>
            {driverData.gender && (
              <div className="flex justify-between">
                <span className="text-gray-600">Cinsiyet:</span>
                <span className="font-medium text-gray-900">
                  {getGenderText(driverData.gender)}
                </span>
              </div>
            )}
            {driverData.maritalStatus && (
              <div className="flex justify-between">
                <span className="text-gray-600">Medeni Durum:</span>
                <span className="font-medium text-gray-900">
                  {getMaritalStatusText(driverData.maritalStatus)}
                </span>
              </div>
            )}
            {driverData.profession && (
              <div className="flex justify-between">
                <span className="text-gray-600">Meslek:</span>
                <span className="font-medium text-gray-900">{driverData.profession}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Risk Bilgileri */}
      {(driverData.hasAccidents || driverData.hasViolations) && (
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="text-lg font-medium text-yellow-800">Risk Faktörleri</h3>
          </div>
          <div className="space-y-2">
            {driverData.hasAccidents && (
              <p className="text-yellow-700">
                • Son 5 yılda {driverData.accidentCount} kaza geçirmiş
              </p>
            )}
            {driverData.hasViolations && (
              <p className="text-yellow-700">
                • Son 2 yılda {driverData.violationCount} trafik cezası almış
              </p>
            )}
          </div>
        </div>
      )}

      {/* Teklif Al Butonu */}
      <div className="flex justify-center pt-6">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center px-8 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Teklif Hesaplanıyor...
            </>
          ) : (
            <>
              <Clock className="h-5 w-5 mr-2" />
              Teklif Al
            </>
          )}
        </button>
      </div>

      {isSubmitting && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Bilgileriniz değerlendiriliyor ve en uygun teklif hesaplanıyor...
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
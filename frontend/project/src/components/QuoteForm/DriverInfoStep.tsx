import React from 'react';
import { Driver } from '../../types';

interface DriverInfoStepProps {
  data: Partial<Driver>;
  onChange: (data: Partial<Driver>) => void;
}

const DriverInfoStep: React.FC<DriverInfoStepProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof Driver, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const professions = [
    'Mühendis', 'Öğretmen', 'Doktor', 'Hemşire', 'Avukat', 'Muhasebeci',
    'İşçi', 'Memur', 'Emekli', 'Öğrenci', 'Ev Hanımı', 'Serbest Meslek',
    'İşveren', 'Esnaf', 'Çiftçi', 'Şoför', 'Diğer'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Sürücü Bilgileri</h2>
        <p className="text-gray-600 mb-6">
          Ana sürücü ve risk bilgilerini doğru bir şekilde giriniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ad */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            Ad *
          </label>
          <input
            type="text"
            id="firstName"
            value={data.firstName || ''}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Soyad */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Soyad *
          </label>
          <input
            type="text"
            id="lastName"
            value={data.lastName || ''}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* TC Kimlik No */}
        <div>
          <label htmlFor="tcNumber" className="block text-sm font-medium text-gray-700 mb-2">
            T.C. Kimlik Numarası *
          </label>
          <input
            type="text"
            id="tcNumber"
            value={data.tcNumber || ''}
            onChange={(e) => handleChange('tcNumber', e.target.value.replace(/\D/g, '').slice(0, 11))}
            placeholder="12345678901"
            maxLength={11}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Doğum Tarihi */}
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
            Doğum Tarihi *
          </label>
          <input
            type="date"
            id="birthDate"
            value={data.birthDate || ''}
            onChange={(e) => handleChange('birthDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Ehliyet Tarihi */}
        <div>
          <label htmlFor="licenseDate" className="block text-sm font-medium text-gray-700 mb-2">
            Ehliyet Alma Tarihi
          </label>
          <input
            type="date"
            id="licenseDate"
            value={data.licenseDate || ''}
            onChange={(e) => handleChange('licenseDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Cinsiyet */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
            Cinsiyet
          </label>
          <select
            id="gender"
            value={data.gender || ''}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seçiniz</option>
            <option value="male">Erkek</option>
            <option value="female">Kadın</option>
          </select>
        </div>

        {/* Medeni Durum */}
        <div>
          <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-2">
            Medeni Durum
          </label>
          <select
            id="maritalStatus"
            value={data.maritalStatus || ''}
            onChange={(e) => handleChange('maritalStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seçiniz</option>
            <option value="single">Bekar</option>
            <option value="married">Evli</option>
            <option value="divorced">Boşanmış</option>
            <option value="widowed">Dul</option>
          </select>
        </div>

        {/* Eğitim Durumu */}
        <div>
          <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
            Eğitim Durumu
          </label>
          <select
            id="education"
            value={data.education || ''}
            onChange={(e) => handleChange('education', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seçiniz</option>
            <option value="primary">İlkokul</option>
            <option value="secondary">Ortaokul</option>
            <option value="high_school">Lise</option>
            <option value="university">Üniversite</option>
            <option value="postgraduate">Yüksek Lisans/Doktora</option>
          </select>
        </div>

        {/* Meslek */}
        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
            Meslek
          </label>
          <select
            id="profession"
            value={data.profession || ''}
            onChange={(e) => handleChange('profession', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seçiniz</option>
            {professions.map(profession => (
              <option key={profession} value={profession}>{profession}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Risk Bilgileri */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Bilgileri</h3>
        <div className="space-y-4">
          {/* Kaza Geçmişi */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasAccidents"
                checked={data.hasAccidents || false}
                onChange={(e) => handleChange('hasAccidents', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="hasAccidents" className="ml-2 text-sm text-gray-900">
                Son 5 yılda kaza geçirdim
              </label>
            </div>
            {data.hasAccidents && (
              <div className="flex items-center space-x-2">
                <label htmlFor="accidentCount" className="text-sm text-gray-700">
                  Kaza Sayısı:
                </label>
                <select
                  id="accidentCount"
                  value={data.accidentCount || 0}
                  onChange={(e) => handleChange('accidentCount', parseInt(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3+</option>
                </select>
              </div>
            )}
          </div>

          {/* Trafik Cezası */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasViolations"
                checked={data.hasViolations || false}
                onChange={(e) => handleChange('hasViolations', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="hasViolations" className="ml-2 text-sm text-gray-900">
                Son 2 yılda trafik cezası aldım
              </label>
            </div>
            {data.hasViolations && (
              <div className="flex items-center space-x-2">
                <label htmlFor="violationCount" className="text-sm text-gray-700">
                  Ceza Sayısı:
                </label>
                <select
                  id="violationCount"
                  value={data.violationCount || 0}
                  onChange={(e) => handleChange('violationCount', parseInt(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5+</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverInfoStep;
import React from 'react';
import { Vehicle } from '../../types';

interface VehicleInfoStepProps {
  data: Partial<Vehicle>;
  onChange: (data: Partial<Vehicle>) => void;
}

const VehicleInfoStep: React.FC<VehicleInfoStepProps> = ({ data, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const brands = [
    'Toyota', 'Volkswagen', 'Ford', 'Renault', 'Opel', 'Peugeot', 
    'Fiat', 'Hyundai', 'Nissan', 'Honda', 'BMW', 'Mercedes-Benz',
    'Audi', 'Skoda', 'Seat', 'Citroën', 'Kia', 'Mazda'
  ];

  const cities = [
    { code: '01', name: 'Adana' }, { code: '02', name: 'Adıyaman' }, { code: '03', name: 'Afyonkarahisar' },
    { code: '04', name: 'Ağrı' }, { code: '05', name: 'Amasya' }, { code: '06', name: 'Ankara' },
    { code: '07', name: 'Antalya' }, { code: '08', name: 'Artvin' }, { code: '09', name: 'Aydın' },
    { code: '10', name: 'Balıkesir' }, { code: '11', name: 'Bilecik' }, { code: '12', name: 'Bingöl' },
    { code: '13', name: 'Bitlis' }, { code: '14', name: 'Bolu' }, { code: '15', name: 'Burdur' },
    { code: '16', name: 'Bursa' }, { code: '17', name: 'Çanakkale' }, { code: '18', name: 'Çankırı' },
    { code: '19', name: 'Çorum' }, { code: '20', name: 'Denizli' }, { code: '21', name: 'Diyarbakır' },
    { code: '22', name: 'Edirne' }, { code: '23', name: 'Elazığ' }, { code: '24', name: 'Erzincan' },
    { code: '25', name: 'Erzurum' }, { code: '26', name: 'Eskişehir' }, { code: '27', name: 'Gaziantep' },
    { code: '28', name: 'Giresun' }, { code: '29', name: 'Gümüşhane' }, { code: '30', name: 'Hakkari' },
    { code: '31', name: 'Hatay' }, { code: '32', name: 'Isparta' }, { code: '33', name: 'Mersin' },
    { code: '34', name: 'İstanbul' }, { code: '35', name: 'İzmir' }, { code: '36', name: 'Kars' },
    { code: '37', name: 'Kastamonu' }, { code: '38', name: 'Kayseri' }, { code: '39', name: 'Kırklareli' },
    { code: '40', name: 'Kırşehir' }, { code: '41', name: 'Kocaeli' }, { code: '42', name: 'Konya' },
    { code: '43', name: 'Kütahya' }, { code: '44', name: 'Malatya' }, { code: '45', name: 'Manisa' },
    { code: '46', name: 'Kahramanmaraş' }, { code: '47', name: 'Mardin' }, { code: '48', name: 'Muğla' },
    { code: '49', name: 'Muş' }, { code: '50', name: 'Nevşehir' }, { code: '51', name: 'Niğde' },
    { code: '52', name: 'Ordu' }, { code: '53', name: 'Rize' }, { code: '54', name: 'Sakarya' },
    { code: '55', name: 'Samsun' }, { code: '56', name: 'Siirt' }, { code: '57', name: 'Sinop' },
    { code: '58', name: 'Sivas' }, { code: '59', name: 'Tekirdağ' }, { code: '60', name: 'Tokat' },
    { code: '61', name: 'Trabzon' }, { code: '62', name: 'Tunceli' }, { code: '63', name: 'Şanlıurfa' },
    { code: '64', name: 'Uşak' }, { code: '65', name: 'Van' }, { code: '66', name: 'Yozgat' },
    { code: '67', name: 'Zonguldak' }, { code: '68', name: 'Aksaray' }, { code: '69', name: 'Bayburt' },
    { code: '70', name: 'Karaman' }, { code: '71', name: 'Kırıkkale' }, { code: '72', name: 'Batman' },
    { code: '73', name: 'Şırnak' }, { code: '74', name: 'Bartın' }, { code: '75', name: 'Ardahan' },
    { code: '76', name: 'Iğdır' }, { code: '77', name: 'Yalova' }, { code: '78', name: 'Karabük' },
    { code: '79', name: 'Kilis' }, { code: '80', name: 'Osmaniye' }, { code: '81', name: 'Düzce' }
  ];

  const handleChange = (field: keyof Vehicle, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Araç Bilgileri</h2>
        <p className="text-gray-600 mb-6">
          Sigortalanacak araç hakkındaki bilgileri doğru bir şekilde giriniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plaka */}
        <div>
          <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Plaka Numarası *
          </label>
          <input
            type="text"
            id="plateNumber"
            value={data.plateNumber || ''}
            onChange={(e) => handleChange('plateNumber', e.target.value.toUpperCase())}
            placeholder="34 ABC 123"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Marka */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
            Marka *
          </label>
          <select
            id="brand"
            value={data.brand || ''}
            onChange={(e) => handleChange('brand', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Marka Seçiniz</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
            Model *
          </label>
          <input
            type="text"
            id="model"
            value={data.model || ''}
            onChange={(e) => handleChange('model', e.target.value)}
            placeholder="Corolla"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Model Yılı */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
            Model Yılı *
          </label>
          <select
            id="year"
            value={data.year || ''}
            onChange={(e) => handleChange('year', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Yıl Seçiniz</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Motor Hacmi */}
        <div>
          <label htmlFor="engineSize" className="block text-sm font-medium text-gray-700 mb-2">
            Motor Hacmi
          </label>
          <select
            id="engineSize"
            value={data.engineSize || ''}
            onChange={(e) => handleChange('engineSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seçiniz</option>
            <option value="1.0">1.0</option>
            <option value="1.2">1.2</option>
            <option value="1.4">1.4</option>
            <option value="1.6">1.6</option>
            <option value="1.8">1.8</option>
            <option value="2.0">2.0</option>
            <option value="2.4">2.4</option>
            <option value="3.0">3.0+</option>
          </select>
        </div>

        {/* Yakıt Tipi */}
        <div>
          <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-2">
            Yakıt Tipi
          </label>
          <select
            id="fuelType"
            value={data.fuelType || ''}
            onChange={(e) => handleChange('fuelType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seçiniz</option>
            <option value="gasoline">Benzin</option>
            <option value="diesel">Dizel</option>
            <option value="lpg">LPG</option>
            <option value="electric">Elektrik</option>
            <option value="hybrid">Hibrit</option>
          </select>
        </div>

        {/* Kullanım Amacı */}
        <div>
          <label htmlFor="usage" className="block text-sm font-medium text-gray-700 mb-2">
            Kullanım Amacı
          </label>
          <select
            id="usage"
            value={data.usage || ''}
            onChange={(e) => handleChange('usage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seçiniz</option>
            <option value="personal">Özel</option>
            <option value="commercial">Ticari</option>
            <option value="taxi">Taksi</option>
            <option value="truck">Kamyon</option>
          </select>
        </div>

        {/* Şehir */}
        <div>
          <label htmlFor="cityCode" className="block text-sm font-medium text-gray-700 mb-2">
            Trafik Tescil Şehri
          </label>
          <select
            id="cityCode"
            value={data.cityCode || ''}
            onChange={(e) => handleChange('cityCode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Şehir Seçiniz</option>
            {cities.map(city => (
              <option key={city.code} value={city.code}>
                {city.code} - {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default VehicleInfoStep;
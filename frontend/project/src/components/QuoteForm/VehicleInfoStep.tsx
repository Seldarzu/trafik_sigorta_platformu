import React from 'react';
import { Vehicle } from '../../types';

interface Props {
  data: Partial<Vehicle>;
  onChange: (d: Partial<Vehicle>) => void;
}

const VehicleInfoStep: React.FC<Props> = ({ data, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const brands = [
    'Toyota','Volkswagen','Ford','Renault','Opel','Peugeot','Fiat','Hyundai','Nissan','Honda',
    'BMW','Mercedes-Benz','Audi','Skoda','Seat','Citroën','Kia','Mazda'
  ];

  const cities = [
    { code: '01', name: 'Adana' },
    { code: '02', name: 'Adıyaman' },
    { code: '34', name: 'İstanbul' },
    { code: '35', name: 'İzmir' }
  ];

  const h = (k: keyof Vehicle, v: any) => onChange({ ...data, [k]: v });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Araç Bilgileri</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label>Plaka *</label>
          <input
            type="text"
            value={data.plateNumber || ''}
            onChange={e => h('plateNumber', e.target.value.toUpperCase())}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label>Marka *</label>
          <select
            value={data.brand || ''}
            onChange={e => h('brand', e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Seçiniz</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Model *</label>
          <input
            type="text"
            value={data.model || ''}
            onChange={e => h('model', e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label>Yıl *</label>
          <select
            value={data.year || ''}
            onChange={e => h('year', e.target.value ? parseInt(e.target.value, 10) : undefined)}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Seçiniz</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Motor Hacmi</label>
          <select
            value={data.engineSize || ''}
            onChange={e => h('engineSize', e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Seçiniz</option>
            {['1.0','1.2','1.4','1.6','1.8','2.0','2.4','3.0+'].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Yakıt Tipi</label>
          {/* BE ile uyum için değerler BÜYÜK HARF */}
          <select
            value={(data as any).fuelType || ''}
            onChange={e => h('fuelType' as any, e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Seçiniz</option>
            <option value="GASOLINE">Benzin</option>
            <option value="DIESEL">Dizel</option>
            <option value="LPG">LPG</option>
            <option value="ELECTRIC">Elektrik</option>
            <option value="HYBRID">Hibrit</option>
          </select>
        </div>

        <div>
          <label>Kullanım Amacı</label>
          {/* BE ile uyum için değerler BÜYÜK HARF */}
          <select
            value={(data as any).usage || ''}
            onChange={e => h('usage' as any, e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Seçiniz</option>
            <option value="PERSONAL">Özel</option>
            <option value="COMMERCIAL">Ticari</option>
            <option value="TAXI">Taksi</option>
            <option value="TRUCK">Kamyon</option>
          </select>
        </div>

        <div>
          <label>Şehir</label>
          <select
            value={data.cityCode || ''}
            onChange={e => h('cityCode', e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Seçiniz</option>
            {cities.map(c => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default VehicleInfoStep;

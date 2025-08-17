import React from 'react';
import { Vehicle } from '../../types';

interface Props {
  data: Partial<Vehicle>;
  onChange: (d: Partial<Vehicle>) => void;
}

const VehicleInfoStep: React.FC<Props> = ({ data, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  // Marka → Modeller
  const brandModels: Record<string, string[]> = {
    Toyota: ['Corolla', 'Yaris', 'Camry', 'Hilux', 'RAV4'],
    Volkswagen: ['Golf', 'Passat', 'Polo', 'Tiguan', 'Jetta'],
    Ford: ['Focus', 'Fiesta', 'Mondeo', 'Kuga', 'Transit'],
    Renault: ['Clio', 'Megane', 'Symbol', 'Kadjar', 'Talisman'],
    Opel: ['Astra', 'Corsa', 'Insignia', 'Mokka', 'Zafira'],
    Peugeot: ['208', '308', '3008', '5008', 'Partner'],
    Fiat: ['Egea', 'Linea', 'Doblo', 'Panda', '500'],
    Hyundai: ['i10', 'i20', 'i30', 'Tucson', 'Elantra'],
    Nissan: ['Micra', 'Qashqai', 'X-Trail', 'Juke', 'Navara'],
    Honda: ['Civic', 'Accord', 'CR-V', 'Jazz', 'HR-V'],
    BMW: ['3 Serisi', '5 Serisi', '7 Serisi', 'X3', 'X5'],
    'Mercedes-Benz': ['A Serisi', 'C Serisi', 'E Serisi', 'GLA', 'GLC'],
    Audi: ['A3', 'A4', 'A6', 'Q3', 'Q5'],
    Skoda: ['Fabia', 'Octavia', 'Superb', 'Kodiaq'],
    Seat: ['Ibiza', 'Leon', 'Ateca', 'Toledo'],
    Citroën: ['C3', 'C4', 'C5', 'Berlingo'],
    Kia: ['Rio', 'Ceed', 'Sportage', 'Sorento'],
    Mazda: ['Mazda 2', 'Mazda 3', 'Mazda 6', 'CX-5'],
  };

  const brands = Object.keys(brandModels);

  // 81 İl
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
    { code: '79', name: 'Kilis' }, { code: '80', name: 'Osmaniye' }, { code: '81', name: 'Düzce' },
  ];

  const h = (k: keyof Vehicle, v: any) => onChange({ ...data, [k]: v });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Araç Bilgileri</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plaka */}
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

        {/* Marka */}
        <div>
          <label>Marka *</label>
          <select
            value={data.brand || ''}
            onChange={e => {
              h('brand', e.target.value);
              h('model', ''); // marka değişince model sıfırlansın
            }}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Seçiniz</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div>
          <label>Model *</label>
          <select
            value={data.model || ''}
            onChange={e => h('model', e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
            disabled={!data.brand}
          >
            <option value="">Seçiniz</option>
            {data.brand && brandModels[data.brand]?.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Yıl */}
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

        {/* Motor Hacmi */}
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

        {/* Yakıt Tipi */}
        <div>
          <label>Yakıt Tipi</label>
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

        {/* Kullanım Amacı */}
        <div>
          <label>Kullanım Amacı</label>
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

        {/* Şehir */}
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

import React from 'react';
import { CreateDriverDto } from '../../types';

interface Props {
  data: Partial<CreateDriverDto>;
  onChange: (d: Partial<CreateDriverDto>) => void;
  lockCore?: boolean;           // Ad, Soyad, TC, Doğum tarihi kilidi
  onToggleLock?: () => void;
}

const DriverInfoStep: React.FC<Props> = ({ data, onChange, lockCore = false, onToggleLock }) => {
  const professions = ['Mühendis','Öğretmen','Doktor','Hemşire','Avukat','Muhasebeci','İşçi','Memur','Emekli','Öğrenci','Ev Hanımı','Serbest Meslek','İşveren','Esnaf','Çiftçi','Şoför','Diğer'];
  const h = (k: keyof CreateDriverDto, v: any) => onChange({ ...data, [k]: v });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Sürücü Bilgileri</h2>
        {onToggleLock && (
          <button
            type="button"
            onClick={onToggleLock}
            className={`text-sm px-3 py-1 rounded border ${lockCore ? 'bg-gray-100' : 'bg-white'}`}
            title="Müşteri bilgilerini kullan"
          >
            {lockCore ? 'Müşteri bilgilerini kullanılıyor' : 'Serbest düzenle'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label>Ad *</label>
          <input type="text" value={data.firstName||''} onChange={e=>h('firstName',e.target.value)} required className="w-full px-3 py-2 border rounded" disabled={lockCore}/>
        </div>
        <div>
          <label>Soyad *</label>
          <input type="text" value={data.lastName||''} onChange={e=>h('lastName',e.target.value)} required className="w-full px-3 py-2 border rounded" disabled={lockCore}/>
        </div>
        <div>
          <label>T.C. Kimlik *</label>
          <input type="text" value={data.tcNumber||''} onChange={e=>h('tcNumber',e.target.value.replace(/\D/g,'').slice(0,11))} maxLength={11} required className="w-full px-3 py-2 border rounded" disabled={lockCore}/>
        </div>
        <div>
          <label>Doğum Tarihi *</label>
          <input type="date" value={data.birthDate||''} onChange={e=>h('birthDate',e.target.value)} required className="w-full px-3 py-2 border rounded" disabled={lockCore}/>
        </div>

        <div>
          <label>Ehliyet Tarihi</label>
          <input type="date" value={data.licenseDate||''} onChange={e=>h('licenseDate',e.target.value)} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label>Cinsiyet</label>
          <select value={data.gender||''} onChange={e=>h('gender',e.target.value)} className="w-full px-3 py-2 border rounded">
            <option value="">Seçiniz</option>
            <option value="male">Erkek</option>
            <option value="female">Kadın</option>
          </select>
        </div>
        <div>
          <label>Medeni Durum</label>
          <select value={data.maritalStatus||''} onChange={e=>h('maritalStatus',e.target.value)} className="w-full px-3 py-2 border rounded">
            <option value="">Seçiniz</option>
            <option value="single">Bekar</option>
            <option value="married">Evli</option>
            <option value="divorced">Boşanmış</option>
            <option value="widowed">Dul</option>
          </select>
        </div>
        <div>
          <label>Eğitim</label>
          <select value={data.education||''} onChange={e=>h('education',e.target.value)} className="w-full px-3 py-2 border rounded">
            <option value="">Seçiniz</option>
            <option value="primary">İlkokul</option>
            <option value="secondary">Ortaokul</option>
            <option value="high_school">Lise</option>
            <option value="university">Üniversite</option>
            <option value="postgraduate">Yüksek Lisans/Doktora</option>
          </select>
        </div>
        <div>
          <label>Meslek</label>
          <select value={data.profession||''} onChange={e=>h('profession',e.target.value)} className="w-full px-3 py-2 border rounded">
            <option value="">Seçiniz</option>
            {professions.map(p=> <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Risk Bilgileri */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input type="checkbox" checked={!!data.hasAccidents} onChange={e=>h('hasAccidents',e.target.checked)} className="h-4 w-4 border rounded"/>
              <span className="ml-2">Son 5 yılda kaza geçirdim</span>
            </div>
            {!!data.hasAccidents && (
              <div className="flex items-center space-x-2">
                <span>Kaza Sayısı:</span>
                <select value={data.accidentCount ?? 0} onChange={e=>h('accidentCount',parseInt(e.target.value))} className="px-2 py-1 border rounded">
                  {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n === 5 ? '5+' : n}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input type="checkbox" checked={!!data.hasViolations} onChange={e=>h('hasViolations',e.target.checked)} className="h-4 w-4 border rounded"/>
              <span className="ml-2">Son 2 yılda trafik cezası aldım</span>
            </div>
            {!!data.hasViolations && (
              <div className="flex items-center space-x-2">
                <span>Ceza Sayısı:</span>
                <select value={data.violationCount ?? 0} onChange={e=>h('violationCount',parseInt(e.target.value))} className="px-2 py-1 border rounded">
                  {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n === 5 ? '5+' : n}</option>)}
                </select>
              </div>
            )}
          </div>

          {(data.hasAccidents || data.hasViolations) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <h3 className="text-yellow-800 font-medium mb-2">Risk Faktörleri</h3>
              <ul className="list-disc ml-6 text-yellow-700 space-y-2">
                {data.hasAccidents && <li>Son 5 yılda {data.accidentCount ?? 0} kaza geçirmiş</li>}
                {data.hasViolations && <li>Son 2 yılda {data.violationCount ?? 0} trafik cezası almış</li>}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverInfoStep;

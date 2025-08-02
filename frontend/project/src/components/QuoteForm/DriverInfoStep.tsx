import React from 'react'
import { Driver } from '../../types'

interface Props { data: Partial<Driver>; onChange: (d: Partial<Driver>) => void }

const DriverInfoStep: React.FC<Props> = ({ data, onChange }) => {
  const professions = ['Mühendis','Öğretmen','Doktor','Hemşire','Avukat','Muhasebeci','İşçi','Memur','Emekli','Öğrenci','Ev Hanımı','Serbest Meslek','İşveren','Esnaf','Çiftçi','Şoför','Diğer']
  const h = (k: keyof Driver, v: any) => onChange({ ...data, [k]: v })
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-semibold">Sürücü Bilgileri</h2></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label>Ad *</label>
          <input type="text" value={data.firstName||''} onChange={e=>h('firstName',e.target.value)} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label>Soyad *</label>
          <input type="text" value={data.lastName||''} onChange={e=>h('lastName',e.target.value)} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label>T.C. Kimlik *</label>
          <input type="text" value={data.tcNumber||''} onChange={e=>h('tcNumber',e.target.value.replace(/\D/g,'').slice(0,11))} maxLength={11} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label>Doğum Tarihi *</label>
          <input type="date" value={data.birthDate||''} onChange={e=>h('birthDate',e.target.value)} required className="w-full px-3 py-2 border rounded" />
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
        <div className="flex items-center space-x-2">
          <input type="checkbox" checked={data.hasAccidents||false} onChange={e=>h('hasAccidents',e.target.checked)} />
          <label>Son 5 yılda kaza</label>
        </div>
        {data.hasAccidents && (
          <select value={data.accidentCount||0} onChange={e=>h('accidentCount',parseInt(e.target.value))} className="px-2 py-1 border rounded">
            {[0,1,2,3].map(n=> <option key={n} value={n}>{n}</option>)}
          </select>
        )}
        <div className="flex items-center space-x-2">
          <input type="checkbox" checked={data.hasViolations||false} onChange={e=>h('hasViolations',e.target.checked)} />
          <label>Son 2 yılda ceza</label>
        </div>
        {data.hasViolations && (
          <select value={data.violationCount||0} onChange={e=>h('violationCount',parseInt(e.target.value))} className="px-2 py-1 border rounded">
            {[0,1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
          </select>
        )}
      </div>
    </div>
  )
}

export default DriverInfoStep

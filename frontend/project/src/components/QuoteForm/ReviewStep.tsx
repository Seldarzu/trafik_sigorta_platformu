import React from 'react'
import { Car, User, Shield, Clock, Loader2 } from 'lucide-react'
import { Vehicle, Driver } from '../../types'

interface Props {
  vehicleData: Partial<Vehicle>
  driverData: Partial<Driver>
  onSubmit: () => void
  isSubmitting: boolean
}

const ReviewStep: React.FC<Props> = ({ vehicleData, driverData, onSubmit, isSubmitting }) => {
  const mapFuel = { gasoline: 'Benzin', diesel: 'Dizel', lpg: 'LPG', electric: 'Elektrik', hybrid: 'Hibrit' }
  const mapUsage = { personal: 'Özel', commercial: 'Ticari', taxi: 'Taksi', truck: 'Kamyon' }
  const genderText = (g?: string) => g==='male'?'Erkek':g==='female'?'Kadın':''

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Teklif Özeti</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4"><Car className="h-5 w-5 text-blue-600 mr-2" /><h3 className="font-medium">Araç</h3></div>
          <p>Plaka: {vehicleData.plateNumber}</p>
          <p>Model: {vehicleData.brand} {vehicleData.model}</p>
          <p>Yıl: {vehicleData.year}</p>
          {vehicleData.engineSize && <p>Motor: {vehicleData.engineSize}</p>}
          {vehicleData.fuelType && <p>Yakıt: {mapFuel[vehicleData.fuelType]}</p>}
          {vehicleData.usage && <p>Kullanım: {mapUsage[vehicleData.usage]}</p>}
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4"><User className="h-5 w-5 text-blue-600 mr-2" /><h3 className="font-medium">Sürücü</h3></div>
          <p>Ad Soyad: {driverData.firstName} {driverData.lastName}</p>
          <p>TC: {driverData.tcNumber}</p>
          <p>Doğum: {driverData.birthDate}</p>
          {driverData.gender && <p>Cinsiyet: {genderText(driverData.gender)}</p>}
        </div>
      </div>
      {(driverData.hasAccidents||driverData.hasViolations) && (
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          {driverData.hasAccidents && <p>• {driverData.accidentCount} kaza</p>}
          {driverData.hasViolations && <p>• {driverData.violationCount} ceza</p>}
        </div>
      )}
      <div className="flex justify-center pt-6">
        <button onClick={onSubmit} disabled={isSubmitting} className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded">
          {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Hesaplanıyor…</> : <><Clock className="h-5 w-5 mr-2" /> Teklif Al</>}
        </button>
      </div>
    </div>
  )
}

export default ReviewStep

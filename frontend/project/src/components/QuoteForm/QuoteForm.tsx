import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { QuoteFormData, CreateQuoteDto, CreateVehicleDto, CreateDriverDto, Quote } from '../../types'
import { QuoteService } from '../../services/QuoteService'
import VehicleInfoStep from './VehicleInfoStep'
import DriverInfoStep from './DriverInfoStep'
import ReviewStep from './ReviewStep'
import StepIndicator from './StepIndicator'

interface QuoteFormProps {
  onBack: () => void
  onQuoteCreated: (quote: Quote) => void
}

const QuoteForm: React.FC<QuoteFormProps> = ({ onBack, onQuoteCreated }) => {
  const [formData, setFormData] = useState<QuoteFormData>({ vehicle: {}, driver: {}, currentStep: 1 })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps = [
    { number: 1, title: 'Araç Bilgileri', description: 'Sigortalanacak araç bilgilerini girin' },
    { number: 2, title: 'Sürücü Bilgileri', description: 'Sürücü ve risk bilgilerini girin' },
    { number: 3, title: 'Teklif Özeti', description: 'Bilgileri kontrol edin ve teklif alın' }
  ]

  const update = (s: 'vehicle' | 'driver', d: any) => {
    setFormData(f => ({ ...f, [s]: { ...f[s], ...d } }))
  }

  const next = () => {
    if (formData.currentStep === 1) setFormData(f => ({ ...f, currentStep: 2 }))
    if (formData.currentStep === 2) setFormData(f => ({ ...f, currentStep: 3 }))
  }

  const prev = () => {
    if (formData.currentStep === 3) setFormData(f => ({ ...f, currentStep: 2 }))
    if (formData.currentStep === 2) setFormData(f => ({ ...f, currentStep: 1 }))
  }

  const canProceed = () => {
    if (formData.currentStep === 1) {
      const v = formData.vehicle
      return !!(v.plateNumber && v.brand && v.model && v.year)
    }
    if (formData.currentStep === 2) {
      const d = formData.driver
      return !!(d.firstName && d.lastName && d.tcNumber && d.birthDate)
    }
    return true
  }

  const submit = async () => {
    setIsSubmitting(true)
    const dto: CreateQuoteDto = {
      customerId: '1',
      riskScore: 0,
      premiumAmount: 0,
      vehicle: formData.vehicle as CreateVehicleDto,
      driver: formData.driver as CreateDriverDto
    }
    const q = await QuoteService.create(dto)
    onQuoteCreated(q)
    setIsSubmitting(false)
  }

  const render = () => {
    if (formData.currentStep === 1) return <VehicleInfoStep data={formData.vehicle} onChange={d => update('vehicle', d)} />
    if (formData.currentStep === 2) return <DriverInfoStep data={formData.driver} onChange={d => update('driver', d)} />
    return <ReviewStep vehicleData={formData.vehicle} driverData={formData.driver} onSubmit={submit} isSubmitting={isSubmitting} />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={onBack} className="flex items-center text-sm mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" /> Geri
      </button>
      <h1 className="text-3xl font-bold mb-2">Yeni Trafik Sigortası Teklifi</h1>
      <p className="mb-6 text-gray-600">Aşağıdaki formu doldurarak teklif alabilirsiniz</p>
      <StepIndicator steps={steps} currentStep={formData.currentStep} />
      <div className="bg-white rounded-lg shadow border mt-8">
        <div className="px-6 py-8">{render()}</div>
        {formData.currentStep < 3 && (
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
            <button onClick={prev} disabled={formData.currentStep===1} className="px-4 py-2 bg-white border rounded">
              <ChevronLeft className="h-4 w-4 mr-1" /> Geri
            </button>
            <button onClick={next} disabled={!canProceed()} className="px-4 py-2 bg-blue-600 text-white rounded">
              İleri <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuoteForm

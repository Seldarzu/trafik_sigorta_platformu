// src/components/Customers/CustomerModal.tsx
import React, { useState, useEffect } from 'react'
import { X, Save, User, Mail, FileText } from 'lucide-react'
import { useMutation, useQueryClient } from 'react-query'
import { CustomerService } from '../../services/CustomerService'
import { Customer, CreateCustomerDto } from '../../types'

interface CustomerModalProps {
  customer: Customer | null
  onClose: () => void
}

const CustomerModal: React.FC<CustomerModalProps> = ({ customer, onClose }) => {
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<CreateCustomerDto>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    tcNumber: '',
    birthDate: '',
    address: '',
    city: '',
    status: 'potential',
    riskProfile: 'low',
    customerValue: 'bronze',
    notes: ''
  })

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName:      customer.firstName   ?? '',
        lastName:       customer.lastName    ?? '',
        email:          customer.email       ?? '',
        phone:          customer.phone       ?? '',
        tcNumber:       customer.tcNumber    ?? '',
        birthDate:      customer.birthDate   ?? '',
        address:        customer.address     ?? '',
        city:           customer.city        ?? '',
        status:         customer.status      ?? 'potential',
        riskProfile:    customer.riskProfile ?? 'low',
        customerValue:  customer.customerValue ?? 'bronze',
        notes:          customer.notes       ?? ''
      })
    }
  }, [customer])

  const mutation = useMutation<Customer, Error, CreateCustomerDto & { id?: string }>(
    data => customer?.id
      ? CustomerService.update(customer.id, data)
      : CustomerService.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('customers')
        onClose()
      }
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  const handleChange = <K extends keyof CreateCustomerDto>(field: K, value: CreateCustomerDto[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep',
    'Mersin', 'Diyarbakır', 'Kayseri', 'Eskişehir', 'Urfa', 'Malatya', 'Erzurum',
    'Van', 'Batman', 'Elazığ', 'İzmit', 'Manisa', 'Sivas', 'Gebze', 'Balıkesir',
    'Kahramanmaraş', 'Denizli', 'Sakarya', 'Uşak', 'Düzce', 'Osmaniye'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Başlık */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white flex justify-between items-center">
          <div className="flex items-center">
            <User className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-bold">
              {customer ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kişisel Bilgiler */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-500" /> Kişisel Bilgiler
              </h3>
              {/* Ad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={e => handleChange('firstName', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Soyad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soyad *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={e => handleChange('lastName', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* T.C. */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">T.C. No *</label>
                <input
                  type="text"
                  value={formData.tcNumber}
                  onChange={e => handleChange('tcNumber', e.target.value.replace(/\D/g,'').slice(0,11))}
                  maxLength={11}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Doğum Tarihi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={e => handleChange('birthDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* İletişim Bilgileri */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-green-500" /> İletişim Bilgileri
              </h3>
              {/* E-posta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Telefon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="+90 5XX XXX XX XX"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Şehir */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
                <select
                  value={formData.city}
                  onChange={e => handleChange('city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Şehir Seçiniz</option>
                  {cities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              {/* Adres */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                <textarea
                  value={formData.address}
                  onChange={e => handleChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Durum / Risk / Segment */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Durum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum *</label>
              <select
                value={formData.status}
                onChange={e => handleChange('status', e.target.value as any)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="potential">Potansiyel</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
            {/* Risk Profile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Profili *</label>
              <select
                value={formData.riskProfile}
                onChange={e => handleChange('riskProfile', e.target.value as any)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
              </select>
            </div>
            {/* Segment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Segment *</label>
              <select
                value={formData.customerValue}
                onChange={e => handleChange('customerValue', e.target.value as any)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>
          </div>

          {/* Notlar */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-purple-500" /> Notlar
            </label>
            <textarea
              value={formData.notes}
              onChange={e => handleChange('notes', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Butonlar */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 shadow-lg"
            >
              <Save className="h-5 w-5 mr-2" />
              {customer ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerModal

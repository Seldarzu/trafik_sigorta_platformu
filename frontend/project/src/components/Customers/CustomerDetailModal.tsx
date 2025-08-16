// src/components/Customers/CustomerDetailModal.tsx
import React, { useEffect, useState } from 'react'
import {
  X, Phone, Mail, MapPin, Calendar, User,
  Shield
} from 'lucide-react'
import { Customer, Policy } from '../../types'
import { policyService } from '../../services/policyService'

interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
  onEdit: () => void;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({ customer, onClose, onEdit }) => {
  const [policies, setPolicies] = useState<Policy[]>([])

  useEffect(() => {
    if (customer?.id) {
      policyService.getPoliciesByCustomer(customer.id).then(setPolicies)
    }
  }, [customer?.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-500'
      case 'inactive': return 'from-gray-500 to-slate-500'
      case 'potential': return 'from-orange-500 to-amber-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif Müşteri'
      case 'inactive': return 'Pasif Müşteri'
      case 'potential': return 'Potansiyel Müşteri'
      default: return status
    }
  }

  const totalPremium = customer.totalPremium ?? 0
  const totalPolicies = customer.totalPolicies ?? 0
  const averagePremium = totalPolicies > 0 ? Math.round(totalPremium / totalPolicies) : 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{customer.firstName} {customer.lastName}</h2>
              <p className="text-sm opacity-75">Müşteri ID: {customer.id}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Özet kartları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl bg-gradient-to-r ${getStatusColor(customer.status)} text-white`}>
              <p className="text-sm">Durum</p>
              <p className="text-xl font-bold">{getStatusText(customer.status)}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <p className="text-sm">Toplam Poliçe</p>
              <p className="text-xl font-bold">{totalPolicies}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <p className="text-sm">Ortalama Prim</p>
              <p className="text-xl font-bold">₺{averagePremium}</p>
            </div>
          </div>

          {/* Müşteri Detay Bilgileri */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Müşteri Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-blue-600" />
                <span>{customer.phone ?? '-'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>{customer.email ?? '-'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>{customer.city ?? '-'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>{customer.birthDate ? new Date(customer.birthDate).toLocaleDateString('tr-TR') : '-'}</span>
              </div>
            </div>
          </div>

          {/* Poliçe Listesi */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-indigo-500" />
              Müşteri Poliçeleri
            </h3>
            {policies.length === 0 ? (
              <p className="text-gray-600">Bu müşteriye ait poliçe bulunamadı.</p>
            ) : (
              <ul className="space-y-3">
                {policies.map(p => (
                  <li key={p.id} className="p-3 bg-white rounded-lg border flex justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{p.policyNumber}</p>
                      <p className="text-sm text-gray-600">{p.companyName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Başlangıç: {p.startDate ? new Date(p.startDate).toLocaleDateString('tr-TR') : '-'}</p>
                      <p className="text-sm text-gray-600">Bitiş: {p.endDate ? new Date(p.endDate).toLocaleDateString('tr-TR') : '-'}</p>
                      <p className="text-sm font-medium text-green-600">₺{p.finalPremium}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Butonlar */}
          <div className="flex justify-end space-x-4">
            <button onClick={onClose} className="px-6 py-3 border rounded-lg">Kapat</button>
            <button onClick={onEdit} className="px-6 py-3 bg-blue-600 text-white rounded-lg">Düzenle</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetailModal

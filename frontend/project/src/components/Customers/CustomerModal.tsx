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
        firstName:      customer.firstName,
        lastName:       customer.lastName,
        email:          customer.email,
        phone:          customer.phone,
        tcNumber:       customer.tcNumber,
        birthDate:      customer.birthDate,
        address:        customer.address,
        city:           customer.city,
        status:         customer.status,
        riskProfile:    customer.riskProfile,
        customerValue:  customer.customerValue,
        notes:          customer.notes
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
    setFormData((prev: CreateCustomerDto) => ({ ...prev, [field]: value }))
  }

  const cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya',
    'Adana', 'Konya', 'Gaziantep', 'Mersin', 'Diyarbakır',
    'Kayseri', 'Eskişehir', 'Urfa', 'Malatya', 'Erzurum',
    'Van', 'Batman', 'Elazığ', 'İzmit', 'Manisa'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
        <form onSubmit={handleSubmit} className="p-6">
          {/* … form alanları tam işlevsel olarak burada yer alacak */}
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

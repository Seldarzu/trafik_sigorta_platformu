// src/components/Customers/CustomerModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, FileText, MapPin, Phone } from 'lucide-react';
import { useMutation, useQueryClient } from 'react-query';
import { CustomerService } from '../../services/CustomerService';
import { Customer, CreateCustomerDto } from '../../types';

interface CustomerModalProps {
  customer: Customer | null;
  onClose: () => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ customer, onClose }) => {
  const queryClient = useQueryClient();

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
    notes: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        tcNumber: customer.tcNumber,
        birthDate: customer.birthDate?.slice(0, 10) ?? '', // input[type=date] uyumu
        address: customer.address ?? '',
        city: customer.city ?? '',
        status: customer.status as CreateCustomerDto['status'],
        riskProfile: customer.riskProfile,
        customerValue: customer.customerValue,
        notes: customer.notes ?? '',
      });
    } else {
      setFormData((prev) => ({ ...prev, birthDate: '' }));
    }
  }, [customer]);

  const mutation = useMutation(
    async () => {
      if (customer?.id) {
        return CustomerService.update(customer.id, formData);
      }
      return CustomerService.create(formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['customers']);
        onClose();
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const handleChange = <K extends keyof CreateCustomerDto>(field: K, value: CreateCustomerDto[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const cities = [
    'İstanbul','Ankara','İzmir','Bursa','Antalya','Adana','Konya','Gaziantep','Mersin','Diyarbakır','Kayseri',
    'Eskişehir','Urfa','Malatya','Erzurum','Van','Batman','Elazığ','Kocaeli','Manisa'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Ad Soyad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ad</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Soyad</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          {/* İletişim */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center">
                <Mail className="h-4 w-4 mr-1" /> E-posta
              </label>
              <input
                type="email"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center">
                <Phone className="h-4 w-4 mr-1" /> Telefon
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Kimlik & Doğum */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">T.C. Kimlik No</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={formData.tcNumber}
                onChange={(e) => handleChange('tcNumber', e.target.value)}
                required
                maxLength={11}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Doğum Tarihi</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.birthDate}
                onChange={(e) => handleChange('birthDate', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Adres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center">
                <MapPin className="h-4 w-4 mr-1" /> Şehir
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={formData.city ?? ''}
                onChange={(e) => handleChange('city', e.target.value)}
              >
                <option value="">Seçiniz</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Adres</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={formData.address ?? ''}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>
          </div>

          {/* Statüler */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Durum</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as CreateCustomerDto['status'])}
              >
                <option value="potential">Potansiyel</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Risk Profili</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={formData.riskProfile}
                onChange={(e) => handleChange('riskProfile', e.target.value as CreateCustomerDto['riskProfile'])}
              >
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Müşteri Segmenti</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={formData.customerValue}
                onChange={(e) => handleChange('customerValue', e.target.value as CreateCustomerDto['customerValue'])}
              >
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>
          </div>

          {/* Notlar */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center">
              <FileText className="h-4 w-4 mr-1" /> Notlar
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2"
              value={formData.notes ?? ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              placeholder="Müşteri hakkında kısa notlar…"
            />
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 shadow-lg disabled:opacity-60"
            >
              <Save className="h-5 w-5 mr-2" />
              {customer ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;

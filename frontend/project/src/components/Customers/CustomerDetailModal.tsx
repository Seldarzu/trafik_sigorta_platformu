import React from 'react';
import { X, Edit, Phone, Mail, MapPin, Calendar, User, Award, TrendingUp, FileText, Star, Shield } from 'lucide-react';
import { Customer } from '../../types';

interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
  onEdit: () => void;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({ customer, onClose, onEdit }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'from-green-500 to-emerald-500';
      case 'inactive':
        return 'from-gray-500 to-slate-500';
      case 'potential':
        return 'from-orange-500 to-amber-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif Müşteri';
      case 'inactive':
        return 'Pasif Müşteri';
      case 'potential':
        return 'Potansiyel Müşteri';
      default:
        return status;
    }
  };

  const getValueColor = (value: string) => {
    switch (value) {
      case 'platinum':
        return 'from-purple-500 to-indigo-500';
      case 'gold':
        return 'from-yellow-500 to-orange-500';
      case 'silver':
        return 'from-gray-400 to-gray-500';
      case 'bronze':
        return 'from-amber-600 to-orange-600';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getValueText = (value: string) => {
    switch (value) {
      case 'platinum':
        return 'Platinum Müşteri';
      case 'gold':
        return 'Gold Müşteri';
      case 'silver':
        return 'Silver Müşteri';
      case 'bronze':
        return 'Bronze Müşteri';
      default:
        return value;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'from-green-500 to-emerald-500';
      case 'medium':
        return 'from-yellow-500 to-orange-500';
      case 'high':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'Düşük Risk';
      case 'medium':
        return 'Orta Risk';
      case 'high':
        return 'Yüksek Risk';
      default:
        return risk;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getValueColor(customer.customerValue)} p-6 text-white relative`}>
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
              <p className="text-lg opacity-90">{getValueText(customer.customerValue)}</p>
              <p className="text-sm opacity-75">Müşteri ID: {customer.id}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className={`p-4 rounded-xl bg-gradient-to-r ${getStatusColor(customer.status)} text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Durum</p>
                  <p className="text-xl font-bold">{getStatusText(customer.status)}</p>
                </div>
                <Shield className="h-8 w-8 opacity-80" />
              </div>
            </div>

            <div className={`p-4 rounded-xl bg-gradient-to-r ${getRiskColor(customer.riskProfile)} text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Risk Profili</p>
                  <p className="text-xl font-bold">{getRiskText(customer.riskProfile)}</p>
                </div>
                <TrendingUp className="h-8 w-8 opacity-80" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Toplam Poliçe</p>
                  <p className="text-xl font-bold">{customer.totalPolicies}</p>
                </div>
                <FileText className="h-8 w-8 opacity-80" />
              </div>
            </div>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <User className="h-6 w-6 mr-2 text-blue-500" />
                Kişisel Bilgiler
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Ad Soyad</p>
                    <p className="font-semibold text-gray-900">{customer.firstName} {customer.lastName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">T.C. Kimlik No</p>
                    <p className="font-semibold text-gray-900">{customer.tcNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Doğum Tarihi</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(customer.birthDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Phone className="h-6 w-6 mr-2 text-green-500" />
                İletişim Bilgileri
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">E-posta</p>
                    <p className="font-semibold text-gray-900">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Telefon</p>
                    <p className="font-semibold text-gray-900">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Şehir</p>
                    <p className="font-semibold text-gray-900">{customer.city}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          {customer.address && (
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-6 w-6 mr-2 text-purple-500" />
                Adres Bilgileri
              </h3>
              <p className="text-gray-700">{customer.address}</p>
            </div>
          )}

          {/* Financial Summary */}
          <div className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Award className="h-6 w-6 mr-2 text-orange-500" />
              Finansal Özet
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{customer.totalPolicies}</div>
                <div className="text-sm text-gray-600">Toplam Poliçe</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ₺{customer.totalPremium.toLocaleString('tr-TR')}
                </div>
                <div className="text-sm text-gray-600">Toplam Prim</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ₺{customer.totalPolicies > 0 ? Math.round(customer.totalPremium / customer.totalPolicies).toLocaleString('tr-TR') : '0'}
                </div>
                <div className="text-sm text-gray-600">Ortalama Prim</div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-indigo-500" />
              Aktivite Geçmişi
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Müşteri Kaydı</p>
                    <p className="text-sm text-gray-600">Sisteme kayıt oldu</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(customer.registrationDate).toLocaleDateString('tr-TR')}
                </span>
              </div>
              
              {customer.lastPolicyDate && (
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Son Poliçe</p>
                      <p className="text-sm text-gray-600">Poliçe satın aldı</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(customer.lastPolicyDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {customer.notes && (
            <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-yellow-500" />
                Notlar
              </h3>
              <p className="text-gray-700 italic">"{customer.notes}"</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Kapat
            </button>
            <button
              onClick={onEdit}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Edit className="h-5 w-5 mr-2" />
              Düzenle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;
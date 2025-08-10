// src/components/Policies/PolicyCard.tsx
import React from 'react';
import { Eye, Download, Calendar, Car, User, DollarSign, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Policy } from '../../types';

interface PolicyCardProps {
  policy: Policy;
  onSelect: (policy: Policy) => void;
  onRenew: (policyId: string) => void;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ policy, onSelect, onRenew }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'expired': return 'Süresi Dolmuş';
      case 'pending': return 'Beklemede';
      case 'cancelled': return 'İptal Edilmiş';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Ödendi';
      case 'pending': return 'Beklemede';
      case 'overdue': return 'Gecikmiş';
      default: return status;
    }
  };

  const endDate = new Date(policy.endDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  const isExpired = endDate < today;

  return (
    <div className={`bg-white border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
      isExpired ? 'border-red-200 bg-red-50' : isExpiringSoon ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-bold text-gray-900">{policy.policyNumber}</h3>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(policy.status)}`}>
                {getStatusText(policy.status)}
              </span>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${getPaymentStatusColor(policy.paymentStatus)}`}>
                {getPaymentStatusText(policy.paymentStatus)}
              </span>
            </div>

            {isExpiringSoon && !isExpired && (
              <div className="flex items-center text-yellow-600 text-sm mb-2">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Poliçe yakında sona erecek
              </div>
            )}

            {isExpired && (
              <div className="flex items-center text-red-600 text-sm mb-2">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Poliçe süresi dolmuş
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSelect(policy)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
              title="Detayları Görüntüle"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors duration-200"
              title="PDF İndir"
            >
              <Download className="h-5 w-5" />
            </button>
            {(isExpired || isExpiringSoon) && (
              <button
                onClick={() => onRenew(policy.id)}
                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors duration-200"
                title="Poliçeyi Yenile"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <Car className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {policy.vehicle.brand} {policy.vehicle.model}
              </p>
              <p className="text-xs text-gray-500">
                {policy.vehicle.plateNumber} • {policy.vehicle.year}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {policy.driver.firstName} {policy.driver.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {policy.driver.profession ?? ''}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <DollarSign className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                ₺{(policy.finalPremium ?? 0).toLocaleString('tr-TR')}
              </p>
              {(policy.totalDiscount ?? 0) > 0 && (
                <p className="text-xs text-green-600">
                  ₺{(policy.totalDiscount ?? 0).toLocaleString('tr-TR')} indirim
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-purple-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {new Date(policy.startDate).toLocaleDateString('tr-TR')}
              </p>
              <p className="text-xs text-gray-500">
                Bitiş: {new Date(policy.endDate).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <span>Sigorta Şirketi: <span className="font-medium">{policy.companyName ?? '-'}</span></span>
            <span>Teminat: <span className="font-medium">₺{(policy.coverageAmount ?? 0).toLocaleString('tr-TR')}</span></span>
            {policy.isAutoRenewal && (
              <span className="inline-flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Otomatik Yenileme
              </span>
            )}
          </div>
        </div>

        {(policy.discounts?.length ?? 0) > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Uygulanan İndirimler:</p>
            <div className="flex flex-wrap gap-2">
              {policy.discounts!.map((d, i) => (
                <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {d.name} (%{d.percentage})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyCard;

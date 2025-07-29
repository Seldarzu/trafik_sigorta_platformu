// src/components/Customers/CustomerCard.tsx
import React from 'react';
import { Phone, Mail, MapPin, Edit, Eye, Star, Award, TrendingUp, Calendar } from 'lucide-react';
import { Customer } from '../../types';

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onView: (customer: Customer) => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onEdit, onView }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-500';
      case 'inactive': return 'from-gray-500 to-slate-500';
      case 'potential': return 'from-orange-500 to-amber-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Pasif';
      case 'potential': return 'Potansiyel';
      default: return status;
    }
  };

  const getValueColor = (value: string) => {
    switch (value) {
      case 'platinum': return 'from-purple-500 to-indigo-500';
      case 'gold': return 'from-yellow-500 to-orange-500';
      case 'silver': return 'from-gray-400 to-gray-500';
      case 'bronze': return 'from-amber-600 to-orange-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getValueText = (value: string) => {
    switch (value) {
      case 'platinum': return 'Platinum';
      case 'gold': return 'Gold';
      case 'silver': return 'Silver';
      case 'bronze': return 'Bronze';
      default: return value;
    }
  };

  const getValueIcon = (value: string) => {
    switch (value) {
      case 'platinum':
      case 'gold':
        return Award;
      case 'silver':
        return Star;
      default:
        return TrendingUp;
    }
  };

  const ValueIcon = getValueIcon(customer.customerValue);

  // Safely default undefined numbers to 0
  const policiesCount = customer.totalPolicies ?? 0;
  const premiumAmount = customer.totalPremium ?? 0;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Header */}
      <div className={`h-20 bg-gradient-to-r ${getValueColor(customer.customerValue)} relative`}>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getStatusColor(customer.status)}`}>
            {getStatusText(customer.status)}
          </span>
        </div>
        <div className="absolute -bottom-6 left-6">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <ValueIcon className="h-6 w-6 text-gray-700" />
          </div>
        </div>
      </div>

      <div className="pt-8 p-6">
        {/* Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {customer.firstName} {customer.lastName}
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getValueColor(customer.customerValue)}`}>
              {getValueText(customer.customerValue)}
            </span>
            <span className="text-sm text-gray-500">#{customer.id}</span>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2 text-blue-500" />
            <span className="truncate">{customer.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2 text-green-500" />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-red-500" />
            <span>{customer.city}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{policiesCount}</p>
            <p className="text-xs text-gray-600">Poliçe</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <p className="text-lg font-bold text-green-600">₺{premiumAmount.toLocaleString('tr-TR')}</p>
            <p className="text-xs text-gray-600">Toplam Prim</p>
          </div>
        </div>

        {/* Last Policy Date */}
        {customer.lastPolicyDate && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Son poliçe: {new Date(customer.lastPolicyDate).toLocaleDateString('tr-TR')}</span>
          </div>
        )}

        {/* Notes */}
        {customer.notes && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">
              "{customer.notes}"
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onView(customer)}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
          >
            <Eye className="h-4 w-4 mr-2" />
            Görüntüle
          </button>
          <button
            onClick={() => onEdit(customer)}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;

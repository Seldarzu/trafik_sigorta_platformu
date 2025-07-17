import React from 'react';
import { Eye, Download, Calendar, Car, User, DollarSign, AlertTriangle, GitCompare, Check } from 'lucide-react';
import { Quote } from '../../types';

interface QuoteCardProps {
  quote: Quote;
  onSelect: (quote: Quote) => void;
  onToggleCompare?: (quote: Quote) => void;
  isSelected?: boolean;
  canSelect?: boolean;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ 
  quote, 
  onSelect, 
  onToggleCompare, 
  isSelected = false, 
  canSelect = true 
}) => {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low':
        return 'Düşük Risk';
      case 'medium':
        return 'Orta Risk';
      case 'high':
        return 'Yüksek Risk';
      default:
        return 'Belirsiz';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      case 'sold':
        return 'text-blue-600 bg-blue-100';
      case 'draft':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'expired':
        return 'Süresi Dolmuş';
      case 'sold':
        return 'Satıldı';
      case 'draft':
        return 'Taslak';
      default:
        return status;
    }
  };

  const isExpiringSoon = () => {
    const validUntil = new Date(quote.validUntil);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((validUntil.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  return (
    <div className={`bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
      isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{quote.id}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quote.status)}`}>
                {getStatusText(quote.status)}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(quote.riskLevel)}`}>
                {getRiskLevelText(quote.riskLevel)}
              </span>
            </div>
            {isExpiringSoon() && (
              <div className="flex items-center text-orange-600 text-sm mb-2">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Teklif yakında sona erecek
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(quote)}
                disabled={!canSelect && !isSelected}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isSelected
                    ? 'text-blue-600 bg-blue-100 hover:bg-blue-200'
                    : canSelect
                    ? 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
                title={isSelected ? 'Karşılaştırmadan çıkar' : 'Karşılaştırmaya ekle'}
              >
                {isSelected ? <Check className="h-5 w-5" /> : <GitCompare className="h-5 w-5" />}
              </button>
            )}
            <button
              onClick={() => onSelect(quote)}
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Araç Bilgileri */}
          <div className="flex items-center space-x-3">
            <Car className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {quote.vehicle.brand} {quote.vehicle.model}
              </p>
              <p className="text-xs text-gray-500">
                {quote.vehicle.plateNumber} • {quote.vehicle.year}
              </p>
            </div>
          </div>

          {/* Sürücü Bilgileri */}
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {quote.driver.firstName} {quote.driver.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {quote.driver.profession}
              </p>
            </div>
          </div>

          {/* Prim Bilgileri */}
          <div className="flex items-center space-x-3">
            <DollarSign className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                ₺{quote.finalPremium.toLocaleString('tr-TR')}
              </p>
              {quote.totalDiscount > 0 && (
                <p className="text-xs text-green-600">
                  ₺{quote.totalDiscount.toLocaleString('tr-TR')} indirim
                </p>
              )}
            </div>
          </div>

          {/* Tarih Bilgileri */}
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-purple-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {new Date(quote.createdAt).toLocaleDateString('tr-TR')}
              </p>
              <p className="text-xs text-gray-500">
                Geçerli: {new Date(quote.validUntil).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
        </div>

        {/* Alt Bilgiler */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Sigorta Şirketi: <span className="font-medium">{quote.companyName}</span></span>
            <span>Risk Skoru: <span className="font-medium">{quote.riskScore}/100</span></span>
            <span>Teminat: <span className="font-medium">₺{quote.coverageAmount.toLocaleString('tr-TR')}</span></span>
          </div>
        </div>

        {/* İndirimler */}
        {quote.discounts.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Uygulanan İndirimler:</p>
            <div className="flex flex-wrap gap-2">
              {quote.discounts.map((discount, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
                >
                  {discount.name} (%{discount.percentage})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteCard;
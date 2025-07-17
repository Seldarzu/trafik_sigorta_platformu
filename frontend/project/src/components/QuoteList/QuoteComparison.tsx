import React from 'react';
import { X, Car, User, Shield, DollarSign, Calendar, Award, TrendingUp, AlertTriangle } from 'lucide-react';
import { Quote } from '../../types';

interface QuoteComparisonProps {
  quotes: Quote[];
  onClose: () => void;
}

const QuoteComparison: React.FC<QuoteComparisonProps> = ({ quotes, onClose }) => {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
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
        return 'from-green-500 to-emerald-500';
      case 'expired':
        return 'from-red-500 to-pink-500';
      case 'sold':
        return 'from-blue-500 to-cyan-500';
      case 'draft':
        return 'from-gray-500 to-slate-500';
      default:
        return 'from-gray-500 to-slate-500';
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

  const getBestValue = (field: 'finalPremium' | 'riskScore') => {
    if (field === 'finalPremium') {
      return Math.min(...quotes.map(q => q.finalPremium));
    } else {
      return Math.max(...quotes.map(q => q.riskScore));
    }
  };

  const isBestValue = (quote: Quote, field: 'finalPremium' | 'riskScore') => {
    const bestValue = getBestValue(field);
    return quote[field] === bestValue;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <TrendingUp className="h-7 w-7 mr-3" />
                Teklif Karşılaştırması
              </h2>
              <p className="text-blue-100 mt-1">{quotes.length} teklif karşılaştırılıyor</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <td className="p-4 font-semibold text-gray-700 border-b-2 border-gray-200">
                    Özellik
                  </td>
                  {quotes.map((quote) => (
                    <td key={quote.id} className="p-4 border-b-2 border-gray-200">
                      <div className="text-center">
                        <div className="font-bold text-lg text-gray-900 mb-2">{quote.id}</div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getStatusColor(quote.status)} text-white`}>
                          {getStatusText(quote.status)}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Prim Bilgileri */}
                <tr className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <td className="p-4 font-semibold text-gray-900 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Net Prim
                  </td>
                  {quotes.map((quote) => (
                    <td key={quote.id} className="p-4 text-center">
                      <div className={`text-2xl font-bold ${
                        isBestValue(quote, 'finalPremium') ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        ₺{quote.finalPremium.toLocaleString('tr-TR')}
                      </div>
                      {isBestValue(quote, 'finalPremium') && (
                        <div className="text-xs text-green-600 font-medium mt-1 flex items-center justify-center">
                          <Award className="h-3 w-3 mr-1" />
                          En Uygun
                        </div>
                      )}
                      {quote.totalDiscount > 0 && (
                        <div className="text-sm text-green-600 mt-1">
                          ₺{quote.totalDiscount.toLocaleString('tr-TR')} indirim
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Sigorta Şirketi */}
                <tr>
                  <td className="p-4 font-semibold text-gray-900">Sigorta Şirketi</td>
                  {quotes.map((quote) => (
                    <td key={quote.id} className="p-4 text-center">
                      <div className="font-medium text-gray-900">{quote.companyName}</div>
                    </td>
                  ))}
                </tr>

                {/* Risk Skoru */}
                <tr className="bg-gradient-to-r from-orange-50 to-red-50">
                  <td className="p-4 font-semibold text-gray-900 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-orange-600" />
                    Risk Skoru
                  </td>
                  {quotes.map((quote) => (
                    <td key={quote.id} className="p-4 text-center">
                      <div className={`text-xl font-bold ${
                        isBestValue(quote, 'riskScore') ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {quote.riskScore}/100
                      </div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRiskLevelColor(quote.riskLevel)} text-white mt-1`}>
                        {getRiskLevelText(quote.riskLevel)}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Araç Bilgileri */}
                <tr className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <td className="p-4 font-semibold text-gray-900 flex items-center">
                    <Car className="h-5 w-5 mr-2 text-blue-600" />
                    Araç
                  </td>
                  {quotes.map((quote) => (
                    <td key={quote.id} className="p-4 text-center">
                      <div className="font-medium text-gray-900">
                        {quote.vehicle.brand} {quote.vehicle.model}
                      </div>
                      <div className="text-sm text-gray-600">{quote.vehicle.year}</div>
                      <div className="text-sm text-gray-600">{quote.vehicle.plateNumber}</div>
                    </td>
                  ))}
                </tr>

                {/* Sürücü Bilgileri */}
                <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <td className="p-4 font-semibold text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2 text-purple-600" />
                    Sürücü
                  </td>
                  {quotes.map((quote) => (
                    <td key={quote.id} className="p-4 text-center">
                      <div className="font-medium text-gray-900">
                        {quote.driver.firstName} {quote.driver.lastName}
                      </div>
                      <div className="text-sm text-gray-600">{quote.driver.profession}</div>
                      {(quote.driver.hasAccidents || quote.driver.hasViolations) && (
                        <div className="flex items-center justify-center mt-1">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-xs text-yellow-600">Risk Faktörü</span>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Teminat Tutarı */}
                <tr>
                  <td className="p-4 font-semibold text-gray-900">Teminat Tutarı</td>
                  {quotes.map((quote) => (
                    <td key={quote.id} className="p-4 text-center">
                      <div className="font-medium text-gray-900">
                        ₺{quote.coverageAmount.toLocaleString('tr-TR')}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Geçerlilik Tarihi */}
                <tr className="bg-gray-50">
                  <td className="p-4 font-semibold text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                    Geçerlilik
                  </td>
                  {quotes.map((quote) => (
                    <td key={quote.id} className="p-4 text-center">
                      <div className="text-sm text-gray-900">
                        {new Date(quote.validUntil).toLocaleDateString('tr-TR')}
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(quote.createdAt).toLocaleDateString('tr-TR')} tarihinde oluşturuldu
                      </div>
                    </td>
                  ))}
                </tr>

                {/* İndirimler */}
                <tr className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <td className="p-4 font-semibold text-gray-900 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-green-600" />
                    İndirimler
                  </td>
                  {quotes.map((quote) => (
                    <td key={quote.id} className="p-4 text-center">
                      {quote.discounts.length > 0 ? (
                        <div className="space-y-1">
                          {quote.discounts.map((discount, index) => (
                            <div key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              {discount.name} (%{discount.percentage})
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">İndirim yok</div>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Karşılaştırma Özeti
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-green-600 mb-2">En Uygun Prim</h4>
                {(() => {
                  const bestPriceQuote = quotes.find(q => isBestValue(q, 'finalPremium'));
                  return bestPriceQuote ? (
                    <div>
                      <div className="font-bold text-lg">{bestPriceQuote.id}</div>
                      <div className="text-green-600">₺{bestPriceQuote.finalPremium.toLocaleString('tr-TR')}</div>
                      <div className="text-sm text-gray-600">{bestPriceQuote.companyName}</div>
                    </div>
                  ) : null;
                })()}
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-2">En Yüksek Risk Skoru</h4>
                {(() => {
                  const bestRiskQuote = quotes.find(q => isBestValue(q, 'riskScore'));
                  return bestRiskQuote ? (
                    <div>
                      <div className="font-bold text-lg">{bestRiskQuote.id}</div>
                      <div className="text-blue-600">{bestRiskQuote.riskScore}/100</div>
                      <div className="text-sm text-gray-600">{getRiskLevelText(bestRiskQuote.riskLevel)}</div>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Kapat
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl">
              PDF Olarak İndir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteComparison;
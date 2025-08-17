// src/components/InsuranceComparison/CompanyCard.tsx
import React from 'react';
import { Shield, Star, Award, CheckCircle, Phone, Globe } from 'lucide-react';
import { Quote, InsuranceCompany } from '../../types';

export interface CompanyCardProps {
  quote: Quote;
  company: InsuranceCompany;
  onSelect: () => void | Promise<void>;
  isSelected?: boolean;
  isBestPrice?: boolean;
  isBestCoverage?: boolean;
  selecting?: boolean;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  quote,
  company,
  onSelect,
  isSelected = false,
  isBestPrice = false,
  isBestCoverage = false,
  selecting = false,
}) => {
  const getRiskLevelColor = (level?: string) => {
    switch (level) {
      case 'low': return 'from-green-500 to-emerald-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'high': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getRiskLevelText = (level?: string) => {
    switch (level) {
      case 'low': return 'Düşük Risk';
      case 'medium': return 'Orta Risk';
      case 'high': return 'Yüksek Risk';
      default: return 'Belirsiz';
    }
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));

  return (
    <div
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
    >
      {/* Header with badges */}
      <div className="relative p-6 pb-4">
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          {isBestPrice && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <Award className="h-3 w-3 mr-1" />
              En Uygun
            </span>
          )}
          {isBestCoverage && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <Shield className="h-3 w-3 mr-1" />
              En İyi Teminat
            </span>
          )}
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {renderStars(company.contactInfo?.rating || 4)}
              </div>
              <span className="text-sm text-gray-600">({company.contactInfo?.rating || 4}/5)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="px-6 pb-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Net Prim</span>
            <span className="text-2xl font-bold text-green-600">
              ₺{Number(quote.finalPremium || 0).toLocaleString('tr-TR')}
            </span>
          </div>
          {Number(quote.totalDiscount || 0) > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">İndirim</span>
              <span className="text-green-600 font-medium">
                -₺{Number(quote.totalDiscount || 0).toLocaleString('tr-TR')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Coverage highlights */}
      <div className="px-6 pb-4">
        <h4 className="font-semibold text-gray-900 mb-3">Teminat Özeti</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Kişi Başı Bedeni:</span>
            <span className="font-medium">
              ₺{Number(quote.coverageDetails?.personalInjuryPerPerson || 500000).toLocaleString('tr-TR')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Maddi Zarar:</span>
            <span className="font-medium">
              ₺{Number(quote.coverageDetails?.propertyDamage || 200000).toLocaleString('tr-TR')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Hukuki Koruma:</span>
            <span className="font-medium">
              {quote.coverageDetails?.legalProtection ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <span className="text-red-500">Yok</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Risk */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Risk Değerlendirmesi</span>
          <span className="text-sm font-bold text-gray-900">{quote.riskScore ?? 0}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${getRiskLevelColor(quote.riskLevel)}`}
            style={{ width: `${quote.riskScore ?? 0}%` }}
          />
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRiskLevelColor(quote.riskLevel)} text-white`}>
          {getRiskLevelText(quote.riskLevel)}
        </span>
      </div>

      {/* Contact */}
      <div className="px-6 pb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-1" />
            <span>{company.contactInfo?.phone}</span>
          </div>
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-1" />
            <span>Website</span>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="px-6 pb-6">
        <button
          onClick={onSelect}
          disabled={selecting}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            isSelected
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${selecting ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {selecting ? 'Seçiliyor…' : isSelected ? (
            <span className="flex items-center justify-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Seçildi
            </span>
          ) : (
            'Bu Şirketi Seç'
          )}
        </button>
      </div>
    </div>
  );
};

export default CompanyCard;

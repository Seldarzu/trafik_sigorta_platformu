import React from 'react';
import { Shield, CheckCircle, X, Info } from 'lucide-react';
import { Quote, InsuranceCompany } from '../../types';

interface CoverageComparisonProps {
  quotes: Quote[];
  companies: InsuranceCompany[];
}

const CoverageComparison: React.FC<CoverageComparisonProps> = ({ quotes }) => {
  const coverageItems = [
    { key: 'personalInjuryPerPerson',   label: 'Kişi Başı Bedeni Zarar',  description: 'Bir kişinin uğrayabileceği maksimum bedeni zarar teminatı', unit: '₺', type: 'amount' },
    { key: 'personalInjuryPerAccident', label: 'Kaza Başı Bedeni Zarar',  description: 'Bir kazada toplam bedeni zarar teminatı', unit: '₺', type: 'amount' },
    { key: 'propertyDamage',            label: 'Maddi Zarar Teminatı',    description: 'Maddi hasarlar için teminat tutarı', unit: '₺', type: 'amount' },
    { key: 'medicalExpenses',           label: 'Tedavi Masrafları',        description: 'Tıbbi tedavi masrafları teminatı', unit: '₺', type: 'amount' },
    { key: 'legalProtection',           label: 'Hukuki Koruma',            description: 'Hukuki süreçlerde destek', unit: '', type: 'boolean' },
    { key: 'roadAssistance',            label: 'Yol Yardımı',              description: '7/24 yol yardım hizmeti', unit: '', type: 'boolean' },
    { key: 'replacementVehicle',        label: 'Yedek Araç',               description: 'Hasar durumunda yedek araç hizmeti', unit: '', type: 'boolean' },
    { key: 'personalAccident',          label: 'Ferdi Kaza Teminatı',      description: 'Sürücü için ferdi kaza teminatı', unit: '₺', type: 'amount' },
  ];

  const getBestValue = (key: string, type: string) => {
    if (!quotes.length) return 0;
    if (type === 'amount') {
      return Math.max(...quotes.map(q => (q.coverageDetails as any)?.[key] || 0));
    }
    return quotes.some(q => (q.coverageDetails as any)?.[key]);
  };

  const isBestValue = (quote: Quote, key: string, type: string) => {
    const value = (quote.coverageDetails as any)?.[key];
    const bestValue = getBestValue(key, type);
    if (type === 'amount') return value === bestValue && value > 0;
    return value === true && bestValue === true;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Teminat Karşılaştırması</h2>
        <p className="text-gray-600">Sigorta şirketlerinin sunduğu teminatları detaylı olarak karşılaştırın</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <th className="px-6 py-4 text-left font-semibold">Teminat Türü</th>
              {quotes.map((quote) => (
                <th key={quote.id} className="px-6 py-4 text-center font-semibold min-w-[150px]">
                  <div className="flex flex-col items-center">
                    <span className="text-sm">{quote.companyName}</span>
                    <span className="text-xs opacity-75 mt-1">
                      ₺{(quote.finalPremium ?? 0).toLocaleString('tr-TR')}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coverageItems.map((item, index) => (
              <tr key={item.key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.label}</h4>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                </td>
                {quotes.map((quote) => {
                  const value = (quote.coverageDetails as any)?.[item.key];
                  const isHighlighted = isBestValue(quote, item.key, item.type);
                  return (
                    <td key={quote.id} className="px-6 py-4 text-center">
                      <div className={`inline-flex items-center justify-center px-3 py-2 rounded-lg ${
                        isHighlighted ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.type === 'boolean' ? (
                          value ? <CheckCircle className="h-5 w-5 text-current" /> : <X className="h-5 w-5 text-current" />
                        ) : (
                          <span>{value > 0 ? `${item.unit}${value.toLocaleString('tr-TR')}` : 'Yok'}</span>
                        )}
                      </div>
                      {isHighlighted && <div className="text-xs text-green-600 font-medium mt-1">En İyi</div>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Coverage Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Temel Teminatlar</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Zorunlu Mali Sorumluluk</li>
            <li>• Bedeni ve Maddi Zarar</li>
            <li>• İMM Teminatı</li>
            <li>• Ferdi Kaza (Opsiyonel)</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-blue-500 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Ek Hizmetler</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• 7/24 Yol Yardımı</li>
            <li>• Hukuki Koruma</li>
            <li>• Yedek Araç Hizmeti</li>
            <li>• Ekspertiz Hizmeti</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center mb-4">
            <Info className="h-6 w-6 text-orange-500 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Önemli Notlar</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Teminat tutarları minimum değerlerdir</li>
            <li>• Ek teminatlar için ek prim alınabilir</li>
            <li>• Detaylar için poliçe şartlarını inceleyin</li>
            <li>• Hasar durumunda muafiyet uygulanabilir</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoverageComparison;

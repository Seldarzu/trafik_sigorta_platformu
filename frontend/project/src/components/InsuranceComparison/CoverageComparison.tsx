import React, { useMemo } from 'react';
import { Shield, CheckCircle, X } from 'lucide-react';
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
  ] as const;

  /**
   * Her satır (coverageItems key’i) için “tek bir kazanan” seç:
   * - type === 'amount' → max değere sahip ilk şirket (max>0 ise)
   * - type === 'boolean' → true olan ilk şirket
   * Hiç uygun yoksa null.
   */
  const bestCellByKey = useMemo(() => {
    const map: Record<string, string | null> = {};
    coverageItems.forEach(item => {
      let winnerId: string | null = null;

      if (item.type === 'amount') {
        let maxVal = -Infinity;
        quotes.forEach(q => {
          const val = Number((q.coverageDetails as any)?.[item.key] ?? 0);
          if (val > maxVal) {
            maxVal = val;
            winnerId = q.id;
          }
        });
        // hepsi 0 veya negatifse rozet yok
        if (!(maxVal > 0)) winnerId = null;
      } else {
        // boolean: true olan ilk şirket
        winnerId = null;
        for (const q of quotes) {
          const val = Boolean((q.coverageDetails as any)?.[item.key]);
          if (val) { winnerId = q.id; break; }
        }
      }

      map[item.key] = winnerId;
    });
    return map;
  }, [quotes]);

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
                  const isWinner = bestCellByKey[item.key] === quote.id;

                  return (
                    <td key={quote.id} className="px-6 py-4 text-center">
                      <div
                        className={`inline-flex items-center justify-center px-3 py-2 rounded-lg ${
                          isWinner
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.type === 'boolean' ? (
                          value ? (
                            <CheckCircle className="h-5 w-5 text-current" />
                          ) : (
                            <X className="h-5 w-5 text-current" />
                          )
                        ) : (
                          <span>
                            {Number(value) > 0 ? `${item.unit}${Number(value).toLocaleString('tr-TR')}` : 'Yok'}
                          </span>
                        )}
                      </div>

                      {isWinner && <div className="text-xs text-green-600 font-medium mt-1">En İyi</div>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoverageComparison;

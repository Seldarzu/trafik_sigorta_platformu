import React, { useState } from 'react';
import { CheckCircle, Star, Award, Shield, TrendingUp, Phone, Globe, Mail } from 'lucide-react';
import { Quote, InsuranceCompany } from '../../types';
 import { QuoteService } from '../../services/QuoteService';
import { PolicyService } from '../../services/policyService';


export interface CompanySelectionProps {
  quoteId: string;
  quotes: Quote[];
  companies: InsuranceCompany[];
  selectedCompany: string | null;
  onSelect: (companyId: string) => void | Promise<void>;
  onPolicyCreated?: (policyId: string) => void;
  selectingId?: string | null;
}

const CompanySelection: React.FC<CompanySelectionProps> = ({
  quoteId,
  quotes,
  companies,
  selectedCompany,
  onSelect,
  onPolicyCreated,
  selectingId = null,
}) => {
  const [creating, setCreating] = useState<boolean>(false);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));

  const getCompanyQuote = (companyName: string) => quotes.find(q => q.companyName === companyName);

  const getBestPriceCompany = () => {
    if (!quotes.length) return undefined;
    const bestQuote = quotes.reduce((best, current) =>
      (current.finalPremium ?? Infinity) < (best.finalPremium ?? Infinity) ? current : best
    );
    return companies.find(c => c.name === bestQuote.companyName);
  };

  const getRecommendedCompany = () => {
    if (!quotes.length) return undefined;
    const scored = companies.map(company => {
      const q = getCompanyQuote(company.name);
      if (!q) return { company, score: 0 };
      const priceScore = ((3000 - (q.finalPremium || 0)) / 3000) * 40;
      const coverageScore = ((q.coverageDetails?.personalInjuryPerPerson || 0) / 1_000_000) * 30;
      const ratingScore = (company.contactInfo?.rating || 0) * 6;
      return { company, score: priceScore + coverageScore + ratingScore };
    });
    return scored.reduce((best, cur) => (cur.score > best.score ? cur : best)).company;
  };

  const bestPriceCompany = companies.length ? getBestPriceCompany() : undefined;
  const recommendedCompany = companies.length ? getRecommendedCompany() : undefined;

  const handleSelect = async (companyId: string) => {
    // Sadece parent'a haber ver—backend çağrısı parent içinde yapılır.
    await onSelect(companyId);
  };

  

const handlePolicize = async () => {
  if (!selectedCompany) return;
  try {
    setCreating(true);

    // 1) Finalize (SOLD)
    const finalized = await QuoteService.finalize(quoteId);

    // 2) Poliçeyi oluştur
    const today = new Date();
    const startDate = today.toISOString().slice(0, 10);
    const policy = await PolicyService.createFromQuote(finalized.id, startDate);

    onPolicyCreated?.(policy.id); // istersen navigate('/policeler')
  } catch (e: any) {
    // Hata kullanıcıya yansısın
    console.error(e);
    alert(e?.response?.data?.message || e?.message || 'Poliçe oluşturulamadı');
  } finally {
    setCreating(false);
  }
};


  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sigorta Şirketi Seçimi</h2>
        <p className="text-gray-600">Size en uygun sigorta şirketini seçin ve poliçeleştirin</p>
      </div>

      {bestPriceCompany && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <Award className="h-6 w-6 mr-2" />
                  <h3 className="text-lg font-bold">En Uygun Fiyat</h3>
                </div>
                <p className="text-2xl font-bold">{bestPriceCompany?.name}</p>
                <p className="text-sm opacity-90">
                  ₺{getCompanyQuote(bestPriceCompany?.name || '')?.finalPremium?.toLocaleString('tr-TR')}
                </p>
              </div>
              <button
                onClick={() => handleSelect(bestPriceCompany?.id || '')}
                disabled={selectingId === bestPriceCompany?.id}
                className="bg-white/20 hover:bg-white/30 disabled:opacity-60 px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
              >
                {selectingId === bestPriceCompany?.id ? 'Seçiliyor…' : 'Seç'}
              </button>
            </div>
          </div>

          {recommendedCompany && (
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-6 w-6 mr-2" />
                    <h3 className="text-lg font-bold">Önerilen Seçim</h3>
                  </div>
                  <p className="text-2xl font-bold">{recommendedCompany?.name}</p>
                  <p className="text-sm opacity-90">Fiyat ve teminat dengesi</p>
                </div>
                <button
                  onClick={() => handleSelect(recommendedCompany?.id || '')}
                  disabled={selectingId === recommendedCompany?.id}
                  className="bg-white/20 hover:bg-white/30 disabled:opacity-60 px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  {selectingId === recommendedCompany?.id ? 'Seçiliyor…' : 'Seç'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {companies.map((company) => {
          const quote = quotes.find(q => q.companyName === company.name);
          if (!quote) return null;

          const isSelected = selectedCompany === company.id;
          const isBestPrice = bestPriceCompany?.id === company.id;
          const isRecommended = recommendedCompany?.id === company.id;

          return (
            <div
              key={company.id}
              className={`bg-white p-6 rounded-xl shadow-lg border-2 transition-all duration-300 ${
                isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                        {isBestPrice && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                            <Award className="h-3 w-3 mr-1" />
                            En Uygun
                          </span>
                        )}
                        {isRecommended && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Önerilen
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          {renderStars(company.contactInfo?.rating || 4)}
                          <span className="ml-1">({company.contactInfo?.rating || 4}/5)</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{company.contactInfo?.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      ₺{Number(quote.finalPremium || 0).toLocaleString('tr-TR')}
                    </div>
                    <div className="text-sm text-gray-600">Net Prim</div>
                    {Number(quote.totalDiscount || 0) > 0 && (
                      <div className="text-xs text-green-600 mt-1">
                        ₺{Number(quote.totalDiscount || 0).toLocaleString('tr-TR')} indirim
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600 mb-1">
                      ₺{Number(quote.coverageDetails?.personalInjuryPerPerson || 0).toLocaleString('tr-TR')}
                    </div>
                    <div className="text-sm text-gray-600">Kişi Başı Teminat</div>
                    <div className="text-xs text-gray-500 mt-1">Risk: {quote.riskScore ?? 0}/100</div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <button
                    onClick={() => handleSelect(company.id)}
                    disabled={selectingId === company.id}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${selectingId === company.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {selectingId === company.id ? (
                      'Seçiliyor…'
                    ) : isSelected ? (
                      <span className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Seçildi
                      </span>
                    ) : (
                      'Bu Şirketi Seç'
                    )}
                  </button>

                  {isSelected && (
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Seçiminizi onaylayın</div>
                      <button
                        onClick={handlePolicize}
                        disabled={creating}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-60"
                      >
                        {creating ? 'Oluşturuluyor…' : 'Poliçeleştir'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {isSelected && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Teminat Detayları</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Kişi Başı: ₺{Number(quote.coverageDetails?.personalInjuryPerPerson || 0).toLocaleString('tr-TR')}</li>
                        <li>• Maddi Zarar: ₺{Number(quote.coverageDetails?.propertyDamage || 0).toLocaleString('tr-TR')}</li>
                        <li>• Hukuki Koruma: {quote.coverageDetails?.legalProtection ? 'Var' : 'Yok'}</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Ek Hizmetler</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Yol Yardımı: {quote.coverageDetails?.roadAssistance ? 'Var' : 'Yok'}</li>
                        <li>• Yedek Araç: {quote.coverageDetails?.replacementVehicle ? 'Var' : 'Yok'}</li>
                        <li>• 7/24 Destek Hattı</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">İletişim</h4>
                      <div className="text-sm text-purple-700 space-y-1">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{company.contactInfo?.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          <span>Website</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>Müşteri Hizmetleri</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompanySelection;

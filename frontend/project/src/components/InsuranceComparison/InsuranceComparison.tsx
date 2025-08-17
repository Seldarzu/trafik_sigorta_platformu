// src/components/InsuranceComparison/InsuranceComparison.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Shield, CheckCircle, Star, TrendingUp, Award } from 'lucide-react';
import { Quote, InsuranceCompany } from '../../types';
import CompanyCard from './CompanyCard';
import CoverageComparison from './CoverageComparison';
import CompanySelection from './CompanySelection';
import quoteService, { CompanyQuoteDto } from '../../services/QuoteService';
import { PolicyService } from '../../services/policyService';

interface InsuranceComparisonProps {
  quote: Quote;
  onBack: () => void;
  onCompanySelect: (companyId: string, updatedQuote: Quote) => void;
}

const num = (v: number | string | null | undefined) =>
  v == null ? 0 : typeof v === 'string' ? Number(v) : v;

const InsuranceComparison: React.FC<InsuranceComparisonProps> = ({
  quote,
  onBack,
  onCompanySelect,
}) => {
  const [companies, setCompanies] = useState<(InsuranceCompany & { backendId?: string })[]>([]);
  const [companyQuotes, setCompanyQuotes] = useState<Quote[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'comparison' | 'coverage' | 'selection'>('comparison');

  const [err, setErr] = useState<string | null>(null);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const [createMsg, setCreateMsg] = useState<string | null>(null);

  // seçildikten sonra butona kaydırmak için
  const actionBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadCompanyQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote.id]);

  const loadCompanyQuotes = async () => {
    try {
      setLoading(true);
      setErr(null);
      setCreateMsg(null);

      const offers: CompanyQuoteDto[] = await quoteService.getCompanyQuotes(quote.id);

      const map: Record<string, InsuranceCompany & { backendId?: string }> = {};

      const mappedQuotes: Quote[] = offers.map((o, idx) => {
        const backendId =
          (o as any).companyId ??
          (o as any).company_id ??
          (o as any).id ??
          undefined;

        const usedId = String(backendId ?? `COMP_${idx + 1}`);
        const displayName = o.companyName ?? (o as any).company_name ?? `Şirket ${idx + 1}`;

        if (!map[usedId]) {
          map[usedId] = {
            id: usedId,
            name: displayName,
            code: displayName.toUpperCase().replace(/\s+/g, '_'),
            isActive: true,
            contactInfo: { phone: '', website: '', rating: 4.3 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            backendId,
          } as any;
        }

        const premium = num(o.premium);
        const finalPremium = num(o.finalPremium);
        const coverage = num(o.coverageAmount);

        const q: any = {
          ...quote,
          id: `${quote.id}-${usedId}`,
          companyId: usedId,
          companyIdBackend: backendId,
          companyName: displayName,
          premium,
          finalPremium,
          totalDiscount: Math.max(0, premium - finalPremium),
          coverageDetails: {
            personalInjuryPerPerson: coverage,
            personalInjuryPerAccident: Math.round(coverage * 1.5),
            propertyDamage: Math.round(coverage * 0.4),
            medicalExpenses: Math.round(coverage * 0.05),
            legalProtection: true,
            roadAssistance: true,
            replacementVehicle: true,
            personalAccident: Math.round(coverage * 0.1),
          },
        };
        return q as Quote;
      });

      setCompanies(Object.values(map));
      setCompanyQuotes(mappedQuotes);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Teklifler yüklenemedi');
      setCompanies([]);
      setCompanyQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  /** Seçimi backend’e yazan çekirdek fonksiyon */
  const handleCompanySelectCore = async (backendId: string, usedIdForUi?: string) => {
    if (!backendId) {
      setErr('Seçilen şirket için geçerli bir kimlik bulunamadı.');
      return;
    }
    try {
      setSelecting(backendId);
      setErr(null);
      setCreateMsg(null);

      const updated = await quoteService.selectCompany(quote.id, backendId);

      setSelectedCompany(usedIdForUi || backendId);
      onCompanySelect(backendId, updated);

      // kullanıcı görsün diye hemen “Poliçeleştir” alanına kaydır
      setTimeout(() => {
        actionBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Şirket seçilirken hata oluştu');
    } finally {
      setSelecting(null);
    }
  };

  /** CompanyCard → backendId bilinir */
  const handleCompanySelect = async (backendId: string, usedIdForUi?: string) => {
    return handleCompanySelectCore(backendId, usedIdForUi);
  };

  /** CompanySelection → sadece usedId gelir, buradan backendId’yi bul */
  const handleCompanySelectWithUsedId = async (usedId: string) => {
    const cmp = companies.find((c) => c.id === usedId);
    const backendId = cmp?.backendId || usedId;
    return handleCompanySelectCore(backendId, usedId);
  };

  /** POLİÇELEŞTİR — şirket seçildikten sonra aktif */
  const handlePolicize = async () => {
    if (!selectedCompany) return;
    try {
      setCreating(true);
      setErr(null);
      setCreateMsg(null);

      const startDate = new Date().toISOString().slice(0, 10);
      const policy = await PolicyService.createFromQuote(quote.id, startDate);

      setCreateMsg(`Poliçe oluşturuldu (No: ${policy.policyNumber ?? policy.id ?? ''}).`);
      // örn: navigate('/policies') burada yapılabilir
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Poliçe oluşturulamadı');
    } finally {
      setCreating(false);
    }
  };

  const bestPrice = companyQuotes.length
    ? companyQuotes.reduce((best, cur) =>
        (cur.finalPremium ?? Infinity) < (best.finalPremium ?? Infinity) ? cur : best
      )
    : undefined;

  const bestCoverage = companyQuotes.length
    ? companyQuotes.reduce((best, cur) =>
        (cur.coverageDetails?.personalInjuryPerPerson ?? 0) >
        (best.coverageDetails?.personalInjuryPerPerson ?? 0)
          ? cur
          : best
      )
    : undefined;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Sigorta şirketleri karşılaştırılıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Teklife Dön
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sigorta Şirketi Karşılaştırması
            </h1>
            <p className="mt-2 text-lg text-gray-600">En uygun teminat ve fiyatı seçin</p>
          </div>
        </div>

        {err && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            {err}
          </div>
        )}
        {createMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
            {createMsg}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">En Uygun Fiyat</p>
                <p className="text-2xl font-bold">
                  ₺{(bestPrice?.finalPremium ?? 0).toLocaleString('tr-TR')}
                </p>
                <p className="text-sm opacity-75">{bestPrice?.companyName ?? '-'}</p>
              </div>
              <Award className="h-8 w-8 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">En Yüksek Teminat</p>
                <p className="text-2xl font-bold">
                  ₺{(bestCoverage?.coverageDetails?.personalInjuryPerPerson ?? 0).toLocaleString('tr-TR')}
                </p>
                <p className="text-sm opacity-75">{bestCoverage?.companyName ?? '-'}</p>
              </div>
              <Shield className="h-8 w-8 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Karşılaştırılan Şirket</p>
                <p className="text-2xl font-bold">{companyQuotes.length}</p>
                <p className="text-sm opacity-75">Aktif Teklif</p>
              </div>
              <TrendingUp className="h-8 w-8 opacity-80" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'comparison', label: 'Karşılaştırma', icon: Shield },
                { id: 'coverage', label: 'Teminat Detayları', icon: CheckCircle },
                { id: 'selection', label: 'Şirket Seçimi', icon: Star },
              ].map((tab) => {
                const Icon = tab.icon as any;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'comparison' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {companyQuotes.map((companyQuote) => {
                  const cqAny = companyQuote as any;
                  const usedId = cqAny.companyId as string | undefined;

                  let cmp =
                    (usedId && companies.find((c) => c.id === usedId)) ||
                    companies.find((c) => c.name === companyQuote.companyName);

                  if (!cmp) return null;

                  const backendId = (cmp as any).backendId || cqAny.companyIdBackend || cmp.id;

                  return (
                    <CompanyCard
                      key={companyQuote.id}
                      quote={companyQuote}
                      company={cmp}
                      onSelect={() => handleCompanySelect(backendId, cmp.id)}
                      isSelected={selectedCompany === cmp.id}
                      isBestPrice={
                        companyQuote.finalPremium ===
                        ((bestPrice?.finalPremium ?? companyQuote.finalPremium))
                      }
                      isBestCoverage={
                        (companyQuote.coverageDetails?.personalInjuryPerPerson || 0) ===
                        (bestCoverage?.coverageDetails?.personalInjuryPerPerson || 0)
                      }
                      selecting={selecting === backendId}
                    />
                  );
                })}
              </div>
            )}

            {activeTab === 'coverage' && (
              <CoverageComparison quotes={companyQuotes} companies={companies} />
            )}

            {activeTab === 'selection' && (
              <CompanySelection
                quoteId={quote.id}
                quotes={companyQuotes}
                companies={companies}
                selectedCompany={selectedCompany}
                onSelect={handleCompanySelectWithUsedId}
                selectingId={selecting}
              />
            )}
          </div>
        </div>

        {/* Action Buttons (şirket seçilince hemen görünür) */}
        {selectedCompany && (
          <div
            ref={actionBarRef}
            className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-xl text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Seçiminiz Hazır!</h3>
                <p className="opacity-90">
                  {companies.find((c) => c.id === selectedCompany)?.name} ile devam etmek için onaylayın
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors duration-200"
                  disabled={creating}
                >
                  Değiştir
                </button>
                <button
                  onClick={handlePolicize}
                  disabled={creating}
                  className="px-8 py-3 bg-white text-green-600 hover:bg-gray-100 rounded-lg font-bold transition-colors duration-200 disabled:opacity-60"
                >
                  {creating ? 'Oluşturuluyor…' : 'Poliçeleştir'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsuranceComparison;

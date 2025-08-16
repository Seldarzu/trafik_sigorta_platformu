// src/components/QuoteDetails/QuoteDetails.tsx
import React from 'react';
import {
  ArrowLeft,
  Download,
  Printer,
  Share2,
  Edit,
  Check,
  X,
  Car,
  User,
  Shield,
  DollarSign,
  FileText,
  Award,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Quote, VehicleSummary, DriverSummary } from '../../types';

interface QuoteDetailsProps {
  quote: Quote;
  onBack: () => void;
  onEdit: () => void;
}

/** UI'de tam araç bilgisini gösterebilmek için VehicleSummary'i genişletiyoruz */
type VehicleLike = VehicleSummary & {
  engineSize?: string;
  fuelType?: string;
  usage?: string;
  cityCode?: string;
};

/** UI'de tam sürücü bilgisini gösterebilmek için DriverSummary'i genişletiyoruz */
type DriverLike = DriverSummary & {
  tcNumber?: string;
  birthDate?: string;     // ISO
  licenseDate?: string;   // ISO
  gender?: string;
  maritalStatus?: string;
  education?: string;
  hasAccidents?: boolean;
  accidentCount?: number;
  hasViolations?: boolean;
  violationCount?: number;
};

const fuelTypeMap: Record<string, string> = {
  gasoline: 'Benzin',
  diesel: 'Dizel',
  lpg: 'LPG',
  electric: 'Elektrik',
  hybrid: 'Hibrit'
};

const usageMap: Record<string, string> = {
  personal: 'Özel',
  commercial: 'Ticari',
  taxi: 'Taksi',
  truck: 'Kamyon'
};

const maritalMap: Record<string, string> = {
  single: 'Bekar',
  married: 'Evli',
  divorced: 'Boşanmış',
  widowed: 'Dul'
};

const educationMap: Record<string, string> = {
  primary: 'İlkokul',
  secondary: 'Ortaokul',
  high_school: 'Lise',
  university: 'Üniversite',
  postgraduate: 'Yüksek Lisans/Doktora'
};

const QuoteDetails: React.FC<QuoteDetailsProps> = ({ quote, onBack, onEdit }) => {
  // Güvenli kısayollar (fallback'ler)
  const v: VehicleLike = (quote.vehicle as VehicleLike) ?? { brand: '-', model: '', year: 0, plateNumber: '' };
  const d: DriverLike  = (quote.driver  as DriverLike)  ?? { firstName: '', lastName: '' };

  const getRiskLevelColor = (level?: string) => {
    switch (level) {
      case 'low':    return 'from-green-500 to-emerald-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'high':   return 'from-red-500 to-pink-500';
      default:       return 'from-gray-500 to-slate-500';
    }
  };

  const getRiskLevelText = (level?: string) => {
    switch (level) {
      case 'low':    return 'Düşük Risk';
      case 'medium': return 'Orta Risk';
      case 'high':   return 'Yüksek Risk';
      default:       return 'Belirsiz';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':  return 'from-green-500 to-emerald-500';
      case 'expired': return 'from-red-500 to-pink-500';
      case 'sold':    return 'from-blue-500 to-cyan-500';
      case 'draft':   return 'from-gray-500 to-slate-500';
      default:        return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'active':  return 'Aktif';
      case 'expired': return 'Süresi Dolmuş';
      case 'sold':    return 'Satıldı';
      case 'draft':   return 'Taslak';
      default:        return status ?? '-';
    }
  };

  const getFuelTypeText  = (ft?: string) => (ft ? (fuelTypeMap[ft] || ft) : '-');
  const getUsageText     = (u?: string)  => (u ? (usageMap[u] || u) : '-');
  const getGenderText    = (g?: string)  => (g === 'male' ? 'Erkek' : g === 'female' ? 'Kadın' : (g ?? '-'));
  const getMaritalText   = (m?: string)  => (m ? (maritalMap[m] || m) : '-');
  const getEducationText = (e?: string)  => (e ? (educationMap[e] || e) : '-');

  const fmtDate = (value?: string) =>
    value ? new Date(value).toLocaleDateString('tr-TR') : '-';

  const isExpiringSoon = () => {
    if (!quote.validUntil) return false;
    const valid = new Date(quote.validUntil).getTime();
    const today = Date.now();
    const days  = Math.ceil((valid - today) / (1000 * 60 * 60 * 24));
    return days > 0 && days <= 7;
  };

  const handlePrint    = () => window.print();
  const handleDownload = () => alert('PDF indirme özelliği yakında eklenecek!');
  const handleShare    = () => {
    if (navigator.share) {
      navigator.share({
        title: `Teklif ${quote.id}`,
        text: `${v.brand} ${v.model} için trafik sigortası teklifi`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link panoya kopyalandı!');
    }
  };

  const premiumBase   = quote.premium ?? 0;
  const finalPremium  = quote.finalPremium ?? 0;
  const totalDiscount = quote.totalDiscount ?? 0;
  const riskScore     = quote.riskScore ?? 0;
  const coverage      = quote.coverageAmount ?? 0;
  const discounts     = quote.discounts ?? [];
  const companyName   = quote.companyName ?? '';
  const createdAtStr  = fmtDate(quote.createdAt);
  const validUntilStr = fmtDate(quote.validUntil);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back + Title + Actions */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Tekliflere Dön
          </button>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Teklif Detayları
              </h1>
              <p className="text-gray-600 mt-1">Teklif No: {quote.id}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={handlePrint}    className="btn-gradient-gray"><Printer className="h-4 w-4 mr-2" /> Yazdır</button>
              <button onClick={handleDownload} className="btn-gradient-green"><Download className="h-4 w-4 mr-2" /> PDF İndir</button>
              <button onClick={handleShare}    className="btn-gradient-blue"><Share2 className="h-4 w-4 mr-2" /> Paylaş</button>
              <button onClick={onEdit}         className="btn-gradient-purple"><Edit className="h-4 w-4 mr-2" /> Düzenle</button>
            </div>
          </div>
        </div>

        {/* Expiry Alert */}
        {isExpiringSoon() && (
          <div className="mb-6 p-4 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg border border-orange-200">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-600 mr-3" />
              <div>
                <h3 className="font-medium text-orange-800">Dikkat!</h3>
                <p className="text-orange-700">
                  Bu teklif yakında sona erecek. Müşterinizle iletişime geçmeyi unutmayın.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header Info */}
          <div className="p-8 text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Trafik Sigortası Teklifi</h2>
                <p className="text-blue-100">Teklif Tarihi: {createdAtStr}</p>
                <p className="text-blue-100">Geçerlilik: {validUntilStr}</p>
              </div>
              <div className="space-y-1 text-right">
                <div
                  className={`inline-flex px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${getStatusColor(quote.status)}`}
                >
                  {getStatusText(quote.status)}
                </div>
                <div
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRiskLevelColor(quote.riskLevel)}`}
                >
                  {getRiskLevelText(quote.riskLevel)}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Prim Özeti */}
            <section className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="flex items-center mb-2 text-lg font-bold text-gray-900">
                    <DollarSign className="h-6 w-6 text-green-600 mr-2" /> Prim Özeti
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temel Prim:</span>
                      <span>₺{premiumBase.toLocaleString('tr-TR')}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Toplam İndirim:</span>
                        <span>-₺{totalDiscount.toLocaleString('tr-TR')}</span>
                      </div>
                    )}
                    <div className="border-t border-green-200 pt-2 flex justify-between font-bold text-gray-900">
                      <span>Net Prim:</span>
                      <span>₺{finalPremium.toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">
                    ₺{finalPremium.toLocaleString('tr-TR')}
                  </p>
                  <p className="text-sm text-gray-600">{companyName || '-'}</p>
                  <p className="text-sm text-gray-600">Risk Skoru: {riskScore}/100</p>
                </div>
              </div>
            </section>

            {/* Araç & Sürücü */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Araç Bilgileri */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                <h3 className="flex items-center mb-4 text-lg font-bold text-gray-900">
                  <Car className="h-6 w-6 text-blue-600 mr-2" /> Araç Bilgileri
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span>Plaka:</span><span className="font-medium">{v.plateNumber || '-'}</span></div>
                  <div className="flex justify-between"><span>Marka/Model:</span><span className="font-medium">{v.brand || '-'} {v.model || ''}</span></div>
                  <div className="flex justify-between"><span>Yıl:</span><span className="font-medium">{v.year || '-'}</span></div>
                  {v.engineSize && (
                    <div className="flex justify-between"><span>Motor Hacmi:</span><span className="font-medium">{v.engineSize}</span></div>
                  )}
                  {v.fuelType && (
                    <div className="flex justify-between"><span>Yakıt Tipi:</span><span className="font-medium">{getFuelTypeText(v.fuelType)}</span></div>
                  )}
                  {v.usage && (
                    <div className="flex justify-between"><span>Kullanım:</span><span className="font-medium">{getUsageText(v.usage)}</span></div>
                  )}
                  {v.cityCode && (
                    <div className="flex justify-between"><span>Şehir Kodu:</span><span className="font-medium">{v.cityCode}</span></div>
                  )}
                </div>
              </div>

              {/* Sürücü Bilgileri */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <h3 className="flex items-center mb-4 text-lg font-bold text-gray-900">
                  <User className="h-6 w-6 text-purple-600 mr-2" /> Sürücü Bilgileri
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span>Ad Soyad:</span><span className="font-medium">{(d.firstName || '-') + ' ' + (d.lastName || '')}</span></div>
                  {d.tcNumber && (
                    <div className="flex justify-between"><span>TC Kimlik:</span><span className="font-medium">{d.tcNumber}</span></div>
                  )}
                  {d.birthDate && (
                    <div className="flex justify-between"><span>Doğum:</span><span className="font-medium">{fmtDate(d.birthDate)}</span></div>
                  )}
                  {d.licenseDate && (
                    <div className="flex justify-between"><span>Ehliyet Tarihi:</span><span className="font-medium">{fmtDate(d.licenseDate)}</span></div>
                  )}
                  {d.gender && (
                    <div className="flex justify-between"><span>Cinsiyet:</span><span className="font-medium">{getGenderText(d.gender)}</span></div>
                  )}
                  {d.maritalStatus && (
                    <div className="flex justify-between"><span>Medeni Durum:</span><span className="font-medium">{getMaritalText(d.maritalStatus)}</span></div>
                  )}
                  {d.education && (
                    <div className="flex justify-between"><span>Eğitim:</span><span className="font-medium">{getEducationText(d.education)}</span></div>
                  )}
                  {d.profession && (
                    <div className="flex justify-between"><span>Meslek:</span><span className="font-medium">{d.profession}</span></div>
                  )}
                </div>
              </div>
            </div>

            {/* Risk & Teminat */}
            <section className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
              <h3 className="flex items-center mb-4 text-lg font-bold text-gray-900">
                <Shield className="h-6 w-6 text-orange-600 mr-2" /> Risk Değerlendirmesi
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">{riskScore}/100</p>
                  <p className="text-sm text-gray-600">Risk Skoru</p>
                  <span className={`inline-flex mt-2 px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${getRiskLevelColor(quote.riskLevel)}`}>
                    {getRiskLevelText(quote.riskLevel)}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{d.hasAccidents ? (d.accidentCount ?? 0) : 0}</p>
                  <p className="text-sm text-gray-600">Kaza Geçmişi</p>
                  <p className="text-xs text-gray-500">Son 5 yıl</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">{d.hasViolations ? (d.violationCount ?? 0) : 0}</p>
                  <p className="text-sm text-gray-600">Trafik Cezası</p>
                  <p className="text-xs text-gray-500">Son 2 yıl</p>
                </div>
              </div>
            </section>

            {/* Teminat Detayları */}
            <section className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
              <h3 className="flex items-center mb-4 text-lg font-bold text-gray-900">
                <Shield className="h-6 w-6 text-indigo-600 mr-2" /> Teminat Detayları
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Zorunlu Mali Sorumluluk</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Kişi Başı Zarar:</span><span>₺{coverage.toLocaleString('tr-TR')}</span></div>
                    <div className="flex justify-between"><span>Kaza Başı Zarar:</span><span>₺{(coverage * 2).toLocaleString('tr-TR')}</span></div>
                    <div className="flex justify-between"><span>Maddi Zarar:</span><span>₺{Math.floor(coverage * 0.4).toLocaleString('tr-TR')}</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Ek Bilgiler</h4>
                  <div className="space-y-2">
                    <div className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" /> Ferdi Kaza Teminatı</div>
                    <div className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" /> İMM Teminatı</div>
                    <div className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" /> Hukuki Koruma</div>
                    <div className="flex items-center"><X className="h-4 w-4 text-red-500 mr-2" /> Kasko Teminatı</div>
                  </div>
                </div>
              </div>
            </section>

            {/* İndirimler */}
            {(discounts.length) > 0 && (
              <section className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h3 className="flex items-center mb-4 text-lg font-bold text-gray-900">
                  <Award className="h-6 w-6 text-green-600 mr-2" /> Uygulanan İndirimler
                </h3>
                <div className="space-y-3">
                  {discounts.map((dsc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                          <Award className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">{dsc.name}</h4>
                          <p className="text-sm">%{dsc.percentage} indirim</p>
                        </div>
                      </div>
                      <div className="font-bold text-green-600">-₺{dsc.amount.toLocaleString('tr-TR')}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Şirket & Acente */}
            <section className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
              <h3 className="flex items-center mb-4 text-lg font-bold text-gray-900">
                <FileText className="h-6 w-6 text-gray-600 mr-2" /> Sigorta Şirketi Bilgileri
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">{companyName || '-'}</h4>
                  <p className="text-sm text-gray-600">Merkez: İstanbul, Türkiye</p>
                  <p className="text-sm text-gray-600">Telefon: 0850 XXX XX XX</p>
                  <p className="text-sm text-gray-600">Web: www.{(companyName || '').toLowerCase().replace(' ', '')}.com.tr</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Acente Bilgileri</h4>
                  <p className="text-sm text-gray-600">Acente: SigortaTeklif Pro</p>
                  <p className="text-sm text-gray-600">Acente Kodu: {quote.agentId ?? '-'}</p>
                  <p className="text-sm text-gray-600">Sorumlu: Ahmet Yılmaz</p>
                </div>
              </div>
            </section>

            {/* Şartlar */}
            <section className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
              <h3 className="flex items-center mb-4 text-lg font-bold text-gray-900">
                <Info className="h-6 w-6 text-yellow-600 mr-2" /> Önemli Bilgiler ve Şartlar
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Bu teklif {validUntilStr} tarihine kadar geçerlidir.</p>
                <p>• Poliçe başlangıç tarihi müşteri tarafından belirlenecektir.</p>
                <p>• Prim ödemesi poliçe başlangıç tarihinden önce yapılmalıdır.</p>
                <p>• Araç muayene raporu ve ruhsat fotokopisi gereklidir.</p>
                <p>• Sürücü belgesi ve kimlik fotokopisi gereklidir.</p>
                <p>• Önceki sigorta poliçesi (varsa) ibraz edilmelidir.</p>
                <p>• Teklif fiyatları güncel tarife ve mevzuata göre hesaplanmıştır.</p>
                <p>• Detaylı bilgi için acente ile iletişime geçiniz.</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetails;

import React, { useState } from 'react';
import { 
  ArrowLeft, Download, Printer, Share2, Edit, Check, X, 
  Car, User, Shield, Calendar, DollarSign, FileText, 
  MapPin, Phone, Mail, Award, AlertTriangle, Info
} from 'lucide-react';
import { Quote } from '../../types';

interface QuoteDetailsProps {
  quote: Quote;
  onBack: () => void;
  onEdit: () => void;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({ quote, onBack, onEdit }) => {
  const [showPrintView, setShowPrintView] = useState(false);

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

  const getFuelTypeText = (fuelType: string) => {
    const types = {
      gasoline: 'Benzin',
      diesel: 'Dizel',
      lpg: 'LPG',
      electric: 'Elektrik',
      hybrid: 'Hibrit'
    };
    return types[fuelType as keyof typeof types] || fuelType;
  };

  const getUsageText = (usage: string) => {
    const usages = {
      personal: 'Özel',
      commercial: 'Ticari',
      taxi: 'Taksi',
      truck: 'Kamyon'
    };
    return usages[usage as keyof typeof usages] || usage;
  };

  const getGenderText = (gender: string) => {
    return gender === 'male' ? 'Erkek' : gender === 'female' ? 'Kadın' : gender;
  };

  const getMaritalStatusText = (status: string) => {
    const statuses = {
      single: 'Bekar',
      married: 'Evli',
      divorced: 'Boşanmış',
      widowed: 'Dul'
    };
    return statuses[status as keyof typeof statuses] || status;
  };

  const getEducationText = (education: string) => {
    const educations = {
      primary: 'İlkokul',
      secondary: 'Ortaokul',
      high_school: 'Lise',
      university: 'Üniversite',
      postgraduate: 'Yüksek Lisans/Doktora'
    };
    return educations[education as keyof typeof educations] || education;
  };

  const isExpiringSoon = () => {
    const validUntil = new Date(quote.validUntil);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((validUntil.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    alert('PDF indirme özelliği yakında eklenecek!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Teklif ${quote.id}`,
        text: `${quote.vehicle.brand} ${quote.vehicle.model} için trafik sigortası teklifi`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link panoya kopyalandı!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Tekliflere Dön
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Teklif Detayları
              </h1>
              <p className="mt-2 text-gray-600">Teklif No: {quote.id}</p>
            </div>
            
            <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Printer className="h-4 w-4 mr-2" />
                Yazdır
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF İndir
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Paylaş
              </button>
              <button
                onClick={onEdit}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Edit className="h-4 w-4 mr-2" />
                Düzenle
              </button>
            </div>
          </div>
        </div>

        {/* Status Alert */}
        {isExpiringSoon() && (
          <div className="mb-6 p-4 bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-orange-800">Dikkat!</h3>
                <p className="text-sm text-orange-700">Bu teklif yakında sona erecek. Müşterinizle iletişime geçmeyi unutmayın.</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Trafik Sigortası Teklifi</h2>
                <p className="text-blue-100">Teklif Tarihi: {new Date(quote.createdAt).toLocaleDateString('tr-TR')}</p>
                <p className="text-blue-100">Geçerlilik: {new Date(quote.validUntil).toLocaleDateString('tr-TR')}</p>
              </div>
              <div className="mt-4 lg:mt-0 text-right">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${getStatusColor(quote.status)}`}>
                  {getStatusText(quote.status)}
                </div>
                <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRiskLevelColor(quote.riskLevel)}`}>
                  {getRiskLevelText(quote.riskLevel)}
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-8 space-y-8">
            {/* Premium Summary */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center mb-2">
                    <DollarSign className="h-6 w-6 mr-2 text-green-600" />
                    Prim Özeti
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temel Prim:</span>
                      <span className="font-medium">₺{quote.premium.toLocaleString('tr-TR')}</span>
                    </div>
                    {quote.totalDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Toplam İndirim:</span>
                        <span className="font-medium">-₺{quote.totalDiscount.toLocaleString('tr-TR')}</span>
                      </div>
                    )}
                    <div className="border-t border-green-200 pt-2">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Net Prim:</span>
                        <span>₺{quote.finalPremium.toLocaleString('tr-TR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">₺{quote.finalPremium.toLocaleString('tr-TR')}</div>
                  <div className="text-sm text-gray-600">{quote.companyName}</div>
                  <div className="text-sm text-gray-600">Risk Skoru: {quote.riskScore}/100</div>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 flex items-center mb-4">
                  <Car className="h-6 w-6 mr-2 text-blue-600" />
                  Araç Bilgileri
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plaka:</span>
                    <span className="font-medium text-gray-900">{quote.vehicle.plateNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Marka/Model:</span>
                    <span className="font-medium text-gray-900">{quote.vehicle.brand} {quote.vehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model Yılı:</span>
                    <span className="font-medium text-gray-900">{quote.vehicle.year}</span>
                  </div>
                  {quote.vehicle.engineSize && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Motor Hacmi:</span>
                      <span className="font-medium text-gray-900">{quote.vehicle.engineSize}</span>
                    </div>
                  )}
                  {quote.vehicle.fuelType && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Yakıt Tipi:</span>
                      <span className="font-medium text-gray-900">{getFuelTypeText(quote.vehicle.fuelType)}</span>
                    </div>
                  )}
                  {quote.vehicle.usage && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kullanım Amacı:</span>
                      <span className="font-medium text-gray-900">{getUsageText(quote.vehicle.usage)}</span>
                    </div>
                  )}
                  {quote.vehicle.cityCode && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tescil Şehri:</span>
                      <span className="font-medium text-gray-900">{quote.vehicle.cityCode}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Driver Information */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-lg font-bold text-gray-900 flex items-center mb-4">
                  <User className="h-6 w-6 mr-2 text-purple-600" />
                  Sürücü Bilgileri
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ad Soyad:</span>
                    <span className="font-medium text-gray-900">{quote.driver.firstName} {quote.driver.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">T.C. Kimlik:</span>
                    <span className="font-medium text-gray-900">{quote.driver.tcNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doğum Tarihi:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(quote.driver.birthDate).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  {quote.driver.licenseDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ehliyet Tarihi:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(quote.driver.licenseDate).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  )}
                  {quote.driver.gender && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cinsiyet:</span>
                      <span className="font-medium text-gray-900">{getGenderText(quote.driver.gender)}</span>
                    </div>
                  )}
                  {quote.driver.maritalStatus && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Medeni Durum:</span>
                      <span className="font-medium text-gray-900">{getMaritalStatusText(quote.driver.maritalStatus)}</span>
                    </div>
                  )}
                  {quote.driver.education && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Eğitim:</span>
                      <span className="font-medium text-gray-900">{getEducationText(quote.driver.education)}</span>
                    </div>
                  )}
                  {quote.driver.profession && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Meslek:</span>
                      <span className="font-medium text-gray-900">{quote.driver.profession}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center mb-4">
                <Shield className="h-6 w-6 mr-2 text-orange-600" />
                Risk Değerlendirmesi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{quote.riskScore}/100</div>
                  <div className="text-sm text-gray-600">Risk Skoru</div>
                  <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRiskLevelColor(quote.riskLevel)}`}>
                    {getRiskLevelText(quote.riskLevel)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {quote.driver.hasAccidents ? quote.driver.accidentCount : 0}
                  </div>
                  <div className="text-sm text-gray-600">Kaza Geçmişi</div>
                  <div className="text-xs text-gray-500 mt-1">Son 5 yıl</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {quote.driver.hasViolations ? quote.driver.violationCount : 0}
                  </div>
                  <div className="text-sm text-gray-600">Trafik Cezası</div>
                  <div className="text-xs text-gray-500 mt-1">Son 2 yıl</div>
                </div>
              </div>
            </div>

            {/* Coverage Details */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center mb-4">
                <Shield className="h-6 w-6 mr-2 text-indigo-600" />
                Teminat Detayları
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Zorunlu Mali Sorumluluk</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kişi Başı Bedeni Zarar:</span>
                      <span className="font-medium">₺{quote.coverageAmount.toLocaleString('tr-TR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kaza Başı Bedeni Zarar:</span>
                      <span className="font-medium">₺{(quote.coverageAmount * 2).toLocaleString('tr-TR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Maddi Zarar:</span>
                      <span className="font-medium">₺{Math.floor(quote.coverageAmount * 0.4).toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Ek Bilgiler</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Ferdi Kaza Teminatı</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">İMM Teminatı</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Hukuki Koruma</span>
                    </div>
                    <div className="flex items-center">
                      <X className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-sm text-gray-600">Kasko Teminatı</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Discounts */}
            {quote.discounts.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-lg font-bold text-gray-900 flex items-center mb-4">
                  <Award className="h-6 w-6 mr-2 text-green-600" />
                  Uygulanan İndirimler
                </h3>
                <div className="space-y-3">
                  {quote.discounts.map((discount, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                          <Award className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{discount.name}</h4>
                          <p className="text-sm text-gray-600">%{discount.percentage} indirim</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">-₺{discount.amount.toLocaleString('tr-TR')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Company Information */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center mb-4">
                <FileText className="h-6 w-6 mr-2 text-gray-600" />
                Sigorta Şirketi Bilgileri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{quote.companyName}</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Merkez: İstanbul, Türkiye</p>
                    <p>Telefon: 0850 XXX XX XX</p>
                    <p>Web: www.{quote.companyName.toLowerCase().replace(' ', '')}.com.tr</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Acente Bilgileri</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Acente: SigortaTeklif Pro</p>
                    <p>Acente Kodu: {quote.agentId}</p>
                    <p>Sorumlu: Ahmet Yılmaz</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center mb-4">
                <Info className="h-6 w-6 mr-2 text-yellow-600" />
                Önemli Bilgiler ve Şartlar
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>• Bu teklif {new Date(quote.validUntil).toLocaleDateString('tr-TR')} tarihine kadar geçerlidir.</p>
                <p>• Poliçe başlangıç tarihi müşteri tarafından belirlenecektir.</p>
                <p>• Prim ödemesi poliçe başlangıç tarihinden önce yapılmalıdır.</p>
                <p>• Araç muayene raporu ve ruhsat fotokopisi gereklidir.</p>
                <p>• Sürücü belgesi ve kimlik fotokopisi gereklidir.</p>
                <p>• Önceki sigorta poliçesi (varsa) ibraz edilmelidir.</p>
                <p>• Teklif fiyatları güncel tarife ve mevzuata göre hesaplanmıştır.</p>
                <p>• Detaylı bilgi için acente ile iletişime geçiniz.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetails;
import React from 'react';
import { X, Car, User, Shield, DollarSign, Calendar, Award, TrendingUp, AlertTriangle } from 'lucide-react';
import { Quote } from '../../types';

interface QuoteComparisonProps {
  quotes: Quote[];
  onClose: () => void;
}

const QuoteComparison: React.FC<QuoteComparisonProps> = ({ quotes, onClose }) => {
  const riskColor = (level?: string) =>
    level === 'low' ? 'from-green-500 to-emerald-500'
    : level === 'medium' ? 'from-yellow-500 to-orange-500'
    : level === 'high' ? 'from-red-500 to-pink-500'
    : 'from-gray-500 to-slate-500';

  const riskText = (level?: string) =>
    level === 'low' ? 'Düşük Risk'
    : level === 'medium' ? 'Orta Risk'
    : level === 'high' ? 'Yüksek Risk' : 'Belirsiz';

  const statusColor = (status?: string) =>
    status === 'active'  ? 'from-green-500 to-emerald-500'
    : status === 'expired'? 'from-red-500 to-pink-500'
    : status === 'sold'   ? 'from-blue-500 to-cyan-500'
    : status === 'draft'  ? 'from-gray-500 to-slate-500'
    : 'from-gray-500 to-slate-500';

  const statusText = (status?: string) =>
    status === 'active' ? 'Aktif'
    : status === 'expired' ? 'Süresi Dolmuş'
    : status === 'sold' ? 'Satıldı'
    : status === 'draft' ? 'Taslak' : (status ?? '-');

  const bestOf = (field: 'finalPremium'|'riskScore') => {
    const values = quotes.map(q => (q as any)[field] ?? 0);
    if (values.length === 0) return undefined;
    return field === 'finalPremium' ? Math.min(...values) : Math.max(...values);
  };

  const isBest = (q: Quote, field: 'finalPremium'|'riskScore') =>
    ((q as any)[field] ?? 0) === bestOf(field);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <td className="p-4 font-semibold text-gray-700 border-b-2 border-gray-200">Özellik</td>
                  {quotes.map(q => (
                    <td key={q.id} className="p-4 border-b-2 border-gray-200">
                      <div className="text-center">
                        <div className="font-bold text-lg text-gray-900 mb-2">{q.uniqueRefNo ?? q.id}</div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${statusColor(q.status)} text-white`}>
                          {statusText(q.status)}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {/* Prim */}
                <tr className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <td className="p-4 font-semibold text-gray-900 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Net Prim
                  </td>
                  {quotes.map(q => (
                    <td key={q.id} className="p-4 text-center">
                      <div className={`text-2xl font-bold ${isBest(q,'finalPremium') ? 'text-green-600' : 'text-gray-900'}`}>
                        ₺{(q.finalPremium ?? q.premiumAmount ?? 0).toLocaleString('tr-TR')}
                      </div>
                      {isBest(q,'finalPremium') && (
                        <div className="text-xs text-green-600 font-medium mt-1 flex items-center justify-center">
                          <Award className="h-3 w-3 mr-1" />
                          En Uygun
                        </div>
                      )}
                      {(q.totalDiscount ?? 0) > 0 && (
                        <div className="text-sm text-green-600 mt-1">
                          ₺{q.totalDiscount!.toLocaleString('tr-TR')} indirim
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Şirket */}
                <tr>
                  <td className="p-4 font-semibold text-gray-900">Sigorta Şirketi</td>
                  {quotes.map(q => (
                    <td key={q.id} className="p-4 text-center">
                      <div className="font-medium text-gray-900">{q.companyName ?? '-'}</div>
                    </td>
                  ))}
                </tr>

                {/* Risk */}
                <tr className="bg-gradient-to-r from-orange-50 to-red-50">
                  <td className="p-4 font-semibold text-gray-900 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-orange-600" />
                    Risk Skoru
                  </td>
                  {quotes.map(q => (
                    <td key={q.id} className="p-4 text-center">
                      <div className={`text-xl font-bold ${isBest(q,'riskScore') ? 'text-green-600' : 'text-gray-900'}`}>
                        {q.riskScore ?? 0}/100
                      </div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${riskColor(q.riskLevel)} text-white mt-1`}>
                        {riskText(q.riskLevel)}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Araç */}
                <tr className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <td className="p-4 font-semibold text-gray-900 flex items-center">
                    <Car className="h-5 w-5 mr-2 text-blue-600" />
                    Araç
                  </td>
                  {quotes.map(q => (
                    <td key={q.id} className="p-4 text-center">
                      <div className="font-medium text-gray-900">
                        {q.vehicle?.brand ?? '-'} {q.vehicle?.model ?? ''}
                      </div>
                      <div className="text-sm text-gray-600">{q.vehicle?.year ?? '-'}</div>
                      <div className="text-sm text-gray-600">{q.vehicle?.plateNumber ?? '-'}</div>
                    </td>
                  ))}
                </tr>

                {/* Sürücü */}
                <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <td className="p-4 font-semibold text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2 text-purple-600" />
                    Sürücü
                  </td>
                  {quotes.map(q => (
                    <td key={q.id} className="p-4 text-center">
                      <div className="font-medium text-gray-900">
                        {(q.driver?.firstName ?? '-')} {(q.driver?.lastName ?? '')}
                      </div>
                      <div className="text-sm text-gray-600">{q.driver?.profession ?? ''}</div>
                      {(q.driver?.hasAccidents || q.driver?.hasViolations) && (
                        <div className="flex items-center justify-center mt-1">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-xs text-yellow-600">Risk Faktörü</span>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Teminat */}
                <tr>
                  <td className="p-4 font-semibold text-gray-900">Teminat Tutarı</td>
                  {quotes.map(q => (
                    <td key={q.id} className="p-4 text-center">
                      <div className="font-medium text-gray-900">
                        ₺{(q.coverageAmount ?? 0).toLocaleString('tr-TR')}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Tarihler */}
                <tr className="bg-gray-50">
                  <td className="p-4 font-semibold text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                    Geçerlilik
                  </td>
                  {quotes.map(q => (
                    <td key={q.id} className="p-4 text-center">
                      <div className="text-sm text-gray-900">
                        {q.validUntil ? new Date(q.validUntil).toLocaleDateString('tr-TR') : '-'}
                      </div>
                      <div className="text-xs text-gray-600">
                        {q.createdAt ? new Date(q.createdAt).toLocaleDateString('tr-TR') : '-'} tarihinde oluşturuldu
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
                  {quotes.map(q => (
                    <td key={q.id} className="p-4 text-center">
                      {(q.discounts?.length ?? 0) > 0 ? (
                        <div className="space-y-1">
                          {q.discounts!.map((d, i) => (
                            <div key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              {d.name} (%{d.percentage})
                            </div>
                          ))}
                        </div>
                      ) : <div className="text-sm text-gray-500">İndirim yok</div>}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Özet */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Karşılaştırma Özeti
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-green-600 mb-2">En Uygun Prim</h4>
                {(() => {
                  const q = quotes.find(qq => isBest(qq,'finalPremium'));
                  return q ? (
                    <div>
                      <div className="font-bold text-lg">{q.uniqueRefNo ?? q.id}</div>
                      <div className="text-green-600">₺{(q.finalPremium ?? q.premiumAmount ?? 0).toLocaleString('tr-TR')}</div>
                      <div className="text-sm text-gray-600">{q.companyName ?? '-'}</div>
                    </div>
                  ) : null;
                })()}
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-2">En Yüksek Risk Skoru</h4>
                {(() => {
                  const q = quotes.find(qq => isBest(qq,'riskScore'));
                  return q ? (
                    <div>
                      <div className="font-bold text-lg">{q.uniqueRefNo ?? q.id}</div>
                      <div className="text-blue-600">{q.riskScore ?? 0}/100</div>
                      <div className="text-sm text-gray-600">{riskText(q.riskLevel)}</div>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-4">
            <button onClick={onClose} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Kapat
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600">
              PDF Olarak İndir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteComparison;

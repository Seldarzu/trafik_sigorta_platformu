// src/components/Policies/PolicyDetailModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Download, RefreshCw, Calendar, Car, User, Shield, FileText, CreditCard, AlertTriangle } from 'lucide-react';
import { Policy, PolicyInstallment, PolicyClaim } from '../../types';
import { policyService } from '../../services/policyService';

interface PolicyDetailModalProps {
  policy: Policy;
  onClose: () => void;
}

const PolicyDetailModal: React.FC<PolicyDetailModalProps> = ({ policy, onClose }) => {
  const [installments, setInstallments] = useState<PolicyInstallment[]>([]);
  const [claims, setClaims] = useState<PolicyClaim[]>([]);
  const [activeTab, setActiveTab] = useState<'details'|'installments'|'claims'>('details');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [ins, cls] = await Promise.all([
          policyService.getPolicyInstallments(policy.id),
          policyService.getPolicyClaims(policy.id)
        ]);
        setInstallments(ins);
        setClaims(cls);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [policy.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-500';
      case 'expired': return 'from-red-500 to-pink-500';
      case 'pending': return 'from-yellow-500 to-orange-500';
      case 'cancelled': return 'from-gray-500 to-slate-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif Poliçe';
      case 'expired': return 'Süresi Dolmuş';
      case 'pending': return 'Beklemede';
      case 'cancelled': return 'İptal Edilmiş';
      default: return status;
    }
  };

  const getInstallmentStatusColor = (status: string) =>
    status === 'paid' ? 'text-green-600 bg-green-100'
    : status === 'pending' ? 'text-yellow-600 bg-yellow-100'
    : 'text-red-600 bg-red-100';

  const getClaimStatusColor = (status: string) =>
    status === 'paid' ? 'text-green-600 bg-green-100'
    : status === 'approved' ? 'text-blue-600 bg-blue-100'
    : status === 'investigating' ? 'text-yellow-600 bg-yellow-100'
    : 'text-red-600 bg-red-100';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className={`bg-gradient-to-r ${getStatusColor(policy.status)} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{policy.policyNumber}</h2>
              <p className="text-lg opacity-90">{getStatusText(policy.status)}</p>
              <p className="text-sm opacity-75">{policy.companyName ?? '-'}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'details', label: 'Poliçe Detayları', icon: FileText },
                { id: 'installments', label: 'Taksitler', icon: CreditCard },
                { id: 'claims', label: 'Hasarlar', icon: AlertTriangle }
              ].map((tab) => {
                const Icon = tab.icon as any;
                const id = tab.id as 'details'|'installments'|'claims';
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {loading && <div className="py-8 text-center text-gray-500">Yükleniyor…</div>}

          {!loading && activeTab === 'details' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-blue-500" />
                  Poliçe Özeti
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      ₺{(policy.finalPremium ?? 0).toLocaleString('tr-TR')}
                    </div>
                    <div className="text-sm text-gray-600">Net Prim</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      ₺{(policy.coverageAmount ?? 0).toLocaleString('tr-TR')}
                    </div>
                    <div className="text-sm text-gray-600">Teminat Tutarı</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {(policy.riskScore ?? 0)}/100
                    </div>
                    <div className="text-sm text-gray-600">Risk Skoru</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Car className="h-5 w-5 mr-2 text-green-500" />
                    Araç Bilgileri
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plaka:</span>
                      <span className="font-medium">{policy.vehicle.plateNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Marka/Model:</span>
                      <span className="font-medium">{policy.vehicle.brand} {policy.vehicle.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model Yılı:</span>
                      <span className="font-medium">{policy.vehicle.year}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-purple-500" />
                    Sürücü Bilgileri
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ad Soyad:</span>
                      <span className="font-medium">{policy.driver.firstName} {policy.driver.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">T.C. Kimlik:</span>
                      <span className="font-medium">{policy.driver.tcNumber ?? '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Meslek:</span>
                      <span className="font-medium">{policy.driver.profession ?? '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                  Poliçe Tarihleri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Başlangıç Tarihi</p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(policy.startDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Bitiş Tarihi</p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(policy.endDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && activeTab === 'installments' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Taksit Planı</h3>
              {installments.map((ins) => (
                <div key={ins.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{ins.installmentNumber}</div>
                        <div className="text-xs text-gray-500">Taksit</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">₺{ins.amount.toLocaleString('tr-TR')}</div>
                        <div className="text-sm text-gray-600">Vade: {new Date(ins.dueDate).toLocaleDateString('tr-TR')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${getInstallmentStatusColor(ins.status)}`}>
                        {ins.status === 'paid' ? 'Ödendi' : ins.status === 'pending' ? 'Beklemede' : 'Gecikmiş'}
                      </span>
                      {ins.paidDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Ödeme: {new Date(ins.paidDate).toLocaleDateString('tr-TR')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {installments.length === 0 && <div className="text-gray-500 py-6">Taksit kaydı yok.</div>}
            </div>
          )}

          {!loading && activeTab === 'claims' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Hasar Geçmişi</h3>
              {claims.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Bu poliçe için hasar kaydı bulunmuyor.</p>
                </div>
              ) : (
                claims.map((c) => (
                  <div key={c.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{c.claimNumber}</h4>
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${getClaimStatusColor(c.status)}`}>
                            {c.status === 'paid' ? 'Ödendi' :
                             c.status === 'approved' ? 'Onaylandı' :
                             c.status === 'investigating' ? 'İnceleniyor' :
                             c.status === 'rejected' ? 'Reddedildi' : c.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{c.description}</p>
                        <div className="text-xs text-gray-500">
                          Olay: {new Date(c.incidentDate).toLocaleDateString('tr-TR')} •
                          Bildirim: {new Date(c.reportDate).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          ₺{(c.approvedAmount ?? c.estimatedAmount).toLocaleString('tr-TR')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {c.approvedAmount ? 'Onaylanan' : 'Tahmini'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="mt-8 flex justify-end space-x-4">
            <button onClick={onClose} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Kapat
            </button>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600">
              <Download className="h-5 w-5 mr-2" />
              PDF İndir
            </button>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600">
              <RefreshCw className="h-5 w-5 mr-2" />
              Poliçeyi Yenile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetailModal;

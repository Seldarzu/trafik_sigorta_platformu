import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { Policy } from '../../types';
import { policyService } from '../../services/policyService';
import PolicyCard from './PolicyCard';
import PolicyDetailModal from './PolicyDetailModal';

const PolicyList: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => { loadPolicies(); }, []);

  useEffect(() => {
    // client-side filtre (sunucu araması da aşağıda var)
    let filtered = policies;
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.policyNumber.toLowerCase().includes(t) ||
        p.vehicle.plateNumber.toLowerCase().includes(t) ||
        `${p.driver.firstName} ${p.driver.lastName}`.toLowerCase().includes(t)
      );
    }
    if (statusFilter) filtered = filtered.filter(p => p.status === statusFilter);
    setFilteredPolicies(filtered);
  }, [policies, searchTerm, statusFilter]);

  const loadPolicies = async (opts?: { status?: string; text?: string }) => {
    try {
      setLoading(true);
      setError(null);
      // Sunucu tarafı arama/filtre (varsa), yoksa list endpoint
      let data: Policy[];
      if (opts?.text || opts?.status) {
        data = await policyService.searchPolicies({ text: opts.text, status: opts.status });
      } else {
        data = await policyService.getPolicies();
      }
      setPolicies(data);
    } catch (e:any) {
      console.error('Error loading policies:', e);
      setError(e?.response?.data?.message || e?.message || 'Poliçeler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    active:   policies.filter(p => p.status === 'active').length,
    expired:  policies.filter(p => p.status === 'expired').length,
    pending:  policies.filter(p => p.status === 'pending').length,
    cancelled:policies.filter(p => p.status === 'cancelled').length,
  };

  const handlePolicySelect = (policy: Policy) => {
    setSelectedPolicy(policy);
    setShowDetailModal(true);
  };

  const handleRenewPolicy = async (policyId: string) => {
    try {
      await policyService.renewPolicy(policyId);
      await loadPolicies({ status: statusFilter || undefined, text: searchTerm || undefined });
    } catch (e) {
      console.error('Error renewing policy:', e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Poliçeler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Poliçe Yönetimi
          </h1>
          <p className="mt-2 text-lg text-gray-600">Aktif poliçelerinizi görüntüleyin ve yönetin</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Aktif Poliçeler</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Süresi Dolan</p>
                <p className="text-3xl font-bold text-red-600">{stats.expired}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Beklemede</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">İptal Edilen</p>
                <p className="text-3xl font-bold text-gray-600">{stats.cancelled}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Arama & Filtre */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Poliçe ara (poliçe no, plaka, müşteri adı)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') loadPolicies({ text: searchTerm || undefined, status: statusFilter || undefined }) }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                const val = e.target.value;
                setStatusFilter(val);
                loadPolicies({ text: searchTerm || undefined, status: val || undefined });
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="expired">Süresi Dolmuş</option>
              <option value="pending">Beklemede</option>
              <option value="cancelled">İptal Edilmiş</option>
            </select>
          </div>
        </div>

        {/* Liste */}
        <div className="space-y-4">
          {filteredPolicies.map((policy) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              onSelect={handlePolicySelect}
              onRenew={handleRenewPolicy}
            />
          ))}
        </div>

        {filteredPolicies.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Poliçe bulunamadı</h3>
            <p className="text-gray-600">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
          </div>
        )}

        {/* Detay Modal */}
        {showDetailModal && selectedPolicy && (
          <PolicyDetailModal
            policy={selectedPolicy}
            onClose={() => { setShowDetailModal(false); setSelectedPolicy(null); }}
          />
        )}
      </div>
    </div>
  );
};

export default PolicyList;

import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, ChevronDown, GitCompare, X } from 'lucide-react';
import { Quote, FilterOptions } from '../../types';
import QuoteCard from './QuoteCard';
import QuoteComparison from './QuoteComparison';
import { QuoteService } from '../../services/QuoteService';

interface QuoteListProps {
  onQuoteSelect: (quote: Quote) => void;
}

const defaultFilters: FilterOptions = {
  status: '',
  riskLevel: '' as any,
  minPremium: 0,
  maxPremium: 1_000_000,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const safeTime = (iso?: string) => (iso ? new Date(iso).getTime() : 0);

const QuoteList: React.FC<QuoteListProps> = ({ onQuoteSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedQuotes, setSelectedQuotes] = useState<Quote[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  const [data, setData] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // backend araması
  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await QuoteService.search({
        customerName: searchTerm || undefined,
        from: undefined,
        to: undefined,
        page: 0,
        size: 50,
      });
      setData(res);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Teklifler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFilter = (key: keyof FilterOptions, value: any) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleQuoteSelection = (quote: Quote) => {
    setSelectedQuotes((prev) => {
      const exists = prev.some((q) => q.id === quote.id);
      if (exists) return prev.filter((q) => q.id !== quote.id);
      if (prev.length < 3) return [...prev, quote];
      return prev;
    });
  };

  const clearSelection = () => {
    setSelectedQuotes([]);
    setShowComparison(false);
  };

  // client-side filtre/sıralama
  const filteredQuotes = useMemo(() => {
    const text = searchTerm.toLowerCase();

    let arr = data.filter((q) => {
      const plate = q.vehicle?.plateNumber?.toLowerCase() ?? '';
      const fullname = `${q.driver?.firstName ?? ''} ${q.driver?.lastName ?? ''}`.toLowerCase();
      const idText = (q.uniqueRefNo ?? q.id ?? '').toLowerCase();

      const matchesText = plate.includes(text) || fullname.includes(text) || idText.includes(text);
      const matchesStatus = !filters.status || q.status === filters.status;
      const matchesRisk = !filters.riskLevel || q.riskLevel === filters.riskLevel;
      const premium = q.finalPremium ?? q.premiumAmount ?? 0;
      const matchesPremium =
        premium >= (filters.minPremium ?? 0) && premium <= (filters.maxPremium ?? 1_000_000);

      return matchesText && matchesStatus && matchesRisk && matchesPremium;
    });

    // sıralama
    {
      const sortKey = filters.sortBy; // 'createdAt' | 'finalPremium' | 'riskScore'
      const dir = filters.sortOrder === 'asc' ? 1 : -1;

      arr.sort((a, b) => {
        const av =
          sortKey === 'finalPremium'
            ? (a.finalPremium ?? a.premiumAmount ?? 0)
            : sortKey === 'riskScore'
            ? (a.riskScore ?? 0)
            : safeTime(a.createdAt);

        const bv =
          sortKey === 'finalPremium'
            ? (b.finalPremium ?? b.premiumAmount ?? 0)
            : sortKey === 'riskScore'
            ? (b.riskScore ?? 0)
            : safeTime(b.createdAt);

        return (av - bv) * dir;
      });
    }

    return arr;
  }, [data, filters, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Teklifler</h1>
        <p className="mt-2 text-gray-600">Oluşturduğunuz teklifleri görüntüleyin ve yönetin</p>
      </div>

      {/* Search + Filter toggle */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Plaka, isim veya teklif numarası ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') fetchQuotes();
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtreler
            <ChevronDown
              className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-4 border border-gray-200 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                <select
                  value={filters.status}
                  onChange={(e) => updateFilter('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Tümü</option>
                  <option value="active">Aktif</option>
                  <option value="expired">Süresi Dolmuş</option>
                  <option value="sold">Satıldı</option>
                  <option value="draft">Taslak</option>
                  <option value="pending">Beklemede</option>
                  <option value="approved">Onaylı</option>
                  <option value="rejected">Reddedildi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Risk Seviyesi</label>
                <select
                  value={filters.riskLevel as any}
                  onChange={(e) => updateFilter('riskLevel', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Tümü</option>
                  <option value="low">Düşük Risk</option>
                  <option value="medium">Orta Risk</option>
                  <option value="high">Yüksek Risk</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Prim (₺)</label>
                <input
                  type="number"
                  value={filters.minPremium}
                  onChange={(e) => updateFilter('minPremium', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Prim (₺)</label>
                <input
                  type="number"
                  value={filters.maxPremium}
                  onChange={(e) =>
                    updateFilter('maxPremium', parseInt(e.target.value) || 1_000_000)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results summary */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {loading ? 'Yükleniyor…' : `${filteredQuotes.length} teklif bulundu`}
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sırala:</span>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as any;
              updateFilter('sortBy', sortBy);
              updateFilter('sortOrder', sortOrder);
            }}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="createdAt-desc">En Yeni</option>
            <option value="createdAt-asc">En Eski</option>
            <option value="finalPremium-asc">Prim (Düşük→Yüksek)</option>
            <option value="finalPremium-desc">Prim (Yüksek→Düşük)</option>
            <option value="riskScore-asc">Risk (Düşük→Yüksek)</option>
            <option value="riskScore-desc">Risk (Yüksek→Düşük)</option>
          </select>
          <button onClick={fetchQuotes} className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50">
            Yenile
          </button>
        </div>
      </div>

      {/* Comparison bar */}
      {selectedQuotes.length > 0 && (
        <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <GitCompare className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Karşılaştırma Modu</h3>
                <p className="text-sm opacity-90">{selectedQuotes.length} teklif seçildi (maksimum 3)</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {selectedQuotes.length >= 2 && (
                <button
                  onClick={() => setShowComparison(true)}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50"
                >
                  Karşılaştır
                </button>
              )}
              <button onClick={clearSelection} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Seçilenler */}
          <div className="mt-3 flex flex-wrap gap-3">
            {selectedQuotes.map((q) => (
              <div key={q.id} className="bg-white/20 px-3 py-2 rounded-lg flex items-center space-x-2">
                <span className="text-sm font-medium">{q.uniqueRefNo ?? q.id}</span>
                <button onClick={() => toggleQuoteSelection(q)} className="hover:bg-white/20 p-1 rounded-full">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cards */}
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {!loading && filteredQuotes.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Teklif bulunamadı</h3>
          <p className="text-gray-600">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
        </div>
      )}

      <div className="space-y-4">
        {filteredQuotes.map((q) => (
          <QuoteCard
            key={q.id}
            quote={q}
            onSelect={onQuoteSelect}
            onToggleCompare={toggleQuoteSelection}
            isSelected={selectedQuotes.some((s) => s.id === q.id)}
            canSelect={selectedQuotes.length < 3 || selectedQuotes.some((s) => s.id === q.id)}
          />
        ))}
      </div>

      {/* Comparison modal */}
      {showComparison && selectedQuotes.length >= 2 && (
        <QuoteComparison quotes={selectedQuotes} onClose={() => setShowComparison(false)} />
      )}
    </div>
  );
};

export default QuoteList;

import React, { useState } from 'react';
import { Search, Filter, Eye, Download, ChevronDown, GitCompare, X } from 'lucide-react';
import { Quote, FilterOptions } from '../../types';
import QuoteCard from './QuoteCard';
import QuoteComparison from './QuoteComparison';

interface QuoteListProps {
  onQuoteSelect: (quote: Quote) => void;
}

const QuoteList: React.FC<QuoteListProps> = ({ onQuoteSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedQuotes, setSelectedQuotes] = useState<Quote[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: '',
    riskLevel: '',
    dateRange: '',
    minPremium: 0,
    maxPremium: 10000,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Mock data - in real app this would come from API
  const quotes: Quote[] = [
    {
      id: 'Q-2024-001',
      vehicle: {
        plateNumber: '34 ABC 123',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        engineSize: '1.6',
        fuelType: 'gasoline',
        usage: 'personal',
        cityCode: '34'
      },
      driver: {
        firstName: 'Mehmet',
        lastName: 'Özkan',
        tcNumber: '12345678901',
        birthDate: '1985-05-15',
        licenseDate: '2005-08-20',
        gender: 'male',
        maritalStatus: 'married',
        education: 'university',
        profession: 'Mühendis',
        hasAccidents: false,
        accidentCount: 0,
        hasViolations: false,
        violationCount: 0
      },
      premium: 2450,
      coverageAmount: 500000,
      riskScore: 75,
      riskLevel: 'low',
      validUntil: '2024-02-15',
      createdAt: '2024-01-16',
      status: 'active',
      agentId: 'agent-1',
      companyName: 'Anadolu Sigorta',
      discounts: [
        { type: 'safe_driver', name: 'Güvenli Sürücü', percentage: 10, amount: 245 }
      ],
      totalDiscount: 245,
      finalPremium: 2205
    },
    {
      id: 'Q-2024-002',
      vehicle: {
        plateNumber: '06 XYZ 789',
        brand: 'Volkswagen',
        model: 'Golf',
        year: 2020,
        engineSize: '1.4',
        fuelType: 'gasoline',
        usage: 'personal',
        cityCode: '06'
      },
      driver: {
        firstName: 'Ayşe',
        lastName: 'Demir',
        tcNumber: '12345678902',
        birthDate: '1992-03-10',
        licenseDate: '2012-06-15',
        gender: 'female',
        maritalStatus: 'single',
        education: 'university',
        profession: 'Öğretmen',
        hasAccidents: true,
        accidentCount: 1,
        hasViolations: false,
        violationCount: 0
      },
      premium: 3200,
      coverageAmount: 500000,
      riskScore: 85,
      riskLevel: 'medium',
      validUntil: '2024-02-14',
      createdAt: '2024-01-15',
      status: 'active',
      agentId: 'agent-1',
      companyName: 'Aksigorta',
      discounts: [],
      totalDiscount: 0,
      finalPremium: 3200
    },
    {
      id: 'Q-2024-003',
      vehicle: {
        plateNumber: '35 DEF 456',
        brand: 'Ford',
        model: 'Focus',
        year: 2019,
        engineSize: '1.6',
        fuelType: 'gasoline',
        usage: 'personal',
        cityCode: '35'
      },
      driver: {
        firstName: 'Ali',
        lastName: 'Kaya',
        tcNumber: '12345678903',
        birthDate: '1978-11-22',
        licenseDate: '1998-03-10',
        gender: 'male',
        maritalStatus: 'married',
        education: 'high_school',
        profession: 'Esnaf',
        hasAccidents: false,
        accidentCount: 0,
        hasViolations: true,
        violationCount: 2
      },
      premium: 2890,
      coverageAmount: 500000,
      riskScore: 78,
      riskLevel: 'medium',
      validUntil: '2024-02-13',
      createdAt: '2024-01-14',
      status: 'expired',
      agentId: 'agent-1',
      companyName: 'Güneş Sigorta',
      discounts: [
        { type: 'no_claim', name: 'Hasar Kaydı Yok', percentage: 15, amount: 433 }
      ],
      totalDiscount: 433,
      finalPremium: 2457
    }
  ];

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${quote.driver.firstName} ${quote.driver.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status || quote.status === filters.status;
    const matchesRiskLevel = !filters.riskLevel || quote.riskLevel === filters.riskLevel;
    const matchesPremium = quote.finalPremium >= filters.minPremium && quote.finalPremium <= filters.maxPremium;

    return matchesSearch && matchesStatus && matchesRiskLevel && matchesPremium;
  });

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleQuoteSelection = (quote: Quote) => {
    setSelectedQuotes(prev => {
      const isSelected = prev.find(q => q.id === quote.id);
      if (isSelected) {
        return prev.filter(q => q.id !== quote.id);
      } else if (prev.length < 3) {
        return [...prev, quote];
      }
      return prev;
    });
  };

  const clearSelection = () => {
    setSelectedQuotes([]);
    setShowComparison(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Teklifler</h1>
        <p className="mt-2 text-gray-600">Oluşturduğunuz trafik sigortası tekliflerini görüntüleyin ve yönetin</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Plaka, isim veya teklif numarası ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtreler
            <ChevronDown className={`h-4 w-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
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
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Risk Seviyesi</label>
                <select
                  value={filters.riskLevel}
                  onChange={(e) => updateFilter('riskLevel', e.target.value)}
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
                  onChange={(e) => updateFilter('maxPremium', parseInt(e.target.value) || 10000)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredQuotes.length} teklif bulundu
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sırala:</span>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              updateFilter('sortBy', sortBy);
              updateFilter('sortOrder', sortOrder);
            }}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="createdAt-desc">En Yeni</option>
            <option value="createdAt-asc">En Eski</option>
            <option value="finalPremium-asc">Prim (Düşükten Yükseğe)</option>
            <option value="finalPremium-desc">Prim (Yüksekten Düşüğe)</option>
            <option value="riskScore-asc">Risk Skoru (Düşükten Yükseğe)</option>
            <option value="riskScore-desc">Risk Skoru (Yüksekten Düşüğe)</option>
          </select>
        </div>
      </div>

      {/* Comparison Bar */}
      {selectedQuotes.length > 0 && (
        <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <GitCompare className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Karşılaştırma Modu</h3>
                <p className="text-sm opacity-90">
                  {selectedQuotes.length} teklif seçildi (maksimum 3)
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {selectedQuotes.length >= 2 && (
                <button
                  onClick={() => setShowComparison(true)}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
                >
                  Karşılaştır
                </button>
              )}
              <button
                onClick={clearSelection}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Selected Quotes Preview */}
          <div className="mt-3 flex space-x-3">
            {selectedQuotes.map((quote) => (
              <div key={quote.id} className="bg-white/20 px-3 py-2 rounded-lg flex items-center space-x-2">
                <span className="text-sm font-medium">{quote.id}</span>
                <button
                  onClick={() => toggleQuoteSelection(quote)}
                  className="hover:bg-white/20 p-1 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quote Cards */}
      <div className="space-y-4">
        {filteredQuotes.map((quote) => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            onSelect={onQuoteSelect}
            onToggleCompare={toggleQuoteSelection}
            isSelected={selectedQuotes.some(q => q.id === quote.id)}
            canSelect={selectedQuotes.length < 3 || selectedQuotes.some(q => q.id === quote.id)}
          />
        ))}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Teklif bulunamadı</h3>
          <p className="text-gray-600">
            Arama kriterlerinizi değiştirerek tekrar deneyin.
          </p>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && selectedQuotes.length >= 2 && (
        <QuoteComparison
          quotes={selectedQuotes}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
};

export default QuoteList;
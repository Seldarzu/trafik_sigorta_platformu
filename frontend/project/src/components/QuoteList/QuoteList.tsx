// src/components/QuoteList/QuoteList.tsx
import React, { useState } from 'react'
import { Search, Filter, ChevronDown, X, GitCompare } from 'lucide-react'
import { Quote, FilterOptions } from '../../types'
import { useQuotes } from '../../hooks/useQuotes'

interface QuoteListProps {
  onQuoteSelect: (quote: Quote) => void
}

const QuoteList: React.FC<QuoteListProps> = ({ onQuoteSelect }) => {
  const { data: quotes, loading, error } = useQuotes()
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    status: '',
    minPremium: 0,
    maxPremium: 1e9,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [selectedQuotes, setSelectedQuotes] = useState<Quote[]>([])

  if (loading) return <div className="p-8">Yükleniyor…</div>
  if (error)   return <div className="p-8 text-red-600">Hata: {(error as Error).message}</div>

  // null-guard: quotes olabilir, o yüzden hemen boş diziye düşür
  const allQuotes = quotes ?? []

  const filtered = allQuotes
    .filter(q => {
      const matchesSearch = q.uniqueRefNo
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesStatus = !filters.status
        || q.status.toLowerCase() === filters.status
      const matchesPremium = q.premiumAmount >= filters.minPremium
        && q.premiumAmount <= filters.maxPremium
      return matchesSearch && matchesStatus && matchesPremium
    })
    .sort((a, b) => {
      const getValue = (x: Quote) =>
        filters.sortBy === 'createdAt'
          ? new Date(x.createdAt).getTime()
          : (x as any)[filters.sortBy]
      const va = getValue(a)
      const vb = getValue(b)
      return filters.sortOrder === 'asc' ? va - vb : vb - va
    })

  const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) =>
    setFilters(f => ({ ...f, [key]: value }))

  const toggleSelection = (quote: Quote) =>
    setSelectedQuotes(prev =>
      prev.some(x => x.id === quote.id)
        ? prev.filter(x => x.id !== quote.id)
        : prev.length < 3
          ? [...prev, quote]
          : prev
    )

  const clearSelection = () => setSelectedQuotes([])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Teklifler</h1>
      </div>

      {/* Search & Filter Toggle */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Teklif numarası ile ara..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 py-2 border rounded"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-4 py-2 border rounded bg-white"
        >
          <Filter className="mr-2 h-4 w-4" /> Filtreler
          <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-4 border rounded mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status */}
            <select
              value={filters.status}
              onChange={e => updateFilter('status', e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">Tümü</option>
              <option value="pending">Beklemede</option>
              <option value="approved">Onaylandı</option>
              <option value="rejected">Reddedildi</option>
            </select>

            {/* Min Premium */}
            <input
              type="number"
              placeholder="Min Prim"
              value={filters.minPremium}
              onChange={e => updateFilter('minPremium', parseInt(e.target.value) || 0)}
              className="border rounded px-3 py-2"
            />

            {/* Max Premium */}
            <input
              type="number"
              placeholder="Max Prim"
              value={filters.maxPremium}
              onChange={e => updateFilter('maxPremium', parseInt(e.target.value) || 1e9)}
              className="border rounded px-3 py-2"
            />

            {/* Sort */}
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={e => {
                const [sortBy, sortOrder] = e.target.value.split('-') as [FilterOptions['sortBy'], FilterOptions['sortOrder']]
                updateFilter('sortBy', sortBy)
                updateFilter('sortOrder', sortOrder)
              }}
              className="border rounded px-3 py-2"
            >
              <option value="createdAt-desc">En Yeni</option>
              <option value="createdAt-asc">En Eski</option>
              <option value="premiumAmount-desc">Prim (Yüksekten Düşüğe)</option>
              <option value="premiumAmount-asc">Prim (Düşükten Yükseğe)</option>
              <option value="riskScore-desc">Risk Skoru (Yüksekten Düşüğe)</option>
              <option value="riskScore-asc">Risk Skoru (Düşükten Yükseğe)</option>
            </select>
          </div>
        </div>
      )}

      {/* Comparison Bar */}
      {selectedQuotes.length > 0 && (
        <div className="mb-6 bg-blue-500 text-white p-4 rounded flex justify-between">
          <span>{selectedQuotes.length} teklif seçildi</span>
          <button onClick={clearSelection}>
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Quote Cards */}
      <div className="space-y-4">
        {filtered.map(q => (
          <div
            key={q.id}
            className={`p-4 border rounded flex justify-between items-center ${
              selectedQuotes.some(x => x.id === q.id)
                ? 'bg-blue-50 border-blue-400'
                : 'bg-white'
            }`}
          >
            <div>
              <p className="font-semibold">{q.uniqueRefNo}</p>
              <p className="text-sm">Prim: ₺{q.premiumAmount}</p>
              <p className="text-sm">Risk: {q.riskScore}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onQuoteSelect(q)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Seç
              </button>
              <button
                onClick={() => toggleSelection(q)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                {selectedQuotes.some(x => x.id === q.id) ? 'Çıkar' : 'Karşılaştır'}
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg">Teklif bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuoteList

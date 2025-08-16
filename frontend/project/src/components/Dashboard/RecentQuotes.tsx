// src/components/Dashboard/RecentQuotes.tsx
import React from 'react';
import { Eye, Car, User, Calendar } from 'lucide-react';
import { useQuotes } from '../../hooks/useQuotes';
import { Page, Quote } from '../../types';

interface Props {
  onPageChange: (page: Page) => void;
}

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case 'low':
      return 'text-green-600 bg-green-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'high':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
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

// Güvenli tarih formatlayıcı
const formatDateTR = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('tr-TR') : '—';

const RecentQuotes: React.FC<Props> = ({ onPageChange }) => {
  const { data, loading, error } = useQuotes();
  const recent: Quote[] = data?.slice(0, 5) ?? [];

  if (loading) return <div className="p-6">Yükleniyor…</div>;
  if (error)   return <div className="p-6 text-red-600">Hata: {error.message}</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Son 5 Teklif</h3>
        <button
          onClick={() => onPageChange('quotes')}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          Tümünü Gör
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-200">
        {recent.length === 0 ? (
          <div className="p-6 text-gray-500">Teklif yok</div>
        ) : recent.map((quote) => {
          // Optional chaining ve fallback'ler
          const brand     = quote.vehicle?.brand      ?? '—';
          const model     = quote.vehicle?.model      ?? '';
          const year      = quote.vehicle?.year       ?? '';
          const plate     = quote.vehicle?.plateNumber ?? '';
          const firstName = quote.driver?.firstName   ?? '';
          const lastName  = quote.driver?.lastName    ?? '';

          return (
            <div
              key={quote.id}
              className="p-6 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
            >
              {/* Quote Info */}
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Car className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">
                    {brand} {model} {year && `(${year})`}
                  </span>
                  {plate && (
                    <span className="ml-2 text-sm text-gray-500">
                      {plate}
                    </span>
                  )}
                </div>
                <div className="flex items-center mb-2">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {firstName} {lastName}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">
                      {formatDateTR(quote.createdAt)}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(
                      quote.riskLevel ?? ''
                    )}`}
                  >
                    {getRiskLevelText(quote.riskLevel ?? '')}
                  </span>
                </div>
              </div>

              {/* Premium & Actions */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ₺{(quote.finalPremium ?? 0).toLocaleString('tr-TR')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {quote.companyName ?? ''}
                  </p>
                </div>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200">
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentQuotes;

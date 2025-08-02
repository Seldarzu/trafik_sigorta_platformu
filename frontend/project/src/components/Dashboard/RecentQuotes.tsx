import React from 'react'
import { useQuery } from 'react-query'
import { QuoteService } from '../../services/QuoteService'
import { Quote, Page } from '../../types'

interface Props { onPageChange: (page: Page) => void }

const RecentQuotes: React.FC<Props> = ({ onPageChange }) => {
  const { data, isLoading, error } = useQuery<Quote[]>('recentQuotes', QuoteService.getRecent)
  if (isLoading) return <div className="p-4">Yükleniyor…</div>
  if (error) return <div className="p-4 text-red-600">Hata</div>
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Son 5 Teklif</h2>
      <ul className="space-y-2">
        {data?.map(q => (
          <li key={q.id} className="flex justify-between">
            <span className="font-medium">{q.uniqueRefNo}</span>
            <button onClick={() => onPageChange('quotes')} className="text-blue-600 hover:underline text-sm">
              Detay
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecentQuotes

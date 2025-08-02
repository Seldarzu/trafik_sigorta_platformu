import React from 'react'
import { Plus, FileText, Users, PieChart } from 'lucide-react'
import { Page } from '../../types'

interface Props { onPageChange: (page: Page) => void }

const QuickActions: React.FC<Props> = ({ onPageChange }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-lg font-semibold mb-4">Hızlı İşlemler</h2>
    <div className="space-y-2">
      <button onClick={() => onPageChange('new-quote')} className="flex items-center px-4 py-2 bg-blue-100 rounded">
        <Plus className="h-5 w-5 mr-2" />Yeni Teklif
      </button>
      <button onClick={() => onPageChange('quotes')} className="flex items-center px-4 py-2 bg-green-100 rounded">
        <FileText className="h-5 w-5 mr-2" />Teklifler
      </button>
      <button onClick={() => onPageChange('customers')} className="flex items-center px-4 py-2 bg-yellow-100 rounded">
        <Users className="h-5 w-5 mr-2" />Müşteriler
      </button>
      <button onClick={() => onPageChange('analytics')} className="flex items-center px-4 py-2 bg-purple-100 rounded">
        <PieChart className="h-5 w-5 mr-2" />Analitik
      </button>
    </div>
  </div>
)

export default QuickActions

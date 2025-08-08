// src/components/Dashboard/QuickActions.tsx
import React from 'react';
import { Plus, FileText, PieChart, Users } from 'lucide-react';
import { Page } from '../../types';

interface QuickActionsProps {
  onPageChange: (page: Page) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onPageChange }) => {
  const actions: {
    id: string;
    title: string;
    description: string;
    icon: React.FC<any>;
    color: string;
    page: Page;
  }[] = [
    {
      id: 'new-quote',
      title: 'Yeni Teklif',
      description: 'Hızlıca yeni bir trafik sigortası teklifi oluşturun',
      icon: Plus,
      color: 'bg-blue-600 hover:bg-blue-700',
      page: 'new-quote',
    },
    {
      id: 'view-quotes',
      title: 'Teklifleri Görüntüle',
      description: 'Mevcut tekliflerinizi inceleyin ve yönetin',
      icon: FileText,
      color: 'bg-green-600 hover:bg-green-700',
      page: 'quotes',
    },
    {
      id: 'analytics',
      title: 'Performans Analizi',
      description: 'Satış performansınızı ve trendleri analiz edin',
      icon: PieChart,
      color: 'bg-purple-600 hover:bg-purple-700',
      page: 'analytics',
    },
    {
      id: 'customers',
      title: 'Müşteri Yönetimi',
      description: 'Müşteri bilgilerini görüntüleyin ve güncelleyin',
      icon: Users,
      color: 'bg-orange-600 hover:bg-orange-700',
      page: 'customers',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Hızlı İşlemler</h3>
      </div>
      <div className="p-6 space-y-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onPageChange(action.page)}
              className="w-full"
            >
              <div className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <div
                  className={`flex-shrink-0 p-3 rounded-lg ${action.color} transition-colors duration-200`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 text-left">
                  <h4 className="text-sm font-medium text-gray-900">
                    {action.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;

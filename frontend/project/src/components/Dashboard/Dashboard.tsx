import React from 'react';
import { Car, Users, TrendingUp, DollarSign, FileText, Clock } from 'lucide-react';
import StatCard from './StatCard';
import RecentQuotes from './RecentQuotes';
import QuickActions from './QuickActions';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const stats = [
    {
      title: 'Toplam Teklifler',
      value: '1,247',
      change: '+12%',
      changeType: 'increase' as const,
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Bu Ay Satılan',
      value: '89',
      change: '+23%',
      changeType: 'increase' as const,
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Toplam Prim',
      value: '₺2,456,780',
      change: '+8%',
      changeType: 'increase' as const,
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Aktif Müşteri',
      value: '567',
      change: '+5%',
      changeType: 'increase' as const,
      icon: Users,
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
          <span className="text-2xl">👋</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Hoş Geldiniz, Ahmet Bey
        </h1>
        <p className="mt-2 text-lg text-gray-600">Bugünkü performansınızı ve teklif durumlarınızı inceleyin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions onPageChange={onPageChange} />
        </div>

        {/* Recent Quotes */}
        <div className="lg:col-span-2">
          <RecentQuotes onPageChange={onPageChange} />
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Car className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">En Çok Sigortalanan</h3>
              <p className="text-2xl font-bold text-blue-600">Toyota Corolla</p>
              <p className="text-sm text-gray-500">Bu ay 24 adet</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Ortalama Süre</h3>
              <p className="text-2xl font-bold text-green-600">4.2 dk</p>
              <p className="text-sm text-gray-500">Teklif hazırlama</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Dönüşüm Oranı</h3>
              <p className="text-2xl font-bold text-purple-600">%67.8</p>
              <p className="text-sm text-gray-500">Tekliften satışa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
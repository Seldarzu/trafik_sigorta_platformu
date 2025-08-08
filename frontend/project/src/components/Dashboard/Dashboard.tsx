// src/components/Dashboard/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  FileText,
  TrendingUp,
  DollarSign,
  Users,
  Loader2,
  Car,
  Clock
} from 'lucide-react';
import StatCard from './StatCard';
import QuickActions from './QuickActions';
import RecentQuotes from './RecentQuotes';
import { Page, AnalyticsData } from '../../types';
import { AnalyticsService } from '../../services/AnalyticsService';

interface DashboardProps {
  onPageChange: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AnalyticsService.getAll('12m')
      .then(data => setAnalytics(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Önceki ayın satış adedi (array hiç boş değil diye varsayıyoruz; değilse 0)
  const previousPolicies = analytics.monthlyData[0]?.policies || 0;
  // Bu ay satılan adet
  const currentPolicies = analytics.monthlyData.slice(-1)[0]?.policies || 0;
  // Yüzde değişim (ölçü aleti)
  const policyChangePct = previousPolicies
    ? ((currentPolicies - previousPolicies) / previousPolicies) * 100
    : 0;
  const policyChangeLabel =
    `${currentPolicies - previousPolicies >= 0 ? '+' : ''}${policyChangePct.toFixed(1)}%`;

  const stats = [
    {
      title: 'Toplam Teklifler',
      value: analytics.totalPolicies.toString(),
      change: policyChangeLabel,
      changeType: policyChangePct >= 0 ? 'increase' as const : 'decrease' as const,
      icon: FileText,
      color: 'blue' as const,
    },
    {
      title: 'Bu Ay Satılan',
      value: currentPolicies.toString(),
      change: policyChangeLabel,
      changeType: policyChangePct >= 0 ? 'increase' as const : 'decrease' as const,
      icon: TrendingUp,
      color: 'green' as const,
    },
    {
      title: 'Toplam Prim',
      value: `₺${analytics.totalRevenue.toLocaleString()}`,
      change: '+0%',
      changeType: 'increase' as const,
      icon: DollarSign,
      color: 'purple' as const,
    },
    {
      title: 'Aktif Müşteri',
      value: analytics.customerSegments.reduce((sum, s) => sum + s.count, 0).toString(),
      change: '+0%',
      changeType: 'increase' as const,
      icon: Users,
      color: 'orange' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Karşılama */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <span className="text-2xl">👋</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Hoş Geldiniz
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Bugünkü performansınızı ve teklif durumlarınızı inceleyin
          </p>
        </div>

        {/* Üst İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map(s => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>

        {/* Hızlı Eylemler ve Son Teklifler */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <QuickActions onPageChange={onPageChange} />
          </div>
          <div className="lg:col-span-2">
            <RecentQuotes onPageChange={onPageChange} />
          </div>
        </div>

        {/* Ekstra İstatistikler */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">En Çok Sigortalanan</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.topVehicleBrands[0]?.brand || '-'}
                </p>
                <p className="text-sm text-gray-500">
                  {analytics.topVehicleBrands[0]?.count || 0} adet
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Ortalama Süre</h3>
                <p className="text-2xl font-bold text-green-600">
                  {analytics.performanceMetrics.find(m => m.metric === 'AverageTime')?.current.toFixed(1) || '0'} dk
                </p>
                <p className="text-sm text-gray-500">Teklif hazırlama</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Dönüşüm Oranı</h3>
                <p className="text-2xl font-bold text-purple-600">
                  %{analytics.conversionRate.toFixed(1)}
                </p>
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

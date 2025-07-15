import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Target, Calendar, Award, Zap } from 'lucide-react';
import { AnalyticsData } from '../../types';
import RevenueChart from './RevenueChart';
import RiskDistributionChart from './RiskDistributionChart';
import PerformanceMetrics from './PerformanceMetrics';
import TopBrands from './TopBrands';

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    totalRevenue: 2456780,
    totalPolicies: 1247,
    conversionRate: 67.8,
    averagePremium: 1970,
    monthlyData: [
      { month: 'Oca', revenue: 180000, policies: 89, quotes: 145 },
      { month: 'Şub', revenue: 220000, policies: 112, quotes: 178 },
      { month: 'Mar', revenue: 195000, policies: 98, quotes: 156 },
      { month: 'Nis', revenue: 240000, policies: 125, quotes: 189 },
      { month: 'May', revenue: 280000, policies: 142, quotes: 201 },
      { month: 'Haz', revenue: 310000, policies: 158, quotes: 234 },
      { month: 'Tem', revenue: 290000, policies: 147, quotes: 218 },
      { month: 'Ağu', revenue: 325000, policies: 165, quotes: 245 },
      { month: 'Eyl', revenue: 298000, policies: 151, quotes: 223 },
      { month: 'Eki', revenue: 342000, policies: 174, quotes: 267 },
      { month: 'Kas', revenue: 365000, policies: 186, quotes: 289 },
      { month: 'Ara', revenue: 401000, policies: 203, quotes: 312 }
    ],
    riskDistribution: [
      { level: 'Düşük Risk', count: 756, percentage: 60.6, color: '#10B981' },
      { level: 'Orta Risk', count: 374, percentage: 30.0, color: '#F59E0B' },
      { level: 'Yüksek Risk', count: 117, percentage: 9.4, color: '#EF4444' }
    ],
    topVehicleBrands: [
      { brand: 'Toyota', count: 234, revenue: 456780 },
      { brand: 'Volkswagen', count: 189, revenue: 398450 },
      { brand: 'Ford', count: 156, revenue: 312890 },
      { brand: 'Renault', count: 142, revenue: 289340 },
      { brand: 'Opel', count: 98, revenue: 198760 }
    ],
    customerSegments: [
      { segment: 'Platinum', count: 45, value: 890000, color: '#8B5CF6' },
      { segment: 'Gold', count: 123, value: 756000, color: '#F59E0B' },
      { segment: 'Silver', count: 298, value: 534000, color: '#6B7280' },
      { segment: 'Bronze', count: 456, value: 276780, color: '#92400E' }
    ],
    performanceMetrics: [
      { metric: 'Dönüşüm Oranı', current: 67.8, previous: 62.3, target: 70, unit: '%' },
      { metric: 'Ortalama Prim', current: 1970, previous: 1845, target: 2000, unit: '₺' },
      { metric: 'Müşteri Memnuniyeti', current: 4.6, previous: 4.3, target: 4.8, unit: '/5' },
      { metric: 'Yenileme Oranı', current: 85.2, previous: 82.1, target: 88, unit: '%' }
    ]
  };

  const quickStats = [
    {
      title: 'Toplam Gelir',
      value: `₺${analyticsData.totalRevenue.toLocaleString('tr-TR')}`,
      change: '+18.2%',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Toplam Poliçe',
      value: analyticsData.totalPolicies.toString(),
      change: '+12.5%',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Dönüşüm Oranı',
      value: `%${analyticsData.conversionRate}`,
      change: '+5.5%',
      icon: Target,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Ortalama Prim',
      value: `₺${analyticsData.averagePremium.toLocaleString('tr-TR')}`,
      change: '+6.8%',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Performans Analizi
          </h1>
          <p className="mt-2 text-lg text-gray-600">Satış performansınızı ve trendleri analiz edin</p>
        </div>

        {/* Period Selector */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white p-2 rounded-xl shadow-lg">
            <div className="flex space-x-2">
              {[
                { id: 'week', label: 'Bu Hafta' },
                { id: 'month', label: 'Bu Ay' },
                { id: 'quarter', label: 'Bu Çeyrek' },
                { id: 'year', label: 'Bu Yıl' }
              ].map((period) => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    selectedPeriod === period.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <div className="flex items-center">
                      <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">geçen döneme göre</span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-blue-500" />
                Gelir Trendi
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Gelir</span>
                <div className="w-3 h-3 bg-purple-500 rounded-full ml-4"></div>
                <span className="text-sm text-gray-600">Poliçe</span>
              </div>
            </div>
            <RevenueChart data={analyticsData.monthlyData} />
          </div>

          {/* Risk Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Award className="h-6 w-6 mr-2 text-purple-500" />
                Risk Dağılımı
              </h3>
            </div>
            <RiskDistributionChart data={analyticsData.riskDistribution} />
          </div>
        </div>

        {/* Performance Metrics and Top Brands */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PerformanceMetrics metrics={analyticsData.performanceMetrics} />
          <TopBrands brands={analyticsData.topVehicleBrands} />
        </div>

        {/* Customer Segments */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Users className="h-6 w-6 mr-2 text-orange-500" />
              Müşteri Segmentleri
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.customerSegments.map((segment) => (
              <div key={segment.segment} className="text-center p-4 rounded-lg" style={{ backgroundColor: `${segment.color}15` }}>
                <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: segment.color }}>
                  <span className="text-white font-bold text-lg">{segment.count}</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{segment.segment}</h4>
                <p className="text-sm text-gray-600">₺{segment.value.toLocaleString('tr-TR')}</p>
                <p className="text-xs text-gray-500 mt-1">{segment.count} müşteri</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <Zap className="h-6 w-6 mr-2" />
                Öneriler ve Aksiyon Planı
              </h3>
              <ul className="space-y-1 text-sm opacity-90">
                <li>• Dönüşüm oranını %70'e çıkarmak için potansiyel müşteri takibini artırın</li>
                <li>• Yüksek risk müşterilerinde özel kampanyalar düzenleyin</li>
                <li>• Toyota ve Volkswagen müşterilerine cross-sell fırsatları değerlendirin</li>
                <li>• Bronze segment müşterilerini Silver'a yükseltmek için loyalty programı başlatın</li>
              </ul>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">🎯</div>
              <p className="text-sm opacity-75 mt-2">Hedef Odaklı<br />Büyüme</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
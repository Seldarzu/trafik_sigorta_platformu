// src/components/analytics/Analytics.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Target, Users, Award, Zap } from 'lucide-react';
import RevenueChart from './RevenueChart';
import RiskDistributionChart from './RiskDistributionChart';
import PerformanceMetrics from './PerformanceMetrics';
import TopBrands from './TopBrands';
import { AnalyticsService } from '../../services/AnalyticsService';

type Period = 'week'|'month'|'quarter'|'year';

const RISK_I18N: Record<'low'|'medium'|'high', {label:string;color:string}> = {
  low:    { label: 'Düşük Risk',  color: '#10B981' },
  medium: { label: 'Orta Risk',   color: '#F59E0B' },
  high:   { label: 'Yüksek Risk', color: '#EF4444' },
};

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // server verileri
  const [summary, setSummary] = useState<{totalRevenue:number; totalPolicies:number; conversionRate:number; averagePremium:number} | null>(null);
  const [monthly, setMonthly] = useState<{month:string; revenue:number; policies:number; quotes:number}[]>([]);
  const [risk, setRisk] = useState<{level:'low'|'medium'|'high'; count:number; percentage:number; color?:string}[]>([]);
  const [perf, setPerf] = useState<{metric:string; current:number; previous:number; target:number; unit:string}[]>([]);
  const [topBrands, setTopBrands] = useState<{brand:string; count:number; revenue:number}[]>([]);
  const [segments, setSegments] = useState<{segment:string; count:number; value:number; color?:string}[]>([]);

  // quick stats hesaplama
  const quickStats = useMemo(() => {
    const s = summary ?? { totalRevenue: 0, totalPolicies: 0, conversionRate: 0, averagePremium: 0 };
    return [
      {
        title: 'Toplam Gelir',
        value: `₺${s.totalRevenue.toLocaleString('tr-TR')}`,
        change: '+18.2%',
        icon: DollarSign,
        color: 'from-green-500 to-emerald-500'
      },
      {
        title: 'Toplam Poliçe',
        value: s.totalPolicies.toString(),
        change: '+12.5%',
        icon: BarChart3,
        color: 'from-blue-500 to-cyan-500'
      },
      {
        title: 'Dönüşüm Oranı',
        value: `%${s.conversionRate}`,
        change: '+5.5%',
        icon: Target,
        color: 'from-purple-500 to-pink-500'
      },
      {
        title: 'Ortalama Prim',
        value: `₺${s.averagePremium.toLocaleString('tr-TR')}`,
        change: '+6.8%',
        icon: TrendingUp,
        color: 'from-orange-500 to-red-500'
      }
    ];
  }, [summary]);

  // risk verisini görselle uygun hale getir
  const riskForChart = useMemo(() => {
    return risk.map(r => ({
      level: RISK_I18N[r.level].label,
      count: r.count,
      percentage: r.percentage,
      color: r.color ?? RISK_I18N[r.level].color
    }));
  }, [risk]);

  const loadAll = async (period: Period) => {
    setLoading(true);
    setErr(null);
    try {
      // 🔧 Servis metod adları düzeltildi
      const [
        s, m, r, p, b, seg
      ] = await Promise.all([
        AnalyticsService.getSummary(),
        AnalyticsService.getMonthly(period),
        AnalyticsService.getRiskDistribution(period),
        AnalyticsService.getPerformanceMetrics(period),
        AnalyticsService.getTopBrands(period),
        AnalyticsService.getCustomerSegments(period),
      ]);
      setSummary(s);
      setMonthly(m);
      setRisk(r);
      setPerf(p);
      setTopBrands(b);
      setSegments(seg);
    } catch (e:any) {
      console.error(e);
      setErr('Analitik veriler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(selectedPeriod); }, [selectedPeriod]);

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
        <div className="mb-6 flex justify-center">
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
                  onClick={() => setSelectedPeriod(period.id as Period)}
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

        {/* Hata/Loading */}
        {err && (
          <div className="mb-6 mx-auto max-w-3xl bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-center">
            {err}
          </div>
        )}
        {loading && (
          <div className="mb-6 mx-auto max-w-3xl bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-lg text-center">
            Veriler yükleniyor...
          </div>
        )}

        {/* Quick Stats */}
        {!loading && summary && (
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
        )}

        {/* Charts Grid */}
        {!loading && (
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
              <RevenueChart data={monthly} />
            </div>

            {/* Risk Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Award className="h-6 w-6 mr-2 text-purple-500" />
                  Risk Dağılımı
                </h3>
              </div>
              <RiskDistributionChart data={riskForChart} />
            </div>
          </div>
        )}

        {/* Performance Metrics and Top Brands */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <PerformanceMetrics metrics={perf} />
            <TopBrands brands={topBrands} />
          </div>
        )}

        {/* Customer Segments */}
        {!loading && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Users className="h-6 w-6 mr-2 text-orange-500" />
                Müşteri Segmentleri
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {segments.map((segment) => (
                <div key={segment.segment} className="text-center p-4 rounded-lg" style={{ backgroundColor: `${(segment.color ?? '#9ca3af')}15` }}>
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: segment.color ?? '#9ca3af' }}>
                    <span className="text-white font-bold text-lg">{segment.count}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{segment.segment}</h4>
                  <p className="text-sm text-gray-600">₺{segment.value.toLocaleString('tr-TR')}</p>
                  <p className="text-xs text-gray-500 mt-1">{segment.count} müşteri</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Items (statik öneriler) */}
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
                <li>• Popüler markalarda cross‑sell fırsatlarını değerlendirin</li>
                <li>• Bronze segmenti Silver’a yükseltmek için loyalty programı başlatın</li>
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

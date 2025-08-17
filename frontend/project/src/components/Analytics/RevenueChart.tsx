// src/components/Analytics/RevenueChart.tsx
import React from 'react';
import { MonthlyData } from '../../types';

interface RevenueChartProps {
  data: MonthlyData[];
}

/**
 * Basit, bağımsız iki serili sütun grafiği:
 * - Mavi: Gelir (₺)
 * - Mor:  Poliçe (adet)
 * Her seri kendi maksimumuna göre normalize edilir; böylece biri çok büyük/çok küçük olsa bile
 * ikisinin trendi gözlemlenir.
 */
const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-400">Veri yok</div>;
  }

  const maxRevenue = Math.max(0, ...data.map(d => Number(d.revenue || 0)));
  const maxPolicies = Math.max(0, ...data.map(d => Number(d.policies || 0)));

  const allZero = (maxRevenue === 0) && (maxPolicies === 0);
  if (allZero) {
    return <div className="h-64 flex items-center justify-center text-gray-400">Gösterilecek değer yok</div>;
  }

  // Yardımcı: yüzdelik yüksekliği güvenli hesapla
  const pct = (val: number, max: number) => {
    if (!max || max <= 0) return 0;
    return Math.max(0, (val / max) * 100);
  };

  return (
    <div className="relative h-72">
      {/* Sol (Gelir) ve Sağ (Poliçe) eksen başlıkları */}
      <div className="absolute left-0 top-2 text-xs text-gray-500">Gelir (₺)</div>
      <div className="absolute right-0 top-2 text-xs text-gray-500">Poliçe (adet)</div>

      {/* Grid arka planı */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="border-t border-dashed border-gray-200"
              style={{ height: `${100 / 5}%` }}
            />
          ))}
        </div>
      </div>

      {/* Grafik */}
      <div className="relative h-full px-2">
        <div className="flex items-end justify-between h-full space-x-2">
          {data.map((item) => {
            const revenueHeight = pct(Number(item.revenue || 0), maxRevenue);
            const policiesHeight = pct(Number(item.policies || 0), maxPolicies);

            return (
              <div key={item.month} className="flex-1 flex flex-col items-center">
                {/* Sütunlar */}
                <div className="w-full flex justify-center space-x-1 mb-2">
                  {/* Gelir */}
                  <div className="flex-1 flex flex-col justify-end">
                    <div
                      className="bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-cyan-500"
                      style={{
                        height: `${revenueHeight}%`,
                        minHeight: revenueHeight > 0 ? '6px' : '0px'
                      }}
                      title={`Gelir: ₺${Number(item.revenue || 0).toLocaleString('tr-TR')}`}
                    />
                  </div>
                  {/* Poliçe */}
                  <div className="flex-1 flex flex-col justify-end">
                    <div
                      className="bg-gradient-to-t from-purple-500 to-pink-400 rounded-t-lg transition-all duration-500 hover:from-purple-600 hover:to-pink-500"
                      style={{
                        height: `${policiesHeight}%`,
                        minHeight: policiesHeight > 0 ? '6px' : '0px'
                      }}
                      title={`Poliçe: ${Number(item.policies || 0).toLocaleString('tr-TR')}`}
                    />
                  </div>
                </div>

                {/* Ay etiketi */}
                <span className="text-xs font-medium text-gray-600">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Eksen değerleri (max'lar) */}
      <div className="absolute left-0 bottom-2 text-xs text-gray-400">
        ₺{maxRevenue.toLocaleString('tr-TR')}
      </div>
      <div className="absolute right-0 bottom-2 text-xs text-gray-400">
        {maxPolicies.toLocaleString('tr-TR')}
      </div>
    </div>
  );
};

export default RevenueChart;

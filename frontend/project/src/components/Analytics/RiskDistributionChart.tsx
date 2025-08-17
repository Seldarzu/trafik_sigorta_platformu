// src/components/analytics/RiskDistributionChart.tsx
import React, { useMemo } from 'react';

type RiskItemIn = {
  level: string;          // "low" | "medium" | "high" | "Düşük Risk" vs.
  count: number;
  percentage?: number;    // opsiyonel – yoksa hesaplayacağız
  color?: string;         // opsiyonel – yoksa level'e göre atarız
};

interface RiskDistributionChartProps {
  data: RiskItemIn[];
}

/** Level -> default renk ve TR label eşlemesi (hem EN hem TR varyantlarını normalize ediyoruz) */
const COLOR_BY_LEVEL: Record<'low'|'medium'|'high', string> = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
};
const LABEL_BY_LEVEL: Record<'low'|'medium'|'high', string> = {
  low: 'Düşük Risk',
  medium: 'Orta Risk',
  high: 'Yüksek Risk',
};

function normalizeLevel(raw: string): 'low' | 'medium' | 'high' {
  const s = (raw ?? '').toString().trim().toLowerCase();

  // olası gelen değer varyasyonlarını toparla
  if (['low', 'düşük', 'dusuk', 'düşük risk', 'dusuk risk'].includes(s)) return 'low';
  if (['medium', 'orta', 'orta risk', 'mid'].includes(s)) return 'medium';
  if (['high', 'yüksek', 'yuksek', 'yüksek risk', 'yuksek risk'].includes(s)) return 'high';

  // bilinmeyen varsa medium'a düşelim ki UI kırılmasın
  return 'medium';
}

const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ data }) => {
  // 1) Normalize + yüzde hesapları
  const items = useMemo(() => {
    const totalCount = Math.max(
      0,
      data.reduce((sum, d) => sum + (Number.isFinite(d.count) ? d.count : 0), 0)
    );

    return data.map((d) => {
      const level = normalizeLevel(d.level);
      const color = d.color ?? COLOR_BY_LEVEL[level];

      // yüzde API’den gelmediyse count üzerinden hesapla
      const pct =
        typeof d.percentage === 'number' && isFinite(d.percentage)
          ? Math.max(0, d.percentage)
          : totalCount > 0
          ? (d.count / totalCount) * 100
          : 0;

      return {
        level,                      // normalized union
        label: LABEL_BY_LEVEL[level],
        count: Math.max(0, d.count || 0),
        percentage: pct,
        color,
      };
    });
  }, [data]);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.count, 0),
    [items]
  );

  // 2) Donut parametreleri
  const radius = 30;
  const circumference = 2 * Math.PI * radius;

  // 3) Stroke offset biriktirerek segmentleri yerleştiriyoruz
  let accOffset = 0;

  if (!items.length || total === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        Veri yok
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Donut */}
      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          {/* Arka plan halkası */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#E5E7EB"          // gray-200
              strokeWidth="10"
            />
            {items.map((item, idx) => {
              const segLen = (item.percentage / 100) * circumference;
              const dashArray = `${segLen} ${circumference}`;
              const dashOffset = accOffset * -1; // negatif yönde biriktiriyoruz
              accOffset += segLen;

              return (
                <circle
                  key={`${item.label}-${idx}`}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="10"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  style={{ transition: 'stroke-dashoffset 400ms ease, stroke 200ms ease' }}
                />
              );
            })}
          </svg>

          {/* Orta toplam */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-sm text-gray-600">Toplam</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={`${item.label}-legend-${idx}`}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center">
              <span
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-gray-900">{item.label}</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">{item.count}</div>
              <div className="text-sm text-gray-600">%{item.percentage.toFixed(1)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskDistributionChart;

import React from 'react';
import { PerformanceMetric } from '../../types';

interface Props {
  metrics: PerformanceMetric[];
}

const PerformanceMetrics: React.FC<Props> = ({ metrics }) => {
  if (!metrics?.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg h-full flex items-center justify-center text-sm text-gray-500">
        Performans verisi yok
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Performans Göstergeleri</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((m) => {
          const progress = Math.min(100, Math.round((m.current / m.target) * 100));
          return (
            <div key={m.metric} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-800">{m.metric}</span>
                <span className="text-sm text-gray-600">
                  {m.current} / {m.target} {m.unit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2">
                <div className="bg-gradient-to-r from-emerald-500 to-green-400 h-2 rounded" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-xs text-gray-500 mt-1">Önceki: {m.previous} {m.unit}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceMetrics;

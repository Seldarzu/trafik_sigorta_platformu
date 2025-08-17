import React from 'react';
import { MonthlyData } from '../../types';

interface RevenueChartProps {
  data: MonthlyData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">Veri yok</div>
    );
  }

  const maxRevenue = Math.max(1, ...data.map(d => d.revenue || 0));
  const maxPolicies = Math.max(1, ...data.map(d => d.policies || 0));

  return (
    <div className="h-64">
      <div className="flex items-end justify-between h-full space-x-2">
        {data.map((item) => {
          const revenueHeight = ((item.revenue || 0) / maxRevenue) * 100;
          const policiesHeight = ((item.policies || 0) / maxPolicies) * 100;

          return (
            <div key={item.month} className="flex-1 flex flex-col items-center">
              <div className="w-full flex justify-center space-x-1 mb-2">
                <div className="flex-1 flex flex-col justify-end">
                  <div
                    className="bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-cyan-500"
                    style={{ height: `${revenueHeight}%`, minHeight: '4px' }}
                    title={`Gelir: ₺${(item.revenue || 0).toLocaleString('tr-TR')}`}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <div
                    className="bg-gradient-to-t from-purple-500 to-pink-400 rounded-t-lg transition-all duration-500 hover:from-purple-600 hover:to-pink-500"
                    style={{ height: `${policiesHeight}%`, minHeight: '4px' }}
                    title={`Poliçe: ${item.policies || 0}`}
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-gray-600">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RevenueChart;

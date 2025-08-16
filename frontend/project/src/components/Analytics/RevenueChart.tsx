import React from 'react';
import { MonthlyData } from '../../types';

interface RevenueChartProps {
  data: MonthlyData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const maxPolicies = Math.max(...data.map(d => d.policies));

  return (
    <div className="h-64">
      <div className="flex items-end justify-between h-full space-x-2">
        {data.map((item, index) => {
          const revenueHeight = (item.revenue / maxRevenue) * 100;
          const policiesHeight = (item.policies / maxPolicies) * 100;
          
          return (
            <div key={item.month} className="flex-1 flex flex-col items-center">
              <div className="w-full flex justify-center space-x-1 mb-2">
                {/* Revenue Bar */}
                <div className="flex-1 flex flex-col justify-end">
                  <div
                    className="bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-cyan-500"
                    style={{ height: `${revenueHeight}%`, minHeight: '4px' }}
                    title={`Gelir: ₺${item.revenue.toLocaleString('tr-TR')}`}
                  />
                </div>
                
                {/* Policies Bar */}
                <div className="flex-1 flex flex-col justify-end">
                  <div
                    className="bg-gradient-to-t from-purple-500 to-pink-400 rounded-t-lg transition-all duration-500 hover:from-purple-600 hover:to-pink-500"
                    style={{ height: `${policiesHeight}%`, minHeight: '4px' }}
                    title={`Poliçe: ${item.policies}`}
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

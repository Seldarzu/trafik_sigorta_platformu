import React from 'react';
import { RiskDistribution } from '../../types';

interface RiskDistributionChartProps {
  data: RiskDistribution[];
}

const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      {/* Donut Chart */}
      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.map((item, index) => {
              const percentage = (item.count / total) * 100;
              const circumference = 2 * Math.PI * 30;
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = data.slice(0, index).reduce((acc, prev) => {
                return acc - ((prev.count / total) * circumference);
              }, 0);

              return (
                <circle
                  key={item.level}
                  cx="50"
                  cy="50"
                  r="30"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 hover:stroke-width-10"
                />
              );
            })}
          </svg>
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
        {data.map((item) => (
          <div key={item.level} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-gray-900">{item.level}</span>
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

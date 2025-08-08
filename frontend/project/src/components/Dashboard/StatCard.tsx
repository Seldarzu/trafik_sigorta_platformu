// src/components/Dashboard/StatCard.tsx
import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const gradientClasses: Record<StatCardProps['color'], string> = {
  blue: 'bg-gradient-to-br from-blue-500 to-cyan-500',
  green: 'bg-gradient-to-br from-green-500 to-emerald-500',
  purple: 'bg-gradient-to-br from-purple-500 to-pink-500',
  orange: 'bg-gradient-to-br from-orange-500 to-red-500'
};

const changeColorClassesMap: Record<StatCardProps['changeType'], string> = {
  increase: 'text-green-700 bg-gradient-to-r from-green-100 to-emerald-100',
  decrease: 'text-red-700 bg-gradient-to-r from-red-100 to-pink-100'
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color
}) => {
  const changeColorClasses = changeColorClassesMap[changeType];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="flex items-center justify-between">
        {/* Text Content */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>
          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${changeColorClasses}`}
            >
              {changeType === 'increase' ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {change}
            </span>
            <span className="text-xs text-gray-500 ml-2">geçen aya göre</span>
          </div>
        </div>

        {/* Icon */}
        <div
          className={`flex-shrink-0 p-4 rounded-xl ${gradientClasses[color]} shadow-lg`}
        >
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;

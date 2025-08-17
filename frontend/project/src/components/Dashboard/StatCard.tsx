import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const gradientClasses: Record<StatCardProps['color'], string> = {
  blue: 'bg-gradient-to-br from-blue-500 to-cyan-500',
  green: 'bg-gradient-to-br from-green-500 to-emerald-500',
  purple: 'bg-gradient-to-br from-purple-500 to-pink-500',
  orange: 'bg-gradient-to-br from-orange-500 to-red-500',
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="flex items-center justify-between">
        {/* Text Content */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-0">{value}</p>
        </div>

        {/* Icon */}
        <div className={`flex-shrink-0 p-4 rounded-xl ${gradientClasses[color]} shadow-lg`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;

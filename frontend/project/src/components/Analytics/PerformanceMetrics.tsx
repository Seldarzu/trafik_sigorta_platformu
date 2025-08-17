import React from 'react';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { PerformanceMetric } from '../../types';

interface PerformanceMetricsProps {
  metrics: PerformanceMetric[];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  const getChangeIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (current < previous) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getChangeColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-600';
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90) return 'from-green-500 to-emerald-500';
    if (percentage >= 70) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Target className="h-6 w-6 mr-2 text-green-500" />
          Performans Metrikleri
        </h3>
      </div>
      
      <div className="space-y-6">
        {metrics.map((metric) => {
          const progressPercentage = Math.min((metric.current / metric.target) * 100, 100);
          const change = ((metric.current - metric.previous) / metric.previous) * 100;
          
          return (
            <div key={metric.metric} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">{metric.metric}</h4>
                <div className="flex items-center space-x-2">
                  {getChangeIcon(metric.current, metric.previous)}
                  <span className={`text-sm font-medium ${getChangeColor(metric.current, metric.previous)}`}>
                    {change > 0 ? '+' : ''}{change.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Mevcut: <span className="font-bold text-gray-900">{metric.current}{metric.unit}</span>
                </span>
                <span className="text-gray-600">
                  Hedef: <span className="font-bold text-gray-900">{metric.target}{metric.unit}</span>
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(metric.current, metric.target)} transition-all duration-500`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                %{progressPercentage.toFixed(1)} tamamlandı
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceMetrics;

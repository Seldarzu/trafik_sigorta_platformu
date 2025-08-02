import React from 'react'
import { LucideIcon } from 'lucide-react'

export interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  icon: LucideIcon
  color: 'blue' | 'green' | 'purple' | 'orange'
}

const bgMap: Record<StatCardProps['color'], string> = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600'
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className={`text-sm mt-1 ${changeType==='increase'?'text-green-500':'text-red-500'}`}>{change}</p>
      </div>
      <div className={`p-3 rounded-full ${bgMap[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
)

export default StatCard

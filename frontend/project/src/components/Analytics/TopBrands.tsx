import React from 'react';
import { Car, TrendingUp } from 'lucide-react';
import { BrandData } from '../../types';

interface TopBrandsProps {
  brands: BrandData[];
}

const TopBrands: React.FC<TopBrandsProps> = ({ brands }) => {
  const maxCount = Math.max(...brands.map(b => b.count));
  
  const brandColors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500'
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Car className="h-6 w-6 mr-2 text-blue-500" />
          En Popüler Markalar
        </h3>
      </div>
      
      <div className="space-y-4">
        {brands.map((brand, index) => {
          const percentage = (brand.count / maxCount) * 100;
          
          return (
            <div key={brand.brand} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${brandColors[index]} flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{brand.brand}</h4>
                    <p className="text-sm text-gray-600">{brand.count} poliçe</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₺{brand.revenue.toLocaleString('tr-TR')}</p>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+{(Math.random() * 20 + 5).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${brandColors[index]} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">Toplam Marka Geliri</h4>
            <p className="text-sm text-gray-600">Bu ay elde edilen toplam gelir</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              ₺{brands.reduce((sum, brand) => sum + brand.revenue, 0).toLocaleString('tr-TR')}
            </p>
            <p className="text-sm text-green-600 font-medium">+12.5% artış</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBrands;
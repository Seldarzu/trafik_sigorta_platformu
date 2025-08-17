import React from 'react';
import { BrandData } from '../../types';

interface Props {
  brands: BrandData[];
}

const TopBrands: React.FC<Props> = ({ brands }) => {
  if (!brands?.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg h-full flex items-center justify-center text-sm text-gray-500">
        Marka verisi yok
      </div>
    );
  }

  const maxCount = Math.max(...brands.map(b => b.count), 1);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Popüler Araç Markaları</h3>
      <div className="space-y-3">
        {brands.map((b) => (
          <div key={b.brand} className="bg-gray-50 rounded p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">{b.brand}</span>
              <span className="text-sm text-gray-600">{b.count} adet • ₺{b.revenue.toLocaleString('tr-TR')}</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 h-2 rounded">
              <div className="h-2 rounded bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${(b.count / maxCount) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBrands;

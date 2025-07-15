import React from 'react';
import { Eye, Calendar, User, Car } from 'lucide-react';
import { Quote } from '../../types';

interface RecentQuotesProps {
  onPageChange: (page: string) => void;
}

const RecentQuotes: React.FC<RecentQuotesProps> = ({ onPageChange }) => {
  // Mock data - in real app this would come from API
  const recentQuotes: Quote[] = [
    {
      id: 'Q-2024-001',
      vehicle: {
        plateNumber: '34 ABC 123',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        engineSize: '1.6',
        fuelType: 'gasoline',
        usage: 'personal',
        cityCode: '34'
      },
      driver: {
        firstName: 'Mehmet',
        lastName: 'Özkan',
        tcNumber: '12345678901',
        birthDate: '1985-05-15',
        licenseDate: '2005-08-20',
        gender: 'male',
        maritalStatus: 'married',
        education: 'university',
        profession: 'Mühendis',
        hasAccidents: false,
        accidentCount: 0,
        hasViolations: false,
        violationCount: 0
      },
      premium: 2450,
      coverageAmount: 500000,
      riskScore: 75,
      riskLevel: 'low',
      validUntil: '2024-02-15',
      createdAt: '2024-01-16',
      status: 'active',
      agentId: 'agent-1',
      companyName: 'Anadolu Sigorta',
      discounts: [],
      totalDiscount: 0,
      finalPremium: 2450
    },
    {
      id: 'Q-2024-002',
      vehicle: {
        plateNumber: '06 XYZ 789',
        brand: 'Volkswagen',
        model: 'Golf',
        year: 2020,
        engineSize: '1.4',
        fuelType: 'gasoline',
        usage: 'personal',
        cityCode: '06'
      },
      driver: {
        firstName: 'Ayşe',
        lastName: 'Demir',
        tcNumber: '12345678902',
        birthDate: '1992-03-10',
        licenseDate: '2012-06-15',
        gender: 'female',
        maritalStatus: 'single',
        education: 'university',
        profession: 'Öğretmen',
        hasAccidents: true,
        accidentCount: 1,
        hasViolations: false,
        violationCount: 0
      },
      premium: 3200,
      coverageAmount: 500000,
      riskScore: 85,
      riskLevel: 'medium',
      validUntil: '2024-02-14',
      createdAt: '2024-01-15',
      status: 'active',
      agentId: 'agent-1',
      companyName: 'Aksigorta',
      discounts: [],
      totalDiscount: 0,
      finalPremium: 3200
    }
  ];

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low':
        return 'Düşük Risk';
      case 'medium':
        return 'Orta Risk';
      case 'high':
        return 'Yüksek Risk';
      default:
        return 'Belirsiz';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Son Teklifler</h3>
          <button 
            onClick={() => onPageChange('quotes')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Tümünü Gör
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {recentQuotes.map((quote) => (
          <div key={quote.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Car className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">
                    {quote.vehicle.brand} {quote.vehicle.model} ({quote.vehicle.year})
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {quote.vehicle.plateNumber}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {quote.driver.firstName} {quote.driver.lastName}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">
                      {new Date(quote.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(quote.riskLevel)}`}>
                    {getRiskLevelText(quote.riskLevel)}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ₺{quote.finalPremium.toLocaleString('tr-TR')}
                  </p>
                  <p className="text-sm text-gray-500">{quote.companyName}</p>
                </div>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200">
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentQuotes;
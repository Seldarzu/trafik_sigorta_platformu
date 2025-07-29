// src/components/Customers/CustomerManagement.tsx
import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Users,
  TrendingUp,
  Award,
  Star
} from 'lucide-react';
import { Customer } from '../../types';
import { useCustomers } from '../../hooks/useCustomers';
import CustomerCard from './CustomerCard';
import CustomerModal from './CustomerModal';
import CustomerDetailModal from './CustomerDetailModal';

const CustomerManagement: React.FC = () => {
  const { data: customers, loading, error } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    return customers.filter((customer) => {
      const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        fullName.includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.phone.includes(searchTerm) ||
        customer.id.toLowerCase().includes(term);

      const matchesStatus = !filterStatus || customer.status === filterStatus;
      const matchesValue = !filterValue || customer.customerValue === filterValue;

      return matchesSearch && matchesStatus && matchesValue;
    });
  }, [customers, searchTerm, filterStatus, filterValue]);

  const stats = useMemo(() => {
    if (!customers) return [];
    return [
      {
        title: 'Toplam Müşteri',
        value: customers.length.toString(),
        icon: Users,
        color: 'from-blue-500 to-cyan-500',
        change: '+12%'
      },
      {
        title: 'Aktif Müşteri',
        value: customers.filter(c => c.status === 'active').length.toString(),
        icon: TrendingUp,
        color: 'from-green-500 to-emerald-500',
        change: '+8%'
      },
      {
        title: 'VIP Müşteri',
        value: customers.filter(
          c => c.customerValue === 'platinum' || c.customerValue === 'gold'
        ).length.toString(),
        icon: Award,
        color: 'from-purple-500 to-pink-500',
        change: '+15%'
      },
      {
        title: 'Potansiyel Müşteri',
        value: customers.filter(c => c.status === 'potential').length.toString(),
        icon: Star,
        color: 'from-orange-500 to-red-500',
        change: '+25%'
      }
    ];
  }, [customers]);

  if (loading) {
    return <div className="p-8 text-center">Yükleniyor…</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">Hata: {error.message}</div>;
  }
  if (!customers) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Müşteri Yönetimi
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Müşterilerinizi yönetin ve ilişkilerinizi güçlendirin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium mt-1">{stat.change} bu ay</p>
                  </div>
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Müşteri ara (isim, email, telefon, ID)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
                <option value="potential">Potansiyel</option>
              </select>

              <select
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tüm Segmentler</option>
                <option value="platinum">Platinum</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>

              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setShowModal(true);
                }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5 mr-2" />
                Yeni Müşteri
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onEdit={(c) => {
                setSelectedCustomer(c);
                setShowModal(true);
              }}
              onView={(c) => {
                setSelectedCustomer(c);
                setShowDetailModal(true);
              }}
            />
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Müşteri bulunamadı</h3>
            <p className="text-gray-600 mb-6">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
            <button
              onClick={() => {
                setSelectedCustomer(null);
                setShowModal(true);
              }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              İlk Müşteriyi Ekle
            </button>
          </div>
        )}

        {showModal && (
          <CustomerModal
            customer={selectedCustomer}
            onClose={() => {
              setShowModal(false);
              setSelectedCustomer(null);
            }}
          />
        )}

        {showDetailModal && selectedCustomer && (
          <CustomerDetailModal
            customer={selectedCustomer}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedCustomer(null);
            }}
            onEdit={() => {
              setShowDetailModal(false);
              setShowModal(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;

// src/components/Customers/CustomerManagement.tsx
import React, { useState, useMemo } from 'react';
import { Search, Plus, Users, TrendingUp, Award, Star } from 'lucide-react';
import { Customer } from '../../types';
import { useCustomers } from '../../hooks/useCustomers';
import CustomerCard from './CustomerCard';
import CustomerModal from './CustomerModal';
import CustomerDetailModal from './CustomerDetailModal';

const CustomerManagement: React.FC = () => {
  const { data: customers, loading, error, refetch } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Customer['status'] | ''>('');
  const [filterValue, setFilterValue] = useState<Customer['customerValue'] | ''>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filtrelenmiş listeyi hesapla
  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    const term = searchTerm.trim().toLowerCase();
    return customers.filter(c => {
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.toLowerCase().includes(term) ||
        c.id.toLowerCase().includes(term);
      const matchesStatus = !filterStatus || c.status === filterStatus;
      const matchesValue  = !filterValue  || c.customerValue === filterValue;
      return matchesSearch && matchesStatus && matchesValue;
    });
  }, [customers, searchTerm, filterStatus, filterValue]);

  // İstatistik kartları
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
        value: customers.filter(c => ['gold','platinum'].includes(c.customerValue)).length.toString(),
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
      },
    ];
  }, [customers]);

  if (loading) return <div className="p-8 text-center">Yükleniyor…</div>;
  if (error)   return <div className="p-8 text-center text-red-600">Hata: {error.message}</div>;
  if (!customers) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* İSTATİSTİK KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} bu ay</p>
                  </div>
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${stat.color}`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ARAMA ve FİLTRELER */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Arama */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Müşteri ara (isim, email, telefon, ID)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Durum filtresi */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as Customer['status'])}
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
              <option value="potential">Potansiyel</option>
            </select>

            {/* Segment filtresi */}
            <select
              value={filterValue}
              onChange={e => setFilterValue(e.target.value as Customer['customerValue'])}
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tüm Segmentler</option>
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
            </select>

            {/* Yeni müşteri butonu */}
            <button
              onClick={() => { setSelectedCustomer(null); setShowModal(true); }}
              className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
            >
              <Plus className="h-5 w-5 mr-2" /> Yeni Müşteri
            </button>
          </div>
        </div>

        {/* MÜŞTERİ KARTLARI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCustomers.map(c => (
            <CustomerCard
              key={c.id}
              customer={c}
              onEdit={c2 => { setSelectedCustomer(c2); setShowModal(true); }}
              onView={c2 => { setSelectedCustomer(c2); setShowDetailModal(true); }}
            />
          ))}
        </div>

        {/* KAYIT BULUNAMADI MESAJI */}
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Müşteri bulunamadı</h3>
            <button
              onClick={() => { setSelectedCustomer(null); setShowModal(true); }}
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg"
            >
              <Plus className="h-5 w-5 mr-2" /> İlk Müşteriyi Ekle
            </button>
          </div>
        )}

        {/* MODALLER */}
        {showModal && (
          <CustomerModal
            customer={selectedCustomer}
            onClose={() => {
              setShowModal(false);
              setSelectedCustomer(null);
              refetch();
            }}
          />
        )}
        {showDetailModal && selectedCustomer && (
          <CustomerDetailModal
            customer={selectedCustomer}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedCustomer(null);
              refetch();
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

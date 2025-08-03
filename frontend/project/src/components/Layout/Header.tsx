// src/components/Layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { Page, Notification } from '../../types';
import {
  Shield,
  FilePlus,
  FileText,
  Users,
  BarChart2,
  Settings,
  Bell,
  User as UserIcon
} from 'lucide-react';
import NotificationCenter from '../Notifications/NotificationCenter';

interface Props {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const navigation: { id: Page; label: string; icon: React.FC<any> | null }[] = [
  { id: 'dashboard',  label: 'Dashboard',  icon: Shield     },
  { id: 'new-quote',  label: 'Yeni Teklif', icon: FilePlus   },
  { id: 'quotes',     label: 'Teklifler',   icon: FileText   },
  { id: 'policies',   label: 'Poliçeler',   icon: FileText   },
  { id: 'customers',  label: 'Müşteriler',  icon: Users      },
  { id: 'analytics',  label: 'Analitik',    icon: BarChart2  },
];

const Header: React.FC<Props> = ({ currentPage, onPageChange }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Örnek dummy veri; istersen burayı bir API çağrısıyla değiştir
  useEffect(() => {
    setNotifications([
      {
        id: 'n1',
        title: 'Yeni teklif oluşturuldu',
        message: 'Q-2024-010 numaralı teklif başarıyla oluşturuldu.',
        type: 'info',
        isRead: false,
        createdAt: new Date().toISOString(),
        actionUrl: '/quotes/10',
        actionText: 'Göster'
      },
      {
        id: 'n2',
        title: 'Prim güncellemesi',
        message: 'Q-2024-005 numaralı teklifin primi güncellendi.',
        type: 'success',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'n3',
        title: 'Hata bildirimi',
        message: 'Q-2024-003 numaralı teklifte hata oluştu.',
        type: 'warning',
        isRead: true,
        createdAt: new Date().toISOString()
      }
    ]);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">
                SigortaTeklif Pro
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-4">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onPageChange(id)}
                className={`
                  inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                  ${currentPage === id
                    ? 'bg-white/20 text-white backdrop-blur-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'}
                `}
              >
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                {label}
              </button>
            ))}
          </nav>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(v => !v)}
              className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors duration-200"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Settings */}
            <button
              onClick={() => onPageChange('settings')}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors duration-200"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">Ahmet Yılmaz</p>
                <p className="text-xs text-white/70">Sigorta Acentesi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        notifications={notifications}
        onClose={() => setShowNotifications(false)}
      />
    </header>
  );
};

export default Header;

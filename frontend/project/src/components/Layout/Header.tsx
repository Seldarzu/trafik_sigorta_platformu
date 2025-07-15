import React from 'react';
import { Shield, User, Bell, Settings } from 'lucide-react';
import { useState } from 'react';
import NotificationCenter from '../Notifications/NotificationCenter';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = 3; // This would come from a context or API

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'new-quote', label: 'Yeni Teklif', icon: null },
    { id: 'quotes', label: 'Teklifler', icon: null },
    { id: 'customers', label: 'Müşteriler', icon: null },
    { id: 'analytics', label: 'Analitik', icon: null }
  ];

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
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    currentPage === item.id
                      ? 'text-white bg-white/20 backdrop-blur-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4 mr-2" />}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors duration-200"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => onPageChange('settings')}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors duration-200"
            >
              <Settings className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">Ahmet Yılmaz</p>
                <p className="text-xs text-white/70">Sigorta Acentesi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </header>
  );
};

export default Header;
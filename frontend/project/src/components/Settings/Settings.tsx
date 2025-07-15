import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, User, Bell, Shield, Globe, 
  Palette, Save, Camera, Mail, Phone, MapPin, Calendar,
  Clock, DollarSign, Languages, Moon, Sun, Monitor,
  Lock, Key, Database, Download, Upload, Trash2,
  CheckCircle, AlertCircle, Info, X
} from 'lucide-react';
import { UserProfile, NotificationSettings, SystemSettings } from '../../types';
import ProfileSettings from './ProfileSettings';
import NotificationSettingsComponent from './NotificationSettings';
import SystemSettingsComponent from './SystemSettings';
import SecuritySettings from './SecuritySettings';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  // Mock user data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user-1',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet.yilmaz@sigortapro.com',
    phone: '+90 532 123 4567',
    role: 'agent',
    agencyName: 'SigortaTeklif Pro',
    agencyCode: 'STP001',
    licenseNumber: 'SIG-2024-001',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-16T10:30:00Z',
    isActive: true
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    quoteExpiry: true,
    newCustomer: true,
    policyRenewal: true,
    systemUpdates: true,
    marketingEmails: false,
    weeklyReports: true,
    monthlyReports: true
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    language: 'tr',
    timezone: 'Europe/Istanbul',
    currency: 'TRY',
    dateFormat: 'DD/MM/YYYY',
    theme: 'light',
    autoSave: true,
    sessionTimeout: 30
  });

  const tabs = [
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'notifications',
      label: 'Bildirimler',
      icon: Bell,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'system',
      label: 'Sistem',
      icon: SettingsIcon,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'security',
      label: 'Güvenlik',
      icon: Shield,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const handleSave = () => {
    // Simulate save operation
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileSettings
            profile={userProfile}
            onUpdate={setUserProfile}
          />
        );
      case 'notifications':
        return (
          <NotificationSettingsComponent
            settings={notificationSettings}
            onUpdate={setNotificationSettings}
          />
        );
      case 'system':
        return (
          <SystemSettingsComponent
            settings={systemSettings}
            onUpdate={setSystemSettings}
          />
        );
      case 'security':
        return <SecuritySettings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <SettingsIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Ayarlar
          </h1>
          <p className="mt-2 text-lg text-gray-600">Hesap ve sistem ayarlarınızı yönetin</p>
        </div>

        {/* Save Notification */}
        {showSaveNotification && (
          <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in">
            <CheckCircle className="h-5 w-5" />
            <span>Ayarlar başarıyla kaydedildi!</span>
            <button
              onClick={() => setShowSaveNotification(false)}
              className="ml-2 hover:bg-white/20 rounded-full p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ayar Kategorileri</h3>
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                          activeTab === tab.id
                            ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesap Özeti</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Üyelik Tarihi</span>
                  <span className="font-medium text-gray-900">
                    {new Date(userProfile.joinDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Son Giriş</span>
                  <span className="font-medium text-gray-900">
                    {new Date(userProfile.lastLogin).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Durum</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                    Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-8">
                {renderTabContent()}
              </div>
              
              {/* Save Button */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Değişiklikleri Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
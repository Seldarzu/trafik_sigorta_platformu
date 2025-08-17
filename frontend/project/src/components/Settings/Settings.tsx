// src/components/settings/Settings.tsx
import React, { useEffect, useState } from 'react';
import {
  Settings as SettingsIcon, User, Bell, Shield, Save, CheckCircle, X
} from 'lucide-react';
import { UserProfile, NotificationSettings, SystemSettings } from '../../types';
import ProfileSettings from './ProfileSettings';
import NotificationSettingsComponent from './NotificationSettings';
import SystemSettingsComponent from './SystemSettings';
import SecuritySettings from './SecuritySettings';

import { SystemSettingsService } from '../../services/SystemSettingsService';
import { NotificationSettingsService } from '../../services/NotificationSettingsService';

const DEMO_USER_ID =
  import.meta.env.VITE_DEMO_USER_ID ??
  '00000000-0000-0000-0000-000000000001';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile'|'notifications'|'system'|'security'>('profile');
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // UI tercihleri (frontend-only) – SystemSettingsComponent bunu kullanıyor
  const [systemUiSettings, setSystemUiSettings] = useState<SystemSettings>({
    language: 'tr',
    timezone: 'Europe/Istanbul',
    currency: 'TRY',
    dateFormat: 'DD/MM/YYYY',
    theme: 'light',
    autoSave: true,
    sessionTimeout: 30
  });

  // Backend System Settings (acente bilgilerinin kaynağı)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: DEMO_USER_ID,
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet.yilmaz@sigortapro.com',
    phone: '+90 532 123 4567',
    role: 'agent',
    agencyName: '',
    agencyCode: '',
    licenseNumber: '',
    joinDate: '2023-01-15',
    lastLogin: new Date().toISOString(),
    isActive: true,
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

  // ilk yükleme
  useEffect(() => {
    const load = async () => {
      setLoading(true); setErr(null);
      try {
        // 1) System settings çek
        const sys = await SystemSettingsService.get();
        setUserProfile((prev) => ({
          ...prev,
          agencyName: sys.agencyName ?? '',
          agencyCode: sys.agencyCode ?? '',
          licenseNumber: sys.licenseNumber ?? '',
          joinDate: sys.joinDate ?? prev.joinDate,
          lastLogin: (sys.lastLogin ?? prev.lastLogin),
          isActive: sys.isActive ?? true,
        }));

        // 2) Notification settings çek
        try {
          const notif = await NotificationSettingsService.get(DEMO_USER_ID);
          setNotificationSettings(notif);
        } catch (e) {
          // kullanıcı yoksa backend default üretiyorsa burası opsiyonel
          console.warn('Notification settings GET failed (dev?):', e);
        }
      } catch (e:any) {
        console.error(e);
        setErr('Ayarlar yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setErr(null);
    try {
      // System settings PUT
      await SystemSettingsService.update({
        agencyName: userProfile.agencyName ?? null,
        agencyCode: userProfile.agencyCode ?? null,
        licenseNumber: userProfile.licenseNumber ?? null,
        // joinDate/lastLogin backend LocalDate bekliyorsa 'YYYY-MM-DD' gönderin
        joinDate: userProfile.joinDate ? userProfile.joinDate.substring(0, 10) : null,
        lastLogin: userProfile.lastLogin ? userProfile.lastLogin.substring(0, 10) : null,
        isActive: userProfile.isActive,
      });

      // Notification settings PUT
      await NotificationSettingsService.update(DEMO_USER_ID, notificationSettings);

      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
    } catch (e:any) {
      console.error(e);
      setErr('Kaydetme sırasında hata oluştu.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User, color: 'from-blue-500 to-cyan-500' },
    { id: 'notifications', label: 'Bildirimler', icon: Bell, color: 'from-purple-500 to-pink-500' },
    { id: 'system', label: 'Sistem', icon: SettingsIcon, color: 'from-green-500 to-emerald-500' },
    { id: 'security', label: 'Güvenlik', icon: Shield, color: 'from-orange-500 to-red-500' },
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings profile={userProfile} onUpdate={setUserProfile} />;
      case 'notifications':
        return <NotificationSettingsComponent settings={notificationSettings} onUpdate={setNotificationSettings} />;
      case 'system':
        // Bu component UI tercihleri için; backend’e yazmıyoruz (istersen ek bir endpoint’e bağlarız)
        return <SystemSettingsComponent settings={systemUiSettings} onUpdate={setSystemUiSettings} />;
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

        {/* Hata/Loading */}
        {err && (
          <div className="mb-6 mx-auto max-w-3xl bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-center">
            {err}
          </div>
        )}
        {loading && (
          <div className="mb-6 mx-auto max-w-3xl bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-lg text-center">
            Yükleniyor...
          </div>
        )}

        {/* Save Notification */}
        {showSaveNotification && (
          <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Ayarlar başarıyla kaydedildi!</span>
            <button onClick={() => setShowSaveNotification(false)} className="ml-2 hover:bg-white/20 rounded-full p-1">
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
                    const id = tab.id;
                    return (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                          activeTab === id
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
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${userProfile.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {userProfile.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-8">{renderTabContent()}</div>
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-60"
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

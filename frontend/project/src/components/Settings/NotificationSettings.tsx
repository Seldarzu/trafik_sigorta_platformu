import React from 'react';
import { Bell, Mail, MessageSquare, Smartphone, AlertCircle, Users, FileText, TrendingUp, Gift } from 'lucide-react';
import { NotificationSettings as NotificationSettingsType } from '../../types';

interface NotificationSettingsProps {
  settings: NotificationSettingsType;
  onUpdate: (settings: NotificationSettingsType) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ settings, onUpdate }) => {
  const handleToggle = (key: keyof NotificationSettingsType) => {
    onUpdate({
      ...settings,
      [key]: !settings[key]
    });
  };

  const notificationGroups = [
    {
      title: 'Genel Bildirimler',
      description: 'Temel bildirim kanallarını yönetin',
      icon: Bell,
      color: 'from-blue-500 to-cyan-500',
      settings: [
        {
          key: 'emailNotifications' as keyof NotificationSettingsType,
          label: 'E-posta Bildirimleri',
          description: 'Önemli güncellemeler e-posta ile gönderilsin',
          icon: Mail
        },
        {
          key: 'smsNotifications' as keyof NotificationSettingsType,
          label: 'SMS Bildirimleri',
          description: 'Acil durumlar için SMS bildirimleri',
          icon: MessageSquare
        },
        {
          key: 'pushNotifications' as keyof NotificationSettingsType,
          label: 'Push Bildirimleri',
          description: 'Tarayıcı bildirimleri aktif olsun',
          icon: Smartphone
        }
      ]
    },
    {
      title: 'İş Bildirimleri',
      description: 'İş süreçleriyle ilgili bildirimler',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      settings: [
        {
          key: 'quoteExpiry' as keyof NotificationSettingsType,
          label: 'Teklif Süresi Dolumu',
          description: 'Tekliflerin süresi dolmadan önce uyarı',
          icon: AlertCircle
        },
        {
          key: 'newCustomer' as keyof NotificationSettingsType,
          label: 'Yeni Müşteri',
          description: 'Yeni müşteri kaydı bildirimleri',
          icon: Users
        },
        {
          key: 'policyRenewal' as keyof NotificationSettingsType,
          label: 'Poliçe Yenileme',
          description: 'Poliçe yenileme zamanı geldiğinde bildir',
          icon: FileText
        }
      ]
    },
    {
      title: 'Sistem ve Raporlar',
      description: 'Sistem güncellemeleri ve raporlar',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      settings: [
        {
          key: 'systemUpdates' as keyof NotificationSettingsType,
          label: 'Sistem Güncellemeleri',
          description: 'Yeni özellikler ve güncellemeler',
          icon: TrendingUp
        },
        {
          key: 'weeklyReports' as keyof NotificationSettingsType,
          label: 'Haftalık Raporlar',
          description: 'Haftalık performans raporları',
          icon: FileText
        },
        {
          key: 'monthlyReports' as keyof NotificationSettingsType,
          label: 'Aylık Raporlar',
          description: 'Aylık özet ve analiz raporları',
          icon: TrendingUp
        }
      ]
    },
    {
      title: 'Pazarlama',
      description: 'Pazarlama ve promosyon bildirimleri',
      icon: Gift,
      color: 'from-orange-500 to-red-500',
      settings: [
        {
          key: 'marketingEmails' as keyof NotificationSettingsType,
          label: 'Pazarlama E-postaları',
          description: 'Özel teklifler ve kampanya bildirimleri',
          icon: Gift
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bildirim Ayarları</h2>
        <p className="text-gray-600">Hangi bildirimleri almak istediğinizi seçin</p>
      </div>

      {notificationGroups.map((group) => {
        const GroupIcon = group.icon;
        return (
          <div key={group.title} className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${group.color} mr-4`}>
                <GroupIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{group.title}</h3>
                <p className="text-sm text-gray-600">{group.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {group.settings.map((setting) => {
                const SettingIcon = setting.icon;
                return (
                  <div key={setting.key} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <SettingIcon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{setting.label}</h4>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[setting.key] as boolean}
                        onChange={() => handleToggle(setting.key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500"></div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Notification Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Bell className="h-5 w-5 mr-2 text-blue-500" />
          Bildirim Önizlemesi
        </h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg border border-blue-200 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Teklif Süresi Dolumu Uyarısı</h4>
              <p className="text-sm text-gray-600">Q-2024-001 numaralı teklif 2 gün içinde sona erecek</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-blue-200 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Yeni Müşteri Kaydı</h4>
              <p className="text-sm text-gray-600">Ayşe Demir sisteme yeni müşteri olarak kaydoldu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;

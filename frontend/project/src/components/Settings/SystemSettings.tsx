import React from 'react';
import { Globe, Clock, DollarSign, Calendar, Palette, Save, Monitor, Moon, Sun, Database, Download } from 'lucide-react';
import { SystemSettings as SystemSettingsType } from '../../types';

interface SystemSettingsProps {
  settings: SystemSettingsType;
  onUpdate: (settings: SystemSettingsType) => void;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ settings, onUpdate }) => {
  const handleChange = (key: keyof SystemSettingsType, value: any) => {
    onUpdate({
      ...settings,
      [key]: value
    });
  };

  const languages = [
    { value: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { value: 'en', label: 'English', flag: '🇺🇸' }
  ];

  const timezones = [
    { value: 'Europe/Istanbul', label: 'İstanbul (UTC+3)' },
    { value: 'Europe/London', label: 'Londra (UTC+0)' },
    { value: 'America/New_York', label: 'New York (UTC-5)' }
  ];

  const currencies = [
    { value: 'TRY', label: 'Türk Lirası (₺)', symbol: '₺' },
    { value: 'USD', label: 'Amerikan Doları ($)', symbol: '$' },
    { value: 'EUR', label: 'Euro (€)', symbol: '€' }
  ];

  const dateFormats = [
    { value: 'DD/MM/YYYY', label: '31/12/2024' },
    { value: 'MM/DD/YYYY', label: '12/31/2024' },
    { value: 'YYYY-MM-DD', label: '2024-12-31' }
  ];

  const themes = [
    { value: 'light', label: 'Açık Tema', icon: Sun, color: 'from-yellow-400 to-orange-400' },
    { value: 'dark', label: 'Koyu Tema', icon: Moon, color: 'from-gray-700 to-gray-900' },
    { value: 'auto', label: 'Otomatik', icon: Monitor, color: 'from-blue-500 to-purple-500' }
  ];

  const sessionTimeouts = [
    { value: 15, label: '15 dakika' },
    { value: 30, label: '30 dakika' },
    { value: 60, label: '1 saat' },
    { value: 120, label: '2 saat' },
    { value: 480, label: '8 saat' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sistem Ayarları</h2>
        <p className="text-gray-600">Uygulama davranışını ve görünümünü özelleştirin</p>
      </div>

      {/* Localization Settings */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-blue-500" />
          Yerelleştirme Ayarları
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dil</label>
            <select
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Saat Dilimi</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              {timezones.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Para Birimi</label>
            <select
              value={settings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              {currencies.map(curr => (
                <option key={curr.value} value={curr.value}>
                  {curr.symbol} {curr.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tarih Formatı</label>
            <select
              value={settings.dateFormat}
              onChange={(e) => handleChange('dateFormat', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              {dateFormats.map(format => (
                <option key={format.value} value={format.value}>{format.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Palette className="h-5 w-5 mr-2 text-purple-500" />
          Görünüm Ayarları
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Tema Seçimi</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((theme) => {
              const Icon = theme.icon;
              return (
                <button
                  key={theme.value}
                  onClick={() => handleChange('theme', theme.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    settings.theme === theme.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${theme.color} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900">{theme.label}</h4>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Application Settings */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Database className="h-5 w-5 mr-2 text-green-500" />
          Uygulama Ayarları
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-100">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Save className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Otomatik Kaydetme</h4>
                <p className="text-sm text-gray-600">Form verilerini otomatik olarak kaydet</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleChange('autoSave', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-500"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 inline mr-2 text-green-500" />
              Oturum Zaman Aşımı
            </label>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
            >
              {sessionTimeouts.map(timeout => (
                <option key={timeout.value} value={timeout.value}>{timeout.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Database className="h-5 w-5 mr-2 text-orange-500" />
          Veri Yönetimi
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl">
            <Download className="h-5 w-5 mr-2" />
            Verileri Dışa Aktar
          </button>
          
          <button className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl">
            <Database className="h-5 w-5 mr-2" />
            Yedek Oluştur
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
import React, { useState } from 'react';
import { Shield, Lock, Key, Eye, EyeOff, Smartphone, AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react';

const SecuritySettings: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const securityLogs = [
    {
      id: 1,
      action: 'Başarılı Giriş',
      device: 'Chrome - Windows',
      location: 'İstanbul, Türkiye',
      timestamp: '2024-01-16 10:30:00',
      status: 'success'
    },
    {
      id: 2,
      action: 'Şifre Değiştirildi',
      device: 'Chrome - Windows',
      location: 'İstanbul, Türkiye',
      timestamp: '2024-01-15 14:22:00',
      status: 'info'
    },
    {
      id: 3,
      action: 'Başarısız Giriş Denemesi',
      device: 'Unknown Device',
      location: 'Ankara, Türkiye',
      timestamp: '2024-01-14 09:15:00',
      status: 'warning'
    }
  ];

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change
    console.log('Password change submitted');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'info':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'info':
        return Activity;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Güvenlik Ayarları</h2>
        <p className="text-gray-600">Hesabınızın güvenliğini artırmak için ayarları yapılandırın</p>
      </div>

      {/* Password Change */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Lock className="h-5 w-5 mr-2 text-red-500" />
          Şifre Değiştir
        </h3>
        
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                placeholder="Mevcut şifrenizi girin"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  placeholder="Yeni şifrenizi girin"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Şifre Tekrarı</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  placeholder="Yeni şifrenizi tekrar girin"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Güçlü Şifre Önerileri:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• En az 8 karakter uzunluğunda olmalı</li>
              <li>• Büyük ve küçük harfler içermeli</li>
              <li>• En az bir rakam içermeli</li>
              <li>• Özel karakterler (!@#$%^&*) kullanmalı</li>
            </ul>
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Key className="h-5 w-5 mr-2" />
            Şifreyi Güncelle
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Smartphone className="h-5 w-5 mr-2 text-green-500" />
          İki Faktörlü Doğrulama (2FA)
        </h3>
        
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">İki Faktörlü Doğrulama</h4>
              <p className="text-sm text-gray-600">
                Hesabınızın güvenliğini artırmak için SMS veya authenticator uygulaması kullanın
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={(e) => setTwoFactorEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-500"></div>
          </label>
        </div>

        {twoFactorEnabled && (
          <div className="mt-4 p-4 bg-green-100 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 mb-3">
              2FA aktif! Giriş yaparken telefonunuza gönderilen kodu girmeniz gerekecek.
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200">
              <Smartphone className="h-4 w-4 mr-2" />
              Yedek Kodları Görüntüle
            </button>
          </div>
        )}
      </div>

      {/* Security Activity Log */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-500" />
          Güvenlik Aktivite Geçmişi
        </h3>
        
        <div className="space-y-4">
          {securityLogs.map((log) => {
            const StatusIcon = getStatusIcon(log.status);
            return (
              <div key={log.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-100">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getStatusColor(log.status)}`}>
                    <StatusIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{log.action}</h4>
                    <p className="text-sm text-gray-600">{log.device} • {log.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{log.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl">
            <Clock className="h-5 w-5 mr-2" />
            Tüm Aktiviteleri Görüntüle
          </button>
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
          Güvenlik Önerileri
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h4 className="font-medium text-gray-900">Güçlü Şifre Kullanın</h4>
              <p className="text-sm text-gray-600">En az 8 karakter, karışık karakterler</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h4 className="font-medium text-gray-900">2FA Aktif Edin</h4>
              <p className="text-sm text-gray-600">Ekstra güvenlik katmanı ekleyin</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
            <div>
              <h4 className="font-medium text-gray-900">Düzenli Şifre Değişimi</h4>
              <p className="text-sm text-gray-600">3-6 ayda bir şifrenizi değiştirin</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
            <div>
              <h4 className="font-medium text-gray-900">Şüpheli Aktivite Takibi</h4>
              <p className="text-sm text-gray-600">Giriş loglarını düzenli kontrol edin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
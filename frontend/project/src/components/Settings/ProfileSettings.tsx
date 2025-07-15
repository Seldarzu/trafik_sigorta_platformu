import React, { useState } from 'react';
import { Camera, Mail, Phone, MapPin, Calendar, User, Building, Award, Upload } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileSettingsProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState(profile);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleChange = (field: keyof UserProfile, value: any) => {
    const updatedProfile = { ...formData, [field]: value };
    setFormData(updatedProfile);
    onUpdate(updatedProfile);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const roles = [
    { value: 'agent', label: 'Acente' },
    { value: 'manager', label: 'Müdür' },
    { value: 'admin', label: 'Yönetici' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil Bilgileri</h2>
        <p className="text-gray-600">Kişisel bilgilerinizi ve hesap ayarlarınızı güncelleyin</p>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
            {avatarPreview || profile.avatar ? (
              <img
                src={avatarPreview || profile.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-white" />
            )}
          </div>
          <label className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-2 rounded-full cursor-pointer hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg">
            <Camera className="h-4 w-4" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Profil Fotoğrafı</h3>
          <p className="text-sm text-gray-600 mb-2">JPG, PNG veya GIF formatında, maksimum 5MB</p>
          <label className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Fotoğraf Yükle
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4 inline mr-2 text-blue-500" />
            Ad
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4 inline mr-2 text-blue-500" />
            Soyad
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="h-4 w-4 inline mr-2 text-green-500" />
            E-posta
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="h-4 w-4 inline mr-2 text-purple-500" />
            Telefon
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Award className="h-4 w-4 inline mr-2 text-orange-500" />
            Rol
          </label>
          <select
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Agency Information */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Building className="h-5 w-5 mr-2 text-blue-500" />
          Acente Bilgileri
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Acente Adı</label>
            <input
              type="text"
              value={formData.agencyName}
              onChange={(e) => handleChange('agencyName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Acente Kodu</label>
            <input
              type="text"
              value={formData.agencyCode}
              onChange={(e) => handleChange('agencyCode', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lisans Numarası</label>
            <input
              type="text"
              value={formData.licenseNumber}
              onChange={(e) => handleChange('licenseNumber', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Hesap Durumu</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Üyelik Tarihi</p>
                <p className="text-lg font-bold text-green-700">
                  {new Date(formData.joinDate).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Son Giriş</p>
                <p className="text-lg font-bold text-blue-700">
                  {new Date(formData.lastLogin).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Hesap Durumu</p>
                <p className="text-lg font-bold text-purple-700">
                  {formData.isActive ? 'Aktif' : 'Pasif'}
                </p>
              </div>
              <div className={`w-8 h-8 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
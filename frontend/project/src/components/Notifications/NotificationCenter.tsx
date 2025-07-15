import React, { useState } from 'react';
import { Bell, X, Check, AlertTriangle, Info, CheckCircle, Clock, Filter, MoreVertical } from 'lucide-react';
import { Notification } from '../../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState('all');
  
  // Mock notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Teklif Süresi Dolumu',
      message: 'Q-2024-001 numaralı teklif 2 gün içinde sona erecek. Müşteri ile iletişime geçin.',
      type: 'warning',
      isRead: false,
      createdAt: '2024-01-16T10:30:00Z',
      actionUrl: '/quotes/Q-2024-001',
      actionText: 'Teklifi Görüntüle'
    },
    {
      id: '2',
      title: 'Yeni Müşteri Kaydı',
      message: 'Ayşe Demir sisteme yeni müşteri olarak kaydoldu.',
      type: 'success',
      isRead: false,
      createdAt: '2024-01-16T09:15:00Z',
      actionUrl: '/customers/C-002',
      actionText: 'Müşteriyi Görüntüle'
    },
    {
      id: '3',
      title: 'Sistem Güncellemesi',
      message: 'Yeni özellikler ve iyileştirmeler mevcut. Güncellemeleri inceleyin.',
      type: 'info',
      isRead: true,
      createdAt: '2024-01-15T16:45:00Z',
      actionUrl: '/settings',
      actionText: 'Ayarlara Git'
    },
    {
      id: '4',
      title: 'Poliçe Yenileme Zamanı',
      message: 'Mehmet Özkan\'ın poliçesi 1 hafta içinde yenilenmelidir.',
      type: 'warning',
      isRead: true,
      createdAt: '2024-01-15T14:20:00Z',
      actionUrl: '/customers/C-001',
      actionText: 'Müşteriyi Ara'
    },
    {
      id: '5',
      title: 'Haftalık Rapor Hazır',
      message: 'Bu haftanın performans raporu görüntülemeye hazır.',
      type: 'info',
      isRead: false,
      createdAt: '2024-01-15T08:00:00Z',
      actionUrl: '/analytics',
      actionText: 'Raporu Görüntüle'
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'error':
        return X;
      case 'info':
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'from-green-500 to-emerald-500';
      case 'warning':
        return 'from-yellow-500 to-orange-500';
      case 'error':
        return 'from-red-500 to-pink-500';
      case 'info':
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Az önce';
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    return `${Math.floor(diffInHours / 24)} gün önce`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end pt-16 pr-4">
      <div className="bg-white rounded-xl shadow-2xl w-96 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-6 w-6 mr-3" />
              <div>
                <h2 className="text-xl font-bold">Bildirimler</h2>
                {unreadCount > 0 && (
                  <p className="text-blue-100 text-sm">{unreadCount} okunmamış bildirim</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex space-x-2">
              {[
                { id: 'all', label: 'Tümü' },
                { id: 'unread', label: 'Okunmamış' },
                { id: 'read', label: 'Okunmuş' }
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                    filter === filterOption.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Tümünü Okundu İşaretle
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Bildirim Yok</h3>
              <p className="text-gray-600">
                {filter === 'unread' ? 'Okunmamış bildiriminiz bulunmuyor.' : 'Henüz bildiriminiz yok.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                      !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 p-2 rounded-lg bg-gradient-to-r ${getNotificationColor(notification.type)}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-100"
                                title="Okundu işaretle"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100"
                              title="Sil"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(notification.createdAt)}
                          </span>
                          
                          {notification.actionUrl && (
                            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                              {notification.actionText}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
              Tüm Bildirimleri Görüntüle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
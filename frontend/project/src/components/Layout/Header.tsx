import React, { useState, useEffect } from 'react'
import {
  Shield,
  FileText,
  Clock,
  Users,
  TrendingUp,
  Bell,
  Settings,
  LucideIcon
} from 'lucide-react'
import NotificationCenter from '../Notifications/NotificationCenter'
import { NotificationService } from '../../services/NotificationService'
import { Notification, Page } from '../../types'

interface HeaderProps {
  currentPage: Page
  onPageChange: (page: Page) => void
}

const navigation: { id: Page; label: string; icon: LucideIcon | null }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Shield },
  { id: 'new-quote', label: 'Yeni Teklif', icon: FileText },
  { id: 'quotes', label: 'Teklifler', icon: FileText },
  { id: 'policies', label: 'Poliçeler', icon: Clock },
  { id: 'customers', label: 'Müşteriler', icon: Users },
  { id: 'analytics', label: 'Analitik', icon: TrendingUp },
  { id: 'settings', label: 'Ayarlar', icon: Settings }
]

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    NotificationService.list().then(ns => {
      setNotifications(ns)
      setUnreadCount(ns.filter(n => !n.isRead).length)
    })
  }, [])

  const toggleNotifications = () => {
    if (showNotifications && unreadCount > 0) {
      NotificationService.markAllRead().then(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        setUnreadCount(0)
      })
    }
    setShowNotifications(!showNotifications)
  }

  return (
    <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-white" />
            <span className="ml-3 text-xl font-bold text-white">SigortaTeklif Pro</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            {navigation.map(item => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'text-white bg-white/20 backdrop-blur-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleNotifications}
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
                <Users className="h-4 w-4 text-white" />
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
        notifications={notifications}
        onClose={() => setShowNotifications(false)}
      />
    </header>
  )
}

export default Header

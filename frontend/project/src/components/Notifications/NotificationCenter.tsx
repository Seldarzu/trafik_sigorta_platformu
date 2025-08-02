import React, { useState } from 'react'
import { Bell, X, CheckCircle, AlertTriangle, Info, Check, Clock } from 'lucide-react'
import { Notification } from '../../types'

interface Props {
  isOpen: boolean
  notifications: Notification[]
  onClose: () => void
}

const NotificationCenter: React.FC<Props> = ({ isOpen, notifications, onClose }) => {
  const [filter, setFilter] = useState<'all'|'unread'|'read'>('all')
  if (!isOpen) return null
  const filtered = notifications.filter(n=>filter==='all'?true:filter==='unread'?!n.isRead:n.isRead)
  const unreadCount = notifications.filter(n=>!n.isRead).length
  const iconMap = { success:CheckCircle, warning:AlertTriangle, error:X, info:Info }
  const colorMap = { success:'from-green-500 to-emerald-500', warning:'from-yellow-500 to-orange-500', error:'from-red-500 to-pink-500', info:'from-blue-500 to-cyan-500' }
  const fmt=(ts:string)=>{
    const now=Date.now(),diff=(now-new Date(ts).getTime())/36e5
    return diff<1?'Az önce':diff<24?`${Math.floor(diff)} saat önce`:`${Math.floor(diff/24)} gün önce`
  }
  const markRead=(id:string)=>{}
  const del=(id:string)=>{}
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end pt-16 pr-4">
      <div className="bg-white rounded-xl shadow-2xl w-96 max-h-[80vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center"><Bell className="h-6 w-6 mr-3" /><h2 className="text-xl font-bold">Bildirimler</h2></div>
            <div>{unreadCount>0&&<span>{unreadCount} okunmamış</span>}</div>
            <button onClick={onClose}><X className="h-5 w-5" /></button>
          </div>
        </div>
        <div className="p-4 border-b">
          <div className="flex space-x-2">
            {['all','unread','read'].map(f=>(
              <button key={f} onClick={()=>setFilter(f as any)} className={`${filter===f?'bg-blue-100':''} px-3 py-1 rounded`}>{f==='all'?'Tümü':f==='unread'?'Okunmamış':'Okunmuş'}</button>
            ))}
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto divide-y divide-gray-200">
          {filtered.length===0
            ? <div className="p-8 text-center"><Bell className="h-12 w-12 text-gray-300 mb-4" /><p>Bildirim Yok</p></div>
            : filtered.map(n=>{
                const Icon=iconMap[n.type]
                return (
                  <div key={n.id} className={`p-4 ${!n.isRead?'bg-blue-50 border-l-4 border-blue-500':''}`}>
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${colorMap[n.type]}`}><Icon className="h-4 w-4 text-white" /></div>
                        <div>
                          <h4 className={`${!n.isRead?'text-gray-900':'text-gray-700'}`}>{n.title}</h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{n.message}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-gray-500 flex items-center"><Clock className="h-3 w-3 mr-1" />{fmt(n.createdAt)}</span>
                            {n.actionText&&<button className="text-xs text-blue-600">{n.actionText}</button>}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {!n.isRead&&<button onClick={()=>markRead(n.id)}><Check className="h-4 w-4" /></button>}
                        <button onClick={()=>del(n.id)}><X className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                )
              })
          }
        </div>
      </div>
    </div>
  )
}

export default NotificationCenter

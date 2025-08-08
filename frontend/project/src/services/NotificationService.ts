import api from '../api/axios'
import { Notification } from '../types'

export const NotificationService = {
  list: (): Promise<Notification[]> =>
    api.get<Notification[]>('/notifications').then(r => r.data),
  markRead: (id: string): Promise<void> =>
    api.put<void>(`/notifications/${id}/read`).then(r => r.data),
  markAllRead: (): Promise<void> =>
    api.put<void>('/notifications/read-all').then(r => r.data)
}

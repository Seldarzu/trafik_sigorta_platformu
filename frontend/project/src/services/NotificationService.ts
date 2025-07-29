import api from '../api/axios';
import { Notification } from '../types';

export const NotificationService = {
  list: () => api.get<Notification[]>('/notifications').then(r => r.data),
  markRead: (id: string) =>
    api.put<void>(`/notifications/${id}/read`).then(r => r.data),
};

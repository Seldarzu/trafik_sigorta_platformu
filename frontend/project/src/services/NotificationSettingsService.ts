import api from '../api/axios';
import { NotificationSettings } from '../types';

export const NotificationSettingsService = {
  get: (userId: string) =>
    api.get<NotificationSettings>(`/users/${userId}/notification-settings`).then(r => r.data),
  update: (userId: string, settings: NotificationSettings) =>
    api.put<NotificationSettings>(`/users/${userId}/notification-settings`, settings).then(r => r.data),
};

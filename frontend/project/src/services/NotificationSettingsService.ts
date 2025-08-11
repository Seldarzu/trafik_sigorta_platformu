// src/services/NotificationSettingsService.ts
import api from '../api/axios';
import type { NotificationSettings } from '../types';

// types.ts içindeki NotificationSettings ile aynı alanları kullanıyoruz

export const NotificationSettingsService = {
  get: async (userId: string) =>
    (await api.get<NotificationSettings>(`/users/${userId}/notification-settings`)).data,

  update: async (userId: string, settings: NotificationSettings) =>
    api.put(`/users/${userId}/notification-settings`, settings),
};

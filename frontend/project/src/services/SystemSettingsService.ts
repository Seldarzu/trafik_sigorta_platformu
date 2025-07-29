import api from '../api/axios';
import { SystemSettings } from '../types';

export const SystemSettingsService = {
  get: () => api.get<SystemSettings>('/system/settings').then(r => r.data),
  update: (dto: SystemSettings) =>
    api.put<SystemSettings>('/system/settings', dto).then(r => r.data),
};

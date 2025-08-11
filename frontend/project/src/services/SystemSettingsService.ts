// src/services/SystemSettingsService.ts
import api from '../api/axios';

export type SystemSettingsResponse = {
  agencyName: string | null;
  agencyCode: string | null;
  licenseNumber: string | null;
  joinDate: string | null;   // yyyy-MM-dd
  lastLogin: string | null;  // yyyy-MM-dd veya ISO
  isActive: boolean | null;
};

export type SystemSettingsRequest = {
  agencyName?: string | null;
  agencyCode?: string | null;
  licenseNumber?: string | null;
  joinDate?: string | null;
  lastLogin?: string | null;
  isActive?: boolean | null;
};

export const SystemSettingsService = {
  get: async () => (await api.get<SystemSettingsResponse>('/system/settings')).data,
  update: async (body: SystemSettingsRequest) => {
    await api.put('/system/settings', body);
  },
};

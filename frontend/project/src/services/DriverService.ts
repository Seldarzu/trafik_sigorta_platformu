import api from '../api/axios';
import { CreateDriverDto, Driver } from '../types';

export const DriverService = {
  list: (): Promise<Driver[]> =>
    api.get<Driver[]>('/drivers').then(res => res.data),

  getById: (id: string): Promise<Driver> =>
    api.get<Driver>(`/drivers/${id}`).then(res => res.data),

  create: (dto: CreateDriverDto): Promise<Driver> =>
    api.post<Driver>('/drivers', dto).then(res => res.data),

  update: (id: string, dto: Partial<CreateDriverDto>): Promise<Driver> =>
    api.put<Driver>(`/drivers/${id}`, dto).then(res => res.data),

  remove: (id: string): Promise<void> =>
    api.delete<void>(`/drivers/${id}`).then(res => res.data),
};

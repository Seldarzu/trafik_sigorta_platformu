import api from '../api/axios';
import { Vehicle, CreateVehicleDto } from '../types';

export const VehicleService = {
  list: () => api.get<Vehicle[]>('/vehicles').then(res => res.data),
  get: (id: string) => api.get<Vehicle>(`/vehicles/${id}`).then(res => res.data),
  create: (dto: CreateVehicleDto) => api.post<Vehicle>('/vehicles', dto).then(res => res.data),
  update: (id: string, dto: Partial<CreateVehicleDto>) =>
    api.put<Vehicle>(`/vehicles/${id}`, dto).then(res => res.data),
  remove: (id: string) => api.delete<void>(`/vehicles/${id}`).then(res => res.data),
};

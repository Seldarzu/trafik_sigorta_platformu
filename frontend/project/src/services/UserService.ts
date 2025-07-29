import api from '../api/axios';
import { User, UpdateUserDto } from '../types';

export const UserService = {
  get: (id: string) => api.get<User>(`/users/${id}`).then(r => r.data),
  update: (id: string, dto: UpdateUserDto) =>
    api.put<User>(`/users/${id}`, dto).then(r => r.data),
};

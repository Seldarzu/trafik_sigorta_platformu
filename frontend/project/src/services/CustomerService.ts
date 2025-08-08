// src/frontend/services/CustomerService.ts
import api from '../api/axios';
import { Customer, CreateCustomerDto } from '../types';

export const CustomerService = {
  list:   () => api.get<Customer[]>('/customers').then(r => r.data),
  get:    (id: string) => api.get<Customer>(`/customers/${id}`).then(r => r.data),
  create: (dto: CreateCustomerDto) => api.post<Customer>('/customers', dto).then(r => r.data),
  update: (id: string, dto: Partial<CreateCustomerDto>) =>
            api.put<Customer>(`/customers/${id}`, dto).then(r => r.data),
  remove: (id: string) => api.delete<void>(`/customers/${id}`).then(r => r.data),
};

import http from '@/api/axios';
import { Customer, CreateCustomerDto, Quote } from '@/types';

export type CustomerNoteRequest  = { note: string };
export type CustomerNoteResponse = { id: string; note: string; createdAt: string };

export const CustomerService = {
  async list(): Promise<Customer[]> {
    const { data } = await http.get<Customer[]>('/customers');
    return data;
  },
  async get(id: string): Promise<Customer> {
    const { data } = await http.get<Customer>(`/customers/${id}`);
    return data;
  },
  async create(payload: CreateCustomerDto): Promise<Customer> {
    const { data } = await http.post<Customer>('/customers', payload);
    return data;
  },
  async update(id: string, payload: Partial<CreateCustomerDto>): Promise<Customer> {
    const { data } = await http.put<Customer>(`/customers/${id}`, payload);
    return data;
  },
  async remove(id: string): Promise<void> {
    await http.delete(`/customers/${id}`);
  },
  async addNote(id: string, payload: CustomerNoteRequest): Promise<CustomerNoteResponse> {
    const { data } = await http.post<CustomerNoteResponse>(`/customers/${id}/notes`, payload);
    return data;
  },
  async quotes(id: string): Promise<Quote[]> {
    const { data } = await http.get<Quote[]>(`/customers/${id}/quotes`);
    return data;
  },
  async policies(id: string): Promise<any[]> {
    const { data } = await http.get<any[]>(`/customers/${id}/policies`);
    return data;
  },
  async search(q: string): Promise<Array<Pick<Customer, 'id'|'firstName'|'lastName'|'email'|'phone'>>> {
    const { data } = await http.get(`/customers/search`, { params: { q } });
    return data;
  },
};

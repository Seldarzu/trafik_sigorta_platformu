// src/frontend/services/QuoteService.ts
import api from '../api/axios';
import { Quote, CreateQuoteDto } from '../types';

export const QuoteService = {
  list: (page = 0, size = 10) =>
    api.get<Quote[]>(`/api/quotes?page=${page}&size=${size}`).then(r => r.data),

  getById: (id: string) =>
    api.get<Quote>(`/api/quotes/${id}`).then(r => r.data),

  create: (dto: CreateQuoteDto) =>
    api.post<Quote>('/api/quotes', dto).then(r => r.data),

  update: (id: string, dto: Partial<CreateQuoteDto>) =>
    api.put<Quote>(`/api/quotes/${id}`, dto).then(r => r.data),

  delete: (id: string) =>
    api.delete<void>(`/api/quotes/${id}`).then(r => r.data),

  convert: (id: string) =>
    api.post<any>(`/api/quotes/${id}/convert`).then(r => r.data),

  search: (params: {
    customerName?: string;
    from?: string;
    to?: string;
    page?: number;
    size?: number;
  }) => {
    const q = new URLSearchParams();
    if (params.customerName) q.append('customerName', params.customerName);
    if (params.from)         q.append('from', params.from);
    if (params.to)           q.append('to', params.to);
    q.append('page',  (params.page ?? 0).toString());
    q.append('size',  (params.size ?? 10).toString());
    return api.get<Quote[]>(`/api/quotes/search?${q}`).then(r => r.data);
  }
};

// src/frontend/services/QuoteService.ts
import api from '../api/axios';
import { Quote, CreateQuoteDto } from '../types';

export const QuoteService = {
  list: (page = 0, size = 10) =>
    api.get<Quote[]>(`/quotes?page=${page}&size=${size}`).then(r => r.data),

  getById: (id: string) =>
    api.get<Quote>(`/quotes/${id}`).then(r => r.data),

  create: (dto: CreateQuoteDto) =>
    api.post<Quote>('/quotes', dto).then(r => r.data),

  update: (id: string, dto: Partial<CreateQuoteDto>) =>
    api.put<Quote>(`/quotes/${id}`, dto).then(r => r.data),

  delete: (id: string) =>
    api.delete<void>(`/quotes/${id}`).then(r => r.data),

  convert: (id: string) =>
    api.post<any>(`/quotes/${id}/convert`).then(r => r.data),

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
    q.append('page', String(params.page ?? 0));
    q.append('size', String(params.size ?? 10));
    return api.get<Quote[]>(`/quotes/search?${q}`).then(r => r.data);
  }
};

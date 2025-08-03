import api from '../api/axios';
import { Quote, CreateQuoteDto } from '../types';

export const QuoteService = {
  list:    (page = 0, size = 10) => api.get<Quote[]>(`/quotes?page=${page}&size=${size}`).then(r => r.data),
  getRecent: () => api.get<Quote[]>('/quotes/recent').then(r => r.data),
  create: (dto: CreateQuoteDto) => api.post<Quote>('/quotes', dto).then(r => r.data)
};

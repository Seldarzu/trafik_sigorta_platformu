import api from '../api/axios';
import { Quote, CreateQuoteDto } from '../types';

export const QuoteService = {
  list: (): Promise<Quote[]> =>
    api.get<Quote[]>('/quotes').then(res => res.data),

  getRecent: (): Promise<Quote[]> =>
    api.get<Quote[]>('/quotes/recent').then(res => res.data),

  create: (dto: CreateQuoteDto): Promise<Quote> =>
    api.post<Quote>('/quotes', dto).then(res => res.data),
};

import api from '../api/axios'
import { Quote, CreateQuoteDto } from '../types'

export const QuoteService = {
  list: (page = 0, size = 10): Promise<Quote[]> =>
    api.get<Quote[]>(`/quotes?page=${page}&size=${size}`).then(r => r.data),
  getRecent: (): Promise<Quote[]> =>
    api.get<Quote[]>('/quotes/recent').then(r => r.data),
  create: (dto: CreateQuoteDto): Promise<Quote> =>
    api.post<Quote>('/quotes', dto).then(r => r.data)
}

// src/hooks/useQuotes.ts
import { useState, useEffect } from 'react';
import { QuoteService } from '../services/QuoteService';
import { Quote } from '../types';

export function useQuotes() {
  const [data, setData] = useState<Quote[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    QuoteService.list()
      .then((quotes: Quote[]) => setData(quotes))
      .catch((err: Error) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

import { useState, useEffect } from 'react';
import { Quote } from '../types';
import { QuoteService } from '../services/QuoteService';

export function useQuotes() {
  const [data, setData]     = useState<Quote[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    QuoteService.list()
      .then((quotes) => setData(quotes))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

import { useState, useEffect } from 'react';
import { CustomerService } from '../services/CustomerService';
import { Customer } from '../types';

export function useCustomers() {
  const [data, setData] = useState<Customer[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    CustomerService.list()
      .then(res => setData(res))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

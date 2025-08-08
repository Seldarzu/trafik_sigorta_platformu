import { useState, useEffect } from 'react';
import { CustomerService } from '../services/CustomerService';
import { Customer } from '../types';

export function useCustomers() {
  const [data, setData] = useState<Customer[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = () => {
    setLoading(true);
    CustomerService.list()
      .then(res => {
        // Enum değerlerini lowercase yapalım ki filtreler çalışsın
        const normalized = res.map(c => ({
          ...c,
          status: c.status.toLowerCase() as Customer['status'],
          customerValue: c.customerValue.toLowerCase() as Customer['customerValue'],
          riskProfile: c.riskProfile.toLowerCase() as Customer['riskProfile'],
        }));
        setData(normalized);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Refetch fonksiyonunu dışa açıyoruz
  return { data, loading, error, refetch: fetchData };
}

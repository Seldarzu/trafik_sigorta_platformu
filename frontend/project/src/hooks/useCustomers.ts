// src/hooks/useCustomers.ts
import { useQuery } from 'react-query';
import { CustomerService } from '../services/CustomerService';
import { Customer } from '../types';

export function useCustomers() {
  const query = useQuery<Customer[], Error>(
    ['customers'],
    () => CustomerService.list(),
    { staleTime: 60_000 } // 1dk cache
  );

  return {
    data: query.data,
    loading: query.isLoading,
    error: query.error ?? null,
    refetch: query.refetch,
  };
}

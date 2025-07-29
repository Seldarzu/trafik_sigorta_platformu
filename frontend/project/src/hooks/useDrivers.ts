import { useState, useEffect } from 'react';
import { DriverService } from '../services/DriverService';
import { Driver } from '../types';

export function useDrivers() {
  const [data, setData] = useState<Driver[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    DriverService.list()
      .then((drivers: Driver[]) => setData(drivers))
      .catch((err: Error) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

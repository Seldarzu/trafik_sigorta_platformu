import { useState, useEffect } from 'react';
import { VehicleService } from '../services/VehicleService';
import { Vehicle } from '../types';

export function useVehicles() {
  const [data, setData] = useState<Vehicle[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    VehicleService.list()
      .then(res => setData(res))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

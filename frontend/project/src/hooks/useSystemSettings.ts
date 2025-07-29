import { useState, useEffect } from 'react';
import { SystemSettingsService } from '../services/SystemSettingsService';
import { SystemSettings } from '../types';

export function useSystemSettings() {
  const [data, setData] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    SystemSettingsService.get()
      .then(res => setData(res))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

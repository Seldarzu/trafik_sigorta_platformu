import { useState, useEffect } from 'react';
import { NotificationSettingsService } from '../services/NotificationSettingsService';
import { NotificationSettings } from '../types';

export function useNotificationSettings(userId: string) {
  const [data, setData] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    NotificationSettingsService.get(userId)
      .then(res => setData(res))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [userId]);

  return { data, loading, error };
}

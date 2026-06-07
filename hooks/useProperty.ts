import { useEffect, useState } from 'react';
import { propertiesApi } from '@/services/fetchData/property/fetch-property.api';
import { Property } from '@/types';

export function useProperty(id: number) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    if (!Number.isFinite(id) || id <= 0) {
      setProperty(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await propertiesApi.getById(id);
      setProperty(data);
    } catch {
      setProperty(null);
    } finally {
      setLoading(false);
    }
  }

  return {
    property,
    loading,
  };
}

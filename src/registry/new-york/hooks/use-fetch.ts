import { useCallback, useEffect, useRef, useState } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

interface UseFetchState<T> {
  data: T | null;
  error: AxiosError | null;
  loading: boolean;
  refetch: () => void;
}

export function useFetch<T>(
  url: string,
  config?: AxiosRequestConfig
): UseFetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const controllerRef = useRef<AbortController | null>(null);
  

  const fetchData = useCallback(async () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();
    setLoading(true);

    try {
      const response = await axios.get<T>(url, {
        ...config,
        signal: controllerRef.current.signal
      });
      setData(response.data);
      setError(null);
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError(err as AxiosError);
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  }, [url,config]);

  useEffect(() => {
    fetchData();
    return () => {
      controllerRef.current?.abort();
    };
  }, [fetchData]);

  return { data, error, loading, refetch: fetchData };
}
import {useMemo} from 'react';

function useReverseMap<T extends Record<string, string>>(map: T): Record<string, keyof T> {
  return useMemo(() => {
    return Object.fromEntries(Object.entries(map).map(([key, value]) => [value, key])) as Record<string, keyof T>;
  }, [map]);
}

export default useReverseMap;

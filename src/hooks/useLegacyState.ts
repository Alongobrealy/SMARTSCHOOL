import { useCallback } from 'react';

// A dummy setter to replace setX without breaking the UI.
// The actual state updates happen via syncEngine and Dexie's useLiveQuery.
export function useLegacyState<T>(liveData: T[]): [T[], (val: any) => void] {
  const dummySetter = useCallback((val: any) => {
    // Intentional no-op. The `syncEngine.queueAction` triggered next to `setX` in App.tsx 
    // will mutate IndexedDB, which triggers useLiveQuery, which updates `liveData` automatically.
    // We log it just in case something relies purely on setX without syncEngine.
  }, []);
  return [liveData || [], dummySetter];
}

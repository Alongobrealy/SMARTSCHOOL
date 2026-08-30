import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/pwaDatabase';
import { supabase } from '../lib/supabase';
import { keysToCamelCase } from '../utils/caseConv';

export function useSupabaseSync<T>(
  supabaseTable: string,
  dexieTable: any,
  schoolId: string | null
): T[] {
  // Pull data from Supabase periodically or on mount
  useEffect(() => {
    let isMounted = true;
    
    async function fetchFromSupabase() {
      if (!schoolId) return;
      
      try {
        const { data, error } = await supabase
          .from(supabaseTable)
          .select('*')
          .eq('school_id', schoolId);
          
        if (error) throw error;
        
        if (data && isMounted) {
          const formattedData = keysToCamelCase(data);
          
          // Basic sync: update Dexie with fresh data from server
          // To avoid overwriting pending local mutations, we should ideally check syncQueue, 
          // but for this MVP we'll upsert everything into Dexie.
          await db.transaction('rw', dexieTable, async () => {
            for (const item of formattedData) {
              const localId = item.clientGeneratedId || item.id;
              if (localId) {
                // Ensure id maps to local id to prevent duplicates
                const localItem = { ...item, id: localId };
                await dexieTable.put(localItem);
              }
            }
          });
        }
      } catch (err) {
        console.error(`[SupabaseSync] Error fetching ${supabaseTable}:`, err);
      }
    }
    
    fetchFromSupabase();
    
    // Set up realtime subscription
    const subscription = supabase
      .channel(`${supabaseTable}_changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table: supabaseTable, filter: `school_id=eq.${schoolId}` }, payload => {
         fetchFromSupabase(); // Simple refetch on change
      })
      .subscribe();
      
    return () => {
      isMounted = false;
      supabase.removeChannel(subscription);
    };
  }, [supabaseTable, dexieTable, schoolId]);

  // Read data from local Dexie database for instant UI
  const records = useLiveQuery(
    async () => {
      if (!schoolId) return [];
      return await dexieTable.where('schoolId').equals(schoolId).toArray() || await dexieTable.toArray();
    },
    [dexieTable, schoolId]
  );

  return (records as T[]) || [];
}

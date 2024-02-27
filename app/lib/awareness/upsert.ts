import { Database } from '@/types_db';
import { createClient } from '@/utils/supabase/server';

export type Awareness = Database['public']['Tables']['awareness']['Row'];

export async function upsert(awarenessData: string) {

      const supabase = createClient();
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();
    
        if (!user) {
          throw new Error('User not authenticated');
        }
      const { data, error } = await supabase
        .from('awareness')
        .upsert({ informations:awarenessData, id: user.id }, { onConflict: 'id' })
        .single(); // Assuming you want to work with a single record
  
      if (error) throw error;
  
      return data;
    } catch (error) {
      console.error('Error upserting user awareness:', error);
      return null;
    }
  }
  
import { createClient } from '@/utils/supabase/server';

export async function read() {
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
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error reading user awareness:', error);
    return null;
  }
}

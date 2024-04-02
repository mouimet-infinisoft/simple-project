import { core } from "../BrainStackProvider";
import { createClient } from "./client";

export const fetchUserData = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        // User is authenticated, fetch user data
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error.message);
        } else {
          // Update the state with the user data using bstack.store.mutate()
          core.store.mutate((state) => ({
            ...state,
            userData // Assuming you want to store the user data in the state
          }));
        }

        return userData
      }
    } catch (error) {
      console.error('Error in useSupabaseData hook:', error);
    }
  };
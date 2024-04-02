'use client';
import { useEffect } from 'react';
import { core } from '@/utils/BrainStackProvider';
import { useRouter } from 'next/navigation';
import { fetchUserData } from '@/utils/supabase/fetchUserData';

function useAuthorization() {
  const {push} = useRouter()

  useEffect(() => {
    fetchUserData();

    // Cleanup function if needed
    return () => {
      // Cleanup logic here
    };
  }, []);


  core.useOn('userdata.refresh', ()=>{
    fetchUserData()
    .then(()=>{
      push(`/protected/assistant`)
    })
  })
}

export default useAuthorization;

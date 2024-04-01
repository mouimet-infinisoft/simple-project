import React from 'react';
import AIForm from '@/components/ui/AccountForms/AIForm';
import { createClient } from '@/utils/supabase/server';

export default async function OnboardingPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .eq('id', user?.id ?? '')
    .single();

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  return (
    <>

        <div className="p-4 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <div className="text-3xl font-bold text-center mb-10">
              Onboarding
              <AIForm
                apiKey={userDetails?.openai_apikey ?? ''}
                assistantId={userDetails?.assistant_id ?? ''}
                togetherApiKey={userDetails?.togetherai_apikey ?? ''}
                aiIntegration={userDetails?.ai_integration ?? ''}
              />
            </div>
          </div>
        </div>
    </>
  );
}

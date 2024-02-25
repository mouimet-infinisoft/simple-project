import { OpenAIIntegration } from '@/utils/openai/integrations/openai';
import { createClient } from '@/utils/supabase/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET(request: NextRequest) {
  // Initialize Supabase client
  const supabase = createClient();
  // Extract the user session from the request to identify the user
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401
    });
  }

  // Fetch messages for the authenticated user
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('userId', user.id) // Filter messages by the authenticated user's ID
    .order('created_at', { ascending: true });

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400
    });
  }

  return new NextResponse(JSON.stringify(messages), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request: NextRequest) {
  // Initialize Supabase client
  const supabase = createClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401
    });
  }

  const data = await request.json();
  const { text } = data;

  // Insert the new message with the authenticated user's ID
  const { data: newMessage, error } = await supabase
    .from('messages')
    .insert([{ userId: user.id, text, role: 'me' }])
    .single();

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400
    });
  }

  // Fetch api key
  const { data: userData, error: userDataError } = await supabase
    .from('users')
    .select('*')
    .eq('userId', user.id) // Filter messages by the authenticated user's ID
    .single();

  if (userDataError) {
    return new NextResponse(JSON.stringify({ error: userDataError.message }), {
      status: 400
    });
  }

  const ai = userData?.openai_apikey
    ? new OpenAIIntegration(
        5,
        new OpenAI({ apiKey: userData.openai_apikey })
      )
    : new OpenAIIntegration(5);
  const answer = await ai.ask(text);

  const { data: newAiMessage, error: errorAi } = await supabase
    .from('messages')
    .insert([{ userId: user.id, text: answer, role: 'ibrain' }])
    .single();

  if (errorAi) {
    return new NextResponse(JSON.stringify({ error: errorAi.message }), {
      status: 400
    });
  }

  return new NextResponse(JSON.stringify(newMessage), {
    headers: { 'Content-Type': 'application/json' }
  });
}

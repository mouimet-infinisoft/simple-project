import { ChatMessage } from '@/types/ChatMessage';
import { OpenAIIntegration } from '@/utils/openai/integrations/openai';
import { createClient } from '@/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Assuming `supabase` is an instance of `SupabaseClient` and is initialized elsewhere
async function prepareContext(
  userId: string,
  supabase: SupabaseClient
): Promise<string> {
  // Fetch the last 6 messages for the given user ID, initially in descending order
  const { data: messages, error } = await supabase
    .from('messages') // Use the ChatMessage type for the query
    .select('*')
    .eq('user_id', userId) // Filter messages by the given user ID
    .order('created_at', { ascending: false }) // Get the most recent messages first
    .limit(6);

  // Check for errors
  if (error) {
    console.error('Error fetching messages:', error);
    return ''; // Return an empty string or handle the error appropriately
  }

  // Ensure messages is not null or undefined before proceeding
  if (!messages) return '';

  // Reverse the messages to have them in chronological order
  const chronologicalMessages = messages.slice().reverse();

  // Create a context string for the LLM using the role as the sender
  const llmContext = chronologicalMessages
    .map((message: ChatMessage) => {
      // Use `role` as the identifier for the sender in the formatted message
      return `${message.role}: ${message.text}`;
    })
    .join('\n'); // Join messages with a newline character for separation

  return 'Consider following context:\n' + llmContext;
}

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
    .eq('user_id', user.id) // Filter messages by the authenticated user's ID
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
    .insert([{ user_id: user.id, text, role: 'me' }])
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
    .eq('id', user.id) // Filter messages by the authenticated user's ID
    .single();

  if (userDataError) {
    return new NextResponse(JSON.stringify({ error: userDataError.message }), {
      status: 400
    });
  }

  const context = await prepareContext(user.id, supabase);
  console.log(`Context: `, context);
  
  const ai = userData?.openai_apikey
    ? new OpenAIIntegration(5, new OpenAI({ apiKey: userData.openai_apikey }))
    : new OpenAIIntegration(5);
  const answer = await ai.ask(
    context + 'Consider following new message:\n' + text
  );

  const { data: newAiMessage, error: errorAi } = await supabase
    .from('messages')
    .insert([{ user_id: user.id, text: answer, role: 'ibrain' }])
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

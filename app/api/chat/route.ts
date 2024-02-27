import { UserAwareness } from '@/app/lib/awareness/user_awareness_base';
import { ChatMessage } from '@/types/ChatMessage';
import { OpenAIIntegration } from '@/utils/openai/integrations/openai';
import { createClient } from '@/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

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

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', user.id) // Filter messages by the authenticated user's ID
    .order('created_at', { ascending: false }) // Order by created_at in descending order
    .limit(25); // Limit to the last 25 messages

  // If there's no error and data is returned, reverse the array to have the messages in ascending order
  const messages = data && !error ? data.reverse() : [];

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
  const userPromise = supabase.auth.getUser();
  const jsonPromise = request.json();

  try {
    // Wait for both promises to resolve
    const [
      {
        data: { user },
        error: userError
      },
      requestData
    ] = await Promise.all([userPromise, jsonPromise]);

    // Check for user fetch error
    if (!user || userError) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401
      });
    }

    // Now you have both the user and the request data
    const { text } = requestData;

    // Start both operations without waiting for them to complete
    const insertMessagePromise = supabase
      .from('messages')
      .insert([{ user_id: user.id, text, role: 'user' }])
      .single();

    const fetchUserDataPromise = supabase
      .from('users')
      .select('*')
      .eq('id', user.id) // Filter messages by the authenticated user's ID
      .single();

    const [insertMessageResult, fetchUserDataResult] = await Promise.all([
      insertMessagePromise,
      fetchUserDataPromise
    ]);

    const { data: newMessage, error } = insertMessageResult;
    const { data: userData, error: userDataError } = fetchUserDataResult;

    // Handle errors for message insertion
    if (error) {
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 400
      });
    }

    // Handle errors for fetching user data
    if (userDataError) {
      return new NextResponse(
        JSON.stringify({ error: userDataError.message }),
        { status: 400 }
      );
    }

    const context = await prepareContext(user.id, supabase);

    const ai = userData?.openai_apikey
      ? new OpenAIIntegration(5, new OpenAI({ apiKey: userData.openai_apikey }))
      : new OpenAIIntegration(5);

    const userAwareness = new UserAwareness(ai);
    const userAwarenessContent = await userAwareness.updateFromUser(text);

    const answer = await ai.ask(
      'Your name is ibrain and you are a helpful AI assistant.\n' +
        'Consider the following content as your self thoughts awareness toward the user:\n' +
        userAwarenessContent +
        '\n' +
        context +
        '\nGenerare your answer accordingly.\n'
      // text
    );

    await Promise.all([
      // Insert the new AI message into the database
      supabase
        .from('messages')
        .insert([
          {
            user_id: user.id,
            text: answer.replace('ibrain:', ''),
            role: 'ibrain'
          }
        ])
        .single(),

      // Update the user awareness based on AI's answer
      userAwareness.updateFromAi(answer)
    ]);

    return new NextResponse(JSON.stringify(newMessage), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    // Handle any errors that occurred during the fetching of the user or reading of the request body
    console.error('An error occurred:', error);
    return new NextResponse(JSON.stringify({ error: 'An error occurred' }), {
      status: 500
    });
  }
}

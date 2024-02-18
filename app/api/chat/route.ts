import { createClient } from '@/utils/supabase/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

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
    .order('created_at', { ascending: false });

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
    .insert([{ userId: user.id, text }])
    .single();

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400
    });
  }

  return new NextResponse(JSON.stringify(newMessage), {
    headers: { 'Content-Type': 'application/json' }
  });
}

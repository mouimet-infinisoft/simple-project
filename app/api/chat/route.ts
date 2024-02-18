type ChatMessage = {
  id: number;
  text: string;
};

const messages: ChatMessage[] = []; // In-memory store for chat messages

export const config = {
  runtime: 'edge',
};

export async function POST(req: Request) {
  const data = await req.json();
  const newMessage: ChatMessage = {
    id: messages.length + 1,
    text: data.text,
  };

  messages.push(newMessage);

  return new Response(JSON.stringify(newMessage), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET() {
  // Return all messages
  return new Response(JSON.stringify(messages), {
    headers: { 'Content-Type': 'application/json' },
  });
}

import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
const plantuml = require('node-plantuml');

export async function POST(req: NextRequest) {
  const { uml } = await req.json();

  try {
    console.log(uml);
    const gen = plantuml.generate({ format: 'png' });

    // Pipe the PlantUML text to the generator
    gen.in.end(uml);

    // Collect the generated PNG data
    let chunks: any[] = [];
    gen.out.on('data', (chunk: any) => chunks.push(chunk));
    gen.out.on('end', async () => {
      const diagramBuffer = Buffer.concat(chunks);

      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from('shared')
        .upload('diagram.png', diagramBuffer, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), {
          status: 400
        });
      }

      const {
        data: { publicUrl }
      } = supabase.storage
        .from('public-bucket')
        .getPublicUrl('folder/avatar1.png');

      return new Response(JSON.stringify({ publicUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  } catch (error) {
    console.error('An error occurred:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

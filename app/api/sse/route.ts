// Filename: pages/api/sse.ts

import type { NextApiRequest, NextApiResponse } from "next";

// This is the handler function for your SSE route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (data: object) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  sendEvent({ message: 'Connection established' });

  const intervalId = setInterval(() => {
    sendEvent({ time: new Date().toISOString() });
  }, 1000);

  // req.on('close', () => {
  //   clearInterval(intervalId);
  //   res.end();
  // });
}

import { VercelRequest, VercelResponse } from '@vercel/node';

export default (req: VercelRequest, res: VercelResponse): void => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  
    // Function to send a message
    const sendEvent = (data: object): void => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
  
    // Send an initial event
    sendEvent({ message: "Connection established" });
  
    // Example: send a message every second
    const intervalId = setInterval(() => {
        sendEvent({ time: new Date().toISOString() });
    }, 1000);
  
    // Close the connection when the client closes the connection
    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
    });
};

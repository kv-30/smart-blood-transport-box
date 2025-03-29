import { WebSocketServer } from 'ws';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { parse } from 'url';

// Create WebSocket server
const wss = new WebSocketServer({ port: 8080 });

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
  const { query } = parse(req.url, true);
  const portName = query.port || 'COM3';

  console.log(`Attempting to connect to ${portName}`);

  const port = new SerialPort({
    path: portName,
    baudRate: 115200
  });

  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

  // Send serial data to client
  parser.on('data', (data) => {
    ws.send(data);
  });

  port.on('error', (err) => {
    console.error('Serial port error:', err);
    ws.send(JSON.stringify({ error: err.message }));
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    port.close();
  });
}); 
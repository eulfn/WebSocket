const WebSocketServer = require('./WebSocketServer');

const wss = new WebSocketServer({ port: 8080 });

wss.on('chat', (ws, payload, server) => {
  // Example: broadcast chat message to all
  server.broadcast('chat', { id: ws.id, message: payload.message });
});

wss.on('ping', (ws, payload) => {
  ws.send(JSON.stringify({ type: 'pong', payload: { time: Date.now() } }));
});

wss.on('join', (ws, payload, server) => {
  server.joinRoom(ws.id, payload.room);
  ws.send(JSON.stringify({ type: 'joined', payload: { room: payload.room } }));
});

wss.on('leave', (ws, payload, server) => {
  server.leaveRoom(ws.id, payload.room);
  ws.send(JSON.stringify({ type: 'left', payload: { room: payload.room } }));
});

console.log('WebSocket server running on ws://localhost:8080'); 
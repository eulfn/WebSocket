const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

class WebSocketServer {
  constructor({ port = 8080, verifyClient, onConnection, onClose, onError } = {}) {
    this.wss = new WebSocket.Server({ port, verifyClient });
    this.clients = new Map(); // id -> ws
    this.rooms = new Map(); // room -> Set of ids
    this.handlers = {};
    this.onConnection = onConnection;
    this.onClose = onClose;
    this.onError = onError;
    this._setup();
  }

  _setup() {
    this.wss.on('connection', (ws, req) => {
      const id = uuidv4();
      ws.id = id;
      this.clients.set(id, ws);
      ws.on('message', (msg) => this._onMessage(ws, msg));
      ws.on('close', (code, reason) => this._onClose(ws, code, reason));
      ws.on('error', (err) => this._onError(ws, err));
      if (this.onConnection) this.onConnection(ws, req);
    });
  }

  _onMessage(ws, msg) {
    let data;
    try {
      data = JSON.parse(msg);
    } catch (e) {
      return ws.send(JSON.stringify({ type: 'error', payload: { message: 'Invalid JSON' } }));
    }
    const { type, payload } = data;
    if (!type || !this.handlers[type]) {
      return ws.send(JSON.stringify({ type: 'error', payload: { message: 'Unsupported message type' } }));
    }
    this.handlers[type](ws, payload, this);
  }

  _onClose(ws, code, reason) {
    this.clients.delete(ws.id);
    for (const [room, ids] of this.rooms.entries()) {
      ids.delete(ws.id);
      if (ids.size === 0) this.rooms.delete(room);
    }
    if (this.onClose) this.onClose(ws, code, reason);
  }

  _onError(ws, err) {
    if (this.onError) this.onError(ws, err);
  }

  on(type, handler) {
    this.handlers[type] = handler;
  }

  broadcast(type, payload, filterFn = null) {
    const msg = JSON.stringify({ type, payload });
    for (const [id, ws] of this.clients.entries()) {
      if (ws.readyState === WebSocket.OPEN && (!filterFn || filterFn(ws))) {
        ws.send(msg);
      }
    }
  }

  sendTo(id, type, payload) {
    const ws = this.clients.get(id);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, payload }));
    }
  }

  joinRoom(id, room) {
    if (!this.rooms.has(room)) this.rooms.set(room, new Set());
    this.rooms.get(room).add(id);
  }

  leaveRoom(id, room) {
    if (this.rooms.has(room)) {
      this.rooms.get(room).delete(id);
      if (this.rooms.get(room).size === 0) this.rooms.delete(room);
    }
  }

  broadcastToRoom(room, type, payload) {
    if (!this.rooms.has(room)) return;
    const msg = JSON.stringify({ type, payload });
    for (const id of this.rooms.get(room)) {
      const ws = this.clients.get(id);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(msg);
      }
    }
  }
}

module.exports = WebSocketServer; 
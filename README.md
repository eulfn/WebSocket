# Modular WebSocket Base Server

This project provides a reusable and extensible WebSocket server base for Node.js using the `ws` library. It supports custom event routing, client tracking, broadcasting, room support, and a structured JSON protocol. A simple HTML client example is included.

## Features
- Custom event routing (define handlers for message types such as `chat`, `ping`, `auth`, etc.)
- Client connection tracking with unique IDs
- Broadcasting to all or selected clients
- Room/channel support
- Extensible design for additional features (authentication, logging, etc.)
- Consistent JSON message protocol
- Basic error handling
- Structure and hooks suitable for production use

## Folder Structure
```
WebSocket/
  src/
    server/
      WebSocketServer.js   # Base server class
      index.js             # Server entry point
    client/
      index.html           # Example frontend client
  README.md
  package.json
```

## Setup Instructions
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the server:**
   ```bash
   node src/server/index.js
   ```
3. **Open the client:**
   Open `src/client/index.html` in your browser.

## Message Format
All messages use a JSON structure:
```json
{
  "type": "chat",
  "payload": {
    "message": "hello"
  }
}
```

## Example Usage
- **Send a chat message:**
  ```json
  { "type": "chat", "payload": { "message": "Wsg!" } }
  ```
- **Ping the server:**
  ```json
  { "type": "ping", "payload": {} }
  ```
- **Join a room:**
  ```json
  { "type": "join", "payload": { "room": "lobby" } }
  ```

## Extending the Server
- Add new event handlers in `src/server/index.js` using `wss.on('eventType', handler)`.
- Use the `WebSocketServer` class to broadcast, send to specific clients, or manage rooms.
- Additional features such as authentication or logging can be integrated via constructor hooks or by extending the class.
- Security checks can be implemented in the `verifyClient` option or within message handlers.

## Security Notes
- Use `verifyClient` for authentication and authorization.
- Validate all incoming message payloads.
- Consider implementing rate limiting and origin checks for production deployments.

---

**Dont Forget Star's!** 
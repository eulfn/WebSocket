# Modular WebSocket Base Server

A reusable, extensible WebSocket server base for Node.js using the `ws` library. Supports custom event routing, client tracking, broadcasting, room support, and a clean JSON protocol. Includes a simple HTML client example.

## Features
- Custom event routing (define handlers for message types like `chat`, `ping`, `auth`, etc.)
- Client connection tracking with unique IDs
- Broadcasting to all or specific clients
- Room/channel support
- Extensible: plug in new features (auth, logging, etc.)
- Clean JSON message protocol
- Basic error handling
- Production-ready structure and security hooks

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
  { "type": "chat", "payload": { "message": "Hello world!" } }
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
- Plug in authentication, logging, or other middleware via constructor hooks or by extending the class.
- Implement security checks in the `verifyClient` option or message handlers.

## Security Notes
- Use `verifyClient` for authentication/authorization.
- Validate all incoming message payloads.
- Consider rate limiting and origin checks for production.

---

**Ready to build scalable, real-time apps!** 
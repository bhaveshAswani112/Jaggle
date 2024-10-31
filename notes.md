# Some points
1. Express App (app): Handles standard HTTP routes and middleware.
2. HTTP Server (server): Allows Socket.IO to work alongside Express by exposing a raw server instance.
3. Socket.IO (io): Uses the HTTP server to establish WebSocket connections for real-time communication.
import express from "express"
import {createServer} from "http"
import {Server as SocketIoServer}  from "socket.io"


const app = express()

const server = createServer(app)

const io = new SocketIoServer(server)

const port = 3000




server.listen(port, () => {
  console.log('Server listening at port %d', port);
});




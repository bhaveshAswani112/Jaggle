import express from "express"
import {createServer} from "http"
import {Socket, Server as SocketIoServer}  from "socket.io"
import { UserManager } from "./managers/UserManager"
import dotenv from "dotenv"


dotenv.config()


const cors_origin = process.env.CORS_ORIGIN || "*"



const app = express()

const server = createServer(app)

const io = new SocketIoServer(server,{
    cors : {
        origin : cors_origin,
        credentials : true,
        allowedHeaders: ["my-custom-header"],
    }
})

const port = 3000

let userManager : UserManager = new UserManager()



io.on("connection" , (socket : Socket) => {
    // console.log("User connected")
    socket.on("sendName" , ({name} : {name : string}) => {
        // console.log("Hello, I am in sendName")
        userManager.addPerson(name,socket)
    })

    socket.on("disconnect" , () => {
    })

    socket.on("disconnectingUser", ({roomId} : {roomId : string}) => {
        userManager.removePerson(socket.id,roomId)
    })
})




server.listen(port, () => {
  userManager = new UserManager()
  console.log(cors_origin)
  console.log('Server listening at port %d', port);
});




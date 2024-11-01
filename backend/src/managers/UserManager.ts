import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";




export interface User {
    name : string;
    socket : Socket
}

export class UserManager {
    private users : User[]
    private queue : string[]
    private roomManager : RoomManager
    constructor() {
        this.users = []
        this.queue = []
        this.roomManager = new RoomManager()
    }
    addPerson(name : string, socket : Socket) {
        // console.log(`${name} in addPerson`)
        this.users.push({
            name,socket
        })
        this.queue.push(socket.id)
        this.clearQueue()
        this.initHandlers(socket)
    }

    removePerson(socketId : string, roomId : string) {
        
        this.users = this.users.filter(user => user.socket.id !== socketId)
        this.queue = this.queue.filter(id => id !== socketId)
        this.roomManager.deleteRoom(roomId)
    }

    initHandlers(socket : Socket) {
        // console.log(`I am in initHandlers`)
        socket.on("offer", ({roomId, sdp} : {roomId : string, sdp : string}) => {
            // console.log("offer received")
            // console.log(roomId)
            this.roomManager.onOffer(roomId.toString(),sdp,socket.id)
        })
        socket.on("answer", ({roomId, sdp} : {roomId : string, sdp : string}) => {
            // console.log("answer received")
            this.roomManager.onAnswer(roomId.toString(),sdp,socket.id)
        })

        socket.on("iceCandidate" , ({candidate, roomId} : {candidate : RTCIceCandidate, roomId : string}) => {
            // console.log("ice candidates recieved")
            this.roomManager.onIceCandidate(roomId.toString(),candidate,socket.id)
        })
    }

    clearQueue() {
        // console.log(`I am in clearQueue`)
        if(this.queue.length<2)return
        const id1 = this.queue.pop()
        const id2 = this.queue.pop()
        const user1 : User | undefined = this.users.find(user => user.socket.id===id1)
        const user2 : User | undefined = this.users.find(user => user.socket.id===id2)
        if(!user1 || !user2)return
        this.roomManager.createRoom(user1,user2)
        this.clearQueue()
    }

    
}
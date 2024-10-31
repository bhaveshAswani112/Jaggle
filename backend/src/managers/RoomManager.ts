import { Socket } from "socket.io";
import { User } from "./UserManager";


interface Room {
    user1 : User;
    user2 : User;
}

let GLOBAL_ID : number = 0 
export class RoomManager {
    
    private room : Map<string,Room>;
    constructor() {
        this.room = new Map<string,Room>()
    }

    createRoom(user1 : User, user2: User) {
        const roomId = this.generate()
        this.room.set(roomId.toString(),{
            user1,
            user2
        })
        user1.socket.emit("sendOffer" , {
            roomId
        })
        user2.socket.emit("sendOffer" , {
            roomId
        })
    }

    generate() {
        return GLOBAL_ID++
    }

    onOffer(roomId : string, sdp : string, senderSocketId : string) {
        const room = this.room.get(roomId)
        // console.log("room details")
        // console.log(room)
        if(!room){
            return
        }
        const receivingUser = room.user1.socket.id===senderSocketId ? room.user2 : room.user1
        // console.log("In On Offer")
        console.log(receivingUser.name)
        
            // console.log("offer send from try block")
            receivingUser.socket.emit("offer" , {
                roomId,
                sdp
        })
    }

    onAnswer(roomId : string, sdp : string, senderSocketId : string) {
        const room = this.room.get(roomId)
        if(!room){
            return 
        }
        const receivingUser = room.user1.socket.id===senderSocketId ? room.user2 : room.user1
        console.log("In On answer")
        console.log(receivingUser.name)
        receivingUser.socket.emit("answer", {
            roomId,
            sdp
        })
    }

    deleteRoom(roomId : string) {
        this.room.delete(roomId)
    }

    onIceCandidate(roomId : string, candidate : RTCIceCandidate, senderSocketId : string) {
        const room  = this.room.get(roomId)
        const receiver  = senderSocketId===room?.user1.socket.id ? room?.user2 : room?.user1
        console.log("ice candidate send")
        receiver?.socket.emit("addIceCandidate", {
            candidate,
            roomId,
            senderSocketId
        })
    }
}
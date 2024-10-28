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
}
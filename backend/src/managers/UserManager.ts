import { Socket } from "socket.io";




export interface User {
    name : string;
    socket : Socket
}

export class UserManager {
    private users : User[]
    private queue : string[]
    constructor() {
        this.users = []
        this.queue = []
    }
    addPerson(name : string, socket : Socket) {
        this.users.push({
            name,socket
        })
        this.queue.push(socket.id)
    }

    removePerson(socketId : string) {
        this.users = this.users.filter(user => user.socket.id!==socketId)
        this.queue = this.queue.filter(id => id !==socketId)
    }

    clearQueue() {
        if(this.queue.length<2)return
        const id1 = this.queue.pop()
        const id2 = this.queue.pop()
        const user1 : User | undefined = this.users.find(user => user.socket.id===id1)
        const user2 : User | undefined = this.users.find(user => user.socket.id===id2)
    }
}
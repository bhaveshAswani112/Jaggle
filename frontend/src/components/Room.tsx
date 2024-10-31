import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

function Room({
    name,
    localVideoTrack,
    localAudioTrack,
}: {
    name: string;
    localVideoTrack: MediaStreamTrack | null;
    localAudioTrack: MediaStreamTrack | null;
}) {
    const [socket, setSocket] = useState<Socket | undefined>(undefined);
    const [lobby, setLobby] = useState(true);
    const [roomId, setRoomId] = useState<string>("");
    const [senderPC, setSenderPC] = useState<RTCPeerConnection | undefined>();
    const [receiverPC, setReceiverPC] = useState<RTCPeerConnection | undefined>();
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const URL = import.meta.env.VITE_SOCKET_URL;
        const socket  = io(URL);
        setSocket(socket);

        // Display local video
        if (localVideoTrack && localVideoRef.current) {
            localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
            localVideoRef.current.play();
        }

        handleSocketOperations(
            socket,
            name,
            setLobby,
            setRoomId,
            setSenderPC,
            setReceiverPC,
            localVideoTrack,
            localAudioTrack,
            remoteVideoRef,
            senderPC,
            receiverPC
        );

        return () => {
            socket?.emit("disconnectingUser", { roomId });
            socket?.disconnect();
        };
    }, [name,localAudioTrack,localVideoTrack]);

    return (
        <div>
            <video ref={localVideoRef} autoPlay muted></video>
            {!lobby ? <video ref={remoteVideoRef} autoPlay></video> : "Waiting for someone to connect..."}
        </div>
    );
}

function handleSocketOperations(
    socket: Socket | undefined,
    name: string,
    setLobby: React.Dispatch<React.SetStateAction<boolean>>,
    setRoomId: React.Dispatch<React.SetStateAction<string>>,
    setSenderPC: React.Dispatch<React.SetStateAction<RTCPeerConnection | undefined>>,
    setReceiverPC: React.Dispatch<React.SetStateAction<RTCPeerConnection | undefined>>,
    localVideoTrack: MediaStreamTrack | null,
    localAudioTrack: MediaStreamTrack | null,
    remoteVideoRef: React.MutableRefObject<HTMLVideoElement | null>,
    senderPC: RTCPeerConnection | undefined,
    receiverPC: RTCPeerConnection | undefined
) {
    console.log("Before handleSocketOperations");
    if (!socket) {
        return;
    }

    console.log("In handleSocketOperations");
    socket.emit("sendName", { name });

    socket.on("sendOffer", async ({ roomId }: { roomId: string }) => {
        setRoomId(roomId);
        const pc = new RTCPeerConnection();
        setSenderPC(pc);

        // Add local tracks to the peer connection
        if (localAudioTrack) pc.addTrack(localAudioTrack);
        if (localVideoTrack) pc.addTrack(localVideoTrack);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("iceCandidate", { candidate: event.candidate, roomId });
            }
        };

        pc.onnegotiationneeded = async () => {
            console.log("negotiation needed")
            try {
                const sdp = await pc.createOffer();
                await pc.setLocalDescription(sdp);
                socket.emit("offer", { sdp: sdp.sdp, roomId });
            } catch (error) {
                console.error("Failed to create offer", error);
            }
        };
    });

    socket.on("offer", async ({ roomId, sdp }: { roomId: string; sdp: string }) => {
        setLobby(false);
        const pc = new RTCPeerConnection();
        await pc.setRemoteDescription({ sdp, type: "offer" });
        // Add ICE candidates for the receiver peer connection
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("iceCandidate", { candidate: event.candidate, roomId });
            }
        };
        const answerSdp = await pc.createAnswer();
        await pc.setLocalDescription(answerSdp);
        const stream : MediaStream = new MediaStream();
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
        }
        setReceiverPC(pc);
        pc.ontrack = ({ track }) => {
            console.log("track received from receiver")
            // if (remoteVideoRef.current) {
            //     console.log("I am adding track")
            //     const stream = remoteVideoRef.current.srcObject as MediaStream || new MediaStream();
            //     stream.addTrack(track);
            //     remoteVideoRef.current.srcObject = stream;
            //     remoteVideoRef.current.play();
            // }
        };
        socket.emit("answer", { sdp: answerSdp.sdp, roomId });
        setTimeout(() => {
            console.log("in the timeout")
            const track1 = pc.getTransceivers()[0].receiver.track
            const track2 = pc.getTransceivers()[1].receiver.track
            // console.log(track1);
            if (track1.kind === "video") {
                stream.addTrack(track2)
                stream.addTrack(track1)
            } 
            else {
                stream.addTrack(track1)
                stream.addTrack(track2)
            }
            if(remoteVideoRef && remoteVideoRef.current){
                console.log("Hello I am in remoteVideoRef")
                remoteVideoRef.current.srcObject = stream
                console.log("I am stream")
                console.log(stream)
                remoteVideoRef.current.play()
            }
        },5000)
    });

    socket.on("answer", async ({ sdp }: { sdp: string }) => {
        setLobby(false);
        setSenderPC((pc) => {
            pc?.setRemoteDescription({ sdp, type: "answer" }).then(() => {
                console.log("Remote description set")
            }).catch(e => {
                console.log("error in setting remote description")
            })
            return pc
        })
        
    });

    socket.on("addIceCandidate", async ({ candidate, senderSocketId }: { candidate: RTCIceCandidateInit, senderSocketId : string }) => {
        console.log("ice candidate received")
        // const pc = senderSocketId===socket.id ? receiverPC : senderPC
        // console.log(pc)
        if(senderSocketId===socket.id ) {
            console.log("pc is available")
            setReceiverPC(pc => {
                console.log(pc)
                pc?.addIceCandidate(new RTCIceCandidate(candidate))
                return pc
            })
        }
        else {
            setSenderPC(pc => {
                console.log(pc)
                pc?.addIceCandidate(new RTCIceCandidate(candidate))
                return pc
            })
        }
    });
}

export default Room;

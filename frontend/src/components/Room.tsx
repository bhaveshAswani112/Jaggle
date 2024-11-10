import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "./ui/button";

function Room({
    name,
    localVideoTrack,
    localAudioTrack,
}: {
    name: string;
    localVideoTrack: MediaStreamTrack | null;
    localAudioTrack: MediaStreamTrack | null;
}) {
    const [_socket, setSocket] = useState<Socket | undefined>(undefined);
    const [lobby, setLobby] = useState(true);
    const [roomId, setRoomId] = useState<string>("");
    const [_senderPC, setSenderPC] = useState<RTCPeerConnection | undefined>();
    const [_receiverPC, setReceiverPC] = useState<RTCPeerConnection | undefined>();
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const [resetRoom,setResetRoom] = useState<Boolean>(false);

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
        );

        return () => {
            socket?.emit("disconnectingUser", { roomId });
            socket?.disconnect();
        };
    }, [name,localAudioTrack,localVideoTrack,resetRoom]);

    function goToNext() {
        setResetRoom(prev => !prev)
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-4xl flex flex-col items-center space-y-4">
                <h1 className="text-2xl font-bold text-gray-800">Welcome to the Room, {name}</h1>

                {/* Container for videos and button */}
                <div className="flex flex-col md:flex-row md:space-x-4 w-full justify-center items-center">
                    {/* Local Video */}
                    <div className="relative w-full md:w-1/2 rounded overflow-hidden bg-gray-200 shadow-md mb-4 md:mb-0">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            className="w-full h-auto rounded-t"
                        ></video>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 text-white text-sm rounded">
                            Your Video
                        </div>
                    </div>

                    {/* Centered Next Button */}
                    {!lobby ? (
                        <Button
                            onClick={goToNext}
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 md:mx-4"
                        >
                            Next
                        </Button>
                    ) : null}

                    {/* Remote Video */}
                    <div className="relative w-full md:w-1/2 rounded overflow-hidden bg-gray-200 shadow-md">
                        {!lobby ? (
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                className="w-full h-auto rounded-t"
                            ></video>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 p-6 text-center">
                                Waiting for someone to connect...
                            </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 text-white text-sm rounded">
                            Remote Video
                        </div>
                    </div>
                </div>
            </div>
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
                console.log(e)
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

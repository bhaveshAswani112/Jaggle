import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Room from "./Room";

function Landing() {
    const [name, setName] = useState<string>("");
    const [joined, setJoined] = useState<boolean>(false);
    const [localVideoTrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);
    const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const getUsersCam = async () => {
        const media: MediaStream = await window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        const audioTrack: MediaStreamTrack = media.getAudioTracks()[0];
        const videoTrack: MediaStreamTrack = media.getVideoTracks()[0];
        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);
        if (!videoRef?.current) {
            return;
        }
        videoRef.current.srcObject = new MediaStream([videoTrack]);
        videoRef.current.play();
    };

    useEffect(() => {
        if (videoRef && videoRef.current) {
            getUsersCam()
                .then(() => {
                    console.log("User's camera opened");
                })
                .catch(error => {
                    console.log("Error in opening user's mike");
                    console.error(error);
                });
        }
    }, [videoRef]);

    if (!joined) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4 p-6">
                <video
                    ref={videoRef}
                    className="w-3/4 max-w-md rounded-md border-2 border-gray-300 shadow-md"
                    autoPlay
                ></video>
                <Input
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-3/4 max-w-md p-2 text-lg rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
                />
                <Button
                    onClick={() => setJoined(true)}
                    className="w-3/4 max-w-md py-2 text-lg font-semibold bg-blue-500 text-white rounded hover:bg-black transition duration-150 "
                >
                    Join
                </Button>
            </div>
        );
    }
    
    return <Room name={name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack} />;
}

export default Landing;

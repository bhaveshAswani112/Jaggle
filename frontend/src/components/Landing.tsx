import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import Room from "./Room"

function Landing() {
    const [name,setName] = useState<string>("")
    const [joined,setJoined] = useState<boolean>(false);
    const [localVideoTrack,setLocalVideoTrack] = useState<MediaStreamTrack | null>(null)
    const [localAudioTrack,setLocalAudioTrack] = useState<MediaStreamTrack | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const getUsersCam = async () => {
        const media : MediaStream = await window.navigator.mediaDevices.getUserMedia({
            video : true,
            audio : true
        })
        const audioTrack : MediaStreamTrack = media.getAudioTracks()[0]
        const videoTrack : MediaStreamTrack = media.getVideoTracks()[0]
        setLocalAudioTrack(audioTrack)
        setLocalVideoTrack(videoTrack)
        if(!videoRef?.current){
            return
        }
        videoRef.current.srcObject = new MediaStream([videoTrack])
        videoRef.current.play()

    }
    useEffect(() => {
        if(videoRef && videoRef.current){
            getUsersCam().then(() => {
                console.log("User's camera opened")
            }).catch(error => {
                console.log("Error in opening user's mike")
                console.error(error)
            })
        }
    },[videoRef])

    if(!joined) {
        return (
            <div>
                <video ref={videoRef}></video>
               <Input onChange={(e) => {
                    setName(e.target.value)
               }} placeholder="Enter your name"/>
               <Button onClick={() => {
                setJoined(true)
               }}>Join</Button>
               
            </div>
        )
    }
    return <Room name={name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack}></Room>
    
}

export default Landing
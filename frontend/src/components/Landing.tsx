import { useState } from "react"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import {Button} from "@/components/ui/button"

function Landing() {
    const [name,setName] = useState<string>("")
    return (
        <div>
           <Input onChange={(e) => {
                setName(e.target.value)
           }} placeholder="Enter your name"/>
           <Button><Link to={`/room/?${name}`}>Join</Link></Button>
           
        </div>
    )
}

export default Landing
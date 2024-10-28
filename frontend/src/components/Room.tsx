import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

function Room() {

    const [name,setName] = useSearchParams()
    useEffect(() => {
        console.log(name)
    },[name])
    return (
        <>
            Hii {name}
        </>
    )
}

export default Room
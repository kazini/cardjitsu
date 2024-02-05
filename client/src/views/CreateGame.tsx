import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
function CreateGame() {
    const [id, setId] = useState();
    const navigate = useNavigate();
    useEffect(()=>{
        //Fetch for a roomID
        fetch("http://localhost:3000/createGame")
        .then(res=>res.json())
        .then(data=>navigate(`/room/${data.id}`));
    }, [navigate])
    return (
    <div className="">
        {id}
    </div>
  )
}

export default CreateGame

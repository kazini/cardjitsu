import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
function CreateGame() {
    const navigate = useNavigate();
    useEffect(()=>{
        //Fetch for a roomID
        fetch("http://localhost:3000/createGame")
        .then(res=>res.json())
        .then(data=>navigate(`/room/${data.id}`));
    }, [navigate])
    return (
    <div className="">
    </div>
  )
}

export default CreateGame
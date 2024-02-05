import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
function Home() {
  const [inputText, setInputText] = useState("");
  const navigate = useNavigate();

  const handleInput = (e : React.ChangeEvent<HTMLInputElement>) =>{
    setInputText(e.target.value);
  }
  const handleJoin = () =>{
    if(inputText.length===6){
      navigate(`/room/${inputText}`);
    }
  }
  return (
    <div className="text-5xl font-semibold text-white min-h-screen flex flex-col gap-4 justify-center items-center">
      <Link to={`/create`}>Create Game</Link>
      <button onClick={handleJoin}>Join Game</button>
      <input className="text-black" value={inputText} onChange={handleInput}></input>
    </div>
  )
}

export default Home

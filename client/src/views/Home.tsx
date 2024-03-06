import { useState } from "react"
import { useNavigate } from "react-router-dom";
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
  const handleCreateGame = async () =>{
    fetch("http://localhost:3000/createGame")
      .then(res=>res.json())
      .then(data=>navigate(`/room/${data.id}`));
  }

  return (
      <div className="h-full flex flex-col gap-4 justify-center items-center font-lilita text-text text-4xl lg:text-6xl text-center">
        <h1 className="font-sniglet text-7xl lg:text-9xl p-4">CARD JITSU</h1>
        <div onClick={handleCreateGame} className="bg-primary rounded-2xl p-4 cursor-pointer">CREATE GAME</div>
        <div onClick={handleJoin} className="bg-primary rounded-2xl p-4 w-[300px] lg:w-[500px] flex flex-col gap-2 justify-center items-center cursor-pointer">
          <h3>JOIN GAME</h3>
          <input className="text-secondary text-center rounded-lg w-full shadow-inner" value={inputText} onChange={handleInput} placeholder="Room ID"></input>
        </div>
        {/* <h3 className="opacity-70 mt-auto">How to Play</h3> */}
      </div>
  )
}

export default Home

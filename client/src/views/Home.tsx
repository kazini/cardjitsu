import { useState } from "react"
import { Link } from "react-router-dom";
function Home() {
  const [inputText, setInputText] = useState("");

  const handleInput = (e : React.ChangeEvent<HTMLInputElement>) =>{
    setInputText(e.target.value);
  }
  
  return (
    <div className="text-5xl font-semibold text-white min-h-screen flex flex-col gap-4 justify-center items-center">
      <Link to={`/room`}>Create Game</Link>
      <Link to={`/room/${inputText}`}>Join Game</Link>
      <input className="text-black" value={inputText} onChange={handleInput}></input>
    </div>
  )
}

export default Home

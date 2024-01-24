import { Link, useParams, useNavigate } from "react-router-dom"
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useState, useEffect, useCallback } from "react";
import { socketMessage } from "../types";
function Home() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [messageHistory, setMessageHistory] = useState<string[]>([]);
    const [inputText, setInputText] = useState<string>("");
    const [playerId, setPlayerId] = useState<string>();
    const [gameId, setGameId] = useState<string>();
    const handleInput = (e : React.ChangeEvent<HTMLInputElement>) =>{
        setInputText(e.target.value);
    }
    const messages = messageHistory.map(msg => (
        <p>{msg}</p>
    ));
    
    const { sendMessage, lastJsonMessage, lastMessage, readyState } = useWebSocket(`ws://localhost:3000${id&&id.length===6 ? "?room=" + id : ""}`);
    const handleClickSendMessage = useCallback(() => sendMessage(inputText), [inputText]);
    useEffect(() => {
        if (lastJsonMessage && Object.keys(lastJsonMessage).length>0) {
            const message = lastJsonMessage as socketMessage;
            if(message.type && message.type==="CONNECT"){
                setPlayerId(message.data.playerId);
                setGameId(message.data.gameId);
            }
        }
    }, [lastJsonMessage]);
    useEffect(()=>{
        if (lastMessage !== null) {
            setMessageHistory((prev) => [...prev, lastMessage.data]);
        }
    }, [lastMessage])
    useEffect(()=>{
        if(gameId){
            // do something
            navigate(gameId);
        }
    }, [gameId])
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
      }[readyState];
    const messageComponent = (
        <div className="flex gap-1 text-black">
            <input value ={inputText} onChange={handleInput}></input>
            <button className="p-1 bg-white rounded-md" onClick={handleClickSendMessage}>Send</button>
        </div>
    )
    return (
      <>
        <Link to={`/`}>Home</Link>
        <div className="flex flex-col gap-3 justify-center items-center text-white text-2xl">
            {gameId && <h1 className="text-blue-300">Player: {playerId}, Room: {gameId}</h1>}
            {connectionStatus}
            {readyState === ReadyState.OPEN && messageComponent}
            {messages}
        </div>
      </>
    )
  }
  
  export default Home
  
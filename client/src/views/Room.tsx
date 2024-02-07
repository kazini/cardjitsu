import { Link, useParams } from "react-router-dom"
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useState, useEffect } from "react";
import { SocketMessage, UpdateMessage } from "../types";
import Game from "../components/Game";
function Home() {
    const {id} = useParams();
    const [gamePhase, setGamePhase] = useState<UpdateMessage | null>(null);
    const [playerId, setPlayerId] = useState<string>("");
    const [gameId, setGameId] = useState<string>();
    
    const { sendMessage, lastJsonMessage, readyState } = useWebSocket(`ws://localhost:3000${id&&id.length===6 ? "?room=" + id : ""}`);

    useEffect(() => {
        if (lastJsonMessage && Object.keys(lastJsonMessage).length>0) {
            const message = lastJsonMessage as SocketMessage;
            if(message.phase && message.phase==="CONNECT"){
                setPlayerId(message.data.playerId);
                setGameId(message.data.gameId);
            }
            else if(message.phase && message.state){
                setGamePhase(message);
            }
            else{
                //potentially handle errors
            }
        }
    }, [lastJsonMessage]);
    
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Connected',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
      }[readyState];

    return (
      <>
        <Link to={`/`}>Home</Link>
        <div className="flex flex-col gap-3 justify-center items-center text-white text-2xl mx-0 px-5">
            {gameId && <h1 className="text-blue-300">Player: {playerId}, Room: {gameId}</h1>}
            {connectionStatus}
            <Game phase={gamePhase} playerId={playerId}/>
        </div>
      </>
    )
  }
  
  export default Home
  
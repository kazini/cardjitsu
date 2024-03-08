import { useParams } from "react-router-dom"
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useState, useEffect, createContext } from "react";
import { SocketMessage, GameState } from "../types";
import Game from "../components/Game";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import Waiting from "../components/Waiting";

type SocketData = {
  sendJsonMessage: SendJsonMessage,
  state: GameState | null,
  playerId: string
  selectIndex: number,
  setSelectIndex: React.Dispatch<React.SetStateAction<number>>
}

export const MessageContext = createContext<undefined | SocketData>(undefined);

function Home() {
    const {id} = useParams();
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [playerId, setPlayerId] = useState<string>("");
    const [selectIndex, setSelectIndex] = useState<number>(-1);
    
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(`ws://localhost:3000${id&&id.length===6 ? "?room=" + id : ""}`);

    useEffect(() => {
        if (lastJsonMessage && Object.keys(lastJsonMessage).length>0) {
            const message = lastJsonMessage as SocketMessage;
            if(message.phase && message.phase==="CONNECT"){
                setPlayerId(message.data.playerId);
                // setGameId(message.data.gameId);
            }
            else if(message.phase){
                setGameState(message);
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
        {/* <NavBar connection={connectionStatus}/> */}
        <MessageContext.Provider value={{
          sendJsonMessage: sendJsonMessage,
          state : gameState,
          playerId: playerId,
          selectIndex: selectIndex,
          setSelectIndex: setSelectIndex,
          }}>
            {gameState && <Game/>}
            {!gameState && <Waiting id={id}/>}
        </MessageContext.Provider>
      </>
    )
  }
  
  export default Home
  
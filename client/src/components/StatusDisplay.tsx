import { useContext, useEffect, useState } from "react";
import { MessageContext } from "../views/Room";
import { GameState } from "../types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function RoundFinishedDisplay({state, playerId}:{state:GameState | null, playerId:string}){
    const [player] = useState(state?.players.find(p=>p.id===playerId));
    useGSAP(()=>{
        if(player){
            gsap.to(`player-card-${state?.selected[player.index]}`, {})
        }
    });
    return(
        <div></div>
    )
}
function PlayStartDisplay({state}:{state:GameState | null}){
    const [time, setTime] = useState((state?.time as number)/1000);
    useEffect(() => {
        const timer = setInterval(()=>{
            if(time && time > 0){
                setTime((prev)=>prev-1);
            }
        }, 1000);
    
        return () => clearInterval(timer);
      }, []);
    return(
        <div className="absolute left-[50%] top-4 -translate-x-[50%] text-center text-black p-5 z-10">
            <h1>{"Time left: " + time}</h1>
        </div>
    )
}
function GameStartDisplay(){
    return(
        <div className="absolute left-[50%] -translate-x-[50%] rounded-lg bg-white text-black">
            <h1>Game Started!</h1>
        </div>
    )
}

function StatusDisplay(){
    // 0 - Game Start, 1 - Round play, 2 - Round finished, 3 - Game Finished
    const [status, setStatus] = useState(-1);
    const socketData = useContext(MessageContext);
    useEffect(()=>{
        if(socketData && socketData.state){
            if(socketData.state.phase==="START"){
                setStatus(0);
            }
            if(socketData.state.phase==="PLAY"){
                setStatus(1);
            }
            if(socketData.state.phase==="RESULT"){
                setStatus(2);
            }
            if(socketData.state.phase==="END"){
                setStatus(3);
            }
        }
    }, [socketData?.state])
    return(
        <>
            {status===0 && <GameStartDisplay/>}
            {status===1 && socketData && <PlayStartDisplay state={socketData.state}/>}
            {status===2 && socketData && <RoundFinishedDisplay state={socketData.state} playerId={socketData.playerId}/>}
        </>
    )
}
export default StatusDisplay
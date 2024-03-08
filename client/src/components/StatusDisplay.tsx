import { useContext, useEffect, useState } from "react";
import { MessageContext } from "../views/Room";
import { Card } from "../types";
import SingleCard from "./SingleCard";
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";

// function RoundFinishedDisplay({state, playerId}:{state:GameState | null, playerId:string}){
//     const [player] = useState(state?.players.find(p=>p.id===playerId));
//     useGSAP(()=>{
//         if(player){
//             gsap.to(`player-card-${state?.selected[player.index]}`, {})
//         }
//     });
//     return(
//         <div></div>
//     )
// }

function PlayStartDisplay(){
    const socketData = useContext(MessageContext);
    const [player] = useState(socketData?.state?.players.find(p=>p.id===socketData.playerId));
    const [time, setTime] = useState((socketData?.state?.time as number)/1000);
    useEffect(() => {
        const timer = setInterval(()=>{
            if(time && time > 0){
                setTime((prev)=>prev-1);
            }
        }, 1000);
    
        return () => clearInterval(timer);
      }, []);
    return(
        <div className="text-text font-lilita text-2xl text-center w-full flex flex-col gap-2 justify-center">
            <div className="flex flex-col items-center">
                <h3>Time Left:</h3>
                <h3>{time}</h3>
            </div>
            <div className="flex flex-col items-center gap-2">
                <h3>Selected:</h3>
                {player && socketData && <SingleCard card={socketData?.state?.cards[player.index][socketData.selectIndex] as Card} index={socketData.selectIndex} selected={true}/>}
            </div>
        </div>
    )
}
function GameStartDisplay(){
    return(
        <div className="text-text font-lilita text-2xl text-center w-full">
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
                socketData.setSelectIndex(-1);
            }
            if(socketData.state.phase==="END"){
                setStatus(3);
            }
        }
    }, [socketData?.state])
    return(
        <>
            {status===0 && <GameStartDisplay/>}
            {status===1 && socketData && <PlayStartDisplay/>}
            {/* {status===2 && socketData && <RoundFinishedDisplay state={socketData.state} playerId={socketData.playerId}/>} */}
        </>
    )
}
export default StatusDisplay
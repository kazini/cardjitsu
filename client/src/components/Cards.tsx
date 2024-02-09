import { useState, useContext } from "react";
import { Card, actionMessage } from "../types";
import { MessageContext } from "../views/Room";

function SingleCard({card, index}: {card:Card, index:number}){
    const socketData = useContext(MessageContext);
    const handleClick = () =>{
        if (socketData?.sendJsonMessage && socketData?.state?.phase==="PLAY"){
            socketData?.sendJsonMessage({
                method: "ACTION",
                selected: index
            } as actionMessage);
        }
    }
    return(
        <div onClick={handleClick} className="flex flex-col items-center justify-center rounded-lg bg-white text-black p-2 w-full outline outline-slate-900 outline-0 hover:outline-4">
            <h1>{card.value}</h1>
            <h1>{card.element}</h1>
            <p className="text-sm">{index}</p>
        </div>
    )
}

function Cards(){
    const socketData = useContext(MessageContext);
    const [player] = useState(socketData?.state?.players.find(p=>p.id===socketData.playerId));

    return(
        <div className="flex flex-row gap-2 max-w-full">
            {player && socketData?.state?.cards[player.index].map((card, index)=><SingleCard card={card} index={index} key={index}/>)}
        </div>
    );
}
export default Cards
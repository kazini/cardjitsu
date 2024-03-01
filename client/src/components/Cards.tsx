import { useState, useContext } from "react";
import { Card, actionMessage } from "../types";
import { MessageContext } from "../views/Room";
import fireURL from "../assets/fire.png";
import waterURL from "../assets/water.png";
import iceURL from "../assets/ice.png";

const imageMap = {
    "FIRE" : fireURL,
    "WATER" : waterURL,
    "ICE" : iceURL,
}

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
        <div onClick={handleClick} className={`player-card-${index} relative flex flex-col items-center justify-center rounded-lg bg-white text-black px-2 py-6 outline outline-slate-900 outline-0 hover:outline-4`}>
            <h2 className="absolute top-1 right-2">{card.value}</h2>
            <h2 className="absolute bottom-1 left-2">{card.value}</h2>
            <img src={imageMap[card.element]} width={150} height={150} alt={card.element}></img>
            {/* <h2>{card.element}</h2> */}
        </div>
    )
}

function Cards(){
    const socketData = useContext(MessageContext);
    const [player] = useState(socketData?.state?.players.find(p=>p.id===socketData.playerId));

    return(
        <div className="flex flex-row justify-center gap-2 max-w-full p-4 justify-self-end">
            {player && socketData?.state?.cards[player.index].map((card, index)=><SingleCard card={card} index={index} key={index}/>)}
        </div>
    );
}
export default Cards
import { useState, useContext } from "react";
import { MessageContext } from "../views/Room";
import SingleCard from "./SingleCard";


function Cards(){
    const socketData = useContext(MessageContext);
    const [player] = useState(socketData?.state?.players.find(p=>p.id===socketData.playerId));

    return(
        <div className="flex flex-row justify-center gap-1 max-w-full p-2 justify-self-end">
            {player && socketData?.state?.cards[player.index].map((card, index)=><SingleCard card={card} index={index} key={index} selected={false}/>)}
        </div>
    );
}
export default Cards
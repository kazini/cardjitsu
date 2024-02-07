import { useState } from "react";
import { GameState } from "../types";

function Play({state, playerId} : {state:GameState, playerId:string}) {
    const [player] = useState(state.players.find(p=>p.id===playerId));
    return(
        <div className="flex flex-row gap-2">
            {player && state.cards[player.index].map(card=>(
                <div className="bg-white rounded-lg flex flex-col text-black p-2">
                    <h1>{card.value}</h1>
                    <h1>{card.element}</h1>
                </div>
            ))}
        </div>
    );
}
export default Play
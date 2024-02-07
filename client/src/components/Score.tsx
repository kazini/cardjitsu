import { useState } from "react";
import { GameState } from "../types";
function Score({state, playerId} : {state:GameState, playerId:string}){
    const [player] = useState(state.players.find(p=>p.id===playerId));
    return(
        <div className="flex flex-row justify-between">
            <div>
                {/* Our personal score first */}
                <div>
                    Fire: {player && state.score[player?.index][0]}
                </div>
                <div>
                    Water: {player && state.score[player?.index][1]}
                </div>
                <div>
                    Ice: {player && state.score[player?.index][2]}
                </div>
            </div>
            <div>
                {/* Opponent's score */}
                <div>
                    Fire: {player && state.score[player?.index == 1 ? 0 : 1][0]}
                </div>
                <div>
                    Water: {player && state.score[player?.index == 1 ? 0 : 1][1]}
                </div>
                <div>
                    Ice: {player && state.score[player?.index == 1 ? 0 : 1][2]}
                </div>
            </div>
        </div>
    )
}
export default Score
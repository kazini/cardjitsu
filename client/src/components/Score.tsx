import { useState, useContext } from "react";
import { MessageContext } from "../views/Room";
function Score(){
    const socketData = useContext(MessageContext);
    const [player] = useState(socketData?.state?.players.find(p=>p.id===socketData.playerId));
    return(
        <div className="flex flex-row justify-between">
            <div>
                {/* Our personal score first */}
                <div>
                    Fire: {player && socketData?.state?.score[player.index][0]}
                </div>
                <div>
                    Water: {player && socketData?.state?.score[player.index][1]}
                </div>
                <div>
                    Ice: {player && socketData?.state?.score[player.index][2]}
                </div>
            </div>
            <div>
                {/* Opponent's score */}
                <div>
                    Fire: {player && socketData?.state?.score[player.index == 1 ? 0 : 1][0]}
                </div>
                <div>
                    Water: {player && socketData?.state?.score[player.index == 1 ? 0 : 1][1]}
                </div>
                <div>
                    Ice: {player && socketData?.state?.score[player.index == 1 ? 0 : 1][2]}
                </div>
            </div>
        </div>
    )
}
export default Score
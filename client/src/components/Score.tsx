import { useState, useContext } from "react";
import { MessageContext } from "../views/Room";
import fireURL from "../assets/fire.png";
import waterURL from "../assets/water.png";
import iceURL from "../assets/ice.png";


function Score(){
    const socketData = useContext(MessageContext);
    const [player] = useState(socketData?.state?.players.find(p=>p.id===socketData.playerId));
    return(
        <div className="flex flex-row justify-between">
            <div>
                {/* Our personal score first */}
                <div className="flex gap-1">
                    <img src={fireURL} width={30}></img>
                    {player && socketData?.state?.score[player.index][0]}
                </div>
                <div className="flex gap-1">
                    <img src={waterURL} width={30}></img>
                    {player && socketData?.state?.score[player.index][1]}
                </div>
                <div className="flex gap-1">
                    <img src={iceURL} width={30}></img>
                    {player && socketData?.state?.score[player.index][2]}
                </div>
            </div>
            <div>
                {/* Opponent's score */}
                <div className="flex gap-1">
                    {player && socketData?.state?.score[player.index == 1 ? 0 : 1][0]}
                    <img src={fireURL} width={30}></img>
                </div>
                <div className="flex gap-1">
                    {player && socketData?.state?.score[player.index == 1 ? 0 : 1][1]}
                    <img src={waterURL} width={30}></img>
                </div>
                <div className="flex gap-1">
                    {player && socketData?.state?.score[player.index == 1 ? 0 : 1][2]}
                    <img src={iceURL} width={30}></img>
                </div>
            </div>
        </div>
    )
}
export default Score
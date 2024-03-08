import { useState, useContext } from "react";
import { MessageContext } from "../views/Room";
import fireURL from "../assets/fire.png";
import waterURL from "../assets/water.png";
import iceURL from "../assets/ice.png";


function Score(){
    const socketData = useContext(MessageContext);
    const [player] = useState(socketData?.state?.players.find(p=>p.id===socketData.playerId));
    return(
        <div className="flex flex-row justify-between w-full p-6 font-lilita text-text text-center text-2xl lg:text-4xl">
            <div className="text-center">
                <h3 className="text-left -mt-2 mb-2">YOU</h3>
                {/* Our personal score first */}
                <div className="flex gap-2 items-center justify-start">
                    <img src={fireURL} className="w-[30px] lg:w-[50px]"></img>
                    <h3 className="w-[30px] lg:w-[50px] text-center">{player && socketData?.state?.score[player.index][0]}</h3>
                </div>
                <div className="flex gap-2 items-center justify-start">
                    <img src={waterURL} className="w-[30px] lg:w-[50px]"></img>
                    <h3 className="w-[30px] lg:w-[50px] text-center">{player && socketData?.state?.score[player.index][1]}</h3>
                </div>
                <div className="flex gap-2 items-center justify-start">
                    <img src={iceURL} className="w-[30px] lg:w-[50px]"></img>
                    <h3 className="w-[30px] lg:w-[50px] text-center">{player && socketData?.state?.score[player.index][2]}</h3>
                </div>
            </div>
            <div>
                <h3 className="text-right -mt-2 mb-2">OPPONENT</h3>
                {/* Opponent's score */}
                <div className="flex gap-2 items-center justify-end">
                    <h3 className="w-[30px] lg:w-[50px] text-center">{player && socketData?.state?.score[player.index == 1 ? 0 : 1][0]}</h3>
                    <img src={fireURL} className="w-[30px] lg:w-[50px]"></img>
                </div>
                <div className="flex gap-2 items-center justify-end">
                    <h3 className="w-[30px] lg:w-[50px] text-center">{player && socketData?.state?.score[player.index == 1 ? 0 : 1][1]}</h3>
                    <img src={waterURL} className="w-[30px] lg:w-[50px]"></img>
                </div>
                <div className="flex gap-2 items-center justify-end">
                    <h3 className="w-[30px] lg:w-[50px] text-center">{player && socketData?.state?.score[player.index == 1 ? 0 : 1][2]}</h3>
                    <img src={iceURL} className="w-[30px] lg:w-[50px]"></img>
                </div>
            </div>
        </div>
    )
}
export default Score
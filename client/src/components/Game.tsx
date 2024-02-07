// import { useEffect } from "react";
import { UpdateMessage } from "../types";
import Cards from "./Cards";
// import Play from "./Play";
import Score from "./Score";

function Game({ phase, playerId }: {phase: UpdateMessage | null, playerId: string}){

    return(
        <div className="w-full">
        {phase && <Score state={phase.state} playerId={playerId}/>}
        {/* {phase?.phase==="PLAY" && <Play state={phase.state} playerId={playerId}/>} */}
        {phase && <Cards state={phase.state} playerId={playerId}/>}
        </div>
    )
}
export default Game;
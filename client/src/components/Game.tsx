// import { useEffect } from "react";
import Cards from "./Cards";
// import Play from "./Play";
import Score from "./Score";
import StatusDisplay from "./StatusDisplay";

function Game(){
    return(
        <div className="flex-1 flex flex-col px-12 justify-between relative h-[95%]">
            <Score />
            <StatusDisplay/>
            {/* {phase?.phase==="PLAY" && <Play state={phase.state} playerId={playerId}/>} */}
            <Cards/>
        </div>
    )
}
export default Game;
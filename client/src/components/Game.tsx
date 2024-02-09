// import { useEffect } from "react";
import Cards from "./Cards";
// import Play from "./Play";
import Score from "./Score";

function Game(){

    return(
        <div className="w-full">
        <Score />
        {/* {phase?.phase==="PLAY" && <Play state={phase.state} playerId={playerId}/>} */}
        <Cards/>
        </div>
    )
}
export default Game;
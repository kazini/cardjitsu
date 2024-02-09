// import { useEffect } from "react";
import { GameState } from "../types";
import Cards from "./Cards";
// import Play from "./Play";
import Score from "./Score";

function Game({ state, playerId }: {state: GameState | null, playerId: string}){

    return(
        <div className="w-full">
        {state && <Score state={state} playerId={playerId}/>}
        {/* {phase?.phase==="PLAY" && <Play state={phase.state} playerId={playerId}/>} */}
        {state && <Cards state={state} playerId={playerId}/>}
        </div>
    )
}
export default Game;
// import { useEffect } from "react";
import Cards from "./Cards";
// import Play from "./Play";
import Score from "./Score";
import StatusDisplay from "./StatusDisplay";

function Game(){
    return(
        <div className="flex-1 flex flex-col justify-between relative h-full">
            <Score />
            <StatusDisplay/>
            <Cards/>
        </div>
    )
}
export default Game;
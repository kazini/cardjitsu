import { forwardRef, useContext } from "react";
import { MessageContext } from "../views/Room";
import { Card, actionMessage } from "../types";
import fireURL from "../assets/fire.png";
import waterURL from "../assets/water.png";
import iceURL from "../assets/ice.png";

const imageMap = {
    "FIRE" : fireURL,
    "WATER" : waterURL,
    "ICE" : iceURL,
}
type props = {
    card:Card, index:number, selected:boolean, attrs?:string
}

const SingleCard = forwardRef<HTMLDivElement, props>( function SingleCard({card, index, selected, attrs}, ref){
    const socketData = useContext(MessageContext);
    const handleClick = () =>{
        if (socketData?.sendJsonMessage && socketData?.state?.phase==="PLAY" && !selected){
            socketData?.sendJsonMessage({
                method: "ACTION",
                selected: index
            } as actionMessage);
            console.log(index);
            socketData.setSelectIndex(index);
        }
    }
    if(index != -1){
        return(
            <div ref={ref} onClick={handleClick} className={`player-card w-[115px] h-[165px] p-3 relative flex flex-col items-center justify-center rounded-lg bg-text ${selected ? "outline outline-6 outline-secondary" : "outline-0"}`}>
                <div className={`opacity-0 ${attrs} absolute w-full h-full rounded-lg z-30 bg-primary`}></div>
                <h2 className="absolute top-1 right-2 text-center font-lilita text-primary text-3xl">{card.value}</h2>
                <img src={imageMap[card.element]} width={150} height={150} alt={card.element}></img>
                {/* <h2>{card.element}</h2> */}
            </div>
        )
    }
    else{
        return(
            <div className={`w-[115px] h-[165px] p-3 relative flex flex-col items-center justify-center rounded-lg bg-primary outline outline-6 outline-secondary`}>
                {/* <h2>{card.element}</h2> */}
            </div>
        )
    }

});
export default SingleCard;
import { GameState } from "../types";
import { generateNewCard, generateNewDeck, checkRoundWon, checkGameWon } from "./utils"
import { WebSocket } from "ws";

export const handleGameStarted = (roomID: string, games:Map<string, GameState>) :void =>{
    const players = games.get(roomID).players;
    games.get(roomID).winner =null;
    games.get(roomID).score = [[0, 0, 0], [0, 0, 0]];
    games.get(roomID).cards[0] = generateNewDeck();
    games.get(roomID).cards[1] = generateNewDeck();
    games.get(roomID).selected = [null, null];
    games.get(roomID).roundWinner = null;
    games.get(roomID).phase = 'PLAY';
}
export const handlePlayRound = (roomID: string, games:Map<string, GameState>) :void =>{
    //Nothing really happens here
    games.get(roomID).cards[0].splice(games.get(roomID).selected[0] | 0, 1);
    games.get(roomID).cards[1].splice(games.get(roomID).selected[1] | 0, 1);
    games.get(roomID).cards[0].push(generateNewCard());
    games.get(roomID).cards[1].push(generateNewCard());
    games.get(roomID).winner = null;
    games.get(roomID).roundWinner = null;
    games.get(roomID).selected = [null, null];
    games.get(roomID).phase='PLAY';
}
export const handlePlayFinished = (roomID: string, games:Map<string, GameState>) :void =>{
    const card1 = games.get(roomID).cards[0][games.get(roomID).selected[0] | 0];
    const card2 = games.get(roomID).cards[1][games.get(roomID).selected[1] | 0];
    //Check who won that round
    const winnerIndex = checkRoundWon(card1, card2, roomID, games);
    //Check if someone won whole game
    const win = checkGameWon(roomID, games);
    if(win!==-1){
        //Somebody won
        games.get(roomID).winner = win === games.get(roomID).players[0].index ? games.get(roomID).players[0].id : games.get(roomID).players[1].id;
        games.get(roomID).phase='END';
        return;
    }
    if(winnerIndex===games.get(roomID).players[0].index){
        games.get(roomID).roundWinner = games.get(roomID).players[0].id;
    }
    else{
        games.get(roomID).roundWinner = games.get(roomID).players[1].id;
    }
    games.get(roomID).phase='RESULT';
}

export const gameLoop = (roomID : string, games:Map<string, GameState>, clients:Map<string, WebSocket>) =>{
    let interval:number;
    if(!games.has(roomID)){
        return;
    }
    if(games.get(roomID).players.length<2){
        //If someone disconnected, just end game
        games.get(roomID).phase="END";
    }
    if(games.get(roomID).phase==="START"){
        //Handle Game Start
        handleGameStarted(roomID, games);
        interval = 10000;
    }
    else if(games.get(roomID).phase==="PLAY"){
        handlePlayFinished(roomID, games);
        interval = 6000;
    }
    else if(games.get(roomID).phase==="RESULT"){
        handlePlayRound(roomID, games);
        interval=10000;
    }
    games.get(roomID).time = interval;
    for(let i = 0; i< games.get(roomID).players.length; i++){
        clients.get((games.get(roomID).players[i].id)).send(JSON.stringify(games.get(roomID)));
    }
    if(games.get(roomID).phase!=="END"){
        setTimeout(()=> gameLoop(roomID, games, clients), interval);
    }
    else{
        //close their connections out
        for(let i = 0; i< games.get(roomID).players.length; i++){
            clients.get((games.get(roomID).players[i].id)).close();
        }
    }
};
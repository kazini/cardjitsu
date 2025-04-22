import { Element, Card, GameState } from "../types"
import crypto from "crypto"
import { WebSocket } from "ws"

export const createNewGameState = (): GameState =>{
    return {
        phase: "START",
        time: 0,
        players: [],
        winner: null,
        score: [[], []],
        cards: [[], []],
        selected: [null, null],
        roundWinner: null,
    }
}
export const generateNewCard = (): Card =>{
    const elements = ["FIRE", "WATER", "ICE"];
    const element = elements[crypto.randomInt(0, 3)];
    const value = crypto.randomInt(1, 11);
    return {
        element: element as Element,
        value: value,
    }
}
export const generateNewDeck = (): Card[] =>{
    const numCards = 4;
    const deck: Card[] = [];
    for(let i = 0; i<numCards; i++){
        const card = generateNewCard();
        deck.push(card);
    }
    return deck;
}
export const checkRoundWon = (card1:Card, card2:Card, roomID:string, games:Map<string, GameState>): number =>{
    if(card1.element === card2.element){
        if(card1.value>card2.value){
            if(card1.element==="FIRE"){
                games.get(roomID).score[0][0]++;
            }
            else if(card1.element==="WATER"){
                games.get(roomID).score[0][1]++;
            }
            else if(card1.element==="ICE"){
                games.get(roomID).score[0][2]++;
            }
            return 0;
        }
        else if(card1.value<card2.value){
            if(card2.element==="FIRE"){
                games.get(roomID).score[1][0]++;
            }
            else if(card2.element==="WATER"){
                games.get(roomID).score[1][1]++;
            }
            else if(card2.element==="ICE"){
                games.get(roomID).score[1][2]++;
            }
            return 1;
        }
		else if(card1.value===card2.value){
			return -1;
		}
    }
    else{
        if(card1.element==="FIRE" && card2.element==="ICE"){
            games.get(roomID).score[0][0]++;
            return 0;
        }
        else if (card1.element==="WATER" && card2.element==="FIRE"){
            games.get(roomID).score[0][1]++;
            return 0;
        }
        else if (card1.element==="ICE" && card2.element==="WATER"){
            games.get(roomID).score[0][2]++;
            return 0;
        }
        else if(card2.element==="FIRE" && card1.element==="ICE"){
            games.get(roomID).score[1][0]++;
            return 1;
        }
        else if (card2.element==="WATER" && card1.element==="FIRE"){
            games.get(roomID).score[1][1]++;
            return 1;
        }
        else if (card2.element==="ICE" && card1.element==="WATER"){
            games.get(roomID).score[1][2]++;
            return 1;
        }
    }
}
export const checkGameWon = (roomID: string, games:Map<string, GameState>):number=>{

    const scores = games.get(roomID).score;
    if(scores[0][0]=== 3 || scores[0][1]=== 3 || scores[0][2]===3 || (scores[0][0]>=1 && scores[0][1]>=1 && scores[0][2]>=1)){
        return 0;
    }
    else if(scores[1][0]=== 3 || scores[1][1]=== 3 || scores[1][2]===3 || (scores[1][0]>=1 && scores[1][1]>=1 && scores[1][2]>=1)){
        return 1;
    }
    else{
        return -1;
    }
}

export const handleLeave = (clientID:string, roomID: string, games:Map<string, GameState>, clients:Map<string, WebSocket>) =>{
    let index: number;
    for (let i=0;i<games.get(roomID).players.length;i++){
        if(games.get(roomID).players[i].id===clientID){
            index = i;
        }
    }
    if(index===0){
        games.get(roomID).players.shift();
    }
    else if(index===1){
        games.get(roomID).players.pop();
    }
    if(games.get(roomID).players.length===0){
        //If everyone left, delete the game from memory
        games.delete(roomID);
    }
    clients.delete(clientID);
}

export const handleAction = (clientID:string, roomID:string, index:number, games:Map<string, GameState>) =>{
    const playerIndex = games.get(roomID).players[0].id === clientID ? 0 : 1;
    games.get(roomID).selected[playerIndex] = index;
}
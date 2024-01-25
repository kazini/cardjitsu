import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import {v4 as uuidv4} from 'uuid';
import crypto from "crypto"
import uuidBase62 from "uuid-base62"

const PORT = process.env.PORT || 3000;
const app = express();

const onSocketPreError = (e:Error):void =>{
    console.log(e);
}

app.get('/', (req, res)=>{
    res.send("Welcome to my API");
});

const server = app.listen(PORT, ()=>{
    console.log(`Listening on port: ${PORT}`);
});

type Player = {
    id: string,
    index: number,
} 

type connectionPayloadMessage = {
    phase: "CONNECT",
    data: {
        playerId: string,
        gameId: string
    }
}
type Element = "FIRE" | "WATER" | "ICE";

type Card = {
    element: Element,
    value: number,
}


type GameState = {
    players: Player[],
    winner: null | string,
    score: Array<Array<number>>,
    cards: Array<Array<Card>>,
    selected: Array<number | null>,
    roundWinner: string | null,
}

type updateMessage = {
    phase: "START" | "END" | "PLAY" | "RESULT",
    state: GameState
}

const wss = new WebSocketServer({noServer: true});
const clients = new Map<string, WebSocket>();
const games = new Map<string, GameState>();
const createNewGameState = (): GameState =>{
    return {
        players: [],
        winner: null,
        score: [[], []],
        cards: [[], []],
        selected: [null, null],
        roundWinner: null,
    }
}
const generateNewCard = (): Card =>{
    const elements = ["FIRE", "WATER", "ICE"];
    const element = elements[crypto.randomInt(0, 3)];
    const value = crypto.randomInt(1, 11);
    return {
        element: element as Element,
        value: value,
    }
}
const generateNewDeck = (): Card[] =>{
    const numCards = 10;
    const deck: Card[] = [];
    for(let i = 0; i<numCards; i++){
        const card = generateNewCard();
        deck.push(card);
    }
    return deck;
}
const checkRoundWon = (card1:Card, card2:Card, roomID:string): number =>{
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
        else{
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
const checkGameWon = (roomID: string):number=>{

    const scores = games.get(roomID).score;
    if(scores[0][0]=== 3 || scores[0][1]=== 3 || scores[0][2]===3 || (scores[0][0]===1 && scores[0][1]===1 && scores[0][2]===1)){
        return 0;
    }
    else if(scores[1][0]=== 3 || scores[1][1]=== 3 || scores[1][2]===3 || (scores[1][0]===1 && scores[1][1]===1 && scores[1][2]===1)){
        return 1;
    }
    else{
        return -1;
    }
}

const handleGameStarted = (roomID: string, message: updateMessage) :void =>{
    const players = games.get(roomID).players;
    games.get(roomID).winner =null;
    games.get(roomID).score = [[0, 0, 0], [0, 0, 0]];
    games.get(roomID).cards[0] = generateNewDeck();
    games.get(roomID).cards[1] = generateNewDeck();
    games.get(roomID).selected = [null, null];
    games.get(roomID).roundWinner = null;
    message.phase = 'PLAY';
    message.state = games.get(roomID);
}
const handlePlayRound = (roomID: string, message: updateMessage) :void =>{
    //Nothing really happens here
    games.get(roomID).winner = null;
    games.get(roomID).roundWinner = null;
    games.get(roomID).selected = [null, null];
    message.phase='PLAY';
    message.state=games.get(roomID);
}
const handlePlayFinished = (roomID: string, message: updateMessage) :void =>{
    const card1 = games.get(roomID).cards[0][games.get(roomID).selected[0] | 0];
    const card2 = games.get(roomID).cards[1][games.get(roomID).selected[1] | 0];
    //Check who won that round
    const winnerIndex = checkRoundWon(card1, card2, roomID);
    //Check if someone won whole game
    const win = checkGameWon(roomID);
    if(win!==-1){
        //Somebody won
        games.get(roomID).winner = win === games.get(roomID).players[0].index ? games.get(roomID).players[0].id : games.get(roomID).players[1].id;
        message.phase='END';
        message.state=games.get(roomID);
        return;
    }
    games.get(roomID).cards[0].splice(games.get(roomID).selected[0] | 0, 1);
    games.get(roomID).cards[1].splice(games.get(roomID).selected[1] | 0, 1);
    games.get(roomID).cards[0].push(generateNewCard());
    games.get(roomID).cards[1].push(generateNewCard());
    if(winnerIndex===games.get(roomID).players[0].index){
        games.get(roomID).roundWinner = games.get(roomID).players[0].id;
    }
    else{
        games.get(roomID).roundWinner = games.get(roomID).players[1].id;
    }
    message.phase='RESULT';
    message.state=games.get(roomID);
}

const gameLoop = (roomID : string, message : updateMessage) =>{
    let interval:number;
    if(games.get(roomID).players.length<2){
        //If someone disconnected, just end game
        message.phase="END";
    }
    if(message.phase==="START"){
        //Handle Game Start
        handleGameStarted(roomID, message);
        interval = 5000;
    }
    else if(message.phase==="PLAY"){
        handlePlayFinished(roomID, message);
        interval = 2000;
    }
    else if(message.phase==="RESULT"){
        handlePlayRound(roomID, message);
        interval=5000;
    }
    for(let i = 0; i< games.get(roomID).players.length; i++){
        clients.get((games.get(roomID).players[i].id)).send(JSON.stringify(message));
    }
    if(message.phase!=="END"){
        setTimeout(()=> gameLoop(roomID, message), interval);
    }
    else{
        //close their connections out
    }
};

const handleLeave = (clientID:string, roomID: string) =>{
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

server.on('upgrade', (req, socket, head)=>{
    socket.on('error', onSocketPreError);
    wss.handleUpgrade(req, socket, head, (ws)=>{
        socket.removeListener('error', onSocketPreError);
        wss.emit('connection', ws, req);
    });
});

wss.on('connection', (ws, req)=>{
    let roomID : string;
    let clientID : string;
    if(req.url && req.url!=='/'){
        //Has a game room
        roomID = req.url.replace("/?room=", '');
    }
    else{
        //No game room, make a new room!
        //roomID = crypto.randomBytes(4).toString('base64').replace("==", "");
        roomID = uuidBase62.v4().slice(0, 6);
        while(games.has(roomID)){
            //roomID = crypto.randomBytes(4).toString('base64').replace("==", "");
            roomID = uuidBase62.v4().slice(0, 6);
        }
    }
    if(games.get(roomID) && games.get(roomID).players.length>1){
        //Game room is already full, can't let them join!
        ws.send("Game Room Full!");
        ws.close();
    }
    else{
        clientID = uuidv4();
        clients.set(clientID, ws);
        const connectionPayload: connectionPayloadMessage = {
            "phase":"CONNECT",
            "data":{
                "playerId":clientID,
                "gameId":roomID
            }
        } 
        ws.send(JSON.stringify(connectionPayload));
        if(games.get(roomID)){
            games.get(roomID).players.push({id:clientID, index: 1});
            if(games.get(roomID).players.length === 2){
                //Start the game loop!
                const startMessage: updateMessage = {
                    "phase" : "START",
                    "state" : games.get(roomID) 
                }
                setTimeout(() => gameLoop(roomID, startMessage), 1000);
            }
        }
        else{
            const newGameState = createNewGameState();
            newGameState.players.push({id:clientID, index: 0});
            games.set(roomID, newGameState);
        }
    }

    ws.on('error', (error)=>{
        console.log(error);
        handleLeave(clientID, roomID);
        ws.close();
    });
    ws.on('close', (code, reason)=>{
        handleLeave(clientID, roomID);
        console.log("Connection closed");
        console.log(`Games in session: ${games.size}`);
    });
    ws.on('message', (msg, isBinary)=>{
        const currTime = new Date();
        games.get(roomID).players.forEach((p)=>{
            clients.get(p.id).send(`[${currTime.getHours().toString()}:${currTime.getMinutes().toString()}] ${clientID}: ` +msg.toString());
        });
    });
})
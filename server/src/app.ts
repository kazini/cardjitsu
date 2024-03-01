import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import {v4 as uuidv4} from 'uuid';
import uuidBase62 from "uuid-base62";
import cors from "cors";
import { ConnectionPayloadMessage, GameState, ActionMessage } from "./types";
import { createNewGameState, handleLeave, handleAction } from "./GameLogic/utils";
import { gameLoop } from "./GameLogic/loop";

const PORT = process.env.PORT || 3000;
const app = express();
const wss = new WebSocketServer({noServer: true});
const clients = new Map<string, WebSocket>();
const games = new Map<string, GameState>();

const onSocketPreError = (e:Error):void =>{
    console.log(e);
}

app.use(cors({
    origin: '*'
}))

app.get('/', (req, res)=>{
    res.send("Welcome to my API");
});

app.get('/createGame', (req, res)=>{
    let roomID = uuidBase62.v4().slice(0, 6);
    while(games.has(roomID)){
        roomID = uuidBase62.v4().slice(0, 6);
    }
    res.status(200).send({
        id: roomID
    });
});

const server = app.listen(PORT, ()=>{
    console.log(`Listening on port: ${PORT}`);
});

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
        roomID = uuidBase62.v4().slice(0, 6);
        while(games.has(roomID)){
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
        const connectionPayload: ConnectionPayloadMessage = {
            phase:"CONNECT",
            data:{
                playerId:clientID,
                gameId:roomID
            }
        } 
        ws.send(JSON.stringify(connectionPayload));
        if(games.get(roomID)){
            games.get(roomID).players.push({id:clientID, index: 1});
            if(games.get(roomID).players.length === 2){
                //Start the game loop!
                //const startMessage: GameState = games.get(roomID);
                for(let i = 0; i< games.get(roomID).players.length; i++){
                    clients.get((games.get(roomID).players[i].id)).send(JSON.stringify(games.get(roomID)));
                }
                console.log("Game Started");
                console.log(`Games in session: ${games.size}`);
                setTimeout(() => gameLoop(roomID, games, clients), 1000);
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
        handleLeave(clientID, roomID, games, clients);
        ws.close();
    });
    ws.on('close', (code, reason)=>{
        handleLeave(clientID, roomID, games, clients);
        console.log("Connection closed");
        console.log(`Games in session: ${games.size}`);
    });
    ws.on('message', (msg, isBinary)=>{
        const data: ActionMessage = JSON.parse(msg.toString())
        handleAction(clientID, roomID, data.selected, games);
    });
})
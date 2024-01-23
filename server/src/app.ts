import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import {v4 as uuidv4} from 'uuid';
import crypto from "crypto"

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
    socket: WebSocket
}

type GameState = {
    players: Player[],
}

const wss = new WebSocketServer({noServer: true});
const clients = new Map<string, WebSocket>();
const games = new Map<string, GameState>();
const gameLoop = (roomID : string) =>{
    console.log(roomID);
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
        roomID = crypto.randomBytes(4).toString('base64').replace("==", "");
    }
    if(games.get(roomID) && games.get(roomID).players.length>1){
        //Game room is already full, can't let them join!
        ws.send("Game Room Full!");
        ws.close();
    }
    else{
        clientID = uuidv4();
        clients.set(clientID, ws);
        if(games.get(roomID)){
            games.get(roomID).players.push({id:clientID, socket:ws});
            if(games.get(roomID).players.length === 2){
                //Start the game loop!
                setTimeout(() => gameLoop(roomID), 10000);
            }
        }
        else{
            const newGameState = {
                players : [{id: clientID, socket: ws}] 
            }
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
            p.socket.send(`[${currTime.getHours().toString()}:${currTime.getMinutes().toString()}] ${clientID}: ` +msg.toString());
        });
    });
})
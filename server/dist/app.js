"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const uuid_1 = require("uuid");
const uuid_base62_1 = __importDefault(require("uuid-base62"));
const cors_1 = __importDefault(require("cors"));
const utils_1 = require("./GameLogic/utils");
const loop_1 = require("./GameLogic/loop");
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
const wss = new ws_1.WebSocketServer({ noServer: true });
const clients = new Map();
const games = new Map();
const onSocketPreError = (e) => {
    console.log(e);
};
app.use((0, cors_1.default)({
    origin: '*'
}));
app.get('/', (req, res) => {
    res.send("Welcome to my API");
});
app.get('/createGame', (req, res) => {
    let roomID = uuid_base62_1.default.v4().slice(0, 6);
    while (games.has(roomID)) {
        roomID = uuid_base62_1.default.v4().slice(0, 6);
    }
    res.status(200).send({
        id: roomID
    });
});
const server = app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
server.on('upgrade', (req, socket, head) => {
    socket.on('error', onSocketPreError);
    wss.handleUpgrade(req, socket, head, (ws) => {
        socket.removeListener('error', onSocketPreError);
        wss.emit('connection', ws, req);
    });
});
wss.on('connection', (ws, req) => {
    let roomID;
    let clientID;
    if (req.url && req.url !== '/') {
        //Has a game room
        roomID = req.url.replace("/?room=", '');
    }
    else {
        //No game room, make a new room!
        roomID = uuid_base62_1.default.v4().slice(0, 6);
        while (games.has(roomID)) {
            roomID = uuid_base62_1.default.v4().slice(0, 6);
        }
    }
    if (games.get(roomID) && games.get(roomID).players.length > 1) {
        //Game room is already full, can't let them join!
        ws.send("Game Room Full!");
        ws.close();
    }
    else {
        clientID = (0, uuid_1.v4)();
        clients.set(clientID, ws);
        const connectionPayload = {
            phase: "CONNECT",
            data: {
                playerId: clientID,
                gameId: roomID
            }
        };
        ws.send(JSON.stringify(connectionPayload));
        if (games.get(roomID)) {
            games.get(roomID).players.push({ id: clientID, index: 1 });
            if (games.get(roomID).players.length === 2) {
                //Start the game loop!
                //const startMessage: GameState = games.get(roomID);
                for (let i = 0; i < games.get(roomID).players.length; i++) {
                    clients.get((games.get(roomID).players[i].id)).send(JSON.stringify(games.get(roomID)));
                }
                console.log("Game Started");
                console.log(`Games in session: ${games.size}`);
                setTimeout(() => (0, loop_1.gameLoop)(roomID, games, clients), 4000);
            }
        }
        else {
            const newGameState = (0, utils_1.createNewGameState)();
            newGameState.players.push({ id: clientID, index: 0 });
            games.set(roomID, newGameState);
        }
    }
    ws.on('error', (error) => {
        console.log(error);
        (0, utils_1.handleLeave)(clientID, roomID, games, clients);
        ws.close();
    });
    ws.on('close', (code, reason) => {
        (0, utils_1.handleLeave)(clientID, roomID, games, clients);
        console.log("Connection closed");
        console.log(`Games in session: ${games.size}`);
    });
    ws.on('message', (msg, isBinary) => {
        const data = JSON.parse(msg.toString());
        (0, utils_1.handleAction)(clientID, roomID, data.selected, games);
    });
});
//# sourceMappingURL=app.js.map
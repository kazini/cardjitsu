"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameLoop = exports.handlePlayFinished = exports.handlePlayRound = exports.handleGameStarted = void 0;
const utils_1 = require("./utils");
const handleGameStarted = (roomID, games) => {
    const players = games.get(roomID).players;
    games.get(roomID).winner = null;
    games.get(roomID).score = [[0, 0, 0], [0, 0, 0]];
    games.get(roomID).cards[0] = (0, utils_1.generateNewDeck)();
    games.get(roomID).cards[1] = (0, utils_1.generateNewDeck)();
    games.get(roomID).selected = [null, null];
    games.get(roomID).roundWinner = null;
    games.get(roomID).phase = 'PLAY';
};
exports.handleGameStarted = handleGameStarted;
const handlePlayRound = (roomID, games) => {
    //Nothing really happens here
    games.get(roomID).cards[0].splice(games.get(roomID).selected[0] | 0, 1);
    games.get(roomID).cards[1].splice(games.get(roomID).selected[1] | 0, 1);
    games.get(roomID).cards[0].push((0, utils_1.generateNewCard)());
    games.get(roomID).cards[1].push((0, utils_1.generateNewCard)());
    games.get(roomID).winner = null;
    games.get(roomID).roundWinner = null;
    games.get(roomID).selected = [null, null];
    games.get(roomID).phase = 'PLAY';
};
exports.handlePlayRound = handlePlayRound;
const handlePlayFinished = (roomID, games) => {
    const card1 = games.get(roomID).cards[0][games.get(roomID).selected[0] | 0];
    const card2 = games.get(roomID).cards[1][games.get(roomID).selected[1] | 0];
    //Check who won that round
    const winnerIndex = (0, utils_1.checkRoundWon)(card1, card2, roomID, games);
    //Check if someone won whole game
    const win = (0, utils_1.checkGameWon)(roomID, games);
    if (win !== -1) {
        //Somebody won
        games.get(roomID).winner = win === games.get(roomID).players[0].index ? games.get(roomID).players[0].id : games.get(roomID).players[1].id;
        games.get(roomID).phase = 'END';
        return;
    }
    if (winnerIndex === games.get(roomID).players[0].index) {
        games.get(roomID).roundWinner = games.get(roomID).players[0].id;
    }
    else {
        games.get(roomID).roundWinner = games.get(roomID).players[1].id;
    }
    games.get(roomID).phase = 'RESULT';
};
exports.handlePlayFinished = handlePlayFinished;
const gameLoop = (roomID, games, clients) => {
    let interval;
    if (!games.has(roomID)) {
        return;
    }
    if (games.get(roomID).players.length < 2) {
        //If someone disconnected, just end game
        games.get(roomID).phase = "END";
    }
    if (games.get(roomID).phase === "START") {
        //Handle Game Start
        (0, exports.handleGameStarted)(roomID, games);
        interval = 10000;
    }
    else if (games.get(roomID).phase === "PLAY") {
        (0, exports.handlePlayFinished)(roomID, games);
        interval = 6000;
    }
    else if (games.get(roomID).phase === "RESULT") {
        (0, exports.handlePlayRound)(roomID, games);
        interval = 10000;
    }
    games.get(roomID).time = interval;
    for (let i = 0; i < games.get(roomID).players.length; i++) {
        clients.get((games.get(roomID).players[i].id)).send(JSON.stringify(games.get(roomID)));
    }
    if (games.get(roomID).phase !== "END") {
        setTimeout(() => (0, exports.gameLoop)(roomID, games, clients), interval);
    }
    else {
        //close their connections out
        for (let i = 0; i < games.get(roomID).players.length; i++) {
            clients.get((games.get(roomID).players[i].id)).close();
        }
    }
};
exports.gameLoop = gameLoop;
//# sourceMappingURL=loop.js.map
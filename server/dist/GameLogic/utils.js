"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAction = exports.handleLeave = exports.checkGameWon = exports.checkRoundWon = exports.generateNewDeck = exports.generateNewCard = exports.createNewGameState = void 0;
const crypto_1 = __importDefault(require("crypto"));
const createNewGameState = () => {
    return {
        phase: "START",
        time: 0,
        players: [],
        winner: null,
        score: [[], []],
        cards: [[], []],
        selected: [null, null],
        roundWinner: null,
    };
};
exports.createNewGameState = createNewGameState;
const generateNewCard = () => {
    const elements = ["FIRE", "WATER", "ICE"];
    const element = elements[crypto_1.default.randomInt(0, 3)];
    const value = crypto_1.default.randomInt(1, 11);
    return {
        element: element,
        value: value,
    };
};
exports.generateNewCard = generateNewCard;
const generateNewDeck = () => {
    const numCards = 4;
    const deck = [];
    for (let i = 0; i < numCards; i++) {
        const card = (0, exports.generateNewCard)();
        deck.push(card);
    }
    return deck;
};
exports.generateNewDeck = generateNewDeck;
const checkRoundWon = (card1, card2, roomID, games) => {
    if (card1.element === card2.element) {
        if (card1.value > card2.value) {
            if (card1.element === "FIRE") {
                games.get(roomID).score[0][0]++;
            }
            else if (card1.element === "WATER") {
                games.get(roomID).score[0][1]++;
            }
            else if (card1.element === "ICE") {
                games.get(roomID).score[0][2]++;
            }
            return 0;
        }
        else if (card1.value < card2.value) {
            if (card2.element === "FIRE") {
                games.get(roomID).score[1][0]++;
            }
            else if (card2.element === "WATER") {
                games.get(roomID).score[1][1]++;
            }
            else if (card2.element === "ICE") {
                games.get(roomID).score[1][2]++;
            }
            return 1;
        }
        else if (card1.value === card2.value) {
            return -1;
        }
    }
    else {
        if (card1.element === "FIRE" && card2.element === "ICE") {
            games.get(roomID).score[0][0]++;
            return 0;
        }
        else if (card1.element === "WATER" && card2.element === "FIRE") {
            games.get(roomID).score[0][1]++;
            return 0;
        }
        else if (card1.element === "ICE" && card2.element === "WATER") {
            games.get(roomID).score[0][2]++;
            return 0;
        }
        else if (card2.element === "FIRE" && card1.element === "ICE") {
            games.get(roomID).score[1][0]++;
            return 1;
        }
        else if (card2.element === "WATER" && card1.element === "FIRE") {
            games.get(roomID).score[1][1]++;
            return 1;
        }
        else if (card2.element === "ICE" && card1.element === "WATER") {
            games.get(roomID).score[1][2]++;
            return 1;
        }
    }
};
exports.checkRoundWon = checkRoundWon;
const checkGameWon = (roomID, games) => {
    const scores = games.get(roomID).score;
    if (scores[0][0] === 3 || scores[0][1] === 3 || scores[0][2] === 3 || (scores[0][0] >= 1 && scores[0][1] >= 1 && scores[0][2] >= 1)) {
        return 0;
    }
    else if (scores[1][0] === 3 || scores[1][1] === 3 || scores[1][2] === 3 || (scores[1][0] >= 1 && scores[1][1] >= 1 && scores[1][2] >= 1)) {
        return 1;
    }
    else {
        return -1;
    }
};
exports.checkGameWon = checkGameWon;
const handleLeave = (clientID, roomID, games, clients) => {
    let index;
    for (let i = 0; i < games.get(roomID).players.length; i++) {
        if (games.get(roomID).players[i].id === clientID) {
            index = i;
        }
    }
    if (index === 0) {
        games.get(roomID).players.shift();
    }
    else if (index === 1) {
        games.get(roomID).players.pop();
    }
    if (games.get(roomID).players.length === 0) {
        //If everyone left, delete the game from memory
        games.delete(roomID);
    }
    clients.delete(clientID);
};
exports.handleLeave = handleLeave;
const handleAction = (clientID, roomID, index, games) => {
    const playerIndex = games.get(roomID).players[0].id === clientID ? 0 : 1;
    games.get(roomID).selected[playerIndex] = index;
};
exports.handleAction = handleAction;
//# sourceMappingURL=utils.js.map
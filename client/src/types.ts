type ConnectionPayloadMessage = {
    phase: "CONNECT",
    data: {
        playerId: string,
        gameId: string
    }
};

type Element = "FIRE" | "WATER" | "ICE";

export type Card = {
    element: Element,
    value: number,
}

type Player = {
    id: string,
    index: number,
} 

export type GameState = {
    players: Player[],
    winner: null | string,
    score: Array<Array<number>>,
    cards: Array<Array<Card>>,
    selected: Array<number | null>,
    roundWinner: string | null,
}

export type UpdateMessage = {
    phase: "START" | "END" | "PLAY" | "RESULT",
    state: GameState
}
export type SocketMessage = ConnectionPayloadMessage | UpdateMessage;

export type actionMessage = {
    method: "ACTION",
    selected: number
}
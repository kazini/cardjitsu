export type Player = {
    id: string,
    index: number,
} 

export type ConnectionPayloadMessage = {
    phase: "CONNECT",
    data: {
        playerId: string,
        gameId: string
    }
}
export type Element = "FIRE" | "WATER" | "ICE";

export type Card = {
    element: Element,
    value: number,
}

export type GameState = {
    phase: "START" | "END" | "PLAY" | "RESULT",
    time: number,
    players: Player[],
    winner: null | string,
    score: Array<Array<number>>,
    cards: Array<Array<Card>>,
    selected: Array<number | null>,
    roundWinner: string | null,
}

export type ActionMessage = {
    method: "ACTION",
    selected: number
}
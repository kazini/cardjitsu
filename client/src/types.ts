type connectionPayloadMessage = {
    phase: "CONNECT",
    data: {
        playerId: string,
        gameId: string
    }
};
export type socketMessage = connectionPayloadMessage;
type connectionPayloadMessage = {
    type: "CONNECT",
    data: {
        playerId: string,
        gameId: string
    }
};
export type socketMessage = connectionPayloadMessage;
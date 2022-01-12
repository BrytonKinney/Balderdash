class StartGameResponse {
    public gameId: string = "";
    public startedSuccessfully: boolean = false;
}

class GameJoinedResponse {
    public gameId: string = "";
    public playerId: string = "";
    public isGameStarted: boolean = false;
    public isRoundStarted: boolean = false;
}

export { StartGameResponse, GameJoinedResponse };
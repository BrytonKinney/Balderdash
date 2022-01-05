class StartGameResponse {
    public gameId: string = "";
    public startedSuccessfully: boolean = false;
}

class GameJoinedResponse {
    public gameId: string = "";
    public playerId: string = "";
}

export { StartGameResponse, GameJoinedResponse };
class StartGameResponse {
    gameId: string;
    startedSuccessfully: boolean;

    constructor() {
        this.gameId = '';
        this.startedSuccessfully = false;
    }
}

export { StartGameResponse };
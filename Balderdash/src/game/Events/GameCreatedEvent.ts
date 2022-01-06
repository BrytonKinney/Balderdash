export class GameCreatedEvent {
    public readonly GameId: string;
    public readonly ConnectionId: string;

    constructor(gameId: string, connectionId: string) {
        this.GameId = gameId;
        this.ConnectionId = connectionId;
    }
}
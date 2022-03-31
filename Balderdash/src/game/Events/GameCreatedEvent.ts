export class GameCreatedEvent {
    public readonly GameId: string;
    public readonly ConnectionId: string | null;

    constructor(gameId: string, connectionId: string | null) {
        this.GameId = gameId;
        this.ConnectionId = connectionId;
    }
}
import * as signalr from "@microsoft/signalr";
class GameConnection {
    _connection;
    ConnectionId;
    GroupId;
    _isConnectionStarted;
    constructor() {
        this._connection = new signalr.HubConnectionBuilder().withUrl("/game").build();
        this.ConnectionId = "";
        this.GroupId = "";
        this._isConnectionStarted = false;
        this._connection.on("gameStarted", (response) => {
            if (this._connection.connectionId != null) {
                this.ConnectionId = this._connection.connectionId;
            }
            this.GroupId = response.gameId;
        });
        this._connection.start().then(() => { return this._isConnectionStarted = true; });
    }
    get IsConnectionStarted() {
        return this._isConnectionStarted;
    }
    async startGame(currentPlayer) {
        return this._connection.send("startGame", currentPlayer);
    }
}
export { GameConnection };
//# sourceMappingURL=GameConnection.js.map
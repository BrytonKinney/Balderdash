import * as signalr from "@microsoft/signalr";
import { GameEvent } from "./GameEvent";
import { GameCreatedEvent } from "./Events/GameCreatedEvent";
class GameConnection {
    OnGameCreated;
    OnPlayerListUpdated;
    OnGameJoined;
    OnRandomWordReceived;
    OnGameStarted;
    OnRoundStarted;
    _connection;
    _isConnectionStarted;
    _connectionId;
    _groupId;
    constructor() {
        this._connection = new signalr.HubConnectionBuilder().withAutomaticReconnect().withUrl("/game").build();
        this._connectionId = "";
        this._groupId = "";
        this._isConnectionStarted = false;
        this.OnGameCreated = new GameEvent();
        this.OnPlayerListUpdated = new GameEvent();
        this.OnGameJoined = new GameEvent();
        this.OnRandomWordReceived = new GameEvent();
        this.OnGameStarted = new GameEvent();
        this.OnRoundStarted = new GameEvent();
        this.registerEvents();
        this._connection.start().then(() => { return this._isConnectionStarted = true; });
    }
    registerEvents() {
        this._connection.on("gameCreated", (response) => {
            if (this._connection.connectionId != null) {
                this._connectionId = this._connection.connectionId;
            }
            this._groupId = response.gameId;
            this.OnGameCreated.trigger(new GameCreatedEvent(this._groupId, this._connectionId));
        });
        this._connection.on("randomWord", (gameWord) => {
            this.OnRandomWordReceived.trigger(gameWord);
        });
        this._connection.on("playerListUpdated", (response) => {
            this.OnPlayerListUpdated.trigger(response);
        });
        this._connection.on("gameJoined", (response) => {
            if (this._connection.connectionId != null) {
                this._connectionId = this._connection.connectionId;
            }
            this._groupId = response.gameId;
            this.OnGameJoined.trigger(response);
        });
        this._connection.on("gameStarted", () => {
            this.OnGameStarted.trigger();
        });
        this._connection.on("roundStarted", (player) => {
            this.OnRoundStarted.trigger(player);
        });
    }
    get ConnectionId() {
        return this._connectionId;
    }
    get GroupId() {
        return this._groupId;
    }
    get IsConnectionStarted() {
        return this._isConnectionStarted;
    }
    async getRandomWord() {
        await this._connection.send("sendRandomWordToHost", this.GroupId);
    }
    async startGame() {
        await this._connection.send("startGame", this.GroupId);
    }
    async createGame(currentPlayer) {
        await this._connection.send("createNewGame", currentPlayer);
    }
    async joinGame(gameId, player) {
        await this._connection.send("joinGame", gameId, player);
    }
    async startRound(gameId) {
        await this._connection.send("startRound", gameId);
    }
}
export { GameConnection };
//# sourceMappingURL=GameConnection.js.map
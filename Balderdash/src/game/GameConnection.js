import * as signalr from "@microsoft/signalr";
import { GameCreatedEvent } from "./Events/GameCreatedEvent";
import { PlayerSubmittedVoteEvent } from "./Events/PlayerSubmittedVoteEvent";
import { GameEvent } from "./GameEvent";
class GameConnection {
    OnGameCreated;
    OnPlayerListUpdated;
    OnGameJoined;
    OnRandomWordReceived;
    OnGameStarted;
    OnRoundStarted;
    OnAllDefinitionsSubmitted;
    OnPlayerSubmittedVote;
    OnAllVotesSubmitted;
    OnRoundStopped;
    OnConnectionStateChange;
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
        this.OnAllDefinitionsSubmitted = new GameEvent();
        this.OnPlayerSubmittedVote = new GameEvent();
        this.OnAllVotesSubmitted = new GameEvent();
        this.OnRoundStopped = new GameEvent();
        this.OnConnectionStateChange = new GameEvent();
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
        this._connection.on("allDefinitionsSubmitted", (players) => {
            this.OnAllDefinitionsSubmitted.trigger(players);
        });
        this._connection.on("playerSubmittedVote", (player, definition) => {
            this.OnPlayerSubmittedVote.trigger(new PlayerSubmittedVoteEvent(player, definition));
        });
        this._connection.on("allVotesSubmitted", (submissions) => {
            this.OnAllVotesSubmitted.trigger(submissions);
        });
        this._connection.on("stopRound", () => {
            this.OnRoundStopped.trigger();
        });
        this._connection.onclose(() => this.OnConnectionStateChange.trigger("CLOSED"));
        this._connection.onreconnecting(() => this.OnConnectionStateChange.trigger("RECONNECTING"));
        this._connection.onreconnected(() => this.OnConnectionStateChange.trigger("OPEN"));
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
    async submitDefinition(gameId, definition) {
        await this._connection.send("submitDefinition", gameId, definition);
    }
    async submitVote(gameId, playerId, definition) {
        await this._connection.send("submitVote", gameId, playerId, definition);
    }
}
export { GameConnection };
//# sourceMappingURL=GameConnection.js.map
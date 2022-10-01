import * as signalr from "@microsoft/signalr";
import { GameCreatedEvent } from "./Events/GameCreatedEvent";
import { PlayerSubmittedVoteEvent } from "./Events/PlayerSubmittedVoteEvent";
import { GameEvent } from "./GameEvent";
import { GameWord, IGameWord } from "./GameWord";
import { Player } from "./Player";
import { PlayerSubmission } from "./PlayerSubmission";
import { GameJoinedResponse, StartGameResponse } from "./Responses";

class GameConnection {
    public readonly OnGameCreated: GameEvent<GameCreatedEvent>;
    public readonly OnPlayerListUpdated: GameEvent<Player[]>;
    public readonly OnGameJoined: GameEvent<GameJoinedResponse>;
    public readonly OnRandomWordReceived: GameEvent<GameWord>;
    public readonly OnGameStarted: GameEvent<void>;
    public readonly OnRoundStarted: GameEvent<Player>;
    public readonly OnAllDefinitionsSubmitted: GameEvent<Player[]>;
    public readonly OnPlayerSubmittedVote: GameEvent<PlayerSubmittedVoteEvent>;
    public readonly OnAllVotesSubmitted: GameEvent<PlayerSubmission[]>;
    public readonly OnRoundStopped: GameEvent<void>;
    public readonly OnConnectionStateChange: GameEvent<string>;
    public readonly OnPlayerKicked: GameEvent<void>;

    private _connection: signalr.HubConnection;
    private _isConnectionStarted: boolean;
    private _connectionId: string | null;
    private _groupId: string;

    constructor() {
        this._connection = new signalr.HubConnectionBuilder().withAutomaticReconnect().withUrl("/game").build();
        this._connectionId = "";
        this._groupId = "";
        this._isConnectionStarted = false;
        this.OnGameCreated = new GameEvent<GameCreatedEvent>();
        this.OnPlayerListUpdated = new GameEvent<Player[]>();
        this.OnGameJoined = new GameEvent<GameJoinedResponse>();
        this.OnRandomWordReceived = new GameEvent<GameWord>();
        this.OnGameStarted = new GameEvent<void>();
        this.OnRoundStarted = new GameEvent<Player>();
        this.OnAllDefinitionsSubmitted = new GameEvent<Player[]>();
        this.OnPlayerSubmittedVote = new GameEvent<PlayerSubmittedVoteEvent>();
        this.OnAllVotesSubmitted = new GameEvent<PlayerSubmission[]>();
        this.OnRoundStopped = new GameEvent<void>();
        this.OnConnectionStateChange = new GameEvent<string>();
        this.OnPlayerKicked = new GameEvent<void>();
        this.registerEvents();
        this._connection.start().then(() => { return this._isConnectionStarted = true; });
    }

    private registerEvents(): void {
        this._connection.on("gameCreated", (response: StartGameResponse) => {
            if (this._connection.connectionId != null) {
                this._connectionId = this._connection.connectionId;
            }
            this._groupId = response.gameId;
            this.OnGameCreated.trigger(new GameCreatedEvent(this._groupId, this._connectionId));
        });
        this._connection.on("randomWord", (gameWord: IGameWord) => {
            this.OnRandomWordReceived.trigger(gameWord);
        });
        this._connection.on("playerListUpdated", (response: Player[]) => {
            this.OnPlayerListUpdated.trigger(response);
        });
        this._connection.on("gameJoined", (response: GameJoinedResponse) => {
            if (this._connection.connectionId != null) {
                this._connectionId = this._connection.connectionId;
            }
            this._groupId = response.gameId;
            this.OnGameJoined.trigger(response);
        });
        this._connection.on("gameStarted", () => {
            this.OnGameStarted.trigger();
        });
        this._connection.on("roundStarted", (player: Player) => {
            this.OnRoundStarted.trigger(player);
        });
        this._connection.on("allDefinitionsSubmitted", (players: Player[]) => {
            this.OnAllDefinitionsSubmitted.trigger(players);
        });
        this._connection.on("playerSubmittedVote", (player: Player, definition: string) => {
            this.OnPlayerSubmittedVote.trigger(new PlayerSubmittedVoteEvent(player, definition));
        });
        this._connection.on("allVotesSubmitted", (submissions: PlayerSubmission[]) => {
            this.OnAllVotesSubmitted.trigger(submissions);
        });
        this._connection.on("stopRound", () => {
            this.OnRoundStopped.trigger();
        });
        this._connection.on("playerKicked", () => {
            this.OnPlayerKicked.trigger();
            this._connection.stop();
        });
        this._connection.onclose(() => this.OnConnectionStateChange.trigger("CLOSED"));
        this._connection.onreconnecting(() => this.OnConnectionStateChange.trigger("RECONNECTING"));
        this._connection.onreconnected(() => this.OnConnectionStateChange.trigger("OPEN"));
    }

    public get ConnectionId() {
        return this._connectionId;
    }

    public get GroupId() {
        return this._groupId;
    }

    public get IsConnectionStarted() {
        return this._isConnectionStarted;
    }
    async kickPlayer(playerId: string): Promise<void> {
        await this._connection.send("kickPlayer", playerId, this.GroupId);
    }
    async getRandomWord(): Promise<void> {
        await this._connection.send("sendRandomWordToHost", this.GroupId);
    }
    async startGame(): Promise<void> {
        await this._connection.send("startGame", this.GroupId);
    }

    async createGame(currentPlayer: Player): Promise<void> {
        await this._connection.send("createNewGame", currentPlayer);
    }

    async joinGame(gameId: string, player: Player): Promise<void> {
        await this._connection.send("joinGame", gameId, player);
    }

    async startRound(gameId: string): Promise<void> {
        await this._connection.send("startRound", gameId);
    }

    async submitDefinition(gameId: string, definition: string): Promise<void> {
        await this._connection.send("submitDefinition", gameId, definition);
    }

    async submitVote(gameId: string, playerId: string, definition: string): Promise<void> {
        await this._connection.send("submitVote", gameId, playerId, definition);
    }
}
export { GameConnection };

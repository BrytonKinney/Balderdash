import { GameCreatedEvent } from "./Events/GameCreatedEvent";
import { PlayerSubmittedVoteEvent } from "./Events/PlayerSubmittedVoteEvent";
import { GameConnection } from "./GameConnection";
import { GameWord, IGameWord } from "./GameWord";
import { Player } from "./Player";
import { PlayerSubmission } from "./PlayerSubmission";
import { GameJoinedResponse } from "./Responses";
import { GameEvent } from "./GameEvent";

enum GameOption {
    None = 0,
    JoinGame,
    StartGame
}

class Game {
    private players: Player[];
    private readonly currentPlayer: Player;
    private gameConnection: GameConnection;
    private currentWord: GameWord;
    private gameStarted: boolean;
    private roundStarted: boolean;
    private allDefinitionsSubmitted: boolean;
    private playerSubmissions: PlayerSubmission[];
    private votingComplete: boolean;
    private connectionState: string;

    public readonly OnPlayerKicked: GameEvent<void>;

    constructor() {
        this.players = new Array<Player>();
        this.currentPlayer = new Player("", "", true, "", "", false, false, false);
        this.gameConnection = new GameConnection();
        this.currentWord = new GameWord("", "");
        this.gameStarted = false;
        this.roundStarted = false;
        this.allDefinitionsSubmitted = false;
        this.votingComplete = false;
        this.connectionState = "";
        this.playerSubmissions = new Array<PlayerSubmission>();
        this.OnPlayerKicked = new GameEvent<void>();
        this.registerEvents();
    }

    private registerEvents(): void {
        this.gameConnection.OnGameCreated.on((data?: GameCreatedEvent): void => {
            if (data !== undefined) {
                this.currentPlayer.setId(data.ConnectionId);
            }
        });
        this.gameConnection.OnPlayerListUpdated.on((players?: Player[]): void => {
            if (players !== undefined) {
                this.players.splice(0, this.players.length);
                for (const player of players) {
                    this.players.push(player);
                }
            }
        });
        this.gameConnection.OnGameJoined.on((data?: GameJoinedResponse) => {
            if (data !== undefined) {
                this.currentPlayer.setId(data.playerId);
                this.gameStarted = data.isGameStarted;
                this.roundStarted = data.isRoundStarted;
            }
        });
        this.gameConnection.OnRandomWordReceived.on((data?: IGameWord) => {
            if (data !== undefined) {
                this.currentWord.definition = data.definition;
                this.currentWord.word = data.word;
            }
        });
        this.gameConnection.OnGameStarted.on(() => {
            this.gameStarted = true;
        });
        this.gameConnection.OnRoundStarted.on((player?: Player) => {
            if (player !== undefined) {
                this.currentPlayer.setDefinition(player.definition);
                this.currentPlayer.setHasRealDefinition(player.hasRealDefinition);
                this.currentPlayer.setWord(player.word);
                this.roundStarted = true;
            }
        });
        this.gameConnection.OnAllDefinitionsSubmitted.on((players?: Player[]) => {
            if (players !== undefined) {
                for (let player of this.players) {
                    const newPlayerState = players.find(p => p.id === player.id);
                    if (newPlayerState === undefined || newPlayerState === null)
                        continue;
                    player.definition = newPlayerState.definition;
                    player.id = newPlayerState.id;
                    player.hasRealDefinition = newPlayerState.hasRealDefinition;
                    player.isHost = newPlayerState.isHost;
                    player.name = newPlayerState.name;
                    player.word = newPlayerState.word;
                }
                this.allDefinitionsSubmitted = true;
            }
        });
        this.gameConnection.OnPlayerSubmittedVote.on((event?: PlayerSubmittedVoteEvent) => {
            if (event !== undefined) {
                this.currentPlayer.setHasSubmittedVote(true);
            }
        });
        this.gameConnection.OnAllVotesSubmitted.on((event?: PlayerSubmission[]) => {
            if (event !== undefined) {
                this.playerSubmissions = event;
                this.votingComplete = true;
            }
        });
        this.gameConnection.OnRoundStopped.on(() => {
            this.roundStarted = false;
            this.votingComplete = false;
            this.allDefinitionsSubmitted = false;
            this.currentPlayer.setHasSubmittedVote(false);
            for (let player of this.players) {
                player.setHasSubmittedVote(false);
            }
            this.playerSubmissions.splice(0, this.playerSubmissions.length);
        });
        this.gameConnection.OnConnectionStateChange.on((state?: string) => {
            if (state !== undefined) {
                this.connectionState = state;
                if (this.connectionState === "CLOSED" && !this.currentPlayer.wasKicked) {
                    this.gameConnection.joinGame(this.GameId, this.currentPlayer);
                }
            }
        });
        this.gameConnection.OnPlayerKicked.on(() => {
            this.currentPlayer.setWasKicked(true);
            this.OnPlayerKicked.trigger();
        });
    }
    async kickPlayer(playerId: string): Promise<void> {
        await this.gameConnection.kickPlayer(playerId);
    }
    async createGame() : Promise<void> {
        await this.gameConnection.createGame(this.currentPlayer);
    }
    async startGame(): Promise<void> {
        await this.gameConnection.startGame();
    }
    async joinGame(gameId: string) : Promise<void> {
        await this.gameConnection.joinGame(gameId, this.currentPlayer);
    }
    async getNewWord(): Promise<void> {
        await this.gameConnection.getRandomWord();
    }
    async startRound(): Promise<void> {
        await this.gameConnection.startRound(this.GameId);
    }
    async submitDefinition(definition: string): Promise<void> {
        await this.gameConnection.submitDefinition(this.GameId, definition);
    }
    async submitVote(vote: string): Promise<void> {
        if(this.currentPlayer.id != null)
            await this.gameConnection.submitVote(this.GameId, this.currentPlayer.id, vote);
    }

    get AllDefinitionsSubmitted() {
        return this.allDefinitionsSubmitted;
    }
    get CurrentWord() {
        return this.currentWord;
    }
    get GameId() {
        return this.gameConnection.GroupId;
    }
    get CanStart() {
        return this.gameConnection.IsConnectionStarted;
    }
    get Players() {
        return this.players;
    }
    get CurrentPlayer() {
        return this.currentPlayer;
    }
    get GameStarted() {
        return this.gameStarted;
    }
    get RoundStarted() {
        return this.roundStarted;
    }
    get PlayerSubmissions() {
        return this.playerSubmissions;
    }
    get VotingComplete() {
        return this.votingComplete;
    }
    get ConnectionState() {
        return this.connectionState;
    }
}

export { Game, GameOption };

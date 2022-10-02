import { GameConnection } from "./GameConnection";
import { GameWord } from "./GameWord";
import { Player } from "./Player";
import { GameEvent } from "./GameEvent";
var GameOption;
(function (GameOption) {
    GameOption[GameOption["None"] = 0] = "None";
    GameOption[GameOption["JoinGame"] = 1] = "JoinGame";
    GameOption[GameOption["StartGame"] = 2] = "StartGame";
})(GameOption || (GameOption = {}));
class Game {
    players;
    currentPlayer;
    gameConnection;
    currentWord;
    gameStarted;
    roundStarted;
    allDefinitionsSubmitted;
    playerSubmissions;
    votingComplete;
    connectionState;
    OnPlayerKicked;
    constructor() {
        this.players = new Array();
        this.currentPlayer = new Player("", "", true, "", "", false, false, false);
        this.gameConnection = new GameConnection();
        this.currentWord = new GameWord("", "");
        this.gameStarted = false;
        this.roundStarted = false;
        this.allDefinitionsSubmitted = false;
        this.votingComplete = false;
        this.connectionState = "";
        this.playerSubmissions = new Array();
        this.OnPlayerKicked = new GameEvent();
        this.registerEvents();
    }
    registerEvents() {
        this.gameConnection.OnGameCreated.on((data) => {
            if (data !== undefined) {
                this.currentPlayer.setId(data.ConnectionId);
            }
        });
        this.gameConnection.OnPlayerListUpdated.on((players) => {
            if (players !== undefined) {
                this.players.splice(0, this.players.length);
                for (const player of players) {
                    this.players.push(player);
                }
            }
        });
        this.gameConnection.OnGameJoined.on((data) => {
            if (data !== undefined) {
                this.currentPlayer.setId(data.playerId);
                this.gameStarted = data.isGameStarted;
                this.roundStarted = data.isRoundStarted;
            }
        });
        this.gameConnection.OnRandomWordReceived.on((data) => {
            if (data !== undefined) {
                this.currentWord.definition = data.definition;
                this.currentWord.word = data.word;
            }
        });
        this.gameConnection.OnGameStarted.on(() => {
            this.gameStarted = true;
        });
        this.gameConnection.OnRoundStarted.on((player) => {
            if (player !== undefined) {
                this.currentPlayer.setDefinition(player.definition);
                this.currentPlayer.setHasRealDefinition(player.hasRealDefinition);
                this.currentPlayer.setWord(player.word);
                this.roundStarted = true;
            }
        });
        this.gameConnection.OnAllDefinitionsSubmitted.on((players) => {
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
        this.gameConnection.OnPlayerSubmittedVote.on((event) => {
            if (event !== undefined) {
                this.currentPlayer.setHasSubmittedVote(true);
            }
        });
        this.gameConnection.OnAllVotesSubmitted.on((event) => {
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
        this.gameConnection.OnConnectionStateChange.on((state) => {
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
    async kickPlayer(playerId) {
        await this.gameConnection.kickPlayer(playerId);
    }
    async createGame() {
        await this.gameConnection.createGame(this.currentPlayer);
    }
    async startGame() {
        await this.gameConnection.startGame();
    }
    async joinGame(gameId) {
        await this.gameConnection.joinGame(gameId, this.currentPlayer);
    }
    async getNewWord() {
        await this.gameConnection.getRandomWord();
    }
    async startRound() {
        await this.gameConnection.startRound(this.GameId);
    }
    async submitDefinition(definition) {
        await this.gameConnection.submitDefinition(this.GameId, definition);
    }
    async submitVote(vote) {
        if (this.currentPlayer.id != null)
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
//# sourceMappingURL=Game.js.map
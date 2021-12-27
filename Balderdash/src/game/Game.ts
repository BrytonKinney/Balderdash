import { Player } from "./Player";
import { StartGameResponse } from "./Responses";
import * as signalr from "@microsoft/signalr";

enum GameOption {
    None = 0,
    JoinGame,
    StartGame
};

class Game {
    _players: Player[];
    _currentPlayer: Player;
    _connection: signalr.HubConnection;
    _canStart: boolean;
    _gameId: string;

    constructor() {
        this._players = new Array<Player>();
        this._currentPlayer = new Player("", "", true);
        this._connection = new signalr.HubConnectionBuilder().withUrl("/game").build();
        this._canStart = false;
        this._gameId = "";
        this._connection.on("gameStarted", (response: StartGameResponse) => {
            if (this._connection.connectionId != null) {
                this._currentPlayer.setId(this._connection.connectionId);
            }
            this._gameId = response.gameId;
        });
        this._connection.start().then(() => { return this._canStart = true; });
    }

    async startGame() : Promise<void> {
        await this._connection.send("startGame", this._currentPlayer).then((resp) => {
            console.log(resp);
        });
    }

    get CanStart() {
        return this._canStart;
    }
    get Players() {
        return this._players;
    }
    get CurrentPlayer() {
        return this._currentPlayer;
    }
}

export { Game, GameOption };
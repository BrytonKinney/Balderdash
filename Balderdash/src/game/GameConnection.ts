﻿import * as signalr from "@microsoft/signalr";
import { Player } from "./Player";
import { StartGameResponse } from "./Responses";

class GameConnection {
    private _connection: signalr.HubConnection;

    public ConnectionId: string;
    public GroupId: string;
    private _isConnectionStarted: boolean;

    constructor() {
        this._connection = new signalr.HubConnectionBuilder().withUrl("/game").build();
        this.ConnectionId = "";
        this.GroupId = "";
        this._isConnectionStarted = false;
        this._connection.on("gameStarted", (response: StartGameResponse) => {
            if (this._connection.connectionId != null) {
                this.ConnectionId = this._connection.connectionId;
            }
            this.GroupId = response.gameId;
        });
        this._connection.start().then(() => { return this._isConnectionStarted = true; });
    }

    public get IsConnectionStarted() {
        return this._isConnectionStarted;
    }

    async startGame(currentPlayer: Player): Promise<void> {
        return this._connection.send("startGame", currentPlayer);
    }
}
export { GameConnection };
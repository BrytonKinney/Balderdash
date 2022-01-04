<template>
    <div id="app">
        <div class="game-options" v-if="!gameSelected">
            <div class="game-options">
                <button class="primary" type="button" v-on:click="setGameOptionSelection(GameOption.JoinGame)">Join a game</button>
                <button class="primary" type="button" v-on:click="setGameOptionSelection(GameOption.StartGame)">Start new game</button>
            </div>
            <div v-if="gameOptionSelection === GameOption.JoinGame" id="joinGame" class="game-options">
                <input type="text" placeholder="Game ID" v-model="joinGameId" />
                <input ref="name" type="text" placeholder="Name" v-model="playerName" />
            </div>
            <div v-if="gameOptionSelection === GameOption.StartGame" id="startGame" class="game-options">
                <input ref="name" type="text" placeholder="Name" v-model="playerName" />
            </div>
            <div v-if="gameOptionSelection !== GameOption.None" class="game-options">
                <button type="button" v-on:click="joinOrStartGame">Go</button>
            </div>
        </div>
        <ActiveGame v-if="gameSelected" v-bind:newGame="game" />
    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    import ActiveGame from "./components/ActiveGame.vue";
    import { Game, GameOption } from "./game/Balderdash";
    export default Vue.extend({
        name: "App",
        components: {
            ActiveGame
        },
        computed: {
            GameOption: function () {
                return GameOption;
            },
        },
        data: function () {
            return {
                gameOptionSelection: GameOption.None as GameOption,
                playerName: "" as string,
                joinGameId: "" as string,
                game: new Game(),
                gameSelected: false
            };
        },
        methods: {
            setGameOptionSelection(gameOption: GameOption): void {
                this.gameOptionSelection = gameOption;
            },
            joinOrStartGame(): void {
                if (!this.validateName() || !this.game.CanStart)
                    return;
                this.gameOptionSelection === GameOption.StartGame ? this.startGame() : this.joinGame();
            },
            async joinGame(): Promise<void> {
                this.gameSelected = true;
                this.game.CurrentPlayer.setName(this.playerName);
                this.game.Players.push(this.game.CurrentPlayer);
                await this.game.joinGame(this.joinGameId);
            },
            async startGame(): Promise<void> {
                this.gameSelected = true;
                this.game.CurrentPlayer.setName(this.playerName);
                this.game.Players.push(this.game.CurrentPlayer);
                await this.game.startGame();
            },
            validateName(): boolean {
                const nameInput = this.$refs.name as HTMLElement;
                if (this.playerName.length < 1) {
                    nameInput.classList.add('invalid');
                    return false;
                }
                nameInput.classList.remove('invalid');
                return true;
            }
        }
    });
</script>
<style lang="scss">
    @import "./styles/site.scss";

    #app {
        display: flex;
        flex-wrap: wrap;
        margin-top: 1em;        
    }

    div.game-options {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        padding: 1em 25% 1em 25%;
        gap: 5px;
    }
    div.game-options button, div.game-options input, div.game-options select {
        font-size: 1.1rem;
    }
    div.game-options button {
        padding-top: .5em;
        padding-bottom: .5em;
    }

    div.game-options input {
        flex: 2;
    }

    div.game-options button {
        flex: 2;        
        width: 100%;
    }
</style>
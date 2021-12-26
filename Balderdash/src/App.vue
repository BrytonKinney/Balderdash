<template>
    <div id="app">
        <div class="game-options">
            <button type="button" v-on:click="setGameOptionSelection(GameOption.JoinGame)">Join a game</button>
            <button type="button" v-on:click="setGameOptionSelection(GameOption.StartGame)">Start new game</button>
        </div>
        <div id="joinGame" class="game-options">
            <input type="text" placeholder="Game ID" v-model="joinGameId" />
            <input type="text" placeholder="Name" v-model="playerName" />
        </div>
        <div id="startGame" class="game-options">
            <input type="text" placeholder="Name" v-model="playerName" />
        </div>
        <ActiveGame v-bind:newGame="game" />
    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    import ActiveGame from "./components/ActiveGame.vue";
    import { Game } from "./game/Balderdash";
    enum GameOption {
        None = 0,
        JoinGame,
        StartGame
    };
    export default Vue.extend({
        name: "App",
        components: {
            ActiveGame
        },
        data: function () {
            return {
                GameOption,
                gameOptionSelection: GameOption.None as GameOption,
                playerName: "" as string,
                joinGameId: "" as string,
                game: new Game()
            };
        },
        methods: {
            setGameOptionSelection(gameOption: GameOption): void {
                this.gameOptionSelection = gameOption;
            }
        }
    });
</script>
<style>
    #app {
        display: flex;
        flex-wrap: wrap;
        margin-top: 1em;
    }

        #app div.game-options {
            display: flex;
            width: 50%;
            padding: 1em 25% 1em 25%;
        }

    div.game-options input {
        flex: 2;
    }

    div.game-options button {
        flex: 2;
        flex-wrap: wrap;
        width: 100%;
    }
</style>
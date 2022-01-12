<template>
    <div class="active-game container">
        <PlayerList v-bind:players="players"
                    v-bind:current-player="currentPlayer" />
        <div id="gameWindow" class="container">
            <div id="gameId">
                Game ID: <input type="text" readonly
                                v-model="newGame.GameId"
                                v-on:focus="select($event)" />
            </div>
            <div class="host-panel" v-if="isHost">
                <h4>Host Actions</h4>
                <div class="host-actions">
                    <button class="padded" v-on:click="startGame" v-if="!gameStarted">Start Game</button>
                    <button class="padded" v-on:click="getNewWord" v-if="gameStarted">Get new random word</button>
                </div>
            </div>
            <div v-if="gameStarted && !roundStarted && !isHost">
                <p>Host is selecting a word...</p>
            </div>
            <div class="game-word" v-else-if="gameStarted && roundStarted && hasRealDefinition">
                <p>You have the real definition.</p>
                <h4>{{ currentPlayer.word }}</h4>
                <p>{{ currentPlayer.definition }}</p>
            </div>
            <div class="game-window">
                <div v-if="currentWord.word" class="game-word">
                    <h3>{{ currentWord.word }}</h3>
                    <div class="window-content">
                        <p>{{ currentWord.definition }}</p>
                        <button class="padded" v-on:click="startRound">Play word</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { Game, Player } from "../game/Balderdash";
    import Vue, { PropType } from "vue";
    import PlayerList from "./PlayerList.vue";
    export default Vue.extend({
        name: "ActiveGame",
        components: {
            PlayerList
        },
        props: {
            newGame: Object as PropType<Game>
        },
        computed: {
            isHost(): boolean {
                return this.currentPlayer.isHost;
            },
            gameStarted(): boolean {
                return this.newGame.GameStarted;
            },
            roundStarted(): boolean {
                return this.newGame.RoundStarted;
            },
            hasRealDefinition(): boolean {
                return this.currentPlayer.hasRealDefinition;
            }
        },
        data: function () {
            return {
                players: this.newGame.Players,
                currentPlayer: this.newGame.CurrentPlayer,
                currentWord: this.newGame.CurrentWord
            };
        },
        methods: {
            async startGame(): Promise<void> {
                await this.newGame.startGame();
            },
            select(e: FocusEvent): void {
                (e.target as HTMLInputElement).select();
            },
            async getNewWord(): Promise<void> {
                await this.newGame.getNewWord();
            },
            async startRound(): Promise<void> {
                await this.newGame.startRound();
            }
        }
    });
</script>
<style lang="scss">
    @import "../styles/colors.scss";
    @import "../styles/site.scss";

    .active-game {
        width: 100%;
    }

    .host-panel {
        @include border;
    }

    .host-panel h4 {
        margin: 1em;
    }

    .host-actions {
        margin: 1em;
    }

    div#gameWindow {
        flex-grow: 5;
        gap: 1rem 1rem;
        flex-direction: column;
    }

    div#gameWindow input {
        width: 25%;
    }

    .game-word {
        @include border;
        text-align: center;
    }

    .game-word h3 {
        margin-top: 0;
        padding-top: 1em;
        color: $ghost-white;
        background-color: $raisin-black;
        border-bottom: 1px solid $raisin-black;
        text-align: center;
        padding-bottom: 1em;
        margin-bottom: 0;
    }

    .game-word .window-content {
        margin-bottom: 1rem;
    }
</style>
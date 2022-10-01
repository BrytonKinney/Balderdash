<template>
    <div class="active-game container">
        <PlayerList v-bind:players="players"
                    v-bind:current-player="currentPlayer"
                    @kick-player="kickPlayer"/>
        <div id="gameWindow" class="container">
            <div id="gameId">
                Game ID: <input type="text" readonly
                                v-model="newGame.GameId"
                                v-on:focus="select($event)" />
            </div>
            <div class="host-panel" v-if="isHost">
                <h4>Host Actions</h4>
                <div class="host-actions">
                    <button class="padded" v-on:click="startGame" v-if="canStartGame">Start Game</button>
                    <button class="padded" v-on:click="getNewWord" v-if="gameStarted">Get new random word</button>
                    <p v-if="!gameStarted && !canStartGame">Waiting for more players...</p>
                </div>
            </div>
            <div v-if="newGame.ConnectionState === 'CLOSED'">
                You have been disconnected!
            </div>
            <div v-if="newGame.ConnectionState === 'RECONNECTING'">
                Attempting to reconnect to the game...
            </div>
            <div v-if="gameStarted && !roundStarted && !isHost">
                <p>Host is selecting a word...</p>
            </div>
            <div class="game-word" v-else-if="!isHost && gameStarted && roundStarted && hasRealDefinition && !allDefinitionsSubmitted">
                <p>You have the real definition.</p>
                <h4>{{ currentPlayer.word }}</h4>
                <p>{{ currentPlayer.definition }}</p>
            </div>
            <div class="game-word" v-else-if="!isHost && gameStarted && roundStarted && !hasRealDefinition && !allDefinitionsSubmitted">
                <p>You must enter a fake definition</p>
                <h4>{{ currentPlayer.word }}</h4>
                <div class="window-content">
                    <input type="text" v-model="currentPlayer.definition" />
                    <button type="button" v-on:click="submitDefinition">Submit definition</button>
                </div>
            </div>
            <div class="game-word" v-else-if="gameStarted && roundStarted && allDefinitionsSubmitted && !votingComplete">
                <h3 v-if="!isHost">{{ currentPlayer.word }}</h3>
                <h3 v-else>{{ currentWord.word }}</h3>
                <div class="window-content" v-for="player in nonHostPlayers" v-bind:key="player.id">
                    <template v-if="!isHost">
                        <div class="vote-definition">
                            <div class="word">
                                <p>
                                    {{ player.definition }}
                                </p>
                            </div>
                            <div class="vote">
                                <input type="checkbox" v-on:change="setSelectedVote(player.definition)" v-model="player.definition === selectedVote" v-bind:disabled="currentPlayer.hasSubmittedVote || currentPlayer.hasRealDefinition" />
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <strong>{{ player.name }}</strong> - {{ player.definition }}
                    </template>
                </div>
                <div class="window-content">
                    <button v-if="!currentPlayer.hasSubmittedVote && !currentPlayer.isHost && !currentPlayer.hasRealDefinition" type="button" v-on:click="setCurrentPlayerVote(selectedVote)">
                        Submit vote
                    </button>
                </div>
            </div>
            <div class="game-word" v-else-if="gameStarted && roundStarted && allDefinitionsSubmitted && votingComplete">
                <h3>Results</h3>
                <div class="window-content">
                    <div v-for="(submission, idx) in newGame.playerSubmissions" v-bind:key="idx">
                        {{ getPlayerName(submission.submittedById) }}: {{ submission.definition }} - {{ submission.votes }} votes
                    </div>
                </div>
            </div>
            <div class="game-window">
                <div v-if="currentWord.word && isHost" class="game-word">
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
import { PlayerSubmission } from "../game/PlayerSubmission";
    export default Vue.extend({
        name: "ActiveGame",
        components: {
            PlayerList
        },
        props: {
            newGame: Object as PropType<Game>
        },
        computed: {
            nonHostPlayers(): Player[] {
                return this.newGame.Players.filter(p => !p.isHost);
            },
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
            },
            allDefinitionsSubmitted(): boolean {
                return this.newGame.AllDefinitionsSubmitted;
            },
            canStartGame(): boolean {
                return !this.gameStarted && this.newGame.Players.filter(p => !p.isHost).length > 2;
            },
            votingComplete(): boolean {
                return this.newGame.VotingComplete;
            },
            orderedSubmissions(): PlayerSubmission[] {
                let playerSubmissions = this.newGame.PlayerSubmissions;
                return playerSubmissions.sort((p1, p2) => {
                    return p2.votes - p1.votes;
                });
            }
        },
        data() {
            return {
                players: this.newGame.Players,
                currentPlayer: this.newGame.CurrentPlayer,
                currentWord: this.newGame.CurrentWord,
                selectedVote: "" as string
            };
        },
        methods: {
            async kickPlayer(playerId: string) : Promise<void> {
                await this.newGame.kickPlayer(playerId);
            },
            setSelectedVote(definition: string): void {
                this.selectedVote = definition;
            },
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
            },
            async submitDefinition(): Promise<void> {
                await this.newGame.submitDefinition(this.currentPlayer.definition);
            },
            async setCurrentPlayerVote(vote: string): Promise<void> {
                await this.newGame.submitVote(vote);
            },
            getPlayerName(id: string): string {
                const player = this.players.find(p => p.id === id);
                if (player !== undefined)
                    return player.name;
                return "";
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
        margin-top: 1rem;
    }

    .vote-definition {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .vote-definition div.word {
        width: 25%;
    }
    @media screen and (min-width: 1080px) {
        .vote-definition div.vote {
            width: 5%;
        }
    }
    @media screen and (max-width: 1079px) {
        .vote-definition div.vote {
            width: 15%;
        }
    }
</style>
<template>
    <div id="playersList">
        <h2>Players</h2>
        <ul class="player-list">
            <li v-for="player in players"
                v-bind:key="player.id">
                <template v-if="currentPlayer.isHost">
                    <div v-bind:class="{'current-player': player.id === currentPlayer.id}">
                        {{ player.name }}
                    </div>
                    <div v-if="player.id !== currentPlayer.id">
                        <button type="button">Kick</button>
                    </div>
                </template>
                <template v-else>
                    <div v-bind:class="{'current-player': player.id === currentPlayer.id}">
                        {{ player.name }}
                    </div>
                </template>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
    import Vue, { PropType } from "vue";
    import { Player } from "@/game/Player";
    type PlayerMap = {
        [key: string]: boolean
    }
    export default Vue.extend({
        props: {
            players: Array as PropType<Player[]>,
            currentPlayer: Object as PropType<Player>
        },
        data() {
            return {
            };
        },
        methods: {
            kickPlayer(id: string): void {
                this.$emit('kick-player', id);
            }
        }
    });
</script>
<style lang="scss">
    div#playersList {
        margin-left: 1rem;
        margin-right: 1rem;
    }
    .player-list {
        padding: 0;
    }
    .player-list li {
        padding-top: .5em;
        padding-bottom: .5em;
    }
    .current-player {
        font-style: italic;
    }
    .player-list {
        list-style: none;
    }
</style>
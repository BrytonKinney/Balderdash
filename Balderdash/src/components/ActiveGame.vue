<template>
    <div class="active-game">
        <PlayerList v-bind:players="players" 
					v-bind:current-player="currentPlayer"/>
        <div id="gameWindow">
            <div id="gameId">Game ID: {{ newGame.GameId }}</div>
            <div id="gameActions"></div>
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
        data: function () {
            return {
                players: this.newGame.Players,
                currentPlayer: this.newGame.CurrentPlayer
            };
        }
    });
</script>
<style lang="scss">
    .active-game {
        display: flex;
        width: 100%;
    }
    div#playersList {
        flex-grow: 1;
    }
    div#gameWindow {
        flex-grow: 3;
    }
    div#gameId {
        text-align: center;
    }

</style>
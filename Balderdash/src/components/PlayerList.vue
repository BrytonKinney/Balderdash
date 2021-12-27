<template>
    <div>
        <ul>
            <li v-for="player in players" v-bind:key="player.id">{{ player.name }} <button v-if="currentPlayer.isHost" type="button">Kick</button></li>
        </ul>
    </div>
</template>
<script lang="ts">
    import Vue, { PropType } from "vue";
    import { Player } from "@/game/Player";
    export default Vue.extend({
        props: {
            players: Array as PropType<Player[]>,
            currentPlayer: Object as PropType<Player>
        }
    });
</script>
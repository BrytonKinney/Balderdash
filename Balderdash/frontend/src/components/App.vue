<template>
    <div>
        <input type="text" placeholder="Name" v-model="playerName" />
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import { Game } from "../game/Game";
    export default Vue.extend({
        name: "App",
        data: function () {
            return {
                playerName: '' as string,
                currentGame: new Game()
            };
        }
    });

</script>
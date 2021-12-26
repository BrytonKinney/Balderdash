<template>
    <div>
        
    </div>
</template>
<script lang="ts">
    import { Game, Player } from "../game/Balderdash";
    import Vue from "vue";
    export default Vue.extend({
        name: "ActiveGame",
        props: {
            newGame: Game,
            hostPlayer: Player,
        },
        data: function () {
            return {
            };
        }
    });
</script>
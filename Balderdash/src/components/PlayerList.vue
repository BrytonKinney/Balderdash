<template>
    <div>
        <ul class="player-list">
            <li v-for="player in players"
                v-bind:key="player.id">
                <template v-if="currentPlayer.isHost">
                    <div @click="toggleExpandPlayerMenu(player.id)">
                        {{ player.name }}
                    </div>
                    <div v-show="expandedPlayerMenus[player.id]">
                        <button type="button">Kick</button>
                    </div>
                </template>
                <template v-else>
                    {{ player.name }}
                </template>
            </li>
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
        },
        data() {
            return {
                expandedPlayerMenus: new Map<string, boolean>()
            };
        },
        methods: {
            isPlayerMenuOpen(id: string): boolean {
                if (this.expandedPlayerMenus.has(id)) {
                    console.log("expanded:", this.expandedPlayerMenus.get(id));
                    return this.expandedPlayerMenus.get(id) ?? false;
                }
                return false;
            },
            toggleExpandPlayerMenu(id: string): void {
                this.expandedPlayerMenus.set(id, !this.isPlayerMenuOpen(id));
                console.log("isPlayerMenuOpen:", this.isPlayerMenuOpen(id));
                console.log("bool condition", this.currentPlayer.isHost && this.isPlayerMenuOpen(this.currentPlayer.id));
            }
        },
        updated() {
            if (this.expandedPlayerMenus.size != this.players.length) {
                console.log('updating');
                this.expandedPlayerMenus.clear();
                for (const player of this.players) {
                    if (this.expandedPlayerMenus.get(player.id) !== null) {
                        continue;
                    }
                    if (this.expandedPlayerMenus.get(player.id) === null) {
                        this.expandedPlayerMenus.set(player.id, false);
                    }
                }
            }
        }
    });
</script>
<style lang="scss">
    .player-list {
        list-style: none;
    }

    .player-list div {
        cursor: pointer;
    }
</style>
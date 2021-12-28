<template>
    <div>
        <ul class="player-list">
            <li v-for="player in players"
                v-bind:key="player.id">
                <span @click="toggleExpandPlayerMenu(player.id)">
                    {{ player.name }}
                </span>
                <div v-if="currentPlayer.isHost && isPlayerMenuOpen(player.id)">
                    <button type="button">Kick</button>
                </div>
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
                if (this.expandedPlayerMenus.has(id))
                    return this.expandedPlayerMenus.get(id) ?? false;
                return false;
            },
            toggleExpandPlayerMenu(id: string): void {
                this.expandedPlayerMenus.set(id, !this.isPlayerMenuOpen(id));
            }
        },
        updated() {
            if (this.expandedPlayerMenus.size != this.players.length) {
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

    .player-list span {
        cursor: pointer;
    }
</style>
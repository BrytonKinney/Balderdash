<template>
	<div>
		<ul class="player-list">
			<li v-for="player in players"
				v-bind:key="player.id">
				<template v-if="currentPlayer.isHost">
					<div>
						{{ player.name }}
					</div>
					<div v-if="player.id !== currentPlayer.id">
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
import Vue, {PropType} from "vue";
import {Player} from "@/game/Player";
import {PlayerMap} from "@/util/ReactiveMap";

export default Vue.extend({
	props: {
		players: Array as PropType<Player[]>,
		currentPlayer: Object as PropType<Player>
	},
	data() {
		return {
			expandedPlayerMenus: {} as PlayerMap
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
.player-list {
	list-style: none;
}

.player-list div {
	cursor: pointer;
}
</style>
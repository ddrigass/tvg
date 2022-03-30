<template>
	<div id="game" class="game">
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import game from "@/core/Game";

@Component({
	mounted() {
		game.append()
		game.init()
	}
})
export default class GameView extends Vue {}
</script>

<template>
	<div class="button" @click="$emit('click', $event)">
		{{ text }}
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
	props: {
		text: String
	}
})
export default class Button extends Vue {}
</script>

<style lang="scss">
.button {
	display: inline-block;
	padding: 5px 10px;
	margin: 5px;
	border: 1px solid;
}
</style>
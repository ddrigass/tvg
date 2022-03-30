<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
body {
	margin: 0;
	overflow: hidden;
}
</style>

<script lang="ts">
import bus from "@/core/bus";
import router from "@/router";

export default {
	name: 'App',
	mounted() {
		bus.$emit('init')
		if (router.currentRoute.path !== '/')
			router.replace('/')

		bus.$on('initiated', () => {
			router.replace('login')
		})
		bus.$on('loggedIn', () => {
			router.replace('game')
		})
	}
}
</script>

<template>
	<div class="login">
		<h1>Login</h1>
		<TextField title="Login" v-model="login"/>
		<TextField title="Password" v-model="password"/>
		<Button text="Submit" @click="onSubmit"/>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TextField from "@/components/TextField.vue";
import Button from "@/components/Button.vue";
import bus from "@/core/bus";

@Component({
	components: { Button, TextField },
})
export default class LoginView extends Vue {
	private login: string = 'test';
	private password: string = 'test';
	onSubmit(): void {
		const login = this.login;
		const password = this.password;
		bus.$emit('logIn', { login, password })
	}
}
</script>

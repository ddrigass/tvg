import Vue from 'vue'
import VueRouter from 'vue-router'
import Loading from '@/views/Loading.vue'
import Login from '@/views/Login.vue'
import Game from '@/views/Game.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Loading',
		component: Loading
	},
	{
		path: '/login',
		name: 'Login',
		component: Login
	},
	{
		path: '/game',
		name: 'Game',
		component: Game
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router

import Vue, { VueConstructor } from "vue";
import App from './App.vue'
import router from './router'
import { Gate } from "@/core/Gate";

// @ts-ignore
window.$gate = new Gate();

Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')

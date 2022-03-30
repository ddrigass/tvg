import bus from "@/core/bus";
import Vue from "vue";
import { LogInOptions } from "@/types/LogInOptions";
import config from "@/core/config";

enum WS_EVENT_TYPES {

}

interface WSEvent {
	type: WS_EVENT_TYPES
}

class WsListener {
	public type: String;
	public cb: Function;
	constructor(type: String, cb: Function) {
		this.type = type;
		this.cb = cb;
	}
}

export class Gate {
	private bus: Vue = bus;
	private ws: WebSocket = new WebSocket(`ws://${config.server.address}`);
	private listeners: WsListener[] = [];
	constructor() {
		this.initWs()
		this.initListeners()
	}

	private sendEvent(type: string, data: any) {
		console.log(type, data)
		this.ws.send(JSON.stringify({
			"event": type,
			data
		}))
	}

	private subscribeEvent(type: string, cb: Function) {
		this.listeners.push(new WsListener(type, cb))
	}

	private initListeners() {
		this.bus.$on('logIn', (payload: LogInOptions) => {
			this.sendEvent('logIn', payload)
		})

		this.bus.$on('move', (payload: LogInOptions) => {
			this.sendEvent('move', payload)
		})
	}

	private initWs() {
		this.ws.onopen = (e) =>
			this.bus.$emit('initiated')

		this.ws.onerror = (e) => console.error(e)

		this.ws.onclose = e => {
			this.ws = new WebSocket(this.ws.url)
			this.initWs()
		}

		this.ws.onmessage = (event ) => {
			const eventBody = JSON.parse(event.data)
			this.listeners.forEach((el: WsListener) => {
				if (el.type === eventBody.event)
					el.cb(eventBody.data)
			})
		}

		this.subscribeEvent('disconnect', () => {
			console.log('disconnect')
		})
		this.subscribeEvent('connect_error', (err: Error) => {
			console.log('connect_error', err)
		})

		this.subscribeEvent('loggedIn', (err: Error) => {
			this.bus.$emit('loggedIn')
		})
	}
}
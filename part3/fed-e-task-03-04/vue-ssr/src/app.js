import Vue from 'vue'
import App from './App'

export function createApp() {
    const app = new Vue({
        render: h => h(App)
    })
    return { app }
}

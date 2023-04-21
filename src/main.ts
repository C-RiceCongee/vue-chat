import { createApp } from "vue"
import './style.css'
import App from './App.vue'
import CunWangChat from "./packages/CunWangChat";
const app = createApp(App)
app.use(CunWangChat)
app.mount('#app')

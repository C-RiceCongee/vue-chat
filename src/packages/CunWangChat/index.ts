import { App } from "vue"
import CunWangChat from "./CunWangChat.vue"
export default {
    install: (app:App) => {
        // 在这里编写插件代码
        app.component('CunWangChat',CunWangChat)
    }
}
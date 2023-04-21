import CunWangChat from "./CunWangChat.vue"
export default {
    install: (app) => {
        // 在这里编写插件代码
        app.component('CunWangChat',CunWangChat)
    }
}
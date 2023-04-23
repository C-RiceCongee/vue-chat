<template>
  <div>
    <cun-wang-chat
      @outappent=""
      :chatData="chatData"
      @send="send"
      @paste="paste"
    />
    <div class="user">
      <h2>在线用户{{ users.length }}</h2>
      <p>选择一个开始聊天！</p>
      <span
        v-for="item in users"
        :key="item.id"
        :class="{
          active: aim === item.name,
          current: currentUser === item.name,
        }"
        @click="sendAim(item)"
      >
        {{ item.name }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { uid } from "uid";
import { IChatData } from "./packages/CunWangChat/types";
import axios from "axios";
const chatData = ref<Array<IChatData>>([]);
const currentUser = uid(16);
const aim = ref<string>("");
let websocket: WebSocket | null = null;
const connectWebSocket = () => {
  websocket = new WebSocket(`ws://192.168.12.208:8080/ws?name=${currentUser}`);
  websocket.addEventListener("open", onOpen);
  websocket.addEventListener("message", onMessage);
  // websocket.addEventListener("error", onError);
  websocket.addEventListener("close", onClose);
};
function send(message: string) {
  chatData.value.push({
    avatar:
      "https://th.bing.com/th/id/OIP.3doVapf0YJnzW1K_gjT3yQHaFj?pid=ImgDet&rs=1",
    text: message,
    type: "receiver",
  });
  message += `#AIMS=${aim.value}=AIME#`;
  console.log(message);
  websocket?.send(message);
}

function paste() {
  // event: ClipboardEvent
  // navigator.clipboard.read().then(async clipboardItems=>{
  //   for (const clipboardItem of clipboardItems) {
  //   for (const type of clipboardItem.types) {
  //     if (type === 'image/png') {
  //       const blob = await clipboardItem.getType(type);
  //       const img = new Image();
  //       img.src = URL.createObjectURL(blob);
  //     }
  //   }
  // }
  // }).catch(e=>{
  //   console.log(e);
  // })
  // console.log(event);
}
const onOpen = () => {
  console.log(websocket);

  console.log("WebSocket connection onOpen.");
};

const onMessage = (event: MessageEvent) => {
  chatData.value.push({
    avatar:
      "https://th.bing.com/th/id/OIP.3doVapf0YJnzW1K_gjT3yQHaFj?pid=ImgDet&rs=1",
    text: event.data,
    type: "sender",
  });
};
const users = ref<Array<any>>([]);
const getUserList = async () => {
  const r = await axios({
    url: "http://192.168.12.208:8080/users",
    method: "get",
  });
  users.value = r.data;
};
// const onError = (event: ErrorEvent) => {
//   console.error("WebSocket error:", event);
// };

const onClose = (event: CloseEvent) => {
  console.log("WebSocket connection closed:", event.code, event.reason);
  connectWebSocket();
};
const sendAim = (v: { name: string }) => {
  if (v.name === currentUser) return;
  aim.value = v.name;
};
connectWebSocket();
setInterval(() => {
  getUserList();
}, 1000);
getUserList();
</script>
<style scoped lang="scss">
.current {
  background: #000;
  display: inline-block;
  color: #fff;
  padding: 10px;
  &::after {
    display: block;
    content: "(我自己)";
  }
}
.active {
  background: #f00;
  display: inline-block;
  color: #fff;
  transition: all ease-in 300ms;
  padding: 10px;
  &::after {
    display: block;
    content: "正在聊天...";
  }
}
.user {
  display: flex;
  flex-direction: column;
  width: 180px;
  transition: all ease-in 300ms;
  position: absolute;
  top: 0;
  left: 0;
  transform: translatex(-50%);
  &:hover {
    transform: translatex(10%);
  }
  span {
    margin: 10px 0;
    border: 3px dashed #f00;
    padding: 10px;
  }
}
</style>

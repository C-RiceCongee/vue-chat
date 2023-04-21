<template>
  <cun-wang-chat @outappent="" :chatData="chatData" @send="send" @paste="paste" />
</template>
<script setup lang="ts">
import { ref } from "vue";
import { IChatData } from "./packages/CunWangChat/types";
const chatData = ref<Array<IChatData>>([]);
let websocket: WebSocket | null = null;
const connectWebSocket = () => {
  websocket = new WebSocket("ws://localhost:8080/ws");
  websocket.addEventListener("open", onOpen);
  websocket.addEventListener("message", onMessage);
  websocket.addEventListener("error", onError);
  websocket.addEventListener("close", onClose);
};
function send(message: string) {
  chatData.value.push({
    avatar:
      "https://th.bing.com/th/id/OIP.3doVapf0YJnzW1K_gjT3yQHaFj?pid=ImgDet&rs=1",
    text: message,
    type: "receiver",
  });
  websocket?.send(message);
}

function paste(event:ClipboardEvent){
  navigator.clipboard.read().then(async clipboardItems=>{
    for (const clipboardItem of clipboardItems) {
    for (const type of clipboardItem.types) {
      if (type === 'image/png') {
        const blob = await clipboardItem.getType(type);
        const img = new Image();
        img.src = URL.createObjectURL(blob);
      }
    }
  }
  }).catch(e=>{
    console.log(e);
  })
  // console.log(event);
  
}
const onOpen = () => {
  console.log("WebSocket connection onOpen.");
};

const onMessage = (event:MessageEvent) => {
  chatData.value.push({
    avatar:
      "https://th.bing.com/th/id/OIP.3doVapf0YJnzW1K_gjT3yQHaFj?pid=ImgDet&rs=1",
    text: event.data,
    type: "sender",
  });
};

const onError = (event: ErrorEvent) => {
  console.error("WebSocket error:", event);
};

const onClose = (event: CloseEvent) => {
  console.log("WebSocket connection closed:", event.code, event.reason);
  connectWebSocket();
};

connectWebSocket();
</script>
<style scoped></style>

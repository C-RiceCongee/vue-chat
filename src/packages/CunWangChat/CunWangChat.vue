<template>
    <div>
        <div class="container" draggable="true">
            <div class="chart">
                <div v-for="item in props.chatData" :class="item.type">
                    <img draggable="true" class="avatar" :src="item.avatar" alt="">
                    <div class="context">
                        <img class="img"
                             src="https://th.bing.com/th/id/R.2ee68b020ec90e7bea434af3188ca331?rik=UMNZFdHrcqD%2fKQ&riu=http%3a%2f%2fwx3.sinaimg.cn%2fbmiddle%2f006fbYi5gy1g12aa9s0kuj30c80c8t9s.jpg&ehk=tsaWMWNkDM4SQOG6%2bjyZGAna6IkKzM8dx7anFq381K8%3d&risl=&pid=ImgRaw&r=0"
                             alt="">
                        <span class="text">{{ item.text }}</span>
                    </div>
                </div>
            </div>
            <div class="input">
                <div class="sendArea">
                    <i class="iconfont iconbtn icon-send"></i>
                    <emoji>
                        <template #ref>
                            <i class="iconfont iconbtn icon-biaoqing"></i>
                        </template>
                    </emoji>
                    <i class="iconfont iconbtn icon-wenjianjia"></i>
                </div>
                <div contenteditable="true" class="editor">
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Emoji from "./emoji.vue";
import {defineProps, withDefaults} from "vue"

type role = "sender" | "receiver"

interface IChatData {
    text: string,
    img: string,
    type: role
}

interface props {
    chatData: Array<IChatData>
}

const props = withDefaults(defineProps<props>(), {
    chatData() {
        return [
            {
                avatar: "https://th.bing.com/th/id/OIP.3doVapf0YJnzW1K_gjT3yQHaFj?pid=ImgDet&rs=1",
                text: "兰亭临帖 行书如行云流水",
                img: "2",
                type: "sender"
            },
            {
                avatar: "https://th.bing.com/th/id/OIP.3doVapf0YJnzW1K_gjT3yQHaFj?pid=ImgDet&rs=1",
                text: "月下门推 心细如你脚步碎",
                img: "2",
                type: "receiver"
            },
            {
                avatar: "https://th.bing.com/th/id/OIP.3doVapf0YJnzW1K_gjT3yQHaFj?pid=ImgDet&rs=1",
                text: "忙不迭 千年碑易拓 却难拓你的美",
                img: "2",
                type: "receiver"
            },
            {
                avatar: "https://th.bing.com/th/id/OIP.3doVapf0YJnzW1K_gjT3yQHaFj?pid=ImgDet&rs=1",
                text: "真迹绝 真心能给谁",
                img: "2",
                type: "sender"
            }
        ]
    }
})
</script>

<style scoped lang="scss">
@import "style/iconfont.css";

.container {
  width: 500px;
  height: calc(100vh - 300px);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 0px 12px #97a8b4;
  position: fixed;
  right: 50px;
  bottom: 50px;
  overflow: hidden;
  box-sizing: border-box;

  .chart {
    padding: 15px;
    overflow: scroll;
    height: 100%;
    &::-webkit-scrollbar {
    }
  }

  .input {
    display: flex;
    flex-direction: column;
    height: 30%;
    background: #fff;
    position: absolute;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;

    .editor {
      flex: 1;
      padding: 0 15px;
      overflow: scroll;
      outline: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .sendArea {
      text-align: center;
      display: flex;
      align-content: center;
      padding: 10px;
      border-top: 1px solid #eee;

      .iconbtn {
        font-size: 18px;
        margin: 0 5px;
        cursor: pointer;
        padding: 5px;
        color: #97a8b4;

        &:hover {
          background: #000;
          color: #f6e8e8;
          border-radius: 3px;
        }
      }
    }
  }
}

.sender, .receiver {
  display: flex;
  align-items: center;
  width: auto;
  margin: 8px 0;

  .context {
    display: inline-block;
      width: auto;
    background: #eee;
    padding: 10px;
    margin: 0 10px;
    border-radius: 12px;
    .text {
    }
    .img {
      width: 30%;
      display: block;
    }
  }


  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }
}

.receiver {
  flex-direction: row-reverse;
    .context{
    }
}
</style>
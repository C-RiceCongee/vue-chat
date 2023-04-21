<template>
    <div class="emojiContainer">
        <div :class="{'emoji':true,showRef:showRef}">
            <div class="emoji-i" v-for="(item,index) in emoji.emoji" :key="index">
                <span class="em">{{ item }}</span>
            </div>
        </div>
        <div class="trigger" @click="toggleStatus">
            <slot name="ref">
            </slot>
        </div>
    </div>
</template>
<script setup lang="ts">
import emoji from 'node-emoji'
import {ref, Ref} from "vue";

const showRef: Ref<boolean> = ref(false);
const toggleStatus = () => {
    showRef.value = !showRef.value
}
</script>

<style scoped lang="scss">
.emojiContainer {
  position: relative;
}

.emoji {
  flex-wrap: wrap;
  width: 300px;
  justify-content: center;
  height: 200px;
  overflow: scroll;
  position: absolute;
  top: -200px;
  display: none;


  &::-webkit-scrollbar {
    width: 1px;
    height: 0;
  }

  &::-webkit-scrollbar-thumb {
    height: 50px;
    background: linear-gradient(left, transparent, #000, transparent);
  }

  &.showRef {
    display: flex;
    box-shadow: 0 0 5px #afafaf;
    border-radius: 12px;
    padding: 10px;
    box-sizing: border-box;
    background: #ffffff;
    .em {
      font-size: 22px;
      padding: 4px;
      display: block;
      border-radius: 6px;
      cursor: pointer;

      &:hover {
        background: #e5d8d8;
      }
    }
  }
}

.trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  //&::after {
  //    content: "";
  //    display: block;
  //    position: absolute;
  //    width: 50px;
  //    z-index: -1;
  //    height: 50px;
  //    box-shadow: 0px 0px 5px #676755;
  //    transform: rotate(40deg);
  //    left: 1%;
  //    top: -20%;
  //}
}
</style>
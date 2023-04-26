<template>
  <div>
    <div ref="contianerRef" class="container">
      <div class="chart" ref="chartRef">
        <div v-for="item in chatData" :class="item.type">
          <img draggable="true" class="avatar" :src="item.avatar" alt="" />
          <div class="context" v-html="item.text"></div>
        </div>
      </div>
      <div class="input">
        <div class="sendArea">
          <i class="iconfont iconbtn icon-send" @click="emitsSend"></i>
          <emoji @select="selectEmoji">
            <template #ref>
              <i class="iconfont iconbtn icon-biaoqing"></i>
            </template>
          </emoji>
          <i class="iconfont iconbtn icon-wenjianjia" @click="chooseFile"></i>
        </div>
        <div contenteditable="true" class="editor" ref="editorRef"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Emoji from "./emoji.vue";
import {
  defineProps,
  nextTick,
  onMounted,
  ref,
  watch,
  withDefaults,
} from "vue";
import { IChatData } from "./types";
import { base642File, formatFileSize } from "./utils";
import { uploadFile } from "./utils";
import { TRUE } from "sass";

interface props {
  chatData: Array<IChatData>;
}

const props = withDefaults(defineProps<props>(), {
  chatData() {
    return [];
  },
});
const editorRef = ref<HTMLElement | null>(null);
const chartRef = ref<HTMLElement | null>(null);
const contianerRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!editorRef.value) return;
  editorRef.value.addEventListener("paste", handlePaste);
});

const emits = defineEmits(["send", "paste"]);
function handlePaste(event: ClipboardEvent) {
  emits("paste", event);
}
const selectEmoji = (select: string, key: string) => {
  if (editorRef.value) {
    editorRef.value.innerHTML += ` <emoje emoje="${key}">${select}</emoje> `;
    console.log(select);
  }
};
// 处理为最终的 innerHTML
// const renderHandler = ()=>{

// }
const emitsSend = () => {
  if (
    editorRef.value &&
    chartRef.value &&
    editorRef.value.innerHTML.replace(/&nbsp;/g, " ").trim().length > 0
  ) {
    // 处理表情包
    // 首先吧全部的span匹配处理出来，然后替换成 key
    // const regexEmoje = /<emoje.*?>(.*?)<\/emoje>/g;
    const imgTagReg = /<img.*?src="(.*?)".*?>/g;
    const imgMatchSrc = /<img.*?src="(.*?)".*?>/;
    let innerHTML = editorRef.value.innerHTML as string;
    const matchImgTags = innerHTML.match(imgTagReg) || [];
    const srcs: Array<Promise<any>> = [];
    if (matchImgTags.length > 0) {
      // 有图片就把全部的图片转了文件！
      for (let i = 0; i < matchImgTags.length; i++) {
        const b64 = matchImgTags[i].match(imgMatchSrc) || [];
        if (b64.length > 1) {
          srcs.push(uploadFile(base642File(b64[1])));
        }
      }
      Promise.all(srcs).then((r) => {
        r.forEach((v) => {
          const src = `<img src="http://192.168.12.208:8080${v.path}" style="width:100%"/>`;
          innerHTML = innerHTML.replace(imgTagReg, src);
          emits("send", innerHTML);
          resetEditor();
        });
      });
    } else {
      emits("send", innerHTML);
      resetEditor();
    }
  }
};
const resetEditor = () => {
  if (editorRef.value) {
    editorRef.value.innerHTML = "";
  }
};
// Listen for new chat content and reset the scroll position
watch(
  props.chatData,
  () => {
    setTimeout(() => {
      scrollToBottom();
    }, 300);
  },
  {
    deep: true,
  }
);
const scrollToBottom = () => {
  nextTick(() => {
    if (chartRef.value) {
      chartRef.value.scrollTo({
        top: chartRef.value.scrollHeight,
        behavior: "smooth",
      });
    }
  });
};
const chooseFile = async () => {
  const options = {
    types: [
      {
        description: "这只是一个描述",
        accept: {},
      },
    ],
    excludeAcceptAllOption: false, // 有一个选项的按钮
    multiple: false,
  };
  try {
    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "none";
    document.body.appendChild(input);
    input.addEventListener("change", async () => {
      const flist = input.files || [];
      if (flist.length < 1) return;
      const f = flist[0];
      const fsize = formatFileSize(f.size);
      const r: any = await uploadFile(f);
      const a = document.createElement("a");
      const div = document.createElement("div");
      const icon = document.createElement("i");
      const fragment = document.createDocumentFragment();
      icon.setAttribute("class", "iconfont fileicon iconfont-wenjian");
      icon.style.marginRight = "6px";
      a.href = `http://192.168.12.208:8080${r.path}`;
      a.target = "__blank";
      a.innerHTML = f.name + `(${fsize})`;
      a.style.color = "#fff";
      a.style.textDecoration = "none";
      a.classList.add("attach");
      div.appendChild(icon);
      div.appendChild(a);
      fragment.appendChild(div);
      div.style.background = "green";
      div.style.color = "#eee";
      div.style.padding = "10px";
      div.style.borderRadius = "10px";
      div.style.display = "inline-block";
      div.style.maxWidth = "100%";
      editorRef.value?.appendChild(fragment);
    });
    input.click();
    document.body.removeChild(input);
  } catch (error) {
    console.error(error);
  }
};
let isDraging = false;
let startX: number, startY: number, containerX: number, containerY: number;
const MouseMoveHandler = (e: MouseEvent) => {
  const c = contianerRef.value;
  if (!isDraging || !c) return;
  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;
  c.style.left = containerX + deltaX + "px";
  c.style.top = containerY + deltaY + "px";
};
const MouseUpHandler = (e: MouseEvent) => {
  console.log("起来");
  isDraging = false;
  document.body.style.cursor = "default"
  document.removeEventListener("mousemove", MouseMoveHandler);
};
const MouseDownHandler = (e: MouseEvent) => {
  const c = contianerRef.value;
  if (!c) return;
  isDraging = true;
  document.body.style.cursor = "grab"
  startX = e.clientX;
  startY = e.clientY;
  containerX = c.offsetLeft;
  containerY = c.offsetTop;
  document.addEventListener("mousemove", MouseMoveHandler);
  document.addEventListener("mouseup", MouseUpHandler);
};
onMounted(() => {
  contianerRef.value?.addEventListener("mousedown", MouseDownHandler);
});
</script>

<style lang="scss">
.attach {
  text-decoration: none !important;
  display: inline-block;
  font-size: 12px;
}
.fileicon {
  font-size: 18px;
}
.fileicon::before {
  content: "\ec17";
}
@import "style/iconfont.css";
$shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
  rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
.container {
  width: 30vw;
  height: 60vh;
  background: #fff;
  border-radius: 12px;
  box-shadow: $shadow;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  box-sizing: border-box;

  .chart {
    overflow: scroll;
    height: 70%;
    padding: 10px;
    box-sizing: border-box;
    &::-webkit-scrollbar {
      display: none;
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
    img {
      width: 100%;
    }
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
@media screen and (max-width: 800px) {
  .container {
    width: 50%;
  }
}
.sender,
.receiver {
  display: flex;
  align-items: center;
  width: auto;
  margin: 8px 0;

  .context {
    max-width: 60%;
    background: #eee;
    padding: 3px;
    margin: 0 10px;
    border-radius: 8px;
    .text {
    }
    img {
      display: block;
      width: 100%;
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
  .context {
    flex-direction: row-reverse;
  }
}
</style>

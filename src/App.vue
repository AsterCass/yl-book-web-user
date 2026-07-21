<template>
  <router-view/>
</template>

<script setup>
import {RouterView} from "vue-router";
import {onBeforeUnmount, onMounted} from "vue";
import emitter from "@/utils/bus.js";
import {initGlobalState} from "@/utils/global-tools.js";


function screenEventHandler() {
  emitter.emit("screenResizeEvent")
}


onMounted(() => {
  initGlobalState()
  //resize
  window.addEventListener("resize", screenEventHandler);
})


onBeforeUnmount(() => {
  //resize
  window.removeEventListener("resize", screenEventHandler);
})
</script>

<style lang="scss">
@use "@fontsource/roboto-slab/index.css";
@use "@/styles/base-components";
@use "@/styles/extra-components";
@use "@/styles/override-components";
// markdown 渲染样式（政策弹窗 / 独立政策页共用，v-html 内容须全局命中）
@use "@/styles/base-marked";


</style>
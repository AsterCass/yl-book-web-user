<template>

  <q-layout class="fixed-full column" view="hhh lpr fff"
            style="background-color: rgba(var(--background-color));background-image: url('/img/chatroom-bg.png'); min-height: 0!important;">

    <zyy-header/>

    <div class="col relative-position" style="margin: 2rem 0 1rem 0; overflow-x: hidden">
      <!-- dataVersion 变化（切换租户/门店）时强制重挂载当前页面，重新执行各页面 onMounted 中的查询逻辑 -->
      <router-view :key="globalState.dataVersion"/>
    </div>


    <zyy-footer/>

  </q-layout>

</template>


<script setup>
import ZyyHeader from "@/ui/views/ZyyHeader.vue";
import ZyyFooter from "@/ui/views/ZyyFooter.vue";
import {useGlobalStateStore} from "@/utils/global-state.js";

const globalState = useGlobalStateStore();
</script>


<style scoped lang="scss">


</style>
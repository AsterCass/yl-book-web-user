<template>

  <q-layout class="fixed-full column" view="hhh lpr fff"
            style="background-color: rgba(var(--background-color));background-image: url('/img/bg.png'); min-height: 0!important;">

    <zyy-header/>

    <div class="col relative-position" style="margin: 3rem 0 0 0; overflow-x: hidden">
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
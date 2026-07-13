<template>
  <q-header class="top-semi-trans-header-base-mini">

    <div class="top-semi-trans-header-base-content row justify-between items-center top-semi-trans-header-base-no-top">

      <div class="row items-center justify-start col">
        <q-btn no-caps unelevated class="component-none-btn-grow q-mx-xs"
               @click="upOneLevel">
          <div class="row items-center">
            <div class="q-ma-xs">
              {{ $t('main_header_back_pre') }}
            </div>
          </div>
        </q-btn>


      </div>

      <div class="row items-center justify-center " style="font-size: 1.15rem; font-weight: 500">
        {{ $t(thisRouter.currentRoute.value.meta.header)}}
      </div>

      <div class="row items-center justify-end col">



        <q-btn round style="margin: 0 1.5rem 0 1.5rem" color="transparent" size="11px" flat
               @click="emitter.emit('showUserSettingEvent')">
          <q-avatar size="33px">
            <q-img src="/favicon.svg"/>
          </q-avatar>

        </q-btn>

        <q-btn no-caps unelevated class="component-none-btn-grow q-mx-xs" @click="switchLanguage()">
          <div class="row items-center q-ma-xs">
            <q-icon name="fa-solid fa-language" size="1.75rem"/>
          </div>
        </q-btn>

        <q-btn no-caps unelevated class="q-mx-xs" dense round @click="notifyTopWarning($t('in_develop'))">
          <div class="row items-center q-ma-xs">
            <q-icon name="fa-solid fa-gear" size="1.25rem"/>
          </div>
        </q-btn>


      </div>
    </div>


  </q-header>
</template>

<script setup>

import {onMounted} from "vue";
import {backToLogin, toParentPage} from "@/router/index.js";
import {useRouter} from "vue-router";
import {notifyTopWarning} from "@/utils/notification-tools.js";
import {useGlobalStateStore} from "@/utils/global-state.js";
import {i18n} from "@/i18n/index.js";
import {switchLanguage} from "@/utils/global-tools.js";
import emitter from "@/utils/bus.js";

const t = i18n.global.t
const thisRouter = useRouter()
const globalState = useGlobalStateStore();

function upOneLevel() {
  toParentPage(thisRouter)
}

function checkLogin() {
  // const isLogin = checkLoginFromCookie()
  // if (!isLogin) {
  //   backToLogin(thisRouter)
  // }
  // userIsLogin().then(res => {
  //   if (!res || !res.data || !res.data.data) {
  //     backToLogin(thisRouter)
  //   }
  // })
}

onMounted(() => {
  checkLogin()
})


</script>


<style scoped lang="scss">


.top-semi-trans-header-base-mini {
  background-color: transparent;
  left: 0;
  right: 0;
  margin: 1rem 4rem;
  min-height: 4rem;
  position: fixed;

  .top-semi-trans-header-base-content {
    min-height: 4rem;
    padding: 0 1rem;
    border-radius: 8px;
    transition: background-color 1s ease, box-shadow 1s ease;
  }
}

.top-semi-trans-header-base-no-top {
  color: rgb(var(--text-color));
  background-color: rgb(var(--container-background-color));
  box-shadow: inset 0 0 1px 1px rgb(var(--background-color));
  backdrop-filter: saturate(200%) blur(30px);
}


</style>


<style lang="scss">


.top-semi-trans-header-base-mini {
  .q-btn {
    font-size: 1rem;
  }
}
</style>
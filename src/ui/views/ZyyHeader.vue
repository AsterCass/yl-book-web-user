<template>
  <q-header class="top-semi-trans-header-base-mini row items-center justify-center">

    <div
        class="col-lg-6 col-md-8 col-12 top-semi-trans-header-base-content row justify-between items-center top-semi-trans-header-base-no-top">

      <div class="row items-center justify-start">
        <q-btn no-caps unelevated class="component-none-btn-grow q-mx-xs" @click="switchLanguage()">
          <q-icon name="fa-solid fa-language" size="1.6rem"/>
        </q-btn>
        <q-btn no-caps unelevated class="component-none-btn-grow q-mx-xs" @click="switchTheme()">
          <q-icon name="fa-solid fa-circle-half-stroke" size="1.25rem"/>
        </q-btn>
      </div>

      <div class="col">
      </div>

      <div class="row items-center justify-start">
        <q-btn no-caps unelevated class=" component-full-btn-mini-mini-grow" :label="$t('main_logout')"
               @click="logoutMethod">
        </q-btn>
      </div>
    </div>
  </q-header>
</template>

<script setup>

import {onMounted} from "vue";
import {useRouter} from "vue-router";
import {useGlobalStateStore} from "@/utils/global-state.js";
import {i18n} from "@/i18n/index.js";
import {switchLanguage, switchTheme} from "@/utils/global-tools.js";
import {portalLogout, portalMe} from "@/api/portal-auth.js";
import {notifyTopPositive} from "@/utils/notification-tools.js";
import {backToLogin} from "@/router/index.js";

const t = i18n.global.t
const thisRouter = useRouter()
const globalState = useGlobalStateStore();

function checkLogin() {
  if (!globalState.userData) {
    backToLogin(thisRouter)
    return
  }
  portalMe().then(res => {
    if (!res || !res.data || !res.data.data) {
      backToLogin(thisRouter)
    }
    globalState.updateUserData(res.data.data);
  })
}

function logoutMethod() {
  portalLogout().then(res => {
    if (!res || !res.data) {
      return
    }
    globalState.updateLoginToken(null)
    globalState.updateUserData(null)
    notifyTopPositive(t('main_login_success_logout'))
    backToLogin(thisRouter)
  })
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
  min-height: 4rem;
  position: fixed;

  .top-semi-trans-header-base-content {
    min-height: 4rem;
    padding: 0 1rem;
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
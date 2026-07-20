<template>

  <div class="login-page column"
       style="min-height: 100vh; background-color: rgba(var(--background-color)); background-image: url('/img/bg.png');">

    <!-- 顶部：语言 / 主题切换 -->
    <div class="login-topbar full-width row items-center q-px-md">
      <q-btn no-caps unelevated class="component-none-btn-grow q-mx-xs" @click="switchLanguage()">
        <q-icon name="fa-solid fa-language" size="1.6rem"/>
      </q-btn>
      <q-btn no-caps unelevated class="component-none-btn-grow q-mx-xs" @click="switchTheme()">
        <q-icon name="fa-solid fa-circle-half-stroke" size="1.25rem"/>
      </q-btn>
    </div>

    <!-- 中部：登录 / 注册 / 重置密码 卡片（可滚动，移动端自适应） -->
    <div class="login-body">
      <transition name="fade-slide" mode="out-in" appear>
        <zyy-login-card v-if="mode === 'login'" key="login"
                        @success="handleSuccess" @switch="mode = $event"/>
        <zyy-register-card v-else-if="mode === 'register'" key="register"
                           @success="handleSuccess" @switch="mode = $event"/>
        <zyy-reset-card v-else key="reset"
                        @success="handleSuccess" @switch="mode = $event"/>
      </transition>
    </div>

    <zyy-footer/>

    <!-- 首次访问本站海报（q-dialog 自带遮罩，移动端自适应，带明显关闭按钮） -->
    <q-dialog v-model="showPoster" transition-show="scale" transition-hide="fade">
      <div class="login-poster relative-position">
        <img src="/img/poster.jpg" alt="" class="login-poster-img"/>
        <q-icon class="cask-cursor-pointer absolute-top-right  login-poster-close" name="fa-solid fa-xmark"
                size="1.8rem" color="negative" @click="showPoster = false"/>
      </div>
    </q-dialog>

  </div>

</template>


<script setup>

import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import ZyyFooter from "@/ui/views/ZyyFooter.vue";
import ZyyLoginCard from "@/ui/views/login/ZyyLoginCard.vue";
import ZyyRegisterCard from "@/ui/views/login/ZyyRegisterCard.vue";
import ZyyResetCard from "@/ui/views/login/ZyyResetCard.vue";
import {switchLanguage, switchTheme} from "@/utils/global-tools.js";
import {backToHome} from "@/router/index.js";
import {useGlobalStateStore} from "@/utils/global-state.js";

const thisRouter = useRouter()
const globalState = useGlobalStateStore()

// 'login' | 'register' | 'reset'
const mode = ref('login')

const showPoster = ref(false)

// 各卡片自行完成鉴权与用户态写入，成功后父级统一跳转首页
function handleSuccess() {
  backToHome(thisRouter)
}

onMounted(() => {
  // 首次访问本站弹一次海报，随即持久化标记，刷新/再次进入不再弹
  if (!globalState.visited) {
    showPoster.value = true
    globalState.markVisited()
  }
})

</script>


<style lang="scss">

.login-topbar {
  height: 4rem;
  color: rgb(var(--text-color));
}

.login-body {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.75rem 1.5rem 0.75rem;
}

.login-card {
  width: 400px;
  max-width: 92vw;

  color: rgb(var(--text-color));
  border-radius: 12px;
  background-color: rgb(var(--container-background-color));
  backdrop-filter: blur(30px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, .12);
  padding: 28px 6px 10px 6px;

  font-size: .9rem;
}

// 登录 / 注册 / 重置 切换过渡
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity .35s ease, transform .35s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

// 首次访问海报：等比缩放至视口内，桌面适中、移动端近满宽
.login-poster {
  position: relative;
  display: flex;
  max-width: 92vw;
  max-height: 86vh;
}

.login-poster-img {
  display: block;
  width: auto;
  height: auto;
  max-width: min(92vw, 520px);
  max-height: 86vh;
  border-radius: 12px;
  object-fit: contain;
}

.login-poster-close {
  right: .5rem !important;
  top: .5rem !important;
}
</style>

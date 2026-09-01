<template>

  <!-- 「Do Not Sell or Share My Personal Information」页（/do-not-sell）：
       站点用 Meta Pixel 做广告衡量，向 Meta 发送页面浏览与预约步骤事件——加州等州法把这归为
       「分享个人信息用于跨上下文行为广告」，须提供显著的退出入口，本页即是。
       两条退出途径：浏览器的 GPC 信号（自动生效、优先级最高）+ 本页开关（存本机 localStorage）。
       样式跟随首页推广风格（WebPromo）：固定亮色、#cc2e2d 主色、白底卡片 -->
  <div class="dns-page column items-center">

    <div class="dns-topbar full-width row items-center q-px-md">
      <q-btn no-caps unelevated flat class="q-mx-xs" @click="switchLanguage()">
        <q-icon name="fa-solid fa-language" size="1.6rem"/>
      </q-btn>
    </div>

    <div class="column items-center q-px-md text-center">
      <img src="/favicon.svg" alt="" class="dns-brand-icon"/>
      <h4 class="dns-brand-title">{{ $t('main_login_title') }}</h4>
      <div class="dns-subtitle q-mt-md">{{ $t('doNotSell.title') }}</div>
    </div>

    <div class="dns-card column q-my-lg">

      <div class="dns-muted">{{ $t('doNotSell.intro') }}</div>
      <div class="dns-muted q-mt-sm">{{ $t('doNotSell.scope') }}</div>

      <!-- 浏览器已发 GPC：已经自动退出，开关不再有意义，只如实说明 -->
      <div v-if="gpc" class="dns-notes q-px-md q-py-sm q-mt-lg row items-start no-wrap">
        <q-icon name="fa-solid fa-shield-halved" size="1rem" class="q-mr-sm q-mt-xs dns-accent"/>
        <div>{{ $t('doNotSell.gpc_on') }}</div>
      </div>

      <template v-else>
        <div class="dns-toggle q-mt-lg row items-center no-wrap">
          <q-toggle v-model="optOut" color="red-8" @update:model-value="onToggle"/>
          <div class="col q-ml-sm">{{ $t('doNotSell.toggle_label') }}</div>
        </div>
        <div class="dns-muted q-mt-sm" style="font-size: .9rem">
          {{ optOut ? $t('doNotSell.state_out') : $t('doNotSell.state_in') }}
        </div>
        <div class="dns-muted q-mt-sm" style="font-size: .85rem">{{ $t('doNotSell.device_note') }}</div>
      </template>

      <div class="dns-muted q-mt-lg" style="font-size: .85rem">
        {{ $t('doNotSell.email_note') }}
      </div>

      <button class="dns-ghost-btn q-mt-lg" @click="goHome">{{ $t('doNotSell.back_home') }}</button>

    </div>

    <q-space/>

    <div class="dns-copy full-width q-py-md text-center">
      © {{ curYear }} {{ $t('main_login_title') }}
    </div>

  </div>

</template>


<script setup>

import {ref} from "vue";
import {useRouter} from "vue-router";
import {switchLanguage} from "@/utils/global-tools.js";
import {notifyTopPositive, notifyTopWarning} from "@/utils/notification-tools.js";
import {i18n} from "@/i18n/index.js";
import {isAdOptedOut, isGpcEnabled, setAdOptOut} from "@/utils/pixel.js";

const t = i18n.global.t
const thisRouter = useRouter()

const curYear = new Date().getFullYear()

const gpc = ref(isGpcEnabled())
const optOut = ref(isAdOptedOut())

/**
 * 切换后立刻刷新页面：Pixel 脚本一旦注入就无法真正卸载，只有重新加载才能保证「退出后这台设备上
 * 一行 Meta 代码都不再运行」。反向打开时同理，刷新后才会重新注入。
 */
function onToggle(value) {
  if (!setAdOptOut(value)) {
    // 隐私模式等场景下 localStorage 不可写：如实告知，不要假装已保存
    optOut.value = !value
    notifyTopWarning(t('doNotSell.save_failed'))
    return
  }
  notifyTopPositive(value ? t('doNotSell.saved_out') : t('doNotSell.saved_in'))
  setTimeout(() => window.location.reload(), 600)
}

function goHome() {
  thisRouter.push({name: 'index'})
}

</script>


<style scoped lang="scss">

// 与首页（WebPromo）同款固定配色
$dns-red: #cc2e2d;

.dns-page {
  min-height: 100vh;
  background-color: #fff;
  color: #555;
  font-family: Roboto Slab, sans-serif;
}

.dns-topbar {
  height: 4rem;
  color: #333;
}

.dns-accent {
  color: $dns-red;
}

.dns-muted {
  opacity: 0.75;
  line-height: 1.7;
}

.dns-brand-icon {
  width: clamp(3rem, 8vw, 4.5rem);
  height: auto;
}

.dns-brand-title {
  color: #333;
  margin: 0 !important;
  font-size: clamp(1.6rem, 5vw, 2.6rem) !important;
  font-weight: 800 !important;
}

.dns-subtitle {
  font-size: 1.1rem;
  font-weight: 700;
  color: $dns-red;
  max-width: 34rem;
}

.dns-card {
  width: min(94vw, 38rem);
  background: #fff;
  border: 1px solid #e6e8ec;
  border-radius: 1rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, .07);
  padding: 1.5rem;
}

.dns-notes {
  background: #fdf3f3;
  border: 1px solid rgba(204, 46, 45, .25);
  border-radius: .8rem;
  color: #555;
  font-size: .95rem;
  line-height: 1.7;
}

.dns-toggle {
  font-weight: 600;
  color: #333;
}

.dns-ghost-btn {
  width: 100%;
  background: #fff;
  color: $dns-red;
  border: 2px solid $dns-red;
  border-radius: .6rem;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  padding: .6rem 2rem;
  cursor: pointer;
  transition: background-color .25s ease;

  &:hover {
    background-color: #fdf3f3;
  }
}

.dns-copy {
  color: #555;
  font-size: .85rem;
}

</style>

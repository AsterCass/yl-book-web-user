<template>

  <!-- 官网首页（落地页）：免登录可访问 -->
  <div class="home-page column"
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

    <div class="home-body column items-center">

      <!-- 首屏：本应用是做什么的、给谁用、提供什么功能 -->
      <div class="home-hero column items-center text-center">
        <h2>{{ $t('home.hero_title') }}</h2>
        <div class="home-hero-sub q-mt-sm">{{ $t('home.what') }}</div>
        <div class="home-hero-sub q-mt-xs">{{ $t('home.who') }}</div>

        <div class="row justify-center q-mt-md">
          <div v-for="f in featureList" :key="f.titleKey" class="row items-center q-mx-md q-my-xs">
            <q-icon name="fa-solid fa-circle-check" size=".9rem" class="q-mr-xs" style="opacity: .7"/>
            <div style="font-size: .9rem">{{ $t(f.titleKey) }}</div>
          </div>
        </div>

        <div class="row justify-center items-center q-mt-lg">
          <q-btn no-caps unelevated class="q-mx-sm shadow-2 component-full-btn-grow"
                 style="background-color: rgb(var(--semi-bg-container-background-color)) !important"
                 :label="$t('home.cta_book')" @click="goBook"/>
        </div>

        <!-- 政策链接（免登录可访问的独立页面） -->
        <div class="row justify-center q-mt-md" style="font-size: .8rem">
          <router-link :to="{name: 'policyTerms'}" class="cask-jump-link-in-text q-mx-sm">
            {{ $t('policy.terms') }}
          </router-link>
          <router-link :to="{name: 'policyPrivacy'}" class="cask-jump-link-in-text q-mx-sm">
            {{ $t('policy.privacy') }}
          </router-link>
        </div>
      </div>

      <!-- 功能说明 -->
      <div class="home-section row">
        <div v-for="f in featureList" :key="f.titleKey" class="col-12 col-md-4 q-pa-sm">
          <div class="home-card column items-center text-center full-height">
            <q-icon :name="f.icon" size="1.8rem" class="q-mb-sm" style="opacity: .8"/>
            <div class="cask-general-little-title">{{ $t(f.titleKey) }}</div>
            <div class="q-mt-xs" style="opacity: .65; font-size: .85rem">{{ $t(f.descKey) }}</div>
          </div>
        </div>
      </div>

      <!-- 服务项目（按类别分组，配置见 constants/home-content.js） -->
      <div class="home-section">
        <div class="row justify-center"><h3>{{ $t('home.services_title') }}</h3></div>
        <div class="row justify-center q-mb-sm text-center" style="opacity: .6; font-size: .8rem">
          {{ $t('home.services_note') }}
        </div>

        <div v-for="group in serviceGroups" :key="group.id" class="q-mb-md">
          <div class="row items-center q-mb-xs q-px-sm">
            <q-icon :name="group.icon" size="1rem" class="q-mr-sm" style="opacity: .75"/>
            <div class="cask-general-little-title">{{ lv(group.title) }}</div>
          </div>
          <div class="row">
            <div v-for="item in group.items" :key="item.name.en" class="col-12 col-sm-6 col-md-4 q-pa-sm">
              <div class="home-card row items-center justify-between full-height home-service-card">
                <div class="col">
                  <div style="font-size: .9rem">{{ lv(item.name) }}</div>
                  <div style="opacity: .55; font-size: .78rem">
                    {{ item.minutes }} {{ $t('booking.minutes') }}
                  </div>
                </div>
                <div class="q-ml-sm" style="font-weight: 600">{{ item.price }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 门店信息（配置列表驱动，新增门店直接加配置） -->
      <div class="home-section">
        <div class="row justify-center"><h3>{{ $t('home.info_title') }}</h3></div>
        <div class="row">
          <div v-for="store in storeList" :key="store.id" class="col-12 col-md-6 q-pa-sm">
            <div class="home-card column full-height">
              <div class="row items-center q-mb-sm">
                <q-icon name="fa-solid fa-store" size="1rem" class="q-mr-sm" style="opacity: .75"/>
                <div class="cask-general-little-title">{{ lv(store.name) }}</div>
              </div>
              <q-separator class="component-separator-base q-mb-sm" size="1px"/>
              <div class="row items-start q-my-xs">
                <q-icon name="fa-solid fa-location-dot" size=".9rem" class="q-mr-sm q-mt-xs" style="opacity: .6"/>
                <div class="col">{{ $t('home.info.address_label') }}{{ store.address }}</div>
              </div>
              <div class="row items-center q-my-xs">
                <q-icon name="fa-solid fa-phone" size=".9rem" class="q-mr-sm" style="opacity: .6"/>
                <div>{{ $t('home.info.phone_label') }}{{ store.phone }}</div>
              </div>
              <div class="row items-center q-my-xs">
                <q-icon name="fa-regular fa-clock" size=".9rem" class="q-mr-sm" style="opacity: .6"/>
                <div>{{ $t('home.info.hours_label') }}{{ lv(store.hours) }}</div>
              </div>
              <div v-if="store.insurance" class="row items-start q-my-xs">
                <q-icon name="fa-solid fa-briefcase-medical" size=".9rem" class="q-mr-sm q-mt-xs" style="opacity: .6"/>
                <div class="col">{{ $t('home.info.insurance_label') }}{{ store.insurance }}</div>
              </div>
              <div v-if="store.notes" class="row items-start q-my-xs">
                <q-icon name="fa-solid fa-ticket" size=".9rem" class="q-mr-sm q-mt-xs" style="opacity: .6"/>
                <div class="col">{{ lv(store.notes) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <zyy-footer/>

  </div>

</template>


<script setup>

import {useRouter} from "vue-router";
import ZyyFooter from "@/ui/views/ZyyFooter.vue";
import {switchLanguage, switchTheme} from "@/utils/global-tools.js";
import {toSpecifyPage} from "@/router/index.js";
import {useGlobalStateStore} from "@/utils/global-state.js";
import {i18n} from "@/i18n/index.js";
import {HOME_SERVICE_GROUPS, HOME_STORES} from "@/constants/home-content.js";

const globalState = useGlobalStateStore()
const thisRouter = useRouter()

const storeList = HOME_STORES
const serviceGroups = HOME_SERVICE_GROUPS

const featureList = [
  {icon: 'fa-solid fa-store', titleKey: 'home.feature.f1_title', descKey: 'home.feature.f1_desc'},
  {icon: 'fa-solid fa-calendar-check', titleKey: 'home.feature.f2_title', descKey: 'home.feature.f2_desc'},
  {icon: 'fa-solid fa-list-check', titleKey: 'home.feature.f3_title', descKey: 'home.feature.f3_desc'},
]

// 配置中的可本地化字段（{zh, en}）按当前语言取值；模板中调用会随语言切换响应式更新
function lv(field) {
  return field[i18n.global.locale.value === 'zh' ? 'zh' : 'en']
}

// 已登录直接进预约（仪表盘），未登录去登录页
function goBook() {
  toSpecifyPage(thisRouter, globalState.userData ? 'main' : 'login')
}

</script>


<style lang="scss">

.home-body {
  flex: 1 0 auto;
  padding: 0 0.75rem 2rem 0.75rem;
}

.home-hero {
  max-width: 860px;
  padding: 2.5rem 0.5rem 1rem 0.5rem;

  .home-hero-sub {
    opacity: .7;
    line-height: 1.7;
  }
}

.home-section {
  width: min(94vw, 1080px);
  margin-top: 2rem;
}

// 与登录/预约卡片同一套视觉语言
.home-card {
  color: rgb(var(--text-color));
  border-radius: 12px;
  background-color: rgb(var(--container-background-color));
  backdrop-filter: blur(30px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, .12);
  padding: 1rem 1.25rem;
  transition: transform .35s ease;

  &:hover {
    transform: translateY(-3px);
  }
}

.home-service-card {
  padding: .75rem 1rem;
}

</style>

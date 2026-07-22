<template>

  <!-- 推广页（/promo）：版式/配色/图片参照 buildhealth 官网（Inter 字体、#cc2e2d 主色、白底分区、灰色页脚），
       数据（门店/服务/评价）全部来自 constants/home-content.js 配置 -->
  <div class="promo-page column relative-position">

    <!-- 顶部悬浮：语言 / 主题切换（压在 Hero 图上） -->
    <div class="promo-topbar full-width row items-center q-px-md">
      <q-btn no-caps unelevated class="component-none-btn-grow q-mx-xs" @click="switchLanguage()">
        <q-icon name="fa-solid fa-language" size="1.6rem"/>
      </q-btn>
    </div>

    <!-- Hero：整幅实景 + 站点图标 + 品牌名（i18n） + 预约按钮（参照其样式但更醒目） -->
    <div class="promo-hero column items-center justify-center text-center q-px-md">
      <div class="row items-center justify-center no-wrap">
        <img src="/favicon.svg" alt="" class="promo-hero-icon q-mr-md"/>
        <h1 class="promo-hero-title">{{ $t('main_login_title') }}</h1>
      </div>
      <div class="promo-hero-tagline q-mt-sm">{{ $t('promo.tagline') }}</div>
      <!-- VIP 专属优惠横幅（红 + 金，白底保证压图可读） -->
      <div class="promo-vip-banner q-mt-md">
        <span class="promo-vip-pre">{{ $t('promo.vip_offer_pre') }}</span>
        <span class="promo-vip-off">&nbsp;{{ $t('promo.vip_offer_off') }}</span>
      </div>
      <button class="promo-book-btn promo-book-btn-hero q-mt-lg" @click="goBook">
        {{ $t('promo.book_btn') }}
      </button>
    </div>

    <!-- About Us -->
    <div class="promo-block">
      <div class="promo-container row items-center">
        <div class="col-12 col-md-5 q-pa-md">
          <q-img src="/img/promo/promo-about.jpg" :ratio="1" fit="cover" class="promo-photo"/>
        </div>
        <div class="col-12 col-md-7 q-pa-md">
          <h2 class="promo-h2">{{ $t('promo.about_title') }}</h2>
          <p class="promo-paragraph">{{ $t('promo.about.p1') }}</p>
          <p class="promo-paragraph">{{ $t('promo.about.p2') }}</p>
          <p class="promo-paragraph">{{ $t('promo.about.p3') }}</p>
        </div>
      </div>
    </div>

    <!-- Our Locations（配置驱动，多门店自动扩展） -->
    <div class="promo-block promo-block-alt">
      <div class="promo-container">
        <h2 class="promo-h2 text-center">{{ $t('promo.locations_title') }}</h2>
        <div class="row justify-center">
          <div v-for="store in storeList" :key="store.id" class="col-12 col-md-6 q-pa-md">
            <div class="promo-store-card column full-height">
              <q-img src="/img/promo/promo-store.webp" :ratio="16/9" fit="cover"/>
              <div class="q-pa-lg column col">
                <div class="promo-store-name q-mb-sm">{{ lv(store.name) }}</div>
                <div class="row items-start q-my-xs">
                  <q-icon name="fa-solid fa-location-dot" size=".95rem" class="q-mr-sm q-mt-xs promo-accent"/>
                  <!-- 配置了 mapUrl 才有点击交互（新标签页打开谷歌商家页），未配置为纯文本 -->
                  <div class="col" :class="store.mapUrl ? 'promo-map-link' : ''"
                       @click="store.mapUrl && openLink(store.mapUrl)">
                    {{ store.address }}
                    <q-icon v-if="store.mapUrl" name="fa-solid fa-arrow-up-right-from-square"
                            size=".7rem" class="q-ml-xs"/>
                  </div>
                </div>
                <div class="row items-center q-my-xs">
                  <q-icon name="fa-solid fa-phone" size=".95rem" class="q-mr-sm promo-accent"/>
                  <div>{{ store.phone }}</div>
                </div>
                <div class="row items-center q-my-xs">
                  <q-icon name="fa-regular fa-clock" size=".95rem" class="q-mr-sm promo-accent"/>
                  <div>{{ lv(store.hours) }}</div>
                </div>
                <div v-if="store.notes" class="row items-start q-my-xs">
                  <q-icon name="fa-solid fa-ticket" size=".95rem" class="q-mr-sm q-mt-xs promo-accent"/>
                  <div class="col">{{ lv(store.notes) }}</div>
                </div>
                <q-space/>
                <button class="promo-book-btn promo-book-btn-block q-mt-md" @click="goBook">
                  {{ $t('promo.book_btn') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Services & Prices（配置驱动） -->
    <div class="promo-block">
      <div class="promo-container">
        <h2 class="promo-h2 text-center">{{ $t('promo.services_title') }}</h2>

        <div class="promo-notes q-pa-md q-mb-lg">
          <div v-for="key in noteKeys" :key="key" class="row items-start q-my-xs">
            <q-icon name="fa-solid fa-circle-info" size=".85rem" class="q-mr-sm q-mt-xs promo-accent"/>
            <div class="col">{{ $t(key) }}</div>
          </div>
          <div class="row items-start q-my-xs">
            <q-icon name="fa-solid fa-circle-info" size=".85rem" class="q-mr-sm q-mt-xs promo-accent"/>
            <div class="col">{{ $t('home.services_note') }}</div>
          </div>
        </div>

        <div class="row">
          <div v-for="group in serviceGroups" :key="group.id" class="col-12 col-md-6 q-pa-md">
            <div class="promo-price-card full-height">
              <div class="promo-price-head row items-center">
                <q-icon :name="group.icon" size="1rem" class="q-mr-sm"/>
                <div>{{ lv(group.title) }}</div>
              </div>
              <div v-for="item in group.items" :key="item.name.en" class="promo-price-row row items-center justify-between">
                <div class="col">
                  <div>{{ lv(item.name) }}</div>
                  <div class="promo-muted" style="font-size: .8rem">{{ item.minutes }} {{ $t('booking.minutes') }}</div>
                </div>
                <div class="promo-price q-ml-md">{{ item.price }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonials（配置驱动） -->
    <div class="promo-block promo-block-alt">
      <div class="promo-container">
        <h2 class="promo-h2 text-center">{{ $t('promo.testimonials_title') }}</h2>
        <div class="text-center promo-muted q-mb-md">{{ $t('promo.testimonials_sub') }}</div>
        <div class="row">
          <div v-for="tm in testimonialList" :key="tm.id" class="col-12 col-md-6 q-pa-md">
            <div class="promo-quote-card column full-height">
              <q-icon name="fa-solid fa-quote-left" size="1.4rem" class="promo-accent q-mb-sm"/>
              <div class="col" style="line-height: 1.75">{{ lv(tm.text) }}</div>
              <div class="row items-center justify-between q-mt-md">
                <div style="font-weight: 600">{{ tm.author }}</div>
                <div class="row">
                  <q-icon v-for="n in tm.stars" :key="n" name="fa-solid fa-star" size=".85rem" class="promo-accent"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 应用用途与 Google 数据使用说明：本页现为站点首页（/），该板块为 Google OAuth 品牌验证
         对首页的硬性要求（说明应用用途 + 所请求 Google 用户数据的用法），请勿移除 -->
    <div class="promo-block">
      <div class="promo-container">
        <h2 class="promo-h2 text-center">{{ $t('home.google.title') }}</h2>
        <div class="promo-google-card">
          <div class="q-my-xs">{{ $t('home.google.purpose') }}</div>
          <div class="q-my-xs">{{ $t('home.google.intro') }}</div>
          <div class="row items-start q-my-xs">
            <q-icon name="fa-regular fa-envelope" size=".9rem" class="q-mr-sm q-mt-xs promo-accent"/>
            <div class="col">{{ $t('home.google.use_mail') }}</div>
          </div>
          <div class="row items-start q-my-xs">
            <q-icon name="fa-regular fa-user" size=".9rem" class="q-mr-sm q-mt-xs promo-accent"/>
            <div class="col">{{ $t('home.google.use_name') }}</div>
          </div>
          <div class="row items-start q-my-xs">
            <q-icon name="fa-solid fa-shield-halved" size=".9rem" class="q-mr-sm q-mt-xs promo-accent"/>
            <div class="col">{{ $t('home.google.no_share') }}</div>
          </div>
          <div class="q-mt-xs">
            {{ $t('home.google.more_pre') }}<router-link :to="{name: 'policyPrivacy'}"
              class="promo-map-link promo-accent">{{ $t('policy.privacy') }}</router-link>{{ $t('home.google.more_post') }}
          </div>
        </div>
      </div>
    </div>

    <!-- 预约 CTA 红色横幅 -->
    <div class="promo-cta-band column items-center text-center q-px-md">
      <h2 class="promo-cta-title">{{ $t('promo.cta_title') }}</h2>
      <button class="promo-book-btn promo-book-btn-invert q-mt-md" @click="goBook">
        {{ $t('promo.book_btn') }}
      </button>
    </div>

    <!-- 页脚（参照官网：灰底、链接、门店信息；门店同样来自配置） -->
    <div class="promo-footer">
      <div class="promo-container row">
        <div class="col-12 col-md-4 q-pa-md">
          <div class="row items-center no-wrap">
            <img src="/favicon.svg" alt="" style="width: 2rem; height: 2rem" class="q-mr-sm"/>
            <div style="font-weight: 700; font-size: 1.1rem">{{ $t('main_login_title') }}</div>
          </div>
          <div class="promo-footer-muted q-mt-sm">{{ $t('promo.tagline') }}</div>
        </div>
        <div v-for="store in storeList" :key="store.id" class="col-12 col-sm-6 col-md-3 q-pa-md">
          <div class="promo-footer-title">{{ lv(store.name) }}</div>
          <div class="promo-footer-muted q-mt-xs" :class="store.mapUrl ? 'promo-map-link' : ''"
               @click="store.mapUrl && openLink(store.mapUrl)">
            {{ store.address }}
            <q-icon v-if="store.mapUrl" name="fa-solid fa-arrow-up-right-from-square" size=".65rem" class="q-ml-xs"/>
          </div>
          <div class="promo-footer-muted q-mt-xs">{{ store.phone }}</div>
          <div class="promo-footer-muted q-mt-xs">{{ lv(store.hours) }}</div>
        </div>
        <div class="col-12 col-sm-6 col-md-2 q-pa-md">
          <div class="promo-footer-title">{{ $t('promo.footer.links') }}</div>
          <div class="promo-footer-link q-mt-xs" @click="goBook">{{ $t('promo.book_btn') }}</div>
          <router-link :to="{name: 'policyTerms'}" class="promo-footer-link q-mt-xs">{{ $t('policy.terms') }}</router-link>
          <router-link :to="{name: 'policyPrivacy'}" class="promo-footer-link q-mt-xs">{{ $t('policy.privacy') }}</router-link>
        </div>
      </div>
      <div class="text-center promo-footer-copy q-py-md">
        © {{ curYear }} {{ $t('main_login_title') }} · {{ $t('promo.footer.rights') }}
      </div>
    </div>

    <!-- 常驻悬浮预约按钮：比官网的更醒目（更大 + 白描边 + 呼吸光晕） -->
    <button class="promo-book-btn promo-book-float" @click="goBook">
      <q-icon name="fa-regular fa-calendar-check" size="1.1rem" class="q-mr-sm"/>
      {{ $t('promo.book_btn') }}
    </button>

  </div>

</template>


<script setup>

import {useRouter} from "vue-router";
import {switchLanguage, switchTheme} from "@/utils/global-tools.js";
import {openLink} from "@/utils/base-tools.js";
import {toSpecifyPage, toSpecifyPageWithQuery} from "@/router/index.js";
import {currentLandingQuery} from "@/utils/landing-params.js";
import {useGlobalStateStore} from "@/utils/global-state.js";
import {i18n} from "@/i18n/index.js";
import {HOME_SERVICE_GROUPS, HOME_STORES, HOME_TESTIMONIALS} from "@/constants/home-content.js";

const globalState = useGlobalStateStore()
const thisRouter = useRouter()

const storeList = HOME_STORES
const serviceGroups = HOME_SERVICE_GROUPS
const testimonialList = HOME_TESTIMONIALS
const noteKeys = ['promo.notes.n1', 'promo.notes.n2', 'promo.notes.n3', 'promo.notes.n4']
const curYear = new Date().getFullYear()

// 配置中的可本地化字段（{zh, en}）按当前语言取值
function lv(field) {
  return field[i18n.global.locale.value === 'zh' ? 'zh' : 'en']
}

function goBook() {
  if (globalState.userData) {
    toSpecifyPage(thisRouter, 'main')
    return
  }
  // 未登录跳登录页：携带当前落地参数（/login 为接受页，刷新/分享该链接不丢归因）
  toSpecifyPageWithQuery(thisRouter, 'login', currentLandingQuery())
}

</script>


<style lang="scss">

// 推广页固定配色（参照官网：Inter、#cc2e2d 主色、白底、灰页脚），不随站内主题切换
$promo-red: #cc2e2d;

.promo-page {
  min-height: 100vh;
  background-color: #fff;
  color: #232323;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.promo-topbar {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  height: 4rem;
  color: #fff;
}

.promo-accent {
  color: $promo-red;
}

// 配置了 mapUrl 的门店地址：可点击（悬停下划线；亮色分区内悬停变主色）
.promo-map-link {
  cursor: pointer;
  color: $promo-red;


  &:hover {
    text-decoration: underline;
  }
}

.promo-store-card .promo-map-link:hover {
  color: $promo-red;
}

.promo-muted {
  color: #6f788b;
}

// ===== Hero =====
.promo-hero {
  position: relative;
  min-height: 88vh;
  background-image: url('/img/promo/promo-hero.webp');
  background-size: cover;
  background-position: center;
  color: #fff;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(rgba(0, 0, 0, .35), rgba(0, 0, 0, .55));
  }

  > * {
    position: relative;
    z-index: 1;
  }
}

.promo-hero-icon {
  width: clamp(5rem, 15vw, 8rem);
  height: auto;
}

.promo-hero-title {
  margin: 0 !important;
  font-size: clamp(2rem, 6vw, 4.5rem) !important;
  font-weight: 800 !important;
  text-shadow: 0 2px 14px rgba(0, 0, 0, .55);
}

.promo-hero-tagline {
  font-size: clamp(.95rem, 2.5vw, 1.2rem);
  opacity: .95;
  text-shadow: 0 1px 8px rgba(0, 0, 0, .5);
}

// ===== VIP 优惠横幅：红 + 金双色（对应宣传图），无底色，白色描边保证压图可读 =====
// 用 8 向 text-shadow 模拟描边：不吃字形、各浏览器表现一致（-webkit-text-stroke 居中描边会侵蚀笔画）
.promo-vip-banner {
  font-weight: 800;
  font-size: clamp(1.05rem, 3.5vw, 1.7rem);
  letter-spacing: .02em;
  text-transform: uppercase;
  text-shadow:
    -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff,
    -2px 0 0 #fff, 2px 0 0 #fff, 0 -2px 0 #fff, 0 2px 0 #fff;
}

.promo-vip-pre {
  color: $promo-red;
}

.promo-vip-off {
  color: #c9971e;
}

// ===== 预约按钮：官网同款（红底白字白描边），但更大、更醒目 =====
.promo-book-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: $promo-red;
  color: #fff;
  border: 4px solid #fff;
  border-radius: .6rem;
  font-family: inherit;
  font-size: 1.25rem;
  font-weight: 700;
  padding: .85rem 2.4rem;
  cursor: pointer;
  transition: transform .25s ease, box-shadow .25s ease, background-color .25s ease;;

  &:hover {
    transform: translateY(-2px) scale(1.03);
    background-color: #b52827;
  }
}

.promo-book-btn-hero {
  font-size: 1.4rem;
  padding: 1rem 3rem;
}

.promo-book-btn-block {
  width: 100%;
  font-size: 1.05rem;
  padding: .6rem 1rem;
  border-width: 3px;
}

// 红色横幅内用白底红字反色
.promo-book-btn-invert {
  background-color: #fff;
  color: $promo-red;
  border-color: #fff;
  box-shadow: 0 6px 22px rgba(0, 0, 0, .3);

  &:hover {
    background-color: #f3f3f3;
  }
}

// 常驻悬浮：呼吸光晕
.promo-book-float {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 10;
  font-size: 1.05rem;
  padding: .7rem 1.6rem;
  border-width: 3px;
  border-radius: 999px;
  animation: promo-pulse 2.2s ease-in-out infinite;
}

@keyframes promo-pulse {
  0%, 100% {
    box-shadow: 0 6px 22px rgba(204, 46, 45, .45);
  }
  50% {
    box-shadow: 0 6px 30px rgba(204, 46, 45, .85);
  }
}

// ===== 分区 =====
.promo-block {
  padding: 3.5rem 1rem;
}

.promo-block-alt {
  background-color: #f7f7f8;
}

.promo-container {
  width: min(94vw, 1080px);
  margin: 0 auto;
}

.promo-h2 {
  font-size: clamp(1.6rem, 4vw, 2.3rem) !important;
  font-weight: 800 !important;
  margin: 0 0 1.2rem 0 !important;
}

.promo-paragraph {
  color: #4d5460;
  line-height: 1.85;
  margin-bottom: .9rem !important;
}

.promo-photo {
  border-radius: 1rem;
  box-shadow: 0 10px 34px rgba(0, 0, 0, .16);
}

// ===== 门店卡片 =====
.promo-store-card {
  background: #fff;
  border: 1px solid #e6e8ec;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, .07);
}

.promo-store-name {
  font-size: 1.2rem;
  font-weight: 700;
}

// ===== 价格表 =====
.promo-notes {
  background: #fdf3f3;
  border: 1px solid rgba(204, 46, 45, .25);
  border-radius: .8rem;
  color: #4d5460;
}

.promo-price-card {
  background: #fff;
  border: 1px solid #e6e8ec;
  border-radius: 1rem;
  overflow: hidden;
}

.promo-price-head {
  background-color: $promo-red;
  color: #fff;
  font-weight: 700;
  padding: .7rem 1.1rem;
}

.promo-price-row {
  padding: .7rem 1.1rem;
  border-top: 1px solid #eef0f3;

  &:first-of-type {
    border-top: none;
  }
}

.promo-price {
  font-weight: 800;
  color: $promo-red;
}

// ===== Google 数据使用说明 =====
.promo-google-card {
  background: #fff;
  border: 1px solid #e6e8ec;
  border-radius: 1rem;
  padding: 1.4rem;
  color: #4d5460;
  line-height: 1.75;
}

// ===== 顾客评价 =====
.promo-quote-card {
  background: #fff;
  border: 1px solid #e6e8ec;
  border-radius: 1rem;
  padding: 1.4rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, .06);
  color: #4d5460;
}

// ===== 红色 CTA 横幅 =====
.promo-cta-band {
  background-color: $promo-red;
  color: #fff;
  padding: 3rem 1rem;
}

.promo-cta-title {
  margin: 0 !important;
  font-size: clamp(1.4rem, 4vw, 2.1rem) !important;
  font-weight: 800 !important;
}

// ===== 页脚（参照官网灰底） =====
.promo-footer {
  background-color: rgb(111, 111, 111);
  color: #fff;
  padding-top: 1.5rem;
}

.promo-footer-title {
  font-weight: 700;
}

.promo-footer-muted {
  color: rgba(255, 255, 255, .8);
  font-size: .88rem;
}

.promo-footer-link {
  display: block;
  color: #fff !important;
  cursor: pointer;
  font-size: .9rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.promo-footer-copy {
  border-top: 1px solid rgba(255, 255, 255, .25);
  margin-top: 1rem;
  color: rgba(255, 255, 255, .85);
  font-size: .85rem;
}

</style>

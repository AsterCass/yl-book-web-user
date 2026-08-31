<template>

  <!-- 取消预约页（/booking/cancel/:token）：免登录，凭预约成功邮件里的链接 token 访问。
       客户端已无登录与「我的预约」页，取消只有这一条路径；token 15 天有效，取消后再点开显示「已取消」。
       样式跟随首页推广风格（WebPromo）：固定亮色、#cc2e2d 主色、白底卡片，不随站内主题切换 -->
  <div class="cancel-page column items-center">

    <!-- 顶部：语言切换（同问卷页，页面固定亮色无需主题切换） -->
    <div class="cancel-topbar full-width row items-center q-px-md">
      <q-btn no-caps unelevated flat class="q-mx-xs" @click="switchLanguage()">
        <q-icon name="fa-solid fa-language" size="1.6rem"/>
      </q-btn>
    </div>

    <!-- 品牌头（同首页 Hero 的图标 + 品牌名，白底紧凑版） -->
    <div class="column items-center q-px-md text-center">
      <img src="/favicon.svg" alt="" class="cancel-brand-icon"/>
      <h4 class="cancel-brand-title">{{ $t('main_login_title') }}</h4>
      <div class="cancel-subtitle q-mt-md">{{ $t('cancelLink.title') }}</div>
    </div>

    <div class="cancel-card column q-my-lg">

      <div v-if="pageState === 'loading'" class="row justify-center q-py-xl">
        <q-spinner-pie size="50px" class="cancel-accent"/>
      </div>

      <!-- 链接无效 / 已过期 -->
      <div v-else-if="pageState === 'invalid'" class="column items-center q-py-xl">
        <q-icon name="fa-regular fa-circle-xmark" size="3rem" class="cancel-muted"/>
        <div class="cancel-h5 q-mt-md text-center">{{ $t('cancelLink.invalid') }}</div>
        <div class="cancel-muted q-mt-sm text-center">{{ $t('cancelLink.invalid_desc') }}</div>
        <button class="cancel-ghost-btn q-mt-lg" @click="goHome">{{ $t('cancelLink.book_again') }}</button>
      </div>

      <!-- 取消成功 / 本来就已取消：同一套结果版式，只有文案不同 -->
      <div v-else-if="pageState === 'done' || pageState === 'already'" class="column items-center q-py-xl">
        <q-icon name="fa-regular fa-circle-check" size="3rem" class="cancel-accent"/>
        <div class="cancel-h5 q-mt-md text-center">
          {{ pageState === 'done' ? $t('cancelLink.done') : $t('cancelLink.already') }}
        </div>
        <div class="cancel-muted q-mt-sm text-center">
          {{ pageState === 'done' ? $t('cancelLink.done_desc') : $t('cancelLink.already_desc') }}
        </div>
        <button class="cancel-submit-btn q-mt-lg" @click="goHome">{{ $t('cancelLink.book_again') }}</button>
      </div>

      <!-- 确认取消 -->
      <div v-else class="column">
        <div class="cancel-muted q-mb-md text-center">{{ $t('cancelLink.intro') }}</div>

        <!-- 本次预约信息（仅对客字段，未设置的整行隐藏——门店/项目只用对外名称，不回退内部名） -->
        <div class="cancel-notes q-px-md q-py-sm">
          <div v-if="info.storeName" class="row justify-between q-my-xs">
            <div class="cancel-muted">{{ $t('booking.field.store') }}</div>
            <div class="text-right">{{ info.storeName }}</div>
          </div>
          <div v-if="info.storeAddress" class="row justify-between q-my-xs">
            <div class="cancel-muted">{{ $t('cancelLink.address') }}</div>
            <div class="text-right col-7">{{ info.storeAddress }}</div>
          </div>
          <div v-if="info.projects" class="row justify-between q-my-xs">
            <div class="cancel-muted">{{ $t('booking.field.project') }}</div>
            <div class="text-right col-7">{{ info.projects }}</div>
          </div>
          <div v-if="info.bookTimeStr" class="row justify-between q-my-xs">
            <div class="cancel-muted">{{ $t('booking.field.time') }}</div>
            <div class="text-right">{{ info.bookTimeStr }}</div>
          </div>
          <div v-if="info.amount != null" class="row justify-between q-my-xs">
            <div class="cancel-muted">{{ $t('booking.field.amount') }}</div>
            <div class="text-right">${{ info.amount }}</div>
          </div>
        </div>

        <button class="cancel-submit-btn q-mt-lg" :disabled="submitting" @click="doCancel">
          <q-spinner v-if="submitting" size="1.1rem" class="q-mr-sm"/>
          {{ $t('cancelLink.confirm_btn') }}
        </button>
        <button class="cancel-ghost-btn q-mt-sm" :disabled="submitting" @click="goHome">
          {{ $t('cancelLink.keep_btn') }}
        </button>
      </div>

    </div>

    <q-space/>

    <div class="cancel-copy full-width q-py-md text-center">
      © {{ curYear }} {{ $t('main_login_title') }}
    </div>

  </div>

</template>


<script setup>

import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {switchLanguage} from "@/utils/global-tools.js";
import {portalBookingCancelByLink, portalBookingCancelLinkInfo} from "@/api/portal-booking.js";

const props = defineProps({
  // 取消链接 token（路由参数注入）
  token: {
    type: String,
    required: true,
    default: '',
  },
})

const thisRouter = useRouter()

const curYear = new Date().getFullYear()

// loading -> confirm / already / invalid，确认取消后 -> done
const pageState = ref('loading')
const info = ref({})
// 取消中：按钮禁用 + loading，防重复提交
const submitting = ref(false)

onMounted(() => {
  portalBookingCancelLinkInfo(props.token).then(res => {
    if (!res || !res.data || !res.data.data) {
      // 链接无效/过期（具体原因请求层已提示）
      pageState.value = 'invalid'
      return
    }
    info.value = res.data.data
    // 已取消的单直接给结果页，不再给取消按钮
    pageState.value = info.value.canceled ? 'already' : 'confirm'
  })
})

function doCancel() {
  submitting.value = true
  portalBookingCancelByLink(props.token).then(res => {
    if (!res || !res.data) {
      return
    }
    pageState.value = 'done'
  }).finally(() => {
    submitting.value = false
  })
}

// 回首页（首页即预约入口）
function goHome() {
  thisRouter.push({name: 'index'})
}

</script>


<style scoped lang="scss">

// 与首页（WebPromo）/ 问卷页同款固定配色：#cc2e2d 主色、白底，不随站内主题切换
$cancel-red: #cc2e2d;

.cancel-page {
  min-height: 100vh;
  background-color: #fff;
  color: #555;
  font-family: Roboto Slab, sans-serif;
}

.cancel-topbar {
  height: 4rem;
  color: #333;
}

.cancel-accent {
  color: $cancel-red;
}

.cancel-muted {
  opacity: 0.75;
}

.cancel-brand-icon {
  width: clamp(3rem, 8vw, 4.5rem);
  height: auto;
}

.cancel-brand-title {
  color: #333;
  margin: 0 !important;
  font-size: clamp(1.6rem, 5vw, 2.6rem) !important;
  font-weight: 800 !important;
}

.cancel-subtitle {
  font-size: 1.1rem;
  font-weight: 700;
  color: $cancel-red;
}

.cancel-h5 {
  font-size: 1.25rem;
  font-weight: 700;
}

// 主内容卡片：首页白底卡片同款
.cancel-card {
  width: min(94vw, 34rem);
  background: #fff;
  border: 1px solid #e6e8ec;
  border-radius: 1rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, .07);
  padding: 1.5rem;
}

// 预约信息：首页 notes 卡片同款浅红底
.cancel-notes {
  background: #fdf3f3;
  border: 1px solid rgba(204, 46, 45, .25);
  border-radius: .8rem;
  color: #555;
  font-size: .95rem;
}

// 主按钮：首页预约按钮同款（红底白字白描边、悬停上浮）
.cancel-submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: $cancel-red;
  color: #fff;
  border: 3px solid #fff;
  border-radius: .6rem;
  box-shadow: 0 4px 16px rgba(204, 46, 45, .35);
  font-family: inherit;
  font-size: 1.1rem;
  font-weight: 700;
  padding: .75rem 2rem;
  cursor: pointer;
  transition: transform .25s ease, box-shadow .25s ease, background-color .25s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    background-color: #b52827;
  }

  &:disabled {
    opacity: .7;
    cursor: not-allowed;
  }
}

// 次要按钮（保留预约 / 去预约）：描边版
.cancel-ghost-btn {
  width: 100%;
  background: #fff;
  color: $cancel-red;
  border: 2px solid $cancel-red;
  border-radius: .6rem;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  padding: .6rem 2rem;
  cursor: pointer;
  transition: background-color .25s ease;

  &:hover:not(:disabled) {
    background-color: #fdf3f3;
  }

  &:disabled {
    opacity: .7;
    cursor: not-allowed;
  }
}

// 页脚：轻量版权行
.cancel-copy {
  color: #555;
  font-size: .85rem;
}

</style>

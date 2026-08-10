<template>

  <!-- 服务评价页（/survey/:token）：免登录，凭邮件链接 token 访问；提交后链接失效。
       样式跟随首页推广风格（WebPromo）：固定亮色、Inter 字体、#cc2e2d 主色、白底卡片，不随站内主题切换 -->
  <div class="survey-page column items-center">

    <!-- 顶部：语言切换（同首页仅语言，页面固定亮色无需主题切换） -->
    <div class="survey-topbar full-width row items-center q-px-md">
      <q-btn no-caps unelevated flat class="q-mx-xs" @click="switchLanguage()">
        <q-icon name="fa-solid fa-language" size="1.6rem"/>
      </q-btn>
    </div>

    <!-- 品牌头（同首页 Hero 的图标 + 品牌名，白底紧凑版） -->
    <div class="column items-center q-mt-lg q-px-md text-center">
      <div class="row items-center justify-center no-wrap">
        <img src="/favicon.svg" alt="" class="survey-brand-icon q-mr-md"/>
        <h1 class="survey-brand-title">{{ $t('main_login_title') }}</h1>
      </div>
      <div class="survey-subtitle q-mt-sm">{{ $t('survey.title') }}</div>
    </div>

    <div class="survey-card column q-my-lg">

      <div v-if="pageState === 'loading'" class="row justify-center q-py-xl">
        <q-spinner-pie size="50px" class="survey-accent"/>
      </div>

      <!-- 链接无效/已过期/已提交 -->
      <div v-else-if="pageState === 'invalid'" class="column items-center q-py-xl">
        <q-icon name="fa-regular fa-circle-xmark" size="3rem" class="survey-muted"/>
        <div class="survey-h5 q-mt-md">{{ $t('survey.invalid') }}</div>
        <div class="survey-muted q-mt-sm text-center">{{ $t('survey.invalid_desc') }}</div>
      </div>

      <!-- 提交成功 -->
      <div v-else-if="pageState === 'submitted'" class="column items-center q-py-xl">
        <q-icon name="fa-regular fa-circle-check" size="3rem" class="survey-accent"/>
        <div class="survey-h5 q-mt-md">{{ $t('survey.submitted') }}</div>
        <div class="survey-muted q-mt-sm text-center">{{ $t('survey.submitted_desc') }}</div>
      </div>

      <!-- 评价表单 -->
      <div v-else class="column">
        <div class="survey-muted q-mb-md text-center">{{ $t('survey.intro') }}</div>

        <!-- 本次到店信息（仅对外名称，未设置的字段整行隐藏）：首页 notes 卡片同款浅红底 -->
        <div v-if="info.storeName || info.bookingTime || (info.skillNames && info.skillNames.length)"
             class="survey-notes q-px-md q-py-sm q-mb-md">
          <div v-if="info.storeName" class="row items-start q-my-xs">
            <q-icon name="fa-solid fa-location-dot" size=".9rem" class="q-mr-sm q-mt-xs survey-accent"/>
            <div class="col">{{ info.storeName }}</div>
          </div>
          <div v-if="info.bookingTime" class="row items-start q-my-xs">
            <q-icon name="fa-regular fa-clock" size=".9rem" class="q-mr-sm q-mt-xs survey-accent"/>
            <div class="col">{{ info.bookingTime }}</div>
          </div>
          <div v-if="info.skillNames && info.skillNames.length" class="row items-start q-my-xs">
            <q-icon name="fa-solid fa-spa" size=".9rem" class="q-mr-sm q-mt-xs survey-accent"/>
            <div class="col">{{ info.skillNames.join(', ') }}</div>
          </div>
        </div>

        <!-- 评星（主色红星） -->
        <div class="row items-center justify-center q-mb-md survey-rating">
          <q-rating v-model="score" :max="5" size="2.6rem" color="red-8"
                    icon="star_border" icon-selected="star"/>
        </div>

        <div class="component-long-text-input-simple-sur">
          <q-input ref="caskLongTextInputRef" :maxlength="CONTENT_MAX" counter
                   v-model="content" type="textarea"
                   :placeholder="$t('survey.content_placeholder')" borderless/>
        </div>


        <!-- 匿名选择与对应说明：实名=运营可立即看到并可能联系；匿名=3-10 天随机延迟展示、不可被追踪 -->
        <div class="row items-center q-mt-md" style="font-size: .95rem;">
          <q-checkbox v-model="anonymous" :val="true" class="component-ratio-base q-mr-sm" dense
                      checked-icon="task_alt" unchecked-icon="panorama_fish_eye"/>
          <div style="cursor: pointer" @click="anonymous = !anonymous">{{ $t('survey.anonymous') }}</div>
        </div>
        <div class="survey-muted q-mt-xs" style="font-size: .85rem; line-height: 1.6">
          {{ anonymous ? $t('survey.anonymous_on_note') : $t('survey.anonymous_off_note') }}
        </div>

        <!-- 提交按钮：首页预约按钮同款（红底白字白描边） -->
        <button class="survey-submit-btn q-mt-lg" :disabled="submitting" @click="doSubmit">
          <q-spinner v-if="submitting" size="1.1rem" class="q-mr-sm"/>
          {{ $t('survey.submit') }}
        </button>
      </div>

    </div>

    <q-space/>

    <div class="survey-copy full-width q-py-md text-center">
      © {{ curYear }} {{ $t('main_login_title') }}
    </div>

  </div>

</template>


<script setup>

import {onMounted, ref} from "vue";
import {switchLanguage} from "@/utils/global-tools.js";
import {notifyTopWarning} from "@/utils/notification-tools.js";
import {i18n} from "@/i18n/index.js";
import {portalSurveyInfo, portalSurveySubmit} from "@/api/portal-survey.js";

const props = defineProps({
  // 评价链接 token（路由参数注入）
  token: {
    type: String,
    required: true,
    default: '',
  },
})

const t = i18n.global.t

const CONTENT_MAX = 1000
const curYear = new Date().getFullYear()

// loading -> form / invalid -> submitted
const pageState = ref('loading')
const info = ref({})
const score = ref(0)
const content = ref('')
const anonymous = ref(false)
// 提交中：按钮禁用+loading，防重复提交
const submitting = ref(false)

onMounted(() => {
  portalSurveyInfo(props.token).then(res => {
    if (!res || !res.data || !res.data.data) {
      // 无效/过期/已提交（具体原因请求层已提示）
      pageState.value = 'invalid'
      return
    }
    info.value = res.data.data
    pageState.value = 'form'
  })
})

function doSubmit() {
  if (!score.value || score.value < 1) {
    notifyTopWarning(t('survey.score_required'))
    return
  }
  if (content.value && content.value.length > CONTENT_MAX) {
    notifyTopWarning(t('survey.content_too_long'))
    return
  }
  submitting.value = true
  portalSurveySubmit(props.token, {
    score: score.value,
    content: content.value || null,
    anonymous: anonymous.value,
  }).then(res => {
    if (!res || !res.data) {
      return
    }
    pageState.value = 'submitted'
  }).finally(() => {
    submitting.value = false
  })
}

</script>


<style lang="scss">
.component-long-text-input-simple-sur {

  ::-webkit-scrollbar {
    overflow: visible;
    z-index: 12;
    background: transparent;
    height: 12px;
    width: 14px;
  }

  ::-webkit-scrollbar-thumb {
    width: 10px;
    border-radius: 10px;
    z-index: 12;
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    transition: background-color .28s ease-in-out;
    margin: 4px;
    min-height: 32px;
    min-width: 32px;
    background-color: #cc2e2d;
  }

  textarea {
    resize: none !important;
    font-size: .85rem;
    color: rgb(var(--text-color));
    letter-spacing: 0.023rem;
    line-height: 1.3rem;
    min-height: 1.3rem !important;
    border: 2px solid rgba(204, 46, 45, .25);
    margin: .1rem 0 0 0;
    padding: 8px 12px !important;
    border-radius: 8px;
    overflow-wrap: anywhere;
  }

}

</style>


<style scoped lang="scss">

// 与首页（WebPromo）同款固定配色：Inter、#cc2e2d 主色、白底，不随站内主题切换
$survey-red: #cc2e2d;

.survey-page {
  min-height: 100vh;
  background-color: #fff;
  color: #555;
  font-family: Roboto Slab, sans-serif;
}

.survey-topbar {
  height: 4rem;
  color: #333;
}

.survey-accent {
  color: $survey-red;
}

.survey-muted {
  opacity: 0.75;
}

.survey-brand-icon {
  width: clamp(3rem, 8vw, 4.5rem);
  height: auto;
}

.survey-brand-title {
  color: #333;
  margin: 0 !important;
  font-size: clamp(1.6rem, 5vw, 2.6rem) !important;
  font-weight: 800 !important;
}

.survey-subtitle {
  font-size: .85rem;
  font-weight: 700;
  color: $survey-red;
}

.survey-h5 {
  font-size: 1.25rem;
  font-weight: 700;
}

// 主内容卡片：首页白底卡片同款（浅边框 + 大圆角 + 轻阴影）
.survey-card {
  width: min(94vw, 34rem);
  background: #fff;
  border: 1px solid #e6e8ec;
  border-radius: 1rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, .07);
  padding: 1.5rem;
}

// 到店信息：首页 notes 卡片同款浅红底
.survey-notes {
  background: #fdf3f3;
  border: 1px solid rgba(204, 46, 45, .25);
  border-radius: .8rem;
  color: #555;
}

// 评星主色红
.survey-rating {
  color: $survey-red;
}

// 输入框仅微调圆角，配色用 Quasar 默认（页面固定亮色）
.survey-input :deep(.q-field__control) {
  border-radius: .6rem;
}

// 提交按钮：首页预约按钮同款（红底白字白描边、悬停上浮）
.survey-submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: $survey-red;
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

// 页脚：轻量版权行（浅灰分隔线）
.survey-copy {
  color: #555;
  font-size: .85rem;
}

</style>

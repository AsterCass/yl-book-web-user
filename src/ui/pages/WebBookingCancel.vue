<template>
  <!-- 预约详情页（/c/:token，别名 /booking/cancel/:token）：免登录，凭邮件 / 短信里的链接 token 访问。
       原来是「取消预约」单张确认页，现在是该号码在所有对客门店的预约列表：每张预约一张卡片（自带所属门店的名称 / 地址 / 电话），
       不按门店分组，实时查看、可在此取消（含别的门店的单）。
       客户端没有登录与「我的预约」页，查看 / 取消只有这一条路径；token 15 天有效，同一个号码点哪条链接看到的都一样。
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
      <!-- 只显示号码后 4 位，不显示姓名与完整号码 -->
      <div v-if="info.phoneTail" class="cancel-muted q-mt-xs">
        {{ $t('cancelLink.for_number', {tail: info.phoneTail}) }}
      </div>
    </div>

    <div class="cancel-card column q-my-lg">
      <div v-if="pageState === 'loading'" class="row justify-center q-py-xl">
        <q-spinner-pie size="50px" class="cancel-accent"/>
      </div>

      <!-- 打不开：链接无效 / 已过期 / 请求太频繁（具体原因请求层已用顶部提示给出） -->
      <div v-else-if="pageState === 'invalid'" class="column items-center q-py-xl">
        <q-icon name="fa-regular fa-circle-xmark" size="3rem" class="cancel-muted"/>
        <div class="cancel-h5 q-mt-md text-center">{{ $t('cancelLink.invalid') }}</div>
        <div class="cancel-muted q-mt-sm text-center">{{ $t('cancelLink.invalid_desc') }}</div>
      </div>

      <div v-else class="column">
        <!-- 链接即凭证：请勿转发的提示放在最上面、用警示色（原来是页脚的一行小字） -->
        <div class="cancel-private row items-start no-wrap">
          <q-icon name="fa-solid fa-triangle-exclamation" size="1.15rem" class="cancel-private-icon"/>
          <div>{{ $t('cancelLink.private_hint') }}</div>
        </div>

        <!-- 列表抬头：手动刷新 + 上次更新时间 -->
        <div class="row items-center justify-between q-mt-md q-mb-sm">
          <div class="cancel-list-title">{{ $t('cancelLink.upcoming') }}</div>
          <div class="row items-center">
            <span v-if="updatedAt" class="cancel-updated q-mr-sm">
              {{ $t('cancelLink.updated_at', {time: updatedAt}) }}
            </span>
            <q-btn flat dense round size="sm" icon="fa-solid fa-rotate-right" class="cancel-accent"
                   :loading="refreshing" :disable="refreshing || refreshCooling" @click="manualRefresh">
              <q-tooltip>{{ $t('cancelLink.refresh') }}</q-tooltip>
            </q-btn>
          </div>
        </div>
        <div v-if="refreshFailed" class="cancel-updated q-mb-sm">{{ $t('cancelLink.refresh_failed') }}</div>

        <!-- 没有还没结束的预约 -->
        <div v-if="bookingList.length === 0" class="column items-center q-py-lg">
          <q-icon name="fa-regular fa-calendar" size="2.4rem" class="cancel-muted"/>
          <div class="cancel-muted q-mt-md text-center">{{ $t('cancelLink.empty') }}</div>
        </div>

        <!-- 每张预约一张卡片：有效的在前、已取消的（置灰）在后，两组各自按时间。
             不同门店的单混排，所以门店信息写在每张卡片里 -->
        <div v-for="item in bookingList" :key="item.bookingId" class="cancel-item q-mb-md"
             :class="{'cancel-item--off': item.canceled}">
          <div class="row items-start justify-between no-wrap">
            <div class="cancel-item-time">{{ formatDateTime(item.bookTimeStr) }}</div>
            <div class="cancel-chip" :class="item.canceled ? 'cancel-chip--off' : 'cancel-chip--on'">
              {{ item.canceled ? $t('cancelLink.status_cancelled') : $t('cancelLink.status_confirmed') }}
            </div>
          </div>
          <!-- 这张单所属的门店（只用对外名称；没填的行隐藏） -->
          <div class="cancel-item-store q-mt-sm">
            <div v-if="item.storeName" class="cancel-store-name">{{ item.storeName }}</div>
            <div v-if="item.storeAddress">{{ item.storeAddress }}</div>
            <div v-if="item.storePhone">
              <a class="cancel-link" :href="'tel:' + item.storePhone">{{ item.storePhone }}</a>
            </div>
          </div>
          <div v-if="item.projects" class="cancel-item-row q-mt-sm">
            <div class="cancel-muted">{{ $t('booking.field.project') }}</div>
            <div class="cancel-item-value">{{ item.projects }}</div>
          </div>
          <div v-if="item.staffName" class="cancel-item-row">
            <div class="cancel-muted">{{ $t('cancelLink.technician') }}</div>
            <div class="cancel-item-value">{{ item.staffName }}</div>
          </div>
          <div v-if="item.amount != null" class="cancel-item-row">
            <div class="cancel-muted">{{ $t('booking.field.amount') }}</div>
            <div class="cancel-item-value">${{ item.amount }}</div>
          </div>

          <!-- 已开始还没结束：只展示，按钮显示「进行中」、不能点（原则上不在网页上取消已开始的单） -->
          <button v-if="item.inProgress" class="cancel-ghost-btn cancel-ghost-btn--busy q-mt-md" disabled>
            {{ $t('cancelLink.in_progress') }}
          </button>
          <!-- 第三方平台的单：只给时间与项目，并提示回平台取消 -->
          <div v-else-if="item.thirdParty && !item.canceled" class="cancel-item-hint q-mt-sm">
            {{ $t('cancelLink.third_party') }}
          </div>
          <!-- 能取消：点了先弹确认框 -->
          <button v-else-if="item.cancellable" class="cancel-ghost-btn q-mt-md" :disabled="submitting"
                  @click="askCancel(item)">
            {{ $t('cancelLink.cancel_btn') }}
          </button>
          <!-- 有效但不能在这里取消（兜底，正常走不到）：请顾客打这张单所属门店的电话 -->
          <div v-else-if="!item.canceled" class="cancel-item-hint q-mt-sm">
            {{ $t('cancelLink.call_hint') }}
            <a v-if="item.storePhone" class="cancel-link" :href="'tel:' + item.storePhone">{{ item.storePhone }}</a>
          </div>
        </div>

        <!-- 说明：金额口径、取消规则、实时情况 -->
        <div class="cancel-foot">
          <div v-if="hasAmount">{{ $t('cancelLink.amount_note') }}</div>
          <div>{{ $t('cancelLink.cancel_rule') }}</div>
          <div>{{ $t('cancelLink.live_note') }}</div>
        </div>
      </div>
    </div>

    <!-- 取消确认框：带上门店名与地址——列表里可能有不止一家门店的单，而几家门店的对外名称可以相同，靠地址区分 -->
    <q-dialog v-model="confirmVisible" :persistent="submitting">
      <div class="cancel-dialog column">
        <div class="cancel-h5">{{ $t('cancelLink.confirm_title') }}</div>
        <div v-if="pending" class="cancel-notes q-px-md q-py-sm q-mt-md">
          <div class="cancel-item-time">{{ formatDateTime(pending.bookTimeStr) }}</div>
          <div v-if="pending.projects" class="q-mt-xs">{{ pending.projects }}</div>
          <div v-if="pending.storeName" class="cancel-store-name q-mt-xs">{{ pending.storeName }}</div>
          <div v-if="pending.storeAddress">{{ pending.storeAddress }}</div>
        </div>
        <div class="cancel-muted q-mt-md">{{ $t('cancelLink.confirm_desc') }}</div>
        <button class="cancel-submit-btn q-mt-lg" :disabled="submitting" @click="doCancel">
          <q-spinner v-if="submitting" size="1.1rem" class="q-mr-sm"/>
          {{ $t('cancelLink.confirm_btn') }}
        </button>
        <button class="cancel-ghost-btn q-mt-sm" :disabled="submitting" @click="confirmVisible = false">
          {{ $t('cancelLink.keep_btn') }}
        </button>
      </div>
    </q-dialog>

    <q-space/>
    <div class="cancel-copy full-width q-py-md text-center">
      © {{ curYear }} {{ $t('main_login_title') }}
    </div>
  </div>
</template>


<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {switchLanguage} from "@/utils/global-tools.js";
import {portalBookingCancelByLink, portalBookingCancelLinkInfo} from "@/api/portal-booking.js";
import {formatDateTime} from "@/utils/time-format.js";
import {notifyTopPositive} from "@/utils/notification-tools";

const props = defineProps({
  // 预约详情链接 token（路由参数注入）
  token: {
    type: String,
    required: true,
    default: '',
  },
})

// 后端对每条链接限流：每小时 60 次（查看与取消合计）。自动刷新 5 分钟一次只占 12 次，
// 其余留给切回前台刷新、手动刷新与取消；手动 / 切回前台的刷新各自有最小间隔，免得把额度点光
const AUTO_REFRESH_MS = 5 * 60 * 1000
const FOCUS_REFRESH_MIN_GAP_MS = 60 * 1000
const MANUAL_REFRESH_COOLDOWN_MS = 15 * 1000

const {t} = useI18n()
const curYear = new Date().getFullYear()

// loading -> ready / invalid
const pageState = ref('loading')
const info = ref({})
// 后端按时间正序给整份列表；这里把已取消的挪到后面，两组内部各自保持时间顺序——
// 顾客第一眼看到的是最近一张还有效的预约，而不是排在它前面的已取消单
const bookingList = computed(() => {
  const list = info.value.bookingList || []
  return [...list.filter(item => !item.canceled), ...list.filter(item => item.canceled)]
})
const hasAmount = computed(() => bookingList.value.some(item => item.amount != null))

// 刷新状态
const refreshing = ref(false)
const refreshCooling = ref(false)
const refreshFailed = ref(false)
const updatedAt = ref('')
let lastFetchAt = 0
let autoTimer = null
let coolTimer = null

// 取消：确认框 + 提交中（按钮禁用，防重复提交）
const confirmVisible = ref(false)
const pending = ref(null)
const submitting = ref(false)

// 页面带着凭证（token 在地址里）：不让搜索引擎收录，也不把地址经 Referer 带给外站
const injectedMetas = []

function addMeta(name, content) {
  const meta = document.createElement('meta')
  meta.setAttribute('name', name)
  meta.setAttribute('content', content)
  document.head.appendChild(meta)
  injectedMetas.push(meta)
}

onMounted(() => {
  addMeta('robots', 'noindex, nofollow')
  addMeta('referrer', 'no-referrer')
  load(true)
  autoTimer = setInterval(() => {
    if (document.visibilityState === 'visible' && pageState.value === 'ready') {
      load(false)
    }
  }, AUTO_REFRESH_MS)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  clearInterval(autoTimer)
  clearTimeout(coolTimer)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  injectedMetas.forEach(meta => meta.remove())
})

// 拉取列表。首次失败 = 打不开（无效 / 过期 / 被限流）；之后的刷新失败保留上次的数据，只提示没刷新成
function load(first) {
  if (refreshing.value) {
    return Promise.resolve()
  }
  refreshing.value = true
  lastFetchAt = Date.now()
  return portalBookingCancelLinkInfo(props.token).then(res => {
    if (!res || !res.data || !res.data.data) {
      if (first) {
        pageState.value = 'invalid'
      } else {
        refreshFailed.value = true
      }
      return
    }
    info.value = res.data.data
    refreshFailed.value = false
    updatedAt.value = new Date().toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})
    pageState.value = 'ready'
  }).finally(() => {
    refreshing.value = false
  })
}

function onVisibilityChange() {
  if (document.visibilityState === 'visible' && pageState.value === 'ready'
      && Date.now() - lastFetchAt > FOCUS_REFRESH_MIN_GAP_MS) {
    load(false)
  }
}

function manualRefresh() {
  refreshCooling.value = true
  coolTimer = setTimeout(() => {
    refreshCooling.value = false
  }, MANUAL_REFRESH_COOLDOWN_MS)
  load(false)
}

function askCancel(item) {
  pending.value = item
  confirmVisible.value = true
}

function doCancel() {
  if (!pending.value) {
    return
  }
  submitting.value = true
  portalBookingCancelByLink(props.token, pending.value.bookingId).then(res => {
    if (res && res.data) {
      notifyTopPositive(t('cancelLink.cancel_done'))
    }
    // 成功失败都重新拉一次：失败多半是状态变了（已被取消 / 进了截止时间），列表要跟上
    confirmVisible.value = false
    pending.value = null
    return load(false)
  }).finally(() => {
    submitting.value = false
  })
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

// 确认框里的预约摘要：首页 notes 卡片同款浅红底
.cancel-notes {
  background: #fdf3f3;
  border: 1px solid rgba(204, 46, 45, .25);
  border-radius: .8rem;
  color: #555;
  font-size: .95rem;
}

// 「请勿转发此链接」：页面最上面的警示条，主色描边 + 加粗，比其它说明都醒目
.cancel-private {
  background: #fdecea;
  border: 2px solid $cancel-red;
  border-radius: .8rem;
  color: #a31f1e;
  font-size: .95rem;
  font-weight: 700;
  line-height: 1.45;
  padding: .7rem .9rem;
}

.cancel-private-icon {
  flex-shrink: 0;
  margin: .1rem .6rem 0 0;
}

// 卡片里的门店信息：名称加粗，地址 / 电话各一行
.cancel-item-store {
  line-height: 1.5;
}

.cancel-store-name {
  font-weight: 700;
  color: #333;
}

.cancel-link {
  color: $cancel-red;
  font-weight: 700;
  text-decoration: none;
}

.cancel-list-title {
  font-weight: 700;
  color: #333;
}

.cancel-updated {
  font-size: .8rem;
  opacity: .7;
}

// 一张预约
.cancel-item {
  border: 1px solid #e6e8ec;
  border-radius: .8rem;
  padding: .9rem 1rem;
  font-size: .95rem;
}

// 已取消：置灰
.cancel-item--off {
  background: #f6f7f9;
  opacity: .7;
}

.cancel-item-time {
  font-size: 1.05rem;
  font-weight: 700;
  color: #333;
}

// 一行「标签 + 值」：标签不换行不收缩，值靠右、放不下就在自己那一侧换行
// （不用 Quasar 的 col-8：它带 flex: 0 0 auto，长内容（如一串项目名）不会收缩换行，会把整行撑出卡片）
.cancel-item-row {
  display: flex;
  justify-content: space-between;
  gap: .8rem;
  margin-top: .3rem;

  > :first-child {
    flex-shrink: 0;
  }
}

.cancel-item-value {
  min-width: 0;
  text-align: right;
  overflow-wrap: anywhere;
}

.cancel-item-hint {
  font-size: .88rem;
  color: #8a6d3b;
  background: #fcf8e3;
  border-radius: .5rem;
  padding: .5rem .7rem;
}

.cancel-chip {
  flex-shrink: 0;
  margin-left: .6rem;
  border-radius: 999px;
  padding: .1rem .6rem;
  font-size: .8rem;
  font-weight: 700;
}

.cancel-chip--on {
  color: #1a7f37;
  background: #e7f6ec;
}

.cancel-chip--off {
  color: #666;
  background: #e6e8ec;
}

.cancel-foot {
  font-size: .82rem;
  opacity: .75;
  line-height: 1.5;
}

// 确认框
.cancel-dialog {
  width: min(92vw, 26rem);
  background: #fff;
  border-radius: 1rem;
  padding: 1.5rem;
  color: #555;
  font-family: Roboto Slab, sans-serif;
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

// 次要按钮（取消该预约 / 保留）：描边版
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

  // 进行中：灰色描边、不能点，只告诉顾客这张单已经开始了
  &--busy,
  &--busy:disabled {
    color: #8a8a8a;
    border-color: #d6d6d6;
    background-color: #f7f7f7;
    opacity: 1;
  }
}

// 页脚：轻量版权行
.cancel-copy {
  color: #555;
  font-size: .85rem;
}

</style>

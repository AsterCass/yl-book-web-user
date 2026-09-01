<template>

  <!-- 首页内嵌的预约区（不再跳转登录页）：门店/项目/雇员/可约时间均为免登录接口，
       只有最后点「立即预约」时才需要身份——未登录客户在此就地完成邮箱+手机双验证并自动登录。
       大小视图同一套两步流程（选内容 → 确认+联系方式），分区自上而下铺满整行、不分左右栏。
       风格沿用 WebPromo（.promo-* 为 WebPromo 内的全局类，可直接复用）。 -->
  <div id="promo-book" ref="rootEl" class="promo-block promo-block-alt pbook-root">
    <div class="promo-container">

      <h2 class="promo-h2 text-center">{{ $t('promo.booking_title') }}</h2>

      <!-- ===== 成功态 ===== -->
      <div v-if="created" class="pbook-card column items-center text-center q-pa-xl">
        <q-icon name="fa-regular fa-circle-check" size="3rem" class="promo-accent"/>
        <h3 class="pbook-success-title q-mt-md">{{ $t('booking.success_title') }}</h3>
        <!-- 没留邮箱就没有确认邮件、也没有取消链接：文案换成「致电门店取消」，别承诺发不出去的邮件 -->
        <div class="promo-muted q-mt-sm">
          {{ createdInfo.mail ? $t('booking.success_hint') : $t('booking.success_hint_no_email') }}
        </div>
        <div class="pbook-summary q-mt-lg full-width">
          <div class="row justify-between q-my-xs">
            <div class="promo-muted">{{ $t('booking.field.store') }}</div>
            <div class="text-right">{{ createdInfo.storeName }}</div>
          </div>
          <div class="row justify-between q-my-xs">
            <div class="promo-muted">{{ $t('booking.field.project') }}</div>
            <div class="text-right col-7">{{ createdInfo.skillNames }}</div>
          </div>
          <div class="row justify-between q-my-xs">
            <div class="promo-muted">{{ $t('booking.field.time') }}</div>
            <div class="text-right">{{ createdInfo.slot }}</div>
          </div>
        </div>
        <div class="row justify-center q-gutter-md q-mt-lg">
          <button class="promo-book-btn pbook-btn-sm" @click="resetAll">
            {{ $t('booking.book_another') }}
          </button>
        </div>
      </div>

      <!-- ===== 预约表单：两步卡片（选内容 → 确认信息 + 联系方式） ===== -->
      <div v-else class="pbook-card q-pa-lg">

        <!-- 步骤指示（大小视图同一套两步流程） -->
        <div class="column items-center q-mb-md">
          <div class="row items-center justify-center">
            <template v-for="s in TOTAL_STEP" :key="s">
              <div class="pbook-step-dot row items-center justify-center"
                   :class="{'pbook-step-dot-active': step === s, 'pbook-step-dot-done': step > s}">
                <q-icon v-if="step > s" name="fa-solid fa-check" size=".65rem"/>
                <span v-else>{{ s }}</span>
              </div>
              <div v-if="s < TOTAL_STEP" class="pbook-step-line" :class="{'pbook-step-line-done': step > s}"/>
            </template>
          </div>
          <div class="pbook-step-title q-mt-sm">
            {{ step === 1 ? $t('booking.step.select') : $t('booking.step.confirm') }}
          </div>
        </div>

        <div class="column">

          <!-- ========== 第 1 步：选门店 / 项目 / 员工 / 时间 ========== -->
          <template v-if="showSelect">

            <!-- 门店 -->
            <div class="pbook-sec">
              <div class="pbook-block-title row items-center">
                <div class="pbook-num">1</div>
                <div>{{ $t('booking.step.store') }}</div>
              </div>
              <div v-if="loadingStores" class="row justify-center q-py-lg">
                <q-spinner-pie size="34px"/>
              </div>
              <div v-else-if="!storeList.length" class="pbook-placeholder">{{ $t('booking.no_store') }}</div>
              <template v-else>
                <!-- 定位自动选中的提示：让客户知道这不是他选的，且门店列表照常可点、随时能改 -->
                <div v-if="autoStoreHint" class="pbook-option-sub q-mb-xs row items-center no-wrap">
                  <q-icon name="fa-solid fa-location-crosshairs" size=".85rem" class="q-mr-xs promo-accent"/>
                  <div>{{ autoStoreHint }}</div>
                </div>
                <div class="column">
                  <div v-for="s in storeList" :key="s.id" class="pbook-option column q-my-xs"
                       :class="{'pbook-option-active': selectedStoreId === s.id}" @click="selectStore(s)">
                    <div class="row items-center no-wrap">
                      <q-icon name="fa-solid fa-store" size=".95rem" class="q-mr-sm promo-accent"/>
                      <div class="col pbook-option-name">{{ s.name }}</div>
                      <q-icon v-if="selectedStoreId === s.id" name="fa-solid fa-circle-check"
                              size="1rem" class="promo-accent q-ml-sm"/>
                    </div>
                    <div v-if="s.address" class="pbook-option-sub">{{ s.address }}</div>
                    <div v-if="s.phone" class="pbook-option-sub">{{ s.phone }}</div>
                  </div>
                </div>
              </template>
            </div>

            <!-- 项目（可多选；依赖门店：未选门店只给标题） -->
            <div ref="skillSecEl" class="pbook-sec">
              <div class="pbook-block-title row items-center">
                <div class="pbook-num">2</div>
                <div>{{ $t('booking.step.project') }}</div>
              </div>
              <div v-if="!selectedStoreId" class="pbook-placeholder">{{ $t('booking.need_store_first') }}</div>
              <div v-else-if="loadingSkills" class="row justify-center q-py-lg">
                <q-spinner-pie size="34px"/>
              </div>
              <div v-else-if="!skillList.length" class="pbook-placeholder">{{ $t('booking.no_project') }}</div>
              <div v-else>
                <!-- 项目通常十几二十个：弹性换行排布，一行塞不下自动换行，不再一个一行 -->
                <div class="pbook-skill-list">
                  <div v-for="sk in skillList" :key="sk.id" class="pbook-option pbook-skill"
                       :class="{'pbook-option-active': selectedSkillIds.includes(sk.id)}" @click="toggleSkill(sk.id)">
                    <div class="row items-center no-wrap">
                      <q-icon :name="selectedSkillIds.includes(sk.id) ? 'task_alt' : 'panorama_fish_eye'"
                              size="1rem" class="q-mr-sm"
                              :class="selectedSkillIds.includes(sk.id) ? 'promo-accent' : ''"/>
                      <div class="pbook-option-name pbook-skill-name">{{ sk.name }}</div>
                    </div>
                    <!-- 金额与时长同行，放在项目名称下方 -->
                    <div class="row items-center no-wrap pbook-skill-meta">
                      <div v-if="sk.serviceAmount != null" class="pbook-price q-mr-md">${{ sk.serviceAmount }}</div>
                      <div class="pbook-option-sub">{{ sk.consumeMinutes }} {{ $t('booking.minutes') }}</div>
                    </div>
                  </div>
                </div>
                <div class="column items-end q-mt-sm pbook-option-sub">
                  <div>{{ $t('booking.total_minutes', {minutes: totalMinutes}) }}</div>
                  <div v-if="totalAmount != null">{{ $t('booking.total_amount', {amount: '$' + totalAmount}) }}</div>
                  <div>{{ $t('booking.price_note') }}</div>
                </div>
              </div>
            </div>

            <!-- 偏好员工（依赖项目） -->
            <div ref="staffSecEl" class="pbook-sec">
              <div class="pbook-block-title row items-center">
                <div class="pbook-num">3</div>
                <div>{{ $t('booking.step.staff') }}</div>
              </div>
              <div v-if="!selectedSkillIds.length" class="pbook-placeholder">
                {{ $t('booking.need_project_first') }}
              </div>
              <div v-else-if="loadingStaffs" class="row justify-center q-py-lg">
                <q-spinner-pie size="34px"/>
              </div>
              <div v-else class="column">
                <div class="pbook-option row items-center q-my-xs"
                     :class="{'pbook-option-active': staffChosen && !selectedStaffId}" @click="selectStaff('')">
                  <q-icon name="fa-solid fa-shuffle" size=".95rem" class="q-mr-sm promo-accent"/>
                  <div class="col pbook-option-name">{{ $t('booking.staff_any') }}</div>
                  <q-icon v-if="staffChosen && !selectedStaffId" name="fa-solid fa-circle-check"
                          size="1rem" class="promo-accent"/>
                </div>
                <div v-for="st in staffList" :key="st.id" class="pbook-option row items-center q-my-xs"
                     :class="{'pbook-option-active': selectedStaffId === st.id}" @click="selectStaff(st.id)">
                  <q-icon name="fa-regular fa-user" size=".95rem" class="q-mr-sm promo-accent"/>
                  <div class="col pbook-option-name">{{ st.name }}</div>
                  <q-icon v-if="selectedStaffId === st.id" name="fa-solid fa-circle-check"
                          size="1rem" class="promo-accent"/>
                </div>
                <div class="pbook-option-sub q-mt-sm">{{ $t('booking.staff_note') }}</div>
              </div>
            </div>

            <!-- 可约时间（依赖偏好员工的选择动作） -->
            <div ref="timeSecEl" class="pbook-sec">
              <div class="pbook-block-title row items-center">
                <div class="pbook-num">4</div>
                <div>{{ $t('booking.step.time') }}</div>
              </div>
              <div v-if="!timeReady" class="pbook-placeholder">{{ $t('booking.need_staff_first') }}</div>
              <template v-else>
                <div class="pbook-option-sub q-mb-sm">
                  <div>{{ $t('booking.time_note', {days: MAX_ADVANCE_DAYS}) }}</div>
                  <div v-if="storeTimezoneName">{{ $t('booking.timezone_note', {zone: storeTimezoneName}) }}</div>
                </div>
                <div v-if="loadingSlots" class="row justify-center q-py-lg">
                  <q-spinner-pie size="34px"/>
                </div>
                <template v-else>
                  <div v-if="noSlotInWindow" class="pbook-placeholder">
                    {{ $t('booking.no_slot_range', {days: MAX_ADVANCE_DAYS}) }}
                  </div>
                  <template v-else>
                    <div class="row justify-center">
                      <q-date class="pbook-date no-shadow bg-transparent" v-model="selectedDate" mask="YYYY-MM-DD"
                              minimal :options="dateOptions" :default-year-month="defaultYearMonth"
                              :navigation-min-year-month="navMinYearMonth"
                              :navigation-max-year-month="navMaxYearMonth"
                              @update:model-value="selectedSlot = ''"/>
                    </div>
                    <div v-if="!selectedDate" class="pbook-placeholder">{{ $t('booking.pick_date_first') }}</div>
                    <div v-else-if="!slotList.length" class="pbook-placeholder">{{ $t('booking.no_slot') }}</div>
                    <div v-else class="row justify-center q-mt-sm">
                      <div v-for="slot in slotList" :key="slot" class="pbook-slot q-ma-xs"
                           :class="{'pbook-slot-active': selectedSlot === slot}" @click="selectSlot(slot)">
                        {{ slot.slice(11) }}
                      </div>
                    </div>
                  </template>
                </template>
              </template>
            </div>

          </template>

          <!-- ========== 第 2 步：确认信息 + 联系方式 ========== -->
          <template v-if="showConfirm">

            <!-- 预约信息汇总 -->
            <div class="pbook-sec">
              <div class="pbook-block-title row items-center">
                <div class="pbook-num">5</div>
                <div>{{ $t('booking.summary_title') }}</div>
              </div>
              <div class="pbook-summary">
                <div class="row justify-between items-start q-my-xs">
                  <div class="promo-muted">{{ $t('booking.field.store') }}</div>
                  <div class="text-right col-7">{{ selectedStoreName || '-' }}</div>
                </div>
                <div class="row justify-between items-start q-my-xs">
                  <div class="promo-muted">{{ $t('booking.field.project') }}</div>
                  <div class="text-right col-7">{{ selectedSkillNames || '-' }}</div>
                </div>
                <div class="row justify-between items-start q-my-xs">
                  <div class="promo-muted">{{ $t('booking.field.duration') }}</div>
                  <div class="text-right">{{ totalMinutes }} {{ $t('booking.minutes') }}</div>
                </div>
                <div v-if="totalAmount != null" class="row justify-between items-start q-my-xs">
                  <div class="promo-muted">{{ $t('booking.field.amount') }}</div>
                  <div class="text-right">${{ totalAmount }}</div>
                </div>
                <div class="row justify-between items-start q-my-xs">
                  <div class="promo-muted">{{ $t('booking.field.staff') }}</div>
                  <div class="text-right">{{ selectedStaffName || $t('booking.staff_any') }}</div>
                </div>
                <div class="row justify-between items-start q-my-xs">
                  <div class="promo-muted">{{ $t('booking.field.time') }}</div>
                  <div class="text-right">{{ selectedSlot || '-' }}</div>
                </div>
              </div>

              <!-- 备注 -->
              <q-input v-model="inputRemark" dense outlined type="textarea" autogrow :maxlength="REMARK_MAX"
                       class="pbook-input q-mt-md" :label="$t('booking.field.remark')"/>
              <div class="pbook-option-sub q-mt-xs">{{ $t('booking.remark_hint') }}</div>
            </div>

            <!-- 联系方式（已登录客户只需确认手机号） -->
            <div class="pbook-sec">
              <div class="pbook-block-title row items-center">
                <div class="pbook-num">6</div>
                <div>{{ $t('booking.contact_title') }}</div>
              </div>

              <div class="pbook-option-sub q-mb-sm">{{ $t('booking.contact_hint') }}</div>

              <!-- 手机号：客户身份以它为准（一号一账户），必填 + 短信验证。界面固定 +1，只填 10 位本地号码 -->
              <q-input v-model="inputPhone" dense outlined inputmode="numeric" :maxlength="PHONE_LEN"
                       class="pbook-input q-mt-md" :label="$t('booking.field.phone')" prefix="+1"/>
              <div class="pbook-option-sub q-mt-xs">{{ $t('booking.phone_hint') }}</div>

              <!-- 需要短信验证：未登录一律要验；已登录仅在号码与账户默认不一致时要验 -->
              <template v-if="needsPhoneCode">
                <div class="row items-center no-wrap q-mt-sm">
                  <q-input v-model="inputPhoneCode" dense outlined inputmode="numeric" :maxlength="CODE_LEN"
                           class="pbook-input col" :label="$t('booking.field.phone_code')"/>
                  <button class="pbook-code-btn q-ml-sm" :disabled="phoneCountdown > 0 || sendingPhoneCode"
                          @click="sendPhoneCode">
                    <q-spinner v-if="sendingPhoneCode" size=".9rem" class="q-mr-xs"/>
                    {{ phoneCountdown > 0 ? $t('booking.phone_code_resend_in', {s: phoneCountdown})
                    : $t('booking.phone_code_send') }}
                  </button>
                </div>
                <div class="pbook-option-sub q-mt-xs">{{ $t('booking.phone_verify_hint') }}</div>
              </template>

              <!-- 邮箱：可空、不验证。留了就发确认邮件 + 取消链接，并记住供下次预填 -->
              <q-input v-model="inputEmail" dense outlined type="email" class="pbook-input q-mt-md"
                       :label="$t('booking.email_optional')"/>
              <div class="pbook-option-sub q-mt-xs">{{ $t('booking.email_hint') }}</div>

              <!-- 短信合规披露（静态声明，非勾选项） -->
              <div class="pbook-disclosure q-mt-md">
                {{ $t('booking.sms_disclosure') }}<span class="pbook-link"
                                                       @click="openPolicyTab('privacy')">{{ $t('policy.privacy') }}</span>{{ $t('policy.and') }}<span
                  class="pbook-link" @click="openPolicyTab('terms')">{{ $t('policy.terms') }}</span>{{ $t('booking.sms_disclosure_suffix') }}
              </div>
              <!-- 营销短信同意：可选、默认不勾选，仅界面收集（不上送后端） -->
              <div class="row items-start no-wrap q-mt-sm">
                <q-checkbox v-model="marketingConsent" dense size="xs" class="q-mr-sm"
                            checked-icon="task_alt" unchecked-icon="panorama_fish_eye"/>
                <div class="col pbook-disclosure" style="cursor: pointer"
                     @click="marketingConsent = !marketingConsent">
                  {{ $t('booking.marketing_consent') }}
                </div>
              </div>
            </div>

          </template>

        </div>

        <!-- 底部操作：大视图只有一个提交按钮；小视图为上一步/下一步/预约 -->
        <div ref="actionEl" class="row items-center q-mt-lg"
             :class="step === 1 ? 'justify-center' : 'justify-between'">
          <button v-if="step > 1" class="promo-book-btn pbook-btn-sm pbook-btn-ghost"
                  :disabled="submitting" @click="step = 1">
            {{ $t('booking.prev') }}
          </button>
          <button v-if="step === 1" class="promo-book-btn pbook-btn-sm" @click="toConfirmStep">
            {{ $t('booking.next') }}
          </button>
          <button v-else class="promo-book-btn pbook-btn-sm" :disabled="submitting" @click="doBook">
            <q-spinner v-if="submitting" size="1rem" class="q-mr-sm"/>
            {{ $t('booking.book_now') }}
          </button>
        </div>

      </div>

    </div>
  </div>

</template>


<script setup>

import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {i18n} from "@/i18n/index.js";
import {useGlobalStateStore} from "@/utils/global-state.js";
import {notifyTopPositive, notifyTopWarning} from "@/utils/notification-tools.js";
import {checkIsMail, checkIsPhone} from "@/utils/format-check.js";
import {buildAttributionParams} from "@/utils/landing-params.js";
import {currentPosition, nearestStore} from "@/utils/store-geo.js";
import {TimezoneOptEnum} from "@/constants/enums/common.js";
import {
  portalBookingCreate,
  portalBookingSkills,
  portalBookingSlotsBatch,
  portalBookingStaffs,
  portalBookingStores
} from "@/api/portal-booking.js";
import {portalBookingLogin, portalMe, portalPhoneSendCode} from "@/api/portal-auth.js";
import {track, trackCustom} from "@/utils/pixel.js";

const t = i18n.global.t
const globalState = useGlobalStateStore()
const thisRouter = useRouter()

// 与后端 PortalBookingServiceImpl.MAX_ADVANCE_DAYS 对齐
const MAX_ADVANCE_DAYS = 14
const PHONE_LEN = 10
const CODE_LEN = 6
const REMARK_MAX = 200
// 验证码重发冷却（秒）；后端另有限流（邮箱 10 次/天，短信同号码 5 次/时）
const RESEND_COOLDOWN = 60
const TOTAL_STEP = 2
// 可约时间是限流最紧的接口（单 IP 30 次/时），改门店/项目后延迟合并再请求，避免连点多选打满额度
const SLOT_RELOAD_DELAY = 600

const rootEl = ref(null)
// 只给「选完上一项要自动滚过去」的分区留 ref
const skillSecEl = ref(null)
const staffSecEl = ref(null)
const timeSecEl = ref(null)
const actionEl = ref(null)

const step = ref(1)
const submitting = ref(false)
const created = ref(false)
const createdInfo = ref({storeName: '', skillNames: '', slot: ''})

const storeList = ref([])
const skillList = ref([])
const staffList = ref([])
// 未来 14 天可约时间：dateStr -> ['yyyy-MM-dd HH:mm']，一次拉整窗，无时间的日期在日历上置灰
const slotsByDate = ref({})

const loadingStores = ref(false)
const loadingSkills = ref(false)
const loadingStaffs = ref(false)
const loadingSlots = ref(false)

const selectedStoreId = ref("")
// 按定位自动选中的门店提示（"已按您的位置选择 XX（约 X km）"）；客户改选其它门店即消失
const autoStoreHint = ref("")
// 定位只在首次点 Book now 时尝试一次：失败/拒绝不重试，免得反复打扰
let autoPickTried = false
const selectedSkillIds = ref([])
const selectedStaffId = ref("")
// 偏好员工「已做出选择」（含选了「不指定」）：凭它决定是否展开选时间
const staffChosen = ref(false)
const selectedDate = ref("")
const selectedSlot = ref("")

const inputEmail = ref("")
const inputPhone = ref("")
const inputPhoneCode = ref("")
const inputRemark = ref("")
const marketingConsent = ref(false)

const sendingPhoneCode = ref(false)
const phoneCountdown = ref(0)
let phoneTimer = null
let slotTimer = null

const isLoggedIn = computed(() => !!globalState.userData)
const accountMail = computed(() => globalState.userData ? globalState.userData.mail : '')

// 账号默认手机号（10 位本地号码口径；历史数据可能带国家码 1）
const accountPhoneNational = computed(() => normalizeNational(
    globalState.userData ? globalState.userData.phone : ''))

// 要不要短信验证：未登录，或填的号码 ≠ 当前会话账户的号码——两种都要验，
// 因为手机号就是账号，换号码等于换一个账号登录（不是给当前账户改绑号码）
const needsPhoneCode = computed(() =>
    !isLoggedIn.value || !accountPhoneNational.value || accountPhoneNational.value !== inputPhone.value)

const showSelect = computed(() => step.value === 1)
const showConfirm = computed(() => step.value === 2)
// 选时间的前置条件：门店 + 项目 + 已就偏好员工做出选择
const timeReady = computed(() => !!selectedStoreId.value && selectedSkillIds.value.length > 0 && staffChosen.value)

const slotList = computed(() => selectedDate.value ? (slotsByDate.value[selectedDate.value] || []) : [])
const noSlotInWindow = computed(() => {
  const days = Object.keys(slotsByDate.value)
  return days.length > 0 && days.every(d => !slotsByDate.value[d].length)
})

const selectedStore = computed(() => storeList.value.find(s => s.id === selectedStoreId.value))
const selectedStoreName = computed(() => selectedStore.value ? selectedStore.value.name : '')
const selectedStaffName = computed(() => {
  const st = staffList.value.find(s => s.id === selectedStaffId.value)
  return st ? st.name : ''
})
const chosenSkills = computed(() => skillList.value.filter(sk => selectedSkillIds.value.includes(sk.id)))
const totalMinutes = computed(() => chosenSkills.value.reduce((sum, sk) => sum + (sk.consumeMinutes || 0), 0))
const selectedSkillNames = computed(() => chosenSkills.value.map(sk => sk.name).join(', '))

// 预估总价：仅累加已配置金额的项目；两位小数取整规避浮点误差
const totalAmount = computed(() => {
  const priced = chosenSkills.value.filter(sk => sk.serviceAmount != null)
  if (!priced.length) {
    return null
  }
  return Math.round(priced.reduce((acc, sk) => acc + Number(sk.serviceAmount), 0) * 100) / 100
})

const storeTimezoneName = computed(() => {
  const tz = selectedStore.value ? selectedStore.value.timezone : ''
  if (!tz) {
    return ''
  }
  const item = TimezoneOptEnum.fromCode(tz)
  return item ? t(item.name) : tz
})

// 手机号仅数字：输入/粘贴即净化，所见即所发
watch(inputPhone, (val) => {
  const cleaned = (val || '').replace(/\D/g, '').slice(0, PHONE_LEN)
  if (cleaned !== val) {
    inputPhone.value = cleaned
  }
})

// 门店/项目变化 → 已拉的可约时间失效；满足前置条件则延迟合并后重拉
watch([selectedStoreId, selectedSkillIds, timeReady], scheduleSlotReload, {deep: true})

onMounted(() => {
  loadStores()
  // 有本地登录态就先按缓存预填手机号与邮箱（号码与账号默认一致即免短信验证），再跟服务端核一次
  prefillFromAccount()
  syncAccount()
})

/**
 * 有 token 就静默核一次账户信息：<b>客户不需要理解「登录」这件事</b>——
 * 会话有效就把最新手机号自动填好、跳过验证；会话失效（拦截器会清掉本地登录态、公开页不跳登录页）
 * 则表单自动露出「邮箱 + 手机号验证」，照常预约、提交时自动登录。
 */
function syncAccount() {
  if (!globalState.loginToken) {
    return
  }
  portalMe().then(res => {
    if (!res || !res.data || !res.data.data) {
      return
    }
    globalState.updateUserData(res.data.data)
    prefillFromAccount()
  })
}

/**
 * 从账户预填联系方式：手机号（与账号默认一致即免短信验证）+ 邮箱（上次留过就自动填上，可改可清空）。
 */
function prefillFromAccount() {
  inputPhone.value = accountPhoneNational.value.slice(0, PHONE_LEN)
  inputEmail.value = accountMail.value || ""
}

onBeforeUnmount(() => {
  clearTimer(phoneTimer)
  if (slotTimer) {
    clearTimeout(slotTimer)
  }
})

function normalizeNational(p) {
  const digits = (p || '').replace(/\D/g, '')
  return digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
}

// 窗口内所有日期（升序）：批量结果每天必有一条（空数组 = 当天不可约）
const windowDates = computed(() => Object.keys(slotsByDate.value).sort())

// 第一个有可约时间的日期：日历默认就翻到它所在的月份——
// 今天不可约（如 8/31 已约满）而 9/1 可约时，直接展示 9 月，省得客户以为整月都没时间
const firstAvailableDate = computed(() => windowDates.value.find(d => (slotsByDate.value[d] || []).length) || '')

// q-date 的年月格式为 YYYY/MM
const defaultYearMonth = computed(() => toYearMonth(firstAvailableDate.value))

// 导航范围收敛到可约窗口（今天 ~ 今天 + 14 天），避免客户翻到没有任何数据的月份
const navMinYearMonth = computed(() => toYearMonth(windowDates.value[0]))
const navMaxYearMonth = computed(() => toYearMonth(windowDates.value[windowDates.value.length - 1]))

function toYearMonth(dateStr) {
  return dateStr ? dateStr.slice(0, 7).replace('-', '/') : undefined
}

// q-date 的 options 回调固定收到 YYYY/MM/DD；可点日期 = 批量结果中当天有可约时间
function dateOptions(dateStr) {
  const slots = slotsByDate.value[dateStr.replace(/\//g, '-')]
  return !!(slots && slots.length)
}

function loadStores() {
  loadingStores.value = true
  portalBookingStores().then(res => {
    loadingStores.value = false
    if (!res || !res.data || !res.data.data) {
      return
    }
    storeList.value = res.data.data
  })
}

/**
 * 选中门店并重置下游选择（项目/员工/时间）。<b>不滚动</b>——自动选门店时不能把正在看首页的客户拽走。
 */
function applyStore(s) {
  selectedStoreId.value = s.id
  selectedSkillIds.value = []
  selectedStaffId.value = ""
  staffChosen.value = false
  selectedDate.value = ""
  skillList.value = []
  staffList.value = []
  loadSkills()
}

/**
 * 点「Book now」时尝试按定位自动选最近门店（纯前端：坐标来自 home-content.js，见 utils/store-geo.js）。
 * <p>
 * 只在「客户还没手动选过门店」且「本次会话没试过」时执行；不支持定位 / 用户拒绝 / 超时 /
 * 门店匹配不到坐标 / 最近的也在 50km 外——<b>任何一种情况都静默放弃</b>，回到客户自己选门店的原有流程。
 * 定位结果只在内存里用一次：不写 localStorage、不上送后端。
 */
async function tryAutoPickStore() {
  if (autoPickTried || selectedStoreId.value) {
    return
  }
  autoPickTried = true
  const pos = await currentPosition()
  // 定位要 1~3 秒：期间客户可能已经自己选了门店，那就以他的选择为准
  if (!pos || selectedStoreId.value || !storeList.value.length) {
    return
  }
  const best = nearestStore(storeList.value, pos)
  if (!best) {
    return
  }
  applyStore(best.store)
  autoStoreHint.value = t('booking.auto_store_hint', {name: best.store.name, distance: formatDistance(best.km)})
}

/**
 * 距离展示：中文用公里，英文用英里（面向美国客户）。
 */
function formatDistance(km) {
  return i18n.global.locale.value === 'zh'
      ? `${km.toFixed(1)} 公里`
      : `${(km * 0.621371).toFixed(1)} mi`
}

// 列表请求序号：客户快速连点（换门店/改项目）会并发多个请求，回来的顺序不保证——
// 只认最后一次发出的那个，丢弃过期响应，免得列表和当前选择对不上
let skillReqSeq = 0
let staffReqSeq = 0
let slotReqSeq = 0

function loadSkills() {
  const seq = ++skillReqSeq
  loadingSkills.value = true
  skillList.value = []
  portalBookingSkills({storeId: selectedStoreId.value}).then(res => {
    if (seq !== skillReqSeq) {
      return
    }
    loadingSkills.value = false
    if (!res || !res.data || !res.data.data) {
      return
    }
    skillList.value = res.data.data
  })
}

function loadStaffs() {
  const seq = ++staffReqSeq
  loadingStaffs.value = true
  staffList.value = []
  portalBookingStaffs({storeId: selectedStoreId.value}).then(res => {
    if (seq !== staffReqSeq) {
      return
    }
    loadingStaffs.value = false
    if (!res || !res.data || !res.data.data) {
      return
    }
    staffList.value = res.data.data
  })
}

/**
 * 条件变化后重拉整窗可约时间：先清空旧结果，再延迟 SLOT_RELOAD_DELAY 合并请求
 * （多选项目时连点会触发多次，合并成一次，省着点用后端 30 次/时的额度）。
 */
function scheduleSlotReload() {
  slotsByDate.value = {}
  selectedSlot.value = ""
  if (slotTimer) {
    clearTimeout(slotTimer)
    slotTimer = null
  }
  if (!timeReady.value) {
    loadingSlots.value = false
    return
  }
  loadingSlots.value = true
  slotTimer = setTimeout(loadSlotsBatch, SLOT_RELOAD_DELAY)
}

function loadSlotsBatch() {
  slotTimer = null
  const seq = ++slotReqSeq
  loadingSlots.value = true
  portalBookingSlotsBatch({
    storeId: selectedStoreId.value,
    skillIdList: selectedSkillIds.value,
  }).then(res => {
    if (seq !== slotReqSeq) {
      return
    }
    loadingSlots.value = false
    if (!res || !res.data || !res.data.data) {
      return
    }
    const map = {}
    for (const day of res.data.data) {
      map[day.dateStr] = day.slotList || []
    }
    slotsByDate.value = map
    // 改过条件后原选中日期可能已不可约：清空，避免停在置灰日期上
    if (selectedDate.value && !(map[selectedDate.value] || []).length) {
      selectedDate.value = ""
    }
  })
}

// 系统设了「减少动态效果」就直接跳，不做平滑滚动
function scrollBehavior() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

// 选完一项自动滚到下一项
function scrollTo(el) {
  if (!el) {
    return
  }
  nextTick(() => el.scrollIntoView({behavior: scrollBehavior(), block: 'center'}))
}

function selectStore(s) {
  if (selectedStoreId.value !== s.id) {
    applyStore(s)
    // 手动选门店 = 客户自己的决定，清掉自动选择的提示
    autoStoreHint.value = ""
    trackCustom('StoreSelected')
  }
  scrollTo(skillSecEl.value)
}

function toggleSkill(id) {
  const wasEmpty = !selectedSkillIds.value.length
  const idx = selectedSkillIds.value.indexOf(id)
  if (idx >= 0) {
    selectedSkillIds.value.splice(idx, 1)
  } else {
    selectedSkillIds.value.push(id)
  }
  // 首次选中项目即把员工列表准备好
  if (selectedSkillIds.value.length && !staffList.value.length && !loadingStaffs.value) {
    loadStaffs()
    trackCustom('ServiceSelected')
  }
  // 绝大多数客户只约一个项目：首次选中就滚到下一步；之后再加选/取消不打断（项目仍可多选）
  if (wasEmpty && selectedSkillIds.value.length) {
    scrollTo(staffSecEl.value)
  }
}

function selectStaff(id) {
  selectedStaffId.value = id
  staffChosen.value = true
  trackCustom('StaffSelected')
  scrollTo(timeSecEl.value)
}

function selectSlot(slot) {
  selectedSlot.value = slot
  trackCustom('DateSelected')
  scrollTo(actionEl.value)
}

function openPolicyTab(type) {
  const target = thisRouter.resolve({name: type === 'terms' ? 'policyTerms' : 'policyPrivacy'})
  window.open(target.href, '_blank')
}


function sendPhoneCode() {
  if (!checkIsPhone(inputPhone.value)) {
    notifyTopWarning(t('booking.phone_invalid'))
    return
  }
  sendingPhoneCode.value = true
  portalPhoneSendCode({phone: '1' + inputPhone.value}).then(res => {
    sendingPhoneCode.value = false
    if (!res) {
      return
    }
    notifyTopPositive(t('booking.phone_code_sent'))
    phoneTimer = startCountdown(phoneCountdown, phoneTimer)
  })
}

function startCountdown(counter, timer) {
  clearTimer(timer)
  counter.value = RESEND_COOLDOWN
  const handle = setInterval(() => {
    counter.value--
    if (counter.value <= 0) {
      clearInterval(handle)
    }
  }, 1000)
  return handle
}

function clearTimer(timer) {
  if (timer) {
    clearInterval(timer)
  }
}

// 小视图第 1 步 -> 第 2 步：选择项齐了才放行
function toConfirmStep() {
  if (!checkSelections()) {
    return
  }
  step.value = 2
  nextTick(scrollToSelf)
}

function checkSelections() {
  if (!selectedStoreId.value) {
    notifyTopWarning(t('booking.pick_store'))
    return false
  }
  if (!selectedSkillIds.value.length) {
    notifyTopWarning(t('booking.pick_project'))
    return false
  }
  if (!staffChosen.value) {
    notifyTopWarning(t('booking.pick_staff'))
    return false
  }
  if (!selectedSlot.value) {
    notifyTopWarning(t('booking.pick_time'))
    return false
  }
  return true
}

function checkContact() {
  // 邮箱可空、不验证：填了才校验格式（客户身份以手机号为准）
  if (inputEmail.value && !checkIsMail(inputEmail.value)) {
    notifyTopWarning(t('booking.email_invalid'))
    return false
  }
  if (!checkIsPhone(inputPhone.value)) {
    notifyTopWarning(t('booking.phone_invalid'))
    return false
  }
  if (needsPhoneCode.value && !inputPhoneCode.value) {
    notifyTopWarning(t('booking.phone_code_required'))
    return false
  }
  if (inputRemark.value.length > REMARK_MAX) {
    notifyTopWarning(t('booking.remark_too_long'))
    return false
  }
  return true
}

/**
 * 立即预约。<b>手机号就是账号</b>：只要填的号码与当前会话账户的号码不一致（含未登录），
 * 就用「手机号 + 短信验证码」重新走一次免密登录 —— 会话切到该号码的账户（没有则自动建号，会话 180 天），
 * <b>不是</b>给当前账户改绑号码（那会让单子算到别人号码头上）。号码一致则直接下单，无需任何验证。
 * 邮箱是可空的联系方式，随登录/下单一起上送，不做验证。
 */
async function doBook() {
  if (submitting.value || !checkSelections() || !checkContact()) {
    return
  }
  submitting.value = true
  const wasLoggedIn = isLoggedIn.value
  try {
    // needsPhoneCode = 未登录，或填的号码 ≠ 账户号码 —— 两种都要用这个号码重新登录（换号码=换账号）
    if (needsPhoneCode.value) {
      const authRes = await portalBookingLogin({
        // 邮箱可空、不验证：仅作联系方式与下次预填值
        email: inputEmail.value || null,
        phone: '1' + inputPhone.value,
        phoneCode: inputPhoneCode.value,
        // 站外投放归因（与注册同结构）：仅首次建号时记录
        ...buildAttributionParams(),
      })
      if (!authRes) {
        return
      }
      const token = authRes.headers.get('Yl-Token')
      if (!token) {
        notifyTopWarning(t('login.token_missing'))
        return
      }
      // 会话切到该号码的账户（可能与之前不是同一个账户）
      globalState.updateLoginToken(token)
      globalState.updateUserData(authRes.data.data)
    }
    const createRes = await portalBookingCreate({
      storeId: selectedStoreId.value,
      bookTimeStr: selectedSlot.value,
      skillIdList: selectedSkillIds.value,
      preferredStaffId: selectedStaffId.value || null,
      phone: '1' + inputPhone.value,
      // 本次联系邮箱（可空）：决定要不要发确认邮件与取消链接，同时同步为账户默认邮箱
      email: inputEmail.value || null,
      remark: inputRemark.value || null,
      ...buildAttributionParams(),
    })
    if (!createRes) {
      // 会话在提交途中失效（拦截器已清掉登录态，表单会自动露出邮箱/验证码）：给一句人话，别让客户对着静默失败发呆
      if (wasLoggedIn && !isLoggedIn.value) {
        notifyTopWarning(t('booking.session_expired'))
      }
      return
    }
    createdInfo.value = {
      mail: inputEmail.value || '',
      storeName: selectedStoreName.value,
      skillNames: selectedSkillNames.value,
      slot: selectedSlot.value,
    }
    created.value = true
    notifyTopPositive(t('booking.create_success'))
    track('Schedule')
    nextTick(scrollToSelf)
  } finally {
    submitting.value = false
  }
}

function resetAll() {
  created.value = false
  step.value = 1
  selectedStoreId.value = ""
  selectedSkillIds.value = []
  selectedStaffId.value = ""
  staffChosen.value = false
  selectedDate.value = ""
  selectedSlot.value = ""
  skillList.value = []
  staffList.value = []
  slotsByDate.value = {}
  inputPhoneCode.value = ""
  inputRemark.value = ""
  // 已登录（含刚自动登录）客户预填账号默认手机号与邮箱
  prefillFromAccount()
  nextTick(scrollToSelf)
}

/**
 * 把预约区滚到视口中心（放不下则贴顶）。首页的「Book now」按钮也调用它，故对外暴露。
 */
function scrollToSelf() {
  // 「Book now」既是滚动入口，也是定位授权的触发点（用户手势内发起，不在页面加载时弹权限框）
  tryAutoPickStore()
  const el = rootEl.value
  if (!el) {
    return
  }
  const rect = el.getBoundingClientRect()
  const top = rect.top + window.scrollY
  const offset = rect.height < window.innerHeight ? (window.innerHeight - rect.height) / 2 : 12
  window.scrollTo({top: Math.max(top - offset, 0), behavior: scrollBehavior()})
}

defineExpose({scrollToSelf})

</script>


<style scoped lang="scss">

// 与 WebPromo 同一套配色（固定，不随站内主题切换）
$promo-red: #cc2e2d;

.pbook-root {
  // Quasar 组件（输入框聚焦/浮标、勾选框、日历选中态…）默认吃 --q-primary（蓝），
  // 这里整块改成本页主色，省得逐个组件传 color / 写 :deep 覆盖
  --q-primary: #{$promo-red};
  color: #232323;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  scroll-margin-top: 1rem;
}

.pbook-card {
  // 单列表单，宽屏下不铺满 1080 的容器宽度，保持一份表单该有的阅读宽度
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #e6e8ec;
  border-radius: 1rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, .07);
}

// 分区自上而下排布（不再左右分栏）
.pbook-sec + .pbook-sec {
  margin-top: 1.7rem;
}

.pbook-success-title {
  margin: 0 !important;
  font-weight: 800 !important;
}

// ===== 分区标题：红色序号 + 标题 =====
.pbook-block-title {
  font-weight: 700;
  font-size: 1.05rem;
  margin-bottom: .7rem;
}

.pbook-num {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: .55rem;
  border-radius: 50%;
  background-color: $promo-red;
  color: #fff;
  font-size: .8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 依赖上一步的分区：未满足前只留标题 + 这行灰字，不展示具体数据
.pbook-placeholder {
  padding: 1.1rem .2rem;
  color: #6f788b;
  font-size: .9rem;
}

// ===== 选项（门店/项目/员工） =====
.pbook-option {
  padding: .65rem .8rem;
  border: 1px solid #e6e8ec;
  border-radius: .7rem;
  background: #fff;
  cursor: pointer;
  transition: border-color .25s ease, background-color .25s ease;

  &:hover {
    border-color: rgba(204, 46, 45, .55);
  }
}

.pbook-option-active {
  border-color: $promo-red;
  background-color: #fdf3f3;
}

.pbook-option-name {
  font-weight: 600;
}

// ===== 项目：弹性换行（可选项多，一行能塞几个塞几个） =====
.pbook-skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: .6rem;
}

.pbook-skill {
  // 卡内一律不换行：卡片宽度 = 两行（项目名 / 金额+时长）里更宽的那一行，按内容自然撑开，
  // 一行放得下几张放几张、放不下换行（不拉伸、不等宽）
  flex: 0 0 auto;
  max-width: 100%;
}

.pbook-skill-name {
  white-space: nowrap;
  // 兜底：极端长的项目名截断，不撑破卡片/容器
  overflow: hidden;
  text-overflow: ellipsis;
}

// 金额 + 时长：同一行，位于项目名称下方（与名称左对齐，让开前面的勾选图标）
.pbook-skill-meta {
  margin-top: .25rem;
  // 左缩进 = 图标 1rem + q-mr-sm .5rem
  padding-left: 1.5rem;
  white-space: nowrap;
}

.pbook-option-sub {
  color: #6f788b;
  font-size: .78rem;
  line-height: 1.45;
  word-break: break-word;
}

.pbook-price {
  color: $promo-red;
  font-weight: 700;
  font-size: .85rem;
}

// ===== 可约时间 =====
.pbook-slot {
  padding: .35rem .75rem;
  border: 1px solid #e6e8ec;
  border-radius: 999px;
  font-size: .82rem;
  cursor: pointer;
  transition: border-color .25s ease, background-color .25s ease;

  &:hover {
    border-color: rgba(204, 46, 45, .55);
  }
}

.pbook-slot-active {
  border-color: $promo-red;
  background-color: $promo-red;
  color: #fff;
  font-weight: 600;
}

// 日历：全局 override-components.scss 里有一条 `.q-date__main .bg-primary`（管理端深色主题遗留，
// 带 !important）会把选中日期涂成容器底色，比 --q-primary 更强——这里按选择器优先级压回本页主色
.pbook-date {
  :deep(.q-date__main .bg-primary) {
    background-color: $promo-red !important;
  }

  :deep(.text-primary) {
    color: $promo-red !important;
  }
}

// ===== 汇总 / 表单 =====
.pbook-summary {
  background: #f7f7f8;
  border: 1px solid #e6e8ec;
  border-radius: .8rem;
  padding: .9rem 1rem;
  font-size: .92rem;
}

.pbook-input {
  // 聚焦描边 / 浮动 label 颜色由 .pbook-root 的 --q-primary 统一接管，这里只补一个 hover 提示
  :deep(.q-field__control):hover:before {
    border-color: rgba(204, 46, 45, .55);
  }
}

// 发送验证码：小号描边按钮（与 promo 主按钮同色系）
.pbook-code-btn {
  white-space: nowrap;
  background: #fff;
  color: $promo-red;
  border: 1px solid $promo-red;
  border-radius: .6rem;
  font-family: inherit;
  font-size: .85rem;
  font-weight: 600;
  padding: .5rem .9rem;
  cursor: pointer;
  transition: background-color .25s ease;

  &:hover:not(:disabled) {
    background-color: #fdf3f3;
  }

  &:disabled {
    opacity: .5;
    cursor: not-allowed;
  }
}

.pbook-disclosure {
  color: #6f788b;
  font-size: .76rem;
  line-height: 1.5;
}

.pbook-link {
  color: $promo-red;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

// ===== 步骤指示 =====
.pbook-step-dot {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  font-size: .72rem;
  border: 1px solid #d5d8de;
  color: #6f788b;
  transition: all .3s ease;
}

.pbook-step-dot-active {
  border-color: $promo-red;
  color: $promo-red;
  font-weight: 700;
  transform: scale(1.1);
}

.pbook-step-dot-done {
  background-color: $promo-red;
  border-color: $promo-red;
  color: #fff;
}

.pbook-step-line {
  width: 2rem;
  height: 1px;
  background-color: #d5d8de;
}

.pbook-step-line-done {
  background-color: $promo-red;
}

.pbook-step-title {
  font-weight: 700;
}

// 底部按钮：比 hero 主按钮小一号，白描边留给深色背景，这里去掉
.pbook-btn-sm {
  font-size: 1.05rem;
  padding: .6rem 1.8rem;
  border-width: 2px;

  &:disabled {
    opacity: .6;
    cursor: not-allowed;
    transform: none;
  }
}

.pbook-btn-ghost {
  background: #fff;
  color: $promo-red;
  border-color: $promo-red;

  &:hover {
    background-color: #fdf3f3;
  }
}

</style>

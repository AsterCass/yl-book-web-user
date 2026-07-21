<template>

  <!-- 单根节点：确保父级传入的 class（如 q-mb-lg）能被正常继承（多根 fragment 会丢弃属性并告警） -->
  <div>

  <!-- 收起态：列表最上方的「新建预约」入口卡片 -->
  <div v-if="!expanded" class="booking-card booking-create-cta row items-center justify-center"
       @click="expand">
    <q-icon name="fa-solid fa-plus" size="1.1rem" class="q-mr-sm"/>
    <h5>{{ $t('booking.create') }}</h5>
  </div>

  <!-- 展开态：分步创建预约 -->
  <div v-else class="booking-card column">

    <!-- 步骤指示 -->
    <div class="row items-center justify-center q-mb-md">
      <template v-for="s in TOTAL_STEP" :key="s">
        <div class="booking-step-dot row items-center justify-center"
             :class="{'booking-step-dot-active': step === s, 'booking-step-dot-done': step > s}">
          <q-icon v-if="step > s" name="fa-solid fa-check" size=".65rem"/>
          <span v-else>{{ s }}</span>
        </div>
        <div v-if="s < TOTAL_STEP" class="booking-step-line" :class="{'booking-step-line-done': step > s}"/>
      </template>
    </div>
    <div class="row justify-center q-mb-md">
      <h5 class="cask-general-little-title">{{ $t(stepTitle) }}</h5>
    </div>

    <q-separator class="component-separator-base q-mb-md" size="1px"/>

    <!-- ===== 步骤 1：选择门店 ===== -->
    <div v-if="step === 1">
      <div v-if="loadingStores" class="row justify-center q-py-lg">
        <q-spinner-pie size="40px"/>
      </div>
      <div v-else-if="!storeList.length" class="text-center q-py-lg" style="opacity: .6">
        {{ $t('booking.no_store') }}
      </div>
      <div v-else class="column">
        <div v-for="s in storeList" :key="s.id" class="booking-option row items-center no-wrap q-my-xs"
             :class="{'booking-option-active': selectedStoreId === s.id}" @click="selectStore(s)">
          <div class="col column">
            <!-- 图标与门店名同处一行并居中，二者必然水平对齐 -->
            <div class="row items-center no-wrap q-mb-xs">
              <q-icon name="fa-solid fa-store" size="1rem" class="q-mr-sm"/>
              <div class="col">{{ s.name }}</div>
            </div>
            <div v-if="s.address" class="row items-start no-wrap booking-option-sub">
              <q-icon name="fa-solid fa-location-dot" size=".7rem" class="q-mr-xs booking-option-sub-icon"/>
              <div class="col">{{ s.address }}</div>
            </div>
            <div v-if="s.phone" class="row items-start no-wrap booking-option-sub">
              <q-icon name="fa-solid fa-phone" size=".7rem" class="q-mr-xs booking-option-sub-icon"/>
              <div class="col">{{ s.phone }}</div>
            </div>
          </div>
          <!-- 打勾作为行的直接子元素，由外层 items-center 相对整个选项垂直居中 -->
          <q-icon v-if="selectedStoreId === s.id" name="fa-solid fa-circle-check" size="1rem" class="q-ml-sm"/>
        </div>
      </div>
    </div>

    <!-- ===== 步骤 2：选择预约项目（可多选） ===== -->
    <div v-else-if="step === 2">
      <div v-if="loadingSkills" class="row justify-center q-py-lg">
        <q-spinner-pie size="40px"/>
      </div>
      <div v-else-if="!skillList.length" class="text-center q-py-lg" style="opacity: .5">
        {{ $t('booking.no_project') }}
      </div>
      <div v-else>
        <div v-for="sk in skillList" :key="sk.id" class="booking-option row items-center q-my-xs"
             :class="{'booking-option-active': selectedSkillIds.includes(sk.id)}" @click="toggleSkill(sk.id)">
          <q-icon :name="selectedSkillIds.includes(sk.id) ? 'task_alt' : 'panorama_fish_eye'"
                  size="1rem" class="q-mr-sm"/>
          <div class="col">{{ sk.name }}</div>
          <div style="opacity: .5; font-size: .75rem">{{ sk.consumeMinutes }} {{ $t('booking.minutes') }}</div>
        </div>
        <div class="row justify-end q-mt-sm" style="opacity: .6; font-size: .78rem">
          {{ $t('booking.total_minutes', {minutes: totalMinutes}) }}
        </div>
      </div>
    </div>

    <!-- ===== 步骤 3：选择偏好员工（可不指定） ===== -->
    <div v-else-if="step === 3">
      <div class="q-mb-md" style="opacity: .5">
        {{ $t('booking.staff_note') }}
      </div>
      <div v-if="loadingStaffs" class="row justify-center q-py-lg">
        <q-spinner-pie size="40px"/>
      </div>
      <div v-else class="column">
        <div class="booking-option row items-center q-my-xs"
             :class="{'booking-option-active': !selectedStaffId}" @click="selectStaff('')">
          <q-icon name="fa-solid fa-shuffle" size="1rem" class="q-mr-sm"/>
          <div class="col">{{ $t('booking.staff_any') }}</div>
          <q-icon v-if="!selectedStaffId" name="fa-solid fa-circle-check" size="1rem"/>
        </div>
        <div v-for="st in staffList" :key="st.id" class="booking-option row items-center q-my-xs"
             :class="{'booking-option-active': selectedStaffId === st.id}" @click="selectStaff(st.id)">
          <q-icon name="fa-regular fa-user" size="1rem" class="q-mr-sm"/>
          <div class="col">{{ st.name }}</div>
          <q-icon v-if="selectedStaffId === st.id" name="fa-solid fa-circle-check" size="1rem"/>
        </div>
      </div>
    </div>

    <!-- ===== 步骤 4：选择预约时间（仅未来 14 天） ===== -->
    <div v-else-if="step === 4">
      <div class="q-mb-lg" style="opacity: .5">
        {{ $t('booking.time_note', {days: MAX_ADVANCE_DAYS}) }}
      </div>
      <div class="row justify-center">
        <q-date class="no-shadow bg-transparent" v-model="selectedDate" mask="YYYY-MM-DD" minimal :options="dateOptions"
                @update:model-value="loadSlots"/>
      </div>

      <div class="q-mt-md">
        <div v-if="loadingSlots" class="row justify-center q-py-md">
          <q-spinner-pie size="30px"/>
        </div>
        <div v-else-if="!selectedDate" class="text-center q-py-sm" style="opacity: .5">
          {{ $t('booking.pick_date_first') }}
        </div>
        <div v-else-if="!slotList.length" class="text-center q-py-sm" style="opacity: .5">
          {{ $t('booking.no_slot') }}
        </div>
        <div v-else class="row justify-center">
          <div v-for="slot in slotList" :key="slot" class="booking-slot q-ma-xs"
               :class="{'booking-slot-active': selectedSlot === slot}" @click="selectedSlot = slot">
            {{ slot.slice(11) }}
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 步骤 5：确认预约信息 ===== -->
    <div v-else>
      <div class="row justify-between items-start q-my-sm">
        <div style="opacity: .5">{{ $t('booking.field.store') }}</div>
        <div class="text-right">{{ selectedStoreName }}</div>
      </div>
      <div class="row justify-between items-start q-my-sm">
        <div style="opacity: .5">{{ $t('booking.field.project') }}</div>
        <div class="text-right col-7">{{ selectedSkillNames }}</div>
      </div>
      <div class="row justify-between items-start q-my-sm">
        <div style="opacity: .5">{{ $t('booking.field.duration') }}</div>
        <div class="text-right">{{ totalMinutes }} {{ $t('booking.minutes') }}</div>
      </div>
      <div class="row justify-between items-start q-my-sm">
        <div style="opacity: .5">{{ $t('booking.field.staff') }}</div>
        <div class="text-right">{{ selectedStaffName || $t('booking.staff_any') }}</div>
      </div>
      <div class="row justify-between items-start q-my-sm">
        <div style="opacity: .5">{{ $t('booking.field.time') }}</div>
        <div class="text-right">{{ selectedSlot }}</div>
      </div>

      <q-separator class="component-separator-base q-my-md" size="1px"/>

      <q-input v-model="inputPhone" dense outlined tabindex="0" inputmode="numeric" :maxlength="PHONE_MAX"
               class="component-outline-input-grow-on-semi-trans">
        <template v-slot:prepend>
          <div class="row items-center">
            <q-icon class="q-mr-sm" name="fa-solid fa-phone" size="1rem"/>
            <div>{{ $t('booking.field.phone') }}</div>
          </div>
        </template>
      </q-input>
      <div class="q-mx-sm q-mt-xs" style="opacity: .5; font-size: .75rem">
        {{ $t('booking.phone_hint') }}
      </div>

      <q-input v-model="inputRemark" dense outlined tabindex="0" type="textarea" autogrow
               :maxlength="REMARK_MAX" class="q-mt-md component-outline-input-grow-on-semi-trans">
        <template v-slot:prepend>
          <div class="row items-center">
            <q-icon class="q-mr-sm" name="fa-regular fa-comment-dots" size="1rem"/>
            <div>{{ $t('booking.field.remark') }}</div>
          </div>
        </template>
      </q-input>
      <div class="q-mx-sm q-mt-xs" style="opacity: .5; font-size: .75rem">
        {{ $t('booking.remark_hint') }}
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="row justify-between items-center q-mt-lg">
      <q-btn no-caps unelevated class="shadow-1 component-outline-btn-grow"
             :label="step === 1 ? $t('booking.cancel') : $t('booking.prev')" @click="prevStep"/>
      <q-btn v-if="step < TOTAL_STEP" no-caps unelevated class="shadow-2 component-full-btn-grow"
             style="background-color: rgb(var(--semi-bg-container-background-color)) !important"
             :label="$t('booking.next')" @click="nextStep"/>
      <q-btn v-else no-caps unelevated class="shadow-2 component-full-btn-grow" :loading="submitting"
             style="background-color: rgb(var(--semi-bg-container-background-color)) !important"
             :label="$t('booking.confirm')" @click="doCreate"/>
    </div>

  </div>

  <cask-dialog-judgment v-model="showOverlapDialog" :dialog-judgment-data="overlapDialogData"
                        :callback-method="onOverlapConfirm"/>

  </div>

</template>


<script setup>

import {computed, ref, watch} from "vue";
import CaskDialogJudgment from "@/ui/components/CaskDialogJudgment.vue";
import {notifyTopPositive, notifyTopWarning} from "@/utils/notification-tools.js";
import {i18n} from "@/i18n/index.js";
import {useGlobalStateStore} from "@/utils/global-state.js";
import {checkIsPhone} from "@/utils/format-check.js";
import {buildAttributionParams} from "@/utils/landing-params.js";
import {BookStatusEnum} from "@/constants/enums/book.js";
import {
  portalBookingCreate,
  portalBookingSkills,
  portalBookingSlots,
  portalBookingStaffs,
  portalBookingStores
} from "@/api/portal-booking.js";

const emit = defineEmits(['created'])

const props = defineProps({
  // 父级（仪表盘）当前已加载的历史预约，用于下单前的宽松重合检查（不额外请求后端）
  loadedBookings: {
    type: Array,
    default: () => [],
  },
})

const t = i18n.global.t
const globalState = useGlobalStateStore();

// 与后端 PortalBookingServiceImpl.MAX_ADVANCE_DAYS 对齐
const MAX_ADVANCE_DAYS = 14
// 与后端 PortalCreateBookingParam 的 @Pattern(^[0-9]{0,20}$) / @Size(max = 200) 对齐
const PHONE_MAX = 20
const REMARK_MAX = 200
const TOTAL_STEP = 5
const STEP_TITLES = [
  'booking.step.store',
  'booking.step.project',
  'booking.step.staff',
  'booking.step.time',
  'booking.step.confirm',
]

const expanded = ref(false)
const step = ref(1)
const submitting = ref(false)

const showOverlapDialog = ref(false)
const overlapDialogData = ref({title: "", content: "", falseLabel: "", trueLabel: ""})

const storeList = ref([])
const skillList = ref([])
const staffList = ref([])
const slotList = ref([])

const loadingStores = ref(false)
const loadingSkills = ref(false)
const loadingStaffs = ref(false)
const loadingSlots = ref(false)

const selectedStoreId = ref("")
const selectedSkillIds = ref([])
const selectedStaffId = ref("")
const selectedDate = ref("")
const selectedSlot = ref("")
const inputPhone = ref("")
const inputRemark = ref("")

// 手机号仅数字：输入/粘贴即净化，所见即所发
watch(inputPhone, (val) => {
  const cleaned = (val || '').replace(/\D/g, '').slice(0, PHONE_MAX)
  if (cleaned !== val) {
    inputPhone.value = cleaned
  }
})


const stepTitle = computed(() => STEP_TITLES[step.value - 1])

const selectedStore = computed(() => storeList.value.find(s => s.id === selectedStoreId.value))
const selectedStoreName = computed(() => selectedStore.value ? selectedStore.value.name : '')

const selectedStaffName = computed(() => {
  const st = staffList.value.find(s => s.id === selectedStaffId.value)
  return st ? st.name : ''
})

const chosenSkills = computed(() => skillList.value.filter(sk => selectedSkillIds.value.includes(sk.id)))
const totalMinutes = computed(() => chosenSkills.value.reduce((sum, sk) => sum + (sk.consumeMinutes || 0), 0))
const selectedSkillNames = computed(() => chosenSkills.value.map(sk => sk.name).join(', '))

// 门店本地「今天」：预约窗口按门店时区算（后端用门店本地墙钟）
const minDate = computed(() => todayInTz(selectedStore.value ? selectedStore.value.timezone : ''))
const maxDate = computed(() => shiftDate(minDate.value, MAX_ADVANCE_DAYS))


function todayInTz(tz) {
  try {
    // en-CA 输出 YYYY-MM-DD
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: tz || undefined, year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(new Date())
  } catch (e) {
    return new Intl.DateTimeFormat('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date())
  }
}

function shiftDate(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + days)
  return dt.toISOString().slice(0, 10)
}

// q-date 的 options 回调固定收到 YYYY/MM/DD
function dateOptions(dateStr) {
  const d = dateStr.replace(/\//g, '-')
  return d >= minDate.value && d <= maxDate.value
}


function expand() {
  expanded.value = true
  step.value = 1
  // 预填账户手机号（后端在 phone 留空时同样回退用账户手机号，这里预填让该行为可见、可改）
  const accountPhone = globalState.userData ? globalState.userData.phone : ''
  inputPhone.value = (accountPhone || '').replace(/\D/g, '').slice(0, PHONE_MAX)
  loadStores()
}

function collapseAndReset() {
  expanded.value = false
  step.value = 1
  selectedStoreId.value = ""
  selectedSkillIds.value = []
  selectedStaffId.value = ""
  selectedDate.value = ""
  selectedSlot.value = ""
  inputPhone.value = ""
  inputRemark.value = ""
  skillList.value = []
  staffList.value = []
  slotList.value = []
}

function loadStores() {
  if (storeList.value.length) {
    return
  }
  loadingStores.value = true
  portalBookingStores().then(res => {
    loadingStores.value = false
    if (!res || !res.data || !res.data.data) {
      return
    }
    storeList.value = res.data.data
  })
}

function loadSkills() {
  loadingSkills.value = true
  skillList.value = []
  portalBookingSkills({storeId: selectedStoreId.value}).then(res => {
    loadingSkills.value = false
    if (!res || !res.data || !res.data.data) {
      return
    }
    skillList.value = res.data.data
  })
}

function loadStaffs() {
  loadingStaffs.value = true
  staffList.value = []
  portalBookingStaffs({storeId: selectedStoreId.value}).then(res => {
    loadingStaffs.value = false
    if (!res || !res.data || !res.data.data) {
      return
    }
    staffList.value = res.data.data
  })
}

function loadSlots() {
  selectedSlot.value = ""
  slotList.value = []
  if (!selectedDate.value) {
    return
  }
  loadingSlots.value = true
  portalBookingSlots({
    storeId: selectedStoreId.value,
    dateStr: selectedDate.value,
    skillIdList: selectedSkillIds.value,
    preferredStaffId: selectedStaffId.value || undefined,
  }).then(res => {
    loadingSlots.value = false
    if (!res || !res.data || !res.data.data) {
      return
    }
    slotList.value = res.data.data
  })
}

// 换门店后，项目/员工/时间全部失效
function selectStore(s) {
  if (selectedStoreId.value === s.id) {
    return
  }
  selectedStoreId.value = s.id
  selectedSkillIds.value = []
  selectedStaffId.value = ""
  selectedDate.value = ""
  selectedSlot.value = ""
  skillList.value = []
  staffList.value = []
  slotList.value = []
}

// 项目影响总时长，已选时间失效
function toggleSkill(id) {
  const idx = selectedSkillIds.value.indexOf(id)
  if (idx >= 0) {
    selectedSkillIds.value.splice(idx, 1)
  } else {
    selectedSkillIds.value.push(id)
  }
  selectedSlot.value = ""
  slotList.value = []
}

function selectStaff(id) {
  if (selectedStaffId.value === id) {
    return
  }
  selectedStaffId.value = id
  selectedSlot.value = ""
  slotList.value = []
}

function nextStep() {
  if (step.value === 1) {
    if (!selectedStoreId.value) {
      notifyTopWarning(t('booking.pick_store'))
      return
    }
    step.value = 2
    if (!skillList.value.length) {
      loadSkills()
    }
    return
  }
  if (step.value === 2) {
    if (!selectedSkillIds.value.length) {
      notifyTopWarning(t('booking.pick_project'))
      return
    }
    step.value = 3
    if (!staffList.value.length) {
      loadStaffs()
    }
    return
  }
  if (step.value === 3) {
    step.value = 4
    // 回退改过条件时，重新拉取当天可约时间
    if (selectedDate.value) {
      loadSlots()
    }
    return
  }
  if (step.value === 4) {
    if (!selectedSlot.value) {
      notifyTopWarning(t('booking.pick_time'))
      return
    }
    step.value = 5
  }
}

function prevStep() {
  if (step.value === 1) {
    collapseAndReset()
    return
  }
  step.value--
}

function doCreate() {
  if (!selectedStoreId.value || !selectedSkillIds.value.length || !selectedSlot.value) {
    notifyTopWarning(t('booking.incomplete'))
    return
  }
  if (!checkIsPhone(inputPhone.value)) {
    notifyTopWarning(t('booking.phone_invalid'))
    return
  }
  if (inputRemark.value.length > REMARK_MAX) {
    notifyTopWarning(t('booking.remark_too_long'))
    return
  }
  // 宽松重合检查：仅对已加载的历史预约（不请求后端），发现重合先确认，仍允许创建（可能为朋友代约）
  const overlapped = findOverlapBooking()
  if (overlapped) {
    overlapDialogData.value = {
      title: t('booking.overlap.title'),
      content: t('booking.overlap.content', {
        store: overlapped.storeName || '',
        time: overlapped.bookingTime,
      }),
      falseLabel: t('booking.overlap.cancel'),
      trueLabel: t('booking.overlap.confirm'),
    }
    showOverlapDialog.value = true
    return
  }
  submitCreate()
}

// 在门店本地墙钟字符串（yyyy-MM-dd HH:mm）上加分钟数，仅做本地历法运算，不涉及时区换算
function addMinutesToWallClock(timeStr, minutes) {
  const [datePart, timePart] = timeStr.split(' ')
  const [y, mo, d] = datePart.split('-').map(Number)
  const [h, mi] = timePart.split(':').map(Number)
  const dt = new Date(y, mo - 1, d, h, mi + minutes)
  const pad = n => String(n).padStart(2, '0')
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`
}

// 找出第一条与新预约时间重合的已加载历史预约（不算已取消）。
// 时间为各门店本地墙钟，格式统一（yyyy-MM-dd HH:mm），字典序即时间序，直接字符串比较；
// 跨时区门店的墙钟对比并不严格，但本检查本就是宽松提示，不作为硬拦截
function findOverlapBooking() {
  const newStart = selectedSlot.value
  const newEnd = addMinutesToWallClock(newStart, totalMinutes.value)
  for (const booking of props.loadedBookings) {
    if (!booking || booking.status === BookStatusEnum.CANCEL.code || !booking.bookingTime) {
      continue
    }
    const existStart = booking.bookingTime
    const existEnd = booking.endTime || booking.bookingTime
    if (newStart < existEnd && newEnd > existStart) {
      return booking
    }
  }
  return null
}

function onOverlapConfirm(confirmed) {
  showOverlapDialog.value = false
  if (confirmed) {
    submitCreate()
  }
}

function submitCreate() {
  submitting.value = true
  portalBookingCreate({
    storeId: selectedStoreId.value,
    bookTimeStr: selectedSlot.value,
    skillIdList: selectedSkillIds.value,
    preferredStaffId: selectedStaffId.value || null,
    // 留空传 null：后端 @Pattern/@Size 跳过 null，且 phone 为空时回退账户手机号
    phone: inputPhone.value || null,
    remark: inputRemark.value || null,
    // 站外投放归因（与注册同结构）：从 globalState 取，无 sourceCode/referralCode 则不下发，后端回退账户记录
    ...buildAttributionParams(),
  }).then(res => {
    submitting.value = false
    if (!res) {
      return
    }
    notifyTopPositive(t('booking.create_success'))
    collapseAndReset()
    emit('created')
  })
}

</script>


<style scoped lang="scss">

.booking-create-cta {
  cursor: pointer;
  border: 1px dashed rgba(var(--text-color), .35);
  transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(var(--text-color), .7);
  }
}

.booking-step-dot {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  font-size: .72rem;
  border: 1px solid rgba(var(--text-color), .35);
  color: rgba(var(--text-color), .6);
  transition: all .3s ease;
}

.booking-step-dot-active {
  border-color: rgb(var(--text-color));
  color: rgb(var(--text-color));
  font-weight: 600;
  transform: scale(1.1);
}

.booking-step-dot-done {
  background-color: rgba(var(--text-color));
  border-color: rgba(var(--text-color));
  color: rgb(var(--full-container-text-color));
}

.booking-step-line {
  width: 1.5rem;
  height: 1px;
  background-color: rgba(var(--text-color), .25);
  transition: background-color .3s ease;
}

.booking-step-line-done {
  background-color: rgba(var(--text-color), .75);
}

.booking-option {
  padding: .6rem .75rem;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid rgba(var(--text-color), .18);
  transition: border-color .25s ease, background-color .25s ease;

  &:hover {
    border-color: rgba(var(--text-color), .5);
  }
}

.booking-option-active {
  border-color: rgb(var(--text-color));
  background-color: rgba(var(--text-color), .07);
}

// 门店地址/电话：次要信息，地址可能较长需换行
.booking-option-sub {
  margin-top: 3px;
  // 左缩进 = 门店图标 1rem + q-mr-sm .5rem，使副行与门店名左对齐
  padding-left: 1.5rem;
  opacity: .55;
  font-size: .75rem;
  line-height: 1.35;
  word-break: break-word;
}

// 图标盒高度取副行行高（.75rem × 1.35），配合 items-start 让图标与首行文字居中对齐；
// 地址换行成多行时图标仍贴首行，不会被拉到整段的垂直中间
.booking-option-sub-icon {
  height: 1.0125rem;
}

.booking-slot {
  padding: .35rem .7rem;
  border-radius: 6px;
  font-size: .8rem;
  cursor: pointer;
  border: 1px solid rgba(var(--text-color), .25);
  transition: border-color .25s ease, background-color .25s ease;

  &:hover {
    border-color: rgba(var(--text-color), .6);
  }
}

.booking-slot-active {
  border-color: rgb(var(--text-color));
  background-color: rgba(var(--text-color), .12);
  font-weight: 600;
}

</style>

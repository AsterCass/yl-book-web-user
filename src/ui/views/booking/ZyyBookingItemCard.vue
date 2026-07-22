<template>

  <div class="booking-card booking-item column">

    <div class="row items-center justify-between q-mb-sm">
      <div class="row items-center">
        <q-icon name="fa-solid fa-store" size="1rem" class="q-mr-sm"/>
        <div class="cask-general-little-title">{{ booking.storeName }}</div>
      </div>
      <div v-if="statusItem" class="booking-status q-mr-sm" :style="`background-color: ${statusItem.color}`">
        {{ $t(statusItem.name) }}
      </div>
    </div>

    <q-separator class="component-separator-base q-mb-sm" size="1px"/>

    <div class="row items-center q-my-xs">
      <q-icon name="fa-regular fa-clock" size=".85rem" class="q-mr-sm" style="opacity: .5"/>
      <div>{{ timeRange }}</div>
    </div>

    <div v-if="projectNames" class="row items-start q-my-xs">
      <q-icon name="fa-solid fa-spa" size=".85rem" class="q-mr-sm q-mt-xs" style="opacity: .5"/>
      <div class="col">{{ projectNames }}</div>
    </div>

    <!-- amount 可空：为 null 时不展示金额行 -->
    <div v-if="booking.amount != null" class="row items-center q-my-xs">
      <q-icon name="fa-solid fa-money-bill-wave" size=".85rem" class="q-mr-sm" style="opacity: .5"/>
      <div>${{ booking.amount }}</div>
    </div>

    <div v-if="booking.phone" class="row items-center q-my-xs">
      <q-icon name="fa-solid fa-phone" size=".85rem" class="q-mr-sm" style="opacity: .5"/>
      <div>{{ booking.phone }}</div>
    </div>

    <div v-if="booking.couponCode" class="row items-center q-my-xs">
      <q-icon name="fa-solid fa-ticket" size=".85rem" class="q-mr-sm" style="opacity: .5"/>
      <div>{{ booking.couponCode }}</div>
    </div>

    <div v-if="booking.remark" class="row items-start q-my-xs">
      <q-icon name="fa-regular fa-comment-dots" size=".85rem" class="q-mr-sm q-mt-xs" style="opacity: .5"/>
      <div class="col booking-remark">{{ booking.remark }}</div>
    </div>

    <div v-if="cancelable" class="row justify-end q-mt-sm">
      <q-btn no-caps unelevated flat class="cask-jump-link-neg" style="font-size: .75rem"
             :label="$t('booking.cancel_booking')" @click="emit('cancel', booking)"/>
    </div>

  </div>

</template>


<script setup>

import {computed} from "vue";
import {BOOK_CANCELABLE_STATUS, BookStatusEnum} from "@/constants/enums/book.js";

const emit = defineEmits(['cancel'])

const props = defineProps({
  booking: {
    type: Object,
    required: true,
  },
  // 技能 id -> 名称（父级按门店拉取 /skills 后缓存下发）
  skillNameMap: {
    type: Object,
    default: () => ({}),
  },
})

const statusItem = computed(() => BookStatusEnum.fromCode(props.booking.status))

const cancelable = computed(() => BOOK_CANCELABLE_STATUS.includes(props.booking.status))

const projectNames = computed(() => {
  const ids = (props.booking.requiredSkillIds || '').split(',').map(s => s.trim()).filter(Boolean)
  if (!ids.length) {
    return ''
  }
  return ids.map(id => props.skillNameMap[id] || id).join(', ')
})

// 同日只显示结束时刻：2026-07-20 14:00 ~ 15:10
const timeRange = computed(() => {
  const begin = props.booking.bookingTime || ''
  const end = props.booking.endTime || ''
  if (!end) {
    return begin
  }
  return begin.slice(0, 10) === end.slice(0, 10) ? `${begin} ~ ${end.slice(11)}` : `${begin} ~ ${end}`
})

</script>


<style scoped lang="scss">

.booking-item {
  transition: transform .35s ease, box-shadow .35s ease;
}

.booking-status {
  padding: 2px 8px;
  border-radius: 4px;
  color: #eee;
  font-size: .72rem;
  white-space: nowrap;
}

// 备注为客户自由输入，保留换行并强制长串换行，避免撑破卡片
.booking-remark {
  white-space: pre-wrap;
  word-break: break-word;
}

</style>

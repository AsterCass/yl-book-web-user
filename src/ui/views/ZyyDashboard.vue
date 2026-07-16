<template>

  <!-- ZyyMain 为 fixed-full 布局，页面自身提供滚动容器（与 ZyySubsystemMain 一致） -->
  <div class="dashboard-scroll absolute-full">
    <div class="row justify-center q-mt-lg q-px-md q-pt-sm q-pb-xl">
      <div class="col-lg-6 col-md-8 col-12">

        <!-- 最上方：新建预约入口 -->
        <zyy-booking-create-card class="q-mb-lg" @created="reloadList"/>

        <div v-if="firstLoading" class="row justify-center q-mt-xl">
          <q-spinner-pie size="60px"/>
        </div>

        <div v-else-if="!bookingList.length" class="row justify-center q-mt-xl text-center"
             style="opacity: .5">
          {{ $t('booking.no_data') }}
        </div>

        <!-- 历史预约：无限滚动 -->
        <q-infinite-scroll v-else scroll-target=".dashboard-scroll" :offset="250"
                           :disable="scrollDisable" @load="onLoadMore">
          <q-intersection v-for="(booking, index) in bookingList" :key="booking.id || index"
                          once transition="slide-up" transition-duration="600"
                          class="q-my-md" style="min-height: 7rem">
            <zyy-booking-item-card :booking="booking" :skill-name-map="skillNameMap"
                                   @cancel="askCancel"/>
          </q-intersection>

          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-pie size="40px"/>
            </div>
          </template>
        </q-infinite-scroll>

      </div>
    </div>

    <cask-dialog-judgment v-model="showCancelDialog" :dialog-judgment-data="cancelDialogData"
                          :callback-method="onCancelConfirm"/>

  </div>

</template>


<script setup>

import {onMounted, ref} from "vue";
import ZyyBookingCreateCard from "@/ui/views/booking/ZyyBookingCreateCard.vue";
import ZyyBookingItemCard from "@/ui/views/booking/ZyyBookingItemCard.vue";
import CaskDialogJudgment from "@/ui/components/CaskDialogJudgment.vue";
import {portalBookingCancel, portalBookingMy, portalBookingSkills} from "@/api/portal-booking.js";
import {notifyTopPositive} from "@/utils/notification-tools.js";
import {i18n} from "@/i18n/index.js";

const t = i18n.global.t

const PAGE_SIZE = 10

const bookingList = ref([])
const firstLoading = ref(true)
const scrollDisable = ref(true)
let currentPage = 1
let totalCount = 0

// 预约只带 requiredSkillIds，需按门店拉 /skills 映射名称；每个门店只拉一次
const loadedSkillStores = new Set()
const skillNameMap = ref({})

const showCancelDialog = ref(false)
const cancelDialogData = ref({title: "", content: "", falseLabel: "", trueLabel: ""})
let cancelTarget = null


function cacheSkillNames(records) {
  const storeIds = [...new Set(records.map(b => b.storeId).filter(Boolean))]
  for (const storeId of storeIds) {
    if (loadedSkillStores.has(storeId)) {
      continue
    }
    loadedSkillStores.add(storeId)
    portalBookingSkills({storeId: storeId}).then(res => {
      if (!res || !res.data || !res.data.data) {
        return
      }
      const next = {...skillNameMap.value}
      for (const skill of res.data.data) {
        next[skill.id] = skill.name
      }
      skillNameMap.value = next
    })
  }
}

function reloadList() {
  currentPage = 1
  totalCount = 0
  firstLoading.value = true
  scrollDisable.value = true
  bookingList.value = []
  portalBookingMy({pageNo: currentPage, pageSize: PAGE_SIZE}).then(res => {
    firstLoading.value = false
    if (!res || !res.data || !res.data.data) {
      return
    }
    const page = res.data.data
    const records = page.records || []
    totalCount = page.total || 0
    bookingList.value.push(...records)
    cacheSkillNames(records)
    // 首屏已取完则不开启无限滚动
    scrollDisable.value = bookingList.value.length >= totalCount
  })
}

function onLoadMore(index, done) {
  if (bookingList.value.length >= totalCount) {
    scrollDisable.value = true
    done(true)
    return
  }
  ++currentPage
  portalBookingMy({pageNo: currentPage, pageSize: PAGE_SIZE}).then(res => {
    if (!res || !res.data || !res.data.data) {
      scrollDisable.value = true
      done(true)
      return
    }
    const page = res.data.data
    const records = page.records || []
    totalCount = page.total || totalCount
    if (!records.length) {
      scrollDisable.value = true
      done(true)
      return
    }
    bookingList.value.push(...records)
    cacheSkillNames(records)
    if (bookingList.value.length >= totalCount) {
      scrollDisable.value = true
    }
    done()
  })
}

function askCancel(booking) {
  cancelTarget = booking
  cancelDialogData.value = {
    title: t('booking.cancel_title'),
    content: t('booking.cancel_content', {time: booking.bookingTime}),
    falseLabel: t('booking.dialog_cancel'),
    trueLabel: t('booking.dialog_confirm'),
  }
  showCancelDialog.value = true
}

function onCancelConfirm(confirmed) {
  showCancelDialog.value = false
  const target = cancelTarget
  cancelTarget = null
  if (!confirmed || !target) {
    return
  }
  portalBookingCancel(target.id).then(res => {
    if (!res) {
      return
    }
    notifyTopPositive(t('booking.cancel_success'))
    reloadList()
  })
}


onMounted(() => {
  reloadList()
})

</script>


<style lang="scss">

.dashboard-scroll {
  overflow-y: auto;
  overflow-x: hidden;
}

// 预约卡片外框（与登录卡片同一套视觉语言）；非 scoped，供子卡片组件根节点使用
.booking-card {
  width: 100%;
  color: rgb(var(--text-color));
  border-radius: 12px;
  background-color: rgb(var(--container-background-color));
  backdrop-filter: blur(30px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, .12);
  padding: 1rem 1.25rem;

  font-size: .9rem;
}

</style>

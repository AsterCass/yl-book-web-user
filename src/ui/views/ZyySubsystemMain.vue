<template>

  <div class="subsystem-main absolute-full" style="margin: 3rem 2px 0 2px">

    <q-scroll-area :thumb-style="globalState.curThemeName === 'dark' ?
                         { background: 'white', width: '7px', opacity: '0.6' } :
                          { background: 'black', width: '7px', opacity: '0.6' }"
                   class="full-height full-width" :visible="true">
      <div class="row justify-evenly" style="padding: 5rem 0 0 0">
        <cask-float-card v-for="(video, index) in visibleSystemList" :key="index"
                         class="card-item"
                         :ref="el => cardRefs[index] = el"
                         :cover-image="video.collectionImg"
                         :character-image="video.collectionImgExtra"
                         :name="$t(video.collectionName)"
                         :enable="video.enable"
                         :base-size="16"
                         :disable-text="$t('in_develop_simple')"
                         :on-click="()=> { jumpToSubsystem(video.enable, video.navigationName, index) }"/>
      </div>

    </q-scroll-area>

  </div>
</template>

<script setup>
import CaskFloatCard from "@/ui/components/CaskFloatCard.vue";
import {computed, nextTick, onMounted, ref} from "vue";
import {useGlobalStateStore} from "@/utils/global-state.js";
import {useRouter} from "vue-router";
import {toSpecifyPage} from "@/router/index.js";

const globalState = useGlobalStateStore();
const thisRouter = useRouter()

const animating = ref(false);
const cardRefs = ref([]);
const systemList = ref([
  {
    collectionImg: "/img/subsystem/appointment.jpg",
    collectionImgExtra: "/img/subsystem/appointment.webp",
    collectionName: "yl_subsystem_appointment",
    navigationName: "book",
    permission: "book",
    enable: true,
  },
  {
    collectionImg: "/img/subsystem/staff.jpg",
    collectionImgExtra: "/img/subsystem/staff.webp",
    collectionName: "yl_subsystem_staff",
    navigationName: "staff",
    permission: "staff",
    enable: true,
  },
  {
    collectionImg: "/img/subsystem/agent.jpg",
    collectionImgExtra: "",
    collectionName: "yl_subsystem_agent",
    navigationName: "agent",
    permission: "agent",
    enable: false,
  },
  {
    collectionImg: "/img/subsystem/bill.jpg",
    collectionImgExtra: "",
    collectionName: "yl_subsystem_bill",
    navigationName: "bill",
    permission: "bill",
    enable: false,
  },
  {
    collectionImg: "/img/subsystem/order.jpg",
    collectionImgExtra: "",
    collectionName: "yl_subsystem_order",
    navigationName: "order",
    permission: "order",
    enable: false,
  },
  {
    collectionImg: "/img/subsystem/page.jpg",
    collectionImgExtra: "",
    collectionName: "yl_subsystem_page",
    navigationName: "page",
    permission: "page",
    enable: false,
  },
  {
    collectionImg: "/img/subsystem/user.jpg",
    collectionImgExtra: "/img/subsystem/user.webp",
    collectionName: "yl_subsystem_user",
    navigationName: "user",
    permission: "user",
    enable: true,
  },
])

// 仅展示当前用户有页面级权限的子系统
const visibleSystemList = computed(() =>
    systemList.value.filter(item => globalState.hasPermission(item.permission)))


async function jumpToSubsystem(enable, navigationName, currentIndex) {
  if (!enable || animating.value) return;

  animating.value = true;

  await nextTick();

  const screenCenterX = window.innerWidth / 2;
  const screenCenterY = window.innerHeight / 2;

  cardRefs.value.forEach((card, index) => {
    const el = card?.$el || card;

    const rect = el.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = screenCenterX - centerX;
    const offsetY = screenCenterY - centerY;

    el.style.transition =
        "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s";

    if (index === currentIndex) {
      el.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1.25)`;
      el.style.zIndex = 10;
    } else {
      if (centerX < screenCenterX) {
        el.style.transform = `translateX(${offsetX - 1500}px) scale(0.8)`;
      } else {
        el.style.transform = `translateX(${offsetX + 1500}px) scale(0.8)`;
      }
      el.style.opacity = 0;
    }


  });

  setTimeout(() => {
    toSpecifyPage(thisRouter, navigationName);
  }, 300);
}

onMounted(async () => {
  await nextTick();

  const screenCenterX = window.innerWidth / 2;

  cardRefs.value.forEach((card, index) => {
    const el = card?.$el || card;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    const offsetX = screenCenterX - centerX;

    // 根据卡片位置决定从哪侧飞入（与离开动画对称）
    const fromLeft = centerX < screenCenterX;
    const flyInX = fromLeft ? offsetX - 1500 : offsetX + 1500;

    // 先设置初始位置（无过渡）
    el.style.transition = "none";
    el.style.transform = `translateX(${flyInX}px) scale(0.8)`;
    el.style.opacity = "0";

    // 下一帧触发过渡 直接设置 transition + 修改样式在同一帧内，
    // 浏览器会跳过中间态。双层 rAF 保证"初始位置"和"目标位置"分属两帧，过渡才会生效
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition =
            "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s";
        el.style.transform = "translate(0, 0) scale(1)";
        el.style.opacity = "1";
      });
    });
  });
});

</script>

<style scoped lang="scss">

.subsystem-main {

  .card-item {
    margin: 3rem 8rem;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease;
  }


}


</style>
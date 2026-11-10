<template>
  <!-- 门店实景（推广页 ?store= 专用）：图片等高、按原始比例一行排开。放得下就居中静止；放不下就匀速向左循环滚动，
       无任何点击 / 放大交互。系统开了「减少动态效果」时不滚动，改为可手动左右滑动 -->
  <div ref="viewportRef" class="promo-gallery"
       :class="{ 'promo-gallery-running': running, 'promo-gallery-static': !running }">
    <div class="promo-gallery-track" :style="running ? { animationDuration: `${cycleSeconds}s` } : null">
      <!-- 每张图加载完都重量一次：宽度要等图片到了才知道（ResizeObserver 也会量，这里是兜底） -->
      <div ref="listRef" class="promo-gallery-list">
        <img v-for="(src, i) in images" :key="i" :src="src" alt="" class="promo-gallery-img" decoding="async"
             @load="measure"/>
      </div>
      <!-- 滚动时再接一份：位移 -50% 正好走完一份（含末尾间隔），首尾无缝相接 -->
      <div v-if="running" class="promo-gallery-list" aria-hidden="true">
        <img v-for="(src, i) in images" :key="i" :src="src" alt="" class="promo-gallery-img" decoding="async"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";

const props = defineProps({
  /** 图片地址列表（public 下的绝对路径） */
  images: {type: Array, default: () => []},
  /** 滚动速度（像素/秒） */
  speed: {type: Number, default: 40},
})

// 两张图之间、以及两份列表之间的间隔（px），须与样式里的 gap / padding-right 一致
const GAP_PX = 16

const viewportRef = ref(null)
const listRef = ref(null)
// 一份列表的内容宽度（不含末尾间隔）与可视宽度：前者大于后者才滚动
const listWidth = ref(0)
const viewportWidth = ref(0)
const reducedMotion = ref(false)

const running = computed(() => !reducedMotion.value && listWidth.value > viewportWidth.value + 1)
// 一轮走完一份列表加一个间隔，按速度换算时长（匀速，不取整）
const cycleSeconds = computed(() => Math.max(1, (listWidth.value + GAP_PX) / Math.max(props.speed, 1)))

let observer = null
let motionQuery = null

function measure() {
  if (!viewportRef.value || !listRef.value) {
    return
  }
  viewportWidth.value = viewportRef.value.clientWidth
  // 列表在滚动态会带末尾间隔（padding-right），量的时候扣掉，两种状态量出来一致，不会来回切换
  const padding = parseFloat(getComputedStyle(listRef.value).paddingRight) || 0
  listWidth.value = listRef.value.scrollWidth - padding
}

function onMotionChange() {
  reducedMotion.value = !!(motionQuery && motionQuery.matches)
}

onMounted(() => {
  if (window.matchMedia) {
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    onMotionChange()
    motionQuery.addEventListener && motionQuery.addEventListener('change', onMotionChange)
  }
  measure()
  // 图片陆续加载完会撑宽列表，窗口缩放会改变可视宽度：两者都重新量
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(measure)
    observer.observe(viewportRef.value)
    observer.observe(listRef.value)
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (motionQuery && motionQuery.removeEventListener) {
    motionQuery.removeEventListener('change', onMotionChange)
  }
})

watch(() => props.images, () => requestAnimationFrame(measure))
</script>

<style scoped lang="scss">
// 宽度只随外层、不随内容：图片条再长也不把自己撑宽（否则量不出「放不下」）
.promo-gallery {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  contain: inline-size;
}

.promo-gallery-track {
  display: flex;
  width: max-content;
}

.promo-gallery-list {
  display: flex;
  gap: 16px;
}

.promo-gallery-img {
  display: block;
  flex: none;
  height: 260px;
  width: auto;
  border-radius: .75rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, .12);
  user-select: none;
  -webkit-user-drag: none;
}

// 阴影会被 overflow 裁掉：上下留点空
.promo-gallery-track {
  padding: 4px 0 14px;
}

// 放得下：整排居中
.promo-gallery-static .promo-gallery-track {
  margin: 0 auto;
}

// 滚动：每份列表末尾带一个间隔，两份接起来间距一致；-50% 恰好是一份。
// 两端各淡出一小段：图片条限在内容区宽度里滚动，边缘不是一刀切
.promo-gallery-running {
  -webkit-mask-image: linear-gradient(to right, transparent 0, #000 32px, #000 calc(100% - 32px), transparent 100%);
  mask-image: linear-gradient(to right, transparent 0, #000 32px, #000 calc(100% - 32px), transparent 100%);

  .promo-gallery-list {
    padding-right: 16px;
  }

  .promo-gallery-track {
    animation-name: promo-gallery-scroll;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
}

@keyframes promo-gallery-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

// 减少动态效果：不滚动（running 已为 false），放不下的部分允许手动横向滑动
@media (prefers-reduced-motion: reduce) {
  .promo-gallery {
    overflow-x: auto;
  }
}

@media (max-width: 599px) {
  .promo-gallery-img {
    height: 180px;
  }
}
</style>

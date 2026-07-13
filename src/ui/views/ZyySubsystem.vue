<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-slide" mode="out-in">
      <component :is="Component"/>
    </transition>
  </router-view>
</template>

<script setup>

</script>

<style scoped lang="scss">

.fade-slide-enter-from {
  opacity: 0;
}

.fade-slide-enter-active {
  transition: all .5s ease;
}

.fade-slide-leave-active {
  transition: all .5s ease;
}

.fade-slide-leave-to {
  opacity: 0;
}

</style>
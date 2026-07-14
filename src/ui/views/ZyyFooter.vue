<template>
  <div class="bottom-footer-base-simple row items-center justify-center">

    <div class="q-mx-md text-center">
      &copy; 2007-{{ curYear }}&nbsp;&nbsp;&nbsp;{{$t('main_company')}}
    </div>

<!--    <div class="q-mx-md">-->
<!--      {{$t('main_footer_dev_mail')}}:&nbsp;&nbsp;&nbsp;astercass@qq.com-->
<!--    </div>-->

  </div>

</template>

<script setup>

import {onMounted, ref} from "vue";
import {date} from "quasar";

const curYear = ref("2020")


onMounted(() => {
  const timeStamp = new Date()
  curYear.value = date.formatDate(timeStamp, 'YYYY')
})


</script>

<style scoped lang="scss">


.bottom-footer-base-simple {
  padding: 0.5rem 2rem 0.6rem 2rem;
  color: rgb(var(--text-color));
  background-color: rgb(var(--container-background-color));
  backdrop-filter: blur(30px);
  min-height: 3rem;

  a {
    color: rgb(var(--text-color));
  }
}

</style>
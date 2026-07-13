<template>
  <div class="error-page-main" style="background-image: url('/img/600-bg.jpg')">
    <span class="error-page-mask"/>
    <div class="error-page-container">
      <div class="row justify-center">
        <div class="col-md-12 text-center">
          <h1>
            {{ $t('error.401.title') }}
          </h1>
          <h2>
            {{ $t('error.401.subtitle') }}
          </h2>
          <p>
            {{ $t('error.401.message') }}
          </p>
          <q-btn class="q-mt-lg error-page-btn"
                 outline push :label="$t('main_login')" @click="backToLogin(thisRouter)"/>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup>
import {backToLogin} from "@/router/index.js"
import {useRouter} from "vue-router";

const thisRouter = useRouter()
</script>

<style lang="scss" scoped>
@use "@/styles/main";

</style>
<template>

  <!-- 独立政策页（/terms、/privacy）：公开可访问，供第三方品牌注册 / 应用审核直链 -->
  <div class="policy-page column"
       style="min-height: 100vh; background-color: rgba(var(--background-color)); background-image: url('/img/bg.png');">

    <!-- 顶部：语言 / 主题切换（与登录页一致） -->
    <div class="login-topbar full-width row items-center q-px-md">
      <q-btn no-caps unelevated class="component-none-btn-grow q-mx-xs" @click="switchLanguage()">
        <q-icon name="fa-solid fa-language" size="1.6rem"/>
      </q-btn>
      <q-btn no-caps unelevated class="component-none-btn-grow q-mx-xs" @click="switchTheme()">
        <q-icon name="fa-solid fa-circle-half-stroke" size="1.25rem"/>
      </q-btn>
    </div>

    <div class="policy-page-body row justify-center">
      <div class="policy-page-card column">

        <div class="row justify-center">
          <h4>{{ docType === 'terms' ? $t('policy.terms_title') : $t('policy.privacy_title') }}</h4>
        </div>

        <q-separator class="component-separator-base q-my-sm" inset size="1px"/>

        <div v-if="loading" class="row justify-center q-py-xl">
          <q-spinner-pie size="50px"/>
        </div>

        <div v-else class="component-marked-view q-px-sm q-pb-sm" v-html="contentHtml"/>

      </div>
    </div>

    <zyy-footer/>

  </div>

</template>


<script setup>

import {onMounted, ref} from "vue";
import ZyyFooter from "@/ui/views/ZyyFooter.vue";
import {switchLanguage, switchTheme} from "@/utils/global-tools.js";
import {notifyTopWarning} from "@/utils/notification-tools.js";
import {i18n} from "@/i18n/index.js";
import {loadPolicyDoc} from "@/utils/policy-doc.js";

const props = defineProps({
  // 'privacy' | 'terms'（由路由静态注入）
  docType: {
    type: String,
    required: false,
    default: 'privacy',
  },
})

const t = i18n.global.t

const loading = ref(true)
const contentHtml = ref('')


onMounted(async () => {
  try {
    contentHtml.value = await loadPolicyDoc(props.docType)
  } catch (e) {
    notifyTopWarning(t('error_request'))
  } finally {
    loading.value = false
  }
})

</script>


<style lang="scss">

.policy-page-body {
  flex: 1 0 auto;
  padding: 0.5rem 0.75rem 2rem 0.75rem;
}

// 文档卡片：与登录卡片同一套视觉语言，宽度放大以适合长文阅读
.policy-page-card {
  width: min(94vw, 860px);
  align-self: flex-start;

  color: rgb(var(--text-color));
  border-radius: 12px;
  background-color: rgb(var(--container-background-color));
  backdrop-filter: blur(30px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, .12);
  padding: 20px 18px 12px 18px;
}

</style>

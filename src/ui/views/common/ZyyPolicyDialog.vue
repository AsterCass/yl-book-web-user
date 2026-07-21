<template>

  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)"
            transition-show="fade" transition-hide="fade">
    <q-card class="zyy-policy-dialog-card column no-wrap">

      <div class="row items-center justify-between q-px-sm">
        <h5 style="font-weight: 600!important; margin-left: .5rem !important;">
          {{ docType === 'terms' ? $t('policy.terms_title') : $t('policy.privacy_title') }}
        </h5>
        <q-btn round flat dense icon="close" @click="emit('update:modelValue', false)"/>
      </div>

      <q-separator class="component-separator-base" inset spaced="0.5rem"/>

      <div v-if="loading" class="col row items-center justify-center">
        <q-spinner-pie size="50px"/>
      </div>

      <q-scroll-area v-else class="col q-mt-sm"
                     :thumb-style="{background: 'rgba(var(--text-color), .5)', width: '5px', opacity: '0.6'}">
        <!-- 渲染本站 public/doc 下的静态政策文档（自有内容，非用户输入） -->
        <div class="component-marked-view q-px-md q-pb-md" v-html="contentHtml"/>
      </q-scroll-area>

    </q-card>
  </q-dialog>

</template>


<script setup>

import {ref, watch} from "vue";
import {notifyTopWarning} from "@/utils/notification-tools.js";
import {i18n} from "@/i18n/index.js";
import {loadPolicyDoc} from "@/utils/policy-doc.js";

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false,
  },
  // 'privacy' | 'terms'
  docType: {
    type: String,
    required: true,
    default: 'privacy',
  },
})

const t = i18n.global.t

const loading = ref(false)
const contentHtml = ref('')

watch(() => [props.modelValue, props.docType], async () => {
  if (!props.modelValue) {
    return
  }
  loading.value = true
  try {
    contentHtml.value = await loadPolicyDoc(props.docType)
  } catch (e) {
    notifyTopWarning(t('error_request'))
    emit('update:modelValue', false)
  } finally {
    loading.value = false
  }
}, {immediate: true})

</script>


<style lang="scss">
// .component-marked-view（v-html 内容）的样式由 App.vue 全局引入 base-marked 提供

.zyy-policy-dialog-card {
  width: min(92vw, 760px);
  max-width: 92vw !important;
  height: 80vh;
  padding: 1rem 0.5rem;
  border-radius: 8px !important;
  color: rgb(var(--text-color)) !important;
  opacity: .97;
  background-color: var(--dialog-background-color) !important;
  box-shadow: inset 0 0 2px 1px var(--dialog-background-color-frame) !important;
  backdrop-filter: saturate(200%) blur(30px) !important;
}

</style>

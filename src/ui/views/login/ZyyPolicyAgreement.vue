<template>

  <!-- 单根节点：避免多根 fragment 导致父级传入属性无法继承 -->
  <div>

    <div class="row items-center text-center q-my-sm" style="font-size: .8rem">
      <q-checkbox v-model="agreed" :val="true" class="component-ratio-base q-mr-sm q-my-xs" dense
                  checked-icon="task_alt" unchecked-icon="panorama_fish_eye"/>
      <span style="opacity: .9">{{ $t('policy.agree_pre') }}</span>
      <span class="cask-jump-link-in-text" @click="openDoc('terms')">&nbsp;{{ $t('policy.terms') }}&nbsp;</span>
      <span style="opacity: .9">{{ $t('policy.and') }}</span>
      <span class="cask-jump-link-in-text" @click="openDoc('privacy')">&nbsp;{{ $t('policy.privacy') }}&nbsp;</span>
    </div>

    <zyy-policy-dialog v-model="showDoc" :doc-type="docType"/>

  </div>

</template>


<script setup>

import {computed, ref} from "vue";
import ZyyPolicyDialog from "@/ui/views/common/ZyyPolicyDialog.vue";
import {useGlobalStateStore} from "@/utils/global-state.js";

const globalState = useGlobalStateStore()

// 勾选状态直接落在持久化的 globalState：勾选过一次即免重复勾选，登录/注册卡片间也共享
const agreed = computed({
  get: () => globalState.policyAgreed,
  set: (val) => globalState.updatePolicyAgreed(val),
})

const showDoc = ref(false)
const docType = ref('privacy')

function openDoc(type) {
  docType.value = type
  showDoc.value = true
}

</script>

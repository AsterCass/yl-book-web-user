<template>

  <div class="login-card column">

    <div class="row justify-center">
      <h4>{{ $t('login.register_title') }}</h4>
    </div>
    <div class="row justify-center text-center q-mb-md q-mx-md" style="opacity: .55; font-size: .78rem">
      {{ $t('login.register_subtitle') }}
    </div>

    <div class="q-px-md">

      <q-input v-model="inputMail" dense outlined type="email" tabindex="0"
               class="q-my-sm component-outline-input-grow-on-semi-trans">
        <template v-slot:prepend>
          <div class="row items-center">
            <q-icon class="q-mr-sm" name="fa-regular fa-envelope" size="1rem"/>
            <div style="opacity: 0.8">{{ $t('main_login_mail') }}</div>
          </div>
        </template>
      </q-input>

      <q-input v-model="inputCode" dense outlined tabindex="0"
               class="q-my-sm component-outline-input-grow-on-semi-trans">
        <template v-slot:prepend>
          <div class="row items-center">
            <q-icon class="q-mr-sm" name="fa-solid fa-shield-halved" size="1rem"/>
            <div style="opacity: 0.8">{{ $t('login.code') }}</div>
          </div>
        </template>
        <template v-slot:append>
          <q-btn no-caps flat dense :disable="countdown > 0" @click="doSendCode"
                 class="cask-color-pointer" style="font-size: .75rem">
            {{ countdown > 0 ? countdown + 's' : $t('login.send_code') }}
          </q-btn>
        </template>
      </q-input>

      <q-input v-model="inputPassword" dense outlined tabindex="0"
               :type="showUserPasswd ? 'text' : 'password'"
               class="q-my-sm component-outline-input-grow-on-semi-trans">
        <template v-slot:prepend>
          <div class="row items-center">
            <q-icon class="q-mr-sm" name="fa-solid fa-unlock-keyhole" size="1rem"/>
            <div style="opacity: 0.8">{{ $t('main_login_password') }}</div>
          </div>
        </template>
        <template v-slot:append>
          <q-icon :name="showUserPasswd ? 'visibility' : 'visibility_off'" size="1rem"
                  class="cursor-pointer" @click="showUserPasswd = !showUserPasswd">
          </q-icon>
        </template>
      </q-input>

      <div class="q-mx-sm q-mt-xs" style="opacity: .5; font-size: .72rem">
        {{ $t('main_login_passwd_tips') }}
      </div>

      <q-input v-model="inputNick" dense outlined tabindex="0"
               class="q-mt-md q-mb-xs component-outline-input-grow-on-semi-trans">
        <template v-slot:prepend>
          <div class="row items-center">
            <q-icon class="q-mr-sm" name="fa-regular fa-user" size="1rem"/>
            <div style="opacity: 0.8">{{ $t('login.nick') }}</div>
          </div>
        </template>
      </q-input>
      <div class="q-mx-sm q-mb-sm" style="opacity: .5; font-size: .72rem">
        {{ $t('login.nick_hint') }}
      </div>

      <zyy-policy-agreement/>

      <div class="row justify-center q-mt-md">
        <q-btn no-caps unelevated class="shadow-2 component-full-btn-grow full-width"
               style="background-color: rgb(var(--semi-bg-container-background-color)) !important"
               @click="doRegister">
          <div class="row items-center">
            <div class="q-mr-sm" style="font-size: 14px">{{ $t('login.sign_up') }}</div>
            <q-icon name="fa-solid fa-user-plus" size="15px"/>
          </div>
        </q-btn>
      </div>

      <div class="row justify-center q-my-md">
        <span class="cask-jump-link-in-text" style="font-size: .85rem"
              @click="emit('switch', 'login')">{{ $t('login.to_login') }}</span>
      </div>

    </div>
  </div>

</template>


<script setup>

import {onBeforeUnmount, ref} from "vue";
import ZyyPolicyAgreement from "@/ui/views/login/ZyyPolicyAgreement.vue";
import {useGlobalStateStore} from "@/utils/global-state.js";
import {notifyTopPositive, notifyTopWarning} from "@/utils/notification-tools.js";
import {i18n} from "@/i18n/index.js";
import {checkIsMail, checkIsPasswd} from "@/utils/format-check.js";
import {portalRegister, portalSendCode} from "@/api/portal-auth.js";
import {buildAttributionParams} from "@/utils/landing-params.js";

const emit = defineEmits(['success', 'switch'])

const t = i18n.global.t
const globalState = useGlobalStateStore();

const inputMail = ref("")
const inputCode = ref("")
const inputPassword = ref("")
const inputNick = ref("")
const showUserPasswd = ref(false)

const countdown = ref(0)
let countdownTimer = null


function startCountdown(sec = 60) {
  countdown.value = sec
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

function doSendCode() {
  if (countdown.value > 0) {
    return
  }
  if (!inputMail.value) {
    notifyTopWarning(t('login.empty_register'))
    return
  }
  if (!checkIsMail(inputMail.value)) {
    notifyTopWarning(t('login.email_invalid'))
    return
  }
  portalSendCode({email: inputMail.value}).then(res => {
    if (!res) {
      return
    }
    notifyTopPositive(t('login.code_sent'))
    startCountdown(60)
  })
}

function doRegister() {
  if (!globalState.policyAgreed) {
    notifyTopWarning(t('policy.required'))
    return
  }
  if (!inputMail.value || !inputCode.value || !inputPassword.value) {
    notifyTopWarning(t('login.empty_register'))
    return
  }
  if (!checkIsMail(inputMail.value)) {
    notifyTopWarning(t('login.email_invalid'))
    return
  }
  if (!checkIsPasswd(inputPassword.value)) {
    notifyTopWarning(t('login.password_invalid'))
    return
  }
  portalRegister({
    email: inputMail.value,
    code: inputCode.value,
    password: inputPassword.value,
    nickName: inputNick.value || null,
    // 站外投放归因：无平台/推荐码时不下发对应字段
    ...buildAttributionParams(),
  }).then(res => {
    if (!res || !res.data || !res.data.data) {
      return
    }
    const token = res.headers.get("Yl-Token")
    if (!token) {
      notifyTopWarning(t('login.token_missing'))
      return
    }
    globalState.updateLoginToken(token)
    globalState.updateUserData(res.data.data)
    notifyTopPositive(t('login.register_success'))
    emit('success')
  })
}


onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
})

</script>

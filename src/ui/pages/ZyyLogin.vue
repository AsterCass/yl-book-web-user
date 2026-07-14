<template>

  <div class="login-page column"
       style="min-height: 100vh; background-color: rgba(var(--background-color)); background-image: url('/img/bg.png');">

    <!-- 顶部：语言 / 主题切换 -->
    <div class="login-topbar full-width row items-center q-px-md">
      <q-btn no-caps unelevated class="component-none-btn-grow q-mx-xs" @click="switchLanguage()">
        <q-icon name="fa-solid fa-language" size="1.6rem"/>
      </q-btn>
      <q-btn no-caps unelevated class="component-none-btn-grow q-mx-xs" @click="switchTheme()">
        <q-icon name="fa-solid fa-circle-half-stroke" size="1.25rem"/>
      </q-btn>
    </div>

    <!-- 中部：登录 / 注册卡片（可滚动，移动端自适应） -->
    <div class="login-body">
      <transition name="fade-slide" mode="out-in" appear>

        <!-- ============ 登录卡片 ============ -->
        <div v-if="mode === 'login'" key="login"
             class="login-card column">

          <div class="row justify-center">
            <h4>{{ $t('main_login_title') }}</h4>
          </div>
          <div class="row justify-center text-center q-mb-md q-mx-md" style="opacity: .55; font-size: .85rem">
            {{ $t('login.welcome') }}
          </div>

          <div class="q-px-md">

            <q-input v-model="inputMail" dense outlined type="email" tabindex="0"
                     class="q-my-sm component-outline-input-grow-on-semi-trans"
                     @keyup.enter="doLogin">
              <template v-slot:prepend>
                <div class="row items-center">
                  <q-icon class="q-mr-sm" name="fa-regular fa-envelope" size="1rem"/>
                  <div style="opacity: 0.8">{{ $t('main_login_mail') }}</div>
                </div>
              </template>
            </q-input>

            <q-input v-model="inputPassword" dense outlined tabindex="0"
                     :type="showUserPasswd ? 'text' : 'password'"
                     class="q-my-sm component-outline-input-grow-on-semi-trans"
                     @keyup.enter="doLogin">
              <template v-slot:prepend>
                <div class="row items-center">
                  <q-icon class="q-mr-sm" name="fa-solid fa-unlock-keyhole" size="1rem"/>
                  <div style="opacity: 0.8">{{ $t('main_login_password') }}</div>
                </div>
              </template>
              <template v-slot:append>
                <q-icon :name="showUserPasswd ? 'visibility' : 'visibility_off'" size="1rem"
                        class="cursor-pointer" @click="showUserPasswd = !showUserPasswd">
                  <q-tooltip>
                    {{ showUserPasswd ? $t('main_register_hide_passwd') : $t('main_register_show_passwd') }}
                  </q-tooltip>
                </q-icon>
              </template>
            </q-input>

            <div class="row justify-end q-mt-xs q-mb-sm">
              <span class="cask-jump-link-in-text" style="font-size: .75rem"
                    @click="notifyTopWarning($t('in_develop'))">{{ $t('login.forgot') }}</span>
            </div>

            <div class="row justify-center q-mt-sm">
              <q-btn no-caps unelevated class="shadow-2 component-full-btn-grow full-width"
                     style="background-color: rgb(var(--semi-bg-container-background-color)) !important"
                     @click="doLogin">
                <div class="row items-center">
                  <div class="q-mr-sm" style="font-size: 14px">{{ $t('main_login') }}</div>
                  <q-icon name="fa-solid fa-arrow-right-to-bracket" size="15px"/>
                </div>
              </q-btn>
            </div>

            <div class="q-my-md row justify-evenly items-center">
              <q-separator class="component-separator-base col-grow" inset size="1px"/>
              <div class="q-px-sm" style="opacity:.9; font-size: .8rem">{{ $t('main_login_more') }}</div>
              <q-separator class="component-separator-base col-grow" inset size="1px"/>
            </div>

            <div class="row justify-evenly items-center q-mb-md">

              <q-icon name="fa-brands fa-github" size="2rem" class="cursor-pointer"
                      @click="notifyTopWarning($t('in_develop'))">
                <q-tooltip>{{ $t('login.github') }}</q-tooltip>
              </q-icon>

              <div class="relative-position">
                <button class="gsi-material-button" @click="openLink(googleLoginUrl, false)">
                  <div class="gsi-material-button-state"></div>
                  <div class="gsi-material-button-content-wrapper">
                    <div class="gsi-material-button-icon">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"
                           xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
                        <path fill="#EA4335"
                              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4"
                              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05"
                              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853"
                              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                    </div>
                  </div>
                </button>
              </div>

              <q-icon name="fa-brands fa-qq" size="2rem" class="cursor-pointer"
                      style="color: rgb(0, 153, 255)" @click="notifyTopWarning($t('in_develop'))">
                <q-tooltip>{{ $t('login.qq') }}</q-tooltip>
              </q-icon>

            </div>

            <div class="row justify-center items-center q-mb-sm">
              <q-checkbox v-model="isSaveLoginInfo" :val="true" class="component-ratio-base q-mr-sm" dense
                          checked-icon="task_alt" unchecked-icon="panorama_fish_eye"/>
              <span style="opacity: .9; font-size: .85rem">{{ $t('main_setting_save_login_data') }}</span>
            </div>

            <div class="row justify-center q-mb-md">
              <span class="cask-jump-link-in-text" style="font-size: .85rem"
                    @click="switchMode('register')">{{ $t('login.to_register') }}</span>
            </div>

          </div>
        </div>

        <!-- ============ 注册卡片 ============ -->
        <div v-else key="register"
             class="login-card column">

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
                  <q-tooltip>
                    {{ showUserPasswd ? $t('main_register_hide_passwd') : $t('main_register_show_passwd') }}
                  </q-tooltip>
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
                    @click="switchMode('login')">{{ $t('login.to_login') }}</span>
            </div>

          </div>
        </div>

      </transition>
    </div>

    <zyy-footer/>

  </div>

</template>


<script setup>

import {onBeforeUnmount, onMounted, ref} from "vue";
import ZyyFooter from "@/ui/views/ZyyFooter.vue";
import {switchLanguage, switchTheme} from "@/utils/global-tools.js";
import {notifyTopPositive, notifyTopWarning} from "@/utils/notification-tools.js";
import {useRouter} from "vue-router";
import {useGlobalStateStore} from "@/utils/global-state.js";
import {backToHome} from "@/router/index.js";
import {i18n} from "@/i18n/index.js";
import {checkIsMail, checkIsPasswd} from "@/utils/format-check.js";
import {portalGoogleLogin, portalLogin, portalRegister, portalSendCode} from "@/api/portal-auth.js";
import {openLink} from "@/utils/base-tools.js";


const t = i18n.global.t
const globalState = useGlobalStateStore();
const thisRouter = useRouter()

// 'login' | 'register'
const mode = ref('login')

const inputMail = ref("")
const inputPassword = ref("")
const inputCode = ref("")
const inputNick = ref("")

const isSaveLoginInfo = ref(false)
const showUserPasswd = ref(false)

const countdown = ref(0)
let countdownTimer = null

const googleLoginUrl = "https://accounts.google.com/o/oauth2/v2/auth" +
    "?client_id=492008176739-tbal7ublv95g85jmee85oh043q48g93r.apps.googleusercontent.com" +
    "&redirect_uri=https://www.zyyboh.com/auth/google/callback" +
    "&response_type=code&scope=email profile&access_type=offline"


function switchMode(target) {
  mode.value = target
  showUserPasswd.value = false
}

function saveLoginInfo() {
  if (isSaveLoginInfo.value) {
    globalState.updateLoginInfo({
      mail: inputMail.value,
      password: inputPassword.value,
      isSaveLoginInfo: true,
    })
  } else {
    globalState.updateLoginInfo(null)
  }
}

function onLoginSuccess(userDto, successMsg) {
  globalState.updateUserData(userDto)
  saveLoginInfo()
  notifyTopPositive(successMsg)
  backToHome(thisRouter)
}

function doLogin() {
  if (!inputMail.value || !inputPassword.value) {
    notifyTopWarning(t('login.empty_login'))
    return
  }
  if (!checkIsMail(inputMail.value)) {
    notifyTopWarning(t('login.email_invalid'))
    return
  }
  portalLogin({email: inputMail.value, password: inputPassword.value}).then(res => {
    if (!res || !res.data || !res.data.data) {
      return
    }
    onLoginSuccess(res.data.data, t('main_login_success'))
  })
}

function doRegister() {
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
  }).then(res => {
    if (!res || !res.data || !res.data.data) {
      return
    }
    onLoginSuccess(res.data.data, t('login.register_success'))
  })
}

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

function handleGoogleCredential(idToken) {
  if (!idToken) {
    return
  }
  portalGoogleLogin({idToken}).then(res => {
    if (!res || !res.data || !res.data.data) {
      return
    }
    onLoginSuccess(res.data.data, t('main_login_success'))
  })
}

function doGoogleLogin() {
  if (!getGoogleClientId()) {
    notifyTopWarning(t('login.google_not_config'))
    return
  }
  if (!promptGoogleOneTap()) {
    notifyTopWarning(t('login.google_failed'))
  }
}

function checkLoginInfo() {
  if (globalState.loginInfo) {
    isSaveLoginInfo.value = !!globalState.loginInfo.isSaveLoginInfo
    inputMail.value = globalState.loginInfo.mail || ""
    inputPassword.value = globalState.loginInfo.password || ""
  }
}


onMounted(() => {
  checkLoginInfo()
})

onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
})


</script>


<style lang="scss">

.login-topbar {
  height: 4rem;
  color: rgb(var(--text-color));
}

.login-body {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.75rem 1.5rem 0.75rem;
}

.login-card {
  width: 400px;
  max-width: 92vw;

  color: rgb(var(--text-color));
  border-radius: 12px;
  background-color: rgb(var(--container-background-color));
  backdrop-filter: blur(30px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, .12);
  padding: 28px 6px 10px 6px;

  font-size: .9rem;
}

// 登录 / 注册切换过渡
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity .35s ease, transform .35s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}


.gsi-material-button {
  background-color: transparent;
  background-image: none;
  border: none;
  -webkit-border-radius: 20px;
  border-radius: 20px;
  box-sizing: border-box;
  color: #1f1f1f;
  cursor: pointer;
  font-family: 'Roboto', arial, sans-serif;
  font-size: 14px;
  letter-spacing: 0.25px;
  outline: none;
  overflow: hidden;
  padding: 0;
  position: relative;
  text-align: center;
  -webkit-transition: background-color .218s, border-color .218s, box-shadow .218s;
  transition: background-color .218s, border-color .218s, box-shadow .218s;
  vertical-align: middle;
  white-space: nowrap;
  max-width: 400px;
  min-width: min-content;
  height: 2rem;
  width: 2rem;
}

.gsi-material-button-mask {
  top: -1rem;
  left: -1rem;
  height: 4rem;
  width: 4rem;
}


</style>

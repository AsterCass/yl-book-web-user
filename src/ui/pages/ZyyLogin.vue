<template>

  <div class="fixed-full column">
    <q-img class="fixed" width="100%" height="100%" position="50% 58%" style="z-index: -1"
           fit="cover" src="/img/login.jpg">
    </q-img>


    <div style="height: 5rem; color: rgb(var(--full-container-text-color));"
         class="full-width row items-center q-px-md">
      <q-btn no-caps unelevated class="component-none-btn-grow q-mx-xs" @click="switchLanguage()">
        <div class="row items-center q-ma-xs">
          <q-icon name="fa-solid fa-language" size="1.75rem"/>
        </div>
      </q-btn>
    </div>

    <div class="col row justify-center items-center">
      <div
          class="animated animate__fadeInUp animated_duration_15  column justify-between top-semi-trans-header-login">

        <div class="full-height column justify-evenly">

          <div class="row justify-center" style="margin-top: -15px !important">
            <h4>
              {{ $t('main_login_title') }}
            </h4>
          </div>
          <div class="row justify-center q-mx-md text-center q-mb-md">
            <div>
              <span style="opacity: .5"> {{ $t('main_login_subtitle_pre') }}</span>
              <span @click="notifyTopWarning($t('in_develop'))"
                    class="cask-jump-link-in-text">{{ $t('main_login_subtitle_reset_center') }}</span>
            </div>
          </div>

          <div class="q-mx-md">
            <q-input v-model="inputTenantName" tabindex="0" dense outlined
                     class="q-ma-md component-outline-input-grow-on-semi-trans">
              <template v-slot:prepend>
                <div class="row items-center justify-between">
                  <q-icon class="q-mr-sm" name="fa-regular fa-building" size="1rem"/>
                  <div style="opacity: 0.8">
                    {{ $t('main_login_tenant') }}
                  </div>
                </div>
              </template>
            </q-input>

            <q-input v-model="inputStoreName" tabindex="0" dense outlined
                     class="q-ma-md component-outline-input-grow-on-semi-trans">
              <template v-slot:prepend>
                <div class="row items-center justify-between">
                  <q-icon class="q-mr-sm" name="fa-solid fa-store" size="1rem"/>
                  <div style="opacity: 0.8">
                    {{ $t('main_login_store') }}
                  </div>
                </div>
              </template>
            </q-input>

            <q-input v-model="inputMail" tabindex="0" dense outlined
                     class="q-ma-md component-outline-input-grow-on-semi-trans">
              <template v-slot:prepend>
                <div class="row items-center justify-between">
                  <q-icon class="q-mr-sm" name="fa-regular fa-envelope" size="1rem"/>
                  <div style="opacity: 0.8">
                    {{ $t('main_login_mail') }}
                  </div>
                </div>
              </template>
            </q-input>

            <q-input v-model="inputPassword" tabindex="0" dense outlined :type="showUserPasswd ? 'text' : 'password'"
                     class="q-mt-md q-mx-md component-outline-input-grow-on-semi-trans">
              <template v-slot:prepend>
                <div class="row items-center justify-between">
                  <q-icon class="q-mr-sm" name="fa-solid fa-unlock-keyhole" size="1rem"/>
                  <div style="opacity: 0.8">
                    {{ $t('main_login_password') }}
                  </div>

                </div>
              </template>
            </q-input>

            <div class="q-mx-lg q-mt-sm" style="opacity: .5; font-size: .75rem">
              {{ $t('main_login_passwd_tips') }}
            </div>

            <div class="row q-mx-lg q-mt-sm">
              <div v-if="showUserPasswd" class=" cask-jump-link-in-text" style="font-size: .75rem"
                   @click="showUserPasswd = false">
                {{ $t('main_register_hide_passwd') }}
              </div>
              <div v-else class=" cask-jump-link-in-text" style="font-size: .75rem"
                   @click="showUserPasswd = true">
                {{ $t('main_register_show_passwd') }}
              </div>
            </div>


          </div>


          <div class="row justify-center">
            <q-btn no-caps unelevated class="q-ma-md shadow-2 component-full-btn-grow"
                   style="background-color: rgb(var(--semi-bg-container-background-color)) !important"
                   @click="userLoginMethod">
              <div class="row items-center">
                <div class="q-mr-sm" style="font-size: 14px">
                  {{ $t('main_login') }}
                </div>
                <q-icon name="fa-solid fa-arrow-right-to-bracket" size="15px"/>
              </div>
            </q-btn>
          </div>

          <div class="q-mx-md q-mb-md row justify-evenly items-center">
            <q-separator class="component-separator-base col-grow" inset size="1px"/>
            <div style="opacity:.9">
              {{ $t('main_login_more') }}
            </div>
            <q-separator class="component-separator-base col-grow" inset size="1px"/>
          </div>


          <div class="q-mb-lg row justify-evenly items-center">

            <q-icon name="fa-brands fa-github" size="2rem" class="cursor-pointer"
                    @click="notifyTopWarning($t('in_develop'))"/>


            <div class="relative-position">
              <button class="gsi-material-button" @click="notifyTopWarning($t('in_develop'))">
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
                    @click="notifyTopWarning($t('in_develop'))" style="color: rgb(0, 153, 255)"/>

          </div>

          <div class="q-mb-md row justify-center q-mx-md text-center items-center">
            <q-checkbox v-model="isSaveLoginInfo" :val="true" class="component-ratio-base q-mr-sm" dense
                        checked-icon="task_alt" unchecked-icon="panorama_fish_eye"/>
            <span style="opacity: .9">{{ $t('main_setting_save_login_data') }}</span>
          </div>


        </div>


      </div>
    </div>

    <zyy-footer/>

  </div>

</template>


<script setup>

import {onMounted, ref} from "vue";
import ZyyFooter from "@/ui/views/ZyyFooter.vue";
import {switchLanguage} from "@/utils/global-tools.js";
import {notifyTopPositive, notifyTopWarning} from "@/utils/notification-tools.js";
import {useRouter} from "vue-router";
import {useGlobalStateStore} from "@/utils/global-state.js";

import {backToHome} from "@/router/index.js";
import {i18n} from "@/i18n/index.js";


const t = i18n.global.t
const globalState = useGlobalStateStore();
const thisRouter = useRouter()


const inputMail = ref("")
const inputPassword = ref("")
const inputTenantName = ref("")
const inputStoreName = ref("")

const isSaveLoginInfo = ref(false)
const showUserPasswd = ref(false)
const currentBody = ref({})

function saveLoginInfo() {
  if (isSaveLoginInfo.value) {
    globalState.updateLoginInfo(currentBody.value)
  } else {
    globalState.updateLoginInfo(null)
  }
}

function userLoginMethod() {
  if (!inputMail.value || !inputPassword.value || !inputTenantName.value) {
    notifyTopWarning(t('main_login_message_empty'))
    return
  }
  // login
  currentBody.value = {
    mail: inputMail.value, password: inputPassword.value,
    tenantName: inputTenantName.value, storeName: inputStoreName.value,
    // 前端字段
    isSaveLoginInfo: isSaveLoginInfo.value,
  }

  // userLogin(currentBody.value).then(res => {
  //   if (!res || !res.data || !res.data.data) {
  //     return
  //   }
  //   globalState.updateUserData(res.data.data)
  //   saveLoginInfo()
  //   notifyTopPositive(t('main_login_success'))
  //   if (currentBody.value.mail === currentBody.value.password) {
  //     notifyTopWarning(t('yl_warning_passwd_init'), 30000)
  //   }
  //   backToHome(thisRouter)
  // })
}

function checkLoginInfo() {
  // info
  if (globalState.loginInfo) {
    isSaveLoginInfo.value = globalState.loginInfo.isSaveLoginInfo
    inputMail.value = globalState.loginInfo.mail
    inputPassword.value = globalState.loginInfo.password
    inputTenantName.value = globalState.loginInfo.tenantName
    inputStoreName.value = globalState.loginInfo.storeName
  }
}


onMounted(() => {
  checkLoginInfo()
})


</script>


<style lang="scss">

.animated_duration_15 {
  --animate-duration: 1.5s;
}

.top-semi-trans-header-login {
  width: 400px;

  color: rgb(var(--text-color));
  border-radius: 8px;
  background-color: rgb(var(--container-background-color));
  backdrop-filter: blur(30px);
  padding: 40px 2px 10px 2px;

  font-size: .9rem;
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
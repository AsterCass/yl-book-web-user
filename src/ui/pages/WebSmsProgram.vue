<template>

  <!-- 短信项目说明页（/sms）：A2P 10DLC / CTIA 要求「同意方式可被独立核验」，
       但预约表单里的 opt-in 文案要点五步才看得到，审核员多半走不完。这页把同一段文案摊开在一个
       固定 URL 上，填进 Twilio Campaign 的 opt-in 描述里，审核员一点即达。
       ⚠️ 页面上的 opt-in 原文<b>直接取自表单用的同一批 i18n key</b>（booking.sms_disclosure /
       booking.marketing_consent），不另抄一份——抄一份迟早会和表单说成两套，那正是审核最忌讳的。
       受众是审核员而非客户，因此只在页脚留链接，不进主导航。 -->
  <div class="sms-page column items-center">

    <div class="sms-topbar full-width row items-center q-px-md">
      <q-btn no-caps unelevated flat class="q-mx-xs" @click="switchLanguage()">
        <q-icon name="fa-solid fa-language" size="1.6rem"/>
      </q-btn>
    </div>

    <div class="column items-center q-px-md text-center">
      <img src="/favicon.svg" alt="" class="sms-brand-icon"/>
      <h4 class="sms-brand-title">{{ $t('main_login_title') }}</h4>
      <div class="sms-subtitle q-mt-md">{{ $t('smsProgram.title') }}</div>
    </div>

    <div class="sms-card column q-my-lg">

      <div class="sms-muted">{{ $t('smsProgram.intro') }}</div>

      <!-- 1. 发什么 -->
      <h6 class="sms-h6">{{ $t('smsProgram.types_title') }}</h6>
      <ul class="sms-list">
        <li>{{ $t('smsProgram.type_otp') }}</li>
        <li>{{ $t('smsProgram.type_booking') }}</li>
        <li>{{ $t('smsProgram.type_marketing') }}</li>
      </ul>

      <!-- 2. 怎么订阅：逐字给出表单上的两段文案 -->
      <h6 class="sms-h6">{{ $t('smsProgram.optin_title') }}</h6>
      <div class="sms-muted">{{ $t('smsProgram.optin_steps') }}</div>

      <div class="sms-quote q-px-md q-py-sm q-mt-sm">
        <div class="sms-quote-label">{{ $t('smsProgram.quote_intro') }}</div>
        <div>{{ $t('booking.sms_consent_intro') }}</div>
      </div>

      <div class="sms-quote q-px-md q-py-sm q-mt-sm">
        <div class="sms-quote-label">{{ $t('smsProgram.quote_transactional') }}</div>
        <div>{{ $t('booking.sms_notify_consent') }}</div>
      </div>

      <div class="sms-quote q-px-md q-py-sm q-mt-sm">
        <div class="sms-quote-label">{{ $t('smsProgram.quote_marketing') }}</div>
        <div>{{ $t('booking.marketing_consent') }}</div>
      </div>

      <div class="sms-quote q-px-md q-py-sm q-mt-sm">
        <div class="sms-quote-label">{{ $t('smsProgram.quote_terms') }}</div>
        <div>{{ $t('booking.sms_consent_terms') }}{{ $t('policy.privacy') }}{{ $t('policy.and') }}{{ $t('policy.terms') }}{{ $t('booking.sms_disclosure_suffix') }}</div>
      </div>

      <div class="sms-muted q-mt-sm">{{ $t('smsProgram.optin_note') }}</div>

      <!-- 3. 频率 / 资费 / 退订 -->
      <h6 class="sms-h6">{{ $t('smsProgram.terms_title') }}</h6>
      <div class="sms-notes q-px-md q-py-sm">
        <div class="q-my-xs"><b>{{ $t('smsProgram.freq_label') }}</b>{{ $t('smsProgram.freq') }}</div>
        <div class="q-my-xs"><b>{{ $t('smsProgram.rates_label') }}</b>{{ $t('smsProgram.rates') }}</div>
        <div class="q-my-xs"><b>{{ $t('smsProgram.stop_label') }}</b>{{ $t('smsProgram.stop') }}</div>
        <div class="q-my-xs"><b>{{ $t('smsProgram.help_label') }}</b>{{ $t('smsProgram.help') }}</div>
        <div class="q-my-xs"><b>{{ $t('smsProgram.carrier_label') }}</b>{{ $t('smsProgram.carrier') }}</div>
      </div>

      <!-- 4. 政策链接 + 回预约 -->
      <h6 class="sms-h6">{{ $t('smsProgram.more_title') }}</h6>
      <div class="column q-gutter-xs">
        <router-link :to="{name: 'policyPrivacy'}" class="sms-link">{{ $t('policy.privacy') }}</router-link>
        <router-link :to="{name: 'policyTerms'}" class="sms-link">{{ $t('policy.terms') }}</router-link>
      </div>
      <div class="sms-muted q-mt-md">{{ $t('smsProgram.contact') }}</div>

      <button class="sms-ghost-btn q-mt-lg" @click="goBook">{{ $t('smsProgram.see_form') }}</button>

    </div>

    <q-space/>

    <div class="sms-copy full-width q-py-md text-center">
      © {{ curYear }} {{ $t('main_login_title') }}
    </div>

  </div>

</template>


<script setup>

import {useRouter} from "vue-router";
import {switchLanguage} from "@/utils/global-tools.js";

const thisRouter = useRouter()

const curYear = new Date().getFullYear()

/**
 * 「去看真实表单」：回首页并滚到预约区。审核员据此可在<b>不登录、不注册</b>的前提下
 * 一路走到手机号输入框，亲眼看到上面引用的那段 opt-in 文案。
 */
function goBook() {
  thisRouter.push({name: 'index'})
}

</script>


<style scoped lang="scss">

$sms-red: #cc2e2d;

.sms-page {
  min-height: 100vh;
  background-color: #fff;
  color: #555;
  font-family: Roboto Slab, sans-serif;
}

.sms-topbar {
  height: 4rem;
  color: #333;
}

.sms-muted {
  opacity: 0.8;
  line-height: 1.7;
}

.sms-brand-icon {
  width: clamp(3rem, 8vw, 4.5rem);
  height: auto;
}

.sms-brand-title {
  color: #333;
  margin: 0 !important;
  font-size: clamp(1.6rem, 5vw, 2.6rem) !important;
  font-weight: 800 !important;
}

.sms-subtitle {
  font-size: 1.1rem;
  font-weight: 700;
  color: $sms-red;
  max-width: 34rem;
  text-align: center;
}

.sms-card {
  width: min(94vw, 42rem);
  background: #fff;
  border: 1px solid #e6e8ec;
  border-radius: 1rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, .07);
  padding: 1.5rem;
}

.sms-h6 {
  color: #333;
  font-size: 1.05rem !important;
  font-weight: 700 !important;
  margin: 1.4rem 0 .4rem 0 !important;
}

.sms-list {
  margin: 0;
  padding-left: 1.2rem;
  line-height: 1.8;
  opacity: .85;
}

// opt-in 原文：加引号框，让审核员一眼看出这是「逐字引用表单」
.sms-quote {
  background: #f7f7f8;
  border-left: 3px solid $sms-red;
  border-radius: .4rem;
  font-size: .92rem;
  line-height: 1.7;
}

.sms-quote-label {
  font-weight: 700;
  color: #333;
  margin-bottom: .3rem;
}

.sms-notes {
  background: #fdf3f3;
  border: 1px solid rgba(204, 46, 45, .25);
  border-radius: .8rem;
  font-size: .95rem;
  line-height: 1.7;
}

.sms-link {
  color: $sms-red;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.sms-ghost-btn {
  width: 100%;
  background: #fff;
  color: $sms-red;
  border: 2px solid $sms-red;
  border-radius: .6rem;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  padding: .6rem 2rem;
  cursor: pointer;
  transition: background-color .25s ease;

  &:hover {
    background-color: #fdf3f3;
  }
}

.sms-copy {
  color: #555;
  font-size: .85rem;
}

</style>

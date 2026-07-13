import {createI18n} from 'vue-i18n';
import en from '@/i18n/en.json';
import zh from '@/i18n/zh.json';
import {ref} from "vue";


export const i18n = createI18n({
    legacy: false,
    locale: ref('en'),
    fallbackLocale: ref('en'),
    messages: {en, zh}
});

export function setLocale(lang) {
    i18n.global.locale.value = lang;
}
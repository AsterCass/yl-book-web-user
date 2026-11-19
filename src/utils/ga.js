import {isAdOptedOut} from "@/utils/pixel.js";
import {currentStoreParam} from "@/utils/landing-params.js";

// Google Analytics 4（2026-11-11）。gtag.js 由 index.html 的 <head> 加载：只在正式环境（.env.production 的 VITE_GA_ID），
// 已选择退出（GPC / 「Do Not Sell」开关）的访客整段不加载。这里只负责发事件与当场停用，不负责加载。
const GA_ID = import.meta.env.VITE_GA_ID

// Google Ads「网站预约」转化（2026-11-19）：send_to = 账号 ID/转化标签（.env.production 两项拼起来），任一项没配就是空串 = 不报
const ADS_BOOK_SEND_TO = import.meta.env.VITE_GADS_ID && import.meta.env.VITE_GADS_BOOK_LABEL
    ? `${import.meta.env.VITE_GADS_ID}/${import.meta.env.VITE_GADS_BOOK_LABEL}`
    : ''

/** gtag 能用：已加载（不是本地开发、没被广告拦截插件挡掉）且访客没有选择退出 */
function gtagReady() {
    return typeof window !== 'undefined' && typeof window.gtag === 'function' && !isAdOptedOut()
}

/**
 * 发一个 GA 事件。没加载 GA（本地开发 / 已退出 / 被广告拦截插件挡掉）时什么都不做，不报错。
 * 只发给 GA（send_to）：同一份 gtag 还配了 Google Ads，不指定的话预约步骤事件也会一并发给 Ads
 */
export function gaEvent(name, params) {
    if (!gtagReady()) {
        return
    }
    window.gtag('event', name, {...params, send_to: GA_ID})
}

/**
 * 报一次 Google Ads「网站预约」转化：只在预约提交成功那一刻调（不是成功页一打开就报），刷新页面不会重复计数，
 * 所以不带 transaction_id（下单接口也不返回单号）。value 为本次预约原价合计（美元）
 */
export function adsBookConversion(value) {
    if (!ADS_BOOK_SEND_TO || !gtagReady()) {
        return
    }
    window.gtag('event', 'conversion', {send_to: ADS_BOOK_SEND_TO, value, currency: 'USD'})
}

/**
 * 当前门店参数：网址里的 ?store=，没有就取 index.html 记在 sessionStorage 的那个（页面内跳转后网址里没了参数）。
 * 口径与 index.html 里 gtag('set', {store}) 的完全一致；没有返回空串
 */
export function gaStore() {
    return currentStoreParam()
}

/** 当场停用 GA（GA 官方开关 window['ga-disable-<ID>']）：「Do Not Sell」打开退出时调用，页面随后刷新就不再加载 */
export function disableGa() {
    if (GA_ID && typeof window !== 'undefined') {
        window['ga-disable-' + GA_ID] = true
    }
}

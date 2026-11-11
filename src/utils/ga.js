import {isAdOptedOut} from "@/utils/pixel.js";
import {currentStoreParam} from "@/utils/landing-params.js";

// Google Analytics 4（2026-11-11）。gtag.js 由 index.html 的 <head> 加载：只在正式环境（.env.production 的 VITE_GA_ID），
// 已选择退出（GPC / 「Do Not Sell」开关）的访客整段不加载。这里只负责发事件与当场停用，不负责加载。
const GA_ID = import.meta.env.VITE_GA_ID

/** 发一个 GA 事件。没加载 GA（本地开发 / 已退出 / 被广告拦截插件挡掉）时什么都不做，不报错 */
export function gaEvent(name, params) {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function' || isAdOptedOut()) {
        return
    }
    window.gtag('event', name, params)
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

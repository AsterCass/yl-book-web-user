const PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID

// 「不出售/不分享我的个人信息」的本机选择（CCPA/CPRA 等州法要求提供该选项）。
// 存 localStorage：这是一个设备级偏好，跟账户无关，也不上送后端
const OPT_OUT_KEY = 'adOptOut'

let loaded = false

/**
 * 是否已选择退出广告衡量。两种来源，任一命中即退出：
 * 1. 浏览器的 Global Privacy Control 信号（navigator.globalPrivacyControl === true）——
 *    加州等州把 GPC 视为有效的 opt-out 请求，必须自动尊重，无需用户再点一次；
 * 2. 用户在「Do Not Sell or Share」页面上自己关掉的开关。
 */
export function isAdOptedOut() {
    if (typeof window === 'undefined') {
        return true
    }
    if (navigator.globalPrivacyControl === true) {
        return true
    }
    try {
        return localStorage.getItem(OPT_OUT_KEY) === '1'
    } catch (e) {
        // 隐私模式下 localStorage 可能不可用：读不到就当没选过
        return false
    }
}

/** 浏览器是否发了 GPC 信号（页面上要如实告诉用户"已自动为你退出"） */
export function isGpcEnabled() {
    return typeof window !== 'undefined' && navigator.globalPrivacyControl === true
}

/**
 * 写入本机选择。GPC 信号优先级更高，用户就算手动打开也仍以 GPC 为准（isAdOptedOut 会先看 GPC）。
 */
export function setAdOptOut(optOut) {
    try {
        if (optOut) {
            localStorage.setItem(OPT_OUT_KEY, '1')
        } else {
            localStorage.removeItem(OPT_OUT_KEY)
        }
        return true
    } catch (e) {
        return false
    }
}

// ?ads=no 的本标签页标记（与 index.html 里 GA 那段共用同一个 key）
const NO_ADS_KEY = 'zyy_ads'

/**
 * 这次访问是否来自「已有渠道」的链接（2026-11-11）：网址带 ?ads=no（不分大小写）时，本标签页里 Meta Pixel 与 GA 都不加载。
 * 记在 sessionStorage：刷新、站内跳转后网址里没了参数也照样不加载；网址明确带了别的 ads 值就清掉标记。
 * 规则与 index.html 里 GA 那段一致。不是用户的隐私选择（那是 isAdOptedOut），只是按链接来源不做衡量
 */
export function isNoAdsVisit() {
    if (typeof window === 'undefined') {
        return false
    }
    const param = new URLSearchParams(window.location.search).get('ads')
    const no = (param || '').trim().toLowerCase() === 'no'
    try {
        if (param !== null) {
            if (no) {
                sessionStorage.setItem(NO_ADS_KEY, 'no')
            } else {
                sessionStorage.removeItem(NO_ADS_KEY)
            }
            return no
        }
        return sessionStorage.getItem(NO_ADS_KEY) === 'no'
    } catch (e) {
        // 隐私模式下 sessionStorage 可能不可用：只看当前网址
        return no
    }
}

/** 动态注入 Meta Pixel 基础代码。已选择退出（含 GPC），或这是 ?ads=no 的访问，则整段脚本都不加载 */
export function initPixel() {
    // 要暂停 ?ads=no 时把下一行换成注释里这句（同步切换 index.html 与 landing-params.js）
    // if (!PIXEL_ID || loaded || typeof window === 'undefined' || isAdOptedOut()) return
    if (!PIXEL_ID || loaded || typeof window === 'undefined' || isAdOptedOut() || isNoAdsVisit()) return

    /* eslint-disable */
    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return
        n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        }
        if (!f._fbq) f._fbq = n
        n.push = n
        n.loaded = !0
        n.version = '2.0'
        n.queue = []
        t = b.createElement(e)
        t.async = !0
        t.src = v
        s = b.getElementsByTagName(e)[0]
        s.parentNode.insertBefore(t, s)
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
    /* eslint-enable */

    window.fbq('init', PIXEL_ID)
    loaded = true
}

/** 标准事件 */
export function track(event, params) {
    if (!loaded || !window.fbq || isAdOptedOut()) return
    window.fbq('track', event, params)
}

/** 自定义事件 */
export function trackCustom(event, params) {
    if (!loaded || !window.fbq || isAdOptedOut()) return
    window.fbq('trackCustom', event, params)
}

export function trackPageView() {
    track('PageView')
}
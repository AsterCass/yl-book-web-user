const PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID

let loaded = false

/** 动态注入 Meta Pixel 基础代码 */
export function initPixel() {
    if (!PIXEL_ID || loaded || typeof window === 'undefined') return

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
    if (!loaded || !window.fbq) return
    window.fbq('track', event, params)
}

/** 自定义事件 */
export function trackCustom(event, params) {
    if (!loaded || !window.fbq) return
    window.fbq('trackCustom', event, params)
}

export function trackPageView() {
    track('PageView')
}
import {useGlobalStateStore} from "@/utils/global-state.js";

// 站外投放落地参数：?platform=xx&ref=xx
// platform -> 注册来源 sourceCode，ref -> 推荐码 referralCode，注册/下单时上报。
//
// 仅「首页（/ 及别名 /index、/promo）与 /login」接受该参数：
//   - 在这两类页面整页加载时，以当前 URL 为准覆盖（未携带即置空，不保留旧值）；
//   - 其他页面（如 /dashboard、/auth/*/callback、/terms 等）不接受该参数，
//     也不会因 URL 未携带而重置 localStorage 中已存的值——
//     因此谷歌 OAuth 整页跳转回来后，跳转前捕获的落地归因得以保留。
// 首页跳转登录页时会把当前落地参数带入 /login 的 query（见 currentLandingQuery），
// 这样刷新/分享登录页链接也不丢归因。

// 平台参数 -> 后端 sourceCode，与 com.yl.base.enums.UserSourceEnum 对齐：
// TIKTOK(1) INSTAGRAM(2) YOUTUBE(3) FACEBOOK(4)
// 未知平台或为空则不上报该字段，后端缺省即 GENERAL(0)
const PLATFORM_SOURCE_CODE = {
    tk: 1,
    ins: 2,
    yt: 3,
    fb: 4,
}

export function platformToSourceCode(platform) {
    if (!platform) {
        return null
    }
    const code = PLATFORM_SOURCE_CODE[String(platform).trim().toLowerCase()]
    return code === undefined ? null : code
}

// 接受落地参数的路径（整页加载时按 window.location.pathname 判定）
const LANDING_CAPTURE_PATHS = new Set(['/', '/index', '/promo', '/login'])

/**
 * 从当前 URL 抓取落地参数写入 globalState。
 *
 * 在 app.use(router) 之前调用（main.js）：早于任何路由重定向读取原始 URL。
 * 仅在 LANDING_CAPTURE_PATHS 内的页面生效；其他页面直接返回，不覆盖也不清空已存值。
 */
export function captureLandingParams() {
    // 去掉末尾斜杠归一化（/login/ 与 /login 等价），根路径保留 "/"
    const path = window.location.pathname.replace(/\/+$/, '') || '/'
    if (!LANDING_CAPTURE_PATHS.has(path)) {
        return
    }
    const query = new URLSearchParams(window.location.search)
    // 接受页内：URL 未携带（或为空）对应参数则为空字符串，直接覆盖旧值，不保留
    useGlobalStateStore().updateLandingParams(
        (query.get('platform') || '').trim(),
        (query.get('ref') || '').trim(),
    )
}

/**
 * 当前已存的落地参数 -> 路由 query（空的不带）。首页跳转 /login 时携带，
 * 使登录页 URL 刷新/被分享后仍能在 /login（接受页）重新捕获归因。
 */
export function currentLandingQuery() {
    const globalState = useGlobalStateStore()
    const query = {}
    if (globalState.platform) {
        query.platform = globalState.platform
    }
    if (globalState.referralCode) {
        query.ref = globalState.referralCode
    }
    return query
}

/**
 * 注册 / 首次 OAuth 登录时上报的归因参数。
 * 平台未知或为空、推荐码为空时，均不下发对应字段（后端按缺省处理）。
 */
export function buildAttributionParams() {
    const globalState = useGlobalStateStore()
    const params = {}
    const sourceCode = platformToSourceCode(globalState.platform)
    if (sourceCode !== null) {
        params.sourceCode = sourceCode
    }
    if (globalState.referralCode) {
        params.referralCode = globalState.referralCode
    }
    return params
}

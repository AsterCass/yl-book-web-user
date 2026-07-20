import {useGlobalStateStore} from "@/utils/global-state.js";

// 站外投放落地参数：?platform=xx&ref=xx
// platform -> 注册来源 sourceCode，ref -> 推荐码 referralCode，注册/下单时上报。
// 每次进入本站都以当前 URL 为准覆盖：URL 未携带对应参数即置空，不保留上一次的值。
// 注意：谷歌 OAuth 回调地址（/auth/google/callback?code=...）不含 platform/ref，
// 因此整页跳转回来时会把落地参数清空——OAuth 注册不会带上跳转前的落地归因。

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

/**
 * 从当前 URL 抓取落地参数写入 globalState。
 *
 * 必须在 app.use(router) 之前调用：router 安装即触发首次导航，而 "/" 会 redirect 到 dashboard，
 * vue-router 不保留 query，等到组件 onMounted 时 window.location.search 已被清掉。
 */
export function captureLandingParams() {
    const query = new URLSearchParams(window.location.search)
    // URL 未携带（或为空）对应参数则为空字符串，直接覆盖旧值，不保留
    useGlobalStateStore().updateLandingParams(
        (query.get('platform') || '').trim(),
        (query.get('ref') || '').trim(),
    )
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

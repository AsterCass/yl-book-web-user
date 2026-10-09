import {i18n} from '@/i18n/index.js'

// 对客户展示的时间格式：英文界面用 12 小时制（5:00 PM），中文界面保持 24 小时制（17:00）。
//
// 只管「显示」：可约时段、下单入参 bookTimeStr 等数据一律仍是 'yyyy-MM-dd HH:mm'，不要把格式化后的串传给后端。
// 英文写法与预约确认邮件一致（后端 ResendMailBiz.to12Hour：yyyy-MM-dd h:mm a）——小时不补零、AM/PM 大写，
// 客户在网页上看到的和邮件里收到的是同一个样子。
//
// 在模板里直接调用即可：函数内读取 i18n.global.locale（响应式），切换语言时会随渲染自动更新。

const DATE_TIME_PATTERN = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}):(\d{2})/
const CLOCK_PATTERN = /^(\d{1,2}):(\d{2})/

function useTwelveHour() {
    // 站点只有中 / 英两种语言；非中文一律按英文处理（与页面上 lv() 取 en 兜底的口径一致）
    return i18n.global.locale.value !== 'zh'
}

function toTwelveHour(hour, minute) {
    const suffix = hour >= 12 ? 'PM' : 'AM'
    const h12 = hour % 12 === 0 ? 12 : hour % 12
    return `${h12}:${minute} ${suffix}`
}

/**
 * 'HH:mm' -> 英文 '5:00 PM' / 中文原样 '17:00'。解析不了原样返回。
 */
export function formatClock(hm) {
    if (!hm || !useTwelveHour()) {
        return hm
    }
    const matched = CLOCK_PATTERN.exec(hm)
    if (!matched) {
        return hm
    }
    return toTwelveHour(Number(matched[1]), matched[2])
}

/**
 * 'yyyy-MM-dd HH:mm' -> 英文 '2026-09-30 5:00 PM' / 中文原样。日期部分不动；解析不了原样返回。
 */
export function formatDateTime(dateTimeStr) {
    if (!dateTimeStr || !useTwelveHour()) {
        return dateTimeStr
    }
    const matched = DATE_TIME_PATTERN.exec(dateTimeStr)
    if (!matched) {
        return dateTimeStr
    }
    return `${matched[1]} ${toTwelveHour(Number(matched[2]), matched[3])}`
}

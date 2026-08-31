import {serviceShiro} from "@/utils/request.js";

// 客户预约入口（对应后端 /portal/booking）
// 门店/项目/雇员/可约时间四个查询免登录（后端 1 小时缓存 + 单 IP 限流：目录三接口共用 60 次/时、可约时间 30 次/时）；
// 只有 create 需要身份，未登录时由预约表单先做邮箱+手机验证并自动登录。
// 「我的预约」/「取消」已下线（后端接口标记为过时）：客户不再查历史记录，要取消走预约成功邮件里的取消链接。
// 门店/项目/雇员来自配置的可预约租户；下单每周 ≤ 20 次，预约时间限未来 14 天内

export function portalBookingStores() {
    return serviceShiro({
        url: `/portal/booking/stores`,
        method: 'get',
    })
}

// params: {storeId}
export function portalBookingSkills(params) {
    return serviceShiro({
        url: `/portal/booking/skills`,
        params: params,
        method: 'get',
    })
}

// params: {storeId}
export function portalBookingStaffs(params) {
    return serviceShiro({
        url: `/portal/booking/staffs`,
        params: params,
        method: 'get',
    })
}

// params: {storeId, skillIdList: [], preferredStaffId?}
// 一次返回未来 14 天（含今天，门店本地）每天的可约时间：[{dateStr, slotList: ['yyyy-MM-dd HH:mm']}]
// 窗口内每天必有一条，slotList 为空 = 当天不可约（前端置灰），避免逐天请求浪费客户时间
export function portalBookingSlotsBatch(params) {
    return serviceShiro({
        url: `/portal/booking/slots/batch`,
        params: params,
        method: 'get',
    })
}

// body: {storeId, bookTimeStr: 'yyyy-MM-dd HH:mm', skillIdList: [], preferredStaffId?, couponCode?}
export function portalBookingCreate(body) {
    return serviceShiro({
        url: `/portal/booking/create`,
        data: body,
        method: 'post',
    })
}

// 取消链接（免登录，token 来自预约成功邮件，15 天有效；info/cancel 共用单 IP 15 次/时限流）：
// info 返回 {storeName, storeAddress, storePhone, bookTimeStr, projects, amount, canceled}
export function portalBookingCancelLinkInfo(token) {
    return serviceShiro({
        url: `/portal/booking/cancel/link/${token}`,
        method: 'get',
    })
}

export function portalBookingCancelByLink(token) {
    return serviceShiro({
        url: `/portal/booking/cancel/link/${token}`,
        method: 'post',
    })
}

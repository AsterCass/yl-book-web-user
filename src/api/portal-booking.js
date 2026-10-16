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

// body: {storeId, bookTimeStr: 'yyyy-MM-dd HH:mm', skillIdList: [], preferredStaffId?, couponCode?,
// nickName?(本单客户姓名，≤50；后端可空=沿用账户昵称，填了同步为账户昵称)}
export function portalBookingCreate(body) {
    return serviceShiro({
        url: `/portal/booking/create`,
        data: body,
        method: 'post',
    })
}

// 预约详情链接（原取消链接；免登录，token 来自预约邮件 / 预约变动短信，15 天有效）。
// 限流：无效 token 单 IP 30 次/时；有效 token 每条链接 60 次/时（查看与取消合计）。
// info 返回 {phoneTail, cutoffMinutes,
//   bookingList: [{bookingId, storeName, storeAddress, storePhone, bookTimeStr, projects, amount, staffName,
//                  canceled, thirdParty, cancellable}]}
// ——该号码在所有对客门店（口径同门店列表）还没开始的预约，每张自带所属门店的信息；
//   第三方平台的单只有门店、时间与项目。备注不返回、页面不展示。
//   顶层的 storeName / storeAddress / storePhone 等单张字段只为兼容旧页面，新页面不用
export function portalBookingCancelLinkInfo(token) {
    return serviceShiro({
        url: `/portal/booking/cancel/link/${token}`,
        method: 'get',
    })
}

// 取消列表里的某一张（可以是别的门店的单）：bookingId 不传 = 取消链接签发时对应的那张单。
// 距开始不足 cutoffMinutes、或第三方平台的单会被后端拒绝
export function portalBookingCancelByLink(token, bookingId) {
    return serviceShiro({
        url: `/portal/booking/cancel/link/${token}`,
        method: 'post',
        data: {bookingId},
    })
}

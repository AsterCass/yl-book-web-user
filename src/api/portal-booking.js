import {serviceShiro} from "@/utils/request.js";

// 客户预约入口下单/取消（对应后端 /portal/booking，均需登录）
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

// params: {storeId, dateStr: 'yyyy-MM-dd', skillIdList: [], preferredStaffId?}
// 返回当天可下单的 'yyyy-MM-dd HH:mm' 列表（每 30 分钟一个候选，无合格雇员有空则为空）
export function portalBookingSlots(params) {
    return serviceShiro({
        url: `/portal/booking/slots`,
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

// params: {pageNo, pageSize}；返回 IPage：res.data.data.records / .total
export function portalBookingMy(params) {
    return serviceShiro({
        url: `/portal/booking/my`,
        params: params,
        method: 'get',
    })
}

export function portalBookingCancel(id) {
    return serviceShiro({
        url: `/portal/booking/cancel/${id}`,
        method: 'post',
    })
}

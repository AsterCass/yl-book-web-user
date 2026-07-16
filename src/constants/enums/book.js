import {Enum} from "@/constants/enums/common.js";

// 预约状态（与后端 BookStatusEnum 对齐）。
// 注意：客户端需多语言，故 name 存的是 i18n key（用 $t(name) 渲染），color 与管理端保持一致
export const BookStatusEnum = new Enum({
    PRE: {code: 0, name: 'booking.status.pre', desc: '', color: 'rgb(245, 166, 35)'},
    WORK: {code: 1, name: 'booking.status.work', desc: '', color: 'rgb(68, 117, 80)'},
    IN_PROGRESS: {code: 2, name: 'booking.status.in_progress', desc: '', color: 'rgb(52, 152, 219)'},
    DONE: {code: 3, name: 'booking.status.done', desc: '', color: 'rgb(127, 140, 141)'},
    EXPIRED: {code: 4, name: 'booking.status.expired', desc: '', color: 'rgb(155, 89, 182)'},
    CANCEL: {code: -1, name: 'booking.status.cancel', desc: '', color: 'rgb(200, 60, 60)'},
});

// 可取消的状态：待分配 / 已分配
export const BOOK_CANCELABLE_STATUS = [0, 1]

export const BookSourceEnum = new Enum({
    NATURAL: {code: 1, name: '自然流', desc: '', color: 'rgb(68, 117, 80)'},
    PHONE: {code: 2, name: '电话预约', desc: '', color: 'rgb(52, 152, 219)'},
    WECHAT: {code: 7, name: '微信预约', desc: '', color: 'rgb(7, 193, 96)'},
    CLASSPASS: {code: 3, name: 'classpass', desc: '', color: 'rgb(155, 89, 182)'},
    BUILDHEALTH: {code: 4, name: 'buildhealth', desc: '', color: 'rgb(230, 126, 34)'},
    AI: {code: 5, name: 'AI预约', desc: '', color: 'rgb(26, 188, 156)'},
    OWN_SITE: {code: 6, name: '本站预约', desc: '', color: 'rgb(241, 196, 15)'},
    UNKNOW: {code: 100, name: '其他预约', desc: '', color: 'rgb(128, 128, 128)'},
});
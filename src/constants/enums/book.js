import {Enum} from "@/constants/enums/common.js";

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
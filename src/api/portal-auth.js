import {serviceShiro} from "@/utils/request.js";

// 客户预约入口鉴权（面向 C 端客户，对应后端 /portal/auth）
// sendCode/register/login/bookingLogin/googleLogin/phone/sendCode 公开；me/logout/phone/verify 需登录

export function portalSendCode(body) {
    return serviceShiro({
        url: `/portal/auth/sendCode`,
        data: body,
        method: 'post',
    })
}

export function portalRegister(body) {
    return serviceShiro({
        url: `/portal/auth/register`,
        data: body,
        method: 'post',
    })
}

export function portalLogin(body) {
    return serviceShiro({
        url: `/portal/auth/login`,
        data: body,
        method: 'post',
    })
}

// 下单流程免密登录（公开）：body {phone: '1xxxxxxxxxx', phoneCode(短信验证码), email?(可空、不验证),
// nickName?, sourceCode?, referralCode?}。客户身份以手机号为准（一号一账户），短信码通过即登录，
// 该号码没账户则自动建号；邮箱只作联系方式与下次预填值（被其它账户占用则不写入账户，不影响下单）。
// 登录后该号码在 30 分钟内可直接下单（后端已写「已验证」标记），无需再调 phone/verify。
// 与 login 一样：会话 token 在响应头 Yl-Token（客户端会话 180 天）
export function portalBookingLogin(body) {
    return serviceShiro({
        url: `/portal/auth/bookingLogin`,
        data: body,
        method: 'post',
    })
}

export function portalGoogleLogin(body) {
    return serviceShiro({
        url: `/portal/auth/googleLogin`,
        data: body,
        method: 'post',
    })
}


export function portalGithubLogin(body) {
    return serviceShiro({
        url: `/portal/auth/githubLogin`,
        data: body,
        method: 'post',
    })
}

export function portalResetPasswdSendCode(body) {
    return serviceShiro({
        url: `/portal/auth/resetPasswd/sendCode`,
        data: body,
        method: 'post',
    })
}

export function portalResetPasswd(body) {
    return serviceShiro({
        url: `/portal/auth/resetPasswd`,
        data: body,
        method: 'post',
    })
}

export function portalMe() {
    return serviceShiro({
        url: `/portal/auth/me`,
        method: 'get',
    })
}

// body: {phone: '1xxxxxxxxxx'}（不带 + 的 11 位美加号码）；免登录，限流：同号码 5 次/时、同 IP 10 次/时
export function portalPhoneSendCode(body) {
    return serviceShiro({
        url: `/portal/auth/phone/sendCode`,
        data: body,
        method: 'post',
    })
}

// body: {phone, code}；需登录，限流：同 IP 20 次/时。通过后 30 分钟内可用该号码下单
export function portalPhoneVerify(body) {
    return serviceShiro({
        url: `/portal/auth/phone/verify`,
        data: body,
        method: 'post',
    })
}

export function portalLogout() {
    return serviceShiro({
        url: `/portal/auth/logout`,
        method: 'post',
    })
}

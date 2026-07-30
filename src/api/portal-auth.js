import {serviceShiro} from "@/utils/request.js";

// 客户预约入口鉴权（面向 C 端客户，对应后端 /portal/auth）
// sendCode/register/login/googleLogin 公开；me/logout 需登录

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

// body: {phone: '1xxxxxxxxxx'}（不带 + 的 11 位美加号码）；需登录，限流：同号码 5 次/时、同 IP 10 次/时
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

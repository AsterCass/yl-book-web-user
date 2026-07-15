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

export function portalLogout() {
    return serviceShiro({
        url: `/portal/auth/logout`,
        method: 'post',
    })
}

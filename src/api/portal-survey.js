import {serviceShiro} from "@/utils/request.js";

// 服务评价（免登录问卷，对应后端 /portal/survey）：凭邀请邮件里的链接 token 访问，
// token 3 天有效、提交后即失效

export function portalSurveyInfo(token) {
    return serviceShiro({
        url: `/portal/survey/${token}`,
        method: 'get',
    })
}

// body: {score: 1-5, content?: ≤1000字符, anonymous?: boolean}
export function portalSurveySubmit(token, body) {
    return serviceShiro({
        url: `/portal/survey/${token}`,
        data: body,
        method: 'post',
    })
}

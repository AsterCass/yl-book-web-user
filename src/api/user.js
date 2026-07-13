import {serviceShiro} from "@/utils/request.js";

export function userList(params) {
    return serviceShiro({
        url: `/user/list`,
        params: params,
        method: 'get',
    })
}

export function userCreate(body) {
    return serviceShiro({
        url: `/user/create`,
        data: body,
        method: 'post',
    })
}


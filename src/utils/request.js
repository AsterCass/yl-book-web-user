import axios from 'axios'
import Qs from 'qs'
import {notifyTopWarning} from "@/utils/notification-tools";
import {i18n} from '@/i18n';
import router, {backToLogin} from '@/router'
import {useGlobalStateStore} from "@/utils/global-state.js";

const t = i18n.global.t
const BASE_ADD = import.meta.env.VITE_APP_BASE_ADD


const requestConfig = config => {
    const globalState = useGlobalStateStore()
    if (globalState.loginToken) {
        config.headers.set('Yl-Token', globalState.loginToken)
    }
    return config
}


const responseConfig = response => {
    if (response && 200 === response.status) {
        const serverData = response.data
        let bizStatus = 0
        if (serverData instanceof Object) {
            bizStatus = serverData.status
            if (600 === bizStatus) {
                notifyTopWarning(t('no_login'))
                useGlobalStateStore().updateLoginToken(null)
                backToLogin(router)
                return null
            }
            if (400 === bizStatus) {
                notifyTopWarning(t('error_request'))
                return null
            }
            if (bizStatus >= 500) {
                notifyTopWarning(serverData.message)
                return null
            }
        }
    } else {
        notifyTopWarning(t('error_request'))
        return null
    }
    return response;
}


const responseErrorConfig = error => {
    if (error.status === 429) {
        notifyTopWarning(t('error_request_429'))
    } else {
        notifyTopWarning(t('error_request'))
    }
    return undefined
}


const serviceShiro = axios.create({
    baseURL: BASE_ADD,
    // allow cookies (Set-Cookie) to be stored when server responds
    // required when backend and frontend are on different origins and server
    // sends cookies for authentication/session
    withCredentials: true,
    timeout: 20000,
    // axios 1.x 取的是 paramsSerializer.serialize；写成 paramsSerializer.paramsSerializer 会被静默忽略，
    // 数组会退化成 a[]=1&a[]=2，后端 List 入参（如 /portal/booking/slots 的 skillIdList）无法绑定
    paramsSerializer: {
        serialize: function (params) {
            return Qs.stringify(params, {arrayFormat: 'repeat'})
        }
    }
})

serviceShiro.interceptors.request.use(requestConfig)
serviceShiro.interceptors.response.use(responseConfig, responseErrorConfig)


export {
    serviceShiro
}
import {defineStore} from 'pinia';

export function createPersistedStatePlugin() {
    return (context) => {
        const {store} = context;

        // 从 Local Storage 加载初始状态
        const savedState = localStorage.getItem(store.$id);
        if (savedState) {
            store.$patch(JSON.parse(savedState));
        }

        // 监听 store 变化并保存到 Local Storage
        store.$subscribe((mutation, state) => {
            localStorage.setItem(store.$id, JSON.stringify(state));
        });
    };
}

export const useGlobalStateStore = defineStore('globalState', {
    state: () => ({
        curThemeName: 'light',
        language: '',
        loginToken: '',
        userData: null,
        loginInfo: null,
        // 页面数据版本号：作为顶层 router-view 的 key，自增即强制重挂载当前页面（重跑 onMounted 内的查询逻辑）
        dataVersion: 0,
        // 站外投放落地参数（?platform= / ?ref=），注册/下单时映射为 sourceCode / referralCode 上报。
        // 仅首页（/、/index、/promo）与 /login 整页加载时以当前 URL 覆盖（未带即置空）；
        // 其他页面不接受该参数、也不清空已存值（见 utils/landing-params.js）
        platform: '',
        referralCode: '',
        // 是否已访问过本站（持久化到 localStorage）：登录页首次访问海报只弹一次
        visited: false,
        // 是否已勾选同意《服务条款》《隐私政策》（持久化到 localStorage）：勾选过则登录/注册无需重复勾选
        policyAgreed: false,
    }),
    getters: {
        // 当前用户拥有的权限码集合（兼容 userData 直接为用户对象或包一层 userData 两种结构）
        permissionCodeSet(state) {
            const ud = state.userData
            const list = (ud && (ud.permissionDtoList
                || (ud.userData && ud.userData.permissionDtoList))) || []
            const set = new Set()
            for (const per of list) {
                if (per && per.code) {
                    set.add(per.code)
                }
            }
            return set
        },
        // 判断是否拥有某个权限码（页面级）；未传 code 视为不限制
        hasPermission() {
            return (code) => {
                if (!code) {
                    return true
                }
                return this.permissionCodeSet.has(code)
            }
        },
    },
    actions: {
        updateTheme(code) {
            this.curThemeName = code;
        },
        updateLanguage(code) {
            this.language = code;
        },
        updateUserData(data) {
            this.userData = data
        },
        refreshPageData() {
            this.dataVersion++
        },
        // tenant 为 tenantList 中的元素（含 tenantId/tenantName/storeList）
        // 切换租户后原门店已不属于新租户，故重置为新租户的第一个门店（无门店则置空）
        switchTenant(tenant) {
            if (!this.userData || !tenant) {
                return
            }
            const storeList = Array.isArray(tenant.storeList) ? tenant.storeList : []
            const firstStore = storeList.length > 0 ? storeList[0] : null
            this.userData = {
                ...this.userData,
                tenantId: tenant.tenantId,
                tenantName: tenant.tenantName,
                storeId: firstStore ? firstStore.storeId : '',
                storeName: firstStore ? firstStore.storeName : null,
            }
            this.refreshPageData()
        },
        updateLoginToken(token) {
            if (token) {
                this.loginToken = token;
            } else {
                this.loginToken = ''
            }
        },
        switchStore(storeId, storeName) {
            if (!this.userData) {
                return
            }
            this.userData = {...this.userData, storeId, storeName}
            this.refreshPageData()
        },
        updateLoginInfo(data) {
            this.loginInfo = data
        },
        // 落地参数以本次 URL 为准覆盖（仅接受页调用）：URL 未携带对应参数则置空字符串
        updateLandingParams(platform, referralCode) {
            this.platform = platform || ''
            this.referralCode = referralCode || ''
        },
        markVisited() {
            this.visited = true
        },
        updatePolicyAgreed(agreed) {
            this.policyAgreed = !!agreed
        }
    },
});
import {createRouter, createWebHistory} from "vue-router";
import {i18n} from '@/i18n/index.js'
import {useGlobalStateStore} from "@/utils/global-state.js";
import NoAuth from "@/ui/pages/NoAuth.vue";
import NotFound from "@/ui/pages/NotFound.vue";
import NoLogin from "@/ui/pages/NoLogin.vue";
import ZyyMain from "../ui/pages/ZyyMain.vue";
import ZyyLogin from "@/ui/pages/ZyyLogin.vue";
import ZyyDashboard from "@/ui/views/ZyyDashboard.vue";
import WebAuthLogin from "@/ui/pages/WebAuthLogin.vue";
import WebPolicy from "@/ui/pages/WebPolicy.vue";
import WebHome from "@/ui/pages/WebHome.vue";


const router = createRouter({
    // history: createWebHashHistory(process.env.BASE_URL),
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes: [
        // 官网首页（落地页）：免登录可访问，向访客说明本平台是什么、给谁用、提供什么功能
        {
            path: "/",
            alias: "/index",
            name: "index",
            component: WebHome,
            meta: {
                title: 'main_login_title'
            },
        },
        // 预约应用壳：登录成功 / backToHome 仍指向 name "main"（重定向到仪表盘）
        {
            path: "/dashboard",
            name: "main",
            component: ZyyMain,
            redirect: {name: 'dashboard'},
            children: [
                {
                    path: "",
                    name: "dashboard",
                    component: ZyyDashboard,
                    meta: {
                        title: 'yl_system_dashboard',
                        header: "yl_system_dashboard",
                    },
                },
            ]
        },
        {
            path: "/login",
            name: "login",
            component: ZyyLogin,
            meta: {
                title: 'yl_system_login'
            },
        },
        // 独立政策页：公开可访问，供第三方品牌注册 / 应用审核直链
        {
            path: "/terms",
            name: "policyTerms",
            component: WebPolicy,
            meta: {
                title: 'policy.terms_title'
            },
            props: {docType: 'terms'},
        },
        {
            path: "/privacy",
            name: "policyPrivacy",
            component: WebPolicy,
            meta: {
                title: 'policy.privacy_title'
            },
            props: {docType: 'privacy'},
        },
        {
            path: "/404",
            name: '404',
            component: NotFound
        },
        {
            path: "/401",
            name: '401',
            component: NoLogin
        },
        {
            path: "/403",
            name: '403',
            component: NoAuth
        },
        {
            path: "/auth",
            name: 'mainAuth',
            children: [
                {
                    path: "google/callback",
                    name: "authGoogleCallback",
                    component: WebAuthLogin,
                    meta: {
                        title: 'Auth Callback ',
                    },
                    props: ($route) => ({
                        code: $route.query.code,
                        brand: 'google',
                    }),
                },
                {
                    path: "github/callback",
                    name: "authGithubCallback",
                    component: WebAuthLogin,
                    meta: {
                        title: 'Auth Callback',
                    },
                    props: ($route) => ({
                        code: $route.query.code,
                        brand: 'github',
                    }),
                },
            ]
        },
        {
            path: "/:catchAll(.*)",
            name: "notFound",
            component: NotFound
        },
    ],
});

const parentRouteMap = {
    // user 子模块 -> subsystemMain
    'userUser': 'subsystemMain',
    'userRole': 'subsystemMain',
    'userPermission': 'subsystemMain',
    'userStore': 'subsystemMain',
    'userTenant': 'subsystemMain',

    'staffStaff': 'subsystemMain',
    'staffSkill': 'subsystemMain',

    'bookBooking': 'subsystemMain',
    'bookCalendar': 'subsystemMain',
    'bookEmail': 'subsystemMain',

    // subsystem -> subsystemMain
    'order': 'subsystemMain',
    'bill': 'subsystemMain',
    'page': 'subsystemMain',
    'agent': 'subsystemMain',
    'staff': 'subsystemMain',
    'user': 'subsystemMain',
}

export function toParentPage(thisRouter) {
    const currentName = thisRouter.currentRoute.value.name
    const parentName = parentRouteMap[currentName]

    if (parentName) {
        thisRouter.push({name: parentName})
    }
}

// 在目标路由的父级下找到第一个有权限访问的兄弟页面（用于默认重定向落到无权页面时兜底）
function findPermittedSibling(to, store) {
    const matched = to.matched
    const parent = matched.length >= 2 ? matched[matched.length - 2] : null
    if (!parent || !parent.children) {
        return null
    }
    for (const child of parent.children) {
        if (!child.name || child.name === to.name) {
            continue
        }
        const childPermission = child.meta ? child.meta.permission : null
        if (store.hasPermission(childPermission)) {
            return child.name
        }
    }
    return null
}

router.beforeEach((to, from) => {
    if (to.meta.title) {
        document.title = i18n.global.t(to.meta.title)
    }

    // 页面级权限校验：仅在已登录（存在用户数据）时拦截，未登录交由请求拦截器/登录流程处理
    const store = useGlobalStateStore()
    const permission = to.meta.permission
    if (permission && store.userData && !store.hasPermission(permission)) {
        const fallback = findPermittedSibling(to, store)
        if (fallback) {
            return {name: fallback}
        }
        return {name: '403'}
    }
})

router.afterEach(() => {
    // make sure scroller site right for header style
    window.scrollTo(0, 0)
})


export function backToHome(thisRouter) {
    thisRouter.push({
        name: "main"
    })
}

export function backToLogin(thisRouter) {
    thisRouter.push({
        name: "login"
    })
}

export function toSpecifyPage(thisRouter, pageName) {
    thisRouter.push({
        name: pageName
    })
}

export function toSpecifyPageWithQuery(thisRouter, pageName, queryMap) {
    thisRouter.push({
        name: pageName,
        query: queryMap,
    })
}

export function toSpecifyPageWithState(thisRouter, pageName, state) {
    thisRouter.push({
        name: pageName,
        state: state,
    })
}

export function toSpecifyPageWithQueryNewTab(thisRouter, pageName, queryMap) {
    const {href} = thisRouter.resolve({name: pageName, query: queryMap});
    const absoluteUrl = `${window.location.origin}${href}`;
    window.open(absoluteUrl, '_blank');
}

export function toReplacePage(thisRouter, queryMap) {
    thisRouter.replace({
        name: thisRouter.name,
        query: queryMap,
    })
}

export function toBack(thisRouter) {
    thisRouter.go(-1)
}

export default router;

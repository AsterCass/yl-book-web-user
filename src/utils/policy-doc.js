import {marked} from "marked";

// 政策文档（public/doc 下的静态 Markdown）加载与渲染，供弹窗与独立页面共用。
// 解析结果按类型缓存，重复打开/访问不再拉取

const DOC_URLS = {
    privacy: '/doc/privacy-policy.md',
    terms: '/doc/terms-of-service.md',
}

const docCache = {}

// 返回渲染后的 HTML；失败抛异常由调用方提示
export async function loadPolicyDoc(docType) {
    if (docCache[docType]) {
        return docCache[docType]
    }
    const resp = await fetch(DOC_URLS[docType] || DOC_URLS.privacy)
    if (!resp.ok) {
        throw new Error(`load doc failed: ${resp.status}`)
    }
    const text = await resp.text()
    docCache[docType] = marked.parse(text)
    return docCache[docType]
}

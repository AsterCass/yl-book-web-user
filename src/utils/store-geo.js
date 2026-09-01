import {HOME_STORES} from "@/constants/home-content.js";

// 「按定位自动选最近门店」的纯前端实现。
//
// 门店坐标来自 constants/home-content.js（手工维护，见那里的 lat/lng 注释）——后端 /portal/booking/stores
// 只返回 id/名称/地址/电话/时区，没有经纬度，也不打算为此加字段。
// 后端门店 id（YLS...）与前端常量 id（manhattan/brooklyn）是两套，因此按【地址】匹配：
// 取「门牌号 + 街道首词」（如 196 hester）作 key，两边写法差异（St. / St、有无邮编）不影响。
//
// 任何一步失败（不支持定位 / 用户拒绝 / 超时 / 匹配不上 / 距离过远）都只是拿不到结果，
// 调用方按原有逻辑让用户自己选门店即可。

// 超过这个距离就不自动选：用户不在本市（外地、VPN）时，「最近」也没有推荐意义
export const MAX_AUTO_PICK_KM = 50

const GEO_OPTIONS = {
    // 就近推荐不需要 GPS 级精度，街区级足够：省电、出结果快
    enableHighAccuracy: false,
    timeout: 8000,
    // 10 分钟内的缓存位置直接用，避免同一会话反复唤醒定位
    maximumAge: 10 * 60 * 1000,
}

/**
 * 地址归一化为匹配 key：「门牌号 + 街道首词」，小写、去标点。
 * 匹配不出（无门牌号等）返回空串，调用方视为无坐标。
 */
function addressKey(address) {
    const cleaned = (address || '').toLowerCase().replace(/[.,]/g, ' ')
    const matched = cleaned.match(/(\d+)\s+([a-z]+)/)
    return matched ? `${matched[1]} ${matched[2]}` : ''
}

/**
 * 按地址找门店坐标；找不到返回 null（该店不参与自动选择）。
 */
export function findStoreGeo(address) {
    const key = addressKey(address)
    if (!key) {
        return null
    }
    const hit = HOME_STORES.find(s => s.lat != null && s.lng != null && addressKey(s.address) === key)
    return hit ? {lat: hit.lat, lng: hit.lng} : null
}

/**
 * 两点球面距离（km，Haversine）。
 */
export function distanceKm(lat1, lng1, lat2, lng2) {
    const toRad = deg => deg * Math.PI / 180
    const earthRadiusKm = 6371
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a = Math.sin(dLat / 2) ** 2
        + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
    return 2 * earthRadiusKm * Math.asin(Math.sqrt(a))
}

/**
 * 取当前位置。不支持 / 已被拒绝 / 拒绝 / 超时一律 resolve(null)，<b>不抛异常</b>——
 * 调用方不需要写 try/catch，拿到 null 就当没有这回事。
 */
export async function currentPosition() {
    if (!navigator.geolocation) {
        // 非安全上下文（http 局域网 IP）或老浏览器：整个 API 都不存在
        return null
    }
    try {
        // 已经明确拒绝过就不再触发弹窗（Safari 不支持查询该权限名，走 catch 忽略）
        const status = await navigator.permissions.query({name: 'geolocation'})
        if (status && status.state === 'denied') {
            return null
        }
    } catch (e) {
        // 查不到权限状态不影响后续，照常尝试
    }
    return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(
            pos => resolve({lat: pos.coords.latitude, lng: pos.coords.longitude}),
            () => resolve(null),
            GEO_OPTIONS,
        )
    })
}

/**
 * 在门店列表里挑距离最近的一家。
 *
 * @param stores 后端 /portal/booking/stores 的返回（需含 address）
 * @param pos    {lat, lng}
 * @return {{store, km}} 或 null（没有任何门店有坐标 / 最近的也超过 {@link MAX_AUTO_PICK_KM}）
 */
export function nearestStore(stores, pos) {
    if (!pos || !stores || !stores.length) {
        return null
    }
    let best = null
    for (const store of stores) {
        const geo = findStoreGeo(store.address)
        if (!geo) {
            continue
        }
        const km = distanceKm(pos.lat, pos.lng, geo.lat, geo.lng)
        if (!best || km < best.km) {
            best = {store, km}
        }
    }
    return best && best.km <= MAX_AUTO_PICK_KM ? best : null
}

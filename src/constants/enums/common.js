export class Enum {
    constructor(enumMap) {
        this.enumMap = new Map();
        this.codeMap = new Map();

        for (const [key, value] of Object.entries(enumMap)) {
            this[key] = value;
            this.enumMap.set(key, value);
            this.codeMap.set(value.code, {key, ...value});
        }
    }

    fromCode(code) {
        return this.codeMap.get(code);
    }

    fromCodeToSelectFrom(code) {
        const thisEnum = this.codeMap.get(code);
        return {
            label: thisEnum.name,
            value: thisEnum.code
        };
    }

    getAll() {
        return Array.from(this.enumMap.values());
    }

    toSelectForm() {
        return Array.from(this.enumMap.values()).map(item => ({
            label: item.name,
            value: item.code
        }));
    }
}

// 门店时区映射：code 为后端 /portal/booking/stores 返回的 IANA 时区标识（与管理端建店时区枚举一致）。
// 客户端需多语言，故 name 存 i18n key（用 t(name) 渲染）；
// 展示时若遇到枚举外的 IANA id，调用方应回退展示原始 id（见 ZyyBookingCreateCard.storeTimezoneName）
export const TimezoneOptEnum = new Enum({
    SHANGHAI: {code: 'Asia/Shanghai', name: 'timezone.shanghai', desc: '中国标准时间 UTC+8', color: ''},
    NEW_YORK: {code: 'America/New_York', name: 'timezone.new_york', desc: '美东时间（含夏令时）', color: ''},
    CALIFORNIA: {code: 'America/Los_Angeles', name: 'timezone.california', desc: '美西/太平洋时间（含夏令时）', color: ''},
});

export const CommonStatusEnum = new Enum({
    NORMAL: {code: 0, name: '正常', desc: '', color: 'rgb(68, 117, 80)'},
    DISABLE: {code: 1, name: '禁用', desc: '', color: 'rgb(200, 60, 60)'},
    LOCKED: {code: 2, name: '锁定', desc: '', color: 'rgb(245, 166, 35)'}
});


export const GenderOptEnum = new Enum({
    FEMALE: {
        code: 0, name: '女', color: 'pink-7', desc: ''
    }, MALE: {
        code: 1, name: '男', color: 'blue-7', desc: ''
    }, LESBIAN: {
        code: 2, name: '女同性恋', color: 'deep-purple-7', desc: ''
    }, GAY: {
        code: 3, name: '男同性恋', color: 'green-7', desc: ''
    }, BISEXUAL: {
        code: 4, name: '双性恋', color: 'purple-7', desc: ''
    }, TRANSGENDER: {
        code: 5, name: '跨性别', color: 'light-green-7', desc: ''
    }, QUEER: {
        code: 6, name: '酷儿', color: 'teal-7', desc: ''
    }, HELICOPTER: {
        code: 7, name: '武装直升飞机', color: 'grey-10', desc: ''
    }, WALMART_BAG: {
        code: 8, name: '沃尔玛购物袋', color: 'blue-grey-7', desc: ''
    }
});




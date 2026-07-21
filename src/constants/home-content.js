// 官网首页（落地页）展示内容配置。
// 门店与服务均为静态展示文案（实际可约项目/价格以门店与预约流程为准）。
// 新增门店：在 HOME_STORES 追加一个条目即可；可本地化字段统一用 {zh, en} 结构，
// 由页面按当前语言取值（见 WebHome.vue 的 lv()）。

export const HOME_STORES = [
    {
        id: 'manhattan',
        name: {zh: '曼哈顿店（唐人街）', en: 'Manhattan · Chinatown'},
        address: '196 Hester St., New York, NY 10013',
        phone: '(646) 208-7397',
        hours: {zh: '周一至周日 10:00 – 22:00', en: 'Mon – Sun, 10:00 am – 10:00 pm'},
        insurance: 'Aetna, United Healthcare, BlueCross BlueShield',
        notes: {zh: '每周三会员日：修脚类服务立减 32%', en: 'Member Day every Wednesday: 32% off foot care services'},
    },
    {
        id: 'brooklyn',
        name: {zh: '布鲁克林店', en: 'Brooklyn'},
        address: '189 Court St., Brooklyn, NY 11201',
        phone: '(718) 400-9189',
        hours: {zh: '周一至周日 10:00 – 22:00', en: 'Mon – Sun, 10:00 am – 10:00 pm'},
        insurance: 'Aetna, United Healthcare, BlueCross BlueShield',
        notes: {zh: '每周三会员日：修脚类服务立减 32%', en: 'Member Day every Wednesday: 32% off foot care services'},
    },
]

// 服务项目（按类别分组），价格/时长为参考价目
export const HOME_SERVICE_GROUPS = [
    {
        id: 'footTherapy',
        icon: 'fa-solid fa-spa',
        title: {zh: '足浴足疗', en: 'Foot Therapy'},
        items: [
            {name: {zh: '经典足疗', en: 'Classic Foot Massage'}, price: '$50', minutes: 60},
            {name: {zh: '草本足浴', en: 'Herbal Foot Therapy'}, price: '$60', minutes: 60},
            {name: {zh: '牛奶足浴', en: 'Milk Foot Therapy'}, price: '$60', minutes: 60},
            {name: {zh: '海盐排毒足浴', en: 'Salt Detox Foot Therapy'}, price: '$60', minutes: 60},
            {name: {zh: '生姜足浴', en: 'Ginger Foot Therapy'}, price: '$60', minutes: 60},
            {name: {zh: '尊享足疗', en: 'Premium Foot Therapy'}, price: '$80', minutes: 70},
        ],
    },
    {
        id: 'footCare',
        icon: 'fa-solid fa-shoe-prints',
        title: {zh: '修脚', en: 'Foot Care'},
        items: [
            {name: {zh: '修脚', en: 'Foot Care'}, price: '$35', minutes: 30},
        ],
    },
    {
        id: 'body',
        icon: 'fa-solid fa-hands',
        title: {zh: '全身按摩', en: 'Body Massage'},
        items: [
            {name: {zh: '舒缓全身按摩', en: 'Relaxation Body Massage'}, price: '$60', minutes: 60},
            {name: {zh: '深层组织按摩', en: 'Deep Tissue Massage'}, price: '$70', minutes: 60},
            {name: {zh: '足疗 + 全身按摩组合', en: 'Foot + Body Combo Massage'}, price: '$90', minutes: 90},
        ],
    },
    {
        id: 'acupuncture',
        icon: 'fa-solid fa-hand-dots',
        title: {zh: '针灸理疗', en: 'Acupuncture Therapy'},
        items: [
            {name: {zh: '初诊咨询 + 治疗', en: 'Initial Consultation + Treatment'}, price: '$138', minutes: 75},
            {name: {zh: '复诊针灸', en: 'Follow-up Acupuncture'}, price: '$108', minutes: 60},
            {name: {zh: '疼痛管理针灸', en: 'Pain Management Acupuncture'}, price: '$128', minutes: 60},
            {name: {zh: '减压助眠疗法', en: 'Stress & Sleep Therapy'}, price: '$128', minutes: 60},
            {name: {zh: '招牌荷尔蒙平衡疗法', en: 'Signature Hormone Balance Therapy'}, price: '$150', minutes: 60},
        ],
    },
    {
        id: 'facial',
        icon: 'fa-solid fa-wand-magic-sparkles',
        title: {zh: '面部焕活', en: 'Facial Rejuvenation'},
        items: [
            {name: {zh: '面部针灸提升', en: 'Facial Acupuncture Lift'}, price: '$158', minutes: 60},
            {name: {zh: '面部刮痧与穴位按摩', en: 'Facial Gua Sha & Acupressure'}, price: '$128', minutes: 60},
            {name: {zh: '抗衰老招牌护理', en: 'Anti-Aging Signature Treatment'}, price: '$188', minutes: 75},
            {name: {zh: '淋巴排毒', en: 'Lymphatic Detox'}, price: '$128', minutes: 60},
            {name: {zh: '艾灸疗法', en: 'Moxibustion Therapy'}, price: '$68', minutes: 45},
        ],
    },
]

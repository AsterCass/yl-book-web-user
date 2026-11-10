// 官网首页（落地页）展示内容配置。
// 门店与服务均为静态展示文案（实际可约项目/价格以门店与预约流程为准）。
// 新增门店：在 HOME_STORES 追加一个条目即可；可本地化字段统一用 {zh, en} 结构，
// 由页面按当前语言取值（见 WebHome.vue 的 lv()）。
//
// ⚠️ 新增门店记得补 lat/lng：预约区「点 Book now 时按定位自动选最近门店」靠它算距离
// （见 utils/store-geo.js）。不填 = 该店不参与自动选择，其余功能不受影响。
//
// 门店专属页（2026-11-10）：首页与 /google 带 ?store=<门店 id>（如 ?store=sanjose，不分大小写）时，按该店的
// hero / about / gallery 展示；不带参数、id 不认识、或该店没配对应项，一律用默认内容（即不带参数时的页面）。
//   - hero：页面最上方大图（Hero 底图）。全屏背景、按 cover 铺满（裁掉超出部分），上面压着半透明暗色遮罩。
//     不配 = 默认的 /img/promo/promo-hero.webp。宽度尽量不低于 1600，压成 webp。
//   - about：About Us 左边的图 + 正文（subtitle 可选，paragraphs 每段 {zh, en}）。桌面端图片与右侧文字等高
//     （比例对不上时居中裁掉两侧），手机上按原始比例。标题「About Us」不随门店变。不配 = 沿用默认的图和三段默认文案。
//   - gallery：「门店实景」模块的图片列表，放 About Us 正下方、单独深色底，一行排开，超出内容区宽度就在内容区里
//     自动循环滚动。空 / 不配 = 不显示这个模块。
//   图片放 public/img/promo/stores/<门店 id>/，上传前压缩（About 图宽 1200、实景图宽 960 足够）。
//   这个参数只影响展示：预约区不会因此自动选中该店（两家店离得近，替顾客选容易约错）。

// 对外品牌名（须与 Google OAuth 同意屏幕配置的应用名称完全一致，勿加后缀；
// 各语言页面均原样展示该拉丁名，品牌审核按此核对）
export const BRAND_NAME = 'Zhengyuanyuan Foot Spa'

export const HOME_STORES = [
    {
        id: 'manhattan',
        name: {zh: '曼哈顿店（唐人街）', en: 'Manhattan · Chinatown'},
        address: '196 Hester St., New York, NY 10013',
        // 就近推荐用坐标（按地址粗填，精度到街区即可——两店相距约 4 km，不影响判断；请核对后修正）
        lat: 40.7176,
        lng: -73.9967,
        // 谷歌商家分享链接（可空）：配置后门店地址可点击、新标签页打开；未配置则地址为纯文本、无点击交互
        mapUrl: 'https://share.google/gNwyFF37aPQR2Wpka',
        phone: '(646) 371-9686',
        hours: {zh: '周一至周日 10:00 – 22:00', en: 'Mon – Sun, 10:00 AM – 10:00 PM'},
        insurance: 'Aetna, United Healthcare, BlueCross BlueShield',
        notes: {zh: '每周三会员日：修脚类服务立减 32%', en: 'Member Day every Wednesday: 32% off foot care services'},
    },
    {
        id: 'brooklyn',
        name: {zh: '布鲁克林店', en: 'Brooklyn'},
        address: '189 Court St., Brooklyn, NY 11201',
        // 同上，按地址粗填待核对
        lat: 40.6861,
        lng: -73.9943,
        mapUrl: 'https://g.co/kgs/UbrEGJD',
        phone: '(718) 790-2445',
        hours: {zh: '周一至周日 10:00 – 22:00', en: 'Mon – Sun, 10:00 AM – 10:00 PM'},
        insurance: 'Aetna, United Healthcare, BlueCross BlueShield',
        notes: {zh: '每周三会员日：修脚类服务立减 32%', en: 'Member Day every Wednesday: 32% off foot care services'},
    },
    {
        id: 'sanjose',
        name: {zh: '圣何塞店', en: 'San Jose · Massage Zen'},
        address: '5353 Almaden Expy, A-120, San Jose, CA 95118',
        phone: '(408) 444-9183',
        hours: {zh: '周一至周日 10:00 – 22:00', en: 'Mon – Sun, 10:00 AM – 10:00 PM'},
        notes: {zh: '每周二会员日：按摩类服务立减 30%', en: 'Member Day every Tuesday: 30% off body massage services'},
        about: {
            image: '/img/promo/stores/sanjose/0.jpg',
            subtitle: {zh: 'Massage Zen (ZYY Spa) · 圣何塞', en: 'Massage Zen (ZYY Spa) · San Jose'},
            paragraphs: [
                {
                    zh: '郑远元（ZYY）是来自中国的养生品牌，在全球已有九千多家门店。我们的圣何塞门店 Massage Zen (ZYY Spa) 位于 '
                        + 'Almaden Plaza，靠近 Costco，是一个安静、干净的放松空间，设有私密房间和双人房。',
                    en: 'ZYY Spa (Zhengyuanyuan) is a wellness brand from China with more than 9,000 stores worldwide. '
                        + 'Our San Jose studio, Massage Zen (ZYY Spa), brings that craft to Almaden Plaza, near Costco: '
                        + 'a calm, clean place to unwind, with private rooms and couples rooms.',
                },
                {
                    zh: '店里经验丰富的理疗师提供热石精油按摩、深层按摩、颈肩按摩、踩背按摩、指压按摩和磨砂按摩。我们还提供头疗，'
                        + '每位客人都免费做头皮检测；美容项目包括水氧深层清洁、LED 光疗、纳米胶原导入、24K 黄金焕颜和干细胞焕肤等。'
                        + '我们每天 10:00–22:00 营业，地址：5353 Almaden Expy, A-120, San Jose, CA 95118。'
                        + '节假日营业时间不固定，请致电 (408) 444-9183 确认。会员办理请咨询前台。',
                    en: 'Our experienced therapists offer hot stone and essential oil massage, deep tissue, neck and shoulder, '
                        + 'walk-on-back, shiatsu and sugar scrub body treatments. We also offer a relaxing head spa with a free '
                        + 'scalp analysis for every guest, and professional facials including hydrafacial deep cleansing, LED '
                        + 'light therapy, nano collagen infusion, 24K gold and stem cell regeneration. We are open every day '
                        + 'from 10 AM to 10 PM at 5353 Almaden Expy, A-120, San Jose, CA 95118. Holiday hours vary, so please '
                        + 'call (408) 444-9183 to confirm. Ask our front desk about our membership program.',
                },
            ],
        },
        hero: '/img/promo/stores/sanjose/main.webp',
        gallery: [1, 2, 3, 4, 5, 6].map(n => `/img/promo/stores/sanjose/${n}.jpg`),
    },
]

// 顾客评价（推广页展示；来自品牌官网既有评价，t3 已去掉具体门店地名以兼容多门店）
export const HOME_TESTIMONIALS = [
    {
        id: 't1',
        text: {
            zh: '真正出色的按摩店。环境干净、令人放松，他们还会认真处理你的特定不适与痛点。是我在纽约最喜欢的按摩！',
            en: 'Truly an EXCEPTIONAL massage place. So clean, so relaxing and they do a great job addressing specific concerns/pain points. Favorite massage in NYC!',
        },
        author: 'Helena M.',
        stars: 5,
    },
    {
        id: 't2',
        text: {
            zh: '在干净的水疗店里享受超放松的按摩，价格也很棒！他们还提供热敷眼罩，我很快就睡着了。',
            en: 'Super relaxing massage in a clean massage spa at great prices! They even give you a warm eye mask, I promptly fell asleep.',
        },
        author: 'Tiffany T.',
        stars: 5,
    },
    {
        id: 't3',
        text: {
            zh: '终于！不用再特意跑远，也能以唐人街的价格享受一流按摩。我父母在中国常去人气很高的郑远元连锁，特意推荐我来体验他们的新门店。',
            en: "Finally! A great massage at Chinatown prices. My parents frequent the popular Zhengyuanyuan chain in China and recommended that I check out their new location.",
        },
        author: 'Ann Li.',
        stars: 5,
    },
    {
        id: 't4',
        text: {
            zh: '开业约一个月后我把这里推荐给了另一半，此后她每周都来……据她说全身按摩非常放松。很棒的地方，超级满意！',
            en: 'I put my significant other on to this place about a month after they opened and she has been going every week ever since…her massages are full body and relaxing according to her. Great place super satisfied!',
        },
        author: 'Patrick P.',
        stars: 5,
    },
    // t5 / t6：圣何塞店 Google 商家页的评价（2026-11-10），点名的 Lulu、Eva 是该店技师；按要求所有页面都展示
    {
        id: 't5',
        text: {
            zh: 'Lulu 的手法太棒了！她非常亲切、专业，很清楚该怎么处理我不舒服的部位。做完整个人彻底放松、神清气爽，'
                + '下次一定还约她！',
            en: "Lulu did an incredible job! She was very kind, professional, and knew exactly how to work on my "
                + "problem areas. I left feeling completely relaxed and refreshed. I'll definitely be booking with her again!",
        },
        author: 'Sijin W.',
        stars: 5,
    },
    {
        id: 't6',
        text: {
            zh: '今天第一次来，Eva 给我做的按摩力道十足。我约的是颈部 / 头皮 / 上半身按摩，体验非常好。'
                + '员工很友善，环境干净又温馨。',
            en: 'Came here for the first time today and got a really strong massage from Eva. I signed up for the '
                + 'neck / scalp / upper body massage and loved the experience. Friendly staff and clean and welcoming '
                + 'environment too.',
        },
        author: 'Maitreyee',
        stars: 5,
    },
]

// 服务项目（按类别分组）：展示所有门店服务的全集，不含价格/时长；
// 具体门店可约项目、价格与时长由顾客进入门店预约流程时查看。desc 为服务简介
export const HOME_SERVICE_GROUPS = [
    {
        id: 'footTherapy',
        icon: 'fa-solid fa-spa',
        title: {zh: '足浴足疗', en: 'Foot Therapy'},
        items: [
            {
                name: {zh: '经典足疗', en: 'Classic Foot Massage'},
                desc: {
                    zh: '温水泡脚后按足底反射区推拿，缓解疲劳、促进循环。',
                    en: 'A warm foot soak followed by reflexology on the soles to ease fatigue and boost circulation.',
                },
            },
            {
                name: {zh: '草本足浴', en: 'Herbal Foot Therapy'},
                desc: {
                    zh: '中草药汤剂泡脚配合足部按摩，温经散寒、舒缓身心。',
                    en: 'A Chinese herbal soak with foot massage to warm the body and calm the mind.',
                },
            },
            {
                name: {zh: '牛奶足浴', en: 'Milk Foot Therapy'},
                desc: {
                    zh: '牛奶泡脚配合足部按摩，滋润软化足部肌肤。',
                    en: 'A milk soak with foot massage that softens and moisturizes the skin of the feet.',
                },
            },
            {
                name: {zh: '海盐排毒足浴', en: 'Salt Detox Foot Therapy'},
                desc: {
                    zh: '海盐泡脚配合足部按摩，清洁足部、帮助消除疲劳。',
                    en: 'A sea salt soak with foot massage to cleanse the feet and help relieve fatigue.',
                },
            },
            {
                name: {zh: '生姜足浴', en: 'Ginger Foot Therapy'},
                desc: {
                    zh: '生姜泡脚配合足部按摩，驱寒暖身、促进血液循环。',
                    en: 'A ginger soak with foot massage to dispel chill, warm the body and promote circulation.',
                },
            },
            {
                name: {zh: '尊享足疗', en: 'Premium Foot Therapy'},
                desc: {
                    zh: '升级足浴加更长时长的足部与腿部按摩，全面放松。',
                    en: 'An upgraded soak with extended foot and leg massage for full relaxation.',
                },
            },
        ],
    },
    {
        id: 'footCare',
        icon: 'fa-solid fa-shoe-prints',
        title: {zh: '修脚', en: 'Foot Care'},
        items: [
            {
                name: {zh: '修脚', en: 'Foot Care'},
                desc: {
                    zh: '中式药浴修脚：专业技师修剪趾甲、去除老茧死皮，呵护足部健康。',
                    en: 'Chinese medicinal pedicure: skilled technicians trim nails and remove calluses and dead skin for healthy feet.',
                },
            },
        ],
    },
    {
        id: 'body',
        icon: 'fa-solid fa-hands',
        title: {zh: '全身按摩', en: 'Body Massage'},
        items: [
            {
                name: {zh: '舒缓全身按摩', en: 'Relaxation Body Massage'},
                desc: {
                    zh: '中等力度的全身推拿，舒缓压力、放松身心。',
                    en: 'A full-body massage with medium pressure to relieve stress and relax body and mind.',
                },
            },
            {
                name: {zh: '深层组织按摩', en: 'Deep Tissue Massage'},
                desc: {
                    zh: '缓解肌肉紧张 · 改善酸痛 · 深层放松',
                    en: 'Relieves muscle tension · Eases soreness · Deep relaxation',
                },
            },
            {
                name: {zh: '热石精油按摩', en: 'Hot Stone & Essential Oil Massage'},
                desc: {
                    zh: '放松肌肉 · 促进血液循环 · 缓解疲劳',
                    en: 'Relaxes muscles · Promotes circulation · Relieves fatigue',
                },
            },
            {
                name: {zh: '颈肩按摩', en: 'Neck & Shoulder Massage'},
                desc: {
                    zh: '缓解肩颈酸痛 · 放松肌肉 · 改善疲劳',
                    en: 'Relieves neck and shoulder pain · Relaxes muscles · Eases fatigue',
                },
            },
            {
                name: {zh: '踩背按摩', en: 'Walk-on-Back Massage'},
                desc: {
                    zh: '深层放松 · 疏通经络 · 缓解身体疲劳',
                    en: 'Deep relaxation · Unblocks meridians · Relieves body fatigue',
                },
            },
            {
                name: {zh: '去角质按摩（磨砂）', en: 'Dead Skin Removal Massage (Sugar Scrub)'},
                desc: {
                    zh: '去除老废角质 · 改善肌肤质感 · 使肌肤更光滑',
                    en: 'Removes dead skin · Refines skin texture · Leaves skin smoother',
                },
            },
            {
                name: {zh: '日式指压按摩', en: 'Shiatsu Massage'},
                desc: {
                    zh: '舒缓酸痛 · 放松身心 · 促进血液循环',
                    en: 'Soothes soreness · Relaxes body and mind · Promotes circulation',
                },
            },
        ],
    },
    {
        id: 'headSpa',
        icon: 'fa-solid fa-shower',
        title: {zh: '头疗', en: 'Head Spa'},
        items: [
            {
                name: {zh: '头皮深层护理', en: 'Deluxe Scalp Treatment'},
                desc: {
                    zh: '通过专业头皮检测、深层清洁、瀑布式冲洗、头发护理、蒸汽护理以及舒缓的头皮按摩，让您全面放松、焕活头皮与秀发。',
                    en: 'Experience the ultimate head spa with advanced scalp analysis, deep scalp purifying, waterfall cleansing, hair conditioning, steaming treatment, and a revitalizing scalp massage for total relaxation and care.',
                },
            },
            {
                name: {zh: '四步奢华头发护理', en: 'Premium 4-Step Hair Treatment'},
                desc: {
                    zh: '采用四步专业护理，深层滋养、补水修护，并形成保护膜，让秀发更加柔顺亮泽，恢复健康光彩。',
                    en: 'Indulge in our premium head spa experience with a signature 4-step treatment to smooth, hydrate, and apply a protective top coat, leaving your hair silky smooth with a healthy, radiant shine.',
                },
            },
        ],
    },
    {
        id: 'acupuncture',
        icon: 'fa-solid fa-hand-dots',
        title: {zh: '针灸理疗', en: 'Acupuncture Therapy'},
        items: [
            {
                name: {zh: '初诊咨询 + 治疗', en: 'Initial Consultation + Treatment'},
                desc: {
                    zh: '首次到访先进行问诊评估，再制定并实施个性化针灸方案。',
                    en: 'A first-visit assessment followed by a personalized acupuncture treatment plan.',
                },
            },
            {
                name: {zh: '复诊针灸', en: 'Follow-up Acupuncture'},
                desc: {
                    zh: '根据上次疗程的反馈调整穴位，持续巩固调理效果。',
                    en: 'Points are adjusted based on your progress to continue and reinforce your treatment.',
                },
            },
            {
                name: {zh: '疼痛管理针灸', en: 'Pain Management Acupuncture'},
                desc: {
                    zh: '针对颈肩腰背、关节等部位的慢性酸痛进行针灸调理。',
                    en: 'Acupuncture targeting chronic aches in the neck, shoulders, back and joints.',
                },
            },
            {
                name: {zh: '减压助眠疗法', en: 'Stress & Sleep Therapy'},
                desc: {
                    zh: '以安神穴位为主的针灸调理，帮助舒缓压力、改善睡眠。',
                    en: 'Acupuncture on calming points to help ease stress and improve sleep.',
                },
            },
            {
                name: {zh: '招牌荷尔蒙平衡疗法', en: 'Signature Hormone Balance Therapy'},
                desc: {
                    zh: '基于中医调和阴阳、调理肝肾的理念，以针灸调理身体内在平衡。',
                    en: 'Rooted in the TCM approach of balancing yin and yang and supporting the liver and kidneys, this acupuncture helps restore inner balance.',
                },
            },
        ],
    },
    {
        id: 'facial',
        icon: 'fa-solid fa-wand-magic-sparkles',
        title: {zh: '面部焕活', en: 'Facial Rejuvenation'},
        items: [
            {
                name: {zh: '面部针灸提升', en: 'Facial Acupuncture Lift'},
                desc: {
                    zh: '在面部穴位施以细针，促进面部气血运行，令肌肤紧致有光泽。',
                    en: 'Fine needles on facial points boost circulation for firmer, more radiant skin.',
                },
            },
            {
                name: {zh: '面部刮痧与穴位按摩', en: 'Facial Gua Sha & Acupressure'},
                desc: {
                    zh: '以刮痧板疏通面部经络并配合穴位按压，消除浮肿、提亮气色。',
                    en: 'Gua sha and acupressure release facial tension, reduce puffiness and brighten the complexion.',
                },
            },
            {
                name: {zh: '抗衰老招牌护理', en: 'Anti-Aging Signature Treatment'},
                desc: {
                    zh: '融合针灸、刮痧与按摩手法的综合面部护理，帮助淡化细纹、紧致轮廓。',
                    en: 'A combined facial of acupuncture, gua sha and massage to soften fine lines and firm facial contours.',
                },
            },
            {
                name: {zh: '淋巴排毒', en: 'Lymphatic Detox'},
                desc: {
                    zh: '轻柔的淋巴引流手法，帮助消除浮肿、促进代谢。',
                    en: 'Gentle lymphatic drainage to reduce puffiness and support circulation.',
                },
            },
            {
                name: {zh: '艾灸疗法', en: 'Moxibustion Therapy'},
                desc: {
                    zh: '点燃艾草温熏穴位，温通经络、驱寒暖身。',
                    en: 'Burning mugwort warms key points to unblock meridians and dispel cold.',
                },
            },
            {
                name: {zh: '玻尿酸氧气保湿护理', en: 'Oxygen Infusion Hyaluronic Acid'},
                desc: {
                    zh: '以加压氧气将玻尿酸精华导入肌肤，深层补水，令肌肤饱满水润。',
                    en: 'Pressurized oxygen infuses hyaluronic acid serum into the skin for deep hydration and a plump, dewy look.',
                },
            },
            {
                name: {zh: 'LED 光疗祛痘 / 亮肤护理', en: 'LED Light Therapy - Acne / Brightening'},
                desc: {
                    zh: '以不同波长的 LED 光照射肌肤，帮助舒缓痘痘肌、提亮肤色。',
                    en: 'LED light at different wavelengths helps calm acne-prone skin and brighten the complexion.',
                },
            },
            {
                name: {zh: '水氧深层清洁护理', en: 'Hydra Facial Deep Cleansing'},
                desc: {
                    zh: '水氧仪深层清洁毛孔、去除角质与油脂，同时为肌肤补水。',
                    en: 'Hydra-dermabrasion deep cleans pores, lifts away dead skin and oil, and hydrates at the same time.',
                },
            },
            {
                name: {zh: '纳米胶原蛋白导入护理', en: 'Nano Infusion Collagen Therapy'},
                desc: {
                    zh: '无针纳米导入技术在肌肤表层打开微通道，让胶原蛋白精华更好地吸收。',
                    en: 'Needle-free nano infusion opens micro-channels in the skin surface so collagen serum absorbs better.',
                },
            },
            {
                name: {zh: '24K 黄金焕颜护理', en: '24K Gold Youth Facial'},
                desc: {
                    zh: '24K 金箔面膜配合精华导入与按摩，提亮肤色、焕发光泽。',
                    en: 'A 24K gold leaf mask with serum infusion and massage for a brighter, glowing complexion.',
                },
            },
            {
                name: {zh: '干细胞焕肤护理', en: 'Stem Cell Regeneration Facial'},
                desc: {
                    zh: '以植物干细胞精华配合仪器导入，滋养修护，令肌肤柔嫩焕亮。',
                    en: 'Plant stem cell serum infused with professional devices nourishes and renews the skin for a soft, radiant look.',
                },
            },
        ],
    },
]

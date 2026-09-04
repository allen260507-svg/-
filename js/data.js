// 家庭研学中枢 - 真实真题与词库核心数据模块
window.StudyData = {
  // 学生初始档案
  defaultStudents: [
    { id: 'nuo', name: '诺', grade: '小学5年级', points: 8, avatar: '🐱', pin: '1234', totalStudyMinutes: 35 },
    { id: 'wei', name: '威', grade: '小学4年级', points: 24, avatar: '🦁', pin: '1234', totalStudyMinutes: 68 },
    { id: 'yi',  name: '奕', grade: '小学2年级', points: 15, avatar: '🐼', pin: '1234', totalStudyMinutes: 42 },
    { id: 'dai', name: '黛', grade: '小学6年级', points: 42, avatar: '🔭', pin: '1234', totalStudyMinutes: 110 }
  ],

  // 权威 13 项研学任务
  baseTasks: [
    { id: 1, code: '01', category: '第一优先', icon: '🎒', title: '登记并完成学校家庭作业', duration: '35分钟', points: 3, criteria: '逐科要求登记 + 自由选择AI质检' },
    { id: 2, code: '02', category: '语文/阅读', icon: '🔍', title: '每日新闻/名著阅读与真题', duration: '20分钟', points: 3, criteria: '计时≥20分钟 + 真题单选填空判分' },
    { id: 3, code: '03', category: '语文/书法', icon: '✍️', title: '每日练字拍照打卡', duration: '10分钟', points: 2, criteria: '年级10个生字词田字格楷体临摹' },
    { id: 4, code: '04', category: '数学/计算', icon: '⚡', title: '每日10道年级口算', duration: '8分钟', points: 2, criteria: '即时判分 + 错题自动归入错题集' },
    { id: 5, code: '05', category: '数学/思维', icon: '🧩', title: '每日一道年级奥数题', duration: '15分钟', points: 3, criteria: '草稿拍照 + 提示详解 + 懂了举一反三' },
    { id: 6, code: '06', category: '英语/词汇', icon: '🔤', title: '记5个大纲单词', duration: '15分钟', points: 3, criteria: '音标点读 + 词组 + 20秒间隔默写(+3分)' },
    { id: 7, code: '07', category: '英语/口语', icon: '🎙️', title: '今日词汇朗读或自述5句', duration: '6分钟', points: 2, criteria: '跟读今日单词例句 + 录音上传' },
    { id: 8, code: '08', category: '英语/造句', icon: '🌟', title: '每日一句：从结构到表达', duration: '5分钟', points: 2, criteria: '今日核心单词选句 + 句型结构重组' },
    { id: 9, code: '09', category: '英语/翻译', icon: '🧭', title: '每日一句：英译中', duration: '5分钟', points: 2, criteria: '今日核心单词选句 + 提示与参考译文' },
    { id: 10, code: '10', category: '英语/阅读', icon: '📖', title: '年级小阅读理解(串联5词)', duration: '10分钟', points: 2, criteria: '今日词汇串联短文 + 3道阅读选择题' },
    { id: 11, code: '11', category: '英语/完形', icon: '🕵️', title: '每日英语完形填空(串联5词)', duration: '8分钟', points: 2, criteria: '今日词汇语境挖空 + 综合语法选择' },
    { id: 12, code: '12', category: '综合/复盘', icon: '⚔️', title: '当日错题消化与学校错题录入', duration: '15分钟', points: 2, criteria: '消化系统错题 + 支持拍照/敲字录入新错题' },
    { id: 13, code: '13', category: '阅读/习惯', icon: '🏰', title: '整本书伴读与思考', duration: '20分钟', points: 2, criteria: '书名页数 + 计时 + 梗概与明日计划' }
  ],

  // 任务 3：各年级真实大纲生字生词库 (10字左右带拼音田字格)
  gradeWordBank: {
    '低段': [
      { char: '晨', pinyin: 'chén', word: '早晨' }, { char: '霞', pinyin: 'xiá', word: '晚霞' },
      { char: '碧', pinyin: 'bì', word: '碧绿' }, { char: '翠', pinyin: 'cuì', word: '翠竹' },
      { char: '荷', pinyin: 'hé', word: '荷花' }, { char: '清', pinyin: 'qīng', word: '清新' },
      { char: '润', pinyin: 'rùn', word: '滋润' }, { char: '暖', pinyin: 'nuǎn', word: '温暖' },
      { char: '飘', pinyin: 'piāo', word: '飘落' }, { char: '舞', pinyin: 'wǔ', word: '飞舞' }
    ],
    '中段': [
      { char: '雄', pinyin: 'xióng', word: '雄伟' }, { char: '伟', pinyin: 'wěi', word: '丰功伟绩' },
      { char: '博', pinyin: 'bó', word: '博大精深' }, { char: '览', pinyin: 'lǎn', word: '阅览' },
      { char: '凝', pinyin: 'níng', word: '凝结' }, { char: '释', pinyin: 'shì', word: '解释' },
      { char: '慎', pinyin: 'shèn', word: '审慎' }, { char: '恒', pinyin: 'héng', word: '持之以恒' },
      { char: '践', pinyin: 'jiàn', word: '实践' }, { char: '笃', pinyin: 'dǔ', word: '笃行' }
    ],
    '高段': [
      { char: '沧', pinyin: 'cāng', word: '沧海一粟' }, { char: '桑', pinyin: 'sāng', word: '饱经沧桑' },
      { char: '砥', pinyin: 'dǐ', word: '砥砺' }, { char: '砺', pinyin: 'lì', word: '砥砺前行' },
      { char: '睿', pinyin: 'ruì', word: '睿智' }, { char: '韬', pinyin: 'tāo', word: '韬光养晦' },
      { char: '略', pinyin: 'lüè', word: '战略' }, { char: '宏', pinyin: 'hóng', word: '宏观' },
      { char: '邃', pinyin: 'suì', word: '深邃' }, { char: '卓', pinyin: 'zhuó', word: '卓尔不群' }
    ]
  },

  // 任务 2：阅读素材库 (1~2年级名著白话文，3年级以上真实新闻深度特稿)
  readingArticles: [
    {
      id: 'r_junior_1',
      forJunior: true, // 供低年级
      title: '《西游记》精选：美猴王出世寻仙道',
      content: '东胜神洲傲来国海中，有一座花果山。那座山正当顶上，有一块仙石。一日仙石迸裂，产一石卵，化作一个石猴。五官俱备，四肢皆全，拜了四方，目运两道神光，射冲斗府。石猴与群猴在山中游玩，发现了水帘洞，被众猴尊为“美猴王”。美猴王虽在山中快乐逍遥，却忧虑有朝一日年老身亡，于是立志远涉重洋，拜师学道，寻求长生不老与通天本领。',
      questions: [
        { type: 'choice', q: '美猴王出生在什么地方？', options: ['A. 东海龙宫', 'B. 花果山顶仙石', 'C. 五指山下', 'D. 昆仑仙境'], ans: 'B' },
        { type: 'fill', q: '美猴王之所以立志出海拜师，是因为他忧虑有朝一日____。', ans: '年老身亡' }
      ]
    },
    {
      id: 'r_senior_1',
      forJunior: false, // 供高年级
      title: '真实时事：我国深中通道海底沉管隧道攻克世界工程难关',
      content: '深中通道是连接深圳与中山的跨海巨型工程。其中海底隧道长约6.8公里，由32个巨大钢壳沉管和1个最终接头拼接而成，每个标准沉管重达8万吨！工程师们采用了具有自主知识产权的智能浇筑与北斗高精度毫米级水下对接技术。在深水暗流复杂海况下，实现了沉管“深海穿针”，成功打通了珠江口东西两岸交通黄金动脉。',
      questions: [
        { type: 'choice', q: '深中通道海底沉管对接利用了哪种导航系统实现毫米级定位？', options: ['A. GPS系统', 'B. 北斗卫星导航系统', 'C. 声呐浮标', 'D. 惯性雷达'], ans: 'B' },
        { type: 'fill', q: '深中通道海底沉管隧道全长约____公里。', ans: '6.8' }
      ]
    }
  ],

  // 任务 5：真题奥数题库 (原题 + 解答提示 + 逐步详解 + 举一反三变式题)
  olympiadCurriculum: {
    '小学1年级': {
      title: '排队找位置与重叠问题',
      question: '小朋友排队领书，从前往后数小诺排在第 8 个，从后往前数小诺排在第 9 个。请问这一排一共有多少个小朋友？',
      hint: '数了两次小诺本人！画图看看小诺被算了多少遍？',
      solution: '第一步：从前往后数包含小诺（8人）；\n第二步：从后往前数又包含小诺（9人）；\n第三步：小诺被多加了1次，因此必须减去：8 + 9 - 1 = 16（人）。\n答：一排共有 16 个小朋友。',
      variant: '【举一反三变式题】：小威排队打饭，从左数排第 6，从右数排第 7，这一队共有多少人？\n答：6 + 7 - 1 = 12人。'
    },
    '小学2年级': {
      title: '间隔问题与锯木头时间',
      question: '一根木料锯成 5 段需要 16 分钟。如果改成锯成 8 段，需要多少分钟？',
      hint: '锯成5段需要锯几刀？每锯一刀要花几分钟？',
      solution: '第一步：锯成 5 段只需要锯 5 - 1 = 4 次；\n第二步：每次用时 16 ÷ 4 = 4 分钟；\n第三步：锯成 8 段需要锯 8 - 1 = 7 次；\n第四步：总时间 7 × 4 = 28 分钟。\n答：需要 28 分钟。',
      variant: '【举一反三变式题】：把一根铁丝剪成 4 段要 6 分钟，剪成 7 段要多少分钟？\n答：剪3次用6分即2分/次，剪6次用 6×2 = 12分钟。'
    },
    '小学3年级': {
      title: '和倍问题与等量代换',
      question: '果园里桃树和梨树一共 180 棵，已知桃树的棵数是梨树的 2 倍。桃树和梨树各有多少棵？',
      hint: '把梨树当作 1 份，桃树是 2 份，总共是多少份？',
      solution: '第一步：梨树看作 1 份，桃树为 2 份，总份数 = 1 + 2 = 3 份；\n第二步：梨树（1份）= 180 ÷ 3 = 60 棵；\n第三步：桃树（2份）= 60 × 2 = 120 棵。\n答：桃树 120 棵，梨树 60 棵。',
      variant: '【举一反三变式题】：书店运来科技书和故事书共 240 本，科技书是故事书的 3 倍，两种书各多少本？\n答：故事书 240÷(1+3)=60本，科技书 60×3=180本。'
    },
    '小学4年级': {
      title: '差倍问题与年龄难题',
      question: '今年爸爸 38 岁，儿子 10 岁。多少年前爸爸的年龄正好是儿子的 5 倍？',
      hint: '无论过了多少年，爸爸和儿子的年龄差始终不变！先算出差是多少？',
      solution: '第一步：年龄差永远不变：38 - 10 = 28 岁；\n第二步：当爸爸是儿子5倍时，相差 5 - 1 = 4 份；\n第三步：那时儿子的年龄：28 ÷ 4 = 7 岁；\n第四步：距今年数：10 - 7 = 3 年前。\n答：3 年前爸爸年龄是儿子的 5 倍。',
      variant: '【举一反三变式题】：妈妈今年 36 岁，女儿 12 岁，几年前妈妈年龄是女儿的 4 倍？\n答：差24岁，24÷(4-1)=8岁，12-8=4年前。'
    },
    '小学5年级': {
      title: '相遇问题与行程相向',
      question: '甲乙两车分别从相距 480 千米的两地同时相向而行，甲车每小时行 55 千米，乙车每小时行 65 千米。两车出发几小时后相遇？',
      hint: '两车一小时一共走多少路程（速度和）？',
      solution: '第一步：计算两车速度和：55 + 65 = 120 千米/小时；\n第二步：相遇时间 = 总路程 ÷ 速度和 = 480 ÷ 120 = 4 小时。\n答：4 小时后两车相遇。',
      variant: '【举一反三变式题】：两列火车相距 600 公里相对开出，快车每小时 80 公里，慢车每小时 70 公里，几小时相遇？\n答：600÷(80+70) = 4小时。'
    },
    '小学6年级': {
      title: '浓度配比与十字交叉法',
      question: '把浓度为 20% 的盐水 300 克，与浓度为 5% 的盐水混合成浓度为 14% 的盐水，需要浓度 5% 的盐水多少克？',
      hint: '计算前后纯盐的总质量不变！或者设未知数方程。',
      solution: '第一步：设需 5% 盐水 x 克；\n第二步：列纯盐守恒方程：300 × 20% + 5%·x = (300 + x) × 14%；\n第三步：化简：60 + 0.05x = 42 + 0.14x；\n第四步：0.09x = 18，解得 x = 200 克。\n答：需要 5% 的盐水 200 克。',
      variant: '【举一反三变式题】：浓度30%盐水200克与10%盐水混合配成18%盐水，需要10%盐水多少克？\n答：(200×30% + 0.1x) = (200+x)×0.18，解得 x = 300克。'
    }
  },

  // 任务 6~11：全国大纲标准词汇组（每组 5 词，打通听说读写背与阅读完形）
  englishWordPacks: [
    {
      packId: 'pack_1',
      words: [
        { word: 'explore', phonetic: '/ɪkˈsplɔːr/', meaning: '探索，勘探', collocations: 'explore the space (探索太空), explore the world (探索世界)', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80' },
        { word: 'courage', phonetic: '/ˈkɜːrɪdʒ/', meaning: '勇气，胆量', collocations: 'have the courage to (有勇气去做...), take courage (鼓起勇气)', img: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=300&q=80' },
        { word: 'curious', phonetic: '/ˈkjʊriəs/', meaning: '好奇的，求知欲强的', collocations: 'be curious about (对...感到好奇)', img: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=300&q=80' },
        { word: 'protect', phonetic: '/prəˈtekt/', meaning: '保护，保卫', collocations: 'protect nature (保护自然), protect eyesight (保护视力)', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&q=80' },
        { word: 'achieve', phonetic: '/əˈtʃiːv/', meaning: '实现，达到', collocations: 'achieve a goal (实现目标), achieve success (取得成功)', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&q=80' }
      ],
      // 任务 7 朗读示范句
      sentences: [
        'We should explore the wonderful world bravely.',
        'It takes great courage to tell the truth.',
        'Children are always curious about new things.',
        'We must take action to protect our environment.',
        'Work hard and you will achieve your big dream.'
      ],
      // 任务 8 挑一句结构造句
      sentenceForStructure: {
        original: 'Work hard and you will achieve your big dream.',
        prompt: '请用 "Work hard and you will achieve..." 表达你自己的奋斗目标！'
      },
      // 任务 9 挑一句英译中
      sentenceForTranslation: {
        en: 'Children with courage are always curious to explore the unknown world.',
        hint: '关键词：courage(勇气), curious(好奇), explore(探索), unknown(未知)',
        cnReference: '有勇气的孩子们总是充满好奇地去探索未知的世界。'
      },
      // 任务 10 阅读理解
      readingComp: {
        passage: 'Young scientists always have strong curious minds. They want to explore nature and deep oceans. Sometimes, danger is on the road, but with enough courage, they can overcome difficulties. When they protect wildlife and achieve great discoveries, the whole world becomes better.',
        questions: [
          { q: '1. What do young scientists want to explore?', options: ['A. Only classrooms', 'B. Nature and deep oceans', 'C. Video games'], ans: 'B' },
          { q: '2. What helps scientists overcome difficulties?', options: ['A. Courage', 'B. Money', 'C. Luck'], ans: 'A' },
          { q: '3. What happens when they achieve great discoveries?', options: ['A. Nature is broken', 'B. The world becomes better', 'C. Nothing changes'], ans: 'B' }
        ]
      },
      // 任务 11 完形填空
      clozeTest: {
        passage: 'To become a good explorer, one must be ___1___ about everything. It takes true ___2___ to face storms. When we learn to ___3___ the animals, we ___4___ real harmony with nature.',
        blanks: [
          { num: 1, options: ['A. curious', 'B. angry', 'C. tired'], ans: 'A' },
          { num: 2, options: ['A. clock', 'B. courage', 'C. candy'], ans: 'B' },
          { num: 3, options: ['A. protect', 'B. forget', 'C. break'], ans: 'A' },
          { num: 4, options: ['A. lose', 'B. achieve', 'C. stop'], ans: 'B' }
        ]
      }
    }
  ],

  // 默认可增删商品
  defaultShopItems: [
    { id: 'item_1', icon: '🧹', name: '周六免做家务券', desc: '周末免洗碗或扫地一次', cost: 15 },
    { id: 'item_2', icon: '🎬', name: '电影/游乐园门票', desc: '自选周末电影一场或游乐场畅玩', cost: 50 },
    { id: 'item_3', icon: '📚', name: '自选图书/心愿盲盒', desc: '50元以内自选心愿物品或图书', cost: 80 },
    { id: 'item_4', icon: '🎮', name: '周末畅玩游戏30分钟', desc: '自选安全益智主机或平板游戏', cost: 35 }
  ]
};
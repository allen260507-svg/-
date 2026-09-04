// 家庭研学中枢 - 真实真题、题库、单词与阅读模块
window.StudyData = {
  defaultStudents: [
    { id: 'nuo', name: '诺', grade: '小学5年级', points: 8, avatar: '🐱', pin: '1234', totalStudyMinutes: 35, avatarImg: '' },
    { id: 'wei', name: '威', grade: '小学4年级', points: 24, avatar: '🦁', pin: '1234', totalStudyMinutes: 68, avatarImg: '' },
    { id: 'yi',  name: '奕', grade: '小学2年级', points: 15, avatar: '🐼', pin: '1234', totalStudyMinutes: 42, avatarImg: '' },
    { id: 'dai', name: '黛', grade: '小学6年级', points: 42, avatar: '🔭', pin: '1234', totalStudyMinutes: 110, avatarImg: '' }
  ],

  baseTasks: [
    { id: 1, code: '01', category: '第一优先', icon: '🎒', title: '登记并完成学校家庭作业', duration: '35分钟', points: 3, criteria: '逐科要求登记 + 自由选择AI质检' },
    { id: 2, code: '02', category: '语文/阅读', icon: '🔍', title: '每日新闻/名著阅读与3道真题', duration: '20分钟', points: 3, criteria: '计时≥20分钟 + 3道真题单选填空判分' },
    { id: 3, code: '03', category: '语文/书法', icon: '✍️', title: '每日练字打卡(古诗句×10遍)', duration: '10分钟', points: 2, criteria: '一屏一句经典诗词 + 田字格硬笔/毛笔写法' },
    { id: 4, code: '04', category: '数学/计算', icon: '⚡', title: '每日10道年级口算', duration: '8分钟', points: 2, criteria: '规范一屏单行排列 + 即时判分' },
    { id: 5, code: '05', category: '数学/思维', icon: '🧩', title: '每日一道年级奥数题', duration: '15分钟', points: 3, criteria: '草稿拍照 + 提示详解 + 懂了举一反三' },
    { id: 6, code: '06', category: '英语/词汇', icon: '🔤', title: '记5个大纲单词', duration: '15分钟', points: 3, criteria: '超大图 + 音标点读 + 20秒听写默写' },
    { id: 7, code: '07', category: '英语/口语', icon: '🎙️', title: '今日词汇朗读或自述5句', duration: '6分钟', points: 2, criteria: '跟读今日单词例句 + 录音上传' },
    { id: 8, code: '08', category: '英语/造句', icon: '🌟', title: '每日一句：从结构到表达', duration: '5分钟', points: 2, criteria: '今日核心单词选句 + 句型结构重组' },
    { id: 9, code: '09', category: '英语/翻译', icon: '🧭', title: '每日一句：英译中', duration: '5分钟', points: 2, criteria: '关键词提示 + 提交后方可查看参考译文' },
    { id: 10, code: '10', category: '英语/阅读', icon: '📖', title: '年级小阅读理解(串联5词)', duration: '10分钟', points: 2, criteria: '串联短文 + 主旨大意题 + 猜词题' },
    { id: 11, code: '11', category: '英语/完形', icon: '🕵️', title: '每日英语完形填空(串联5词)', duration: '8分钟', points: 2, criteria: '今日词汇语境挖空 + 综合语法选择' },
    { id: 12, code: '12', category: '综合/复盘', icon: '⚔️', title: '当日错题消化与学校错题录入', duration: '15分钟', points: 2, criteria: '消化系统错题 + 支持拍照/敲字录入新错题' },
    { id: 13, code: '13', category: '阅读/习惯', icon: '🏰', title: '整本书伴读与思考', duration: '20分钟', points: 2, criteria: '书名页数 + 计时 + 梗概与明日计划' }
  ],

  // 任务 3：练字库（一屏给一句话或者一句诗，每字写 10 遍）
  calligraphySentences: [
    { sentence: '床前明月光，疑是地上霜。', pinyin: 'chuáng qián míng yuè guāng, yí shì dì shàng shuāng.', tip: '字字间距均匀，横画微向上抗肩，捺画舒展。' },
    { sentence: '春眠不觉晓，处处闻啼鸟。', pinyin: 'chūn mián bù jué xiǎo, chǔ chǔ wén tí niǎo.', tip: '起笔藏锋，转折圆润，结构严谨自然。' },
    { sentence: '欲穷千里目，更上一层楼。', pinyin: 'yù qióng qiān lǐ mù, gèng shàng yì céng lóu.', tip: '字势开张，主笔竖画垂直有力，重心稳固。' }
  ],

  // 任务 2：阅读文章（每篇至少 3 个题目）
  readingArticles: [
    {
      id: 'r_junior',
      forJunior: true,
      title: '《西游记》白话精选：灵猴拜师求真道',
      content: '东胜神洲傲来国海中，有一座花果山。那座山正当顶上，有一块仙石。一日仙石迸裂，产一石卵，化作一个石猴。石猴发现了水帘洞，被群猴尊为美猴王。美猴王在山中欢乐度日，忽一日心中忧虑生命短暂，终将年老身亡。于是他辞别群猴，泛筏远渡重洋，历经千山万水，终于拜菩提祖师为师，取名孙悟空，苦练长生与通天本领。',
      questions: [
        { id: 1, q: '1. 美猴王出生在什么地方的仙石之中？', options: ['A. 东海龙宫海底', 'B. 花果山山顶仙石', 'C. 五行山下石缝'], ans: 'B', analysis: '文中明确记载“那座山正当顶上，有一块仙石...化作一个石猴”。' },
        { id: 2, q: '2. 群猴发现水帘洞后，尊石猴为什么称号？', options: ['A. 美猴王', 'B. 齐天大圣', 'C. 弼马温'], ans: 'A', analysis: '文中提到“发现了水帘洞，被众猴尊为美猴王”。' },
        { id: 3, q: '3. [判断/填空] 美猴王远渡重洋最终拜谁为师？', options: ['A. 唐三藏', 'B. 菩提祖师', 'C. 太上老君'], ans: 'B', analysis: '文中最后一句指出“终于拜菩提祖师为师”。' }
      ]
    },
    {
      id: 'r_senior',
      forJunior: false,
      title: '超级工程：深中通道海底沉管隧道全线贯通',
      content: '深中通道是连接深圳与中山的跨海超级枢纽。其中海底沉管隧道长达6.8公里，由32节巨大钢壳管节与一个最终接头连接而成，单节沉管排水量高达8万吨！在汹涌暗流的深海中，建设团队采用了我国自主研发的智能浇筑机器人和北斗卫星高精度定位系统，在几十米深的海底实现了毫米级的精准对接，将两地通行车程由两小时缩短至三十分钟。',
      questions: [
        { id: 1, q: '1. 深中通道海底沉管隧道全长大约是多少公里？', options: ['A. 3.2公里', 'B. 6.8公里', 'C. 15.4公里'], ans: 'B', analysis: '文中首段第二句指出“海底沉管隧道长达6.8公里”。' },
        { id: 2, q: '2. 建设团队在深海对接中利用了哪项我国自主高精度定位系统？', options: ['A. 北斗卫星导航系统', 'B. 国际GPS民用系统', 'C. 声呐雷达系统'], ans: 'A', analysis: '文中明确说明“采用了我国自主研发的智能浇筑机器人和北斗卫星高精度定位系统”。' },
        { id: 3, q: '3. 深中通道通车后，深圳到中山的车程从两小时缩短至多少分钟？', options: ['A. 10分钟', 'B. 30分钟', 'C. 50分钟'], ans: 'B', analysis: '文中结尾写道“将两地通行车程由两小时缩短至三十分钟”。' }
      ]
    }
  ],

  olympiadBank: {
    '小学1年级': {
      title: '排队找位置中的重叠计算',
      question: '操场上小朋友排成一横队，从左往右数，诺排在第 7 个；从右往左数，诺排在第 8 个。请问这一排一共有多少个小朋友？',
      hint: '从左往右数算了一次诺，从右往左数又算了一次诺，诺本人被重复计算了几次？',
      steps: ['第一步：从左数有 7 个人（包含诺）。', '第二步：从右数有 8 个人（也包含诺）。', '第三步：因为诺被两边都数了一次，所以必须减去 1 人。', '算式：7 + 8 - 1 = 14（人）。'],
      variant: { question: '威排队从左数第6，从右数第7，共有几人？', ans: '6 + 7 - 1 = 12人。' }
    },
    '小学2年级': {
      title: '楼梯台阶与植树间隔原理',
      question: '木工师傅把一根长木料锯成 5 段，每锯断一次需要 4 分钟。请问锯完这根木头一共需要多少分钟？',
      hint: '锯成 5 段需要锯断几次？',
      steps: ['第一步：锯成 5 段只需要锯断 5 - 1 = 4 次。', '第二步：每次锯木用时 4 分钟。', '第三步：总用时 = 4 × 4 = 16（分钟）。'],
      variant: { question: '铁丝剪成7段，每剪一次3分钟，共需几分钟？', ans: '(7-1)×3 = 18分钟。' }
    },
    '小学3年级': {
      title: '和倍问题与份数思维',
      question: '文具店里书包和钢笔的价格之和是 120 元，书包的价格正好是钢笔的 5 倍。书包和钢笔各多少元？',
      hint: '钢笔 1 份，书包 5 份，总共几份？',
      steps: ['第一步：总份数 = 1 + 5 = 6 份。', '第二步：钢笔价格 = 120 ÷ 6 = 20 元。', '第三步：书包价格 = 20 × 5 = 100 元。'],
      variant: { question: '苹果和梨共150斤，苹果是梨的2倍，各多少斤？', ans: '梨50斤，苹果100斤。' }
    },
    '小学4年级': {
      title: '鸡兔同笼之假设法解密',
      question: '一个笼子里装有鸡和兔子共 35 只，数脚一共有 94 只。请问笼子里鸡和兔子各有多少只？',
      hint: '假设全是鸡，应有多少只脚？',
      steps: ['第一步：假设全是鸡，有脚 35×2=70 只。', '第二步：多出脚数 94-70=24 只。', '第三步：兔数 = 24÷2 = 12只，鸡数 = 35-12 = 23只。'],
      variant: { question: '自行车和三轮车共20辆，48个轮子，各几辆？', ans: '三轮车8辆，自行车12辆。' }
    },
    '小学5年级': {
      title: '相遇行程问题与速度和',
      question: '甲、乙两列高铁分别从相距 600 千米的两地同时相向开出，甲车每小时行 160 千米，乙车每小时行 140 千米。几小时后两车相遇？',
      hint: '两车速度和是多少？',
      steps: ['第一步：速度和 = 160 + 140 = 300 千米/小时。', '第二步：相遇时间 = 600 ÷ 300 = 2 小时。'],
      variant: { question: '1000米相向跑，每秒6米和4米，几秒相遇？', ans: '1000÷(6+4)=100秒。' }
    },
    '小学6年级': {
      title: '工程合作与剩余工作量逆推',
      question: '一项研学工程，甲队单独做需 12 天完成，乙队单独做需 15 天完成。两队合做 4 天后，剩下的由乙队独做，乙队还需几天？',
      hint: '合做4天完成了几分之几？',
      steps: ['第一步：甲效率1/12，乙效率1/15。', '第二步：合做4天完成 4×(1/12+1/15) = 3/5。', '第三步：剩余2/5，乙独做需 (2/5)÷(1/15) = 6 天。'],
      variant: { question: '甲10天，乙15天，合做3天后甲独做还需几天？', ans: '剩余1/2，甲需5天。' }
    }
  },

  englishWordPack: {
    words: [
      {
        word: 'explore', phonetic: '/ɪkˈsplɔːr/', meaning: '探索，探险',
        img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80',
        collocations: 'explore the ocean (探索海洋)',
        sentence: 'We will explore the mysterious island tomorrow.',
        sentencePhonetic: '/wiː/ /wɪl/ /ɪkˈsplɔːr/ /ðə/ /mɪˈstɪəriəs/ /ˈaɪlənd/ /təˈmɒrəʊ/',
        wordByWordCN: '我们 / 将要 / 探索 / 这个 / 神秘的 / 岛屿 / 明天',
        sentenceCN: '我们明天要去探索那个神秘的岛屿。'
      },
      {
        word: 'courage', phonetic: '/ˈkɜːrɪdʒ/', meaning: '勇气，胆量',
        img: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=500&q=80',
        collocations: 'have courage (有勇气)',
        sentence: 'The young knight had great courage.',
        sentencePhonetic: '/ðə/ /jʌŋ/ /naɪt/ /hæd/ /ɡreɪt/ /ˈkɜːrɪdʒ/',
        wordByWordCN: '那位 / 年轻的 / 骑士 / 拥有 / 极大的 / 勇气',
        sentenceCN: '那位年轻的骑士拥有非凡的勇气。'
      },
      {
        word: 'curious', phonetic: '/ˈkjʊəriəs/', meaning: '好奇的',
        img: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500&q=80',
        collocations: 'be curious about (对...充满好奇)',
        sentence: 'Cats are curious about moving balls.',
        sentencePhonetic: '/kæts/ /ɑːr/ /ˈkjʊəriəs/ /əˈbaʊt/ /ˈmuːvɪŋ/ /bɔːlz/',
        wordByWordCN: '猫咪 / 是 / 好奇的 / 关于 / 滚动的 / 球',
        sentenceCN: '猫咪对滚动的球充满了好奇。'
      },
      {
        word: 'protect', phonetic: '/prəˈtekt/', meaning: '保护，保卫',
        img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80',
        collocations: 'protect animals (保护动物)',
        sentence: 'Helmets protect our heads safely.',
        sentencePhonetic: '/ˈhelmɪts/ /prəˈtekt/ /ˈaʊər/ /hedz/ /ˈseɪfli/',
        wordByWordCN: '头盔 / 保护 / 我们的 / 头部 / 安全地',
        sentenceCN: '头盔能安全地保护我们的头部。'
      },
      {
        word: 'achieve', phonetic: '/əˈtʃiːv/', meaning: '实现，获得',
        img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80',
        collocations: 'achieve a dream (实现梦想)',
        sentence: 'She worked hard to achieve her dream.',
        sentencePhonetic: '/ʃiː/ /wɜːkt/ /hɑːd/ /tuː/ /əˈtʃiːv/ /hɜːr/ /driːm/',
        wordByWordCN: '她 / 努力工作 / 为了 / 实现 / 她的 / 梦想',
        sentenceCN: '她为了实现自己的梦想而努力奋斗。'
      }
    ],
    speechSentences: [
      { text: 'We will explore the mysterious island tomorrow.', cn: '我们明天要去探索那个神秘的岛屿。' },
      { text: 'The young knight had great courage.', cn: '那位年轻的骑士拥有非凡的勇气。' }
    ],
    structurePractice: { sentence: 'She worked hard to achieve her dream.', structure: '主语 + worked hard to achieve + 目标.' },
    translationPractice: { sentence: 'Children with true courage are always curious to explore nature.', hints: [{word:'courage', meaning:'勇气'},{word:'curious', meaning:'好奇的'}], referenceCN: '拥有真正勇气的孩子们总是充满好奇地去探索大自然。' },
    readingComprehension: {
      title: 'The Brave Space Explorers',
      passage: 'Last year, a group of young students started a space club. They were curious about stars and planets. With great courage, they built a telescope model. Their teacher said, "To explore the universe, we must study hard and protect our curious minds."',
      questions: [
        { id: 1, q: '1. What is this story mainly about?', options: ['A. Selling telescopes', 'B. Curious and brave students in a space club', 'C. Old astronauts'], ans: 'B', analysis: '全文讲述了对太空充满好奇的孩子们成立太空俱乐部的故事。' },
        { id: 2, q: '2. What does "explore" mean?', options: ['A. Sleep', 'B. Travel and discover new things', 'C. Buy food'], ans: 'B', analysis: 'explore 表示探索发现。' }
      ]
    },
    clozeTest: {
      title: 'A Journey into the Forest',
      passage: 'Leo is a boy who is always ___1___ about animals. One morning, he decided to ___2___ the green forest.',
      blanks: [
        { num: 1, options: ['A. tired', 'B. curious', 'C. angry'], ans: 'B', analysis: 'be curious about 固定搭配。' },
        { num: 2, options: ['A. explore', 'B. burn', 'C. sell'], ans: 'A', analysis: 'explore the forest 探索森林。' }
      ]
    }
  },

  defaultShopItems: [
    { id: 'item_1', icon: '🧹', name: '周六免做家务券', desc: '周末免洗碗或扫地一次', cost: 15 },
    { id: 'item_2', icon: '🎬', name: '电影/游乐园门票', desc: '自选周末电影一场或游乐场畅玩', cost: 50 }
  ]
};
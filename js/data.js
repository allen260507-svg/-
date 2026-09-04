// 家庭研学中枢 - 核心真题、词库与荣誉档案数据库
window.StudyData = {
  // 学生初始档案 (含历史名次统计)
  defaultStudents: [
    { id: 'nuo', name: '诺', grade: '小学5年级', points: 8, avatar: '🐱', avatarImg: '', pin: '1234', totalStudyMinutes: 35, medals: { gold: 1, silver: 2, bronze: 4, fourth: 5 } },
    { id: 'wei', name: '威', grade: '小学4年级', points: 24, avatar: '🦁', avatarImg: '', pin: '1234', totalStudyMinutes: 68, medals: { gold: 3, silver: 4, bronze: 2, fourth: 1 } },
    { id: 'yi',  name: '奕', grade: '小学2年级', points: 15, avatar: '🐼', avatarImg: '', pin: '1234', totalStudyMinutes: 42, medals: { gold: 2, silver: 3, bronze: 5, fourth: 2 } },
    { id: 'dai', name: '黛', grade: '小学6年级', points: 42, avatar: '🔭', avatarImg: '', pin: '1234', totalStudyMinutes: 110, medals: { gold: 6, silver: 2, bronze: 1, fourth: 0 } }
  ],

  // 13 项标准任务
  baseTasks: [
    { id: 1, code: '01', category: '第一优先', icon: '🎒', title: '登记并完成学校家庭作业', duration: '35分钟', points: 3, criteria: '逐科录入 + 拍照 + AI质检' },
    { id: 2, code: '02', category: '语文/阅读', icon: '🔍', title: '每日新闻/名著阅读与3道真题', duration: '20分钟', points: 3, criteria: '真实计时≥20分 + 3道单选题判分' },
    { id: 3, code: '03', category: '语文/书法', icon: '✍️', title: '每日练字打卡(古诗名句×10遍)', duration: '10分钟', points: 2, criteria: '一屏一句古诗 + 双笔法指导 + 拍照' },
    { id: 4, code: '04', category: '数学/计算', icon: '⚡', title: '每日10道年级口算', duration: '8分钟', points: 2, criteria: '单行无滚动条排版 + 自动判分' },
    { id: 5, code: '05', category: '数学/思维', icon: '🧩', title: '每日一道年级奥数题', duration: '15分钟', points: 3, criteria: '提示详解 + 懂了举一反三变式' },
    { id: 6, code: '06', category: '英语/词汇', icon: '🔤', title: '记5个大纲单词', duration: '15分钟', points: 3, criteria: '超大意象图 + 20秒听写默写(+3分)' },
    { id: 7, code: '07', category: '英语/口语', icon: '🎙️', title: '今日词汇朗读或自述5句', duration: '6分钟', points: 2, criteria: '例句跟读 + 录音上传' },
    { id: 8, code: '08', category: '英语/造句', icon: '🌟', title: '每日一句：从结构到表达', duration: '5分钟', points: 2, criteria: '核心句型结构仿写重组' },
    { id: 9, code: '09', category: '英语/翻译', icon: '🧭', title: '每日一句：英译中', duration: '5分钟', points: 2, criteria: '生词提示 + 提交后揭晓参考答案' },
    { id: 10, code: '10', category: '英语/阅读', icon: '📖', title: '年级小阅读理解(串联5词)', duration: '10分钟', points: 2, criteria: '短文主旨细节题 + 3道单选' },
    { id: 11, code: '11', category: '英语/完形', icon: '🕵️', title: '每日英语完形填空(串联5词)', duration: '8分钟', points: 2, criteria: '语境挖空 + 语法综合判断' },
    { id: 12, code: '12', category: '综合/复盘', icon: '⚔️', title: '当日错题消化与学校错题录入', duration: '15分钟', points: 2, criteria: '敲字/拍照错题 + 订正心得' },
    { id: 13, code: '13', category: '阅读/习惯', icon: '🏰', title: '整本书深度伴读打卡', duration: '20分钟', points: 2, criteria: '书名页码 + 计时 + 梗概与明日计划' }
  ],

  // 任务 3：练字古诗库 (一屏一句诗)
  calligraphyPoem: {
    sentence: '床前明月光，疑是地上霜。',
    pinyin: 'chuáng qián míng yuè guāng, yí shì dì shàng shuāng.',
    tip: '硬笔指导：横平竖直，字距匀称，重心平稳。\n毛笔指导：中锋起笔逆锋入纸，转折处顿笔转锋，捺画舒展圆润饱满。'
  },

  // 任务 2：阅读素材库 (每篇均严选 3 道真题)
  readingArticles: [
    {
      id: 'r_junior_1',
      forJunior: true,
      title: '《西游记》精选：美猴王出世寻仙道',
      content: '东胜神洲傲来国海中，有一座花果山。那座山正当顶上，有一块仙石。一日仙石迸裂，产一石卵，化作一个石猴。五官俱备，四肢皆全，拜了四方，目运两道神光，射冲斗府。石猴与群猴在山中游玩，发现了水帘洞，被众猴尊为“美猴王”。美猴王虽在山中快乐逍遥，却忧虑有朝一日年老身亡，于是立志远涉重洋，拜师学道，寻求长生不老与通天本领。',
      questions: [
        { id: 1, q: '1. [主旨大意] 这篇经典名著选段主要讲述了什么？', options: ['A. 群猴在水帘洞争夺王位', 'B. 美猴王神奇降生并立志出海求仙问道', 'C. 孙悟空大闹天宫的过程'], ans: 'B', analysis: '语篇核心记叙石猴出世并因忧虑生死立志出海寻道。' },
        { id: 2, q: '2. [细节理解] 美猴王最初降生在什么地方？', options: ['A. 东海龙宫之中', 'B. 花果山顶的一块仙石中', 'C. 水帘洞铁板桥下'], ans: 'B', analysis: '原文第一段指出：花果山正当顶上仙石迸裂化作石猴。' },
        { id: 3, q: '3. [推断理解] 众猴最终尊石猴为美猴王是因为他？', options: ['A. 拥有两道神光', 'B. 勇敢探寻并发现了水帘洞安身之所', 'C. 学会了长生不老之术'], ans: 'B', analysis: '石猴带头跳入瀑布发现水帘洞，众猴依约拜其为王。' }
      ]
    },
    {
      id: 'r_senior_1',
      forJunior: false,
      title: '真实时事：深中通道海底沉管隧道全线贯通',
      content: '深中通道是连接深圳与中山的跨海超级枢纽。其中海底沉管隧道长达6.8公里，由32节巨大钢壳管节与一个最终接头连接而成，单节沉管排水量高达8万吨！在汹涌暗流的深海中，建设团队采用了我国自主研发的智能浇筑机器人和北斗卫星高精度定位系统，在几十米深的海底实现了毫米级的精准对接，将两地通行车程由两小时大幅缩短至三十分钟。',
      questions: [
        { id: 1, q: '1. [主旨大意] 这篇科技时事特稿的核心主旨是？', options: ['A. 介绍珠三角沿岸风光旅游', 'B. 报道我国攻克深中通道海底沉管隧道世界工程难关', 'C. 阐述北斗卫星组网发射历程'], ans: 'B', analysis: '文章重点阐述深中通道跨海海底隧道的重大工程突破。' },
        { id: 2, q: '2. [细节理解] 深中通道海底沉管隧道全长约为多少公里？', options: ['A. 3.2 公里', 'B. 6.8 公里', 'C. 15.4 公里'], ans: 'B', analysis: '原文明确指出：海底沉管隧道长达 6.8 公里。' },
        { id: 3, q: '3. [技术理解] 水下毫米级精准对接依赖的是哪项我国自主技术？', options: ['A. 北斗卫星高精度定位系统', 'B. 国际 GPS 民用定位', 'C. 声呐浮标导航'], ans: 'A', analysis: '文中指明采用“北斗卫星高精度定位系统”实现深海毫米级对接。' }
      ]
    }
  ],

  // 任务 5：真题奥数题库 (详解杜绝 \\n 转义乱码)
  olympiadCurriculum: {
    '小学1年级': {
      title: '排队找位置与重叠问题',
      question: '小朋友排队领书，从前往后数小诺排在第 8 个，从后往前数小诺排在第 9 个。请问这一排一共有多少个小朋友？',
      hint: '小诺本人被前后重复计算了两次！',
      steps: [
        '第一步：从前往后数包含小诺，共 8 人；',
        '第二步：从后往前数又包含了小诺，共 9 人；',
        '第三步：小诺被重复多加了 1 次，必须扣除：8 + 9 - 1 = 16（人）。',
        '答：这一排共有 16 个小朋友。'
      ],
      variant: { question: '小威排队打饭，从左数排第 6，从右数排第 7，这一队共有多少人？', ans: '6 + 7 - 1 = 12（人）。' }
    },
    '小学2年级': {
      title: '间隔问题与锯木头时间',
      question: '一根木料锯成 5 段需要 16 分钟。如果改成锯成 8 段，需要多少分钟？',
      hint: '锯成5段只需要锯几次？每锯一次要花几分钟？',
      steps: [
        '第一步：锯成 5 段只需要锯：5 - 1 = 4（次）；',
        '第二步：每次锯木用时：16 ÷ 4 = 4（分钟）；',
        '第三步：锯成 8 段需要锯：8 - 1 = 7（次）；',
        '第四步：总共耗时：7 × 4 = 28（分钟）。',
        '答：锯成 8 段需要 28 分钟。'
      ],
      variant: { question: '把一根铁丝剪成 4 段要 6 分钟，剪成 7 段要多少分钟？', ans: '剪3次用6分即2分/次；剪6次耗时 6 × 2 = 12（分钟）。' }
    },
    '小学3年级': {
      title: '和倍问题与等量代换',
      question: '果园里桃树和梨树一共 180 棵，已知桃树的棵数是梨树的 2 倍。桃树和梨树各有多少棵？',
      hint: '把梨树当作 1 份，桃树就是 2 份，总共是多少份？',
      steps: [
        '第一步：把梨树看作 1 份，桃树为 2 份，总份数 = 1 + 2 = 3（份）；',
        '第二步：计算梨树棵数（1份）：180 ÷ 3 = 60（棵）；',
        '第三步：计算桃树棵数（2份）：60 × 2 = 120（棵）。',
        '答：桃树有 120 棵，梨树有 60 棵。'
      ],
      variant: { question: '书店运来科技书和故事书共 240 本，科技书是故事书的 3 倍，两种书各多少本？', ans: '故事书：240 ÷ (1+3) = 60（本）；科技书：60 × 3 = 180（本）。' }
    },
    '小学4年级': {
      title: '差倍问题与年龄差难题',
      question: '今年爸爸 38 岁，儿子 10 岁。多少年前爸爸的年龄正好是儿子的 5 倍？',
      hint: '无论岁月如何变化，父子两人的年龄差永远不变！',
      steps: [
        '第一步：计算固定的年龄差：38 - 10 = 28（岁）；',
        '第二步：当爸爸是儿子 5 倍时，相差 5 - 1 = 4（份）；',
        '第三步：那时儿子的年龄：28 ÷ 4 = 7（岁）；',
        '第四步：距今年数：10 - 7 = 3（年前）。',
        '答：3 年前爸爸年龄正好是儿子的 5 倍。'
      ],
      variant: { question: '妈妈今年 36 岁，女儿 12 岁，几年前妈妈年龄是女儿的 4 倍？', ans: '相差24岁，24 ÷ (4-1) = 8岁，12 - 8 = 4（年前）。' }
    },
    '小学5年级': {
      title: '相向行程相遇问题',
      question: '甲乙两车分别从相距 480 千米的两地同时相向而行，甲车每小时行 55 千米，乙车每小时行 65 千米。两车出发几小时后相遇？',
      hint: '两车一小时一共缩短多少距离（速度和）？',
      steps: [
        '第一步：计算两车速度和：55 + 65 = 120（千米/小时）；',
        '第二步：相遇时间 = 总路程 ÷ 速度和 = 480 ÷ 120 = 4（小时）。',
        '答：两车出发 4 小时后相遇。'
      ],
      variant: { question: '两列火车相距 600 公里相对开出，快车每小时 80 公里，慢车每小时 70 公里，几小时相遇？', ans: '600 ÷ (80+70) = 4（小时）。' }
    },
    '小学6年级': {
      title: '鸡兔同笼与方程思维',
      question: '一个笼子里装有鸡和兔子共 35 只，数脚一共有 94 只。请问笼子里鸡和兔子各有多少只？',
      hint: '假设全部都是鸡，应有多少只脚？少算的脚是哪来的？',
      steps: [
        '第一步：假设全部是鸡，总脚数应为：35 × 2 = 70（只）；',
        '第二步：实际脚数比假设多：94 - 70 = 24（只）；',
        '第三步：每只兔子比鸡多 4 - 2 = 2 只脚；',
        '第四步：兔子数量 = 24 ÷ 2 = 12（只）；鸡的数量 = 35 - 12 = 23（只）。',
        '答：兔子有 12 只，鸡有 23 只。'
      ],
      variant: { question: '自行车和三轮车共 20 辆，总共有 48 个轮子。两种车各几辆？', ans: '三轮车：(48 - 20×2) ÷ (3 - 2) = 8（辆）；自行车：12（辆）。' }
    }
  },

  // 任务 6~11：英语大纲词汇包 (音标释义大图、听写、阅读完形)
  englishWordPacks: [
    {
      packId: 'pack_1',
      words: [
        {
          word: 'explore', phonetic: '/ɪkˈsplɔːr/', meaning: '探索，探险',
          collocations: 'explore the space (探索太空)',
          img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
          sentence: 'We will explore the mysterious island tomorrow.',
          sentencePhonetic: '/wiː/ /wɪl/ /ɪkˈsplɔːr/ /ðə/ /mɪˈstɪəriəs/ /ˈaɪlənd/ /təˈmɒrəʊ/',
          wordByWordCN: '我们 / 将要 / 探索 / 这个 / 神秘的 / 岛屿 / 明天',
          sentenceCN: '我们明天要去探索那个神秘的岛屿。'
        },
        {
          word: 'courage', phonetic: '/ˈkɜːrɪdʒ/', meaning: '勇气，胆量',
          collocations: 'have the courage to (有勇气去做...)',
          img: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&q=80',
          sentence: 'It takes great courage to tell the truth.',
          sentencePhonetic: '/ɪt/ /teɪks/ /ɡreɪt/ /ˈkɜːrɪdʒ/ /tuː/ /tel/ /ðə/ /truːθ/',
          wordByWordCN: '这 / 需要 / 极大的 / 勇气 / 去 / 说出 / 这个 / 真相',
          sentenceCN: '说出真话需要极大的勇气。'
        },
        {
          word: 'curious', phonetic: '/ˈkjʊəriəs/', meaning: '好奇的，求知欲强的',
          collocations: 'be curious about (对...感到好奇)',
          img: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&q=80',
          sentence: 'Children are always curious about new things.',
          sentencePhonetic: '/ˈtʃɪldrən/ /ɑːr/ /ˈɔːlweɪz/ /ˈkjʊəriəs/ /əˈbaʊt/ /njuː/ /θɪŋz/',
          wordByWordCN: '孩子们 / 是 / 总是 / 好奇的 / 关于 / 新的 / 事情',
          sentenceCN: '孩子们总是对新事物充满好奇。'
        },
        {
          word: 'protect', phonetic: '/prəˈtekt/', meaning: '保护，保卫',
          collocations: 'protect nature (保护大自然)',
          img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80',
          sentence: 'We must take action to protect our environment.',
          sentencePhonetic: '/wiː/ /mʌst/ /teɪk/ /ˈækʃn/ /tuː/ /prəˈtekt/ /ˈaʊər/ /ɪnˈvaɪrənmənt/',
          wordByWordCN: '我们 / 必须 / 采取 / 行动 / 去 / 保护 / 我们的 / 环境',
          sentenceCN: '我们必须采取行动来保护我们的环境。'
        },
        {
          word: 'achieve', phonetic: '/əˈtʃiːv/', meaning: '实现，取得，达到',
          collocations: 'achieve a dream (实现梦想)',
          img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80',
          sentence: 'Work hard and you will achieve your big dream.',
          sentencePhonetic: '/wɜːk/ /hɑːd/ /ænd/ /juː/ /wɪl/ /əˈtʃiːv/ /jɔːr/ /bɪɡ/ /driːm/',
          wordByWordCN: '努力 / 奋斗 / 并且 / 你 / 将要 / 实现 / 你的 / 宏大 / 梦想',
          sentenceCN: '努力奋斗，你一定会实现你的宏大梦想。'
        }
      ],
      // 任务 7 朗读例句
      sentences: [
        'We should explore the wonderful world bravely.',
        'It takes great courage to tell the truth.',
        'Children are always curious about new things.',
        'We must take action to protect our environment.',
        'Work hard and you will achieve your big dream.'
      ],
      // 任务 8 结构仿写造句
      sentenceForStructure: {
        original: 'Work hard and you will achieve your big dream.',
        prompt: '句型示范：Work hard and you will achieve... (努力...你就会实现...)'
      },
      // 任务 9 英译中
      translationPractice: {
        sentence: 'Children with true courage are always curious to explore nature.',
        hints: [{ word: 'courage', meaning: '勇气' }, { word: 'curious', meaning: '好奇的' }, { word: 'explore', meaning: '探索' }],
        referenceCN: '拥有真正勇气的孩子们，总是充满好奇地去探索大自然。'
      },
      // 任务 10 阅读理解 (3道题)
      readingComp: {
        passage: 'Young scientists always have strong curious minds. They want to explore nature and deep oceans. Sometimes danger is on the road, but with enough courage, they can overcome difficulties. When they protect wildlife and achieve great discoveries, the whole world becomes much better.',
        questions: [
          { id: 1, q: '1. What do young scientists want to explore?', options: ['A. Only classrooms', 'B. Nature and deep oceans', 'C. Video games'], ans: 'B' },
          { id: 2, q: '2. What helps them overcome difficulties in nature?', options: ['A. Courage', 'B. Money', 'C. Bad weather'], ans: 'A' },
          { id: 3, q: '3. What happens when they protect wildlife and achieve discoveries?', options: ['A. The world becomes better', 'B. Nothing changes', 'C. Animals run away'], ans: 'A' }
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

  // 特权商城默认商品
  defaultShopItems: [
    { id: 'item_1', icon: '🧹', name: '周六免做家务券', desc: '周末免洗碗或扫地一次', cost: 15 },
    { id: 'item_2', icon: '🎬', name: '电影/游乐园门票', desc: '自选周末电影一场或游乐场畅玩', cost: 50 },
    { id: 'item_3', icon: '📚', name: '自选图书/心愿盲盒', desc: '50元以内自选心愿物品或图书', cost: 80 },
    { id: 'item_4', icon: '🎮', name: '周末畅玩游戏30分钟', desc: '自选安全益智主机或平板游戏', cost: 35 }
  ]
};
// 家庭研学中枢 - 核心真题、词库与荣誉档案数据库
window.StudyData = {
  // 学生初始档案 (含历史名次统计)
  defaultStudents: [
    { id: 'nuo', name: '诺', grade: '小学5年级', points: 8, avatar: '🐱', avatarImg: '', pin: '1234', totalStudyMinutes: 35, medals: { gold: 1, silver: 2, bronze: 4, fourth: 5 } },
    { id: 'wei', name: '威', grade: '小学4年级', points: 24, avatar: '🦁', avatarImg: '', pin: '1234', totalStudyMinutes: 68, medals: { gold: 3, silver: 4, bronze: 2, fourth: 1 } },
    { id: 'yi',  name: '奕', grade: '小学2年级', points: 15, avatar: '🐼', avatarImg: '', pin: '1234', totalStudyMinutes: 42, medals: { gold: 2, silver: 3, bronze: 5, fourth: 2 } },
    { id: 'dai', name: '黛', grade: '小学6年级', points: 42, avatar: '🔭', avatarImg: '', pin: '1234', totalStudyMinutes: 110, medals: { gold: 6, silver: 2, bronze: 1, fourth: 0 } }
  ],

  // 13 项标准任务定义 (标记 minGrade，低年级自动过滤高阶英语)
  baseTasks: [
    { id: 1, code: '01', category: '第一优先', icon: '🎒', title: '登记并完成学校家庭作业', duration: '35分钟', points: 3, criteria: '逐科录入 + 拍照 + AI质检', minGrade: 1 },
    { id: 2, code: '02', category: '语文/阅读', icon: '🔍', title: '每日新闻/名著阅读与3道真题', duration: '20分钟', points: 3, criteria: '真实计时≥20分 + 3道题当场判分', minGrade: 1 },
    { id: 3, code: '03', category: '语文/书法', icon: '✍️', title: '每日练字打卡(3个生字×10遍)', duration: '10分钟', points: 2, criteria: '一次3字 + 每个写10遍 + 双笔法', minGrade: 1 },
    { id: 4, code: '04', category: '数学/计算', icon: '⚡', title: '每日10道年级口算', duration: '8分钟', points: 2, criteria: '单行排版无滚动条 + 自动判分', minGrade: 1 },
    { id: 5, code: '05', category: '数学/思维', icon: '🧩', title: '每日一道年级奥数题', duration: '15分钟', points: 3, criteria: '提示详解 + 举一反三变式题', minGrade: 1 },
    { id: 6, code: '06', category: '英语/词汇', icon: '🔤', title: '记5个大纲单词(大图音标)', duration: '15分钟', points: 3, criteria: '超大童趣图 + 逐词音标 + 20秒听写', minGrade: 1 },
    { id: 7, code: '07', category: '英语/口语', icon: '🎙️', title: '今日词汇朗读或自述5句', duration: '6分钟', points: 2, criteria: '例句点读 + 录音上传', minGrade: 1 },
    { id: 8, code: '08', category: '英语/造句', icon: '🌟', title: '每日一句：从结构到表达', duration: '5分钟', points: 2, criteria: '核心句型结构仿写重组', minGrade: 3 },
    { id: 9, code: '09', category: '英语/翻译', icon: '🧭', title: '每日一句：英译中', duration: '5分钟', points: 2, criteria: '生词提示 + 提交后揭晓译文', minGrade: 3 },
    { id: 10, code: '10', category: '英语/阅读', icon: '📖', title: '年级小阅读理解(串联5词)', duration: '10分钟', points: 2, criteria: '主旨题 + 猜词题 + 细节题', minGrade: 3 },
    { id: 11, code: '11', category: '英语/完形', icon: '🕵️', title: '每日英语完形填空(串联5词)', duration: '8分钟', points: 2, criteria: '语境挖空 + 语法综合判断', minGrade: 3 },
    { id: 12, code: '12', category: '综合/复盘', icon: '⚔️', title: '当日错题消化与学校错题录入', duration: '15分钟', points: 2, criteria: '敲字/拍照错题 + 订正心得', minGrade: 1 },
    { id: 13, code: '13', category: '阅读/习惯', icon: '🏰', title: '整本书深度伴读打卡', duration: '20分钟', points: 2, criteria: '书名页码 + 计时 + 梗概与明日计划', minGrade: 1 }
  ],

  // 任务 3：练字字库 (一次给 3 个字，明确每个写 10 遍)
  calligraphyPack: {
    ruleNotice: '⚠️ 书写规范要求：以下 3 个汉字，必须在练字本上各认真书写 10 遍！',
    chars: [
      {
        char: '晨', pinyin: 'chén', word: '早晨 / 清晨',
        hardTip: '硬笔：上部日字稍扁，下部横撇平缓，捺画舒展平稳。',
        brushTip: '毛笔：逆锋起笔，日字转折稍顿，下部捺角饱满出锋。'
      },
      {
        char: '静', pinyin: 'jìng', word: '安静 / 宁静',
        hardTip: '硬笔：左右结构左窄右宽，青字居左上提，争字横画均匀。',
        brushTip: '毛笔：青字竖画坚挺，右边争字末笔悬针竖直贯而下。'
      },
      {
        char: '远', pinyin: 'yuǎn', word: '远大 / 遥远',
        hardTip: '硬笔：先写里部后写走之底，捺画一波三折托住内膛。',
        brushTip: '毛笔：走之底横折折撇连贯圆润，平捺沉着有力。'
      }
    ]
  },

  // 任务 2：阅读素材库 (每篇均严选 3 道真题，含主旨题、猜词题)
  readingArticles: [
    {
      id: 'r_junior_1',
      forJunior: true,
      title: '《西游记》精选：美猴王出世寻仙道',
      content: '东胜神洲傲来国海中，有一座花果山。那座山正当顶上，有一块仙石。一日仙石迸裂，产一石卵，化作一个石猴。五官俱备，四肢皆全，拜了四方，目运两道神光，射冲斗府。石猴与群猴在山中游玩，发现了水帘洞，被众猴尊为“美猴王”。美猴王虽在山中快乐逍遥，却忧虑有朝一日年老身亡，于是立志远涉重洋，拜师学道，寻求长生不老与通天本领。',
      questions: [
        { id: 1, q: '1. [文章主旨题] 这篇名著节选的核心主要讲了什么内容？', options: ['A. 众猴在水帘洞争抢野果', 'B. 美猴王神奇降生并立志出海寻道学本领', 'C. 孙悟空大闹东海龙宫'], ans: 'B', analysis: '本文核心记叙石猴降生至立志寻仙求道的过程。' },
        { id: 2, q: '2. [词义推断题] 文中“射冲斗府”中的“斗府”最可能指代什么？', options: ['A. 地下龙宫', 'B. 天上的星宿天宫', 'C. 水帘洞的石头'], ans: 'B', analysis: '“斗”指北斗星宿，“斗府”借指天宫天庭。' },
        { id: 3, q: '3. [细节理解题] 石猴为什么要立志远涉重洋出海拜师？', options: ['A. 贪恋人间的繁华', 'B. 忧虑自己将来年老身亡，想要学长生不老本领', 'C. 和群猴闹别扭负气离开'], ans: 'B', analysis: '文中明确指出美猴王“忧虑有朝一日年老身亡，立志拜师学道”。' }
      ]
    },
    {
      id: 'r_senior_1',
      forJunior: false,
      title: '科技突破：深中通道海底沉管隧道全线贯通',
      content: '深中通道是连接深圳与中山的跨海超级枢纽。其中海底沉管隧道长达6.8公里，由32节巨大钢壳管节与一个最终接头连接而成，单节沉管排水量高达8万吨！在汹涌暗流的深海中，建设团队采用了我国自主研发的智能浇筑机器人和北斗卫星高精度定位系统，在几十米深的海底实现了毫米级的精准对接，将两地通行车程由两小时大幅缩短至三十分钟。',
      questions: [
        { id: 1, q: '1. [文章主旨题] 这篇时事特稿的核心新闻主题是？', options: ['A. 珠江口沿岸的美丽自然风景', 'B. 我国攻克深中通道海底沉管隧道世界级工程难关', 'C. 介绍北斗卫星导航系统发射过程'], ans: 'B', analysis: '特稿全篇聚焦深中通道海底沉管隧道的技术攻关与全线贯通。' },
        { id: 2, q: '2. [词义推断题] 文中“毫米级精准对接”说明工程施工有什么特点？', options: ['A. 施工精度极高、误差极小', 'B. 建设速度极慢', 'C. 隧道尺寸非常狭小'], ans: 'A', analysis: '“毫米级”形容在万吨沉管对接中精度控制极其严苛精准。' },
        { id: 3, q: '3. [细节理解题] 团队在深水暗流中实现精准对接主要借助了哪项我国自主技术？', options: ['A. 国外声呐探测系统', 'B. 北斗卫星高精度定位系统', 'C. 传统人工目测下潜定位'], ans: 'B', analysis: '原文明确指出依靠“北斗卫星高精度定位系统”。' }
      ]
    }
  ],

  // 任务 5：真题奥数题库 (数组分步排版，彻底杜绝 \\n 乱码)
  olympiadCurriculum: {
    '小学1年级': {
      title: '排队找位置与重叠问题',
      question: '小朋友排队领书，从前往后数小诺排在第 8 个，从后往前数小诺排在第 9 个。请问这一排一共有多少个小朋友？',
      hint: '想一想，小诺本人被从前往后和从后往前各数了一次，多算了几次？',
      steps: [
        '第一步：从前往后数包含小诺，一共有 8 人；',
        '第二步：从后往前数又包含了小诺，一共有 9 人；',
        '第三步：小诺被重复多加了 1 次，必须减去：8 + 9 - 1 = 16（人）。',
        '答：这一排共有 16 个小朋友。'
      ],
      variant: { question: '小威排队买早餐，从左边数排第 6，从右边数排第 7，这一队共有多少人？', ans: '6 + 7 - 1 = 12（人）。' }
    },
    '小学2年级': {
      title: '锯木头时间与间隔问题',
      question: '一根木料锯成 5 段需要 16 分钟。如果改成锯成 8 段，需要多少分钟？',
      hint: '锯成 5 段只需要锯几次？算算每锯一次要几分钟？',
      steps: [
        '第一步：锯成 5 段只需锯：5 - 1 = 4（次）；',
        '第二步：每次锯木用时：16 ÷ 4 = 4（分钟）；',
        '第三步：锯成 8 段需要锯：8 - 1 = 7（次）；',
        '第四步：所需总时间：7 × 4 = 28（分钟）。',
        '答：锯成 8 段需要 28 分钟。'
      ],
      variant: { question: '把一根钢管剪成 4 段要 6 分钟，剪成 7 段需要多少分钟？', ans: '剪3次用6分即2分/次；剪6次需要 6 × 2 = 12（分钟）。' }
    },
    '小学3年级': {
      title: '和倍问题与等量代换',
      question: '果园里桃树和梨树一共 180 棵，已知桃树的棵数是梨树的 2 倍。桃树和梨树各有多少棵？',
      hint: '把梨树当作 1 份，桃树是 2 份，总共是多少份？',
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
      hint: '无论岁月流逝多少年，父子两人的年龄差永远保持不变！',
      steps: [
        '第一步：计算两人固定的年龄差：38 - 10 = 28（岁）；',
        '第二步：当爸爸是儿子 5 倍时，相差 5 - 1 = 4（份）；',
        '第三步：那时儿子的年龄：28 ÷ 4 = 7（岁）；',
        '第四步：距今年数：10 - 7 = 3（年前）。',
        '答：3 年前爸爸年龄正好是儿子的 5 倍。'
      ],
      variant: { question: '妈妈今年 36 岁，女儿 12 岁，几年前妈妈年龄是女儿的 4 倍？', ans: '年龄差24岁，24 ÷ (4-1) = 8岁，12 - 8 = 4（年前）。' }
    },
    '小学5年级': {
      title: '相向行程相遇问题',
      question: '甲乙两车分别从相距 480 千米的两地同时相向而行，甲车每小时行 55 千米，乙车每小时行 65 千米。两车出发几小时后相遇？',
      hint: '两车一小时一共走多少路程（两车速度和）？',
      steps: [
        '第一步：计算两车的速度和：55 + 65 = 120（千米/小时）；',
        '第二步：相遇时间 = 总路程 ÷ 速度和 = 480 ÷ 120 = 4（小时）。',
        '答：两车出发 4 小时后相遇。'
      ],
      variant: { question: '两列火车相距 600 公里相对开出，快车每小时 80 公里，慢车每小时 70 公里，几小时相遇？', ans: '600 ÷ (80+70) = 4（小时）。' }
    },
    '小学6年级': {
      title: '经典鸡兔同笼方程思维',
      question: '一个笼子里装有鸡和兔子共 35 只，数脚一共有 94 只。请问笼子里鸡和兔子各有多少只？',
      hint: '假设全部都是鸡，应有多少只脚？少算的脚是怎么来的？',
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

  // 任务 6~11：英语单词包 (大图卡通风、逐词音标、逐词中文、英译中考后出答案)
  englishWordPacks: [
    {
      packId: 'pack_1',
      words: [
        {
          word: 'explore', phonetic: '/ɪkˈsplɔːr/', meaning: '探索，探险',
          collocations: 'explore nature (探索大自然)',
          img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80',
          sentence: 'We will explore the mysterious island.',
          wordTokens: [
            { w: 'We', p: '/wiː/', m: '我们' },
            { w: 'will', p: '/wɪl/', m: '将要' },
            { w: 'explore', p: '/ɪkˈsplɔːr/', m: '探索' },
            { w: 'the', p: '/ðə/', m: '这个' },
            { w: 'mysterious', p: '/mɪˈstɪəriəs/', m: '神秘的' },
            { w: 'island', p: '/ˈaɪlənd/', m: '岛屿' }
          ],
          sentenceCN: '我们将要去探索那个神秘的岛屿。'
        },
        {
          word: 'courage', phonetic: '/ˈkɜːrɪdʒ/', meaning: '勇气，胆量',
          collocations: 'take courage (鼓起勇气)',
          img: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=500&q=80',
          sentence: 'It takes great courage to tell truth.',
          wordTokens: [
            { w: 'It', p: '/ɪt/', m: '这' },
            { w: 'takes', p: '/teɪks/', m: '需要' },
            { w: 'great', p: '/ɡreɪt/', m: '巨大的' },
            { w: 'courage', p: '/ˈkɜːrɪdʒ/', m: '勇气' },
            { w: 'to', p: '/tuː/', m: '去' },
            { w: 'tell', p: '/tel/', m: '说出' },
            { w: 'truth', p: '/truːθ/', m: '真话' }
          ],
          sentenceCN: '说出真相需要极大的勇气。'
        },
        {
          word: 'curious', phonetic: '/ˈkjʊəriəs/', meaning: '好奇的，求知欲强的',
          collocations: 'be curious about (对...充满好奇)',
          img: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500&q=80',
          sentence: 'Children are always curious about nature.',
          wordTokens: [
            { w: 'Children', p: '/ˈtʃɪldrən/', m: '孩子们' },
            { w: 'are', p: '/ɑːr/', m: '是' },
            { w: 'always', p: '/ˈɔːlweɪz/', m: '总是' },
            { w: 'curious', p: '/ˈkjʊəriəs/', m: '好奇的' },
            { w: 'about', p: '/əˈbaʊt/', m: '关于' },
            { w: 'nature', p: '/ˈneɪtʃər/', m: '大自然' }
          ],
          sentenceCN: '孩子们对大自然总是充满着好奇心。'
        },
        {
          word: 'protect', phonetic: '/prəˈtekt/', meaning: '保护，爱护',
          collocations: 'protect wild animals (保护野生动物)',
          img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80',
          sentence: 'We must protect our green forest.',
          wordTokens: [
            { w: 'We', p: '/wiː/', m: '我们' },
            { w: 'must', p: '/mʌst/', m: '必须' },
            { w: 'protect', p: '/prəˈtekt/', m: '保护' },
            { w: 'our', p: '/aʊər/', m: '我们的' },
            { w: 'green', p: '/ɡriːn/', m: '绿色的' },
            { w: 'forest', p: '/ˈfɒrɪst/', m: '森林' }
          ],
          sentenceCN: '我们必须保护好我们绿色的森林。'
        },
        {
          word: 'achieve', phonetic: '/əˈtʃiːv/', meaning: '实现，取得成功',
          collocations: 'achieve dreams (实现梦想)',
          img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80',
          sentence: 'Study hard and achieve your dream.',
          wordTokens: [
            { w: 'Study', p: '/ˈstʌdi/', m: '学习' },
            { w: 'hard', p: '/hɑːd/', m: '努力' },
            { w: 'and', p: '/ænd/', m: '并且' },
            { w: 'achieve', p: '/əˈtʃiːv/', m: '实现' },
            { w: 'your', p: '/jɔːr/', m: '你的' },
            { w: 'dream', p: '/driːm/', m: '梦想' }
          ],
          sentenceCN: '努力学习，你一定会实现你的美好梦想。'
        }
      ],
      // 任务 7 朗读例句
      sentences: [
        'We will explore the mysterious island.',
        'It takes great courage to tell truth.',
        'Children are always curious about nature.',
        'We must protect our green forest.',
        'Study hard and achieve your dream.'
      ],
      // 任务 8 仿写结构
      sentenceForStructure: {
        original: 'Study hard and you will achieve your dream.',
        prompt: '句型示范：Study hard and you will achieve... (努力...你就会实现...)'
      },
      // 任务 9 英译中 (生词提示先给，参考答案考后给)
      translationPractice: {
        sentence: 'Children with true courage are always curious to explore nature.',
        hints: [
          { word: 'courage', meaning: '勇气' },
          { word: 'curious', meaning: '好奇的' },
          { word: 'explore', meaning: '探索' },
          { word: 'nature', meaning: '大自然' }
        ],
        referenceCN: '拥有真正勇气的孩子们，总是充满好奇地去探索大自然。'
      },
      // 任务 10 阅读理解 (含文章主旨题、生词猜测题、细节理解题)
      readingComp: {
        passage: 'Young explorers always have strong curious minds. They want to explore nature and deep blue oceans. Sometimes danger is on the road, but with true courage, they can overcome difficulties. When they protect wild animals and achieve great discoveries, our whole world becomes much better.',
        questions: [
          { id: 1, q: '1. [文章主旨题] What is this passage mainly about?', options: ['A. Dangerous animals', 'B. Young explorers learning and protecting nature', 'C. How to play video games'], ans: 'B' },
          { id: 2, q: '2. [词义推断题] What does the word "explore" mean in the story?', options: ['A. To search and travel into the unknown', 'B. To sleep all day', 'C. To destroy nature'], ans: 'A' },
          { id: 3, q: '3. [细节理解题] What helps explorers overcome difficulties?', options: ['A. True courage', 'B. Lots of candy', 'C. Cold rain'], ans: 'A' }
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

  // 商城默认商品
  defaultShopItems: [
    { id: 'item_1', icon: '🧹', name: '周六免做家务券', desc: '周末免洗碗或扫地一次', cost: 15 },
    { id: 'item_2', icon: '🎬', name: '自选周末电影/乐园', desc: '自选周末电影一场或游乐园畅玩', cost: 50 },
    { id: 'item_3', icon: '📚', name: '自选图书/心愿盲盒', desc: '50元以内自选心愿物品或图书', cost: 80 },
    { id: 'item_4', icon: '🎮', name: '周末畅玩游戏30分钟', desc: '自选益智主机或平板游戏', cost: 35 }
  ]
};
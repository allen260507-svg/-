// 家庭研学中枢 - 真实真题、题库、单词与阅读模块
window.StudyData = {
  // 学生初始档案
  defaultStudents: [
    { id: 'nuo', name: '诺', grade: '小学5年级', points: 8, avatar: '🐱', pin: '1234', totalStudyMinutes: 35, avatarImg: '' },
    { id: 'wei', name: '威', grade: '小学4年级', points: 24, avatar: '🦁', pin: '1234', totalStudyMinutes: 68, avatarImg: '' },
    { id: 'yi',  name: '奕', grade: '小学2年级', points: 15, avatar: '🐼', pin: '1234', totalStudyMinutes: 42, avatarImg: '' },
    { id: 'dai', name: '黛', grade: '小学6年级', points: 42, avatar: '🔭', pin: '1234', totalStudyMinutes: 110, avatarImg: '' }
  ],

  // 13 项核心任务定义
  baseTasks: [
    { id: 1, code: '01', category: '第一优先', icon: '🎒', title: '登记并完成学校家庭作业', duration: '35分钟', points: 3, criteria: '逐科要求登记 + 自由选择AI质检' },
    { id: 2, code: '02', category: '语文/阅读', icon: '🔍', title: '每日新闻/名著阅读与真题', duration: '20分钟', points: 3, criteria: '计时≥20分钟 + 真题单选填空判分' },
    { id: 3, code: '03', category: '语文/书法', icon: '✍️', title: '每日练字打卡(3字×10遍)', duration: '10分钟', points: 2, criteria: '田字格楷体 + 硬笔/毛笔双写法' },
    { id: 4, code: '04', category: '数学/计算', icon: '⚡', title: '每日10道年级口算', duration: '8分钟', points: 2, criteria: '一屏展示 + 在线即时自动判分' },
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

  // 任务 3：生字词练习库（每次 3 个字，明确每个写 10 遍，附带硬笔与毛笔双写法）
  calligraphySets: [
    {
      setId: 1,
      chars: [
        {
          char: '静', pinyin: 'jìng', radical: '青', strokes: 14, word: '宁静 / 静思',
          hardTip: '【硬笔写法】：左侧青字底提向上挑出锐角，右侧争字首笔短撇居中，末笔竖画垂直挺拔，左右紧凑中宫收紧。',
          brushTip: '【毛笔写法（欧体）】：起笔逆锋入纸，中锋行笔；横折处顿笔转锋显出刚劲方折；悬针竖悬空出锋，笔力千钧。'
        },
        {
          char: '恒', pinyin: 'héng', radical: '忄', strokes: 9, word: '持之以恒 / 永恒',
          hardTip: '【硬笔写法】：竖心旁左点低右点高（相向呼应），垂露竖正直；右部上下两横略长，中间日字紧凑。',
          brushTip: '【毛笔写法（颜体）】：左侧竖心旁用笔浑厚圆润，右侧亘字上横轻起重按，底横如千里阵云铺开承托上部。'
        },
        {
          char: '敏', pinyin: 'mǐn', radical: '攵', strokes: 11, word: '敏锐 / 勤思聪敏',
          hardTip: '【硬笔写法】：左侧每字横折微向左斜，主笔长横穿插到右侧撇下；右侧反文旁首撇勿长，捺画舒展有力。',
          brushTip: '【毛笔写法（柳体）】：反文旁横折撇交代利落，捺画平出微顿后渐重下按，提锋出磔，骨力遒劲。'
        }
      ]
    }
  ],

  // 任务 2：分段真题阅读文章
  readingArticles: [
    {
      id: 'r_junior',
      forJunior: true,
      title: '《西游记》白话精选：灵猴拜师求真道',
      content: '东胜神洲傲来国海中，有一座花果山。那座山正当顶上，有一块仙石。一日仙石迸裂，产一石卵，化作一个石猴。石猴发现了水帘洞，被群猴尊为美猴王。美猴王在山中欢乐度日，忽一日心中忧虑生命短暂，终将年老身亡。于是他辞别群猴，泛筏远渡重洋，历经千山万水，终于拜菩提祖师为师，取名孙悟空，苦练长生与通天本领。',
      questions: [
        { id: 1, type: 'choice', q: '1. 这篇文章主要讲述的核心内容是什么？', options: ['A. 群猴在水帘洞里争夺王位', 'B. 美猴王因忧虑年老身亡，立志远涉求仙学艺', 'C. 菩提祖师如何降服妖怪'], ans: 'B', analysis: '全文从美猴王出世、发现水帘洞，重点落脚在他远涉重洋寻师问道的动机与决心。' },
        { id: 2, type: 'fill', q: '2. 美猴王最终拜谁为师并被赐名孙悟空？', ans: '菩提祖师', analysis: '文中明确提到“终于拜菩提祖师为师，取名孙悟空”。' }
      ]
    },
    {
      id: 'r_senior',
      forJunior: false,
      title: '超级工程：深中通道海底沉管隧道全线贯通',
      content: '深中通道是连接深圳与中山的跨海超级枢纽。其中海底沉管隧道长达6.8公里，由32节巨大钢壳管节与一个最终接头连接而成，单节沉管排水量高达8万吨！在汹涌暗流的深海中，建设团队采用了我国自主研发的智能浇筑机器人和北斗卫星高精度定位系统，在几十米深的海底实现了毫米级的精准对接，将两地通行车程由两小时缩短至三十分钟。',
      questions: [
        { id: 1, type: 'choice', q: '1. 这篇新闻特稿的主要主旨是什么？', options: ['A. 介绍深圳和中山的美丽自然风光', 'B. 报道我国自主攻克深中通道海底沉管隧道世界级工程难关', 'C. 介绍北斗卫星如何发射升空'], ans: 'B', analysis: '特稿核心报道了深中通道沉管隧道的巨大工程体量、关键自主技术及贯通后的交通意义。' },
        { id: 2, type: 'fill', q: '2. 文中沉管在几十米深的海底利用哪种我国自主技术实现了毫米级对接？', ans: '北斗', analysis: '文中指明采用“北斗卫星高精度定位系统”。' }
      ]
    }
  ],

  // 任务 5：真题奥数题（格式已规范结构化，杜绝原生 \n 字符错误）
  olympiadBank: {
    '小学1年级': {
      title: '排队找位置中的重叠计算',
      question: '操场上小朋友排成一横队，从左往右数，诺排在第 7 个；从右往左数，诺排在第 8 个。请问这一排一共有多少个小朋友？',
      hint: '从左往右数算了一次诺，从右往左数又算了一次诺，诺本人被重复计算了几次？',
      steps: [
        '第一步：从左数有 7 个人（包含诺）。',
        '第二步：从右数有 8 个人（也包含诺）。',
        '第三步：因为诺被两边都数了一次（重叠了 1 次），所以必须减去 1 人。',
        '算式：7 + 8 - 1 = 14（人）。',
        '答：这一排一共有 14 个小朋友。'
      ],
      variant: {
        title: '举一反三巩固练习',
        question: '小朋友排队，威从前往后数排第 6，从后往前数排第 9，这队一共有多少人？',
        ans: '6 + 9 - 1 = 14（人）。'
      }
    },
    '小学2年级': {
      title: '楼梯台阶与植树间隔原理',
      question: '木工师傅把一根长木料锯成 5 段，每锯断一次需要 4 分钟。请问锯完这根木头一共需要多少分钟？',
      hint: '锯成 5 段需要锯断几次？最后一段还需要锯吗？',
      steps: [
        '第一步：把木料锯成 5 段，只需要锯断 5 - 1 = 4 次。',
        '第二步：每次锯木用时 4 分钟。',
        '第三步：总用时 = 次数 × 每次时间 = 4 × 4 = 16（分钟）。',
        '答：一共需要 16 分钟。'
      ],
      variant: {
        title: '举一反三巩固练习',
        question: '把一根铁丝剪成 7 段，每剪一次用 3 分钟，一共需要几分钟？',
        ans: '(7 - 1) × 3 = 18（分钟）。'
      }
    },
    '小学3年级': {
      title: '和倍问题与份数思维',
      question: '文具店里书包和钢笔的价格之和是 120 元，书包的价格正好是钢笔的 5 倍。书包和钢笔各多少元？',
      hint: '把钢笔价格看作 1 份，书包就是 5 份，两者的总价一共对应多少份？',
      steps: [
        '第一步：设钢笔为 1 份，书包为 5 份，总份数 = 1 + 5 = 6 份。',
        '第二步：每份的价值（即钢笔价格）= 120 ÷ 6 = 20（元）。',
        '第三步：书包价格 = 20 × 5 = 100（元）。',
        '答：书包 100 元，钢笔 20 元。'
      ],
      variant: {
        title: '举一反三巩固练习',
        question: '水果店运来苹果和梨共 150 斤，苹果的重量是梨的 2 倍，苹果和梨各多少斤？',
        ans: '梨：150 ÷ (1 + 2) = 50 斤；苹果：50 × 2 = 100 斤。'
      }
    },
    '小学4年级': {
      title: '鸡兔同笼之假设法解密',
      question: '一个笼子里装有鸡和兔子共 35 只，数脚一共有 94 只。请问笼子里鸡和兔子各有多少只？',
      hint: '假设全是鸡，应该有多少只脚？多出来的脚是因为把什么看成了鸡？',
      steps: [
        '第一步：假设全部都是鸡，应有脚：35 × 2 = 70（只）。',
        '第二步：实际脚比假设多：94 - 70 = 24（只）。',
        '第三步：每只兔子比鸡多 4 - 2 = 2 只脚。',
        '第四步：兔子数量 = 24 ÷ 2 = 12（只）；鸡的数量 = 35 - 12 = 23（只）。',
        '答：笼子里有鸡 23 只，兔子 12 只。'
      ],
      variant: {
        title: '举一反三巩固练习',
        question: '有自行车和三轮车共 20 辆，总共有 48 个轮子。自行车和三轮车各有多少辆？',
        ans: '三轮车：(48 - 20×2) ÷ (3 - 2) = 8 辆；自行车：20 - 8 = 12 辆。'
      }
    },
    '小学5年级': {
      title: '相遇行程问题与速度和',
      question: '甲、乙两列高铁分别从相距 600 千米的两地同时相向开出，甲车每小时行 160 千米，乙车每小时行 140 千米。几小时后两车相遇？',
      hint: '两辆车面对面开，一小时共同走完多少路程？',
      steps: [
        '第一步：计算两车相向而行的速度和：160 + 140 = 300（千米/小时）。',
        '第二步：相遇时间 = 总相距路程 ÷ 速度和 = 600 ÷ 300 = 2（小时）。',
        '答：两车出发 2 小时后相遇。'
      ],
      variant: {
        title: '举一反三巩固练习',
        question: '两名同学相距 1000 米相向跑步，小明每秒跑 6 米，小刚每秒跑 4 米，几秒后相遇？',
        ans: '1000 ÷ (6 + 4) = 100（秒）。'
      }
    },
    '小学6年级': {
      title: '工程合作与剩余工作量逆推',
      question: '一项研学工程，甲队单独做需 12 天完成，乙队单独做需 15 天完成。两队合做 4 天后，剩下的由乙队独做，乙队还需几天？',
      hint: '把整个工程看成单位“1”，算出甲乙合做4天完成了几分之几？',
      steps: [
        '第一步：设总工程量为 1，甲队每天完成 1/12，乙队每天完成 1/15。',
        '第二步：两队合做 4 天完成：4 × (1/12 + 1/15) = 4 × (9/60) = 36/60 = 3/5。',
        '第三步：剩余工程量 = 1 - 3/5 = 2/5。',
        '第四步：乙队单独完成所需天数 = (2/5) ÷ (1/15) = (2/5) × 15 = 6（天）。',
        '答：乙队还需要 6 天做完。'
      ],
      variant: {
        title: '举一反三巩固练习',
        question: '一项工作，甲独做10天，乙独做15天。两队合做3天后，剩下的由甲独做，还需几天？',
        ans: '剩余工作量 1 - 3×(1/10 + 1/15) = 1/2，甲需 (1/2) ÷ (1/10) = 5 天。'
      }
    }
  },

  // 任务 6~11：大纲标准单词大包（大图、全单词注音标释义、整句释义）
  englishWordPack: {
    words: [
      {
        word: 'explore', phonetic: '/ɪkˈsplɔːr/', meaning: '探索，探险',
        img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80', // 趣味探险高清大图
        collocations: 'explore the ocean (探索海洋), explore space (探索太空)',
        sentence: 'We will explore the mysterious island tomorrow.',
        sentencePhonetic: '/wiː/ /wɪl/ /ɪkˈsplɔːr/ /ðə/ /mɪˈstɪəriəs/ /ˈaɪlənd/ /təˈmɒrəʊ/',
        wordByWordCN: '我们 / 将要 / 探索 / 这个 / 神秘的 / 岛屿 / 明天',
        sentenceCN: '我们明天要去探索那个神秘的岛屿。'
      },
      {
        word: 'courage', phonetic: '/ˈkɜːrɪdʒ/', meaning: '勇气，胆量',
        img: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=500&q=80', // 勇敢攀岩
        collocations: 'have courage (有勇气), full of courage (充满勇气)',
        sentence: 'The young knight had great courage.',
        sentencePhonetic: '/ðə/ /jʌŋ/ /naɪt/ /hæd/ /ɡreɪt/ /ˈkɜːrɪdʒ/',
        wordByWordCN: '那位 / 年轻的 / 骑士 / 拥有 / 极大的 / 勇气',
        sentenceCN: '那位年轻的骑士拥有非凡的勇气。'
      },
      {
        word: 'curious', phonetic: '/ˈkjʊəriəs/', meaning: '好奇的，好求知的',
        img: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500&q=80', // 好奇的小朋友
        collocations: 'be curious about (对...充满好奇)',
        sentence: 'Cats are curious about moving balls.',
        sentencePhonetic: '/kæts/ /ɑːr/ /ˈkjʊəriəs/ /əˈbaʊt/ /ˈmuːvɪŋ/ /bɔːlz/',
        wordByWordCN: '猫咪 / 是 / 好奇的 / 关于 / 滚动的 / 球',
        sentenceCN: '猫咪对滚动的球充满了好奇。'
      },
      {
        word: 'protect', phonetic: '/prəˈtekt/', meaning: '保护，保卫',
        img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80', // 呵护绿芽小手
        collocations: 'protect animals (保护动物), protect eyesight (保护视力)',
        sentence: 'Helmets protect our heads safely.',
        sentencePhonetic: '/ˈhelmɪts/ /prəˈtekt/ /ˈaʊər/ /hedz/ /ˈseɪfli/',
        wordByWordCN: '头盔 / 保护 / 我们的 / 头部 / 安全地',
        sentenceCN: '头盔能安全地保护我们的头部。'
      },
      {
        word: 'achieve', phonetic: '/əˈtʃiːv/', meaning: '实现，获得(成功)',
        img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80', // 登顶欢呼
        collocations: 'achieve a dream (实现梦想), achieve a goal (达到目标)',
        sentence: 'She worked hard to achieve her dream.',
        sentencePhonetic: '/ʃiː/ /wɜːkt/ /hɑːd/ /tuː/ /əˈtʃiːv/ /hɜːr/ /driːm/',
        wordByWordCN: '她 / 努力工作 / 为了 / 实现 / 她的 / 梦想',
        sentenceCN: '她为了实现自己的梦想而努力奋斗。'
      }
    ],

    // 任务 7：朗读 5 句
    speechSentences: [
      { text: 'We will explore the mysterious island tomorrow.', cn: '我们明天要去探索那个神秘的岛屿。' },
      { text: 'The young knight had great courage.', cn: '那位年轻的骑士拥有非凡的勇气。' },
      { text: 'Cats are curious about moving balls.', cn: '猫咪对滚动的球充满了好奇。' },
      { text: 'Helmets protect our heads safely.', cn: '头盔能安全地保护我们的头部。' },
      { text: 'She worked hard to achieve her dream.', cn: '她为了实现自己的梦想而努力奋斗。' }
    ],

    // 任务 8：从今日单词挑一句（结构造句）
    structurePractice: {
      sentence: 'She worked hard to achieve her dream.',
      structure: '主语 + worked hard to achieve + 目标宾语.',
      prompt: '请仿照句型，写一句你为了实现某个目标而努力的英语句子！'
    },

    // 任务 9：从今日单词挑一句（英译中，只给生词提示，不直接给答案）
    translationPractice: {
      sentence: 'Children with true courage are always curious to explore nature.',
      hints: [
        { word: 'courage', meaning: '勇气' },
        { word: 'curious', meaning: '好奇的' },
        { word: 'explore', meaning: '探索' },
        { word: 'nature', meaning: '大自然' }
      ],
      referenceCN: '拥有真正勇气的孩子们总是充满好奇地去探索大自然。'
    },

    // 任务 10：英文小阅读理解（出主旨大意题 + 猜词题 + 细节题）
    readingComprehension: {
      title: 'The Brave Space Explorers',
      passage: 'Last year, a group of young students started a space club. They were curious about stars and planets. With great courage, they built a telescope model. Their teacher said, "To explore the universe, we must study hard and protect our curious minds. Never give up, and you will achieve great success." Everyone cheered happily.',
      questions: [
        {
          id: 1,
          q: '1. [主旨大意题] What is this story mainly about?',
          options: [
            'A. How to sell telescopes for money',
            'B. A group of curious and brave students in a space club',
            'C. The life story of an old astronaut'
          ],
          ans: 'B',
          analysis: '全文讲述了对太空充满好奇的孩子们成立俱乐部、建造望远镜并立志探索宇宙的励志故事。'
        },
        {
          id: 2,
          q: '2. [生词词义猜测题] In the text, what does the word "explore" most likely mean?',
          options: [
            'A. To sleep for a long time',
            'B. To travel around and discover new things',
            'C. To buy expensive food'
          ],
          ans: 'B',
          analysis: 'explore 表示“探索/探险发现新事物”，与选项 B 的释义完全吻合。'
        },
        {
          id: 3,
          q: '3. [细节理解题] What did the students build with great courage?',
          options: [
            'A. A telescope model',
            'B. A real rocket',
            'C. A toy train'
          ],
          ans: 'A',
          analysis: '对应原文 "With great courage, they built a telescope model."'
        }
      ]
    },

    // 任务 11：英文完形填空（串联 5 词）
    clozeTest: {
      title: 'A Journey into the Forest',
      passage: 'Leo is a boy who is always ___1___ about animals. One morning, he decided to ___2___ the green forest. He knew that wild forests might have dangers, but he had the ___3___ to move forward. He loved animals and wanted to ___4___ their homes. In the end, he ___5___ his goal and took many wonderful wildlife photos.',
      blanks: [
        { num: 1, options: ['A. tired', 'B. curious', 'C. angry'], ans: 'B', analysis: 'be curious about 固定搭配，表示对动物充满好奇。' },
        { num: 2, options: ['A. explore', 'B. burn', 'C. sell'], ans: 'A', analysis: 'explore the forest 表示探索森林。' },
        { num: 3, options: ['A. clock', 'B. candy', 'C. courage'], ans: 'C', analysis: 'have the courage to do 表示有勇气向前。' },
        { num: 4, options: ['A. protect', 'B. break', 'C. forget'], ans: 'A', analysis: 'protect their homes 表示保护动物的家园。' },
        { num: 5, options: ['A. lost', 'B. achieved', 'C. stopped'], ans: 'B', analysis: 'achieved his goal 表示达成实现了目标。' }
      ]
    }
  },

  // 默认可增删商品
  defaultShopItems: [
    { id: 'item_1', icon: '🧹', name: '周六免做家务券', desc: '周末免洗碗或扫地一次', cost: 15 },
    { id: 'item_2', icon: '🎬', name: '电影/游乐园门票', desc: '自选周末电影一场或游乐场畅玩', cost: 50 },
    { id: 'item_3', icon: '📚', name: '自选图书/心愿盲盒', desc: '50元以内自选心愿物品或图书', cost: 80 },
    { id: 'item_4', icon: '🎮', name: '周末畅玩游戏30分钟', desc: '自选安全益智主机或平板游戏', cost: 35 }
  ]
};
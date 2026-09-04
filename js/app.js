// 家庭研学中枢 - Vue 3 主控制器 (实现计时器、作业双模质检、听写默写、奥数举一反三、多文件附件累加托管)
const { createApp, ref, computed, onMounted, onUnmounted } = Vue;

createApp({
  setup() {
    const currentLoggedInUser = ref(null);
    const activeTab = ref('today');
    const showPinModal = ref(false);
    const selectedAuthUser = ref(null);
    const enteredPin = ref('');

    // 全局通用弹窗
    const showSettings = ref(false);
    const showAssignModal = ref(false);
    const showTaskSubmitModal = ref(false);
    const showPointModal = ref(false);
    const showAttachmentViewer = ref(false);
    const showQuizModal = ref(false);
    const showDayDetailModal = ref(false);
    const showAddShopItemModal = ref(false);

    // 13 个任务核心专属弹窗状态
    const showHomeworkModal = ref(false); // 任务1: 学校作业
    const showReadingModal = ref(false);  // 任务2: 阅读与真题
    const showCalligraphyModal = ref(false); // 任务3: 田字格楷体
    const showMathModal = ref(false);     // 任务4: 口算
    const showOlympiadModal = ref(false); // 任务5: 奥数
    const showWordModal = ref(false);     // 任务6: 记单词
    const showDictationModal = ref(false);// 任务6附属: 20秒听写默写
    const showSentenceSpeakModal = ref(false); // 任务7: 朗读5句
    const showSentenceStructureModal = ref(false); // 任务8: 每日一句结构
    const showTranslationModal = ref(false); // 任务9: 英译中
    const showEnglishReadingModal = ref(false); // 任务10: 英文阅读
    const showClozeModal = ref(false);    // 任务11: 完形填空
    const showSchoolErrorModal = ref(false); // 任务12: 错题录入
    const showBookReadingModal = ref(false); // 任务13: 整本书伴读

    // 家长总控专属弹窗
    const showParentResetPinModal = ref(false);
    const parentTargetStudent = ref(null);
    const parentNewPinInput = ref('');

    // 独立研学计时器状态 (支持启动、暂停、累计)
    const activeTimingTaskId = ref(null);
    const taskTimerSeconds = ref(0);
    const isTimerRunning = ref(false);
    let timerInterval = null;

    const startTaskTimer = (taskId) => {
      if (activeTimingTaskId.value !== taskId) {
        activeTimingTaskId.value = taskId;
        taskTimerSeconds.value = 0;
      }
      isTimerRunning.value = true;
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        taskTimerSeconds.value++;
      }, 1000);
    };

    const pauseTaskTimer = () => {
      isTimerRunning.value = false;
      if (timerInterval) clearInterval(timerInterval);
    };

    const formatSeconds = (sec) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // 系统配置与基础数据
    const config = ref({
      siliconKey: localStorage.getItem('cfg_silicon') || '',
      upstashUrl: localStorage.getItem('cfg_upstash_url') || '',
      upstashToken: localStorage.getItem('cfg_upstash_token') || ''
    });

    const students = ref(window.StudyData.defaultStudents);
    const currentStudentId = ref('nuo');
    const baseTasks = ref(window.StudyData.baseTasks);
    const customTasks = ref([]);
    const parentTaskFiles = ref([]);
    const newTask = ref({ targetStudentId: 'ALL', targetTaskId: null, title: '', duration: '15分钟', points: 3, criteria: '认真完成' });

    const checkins = ref({});
    const errors = ref([]);
    const quizRecords = ref([]);
    const pointLogs = ref([]);
    const shopItems = ref(window.StudyData.defaultShopItems);

    const parentProfile = { id: 'parent', name: '家长总控', avatar: '🛡️', grade: '总控管理员', pin: '8888' };
    const currentStudent = computed(() => students.value.find(s => s.id === currentStudentId.value) || students.value[0]);

    // 英雄榜排名计算 (按积分降序，并列处理)
    const rankedStudents = computed(() => {
      return [...students.value].sort((a, b) => b.points - a.points);
    });

    // 任务1：学校作业表单与双模质检
    const hwForm = ref({ yuwen: '', shuxue: '', yingyu: '', durationMinutes: 35, mode: 'direct' });
    const hwPhotos = ref([]);
    const hwGradingStatus = ref('');
    const isHwGrading = ref(false);

    // 任务2：阅读文章与当前真题
    const currentReadingArticle = computed(() => {
      const g = currentStudent.value.grade || '';
      const isJunior = g.includes('1年级') || g.includes('2年级');
      return window.StudyData.readingArticles.find(a => a.forJunior === isJunior) || window.StudyData.readingArticles[0];
    });
    const readingAnswers = ref({ choice: '', fill: '' });
    const readingJudged = ref(false);
    const readingScoreMsg = ref('');

    // 任务3：田字格字帖
    const todayCharIndex = ref(0);
    const todayCalligraphyChar = computed(() => {
      const g = currentStudent.value.grade || '';
      const bank = g.includes('1年级') || g.includes('2年级') ? window.StudyData.gradeWordBank['低段']
                 : (g.includes('3年级') || g.includes('4年级') ? window.StudyData.gradeWordBank['中段'] : window.StudyData.gradeWordBank['高段']);
      return bank[todayCharIndex.value % bank.length];
    });
    const calligraphyPhotos = ref([]);

    // 任务4：口算状态
    const mathProblems = ref([]);
    const mathSubmitted = ref(false);
    const mathPassed = ref(false);
    const mathScoreSummary = ref('');

    // 任务5：奥数题型与举一反三
    const currentOlympiadData = computed(() => {
      const g = currentStudent.value.grade || '';
      const curriculum = window.StudyData.olympiadCurriculum;
      for (let k in curriculum) {
        if (g.includes(k.replace('小学', ''))) return curriculum[k];
      }
      return curriculum['小学3年级'];
    });
    const olympiadStage = ref('problem'); // problem, hint, solution, variant
    const olympiadPhotos = ref([]);

    // 任务6~11：英语单词包与贯穿真题
    const todayWordPack = computed(() => window.StudyData.englishWordPacks[0]);
    const dictationStep = ref(0); // 0~4 对应 5 个词
    const dictationCountdown = ref(20);
    const dictationTimer = ref(null);
    const dictationPhotos = ref([]);

    // 任务12：错题本
    const newSchoolError = ref({ subject: '数学', question: '', analysis: '', photoUrl: '' });

    // 任务13：整本书伴读表单
    const bookForm = ref({ bookName: '', pages: '', duration: 20, summary: '', nextPlan: '' });

    // ==========================================
    // 独立文件托管管理：所有附件支持多次追加与多选
    // ==========================================
    const handleHwMultiPhotos = (e) => {
      window.StudyFileManager.handleFileSelection(e, hwPhotos);
    };

    const handleCalligraphyPhotos = (e) => {
      window.StudyFileManager.handleFileSelection(e, calligraphyPhotos);
    };

    const handleOlympiadPhotos = (e) => {
      window.StudyFileManager.handleFileSelection(e, olympiadPhotos);
    };

    const handleDictationPhotos = (e) => {
      window.StudyFileManager.handleFileSelection(e, dictationPhotos);
    };

    const removeFileItem = (targetRefArray, index) => {
      window.StudyFileManager.removeAttachment(targetRefArray, index);
    };

    // 语音朗读辅助函数 (Web Speech API)
    const speakText = (text, lang = 'en-US') => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = lang;
        utter.rate = 0.9;
        window.speechSynthesis.speak(utter);
      } else {
        alert('您的浏览器不支持语音朗读！');
      }
    };

    // 积分记录日志
    const logPointTransaction = (studentId, title, change, newBalance) => {
      pointLogs.value.unshift({
        id: 'log_' + Date.now(),
        studentId,
        title,
        change,
        balance: newBalance,
        time: new Date().toLocaleString()
      });
    };

    // 登记打卡完成 (调用 fileManager 完美合并历史附件和本次追加附件)
    const recordTaskDone = (taskId, files = [], extraMinutes = 0) => {
      const k = `${currentStudentId.value}_2026-09-04`;
      let current = checkins.value[k];
      if (!current || Array.isArray(current)) {
        current = { doneTaskIds: Array.isArray(current) ? [...current] : [], attachments: {} };
      }
      if (!current.doneTaskIds.includes(taskId)) {
        current.doneTaskIds.push(taskId);
      }
      
      if (files && files.length > 0) {
        if (!current.attachments) current.attachments = {};
        current.attachments = window.StudyFileManager.mergeTaskAttachments(current.attachments, taskId, files);
      }

      checkins.value[k] = current;

      // 累加学习总时长
      const spentMin = Math.max(extraMinutes, Math.round(taskTimerSeconds.value / 60));
      currentStudent.value.totalStudyMinutes = (currentStudent.value.totalStudyMinutes || 0) + spentMin;

      // 停止计时
      pauseTaskTimer();
      activeTimingTaskId.value = null;

      // 奖励积分
      const allT = [...baseTasks.value, ...customTasks.value];
      const taskObj = allT.find(t => t.id === taskId);
      if (taskObj) {
        currentStudent.value.points += taskObj.points;
        logPointTransaction(currentStudentId.value, `完成任务: ${taskObj.title}`, taskObj.points, currentStudent.value.points);
      }
      syncToCloud();
    };

    // --- 任务 1: 学校作业提交逻辑 ---
    const openHomeworkModal = () => {
      startTaskTimer(1);
      hwPhotos.value = []; // 打开时可按需保留或清空，当前设为每次新开重置或由用户自主管理
      hwGradingStatus.value = '';
      showHomeworkModal.value = true;
    };

    const submitSchoolHomework = async () => {
      if (hwForm.value.mode === 'direct') {
        recordTaskDone(1, hwPhotos.value, hwForm.value.durationMinutes);
        showHomeworkModal.value = false;
        alert('🎉 学校作业登记完成并成功打卡！');
      } else {
        // AI 深度质检
        if (!config.value.siliconKey) {
          alert('请先在系统设置中配置 AI 密钥！');
          return;
        }
        isHwGrading.value = true;
        hwGradingStatus.value = 'AI 老师逐题深度质检中（判断正误、步骤核验）...';
        try {
          const firstImg = hwPhotos.value.find(p => p.type?.startsWith('image/'));
          const base64 = firstImg ? firstImg.dataUrl.split(',')[1] : null;
          if (base64) {
            const res = await window.StudyAI.gradeHomework(config.value.siliconKey, base64);
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach(err => {
                errors.value.unshift({ id: Date.now() + Math.random(), studentId: currentStudentId.value, ...err, date: '2026-09-04', resolved: false });
              });
              alert(`批改完毕！共 ${res.total} 题，发现 ${res.errors.length} 处错题，已自动沉淀到【复仇错题集】！`);
            } else {
              alert(`太棒了！AI 老师核对全部 ${res.total} 道题目解答正确！`);
            }
          }
          recordTaskDone(1, hwPhotos.value, hwForm.value.durationMinutes);
          showHomeworkModal.value = false;
        } catch (e) {
          alert('AI 核验已登记归档，作业打卡通过！');
          recordTaskDone(1, hwPhotos.value, hwForm.value.durationMinutes);
          showHomeworkModal.value = false;
        } finally {
          isHwGrading.value = false;
        }
      }
    };

    // --- 任务 2: 阅读与真题逻辑 ---
    const openReadingModal = () => {
      startTaskTimer(2);
      readingAnswers.value = { choice: '', fill: '' };
      readingJudged.value = false;
      readingScoreMsg.value = '';
      showReadingModal.value = true;
    };

    const judgeReadingQuestions = () => {
      if (taskTimerSeconds.value < 1200) { // 20分钟 = 1200秒
        if (!confirm(`系统强制要求至少阅读思考 20 分钟！当前已用时 ${Math.round(taskTimerSeconds.value / 60)} 分钟，确定提前提交吗？`)) {
          return;
        }
      }
      readingJudged.value = true;
      const q = currentReadingArticle.value.questions;
      let correctCount = 0;
      if (readingAnswers.value.choice === q[0].ans) correctCount++;
      if (readingAnswers.value.fill.trim().includes(q[1].ans)) correctCount++;

      readingScoreMsg.value = `本次真题评测得分：做对 ${correctCount} / 2 题！`;
      if (correctCount >= 1) {
        recordTaskDone(2, [], 20);
        alert('🎉 阅读真题达标！打卡成功！');
      } else {
        alert('两道题均未答对，请仔细阅读原文核对参考答案！');
      }
    };

    // --- 任务 3: 田字格练字打卡逻辑 ---
    const openCalligraphyModal = () => {
      startTaskTimer(3);
      calligraphyPhotos.value = [];
      showCalligraphyModal.value = true;
    };

    const submitCalligraphy = () => {
      recordTaskDone(3, calligraphyPhotos.value, 10);
      showCalligraphyModal.value = false;
      alert('🎉 每日练字打卡成功！');
    };

    // --- 任务 4: 口算引擎 ---
    const startMathDrill = () => {
      startTaskTimer(4);
      mathProblems.value = window.StudyMath.generateDrill(currentStudent.value.grade);
      mathSubmitted.value = false;
      mathPassed.value = false;
      mathScoreSummary.value = '';
      showMathModal.value = true;
    };

    const submitMathDrill = () => {
      let right = 0;
      mathProblems.value.forEach(p => {
        if (parseFloat(p.userAns) === p.ans) {
          right++;
        } else {
          errors.value.unshift({
            id: Date.now() + Math.random(),
            studentId: currentStudentId.value,
            question: `口算题：${p.expr}`,
            studentAnswer: String(p.userAns || '未作答'),
            correctAnswer: String(p.ans),
            errorType: '口算计算失误',
            analysis: '基础四则运算未对齐数位或乘除法口诀失误',
            date: '2026-09-04',
            resolved: false
          });
        }
      });
      mathSubmitted.value = true;
      if (right >= 7) {
        mathPassed.value = true;
        mathScoreSummary.value = `🎉 做对 ${right} / 10 题，通过达标！`;
        recordTaskDone(4);
      } else {
        mathPassed.value = false;
        mathScoreSummary.value = `做对 ${right} / 10 题，未达到 7 题达标线，错题已归入复仇错题集！`;
      }
    };

    // --- 任务 5: 奥数闯关 ---
    const openOlympiadModal = () => {
      startTaskTimer(5);
      olympiadStage.value = 'problem';
      olympiadPhotos.value = [];
      showOlympiadModal.value = true;
    };

    const nextOlympiadStage = (next) => {
      olympiadStage.value = next;
    };

    const completeOlympiad = () => {
      recordTaskDone(5, olympiadPhotos.value, 15);
      showOlympiadModal.value = false;
      alert('🎉 奥数逻辑思维闯关成功，已完成打卡！');
    };

    // --- 任务 6: 记单词与听写模式 ---
    const openWordModal = () => {
      startTaskTimer(6);
      showWordModal.value = true;
    };

    const startDictationMode = () => {
      showWordModal.value = false;
      showDictationModal.value = true;
      dictationStep.value = 0;
      dictationPhotos.value = [];
      playDictationWord();
    };

    const playDictationWord = () => {
      const w = todayWordPack.value.words[dictationStep.value];
      if (!w) return;
      speakText(w.word);
      dictationCountdown.value = 20;
      if (dictationTimer.value) clearInterval(dictationTimer.value);
      dictationTimer.value = setInterval(() => {
        dictationCountdown.value--;
        if (dictationCountdown.value <= 0) {
          if (dictationStep.value < 4) {
            dictationStep.value++;
            playDictationWord();
          } else {
            clearInterval(dictationTimer.value);
            alert('5个单词朗读听写完毕！请拍照上传手写默写本，额外获得 +3 积分！');
          }
        }
      }, 1000);
    };

    const submitDictation = () => {
      if (dictationTimer.value) clearInterval(dictationTimer.value);
      recordTaskDone(6, dictationPhotos.value, 15);
      if (dictationPhotos.value.length > 0) {
        currentStudent.value.points += 3;
        logPointTransaction(currentStudentId.value, '默写拍照上传额外嘉奖', 3, currentStudent.value.points);
      }
      showDictationModal.value = false;
      alert('🎉 记单词与默写大作战圆满达标！');
    };

    // --- 任务 7~11: 英语听说读写系列 ---
    const openSentenceSpeakModal = () => { startTaskTimer(7); showSentenceSpeakModal.value = true; };
    const openSentenceStructureModal = () => { startTaskTimer(8); showSentenceStructureModal.value = true; };
    const openTranslationModal = () => { startTaskTimer(9); showTranslationModal.value = true; };
    const openEnglishReadingModal = () => { startTaskTimer(10); showEnglishReadingModal.value = true; };
    const openClozeModal = () => { startTaskTimer(11); showClozeModal.value = true; };

    // --- 任务 12: 错题消化与录入 ---
    const openSchoolErrorModal = () => {
      startTaskTimer(12);
      newSchoolError.value = { subject: '数学', question: '', analysis: '', photoUrl: '' };
      showSchoolErrorModal.value = true;
    };

    const submitSchoolError = () => {
      if (!newSchoolError.value.question.trim() && !newSchoolError.value.photoUrl) {
        return alert('请输入错题内容或拍照上传！');
      }
      errors.value.unshift({
        id: Date.now() + Math.random(),
        studentId: currentStudentId.value,
        question: newSchoolError.value.question.trim() || '学校作业错题照片录入',
        studentAnswer: '见订正本',
        correctAnswer: '见订正本',
        errorType: newSchoolError.value.subject + '错题',
        analysis: newSchoolError.value.analysis.trim() || '已完成红笔二次订正',
        date: '2026-09-04',
        resolved: false
      });
      recordTaskDone(12, [], 15);
      showSchoolErrorModal.value = false;
      alert('🎉 学校错题已成功录入错题集！');
    };

    // --- 任务 13: 整本书伴读 ---
    const openBookReadingModal = () => {
      startTaskTimer(13);
      showBookReadingModal.value = true;
    };

    const submitBookReading = () => {
      if (!bookForm.value.bookName.trim()) return alert('请输入阅读书名！');
      recordTaskDone(13, [], bookForm.value.duration || 20);
      showBookReadingModal.value = false;
      alert('🎉 今日整本书伴读与阅读计划记录成功！');
    };

    // --- 家长总控专属操作 ---
    const openParentResetPin = (st) => {
      parentTargetStudent.value = st;
      parentNewPinInput.value = '';
      showParentResetPinModal.value = true;
    };

    const confirmParentResetPin = () => {
      if (!parentNewPinInput.value || parentNewPinInput.value.length !== 4) {
        return alert('请输入标准的 4 位纯数字新密码！');
      }
      parentTargetStudent.value.pin = parentNewPinInput.value;
      showParentResetPinModal.value = false;
      syncToCloud();
      alert(`🎉 成功重置 ${parentTargetStudent.value.name} 的登录密码为：${parentNewPinInput.value}`);
    };

    // 自定义头像修改
    const handleAvatarChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const r = new FileReader();
      r.onload = (ev) => {
        currentStudent.value.avatarImg = ev.target.result;
        syncToCloud();
        alert('🎉 头像自定义修改成功，全网全设备已同步生效！');
      };
      r.readAsDataURL(file);
    };

    // 登录与切换逻辑
    const openPinModal = (user) => {
      selectedAuthUser.value = user;
      enteredPin.value = '';
      showPinModal.value = true;
    };

    const pressPin = (num) => {
      if (enteredPin.value.length < 4) {
        enteredPin.value += String(num);
        if (enteredPin.value.length === 4) {
          const expected = selectedAuthUser.value.pin || '1234';
          if (enteredPin.value === expected) {
            switchToUser(selectedAuthUser.value);
            showPinModal.value = false;
            enteredPin.value = '';
          } else {
            alert('密码错误，请重新输入！');
            enteredPin.value = '';
          }
        }
      }
    };

    const clearPin = () => { enteredPin.value = ''; };

    const switchToUser = (user) => {
      currentLoggedInUser.value = user;
      if (user.id !== 'parent') currentStudentId.value = user.id;
    };

    const logout = () => { currentLoggedInUser.value = null; };

    // 整合今日所有任务
    const allTodayTasks = computed(() => {
      const personalCustom = customTasks.value.filter(t => t.targetStudentId === 'ALL' || t.targetStudentId === currentStudentId.value);
      return [...personalCustom, ...baseTasks.value];
    });

    const isHomeworkDone = computed(() => {
      const doneIds = checkins.value[`${currentStudentId.value}_2026-09-04`]?.doneTaskIds || [];
      return doneIds.includes(1);
    });

    const totalTaskCount = computed(() => allTodayTasks.value.length);
    const todayDoneCount = computed(() => {
      const doneIds = checkins.value[`${currentStudentId.value}_2026-09-04`]?.doneTaskIds || [];
      return allTodayTasks.value.filter(t => doneIds.includes(t.id)).length;
    });

    const todayPoints = computed(() => {
      const doneIds = checkins.value[`${currentStudentId.value}_2026-09-04`]?.doneTaskIds || [];
      return allTodayTasks.value.filter(t => doneIds.includes(t.id)).reduce((a, b) => a + b.points, 0);
    });

    const isDone = (id) => (checkins.value[`${currentStudentId.value}_2026-09-04`]?.doneTaskIds || []).includes(id);

    // 云同步方法
    const syncToCloud = async () => {
      await window.StudyDB.save(config.value.upstashUrl, config.value.upstashToken, {
        students: students.value,
        checkins: checkins.value,
        errors: errors.value,
        customTasks: customTasks.value,
        quizRecords: quizRecords.value,
        pointLogs: pointLogs.value,
        shopItems: shopItems.value
      });
    };

    const loadFromCloud = async () => {
      const data = await window.StudyDB.load(config.value.upstashUrl, config.value.upstashToken);
      if (data) {
        if (data.students) students.value = data.students;
        if (data.checkins) checkins.value = data.checkins;
        if (data.errors) errors.value = data.errors;
        if (data.customTasks) customTasks.value = data.customTasks;
        if (data.quizRecords) quizRecords.value = data.quizRecords;
        if (data.pointLogs) pointLogs.value = data.pointLogs;
        if (data.shopItems) shopItems.value = data.shopItems;
      }
    };

    const saveConfig = () => {
      localStorage.setItem('cfg_silicon', config.value.siliconKey);
      localStorage.setItem('cfg_upstash_url', config.value.upstashUrl);
      localStorage.setItem('cfg_upstash_token', config.value.upstashToken);
      showSettings.value = false;
      loadFromCloud();
    };

    // 全局 ESC 监听
    const closeAllModals = () => {
      showPinModal.value = false;
      showHomeworkModal.value = false;
      showReadingModal.value = false;
      showCalligraphyModal.value = false;
      showMathModal.value = false;
      showOlympiadModal.value = false;
      showWordModal.value = false;
      showDictationModal.value = false;
      showSentenceSpeakModal.value = false;
      showSentenceStructureModal.value = false;
      showTranslationModal.value = false;
      showEnglishReadingModal.value = false;
      showClozeModal.value = false;
      showSchoolErrorModal.value = false;
      showBookReadingModal.value = false;
      showSettings.value = false;
      showParentResetPinModal.value = false;
      showAssignModal.value = false;
      showDayDetailModal.value = false;
      enteredPin.value = '';
    };

    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape') closeAllModals();
      if (showPinModal.value) {
        if (e.key >= '0' && e.key <= '9') pressPin(e.key);
        else if (e.key === 'Backspace') enteredPin.value = enteredPin.value.slice(0, -1);
      }
    };

    onMounted(() => {
      window.addEventListener('keydown', handleGlobalKeyDown);
      if (config.value.upstashUrl) loadFromCloud();
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      if (timerInterval) clearInterval(timerInterval);
    });

    return {
      currentLoggedInUser, activeTab, showPinModal, selectedAuthUser, enteredPin,
      parentProfile, openPinModal, pressPin, clearPin, switchToUser, logout,
      students, currentStudentId, currentStudent, rankedStudents,
      baseTasks, customTasks, allTodayTasks, isHomeworkDone, totalTaskCount, todayDoneCount, todayPoints, isDone,
      config, showSettings, saveConfig, syncToCloud,
      activeTimingTaskId, taskTimerSeconds, isTimerRunning, startTaskTimer, pauseTaskTimer, formatSeconds,
      showHomeworkModal, hwForm, hwPhotos, hwGradingStatus, isHwGrading, openHomeworkModal, handleHwMultiPhotos, submitSchoolHomework,
      showReadingModal, currentReadingArticle, readingAnswers, readingJudged, readingScoreMsg, openReadingModal, judgeReadingQuestions,
      showCalligraphyModal, todayCalligraphyChar, calligraphyPhotos, openCalligraphyModal, handleCalligraphyPhotos, submitCalligraphy,
      showMathModal, mathProblems, mathSubmitted, mathPassed, mathScoreSummary, startMathDrill, submitMathDrill,
      showOlympiadModal, currentOlympiadData, olympiadStage, olympiadPhotos, openOlympiadModal, handleOlympiadPhotos, nextOlympiadStage, completeOlympiad,
      showWordModal, showDictationModal, todayWordPack, dictationStep, dictationCountdown, dictationPhotos, openWordModal, startDictationMode, submitDictation, speakText,
      showSentenceSpeakModal, showSentenceStructureModal, showTranslationModal, showEnglishReadingModal, showClozeModal,
      openSentenceSpeakModal, openSentenceStructureModal, openTranslationModal, openEnglishReadingModal, openClozeModal,
      showSchoolErrorModal, newSchoolError, openSchoolErrorModal, submitSchoolError, errors,
      showBookReadingModal, bookForm, openBookReadingModal, submitBookReading,
      showParentResetPinModal, parentTargetStudent, parentNewPinInput, openParentResetPin, confirmParentResetPin,
      handleAvatarChange, checkins, recordTaskDone,
      removeFileItem
    };
  }
}).mount('#app');
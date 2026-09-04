// 家庭研学中枢 - Vue 3 控制器（含原生Web Audio转盘音效、作弊内定算法、全题库交互与完整家长控制）
const { createApp, ref, computed, onMounted, onUnmounted } = Vue;

// 纯原生 Web Audio 合成音效引擎（无需加载任何外部音频文件，零延迟极速发声）
const AudioEngine = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  // 转盘旋转机械滴答声 (Tick)
  playTick() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  },
  // 中奖庆贺和弦音 (Fanfare Victory)
  playWin() {
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.6);
      });
    } catch (e) {}
  }
};

createApp({
  setup() {
    const currentLoggedInUser = ref(null);
    const activeTab = ref('today');
    const showPinModal = ref(false);
    const selectedAuthUser = ref(null);
    const enteredPin = ref('');

    // 全局设置与弹窗
    const showSettings = ref(false);
    const showAssignModal = ref(false);
    const showPointModal = ref(false);
    const showAttachmentViewer = ref(false);
    const showQuizModal = ref(false);
    const showDayDetailModal = ref(false);
    const showAddShopItemModal = ref(false);

    // 13 项专属任务弹窗
    const showHomeworkModal = ref(false);
    const showReadingModal = ref(false);
    const showCalligraphyModal = ref(false);
    const showMathModal = ref(false);
    const showOlympiadModal = ref(false);
    const showWordModal = ref(false);
    const showDictationModal = ref(false);
    const showSentenceSpeakModal = ref(false);
    const showSentenceStructureModal = ref(false);
    const showTranslationModal = ref(false);
    const showEnglishReadingModal = ref(false);
    const showClozeModal = ref(false);
    const showSchoolErrorModal = ref(false);
    const showBookReadingModal = ref(false);

    // 家长重置密码
    const showParentResetPinModal = ref(false);
    const parentTargetStudent = ref(null);
    const parentNewPinInput = ref('');

    // 【核心游戏化：幸运大转盘系统】
    const showWheelModal = ref(false);
    const wheelRotation = ref(0);
    const isWheelSpinning = ref(false);
    const wheelTargetTask = ref(null);

    // 研学计时器
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
      timerInterval = setInterval(() => { taskTimerSeconds.value++; }, 1000);
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

    // 系统配置
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

    // 奥运会领奖台排行计算（第1金、第2银、第3铜、第4追逐）
    const rankedStudents = computed(() => {
      return [...students.value].sort((a, b) => b.points - a.points);
    });

    // 任务 1：作业登记表单
    const hwForm = ref({ yuwen: '', shuxue: '', yingyu: '', durationMinutes: 35, mode: 'direct' });
    const hwPhotos = ref([]);
    const hwGradingStatus = ref('');
    const isHwGrading = ref(false);

    // 任务 2：阅读与真题状态
    const currentReadingArticle = computed(() => {
      const g = currentStudent.value.grade || '';
      const isJunior = g.includes('1年级') || g.includes('2年级');
      return window.StudyData.readingArticles.find(a => a.forJunior === isJunior) || window.StudyData.readingArticles[0];
    });
    const readingSelectedChoice = ref('');
    const readingFillAnswer = ref('');
    const readingSubmitted = ref(false);
    const readingResultMsg = ref('');

    // 任务 3：练字打卡状态 (3 个字)
    const calligraphyData = computed(() => window.StudyData.calligraphySets[0]);
    const calligraphyPhotos = ref([]);

    // 任务 4：口算快练状态
    const mathProblems = ref([]);
    const mathSubmitted = ref(false);
    const mathPassed = ref(false);
    const mathScoreSummary = ref('');

    // 任务 5：奥数题状态
    const currentOlympiadData = computed(() => {
      const g = currentStudent.value.grade || '';
      const bank = window.StudyData.olympiadBank;
      for (let k in bank) {
        if (g.includes(k.replace('小学', ''))) return bank[k];
      }
      return bank['小学3年级'];
    });
    const olympiadStage = ref('problem'); // problem, hint, solution, variant
    const olympiadPhotos = ref([]);

    // 任务 6~11：英语单词大包与交互
    const todayWordPack = computed(() => window.StudyData.englishWordPack);
    const dictationStep = ref(0);
    const dictationCountdown = ref(20);
    const dictationTimer = ref(null);
    const dictationPhotos = ref([]);

    // 任务 9：英译中（严格禁止提前透题）
    const userTranslationInput = ref('');
    const translationSubmitted = ref(false);

    // 任务 10：英文阅读理解（选项真正可点击选择）
    const englishReadingUserChoices = ref({});
    const englishReadingSubmitted = ref(false);
    const englishReadingScore = ref(0);

    // 任务 11：完形填空（选项真正可点击选择）
    const clozeUserChoices = ref({});
    const clozeSubmitted = ref(false);
    const clozeScore = ref(0);

    // 任务 12：错题录入
    const newSchoolError = ref({ subject: '数学', question: '', analysis: '', photoUrl: '' });

    // 任务 13：伴读
    const bookForm = ref({ bookName: '', pages: '', duration: 20, summary: '', nextPlan: '' });

    // 个人中心小测表单与新特权
    const newQuiz = ref({ subject: '数学', date: '2026-09-04', title: '', score: null, maxScore: 100, reflection: '' });
    const newShopItem = ref({ icon: '🎁', name: '', desc: '', cost: 20 });

    // 语音朗读
    const speakText = (text, lang = 'en-US') => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = lang;
        utter.rate = 0.9;
        window.speechSynthesis.speak(utter);
      }
    };

    // 积分流水
    const logPointTransaction = (studentId, title, change, newBalance) => {
      pointLogs.value.unshift({
        id: 'log_' + Date.now(),
        studentId,
        title,
        change,
        balance: newBalance,
        time: '2026-09-04 15:00'
      });
    };

    // 核心打卡记录方法 (做完后支持回看与二次编辑)
    const recordTaskDone = (taskId, files = [], extraMinutes = 0) => {
      const k = `${currentStudentId.value}_2026-09-04`;
      let current = checkins.value[k];
      if (!current || Array.isArray(current)) {
        current = { doneTaskIds: Array.isArray(current) ? [...current] : [], attachments: {} };
      }
      const isAlreadyDone = current.doneTaskIds.includes(taskId);
      if (!isAlreadyDone) {
        current.doneTaskIds.push(taskId);
      }
      if (files && files.length > 0) {
        if (!current.attachments) current.attachments = {};
        current.attachments[taskId] = files;
      }
      checkins.value[k] = current;

      const spentMin = Math.max(extraMinutes, Math.round(taskTimerSeconds.value / 60));
      currentStudent.value.totalStudyMinutes = (currentStudent.value.totalStudyMinutes || 0) + spentMin;

      pauseTaskTimer();
      activeTimingTaskId.value = null;

      if (!isAlreadyDone) {
        const allT = [...baseTasks.value, ...customTasks.value];
        const taskObj = allT.find(t => t.id === taskId);
        if (taskObj) {
          currentStudent.value.points += taskObj.points;
          logPointTransaction(currentStudentId.value, `完成任务: ${taskObj.title}`, taskObj.points, currentStudent.value.points);
        }
      }
      syncToCloud();
    };

    // --- 【大转盘内定逻辑与物理旋转动画】 ---
    const openWheelModal = () => {
      wheelRotation.value = 0;
      isWheelSpinning.value = false;
      wheelTargetTask.value = null;
      showWheelModal.value = true;
    };

    const spinLuckyWheel = () => {
      if (isWheelSpinning.value) return;
      isWheelSpinning.value = true;
      AudioEngine.init();

      // 内定作弊规则计算：
      // 诺: 口算(4), 奥数(5)
      // 威: 阅读(2), 奥数(5), 口算(4)
      // 奕: 口算(4), 奥数(5)
      // 黛: 口算(4), 阅读(2)
      const doneIds = checkins.value[`${currentStudentId.value}_2026-09-04`]?.doneTaskIds || [];
      let mandatoryTaskIds = [];
      if (currentStudentId.value === 'nuo') mandatoryTaskIds = [4, 5];
      else if (currentStudentId.value === 'wei') mandatoryTaskIds = [2, 5, 4];
      else if (currentStudentId.value === 'yi') mandatoryTaskIds = [4, 5];
      else if (currentStudentId.value === 'dai') mandatoryTaskIds = [4, 2];

      const pendingMandatory = mandatoryTaskIds.filter(id => !doneIds.includes(id));

      let pickedTaskId = null;
      if (pendingMandatory.length > 0) {
        pickedTaskId = pendingMandatory[0]; // 优先抽取内定必做任务
      } else {
        // 全完成必做后，在未完成任务中真随机
        const undoneTasks = baseTasks.value.filter(t => t.id !== 1 && !doneIds.includes(t.id));
        pickedTaskId = undoneTasks.length > 0 ? undoneTasks[Math.floor(Math.random() * undoneTasks.length)].id : 4;
      }

      const target = baseTasks.value.find(t => t.id === pickedTaskId) || baseTasks.value[1];
      wheelTargetTask.value = target;

      // 计算指针扇区角度 (8个扇区，每个45度)
      const targetIndex = baseTasks.value.indexOf(target) % 8;
      const targetDegree = 360 * 5 + (360 - (targetIndex * 45 + 22.5));
      wheelRotation.value = targetDegree;

      // 旋转过程中有节奏的机械滴答声
      let tickCount = 0;
      const tickInterval = setInterval(() => {
        AudioEngine.playTick();
        tickCount++;
        if (tickCount > 35) clearInterval(tickInterval);
      }, 90);

      // 4秒后旋转平稳停止，播放胜利大号和弦音
      setTimeout(() => {
        isWheelSpinning.value = false;
        AudioEngine.playWin();
      }, 4000);
    };

    const jumpToWheelTask = () => {
      showWheelModal.value = false;
      if (!wheelTargetTask.value) return;
      openTaskInteractive(wheelTargetTask.value);
    };

    // 任务交互路由器（已完成的也可以点击再次回看与二次编辑）
    const openTaskInteractive = (task) => {
      if (task.id === 1) openHomeworkModal();
      else if (task.id === 2) openReadingModal();
      else if (task.id === 3) openCalligraphyModal();
      else if (task.id === 4) startMathDrill();
      else if (task.id === 5) openOlympiadModal();
      else if (task.id === 6) openWordModal();
      else if (task.id === 7) { startTaskTimer(7); showSentenceSpeakModal.value = true; }
      else if (task.id === 8) { startTaskTimer(8); showSentenceStructureModal.value = true; }
      else if (task.id === 9) { startTaskTimer(9); translationSubmitted.value = false; showTranslationModal.value = true; }
      else if (task.id === 10) { startTaskTimer(10); englishReadingSubmitted.value = false; showEnglishReadingModal.value = true; }
      else if (task.id === 11) { startTaskTimer(11); clozeSubmitted.value = false; showClozeModal.value = true; }
      else if (task.id === 12) { startTaskTimer(12); showSchoolErrorModal.value = true; }
      else if (task.id === 13) { startTaskTimer(13); showBookReadingModal.value = true; }
    };

    // --- 任务 1: 作业登记与完成 (完成后自动触发大转盘) ---
    const openHomeworkModal = () => {
      startTaskTimer(1);
      hwPhotos.value = [];
      hwGradingStatus.value = '';
      showHomeworkModal.value = true;
    };

    const handleHwMultiPhotos = (e) => {
      const files = Array.from(e.target.files);
      files.forEach(f => {
        const r = new FileReader();
        r.onload = ev => hwPhotos.value.push({ name: f.name, dataUrl: ev.target.result, size: f.size, type: f.type });
        r.readAsDataURL(f);
      });
    };

    const submitSchoolHomework = async () => {
      if (hwForm.value.mode === 'direct') {
        recordTaskDone(1, hwPhotos.value, hwForm.value.durationMinutes);
        showHomeworkModal.value = false;
        openWheelModal(); // 登记完作业，立刻弹出趣味大转盘！
      } else {
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
              alert(`批改完毕！共 ${res.total} 题，发现 ${res.errors.length} 处错题，已自动沉淀到【错题集】！`);
            } else {
              alert(`太棒了！全部 ${res.total} 道题目解答正确！`);
            }
          }
          recordTaskDone(1, hwPhotos.value, hwForm.value.durationMinutes);
          showHomeworkModal.value = false;
          openWheelModal(); // 同样唤起转盘
        } catch (e) {
          recordTaskDone(1, hwPhotos.value, hwForm.value.durationMinutes);
          showHomeworkModal.value = false;
          openWheelModal();
        } finally {
          isHwGrading.value = false;
        }
      }
    };

    // --- 任务 2: 阅读理解判分 ---
    const openReadingModal = () => {
      startTaskTimer(2);
      readingSelectedChoice.value = '';
      readingFillAnswer.value = '';
      readingSubmitted.value = false;
      showReadingModal.value = true;
    };

    const submitReadingQuiz = () => {
      if (!readingSelectedChoice.value) return alert('请先点击选择第1题的答案！');
      readingSubmitted.value = true;
      const q = currentReadingArticle.value.questions;
      let pass = true;
      if (readingSelectedChoice.value !== q[0].ans) pass = false;
      if (!readingFillAnswer.value.trim().includes(q[1].ans)) pass = false;

      if (pass) {
        readingResultMsg.value = '🎉 恭喜！两道真题全部答对！';
        recordTaskDone(2, [], 20);
      } else {
        readingResultMsg.value = '存在错误题目，请对照下方名师解析仔细订正！';
        recordTaskDone(2, [], 20);
      }
    };

    // --- 任务 3: 田字格练字 ---
    const openCalligraphyModal = () => {
      startTaskTimer(3);
      calligraphyPhotos.value = [];
      showCalligraphyModal.value = true;
    };

    const handleCalligraphyPhotos = (e) => {
      const files = Array.from(e.target.files);
      files.forEach(f => {
        const r = new FileReader();
        r.onload = ev => calligraphyPhotos.value.push({ name: f.name, dataUrl: ev.target.result, size: f.size, type: f.type });
        r.readAsDataURL(f);
      });
    };

    const submitCalligraphy = () => {
      recordTaskDone(3, calligraphyPhotos.value, 10);
      showCalligraphyModal.value = false;
      alert('🎉 每日练字打卡成功！');
    };

    // --- 任务 4: 口算一屏无滚动条快练 ---
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
            question: `口算：${p.expr}`,
            studentAnswer: String(p.userAns || '未答'),
            correctAnswer: String(p.ans),
            errorType: '口算失误',
            analysis: '进退位计算失误，需加强心算对齐',
            date: '2026-09-04',
            resolved: false
          });
        }
      });
      mathSubmitted.value = true;
      if (right >= 7) {
        mathPassed.value = true;
        mathScoreSummary.value = `🎉 做对 ${right} / 10 题，成绩达标！`;
        recordTaskDone(4);
      } else {
        mathPassed.value = false;
        mathScoreSummary.value = `做对 ${right} / 10 题，未达 7 题标准，错题已归入错题集！`;
      }
    };

    // --- 任务 5: 奥数题闯关 ---
    const openOlympiadModal = () => {
      startTaskTimer(5);
      olympiadStage.value = 'problem';
      olympiadPhotos.value = [];
      showOlympiadModal.value = true;
    };

    const handleOlympiadPhotos = (e) => {
      const files = Array.from(e.target.files);
      files.forEach(f => {
        const r = new FileReader();
        r.onload = ev => olympiadPhotos.value.push({ name: f.name, dataUrl: ev.target.result, size: f.size, type: f.type });
        r.readAsDataURL(f);
      });
    };

    const nextOlympiadStage = (stage) => {
      olympiadStage.value = stage;
    };

    const completeOlympiad = () => {
      recordTaskDone(5, olympiadPhotos.value, 15);
      showOlympiadModal.value = false;
      alert('🎉 奥数逻辑思维闯关成功！');
    };

    // --- 任务 6: 记单词与听写 ---
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
        logPointTransaction(currentStudentId.value, '默写拍照额外嘉奖', 3, currentStudent.value.points);
      }
      showDictationModal.value = false;
      alert('🎉 记单词与默写达标！');
    };

    // --- 任务 9: 英译中（提交后才给参考译文） ---
    const submitTranslation = () => {
      if (!userTranslationInput.value.trim()) return alert('请先写下你的中文翻译！');
      translationSubmitted.value = true;
      recordTaskDone(9, [], 5);
    };

    // --- 任务 10: 英文阅读理解（选项真实可点，当场判分） ---
    const selectEnglishReadingChoice = (qId, optionKey) => {
      if (englishReadingSubmitted.value) return;
      englishReadingUserChoices.value[qId] = optionKey;
    };

    const submitEnglishReading = () => {
      const qs = todayWordPack.value.readingComprehension.questions;
      if (Object.keys(englishReadingUserChoices.value).length < qs.length) {
        return alert('请先完整作答所有 3 道阅读理解题目！');
      }
      englishReadingSubmitted.value = true;
      let right = 0;
      qs.forEach(q => {
        if (englishReadingUserChoices.value[q.id] === q.ans) right++;
      });
      englishReadingScore.value = right;
      recordTaskDone(10, [], 10);
    };

    // --- 任务 11: 完形填空（选项真实可点，当场判分） ---
    const selectClozeChoice = (blankNum, optionKey) => {
      if (clozeSubmitted.value) return;
      clozeUserChoices.value[blankNum] = optionKey;
    };

    const submitClozeTest = () => {
      const blanks = todayWordPack.value.clozeTest.blanks;
      if (Object.keys(clozeUserChoices.value).length < blanks.length) {
        return alert('请先选完所有 5 个填空选项！');
      }
      clozeSubmitted.value = true;
      let right = 0;
      blanks.forEach(b => {
        if (clozeUserChoices.value[b.num] === b.ans) right++;
      });
      clozeScore.value = right;
      recordTaskDone(11, [], 8);
    };

    // --- 任务 12: 错题录入 ---
    const submitSchoolError = () => {
      if (!newSchoolError.value.question.trim() && !newSchoolError.value.photoUrl) {
        return alert('请输入错题内容或上传错题照片！');
      }
      errors.value.unshift({
        id: Date.now() + Math.random(),
        studentId: currentStudentId.value,
        question: newSchoolError.value.question.trim() || '学校真实错题拍照录入',
        studentAnswer: '见订正本',
        correctAnswer: '见订正本',
        errorType: newSchoolError.value.subject + '错题',
        analysis: newSchoolError.value.analysis.trim() || '已完成红笔订正与考点复盘',
        date: '2026-09-04',
        resolved: false
      });
      recordTaskDone(12, [], 15);
      showSchoolErrorModal.value = false;
      alert('🎉 学校错题已成功归入错题集！');
    };

    // --- 任务 13: 整本书伴读 ---
    const submitBookReading = () => {
      if (!bookForm.value.bookName.trim()) return alert('请输入今日阅读书名！');
      recordTaskDone(13, [], bookForm.value.duration || 20);
      showBookReadingModal.value = false;
      alert('🎉 今日阅读记录与明日计划保存成功！');
    };

    // --- 家长总控专属功能 ---
    const openParentResetPin = (st) => {
      parentTargetStudent.value = st;
      parentNewPinInput.value = '';
      showParentResetPinModal.value = true;
    };

    const confirmParentResetPin = () => {
      if (!parentNewPinInput.value || parentNewPinInput.value.length !== 4) {
        return alert('请输入 4 位纯数字密码！');
      }
      parentTargetStudent.value.pin = parentNewPinInput.value;
      showParentResetPinModal.value = false;
      syncToCloud();
      alert(`🎉 成功重置 ${parentTargetStudent.value.name} 的登录密码为：${parentNewPinInput.value}`);
    };

    const openAssignModal = () => {
      newTask.value.title = '';
      newTask.value.targetTaskId = null;
      parentTaskFiles.value = [];
      showAssignModal.value = true;
    };

    const handleParentTaskFiles = (e) => {
      const files = Array.from(e.target.files);
      files.forEach(f => {
        const r = new FileReader();
        r.onload = ev => parentTaskFiles.value.push({ name: f.name, dataUrl: ev.target.result, size: f.size, type: f.type });
        r.readAsDataURL(f);
      });
    };

    const confirmAssignTask = () => {
      if (!newTask.value.title.trim()) return alert('请输入任务名称！');
      customTasks.value.unshift({
        id: 'ct_' + Date.now(),
        code: '令',
        category: '家长特派',
        icon: '⚡',
        title: newTask.value.title.trim(),
        duration: newTask.value.duration || '15分钟',
        points: newTask.value.points || 3,
        criteria: newTask.value.criteria || '家长验收',
        targetStudentId: newTask.value.targetStudentId,
        targetTaskId: newTask.value.targetTaskId,
        isCustom: true,
        parentAttachments: [...parentTaskFiles.value]
      });
      showAssignModal.value = false;
      parentTaskFiles.value = [];
      syncToCloud();
      alert('家长指令任务下发成功，已置顶并同步至所有设备！');
    };

    const openPointAdjustModal = (st) => {
      targetPointStudent.value = st;
      customPointAmount.value = 10;
      customPointReason.value = '';
      showPointModal.value = true;
    };

    const confirmCustomPointAdjust = () => {
      if (!targetPointStudent.value) return;
      const delta = parseInt(customPointAmount.value, 10);
      if (isNaN(delta) || delta === 0) return alert('请输入有效的加减分数值！');

      targetPointStudent.value.points += delta;
      if (targetPointStudent.value.points < 0) targetPointStudent.value.points = 0;

      const reason = customPointReason.value.trim() || (delta > 0 ? '家长特别嘉奖' : '批评扣除');
      logPointTransaction(targetPointStudent.value.id, `家长奖惩: ${reason}`, delta, targetPointStudent.value.points);

      showPointModal.value = false;
      syncToCloud();
      alert(`已为 ${targetPointStudent.value.name} ${delta > 0 ? '奖励' : '扣除'} ${Math.abs(delta)} 积分！`);
    };

    // 头像自定义
    const handleAvatarChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const r = new FileReader();
      r.onload = ev => {
        currentStudent.value.avatarImg = ev.target.result;
        syncToCloud();
        alert('🎉 头像修改成功，全网全端实时同步！');
      };
      r.readAsDataURL(file);
    };

    // 登录与切换
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

    // 整合今日任务
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

    // 云端数据同步
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

    // 全局 ESC 退出
    const closeAllModals = () => {
      showPinModal.value = false;
      showWheelModal.value = false;
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
      showPointModal.value = false;
      showDayDetailModal.value = false;
      showAddShopItemModal.value = false;
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
      showWheelModal, wheelRotation, isWheelSpinning, wheelTargetTask, openWheelModal, spinLuckyWheel, jumpToWheelTask,
      showHomeworkModal, hwForm, hwPhotos, hwGradingStatus, isHwGrading, openHomeworkModal, handleHwMultiPhotos, submitSchoolHomework,
      showReadingModal, currentReadingArticle, readingSelectedChoice, readingFillAnswer, readingSubmitted, readingResultMsg, openReadingModal, submitReadingQuiz,
      showCalligraphyModal, calligraphyData, calligraphyPhotos, openCalligraphyModal, handleCalligraphyPhotos, submitCalligraphy,
      showMathModal, mathProblems, mathSubmitted, mathPassed, mathScoreSummary, startMathDrill, submitMathDrill,
      showOlympiadModal, currentOlympiadData, olympiadStage, olympiadPhotos, openOlympiadModal, handleOlympiadPhotos, nextOlympiadStage, completeOlympiad,
      showWordModal, showDictationModal, todayWordPack, dictationStep, dictationCountdown, dictationPhotos, openWordModal, startDictationMode, submitDictation, speakText,
      showSentenceSpeakModal, showSentenceStructureModal, showTranslationModal, showEnglishReadingModal, showClozeModal,
      userTranslationInput, translationSubmitted, submitTranslation,
      englishReadingUserChoices, englishReadingSubmitted, englishReadingScore, selectEnglishReadingChoice, submitEnglishReading,
      clozeUserChoices, clozeSubmitted, clozeScore, selectClozeChoice, submitClozeTest,
      showSchoolErrorModal, newSchoolError, submitSchoolError, errors,
      showBookReadingModal, bookForm, submitBookReading,
      showParentResetPinModal, parentTargetStudent, parentNewPinInput, openParentResetPin, confirmParentResetPin,
      showAssignModal, newTask, parentTaskFiles, openAssignModal, handleParentTaskFiles, confirmAssignTask,
      showPointModal, targetPointStudent, customPointAmount, customPointReason, openPointAdjustModal, confirmCustomPointAdjust,
      handleAvatarChange, checkins, recordTaskDone, openTaskInteractive
    };
  }
}).mount('#app');
// 家庭研学中枢 - Vue 主控制器 (口算单行严谨排版、练字一句/诗、奥数分步解析)
const { createApp, ref, computed, onMounted, onUnmounted } = Vue;

const AudioEngine = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
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
  playWin() {
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
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

try {
  const app = createApp({
    setup() {
      const currentLoggedInUser = ref(null);
      const activeTab = ref('today');
      const showPinModal = ref(false);
      const selectedAuthUser = ref(null);
      const enteredPin = ref('');

      const showSettings = ref(false);
      const showAssignModal = ref(false);
      const showPointModal = ref(false);
      const showAttachmentViewer = ref(false);
      const showQuizModal = ref(false);
      const showDayDetailModal = ref(false);
      const showAddShopItemModal = ref(false);

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

      const showParentResetPinModal = ref(false);
      const parentTargetStudent = ref(null);
      const parentNewPinInput = ref('');

      // 转盘
      const showWheelModal = ref(false);
      const wheelRotation = ref(0);
      const isWheelSpinning = ref(false);
      const wheelTargetTask = ref(null);

      // 计时器
      const activeTimingTaskId = ref(null);
      const taskTimerSeconds = ref(0);
      const isTimerRunning = ref(false);
      let timerInterval = null;

      const startTaskTimer = (taskId) => {
        try {
          if (activeTimingTaskId.value !== taskId) {
            activeTimingTaskId.value = taskId;
            taskTimerSeconds.value = 0;
          }
          isTimerRunning.value = true;
          if (timerInterval) clearInterval(timerInterval);
          timerInterval = setInterval(() => { taskTimerSeconds.value++; }, 1000);
        } catch (e) {}
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

      const config = ref({
        siliconKey: localStorage.getItem('cfg_silicon') || '',
        upstashUrl: localStorage.getItem('cfg_upstash_url') || '',
        upstashToken: localStorage.getItem('cfg_upstash_token') || ''
      });

      const students = ref(window.StudyData?.defaultStudents || []);
      const currentStudentId = ref('nuo');
      const baseTasks = ref(window.StudyData?.baseTasks || []);
      const customTasks = ref([]);
      const parentTaskFiles = ref([]);
      const newTask = ref({ targetStudentId: 'ALL', targetTaskId: null, title: '', duration: '15分钟', points: 3, criteria: '认真完成' });

      const checkins = ref({});
      const errors = ref([]);
      const quizRecords = ref([]);
      const pointLogs = ref([]);
      const shopItems = ref(window.StudyData?.defaultShopItems || []);

      const parentProfile = { id: 'parent', name: '家长总控', avatar: '🛡️', grade: '总控管理员', pin: '8888' };
      const currentStudent = computed(() => students.value.find(s => s.id === currentStudentId.value) || students.value[0]);
      const rankedStudents = computed(() => [...students.value].sort((a, b) => b.points - a.points));

      // 任务 1
      const hwForm = ref({ yuwen: '', shuxue: '', yingyu: '', durationMinutes: 35, mode: 'direct' });
      const hwPhotos = ref([]);
      const hwGradingStatus = ref('');
      const isHwGrading = ref(false);

      // 任务 2 阅读 (至少3个题目)
      const currentReadingArticle = computed(() => {
        const g = currentStudent.value.grade || '';
        const isJunior = g.includes('1年级') || g.includes('2年级');
        const articles = window.StudyData?.readingArticles || [];
        return articles.find(a => a.forJunior === isJunior) || articles[0];
      });
      const readingUserChoices = ref({});
      const readingSubmitted = ref(false);
      const readingScore = ref(0);

      // 任务 3 练字 (一屏一句诗)
      const calligraphySentenceObj = computed(() => window.StudyData?.calligraphySentences?.[0] || { sentence: '' });
      const calligraphyPhotos = ref([]);

      // 任务 4 口算 (单行规整排版)
      const mathProblems = ref([]);
      const mathSubmitted = ref(false);
      const mathPassed = ref(false);
      const mathScoreSummary = ref('');

      // 任务 5 奥数
      const currentOlympiadData = computed(() => {
        const g = currentStudent.value.grade || '';
        const bank = window.StudyData?.olympiadBank || {};
        for (let k in bank) {
          if (g.includes(k.replace('小学', ''))) return bank[k];
        }
        return bank['小学3年级'];
      });
      const olympiadStage = ref('problem');
      const olympiadPhotos = ref([]);

      // 任务 6 单词
      const todayWordPack = computed(() => window.StudyData?.englishWordPack || { words: [] });
      const dictationStep = ref(0);
      const dictationCountdown = ref(20);
      const dictationTimer = ref(null);
      const dictationPhotos = ref([]);

      // 任务 9 翻译
      const userTranslationInput = ref('');
      const translationSubmitted = ref(false);

      // 任务 10 阅读
      const englishReadingUserChoices = ref({});
      const englishReadingSubmitted = ref(false);
      const englishReadingScore = ref(0);

      // 任务 11 完形
      const clozeUserChoices = ref({});
      const clozeSubmitted = ref(false);
      const clozeScore = ref(0);

      // 任务 12 & 13
      const newSchoolError = ref({ subject: '数学', question: '', analysis: '', photoUrl: '' });
      const bookForm = ref({ bookName: '', pages: '', duration: 20, summary: '', nextPlan: '' });

      const speakText = (text, lang = 'en-US') => {
        try {
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = lang;
            utter.rate = 0.9;
            window.speechSynthesis.speak(utter);
          }
        } catch (e) {}
      };

      const logPointTransaction = (studentId, title, change, newBalance) => {
        pointLogs.value.unshift({ id: 'log_' + Date.now(), studentId, title, change, balance: newBalance, time: '2026-09-04 15:50' });
      };

      const recordTaskDone = (taskId, files = [], extraMinutes = 0) => {
        const k = `${currentStudentId.value}_2026-09-04`;
        let current = checkins.value[k];
        if (!current || Array.isArray(current)) {
          current = { doneTaskIds: Array.isArray(current) ? [...current] : [], attachments: {} };
        }
        const isAlreadyDone = current.doneTaskIds.includes(taskId);
        if (!isAlreadyDone) current.doneTaskIds.push(taskId);
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

      // 大转盘
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

        const doneIds = checkins.value[`${currentStudentId.value}_2026-09-04`]?.doneTaskIds || [];
        let mandatoryTaskIds = [];
        if (currentStudentId.value === 'nuo') mandatoryTaskIds = [4, 5];
        else if (currentStudentId.value === 'wei') mandatoryTaskIds = [2, 5, 4];
        else if (currentStudentId.value === 'yi') mandatoryTaskIds = [4, 5];
        else if (currentStudentId.value === 'dai') mandatoryTaskIds = [4, 2];

        const pendingMandatory = mandatoryTaskIds.filter(id => !doneIds.includes(id));
        let pickedTaskId = pendingMandatory.length > 0 ? pendingMandatory[0] : (baseTasks.value.find(t => t.id !== 1 && !doneIds.includes(t.id))?.id || 4);

        const target = baseTasks.value.find(t => t.id === pickedTaskId) || baseTasks.value[1];
        wheelTargetTask.value = target;

        const targetIndex = baseTasks.value.indexOf(target) % 8;
        const targetDegree = 360 * 5 + (360 - (targetIndex * 45 + 22.5));
        wheelRotation.value = targetDegree;

        let tickCount = 0;
        const tickInterval = setInterval(() => {
          AudioEngine.playTick();
          tickCount++;
          if (tickCount > 35) clearInterval(tickInterval);
        }, 90);

        setTimeout(() => {
          isWheelSpinning.value = false;
          AudioEngine.playWin();
        }, 4000);
      };

      const jumpToWheelTask = () => {
        showWheelModal.value = false;
        if (wheelTargetTask.value) openTaskInteractive(wheelTargetTask.value);
      };

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

      // 任务 1
      const openHomeworkModal = () => { startTaskTimer(1); hwPhotos.value = []; hwGradingStatus.value = ''; showHomeworkModal.value = true; };
      const handleHwMultiPhotos = (e) => {
        Array.from(e.target.files).forEach(f => {
          const r = new FileReader();
          r.onload = ev => hwPhotos.value.push({ name: f.name, dataUrl: ev.target.result, size: f.size, type: f.type });
          r.readAsDataURL(f);
        });
      };
      const submitSchoolHomework = async () => {
        if (hwForm.value.mode === 'direct') {
          recordTaskDone(1, hwPhotos.value, hwForm.value.durationMinutes);
          showHomeworkModal.value = false;
          openWheelModal();
        } else {
          if (!config.value.siliconKey) { alert('请先配置 AI 密钥！'); return; }
          isHwGrading.value = true;
          hwGradingStatus.value = 'AI 老师质检中...';
          try {
            const firstImg = hwPhotos.value.find(p => p.type?.startsWith('image/'));
            const base64 = firstImg ? firstImg.dataUrl.split(',')[1] : null;
            if (base64) {
              const res = await window.StudyAI.gradeHomework(config.value.siliconKey, base64);
              if (res.errors && res.errors.length > 0) {
                res.errors.forEach(err => errors.value.unshift({ id: Date.now() + Math.random(), studentId: currentStudentId.value, ...err, date: '2026-09-04', resolved: false }));
              }
            }
            recordTaskDone(1, hwPhotos.value, hwForm.value.durationMinutes);
            showHomeworkModal.value = false;
            openWheelModal();
          } catch (e) {
            recordTaskDone(1, hwPhotos.value, hwForm.value.durationMinutes);
            showHomeworkModal.value = false;
            openWheelModal();
          } finally {
            isHwGrading.value = false;
          }
        }
      };

      // 任务 2 阅读 (3道题判分)
      const openReadingModal = () => { startTaskTimer(2); readingUserChoices.value = {}; readingSubmitted.value = false; showReadingModal.value = true; };
      const selectReadingChoice = (qId, optKey) => { if (!readingSubmitted.value) readingUserChoices.value[qId] = optKey; };
      const submitReadingQuiz = () => {
        const qs = currentReadingArticle.value.questions;
        if (Object.keys(readingUserChoices.value).length < qs.length) return alert('请答完所有 3 道题目！');
        readingSubmitted.value = true;
        let right = 0;
        qs.forEach(q => { if (readingUserChoices.value[q.id] === q.ans) right++; });
        readingScore.value = right;
        recordTaskDone(2, [], 20);
      };

      // 任务 3 练字
      const openCalligraphyModal = () => { startTaskTimer(3); calligraphyPhotos.value = []; showCalligraphyModal.value = true; };
      const handleCalligraphyPhotos = (e) => {
        Array.from(e.target.files).forEach(f => {
          const r = new FileReader();
          r.onload = ev => calligraphyPhotos.value.push({ name: f.name, dataUrl: ev.target.result, size: f.size, type: f.type });
          r.readAsDataURL(f);
        });
      };
      const submitCalligraphy = () => { recordTaskDone(3, calligraphyPhotos.value, 10); showCalligraphyModal.value = false; alert('练字打卡成功！'); };

      // 任务 4 口算
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
          if (parseFloat(p.userAns) === p.ans) right++;
          else errors.value.unshift({ id: Date.now()+Math.random(), studentId: currentStudentId.value, question: `口算: ${p.expr}`, studentAnswer: String(p.userAns||''), correctAnswer: String(p.ans), errorType: '口算失误', analysis: '计算失误', date: '2026-09-04', resolved: false });
        });
        mathSubmitted.value = true;
        if (right >= 7) {
          mathPassed.value = true;
          mathScoreSummary.value = `做对 ${right} / 10 题，达标！`;
          recordTaskDone(4);
        } else {
          mathPassed.value = false;
          mathScoreSummary.value = `做对 ${right} / 10 题，未达标。`;
        }
      };

      // 任务 5 奥数
      const openOlympiadModal = () => { startTaskTimer(5); olympiadStage.value = 'problem'; olympiadPhotos.value = []; showOlympiadModal.value = true; };
      const handleOlympiadPhotos = (e) => {
        Array.from(e.target.files).forEach(f => {
          const r = new FileReader();
          r.onload = ev => olympiadPhotos.value.push({ name: f.name, dataUrl: ev.target.result, size: f.size, type: f.type });
          r.readAsDataURL(f);
        });
      };
      const nextOlympiadStage = (s) => { olympiadStage.value = s; };
      const completeOlympiad = () => { recordTaskDone(5, olympiadPhotos.value, 15); showOlympiadModal.value = false; alert('奥数打卡成功！'); };

      // 任务 6 单词
      const openWordModal = () => { startTaskTimer(6); showWordModal.value = true; };
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
            if (dictationStep.value < 4) { dictationStep.value++; playDictationWord(); }
            else { clearInterval(dictationTimer.value); }
          }
        }, 1000);
      };
      const submitDictation = () => {
        if (dictationTimer.value) clearInterval(dictationTimer.value);
        recordTaskDone(6, dictationPhotos.value, 15);
        if (dictationPhotos.value.length > 0) {
          currentStudent.value.points += 3;
          logPointTransaction(currentStudentId.value, '默写拍照加奖', 3, currentStudent.value.points);
        }
        showDictationModal.value = false;
        alert('记单词达标！');
      };

      // 任务 9 翻译
      const submitTranslation = () => {
        if (!userTranslationInput.value.trim()) return alert('请输入翻译！');
        translationSubmitted.value = true;
        recordTaskDone(9, [], 5);
      };

      // 任务 10 阅读
      const selectEnglishReadingChoice = (qId, optKey) => { if (!englishReadingSubmitted.value) englishReadingUserChoices.value[qId] = optKey; };
      const submitEnglishReading = () => {
        const qs = todayWordPack.value.readingComprehension.questions;
        if (Object.keys(englishReadingUserChoices.value).length < qs.length) return alert('请答完所有题目！');
        englishReadingSubmitted.value = true;
        let right = 0;
        qs.forEach(q => { if (englishReadingUserChoices.value[q.id] === q.ans) right++; });
        englishReadingScore.value = right;
        recordTaskDone(10, [], 10);
      };

      // 任务 11 完形
      const selectClozeChoice = (bNum, optKey) => { if (!clozeSubmitted.value) clozeUserChoices.value[bNum] = optKey; };
      const submitClozeTest = () => {
        const blanks = todayWordPack.value.clozeTest.blanks;
        if (Object.keys(clozeUserChoices.value).length < blanks.length) return alert('请选完所有空！');
        clozeSubmitted.value = true;
        let right = 0;
        blanks.forEach(b => { if (clozeUserChoices.value[b.num] === b.ans) right++; });
        clozeScore.value = right;
        recordTaskDone(11, [], 8);
      };

      // 任务 12 & 13
      const submitSchoolError = () => {
        if (!newSchoolError.value.question.trim()) return alert('请输入错题内容！');
        errors.value.unshift({ id: Date.now(), studentId: currentStudentId.value, question: newSchoolError.value.question, studentAnswer: '订正', correctAnswer: '订正', errorType: '错题', analysis: newSchoolError.value.analysis || '已订正', date: '2026-09-04', resolved: false });
        recordTaskDone(12, [], 15);
        showSchoolErrorModal.value = false;
        alert('错题录入成功！');
      };

      const submitBookReading = () => {
        if (!bookForm.value.bookName.trim()) return alert('请输入书名！');
        recordTaskDone(13, [], bookForm.value.duration || 20);
        showBookReadingModal.value = false;
        alert('伴读打卡成功！');
      };

      // 家长控制
      const openParentResetPin = (st) => { parentTargetStudent.value = st; parentNewPinInput.value = ''; showParentResetPinModal.value = true; };
      const confirmParentResetPin = () => {
        if (!parentNewPinInput.value || parentNewPinInput.value.length !== 4) return alert('请输入4位密码！');
        parentTargetStudent.value.pin = parentNewPinInput.value;
        showParentResetPinModal.value = false;
        syncToCloud();
        alert('密码重置成功！');
      };

      const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const r = new FileReader();
        r.onload = ev => { currentStudent.value.avatarImg = ev.target.result; syncToCloud(); alert('头像修改成功！'); };
        r.readAsDataURL(file);
      };

      const openPinModal = (user) => { selectedAuthUser.value = user; enteredPin.value = ''; showPinModal.value = true; };
      const pressPin = (num) => {
        if (enteredPin.value.length < 4) {
          enteredPin.value += String(num);
          if (enteredPin.value.length === 4) {
            if (enteredPin.value === (selectedAuthUser.value.pin || '1234')) {
              switchToUser(selectedAuthUser.value);
              showPinModal.value = false;
              enteredPin.value = '';
            } else {
              alert('密码错误！');
              enteredPin.value = '';
            }
          }
        }
      };
      const clearPin = () => { enteredPin.value = ''; };
      const switchToUser = (user) => { currentLoggedInUser.value = user; if (user.id !== 'parent') currentStudentId.value = user.id; };
      const logout = () => { currentLoggedInUser.value = null; };

      const allTodayTasks = computed(() => {
        const personalCustom = customTasks.value.filter(t => t.targetStudentId === 'ALL' || t.targetStudentId === currentStudentId.value);
        return [...personalCustom, ...baseTasks.value];
      });

      const isHomeworkDone = computed(() => (checkins.value[`${currentStudentId.value}_2026-09-04`]?.doneTaskIds || []).includes(1));
      const totalTaskCount = computed(() => allTodayTasks.value.length);
      const todayDoneCount = computed(() => (checkins.value[`${currentStudentId.value}_2026-09-04`]?.doneTaskIds || []).length);
      const isDone = (id) => (checkins.value[`${currentStudentId.value}_2026-09-04`]?.doneTaskIds || []).includes(id);

      const syncToCloud = async () => {
        try {
          await window.StudyDB.save(config.value.upstashUrl, config.value.upstashToken, {
            students: students.value,
            checkins: checkins.value,
            errors: errors.value,
            customTasks: customTasks.value,
            quizRecords: quizRecords.value,
            pointLogs: pointLogs.value,
            shopItems: shopItems.value
          });
        } catch (e) {}
      };

      const loadFromCloud = async () => {
        try {
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
        } catch (e) {}
      };

      const saveConfig = () => {
        localStorage.setItem('cfg_silicon', config.value.siliconKey);
        localStorage.setItem('cfg_upstash_url', config.value.upstashUrl);
        localStorage.setItem('cfg_upstash_token', config.value.upstashToken);
        showSettings.value = false;
        loadFromCloud();
      };

      const handleGlobalKeyDown = (e) => {
        if (e.key === 'Escape') {
          showPinModal.value = false;
          showSettings.value = false;
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
          showParentResetPinModal.value = false;
          showWheelModal.value = false;
        }
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
        baseTasks, customTasks, allTodayTasks, isHomeworkDone, totalTaskCount, todayDoneCount, isDone,
        config, showSettings, saveConfig, syncToCloud,
        activeTimingTaskId, taskTimerSeconds, isTimerRunning, startTaskTimer, pauseTaskTimer, formatSeconds,
        showWheelModal, wheelRotation, isWheelSpinning, wheelTargetTask, openWheelModal, spinLuckyWheel, jumpToWheelTask,
        showHomeworkModal, hwForm, hwPhotos, hwGradingStatus, isHwGrading, openHomeworkModal, handleHwMultiPhotos, submitSchoolHomework,
        showReadingModal, currentReadingArticle, readingUserChoices, readingSubmitted, readingScore, openReadingModal, selectReadingChoice, submitReadingQuiz,
        showCalligraphyModal, calligraphyData, calligraphyPhotos, openCalligraphyModal, handleCalligraphyPhotos, submitCalligraphy,
        showMathModal, mathProblems, mathSubmitted, mathPassed, mathScoreSummary, startMathDrill, submitMathDrill,
        showOlympiadModal, currentOlympiadData, olympiadStage, olympiadPhotos, openOlympiadModal, handleOlympiadPhotos, nextOlympiadStage, completeOlympiad,
        showWordModal, showDictationModal, todayWordPack, dictationStep, dictationCountdown, dictationPhotos, openWordModal, startDictationMode, submitDictation, speakText,
        showSentenceSpeakModal, showSentenceStructureModal, showTranslationModal, showEnglishReadingModal, showClozeModal,
        userTranslationInput, translationSubmitted, submitTranslation,
        englishReadingUserChoices, englishReadingSubmitted, englishReadingScore, selectEnglishReadingChoice, submitEnglishReading,
        clozeUserChoices, clozeSubmitted, clozeScore, selectClozeChoice, submitClozeTest,
        showSchoolErrorModal, newSchoolError, submitSchoolError, errors,
        showBookReadingModal, bookBookForm: bookForm, submitBookReading,
        showParentResetPinModal, parentTargetStudent, parentNewPinInput, openParentResetPin, confirmParentResetPin,
        handleAvatarChange, checkins, recordTaskDone, openTaskInteractive, calligraphySentenceObj
      };
    }
  });

  app.mount('#app');
} catch (err) {
  console.error("Vue Mount Error:", err);
}
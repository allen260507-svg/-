// 家庭研学中枢 - Vue 3 控制器 (含原生 Web Audio 音效、作弊大转盘、低年级英语过滤)
const { createApp, ref, computed, onMounted, onUnmounted } = Vue;

createApp({
  setup() {
    const currentLoggedInUser = ref(null);
    const activeTab = ref('today');
    const showPinModal = ref(false);
    const selectedAuthUser = ref(null);
    const enteredPin = ref('');

    // 全局弹窗控制
    const showSettings = ref(false);
    const showAssignModal = ref(false);
    const showPointModal = ref(false);
    const showDayDetailModal = ref(false);
    const showAddShopItemModal = ref(false);

    // 大转盘游戏化弹窗与状态
    const showWheelModal = ref(false);
    const isSpinning = ref(false);
    const wheelTargetTask = ref(null);
    const wheelRotationDeg = ref(0);

    // 13 个任务专属弹窗
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

    // 家长总控弹窗
    const showParentResetPinModal = ref(false);
    const parentTargetStudent = ref(null);
    const parentNewPinInput = ref('');

    // 研学计时器
    const activeTimingTaskId = ref(null);
    const taskTimerSeconds = ref(0);
    const isTimerRunning = ref(false);
    let timerInterval = null;

    const startTaskTimer = (taskId) => {
      activeTimingTaskId.value = taskId;
      taskTimerSeconds.value = 0;
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

    // 原生 Web Audio API 合成音效 (零加载风险，秒响无报错)
    let audioCtx = null;
    const getAudioContext = () => {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    };

    const playWheelTick = () => {
      try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(650, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } catch (e) {}
    };

    const playFanfareSuccess = () => {
      try {
        const ctx = getAudioContext();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + i * 0.1 + 0.35);
        });
      } catch (e) {}
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
    const newTask = ref({ targetStudentId: 'ALL', title: '', duration: '15分钟', points: 3 });

    const checkins = ref({});
    const errors = ref([]);
    const shopItems = ref(window.StudyData.defaultShopItems);
    const newShopItem = ref({ icon: '🎁', name: '', desc: '', cost: 20 });
    const targetPointStudent = ref(null);
    const customPointAmount = ref(10);

    const parentProfile = { id: 'parent', name: '家长总控', avatar: '🛡️', grade: '总控管理员', pin: '8888' };
    const currentStudent = computed(() => students.value.find(s => s.id === currentStudentId.value) || students.value[0]);

    // 4 人全员奥运领奖台排序
    const rankedStudents = computed(() => [...students.value].sort((a, b) => b.points - a.points));

    // 计算当前学生年级数字 (用于小学三年级以下过滤英语深度作业)
    const studentGradeNumber = computed(() => {
      const g = currentStudent.value.grade || '';
      if (g.includes('1年级')) return 1;
      if (g.includes('2年级')) return 2;
      if (g.includes('3年级')) return 3;
      if (g.includes('4年级')) return 4;
      if (g.includes('5年级')) return 5;
      if (g.includes('6年级')) return 6;
      return 7;
    });

    // 动态生成今日任务清单 (3年级以下自动剔除高阶英语阅读、完形与造句翻译)
    const allTodayTasks = computed(() => {
      const gNum = studentGradeNumber.value;
      const filteredBase = baseTasks.value.filter(t => (t.minGrade || 1) <= gNum);
      const personalCustom = customTasks.value.filter(t => t.targetStudentId === 'ALL' || t.targetStudentId === currentStudentId.value);
      return [...personalCustom, ...filteredBase];
    });

    // 任务 1: 作业表单
    const hwForm = ref({ yuwen: '', shuxue: '', yingyu: '', durationMinutes: 35, mode: 'direct' });
    const hwPhotos = ref([]);
    const hwGradingStatus = ref('');
    const isHwGrading = ref(false);

    // 任务 2: 阅读与 3 道真题
    const currentReadingArticle = computed(() => {
      const isJunior = studentGradeNumber.value <= 2;
      return window.StudyData.readingArticles.find(a => a.forJunior === isJunior) || window.StudyData.readingArticles[0];
    });
    const readingUserChoices = ref({});
    const readingSubmitted = ref(false);
    const readingScore = ref(0);

    // 任务 3: 练字 (一次3字)
    const calligraphyPack = computed(() => window.StudyData.calligraphyPack);
    const calligraphyPhotos = ref([]);

    // 任务 4: 口算
    const mathProblems = ref([]);
    const mathSubmitted = ref(false);
    const mathPassed = ref(false);
    const mathScoreSummary = ref('');

    // 任务 5: 奥数
    const currentOlympiadData = computed(() => {
      const g = currentStudent.value.grade || '';
      const curriculum = window.StudyData.olympiadCurriculum;
      for (let k in curriculum) {
        if (g.includes(k.replace('小学', ''))) return curriculum[k];
      }
      return curriculum['小学3年级'];
    });
    const olympiadStage = ref('problem');
    const olympiadPhotos = ref([]);

    // 任务 6~11: 英语大纲词汇
    const todayWordPack = computed(() => window.StudyData.englishWordPacks[0]);
    const dictationStep = ref(0);
    const dictationCountdown = ref(20);
    const dictationTimer = ref(null);
    const dictationPhotos = ref([]);

    const structureUserInput = ref('');
    const userTranslationInput = ref('');
    const translationSubmitted = ref(false);
    const engReadingChoices = ref({});
    const clozeChoices = ref({});

    // 任务 12: 错题录入
    const newSchoolError = ref({ subject: '数学', question: '', analysis: '' });
    // 任务 13: 伴读
    const bookForm = ref({ bookName: '', pages: '', duration: 20, summary: '', nextPlan: '' });

    // 日历单日明细
    const selectedDetailDateStr = ref('');
    const currentDayDetailDoneCount = ref(0);

    // 语音点读
    const speakText = (text) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.88;
        window.speechSynthesis.speak(u);
      }
    };

    // 记录任务完成
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
        current.attachments[taskId] = files;
      }
      checkins.value[k] = current;

      const spentMin = Math.max(extraMinutes, Math.round(taskTimerSeconds.value / 60));
      currentStudent.value.totalStudyMinutes = (currentStudent.value.totalStudyMinutes || 0) + spentMin;

      pauseTaskTimer();
      activeTimingTaskId.value = null;

      const allT = [...baseTasks.value, ...customTasks.value];
      const taskObj = allT.find(t => t.id === taskId);
      if (taskObj) {
        currentStudent.value.points += taskObj.points;
      }
      syncToCloud();
    };

    // ================== 大转盘作弊算法与游戏化触发 ==================
    const getStudentMandatoryTaskIds = (sId) => {
      // 诺：口算(4)、奥数(5)
      // 威：阅读(2)、奥数(5)、口算(4)
      // 奕：口算(4)、奥数(5)
      // 黛：口算(4)、阅读(2)
      if (sId === 'nuo') return [4, 5];
      if (sId === 'wei') return [2, 5, 4];
      if (sId === 'yi')  return [4, 5];
      if (sId === 'dai') return [4, 2];
      return [4, 5];
    };

    const triggerLuckyWheel = () => {
      wheelTargetTask.value = null;
      wheelRotationDeg.value = 0;
      showWheelModal.value = true;
    };

    const startSpinWheel = () => {
      if (isSpinning.value) return;
      isSpinning.value = true;

      const sId = currentStudentId.value;
      const k = `${sId}_2026-09-04`;
      const doneIds = checkins.value[k]?.doneTaskIds || [];
      const mandatoryIds = getStudentMandatoryTaskIds(sId);

      // 寻找该学生尚未完成的必做科目 (作弊锁定)
      const unfinishedMandatory = mandatoryIds.filter(id => !doneIds.includes(id));

      let targetId = null;
      if (unfinishedMandatory.length > 0) {
        // 必做科目未完成，强制命中必做科目之一
        targetId = unfinishedMandatory[Math.floor(Math.random() * unfinishedMandatory.length)];
      } else {
        // 必做科目全部达成，随机抽取任意一个尚未完成的今日任务
        const unfinishedAll = allTodayTasks.value.filter(t => !doneIds.includes(t.id) && t.id !== 1);
        if (unfinishedAll.length > 0) {
          targetId = unfinishedAll[Math.floor(Math.random() * unfinishedAll.length)].id;
        } else {
          // 全部任务完成
          targetId = allTodayTasks.value[1].id;
        }
      }

      const targetObj = allTodayTasks.value.find(t => t.id === targetId) || allTodayTasks.value[1];

      // 物理旋转与音效节奏控制
      let currentDeg = 0;
      const extraLaps = 5 * 360; // 转 5 整圈
      const finalDeg = extraLaps + Math.floor(Math.random() * 360);
      wheelRotationDeg.value = finalDeg;

      let tickTimer = setInterval(() => {
        playWheelTick();
      }, 120);

      setTimeout(() => {
        clearInterval(tickTimer);
        isSpinning.value = false;
        wheelTargetTask.value = targetObj;
        playFanfareSuccess();
      }, 3000);
    };

    const openWheelSelectedTask = () => {
      showWheelModal.value = false;
      if (wheelTargetTask.value) {
        openTaskInteractive(wheelTargetTask.value);
      }
    };

    // 路由分发 (做完的点击依然支持回看修改)
    const openTaskInteractive = (task) => {
      startTaskTimer(task.id);
      if (task.id === 1) {
        showHomeworkModal.value = true;
      } else if (task.id === 2) {
        readingUserChoices.value = {};
        readingSubmitted.value = false;
        showReadingModal.value = true;
      } else if (task.id === 3) {
        showCalligraphyModal.value = true;
      } else if (task.id === 4) {
        mathProblems.value = window.StudyMath.generateDrill(currentStudent.value.grade);
        mathSubmitted.value = false;
        mathPassed.value = false;
        mathScoreSummary.value = '';
        showMathModal.value = true;
      } else if (task.id === 5) {
        olympiadStage.value = 'problem';
        showOlympiadModal.value = true;
      } else if (task.id === 6) {
        showWordModal.value = true;
      } else if (task.id === 7) {
        showSentenceSpeakModal.value = true;
      } else if (task.id === 8) {
        showSentenceStructureModal.value = true;
      } else if (task.id === 9) {
        userTranslationInput.value = '';
        translationSubmitted.value = false;
        showTranslationModal.value = true;
      } else if (task.id === 10) {
        engReadingChoices.value = {};
        showEnglishReadingModal.value = true;
      } else if (task.id === 11) {
        clozeChoices.value = {};
        showClozeModal.value = true;
      } else if (task.id === 12) {
        showSchoolErrorModal.value = true;
      } else if (task.id === 13) {
        showBookReadingModal.value = true;
      }
    };

    // 任务 1 提交 -> 触发大转盘
    const handleHwMultiPhotos = (e) => {
      const files = Array.from(e.target.files);
      files.forEach(f => {
        const r = new FileReader();
        r.onload = ev => hwPhotos.value.push({ name: f.name, dataUrl: ev.target.result, size: f.size, type: f.type });
        r.readAsDataURL(f);
      });
    };

    const submitSchoolHomework = async () => {
      recordTaskDone(1, hwPhotos.value, hwForm.value.durationMinutes);
      showHomeworkModal.value = false;
      // 提交完学校作业，立刻进入游戏化幸运大转盘！
      triggerLuckyWheel();
    };

    // 任务 2 提交 (3道真题当场判分)
    const submitReadingQuiz = () => {
      if (Object.keys(readingUserChoices.value).length < 3) {
        return alert('请先答完所有 3 道真题！');
      }
      readingSubmitted.value = true;
      let right = 0;
      currentReadingArticle.value.questions.forEach(q => {
        if (readingUserChoices.value[q.id] === q.ans) right++;
      });
      readingScore.value = right;
      recordTaskDone(2, [], 20);
    };

    // 任务 3 练字
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
      alert('🎉 3 个生字规范练写 10 遍打卡成功 (+2分)！');
    };

    // 任务 4 口算 (一屏全览无滚动条)
    const submitMathDrill = () => {
      let r = 0;
      mathProblems.value.forEach(p => {
        if (parseFloat(p.userAns) === p.ans) {
          r++;
        } else {
          errors.value.unshift({
            id: Date.now() + Math.random(),
            studentId: currentStudentId.value,
            question: `口算：${p.expr}`,
            studentAnswer: String(p.userAns || '未作答'),
            correctAnswer: String(p.ans),
            errorType: '口算失误',
            analysis: '进退位计算失误，需加强心算对齐',
            date: '2026-09-04',
            resolved: false
          });
        }
      });
      mathSubmitted.value = true;
      if (r >= 7) {
        mathPassed.value = true;
        mathScoreSummary.value = `🎉 做对 ${r} / 10 题，达标通过！`;
        recordTaskDone(4);
      } else {
        mathPassed.value = false;
        mathScoreSummary.value = `做对 ${r} / 10 题，未达标，错题已归入错题本！`;
      }
    };

    // 任务 5 奥数
    const handleOlympiadPhotos = (e) => {
      const files = Array.from(e.target.files);
      files.forEach(f => {
        const r = new FileReader();
        r.onload = ev => olympiadPhotos.value.push({ name: f.name, dataUrl: ev.target.result, size: f.size, type: f.type });
        r.readAsDataURL(f);
      });
    };
    const nextOlympiadStage = (next) => { olympiadStage.value = next; };
    const completeOlympiad = () => {
      recordTaskDone(5, olympiadPhotos.value, 15);
      showOlympiadModal.value = false;
      alert('🎉 奥数逻辑思维挑战打卡成功 (+3分)！');
    };

    // 任务 6 单词与 20 秒听写
    const startDictationMode = () => {
      showWordModal.value = false;
      showDictationModal.value = true;
      dictationStep.value = 0;
      dictationCountdown.value = 20;
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
            alert('5个单词朗读完毕！拍照上传手写默写本额外奖 +3 积分！');
          }
        }
      }, 1000);
    };

    const submitDictation = () => {
      if (dictationTimer.value) clearInterval(dictationTimer.value);
      recordTaskDone(6, dictationPhotos.value, 15);
      if (dictationPhotos.value.length > 0) {
        currentStudent.value.points += 3;
      }
      showDictationModal.value = false;
      alert('🎉 记单词与默写达标完成！');
    };

    // 任务 9 英译中 (提交后揭晓参考译文)
    const submitTranslation = () => {
      if (!userTranslationInput.value.trim()) return alert('请先输入你的中文翻译！');
      translationSubmitted.value = true;
      recordTaskDone(9);
    };

    // 任务 12 错题录入
    const submitSchoolError = () => {
      if (!newSchoolError.value.question.trim()) return alert('请输入错题题目！');
      errors.value.unshift({
        id: Date.now() + Math.random(),
        studentId: currentStudentId.value,
        question: newSchoolError.value.question.trim(),
        studentAnswer: '见订正本',
        correctAnswer: '见订正本',
        errorType: newSchoolError.value.subject + '错题',
        analysis: newSchoolError.value.analysis.trim() || '已完成红笔二次订正',
        date: '2026-09-04',
        resolved: false
      });
      recordTaskDone(12);
      showSchoolErrorModal.value = false;
      alert('🎉 错题已沉淀入复仇错题本！');
    };

    // 任务 13 伴读
    const submitBookReading = () => {
      if (!bookForm.value.bookName.trim()) return alert('请输入阅读书名！');
      recordTaskDone(13, [], bookForm.value.duration || 20);
      showBookReadingModal.value = false;
      alert('🎉 今日伴读计划已记录成功！');
    };

    const resolveError = (errId) => {
      const e = errors.value.find(x => x.id === errId);
      if (e) {
        e.resolved = true;
        currentStudent.value.points += 4;
        alert('🎉 成功复仇错题，奖励双倍积分 (+4分)！');
        syncToCloud();
      }
    };

    // PIN 解锁登录
    const openPinModal = (user) => { selectedAuthUser.value = user; enteredPin.value = ''; showPinModal.value = true; };
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
            alert('密码错误！');
            enteredPin.value = '';
          }
        }
      }
    };
    const clearPin = () => { enteredPin.value = ''; };
    const switchToUser = (u) => { currentLoggedInUser.value = u; if (u.id !== 'parent') currentStudentId.value = u.id; };
    const logout = () => { currentLoggedInUser.value = null; };

    // 家长总控重置密码
    const openParentResetPin = (st) => { parentTargetStudent.value = st; parentNewPinInput.value = ''; showParentResetPinModal.value = true; };
    const confirmParentResetPin = () => {
      if (!parentNewPinInput.value || parentNewPinInput.value.length !== 4) return alert('请输入 4 位纯数字密码！');
      if (parentTargetStudent.value) parentTargetStudent.value.pin = parentNewPinInput.value;
      showParentResetPinModal.value = false;
      syncToCloud();
      alert('🎉 密码重置成功！');
    };

    const openPointAdjustModal = (st) => { targetPointStudent.value = st; showPointModal.value = true; };
    const confirmCustomPointAdjust = () => {
      if (targetPointStudent.value) {
        targetPointStudent.value.points += customPointAmount.value;
        showPointModal.value = false;
        syncToCloud();
        alert('🎉 积分调整成功！');
      }
    };

    const openAssignModal = () => { newTask.value.title = ''; showAssignModal.value = true; };
    const confirmAssignTask = () => {
      if (!newTask.value.title.trim()) return alert('请输入任务名称！');
      customTasks.value.unshift({ id: 'ct_' + Date.now(), title: newTask.value.title, points: 3, isCustom: true, code: '特派', category: '加练', icon: '📌', duration: '15分钟', criteria: '按要求完成', minGrade: 1 });
      showAssignModal.value = false;
      alert('🎉 临时任务已下发！');
    };

    // 头像修改
    const handleAvatarChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const r = new FileReader();
      r.onload = ev => {
        currentStudent.value.avatarImg = ev.target.result;
        syncToCloud();
        alert('🎉 头像修改成功！');
      };
      r.readAsDataURL(file);
    };

    // 商城操作
    const confirmAddShopItem = () => {
      if (!newShopItem.value.name.trim()) return alert('请输入商品名称！');
      shopItems.value.unshift({ id: 'item_' + Date.now(), ...newShopItem.value });
      showAddShopItemModal.value = false;
      syncToCloud();
    };
    const deleteShopItem = (item) => {
      if (confirm(`确定下架【${item.name}】吗？`)) {
        shopItems.value = shopItems.value.filter(i => i.id !== item.id);
        syncToCloud();
      }
    };
    const redeemShopItem = (item) => {
      if (currentStudent.value.points >= item.cost) {
        currentStudent.value.points -= item.cost;
        alert(`🎉 成功兑换【${item.name}】！`);
        syncToCloud();
      } else {
        alert('积分不足，继续努力！');
      }
    };

    // 日历单日明细与图表统计
    const getStudentDoneCount = (sId) => (checkins.value[`${sId}_2026-09-04`]?.doneTaskIds || []).length;
    const getDayDoneCount = (day) => (day === 4 ? todayDoneCount.value : Math.min(allTodayTasks.value.length, day * 2 + 3));
    const openDayDetailModal = (y, m, d) => {
      selectedDetailDateStr.value = `${y}年${m}月${d}日`;
      currentDayDetailDoneCount.value = getDayDoneCount(d);
      showDayDetailModal.value = true;
    };

    // 柱状图下方 7 天详细统计表数据
    const past7DaysData = computed(() => {
      return [
        { date: '2026-08-29', tasks: 11, points: 26, duration: 95, status: '达标全勤' },
        { date: '2026-08-30', tasks: 12, points: 28, duration: 105, status: '达标全勤' },
        { date: '2026-08-31', tasks: 10, points: 24, duration: 80, status: '良好' },
        { date: '2026-09-01', tasks: 12, points: 29, duration: 110, status: '达标全勤' },
        { date: '2026-09-02', tasks: 11, points: 27, duration: 90, status: '达标全勤' },
        { date: '2026-09-03', tasks: 13, points: 31, duration: 120, status: '卓越全勤' },
        { date: '2026-09-04(今)', tasks: todayDoneCount.value, points: todayDoneCount.value * 3, duration: currentStudent.value.totalStudyMinutes || 0, status: todayDoneCount.value >= 8 ? '进行中(优秀)' : '进行中' }
      ];
    });

    const isDone = (id) => (checkins.value[`${currentStudentId.value}_2026-09-04`]?.doneTaskIds || []).includes(id);
    const isHomeworkDone = computed(() => (checkins.value[`${currentStudentId.value}_2026-09-04`]?.doneTaskIds || []).includes(1));
    const totalTaskCount = computed(() => allTodayTasks.value.length);
    const todayDoneCount = computed(() => (checkins.value[`${currentStudentId.value}_2026-09-04`]?.doneTaskIds || []).length);
    const studentErrors = computed(() => errors.value.filter(e => e.studentId === currentStudentId.value && !e.resolved));

    // 云同步
    const syncToCloud = async () => {
      if (window.StudyDB && config.value.upstashUrl) {
        await window.StudyDB.save(config.value.upstashUrl, config.value.upstashToken, {
          students: students.value, checkins: checkins.value, errors: errors.value, shopItems: shopItems.value
        });
      }
    };

    const loadFromCloud = async () => {
      if (window.StudyDB && config.value.upstashUrl) {
        const data = await window.StudyDB.load(config.value.upstashUrl, config.value.upstashToken);
        if (data) {
          if (data.students) students.value = data.students;
          if (data.checkins) checkins.value = data.checkins;
          if (data.errors) errors.value = data.errors;
          if (data.shopItems) shopItems.value = data.shopItems;
        }
      }
    };

    const saveConfig = () => {
      localStorage.setItem('cfg_silicon', config.value.siliconKey);
      localStorage.setItem('cfg_upstash_url', config.value.upstashUrl);
      localStorage.setItem('cfg_upstash_token', config.value.upstashToken);
      showSettings.value = false;
      loadFromCloud();
      alert('配置保存成功！');
    };

    const closeAllModals = () => {
      showPinModal.value = false; showHomeworkModal.value = false; showReadingModal.value = false;
      showCalligraphyModal.value = false; showMathModal.value = false; showOlympiadModal.value = false;
      showWordModal.value = false; showDictationModal.value = false; showSentenceSpeakModal.value = false;
      showSentenceStructureModal.value = false; showTranslationModal.value = false; showEnglishReadingModal.value = false;
      showClozeModal.value = false; showSchoolErrorModal.value = false; showBookReadingModal.value = false;
      showParentResetPinModal.value = false; showAssignModal.value = false; showPointModal.value = false;
      showDayDetailModal.value = false; showAddShopItemModal.value = false; showSettings.value = false;
      showWheelModal.value = false;
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
      students, currentStudentId, currentStudent, rankedStudents, studentGradeNumber,
      baseTasks, customTasks, allTodayTasks, totalTaskCount, todayDoneCount, isDone, isHomeworkDone, studentErrors,
      isTimerRunning, taskTimerSeconds, pauseTaskTimer, formatSeconds,
      showWheelModal, isSpinning, wheelTargetTask, wheelRotationDeg, startSpinWheel, openWheelSelectedTask,
      openTaskInteractive, recordTaskDone,
      showHomeworkModal, hwForm, isHwGrading, hwGradingStatus, handleHwMultiPhotos, submitSchoolHomework,
      showReadingModal, currentReadingArticle, readingUserChoices, readingSubmitted, readingScore, submitReadingQuiz,
      showCalligraphyModal, calligraphyPack, calligraphyPhotos, handleCalligraphyPhotos, submitCalligraphy,
      showMathModal, mathProblems, mathSubmitted, mathPassed, mathScoreSummary, submitMathDrill,
      showOlympiadModal, currentOlympiadData, olympiadStage, handleOlympiadPhotos, nextOlympiadStage, completeOlympiad,
      showWordModal, showDictationModal, todayWordPack, dictationStep, dictationCountdown, startDictationMode, submitDictation, speakText,
      showSentenceSpeakModal, showSentenceStructureModal, structureUserInput,
      showTranslationModal, userTranslationInput, translationSubmitted, submitTranslation,
      showEnglishReadingModal, engReadingChoices,
      showClozeModal, clozeChoices,
      showSchoolErrorModal, newSchoolError, submitSchoolError,
      showBookReadingModal, bookForm, submitBookReading,
      resolveError,
      showParentResetPinModal, parentTargetStudent, parentNewPinInput, openParentResetPin, confirmParentResetPin,
      showPointModal, targetPointStudent, customPointAmount, openPointAdjustModal, confirmCustomPointAdjust,
      showAssignModal, newTask, openAssignModal, confirmAssignTask,
      shopItems, showAddShopItemModal, newShopItem, confirmAddShopItem, deleteShopItem, redeemShopItem,
      showDayDetailModal, selectedDetailDateStr, currentDayDetailDoneCount, openDayDetailModal, getDayDoneCount, getStudentDoneCount, past7DaysData,
      showSettings, config, saveConfig, syncToCloud, handleAvatarChange
    };
  }
}).mount('#app');
// 家庭研学中枢 - 主逻辑控制器
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

    // 家长总控专属弹窗
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
    const pointLogs = ref([]);
    const shopItems = ref(window.StudyData.defaultShopItems);
    const newShopItem = ref({ icon: '🎁', name: '', desc: '', cost: 20 });
    const targetPointStudent = ref(null);
    const customPointAmount = ref(10);

    const parentProfile = { id: 'parent', name: '家长总控', avatar: '🛡️', grade: '总控管理员', pin: '8888' };
    const currentStudent = computed(() => students.value.find(s => s.id === currentStudentId.value) || students.value[0]);

    // 4 人全员奥运领奖台排序
    const rankedStudents = computed(() => [...students.value].sort((a, b) => b.points - a.points));

    // 任务 1: 作业表单
    const hwForm = ref({ yuwen: '', shuxue: '', yingyu: '', durationMinutes: 35, mode: 'direct' });
    const hwPhotos = ref([]);
    const hwGradingStatus = ref('');
    const isHwGrading = ref(false);

    // 任务 2: 阅读与 3 道真题
    const currentReadingArticle = computed(() => {
      const g = currentStudent.value.grade || '';
      const isJunior = g.includes('1年级') || g.includes('2年级');
      return window.StudyData.readingArticles.find(a => a.forJunior === isJunior) || window.StudyData.readingArticles[0];
    });
    const readingUserChoices = ref({});
    const readingSubmitted = ref(false);
    const readingScore = ref(0);

    // 任务 3: 田字格练字 (一屏一句诗)
    const calligraphySentenceObj = computed(() => window.StudyData.calligraphyPoem);
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

    // 任务 6~11: 英语单词包与真题链
    const todayWordPack = computed(() => window.StudyData.englishWordPacks[0]);
    const dictationStep = ref(0);
    const dictationCountdown = ref(20);
    const dictationTimer = ref(null);
    const dictationPhotos = ref([]);

    // 任务 8: 造句
    const structureUserInput = ref('');
    // 任务 9: 英译中
    const userTranslationInput = ref('');
    const translationSubmitted = ref(false);
    // 任务 10: 英文阅读
    const engReadingChoices = ref({});
    // 任务 11: 完形填空
    const clozeChoices = ref({});

    // 任务 12: 错题录入
    const newSchoolError = ref({ subject: '数学', question: '', analysis: '', photoUrl: '' });
    // 任务 13: 伴读
    const bookForm = ref({ bookName: '', pages: '', duration: 20, summary: '', nextPlan: '' });

    // 日历单日明细
    const selectedDetailDateStr = ref('');
    const currentDayDetailDoneCount = ref(0);

    // 语音点读
    const speakText = (text, lang = 'en-US') => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        u.rate = 0.9;
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

    // 任务点击路由分发 (已完成的点击可随时回看/修改)
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

    // 任务 1 提交
    const handleHwMultiPhotos = (e) => {
      const files = Array.from(e.target.files);
      files.forEach(f => {
        const r = new FileReader();
        r.onload = ev => hwPhotos.value.push({ name: f.name, dataUrl: ev.target.result, size: f.size, type: f.type });
        r.readAsDataURL(f);
      });
    };

    const submitSchoolHomework = async () => {
      if (hwForm.value.mode === 'direct' || !config.value.siliconKey) {
        recordTaskDone(1, hwPhotos.value, hwForm.value.durationMinutes);
        showHomeworkModal.value = false;
        alert('🎉 学校家庭作业登记完成并成功打卡！');
      } else {
        isHwGrading.value = true;
        hwGradingStatus.value = 'AI 逐题深度质检中...';
        try {
          const firstImg = hwPhotos.value.find(p => p.type && p.type.startsWith('image/'));
          const base64 = firstImg ? firstImg.dataUrl.split(',')[1] : null;
          if (base64) {
            const res = await window.StudyAI.gradeHomework(config.value.siliconKey, base64);
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach(err => {
                errors.value.unshift({ id: Date.now() + Math.random(), studentId: currentStudentId.value, ...err, date: '2026-09-04', resolved: false });
              });
              alert(`批改完毕！共发现 ${res.errors.length} 处错题，已自动沉淀到【错题复仇本】！`);
            }
          }
        } catch (e) {
          // 降级处理
        } finally {
          isHwGrading.value = false;
          recordTaskDone(1, hwPhotos.value, hwForm.value.durationMinutes);
          showHomeworkModal.value = false;
          alert('🎉 作业登记打卡成功！');
        }
      }
    };

    // 任务 2 提交 (3道真题)
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
      alert('🎉 每日练字诗句临摹打卡成功 (+2分)！');
    };

    // 任务 4 口算提交
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
        mathScoreSummary.value = `🎉 做对 ${r} / 10 题，通过达标！`;
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

    // 任务 9 英译中
    const submitTranslation = () => {
      if (!userTranslationInput.value.trim()) return alert('请输入你的中文翻译！');
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

    // 攻克错题复仇
    const resolveError = (errId) => {
      const e = errors.value.find(x => x.id === errId);
      if (e) {
        e.resolved = true;
        currentStudent.value.points += 4;
        alert('🎉 成功复仇错题，奖励双倍积分 (+4分)！');
        syncToCloud();
      }
    };

    // PIN 登录控制
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

    // 家长总控专属操作
    const openParentResetPin = (st) => { parentTargetStudent.value = st; parentNewPinInput.value = ''; showParentResetPinModal.value = true; };
    const confirmParentResetPin = () => {
      if (!parentNewPinInput.value || parentNewPinInput.value.length !== 4) return alert('请输入 4 位密码！');
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
      customTasks.value.unshift({ id: 'ct_' + Date.now(), title: newTask.value.title, points: 3, isCustom: true, code: '特派', category: '加练', icon: '📌', duration: '15分钟', criteria: '按要求完成' });
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

    // 日历单日明细
    const getStudentDoneCount = (sId) => (checkins.value[`${sId}_2026-09-04`]?.doneTaskIds || []).length;
    const getDayDoneCount = (day) => (day === 4 ? todayDoneCount.value : Math.min(13, day * 2 + 3));
    const openDayDetailModal = (y, m, d) => {
      selectedDetailDateStr.value = `${y}年${m}月${d}日`;
      currentDayDetailDoneCount.value = getDayDoneCount(d);
      showDayDetailModal.value = true;
    };

    // 整合今日任务
    const allTodayTasks = computed(() => {
      const personalCustom = customTasks.value.filter(t => t.targetStudentId === 'ALL' || t.targetStudentId === currentStudentId.value);
      return [...personalCustom, ...baseTasks.value];
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
      baseTasks, customTasks, allTodayTasks, totalTaskCount, todayDoneCount, isDone, isHomeworkDone, studentErrors,
      isTimerRunning, taskTimerSeconds, pauseTaskTimer, formatSeconds,
      openTaskInteractive, recordTaskDone,
      showHomeworkModal, hwForm, isHwGrading, hwGradingStatus, handleHwMultiPhotos, submitSchoolHomework,
      showReadingModal, currentReadingArticle, readingUserChoices, readingSubmitted, readingScore, submitReadingQuiz,
      showCalligraphyModal, calligraphySentenceObj, handleCalligraphyPhotos, submitCalligraphy,
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
      showDayDetailModal, selectedDetailDateStr, currentDayDetailDoneCount, openDayDetailModal, getDayDoneCount, getStudentDoneCount,
      showSettings, config, saveConfig, syncToCloud, handleAvatarChange
    };
  }
}).mount('#app');
// 家庭研学中枢 - Vue 3 控制器 (强制防空保护，确保4个学生和家长卡片完整渲染)
const { createApp, ref, computed, onMounted, onUnmounted } = Vue;

createApp({
  setup() {
    const currentLoggedInUser = ref(null);
    const activeTab = ref('today');
    const showPinModal = ref(false);
    const selectedAuthUser = ref(null);
    const enteredPin = ref('');

    const showSettings = ref(false);
    const showAssignModal = ref(false);
    const showPointModal = ref(false);
    const showDayDetailModal = ref(false);
    const showAddShopItemModal = ref(false);

    const showWheelModal = ref(false);
    const isSpinning = ref(false);
    const wheelTargetTask = ref(null);
    const wheelRotationDeg = ref(0);

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

    let audioCtx = null;
    const getAudioContext = () => {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
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
        const notes = [523.25, 659.25, 783.99, 1046.50];
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

    const config = ref({
      siliconKey: localStorage.getItem('cfg_silicon') || '',
      upstashUrl: localStorage.getItem('cfg_upstash_url') || '',
      upstashToken: localStorage.getItem('cfg_upstash_token') || ''
    });

    // 强制保证 4 个学生绝不丢失的默认备份
    const defaultStudentsBackup = [
      { id: 'nuo', name: '诺', grade: '小学5年级', points: 8, avatar: '🐱', avatarImg: '', pin: '1234', totalStudyMinutes: 35, medals: { gold: 1, silver: 2, bronze: 4, fourth: 5 } },
      { id: 'wei', name: '威', grade: '小学4年级', points: 24, avatar: '🦁', avatarImg: '', pin: '1234', totalStudyMinutes: 68, medals: { gold: 3, silver: 4, bronze: 2, fourth: 1 } },
      { id: 'yi',  name: '奕', grade: '小学2年级', points: 15, avatar: '🐼', avatarImg: '', pin: '1234', totalStudyMinutes: 42, medals: { gold: 2, silver: 3, bronze: 5, fourth: 2 } },
      { id: 'dai', name: '黛', grade: '小学6年级', points: 42, avatar: '🔭', avatarImg: '', pin: '1234', totalStudyMinutes: 110, medals: { gold: 6, silver: 2, bronze: 1, fourth: 0 } }
    ];

    let validStudents = defaultStudentsBackup;
    try {
      const saved = localStorage.getItem('study_os_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          validStudents = parsed;
        }
      }
    } catch (e) {
      validStudents = defaultStudentsBackup;
    }
    const students = ref(validStudents);

    const currentStudentId = ref('nuo');
    const baseTasks = ref(window.StudyData.baseTasks);
    const customTasks = ref(JSON.parse(localStorage.getItem('study_os_custom_tasks') || '[]'));
    const newTask = ref({ targetStudentId: 'ALL', title: '', duration: '15分钟', points: 3 });

    const checkins = ref(JSON.parse(localStorage.getItem('study_os_checkins') || '{}'));
    const errors = ref(JSON.parse(localStorage.getItem('study_os_errors') || '[]'));
    const shopItems = ref(JSON.parse(localStorage.getItem('study_os_shop') || JSON.stringify(window.StudyData.defaultShopItems)));

    const newShopItem = ref({ icon: '🎁', name: '', desc: '', cost: 20 });
    const targetPointStudent = ref(null);
    const customPointAmount = ref(10);

    const parentProfile = { id: 'parent', name: '家长总控', avatar: '🛡️', grade: '总控管理员', pin: '8888' };
    const currentStudent = computed(() => students.value.find(s => s.id === currentStudentId.value) || students.value[0]);

    const rankedStudents = computed(() => [...students.value].sort((a, b) => b.points - a.points));

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

    const allTodayTasks = computed(() => {
      const gNum = studentGradeNumber.value;
      const filteredBase = baseTasks.value.filter(t => (t.minGrade || 1) <= gNum);
      const personalCustom = customTasks.value.filter(t => t.targetStudentId === 'ALL' || t.targetStudentId === currentStudentId.value);
      return [...personalCustom, ...filteredBase];
    });

    const hwForm = ref({ yuwen: '', shuxue: '', yingyu: '', durationMinutes: 35, mode: 'direct' });
    const hwPhotos = ref([]);

    const currentReadingArticle = computed(() => {
      const isJunior = studentGradeNumber.value <= 2;
      return window.StudyData.readingArticles.find(a => a.forJunior === isJunior) || window.StudyData.readingArticles[0];
    });
    const readingUserChoices = ref({});
    const readingSubmitted = ref(false);
    const readingScore = ref(0);

    const calligraphyPack = computed(() => window.StudyData.calligraphyPack);
    const calligraphyPhotos = ref([]);

    const mathProblems = ref([]);
    const mathSubmitted = ref(false);
    const mathPassed = ref(false);
    const mathScoreSummary = ref('');

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

    const newSchoolError = ref({ subject: '数学', question: '', analysis: '' });
    const bookForm = ref({ bookName: '', pages: '', duration: 20, summary: '', nextPlan: '' });

    const selectedDetailDateStr = ref('');
    const currentDayDetailDoneCount = ref(0);

    const speakText = (text) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.88;
        window.speechSynthesis.speak(u);
      }
    };

    const persistAll = async () => {
      localStorage.setItem('study_os_students', JSON.stringify(students.value));
      localStorage.setItem('study_os_checkins', JSON.stringify(checkins.value));
      localStorage.setItem('study_os_errors', JSON.stringify(errors.value));
      localStorage.setItem('study_os_shop', JSON.stringify(shopItems.value));
      localStorage.setItem('study_os_custom_tasks', JSON.stringify(customTasks.value));

      if (window.StudyDB && config.value.upstashUrl) {
        await window.StudyDB.save(config.value.upstashUrl, config.value.upstashToken, {
          students: students.value, checkins: checkins.value, errors: errors.value, shopItems: shopItems.value, customTasks: customTasks.value
        });
      }
    };

    const recordTaskDone = (taskId, files = [], extraMinutes = 0, payloadData = null) => {
      const k = `${currentStudentId.value}_2026-09-04`;
      let current = checkins.value[k];
      if (!current || Array.isArray(current)) {
        current = { doneTaskIds: Array.isArray(current) ? [...current] : [], attachments: {}, payloads: {} };
      }
      if (!current.doneTaskIds.includes(taskId)) {
        current.doneTaskIds.push(taskId);
      }
      if (files && files.length > 0) {
        if (!current.attachments) current.attachments = {};
        const existing = current.attachments[taskId] || [];
        current.attachments[taskId] = [...existing, ...files];
      }
      if (payloadData) {
        if (!current.payloads) current.payloads = {};
        current.payloads[taskId] = payloadData;
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
      persistAll();
    };

    const getStudentMandatoryTaskIds = (sId) => {
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
      const unfinishedMandatory = mandatoryIds.filter(id => !doneIds.includes(id));

      let targetId = null;
      if (unfinishedMandatory.length > 0) {
        targetId = unfinishedMandatory[Math.floor(Math.random() * unfinishedMandatory.length)];
      } else {
        const unfinishedAll = allTodayTasks.value.filter(t => !doneIds.includes(t.id) && t.id !== 1);
        if (unfinishedAll.length > 0) {
          targetId = unfinishedAll[Math.floor(Math.random() * unfinishedAll.length)].id;
        } else {
          targetId = allTodayTasks.value[1].id;
        }
      }

      const targetObj = allTodayTasks.value.find(t => t.id === targetId) || allTodayTasks.value[1];
      const extraLaps = 5 * 360;
      const finalDeg = extraLaps + Math.floor(Math.random() * 360);
      wheelRotationDeg.value = finalDeg;

      let tickTimer = setInterval(() => { playWheelTick(); }, 120);

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

    const openTaskInteractive = (task) => {
      startTaskTimer(task.id);
      const k = `${currentStudentId.value}_2026-09-04`;
      const savedRecord = checkins.value[k] || {};
      const savedPayloads = savedRecord.payloads || {};
      const savedAttachments = savedRecord.attachments || {};

      if (task.id === 1) {
        hwPhotos.value = savedAttachments[1] || [];
        if (savedPayloads[1]) hwForm.value = { ...savedPayloads[1] };
        showHomeworkModal.value = true;
      } else if (task.id === 2) {
        readingUserChoices.value = savedPayloads[2] || {};
        readingSubmitted.value = !!savedPayloads[2];
        if (readingSubmitted.value) {
          let r = 0;
          currentReadingArticle.value.questions.forEach(q => {
            if (readingUserChoices.value[q.id] === q.ans) r++;
          });
          readingScore.value = r;
        }
        showReadingModal.value = true;
      } else if (task.id === 3) {
        calligraphyPhotos.value = savedAttachments[3] || [];
        showCalligraphyModal.value = true;
      } else if (task.id === 4) {
        mathProblems.value = savedPayloads[4] || window.StudyMath.generateDrill(currentStudent.value.grade);
        mathSubmitted.value = !!savedPayloads[4];
        if (mathSubmitted.value) {
          let r = 0;
          mathProblems.value.forEach(p => { if (parseFloat(p.userAns) === p.ans) r++; });
          mathPassed.value = r >= 7;
          mathScoreSummary.value = mathPassed.value ? `🎉 上次做对 ${r}/10 题，已达标通过！` : `上次做对 ${r}/10 题，未达标，请重测！`;
        }
        showMathModal.value = true;
      } else if (task.id === 5) {
        olympiadStage.value = 'problem';
        olympiadPhotos.value = savedAttachments[5] || [];
        showOlympiadModal.value = true;
      } else if (task.id === 6) {
        dictationPhotos.value = savedAttachments[6] || [];
        showWordModal.value = true;
      } else if (task.id === 7) {
        showSentenceSpeakModal.value = true;
      } else if (task.id === 8) {
        structureUserInput.value = savedPayloads[8] || '';
        showSentenceStructureModal.value = true;
      } else if (task.id === 9) {
        userTranslationInput.value = savedPayloads[9] || '';
        translationSubmitted.value = !!savedPayloads[9];
        showTranslationModal.value = true;
      } else if (task.id === 10) {
        engReadingChoices.value = savedPayloads[10] || {};
        showEnglishReadingModal.value = true;
      } else if (task.id === 11) {
        clozeChoices.value = savedPayloads[11] || {};
        showClozeModal.value = true;
      } else if (task.id === 12) {
        showSchoolErrorModal.value = true;
      } else if (task.id === 13) {
        if (savedPayloads[13]) bookForm.value = { ...savedPayloads[13] };
        showBookReadingModal.value = true;
      }
    };

    const handleMultiFiles = (e, targetRef) => {
      const files = Array.from(e.target.files);
      files.forEach(f => {
        const r = new FileReader();
        r.onload = ev => targetRef.value.push({ name: f.name, dataUrl: ev.target.result, size: f.size, type: f.type });
        r.readAsDataURL(f);
      });
      e.target.value = '';
    };

    const removeAttachment = (targetRef, index) => {
      targetRef.value.splice(index, 1);
    };

    const submitSchoolHomework = () => {
      recordTaskDone(1, hwPhotos.value, hwForm.value.durationMinutes, hwForm.value);
      showHomeworkModal.value = false;
      triggerLuckyWheel();
    };

    const submitReadingQuiz = () => {
      if (Object.keys(readingUserChoices.value).length < 3) {
        return alert('请先答完所有 3 道真题！');
      }
      readingSubmitted.value = true;
      let right = 0;
      currentReadingArticle.value.questions.forEach(q => {
        if (readingUserChoices.value[q.id] === q.ans) {
          right++;
        } else {
          errors.value.unshift({
            id: Date.now() + Math.random(),
            studentId: currentStudentId.value,
            question: `阅读理解错题：${q.q}`,
            studentAnswer: `选了 ${readingUserChoices.value[q.id]}`,
            correctAnswer: `正确答案 ${q.ans}`,
            errorType: '阅读理解失分',
            analysis: q.analysis,
            date: '2026-09-04',
            resolved: false
          });
        }
      });
      readingScore.value = right;
      recordTaskDone(2, [], 20, readingUserChoices.value);

      if (right === 3) {
        alert('🎉 太棒了！3道阅读真题全部答对，成功通关打卡 (+3分)！');
      } else {
        alert(`做对 ${right} / 3 题。有错题已自动收录至【错题复仇本】！`);
      }
    };

    const submitCalligraphy = () => {
      recordTaskDone(3, calligraphyPhotos.value, 10);
      showCalligraphyModal.value = false;
      alert('🎉 生字临摹打卡成功 (+2分)！');
    };

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
        recordTaskDone(4, [], 8, mathProblems.value);
      } else {
        mathPassed.value = false;
        mathScoreSummary.value = `做对 ${r} / 10 题，未达到 7 题达标线！错题已沉淀入复仇本，请重测。`;
      }
    };

    const completeOlympiad = () => {
      recordTaskDone(5, olympiadPhotos.value, 15);
      showOlympiadModal.value = false;
      alert('🎉 奥数思维挑战打卡成功 (+3分)！');
    };

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
            alert('5个单词朗读完毕！上传默写照片即可完成。');
          }
        }
      }, 1000);
    };

    const submitDictation = () => {
      if (dictationTimer.value) clearInterval(dictationTimer.value);
      recordTaskDone(6, dictationPhotos.value, 15);
      showDictationModal.value = false;
      alert('🎉 记单词与听写默写打卡成功！');
    };

    const submitTranslation = () => {
      if (!userTranslationInput.value.trim()) return alert('请先输入你的中文翻译！');
      translationSubmitted.value = true;
      recordTaskDone(9, [], 5, userTranslationInput.value);
    };

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
      alert('🎉 错题已成功沉淀入复仇错题本！');
    };

    const submitBookReading = () => {
      if (!bookForm.value.bookName.trim()) return alert('请输入阅读书名！');
      recordTaskDone(13, [], bookForm.value.duration || 20, bookForm.value);
      showBookReadingModal.value = false;
      alert('🎉 今日伴读计划已记录成功！');
    };

    const resolveError = (errId) => {
      const e = errors.value.find(x => x.id === errId);
      if (e) {
        e.resolved = true;
        currentStudent.value.points += 4;
        alert('🎉 成功复仇错题，奖励双倍积分 (+4分)！');
        persistAll();
      }
    };

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

    const openParentResetPin = (st) => { parentTargetStudent.value = st; parentNewPinInput.value = ''; showParentResetPinModal.value = true; };
    const confirmParentResetPin = () => {
      if (!parentNewPinInput.value || parentNewPinInput.value.length !== 4) return alert('请输入 4 位密码！');
      if (parentTargetStudent.value) parentTargetStudent.value.pin = parentNewPinInput.value;
      showParentResetPinModal.value = false;
      persistAll();
      alert('🎉 密码重置成功！');
    };

    const openPointAdjustModal = (st) => { targetPointStudent.value = st; showPointModal.value = true; };
    const confirmCustomPointAdjust = () => {
      if (targetPointStudent.value) {
        targetPointStudent.value.points += customPointAmount.value;
        showPointModal.value = false;
        persistAll();
        alert('🎉 积分调整成功，已实时保存！');
      }
    };

    const openAssignModal = () => { newTask.value.title = ''; showAssignModal.value = true; };
    const confirmAssignTask = () => {
      if (!newTask.value.title.trim()) return alert('请输入任务名称！');
      customTasks.value.unshift({ id: 'ct_' + Date.now(), title: newTask.value.title, points: 3, isCustom: true, code: '特派', category: '加练', icon: '📌', duration: '15分钟', criteria: '按要求完成', minGrade: 1 });
      showAssignModal.value = false;
      persistAll();
      alert('🎉 临时任务已下发！');
    };

    const handleAvatarChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const r = new FileReader();
      r.onload = ev => {
        currentStudent.value.avatarImg = ev.target.result;
        persistAll();
        alert('🎉 头像修改成功！');
      };
      r.readAsDataURL(file);
    };

    const confirmAddShopItem = () => {
      if (!newShopItem.value.name.trim()) return alert('请输入商品名称！');
      shopItems.value.unshift({ id: 'item_' + Date.now(), ...newShopItem.value });
      showAddShopItemModal.value = false;
      persistAll();
    };
    const deleteShopItem = (item) => {
      if (confirm(`确定下架【${item.name}】吗？`)) {
        shopItems.value = shopItems.value.filter(i => i.id !== item.id);
        persistAll();
      }
    };
    const redeemShopItem = (item) => {
      if (currentStudent.value.points >= item.cost) {
        currentStudent.value.points -= item.cost;
        alert(`🎉 成功兑换【${item.name}】！`);
        persistAll();
      } else {
        alert('积分不足，继续努力！');
      }
    };

    const getStudentDoneCount = (sId) => (checkins.value[`${sId}_2026-09-04`]?.doneTaskIds || []).length;
    const getDayDoneCount = (day) => (day === 4 ? todayDoneCount.value : Math.min(allTodayTasks.value.length, day * 2 + 3));
    const openDayDetailModal = (y, m, d) => {
      selectedDetailDateStr.value = `${y}年${m}月${d}日`;
      currentDayDetailDoneCount.value = getDayDoneCount(d);
      showDayDetailModal.value = true;
    };

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

    const saveConfig = () => {
      localStorage.setItem('cfg_silicon', config.value.siliconKey);
      localStorage.setItem('cfg_upstash_url', config.value.upstashUrl);
      localStorage.setItem('cfg_upstash_token', config.value.upstashToken);
      showSettings.value = false;
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
      showHomeworkModal, hwForm, hwPhotos, handleMultiFiles, removeAttachment, submitSchoolHomework,
      showReadingModal, currentReadingArticle, readingUserChoices, readingSubmitted, readingScore, submitReadingQuiz,
      showCalligraphyModal, calligraphyPack, calligraphyPhotos, submitCalligraphy,
      showMathModal, mathProblems, mathSubmitted, mathPassed, mathScoreSummary, submitMathDrill,
      showOlympiadModal, currentOlympiadData, olympiadStage, olympiadPhotos, nextOlympiadStage, completeOlympiad,
      showWordModal, showDictationModal, todayWordPack, dictationStep, dictationCountdown, startDictationMode, dictationPhotos, submitDictation, speakText,
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
      showSettings, config, saveConfig, persistAll, handleAvatarChange
    };
  }
}).mount('#app');
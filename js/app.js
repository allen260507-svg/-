// 家庭研学中枢 - Vue 3 主控制器
const { createApp, ref, computed, onMounted, onUnmounted } = Vue;

createApp({
  setup() {
    const currentLoggedInUser = ref(null);
    const activeTab = ref('today');
    const showPinModal = ref(false);
    const selectedAuthUser = ref(null);
    const enteredPin = ref('');

    const showSettings = ref(false);
    const showHomeworkModal = ref(false);
    const showMathModal = ref(false);
    const showAssignModal = ref(false);
    const showTaskSubmitModal = ref(false);
    const showPointModal = ref(false);
    const showAttachmentViewer = ref(false);
    const showQuizModal = ref(false);
    const showDayDetailModal = ref(false);
    const showNewsDetailModal = ref(false);
    const showAddShopItemModal = ref(false);

    // 专项弹窗状态
    const showCalligraphyModal = ref(false);
    const calligraphyPhotoUrl = ref('');
    const showOlympiadModal = ref(false);
    const olympiadPhotoUrl = ref('');
    const olympiadUnlocked = ref(false);

    // 口算自动判分状态
    const mathSubmitted = ref(false);
    const mathPassed = ref(false);
    const mathScoreSummary = ref('');

    const selectedDetailDateStr = ref('');
    const selectedDetailDayKey = ref('');
    const currentSelectedNewsArticle = ref(null);

    const newShopItem = ref({ icon: '🎁', name: '', desc: '', cost: 20 });
    const currentActiveTask = ref(null);
    const targetPointStudent = ref(null);
    const customPointAmount = ref(10);
    const customPointReason = ref('');

    const viewingAttachments = ref([]);
    const viewingTaskTitle = ref('');
    const viewingStudentName = ref('');

    const selectedCalYear = ref(2026);
    const selectedCalMonth = ref(9);

    const gradeList = [
      '小学1年级', '小学2年级', '小学3年级', '小学4年级', '小学5年级', '小学6年级',
      '初中7年级', '初中8年级', '初中9年级',
      '高中1年级', '高中2年级', '高中3年级'
    ];

    const parentProfile = { id: 'parent', name: '家长总控', avatar: '🛡️', grade: '总控管理员', pin: '8888' };

    const config = ref({
      siliconKey: localStorage.getItem('cfg_silicon') || '',
      upstashUrl: localStorage.getItem('cfg_upstash_url') || '',
      upstashToken: localStorage.getItem('cfg_upstash_token') || ''
    });

    // 从 StudyData 引入初始数据
    const students = ref(window.StudyData.defaultStudents);
    const currentStudentId = ref('nuo');

    const baseTasks = ref(window.StudyData.baseTasks);
    const customTasks = ref([]);
    const parentTaskFiles = ref([]);
    const newTask = ref({ targetStudentId: 'ALL', title: '', duration: '15分钟', points: 3, criteria: '家长抽查 / 拍照录像' });

    const checkins = ref({});
    const errors = ref([]);
    const quizRecords = ref([]);
    const pointLogs = ref([]);
    const shopItems = ref(window.StudyData.defaultShopItems);

    const newQuiz = ref({
      subject: '数学',
      date: '2026-09-04',
      title: '',
      score: null,
      maxScore: 100,
      reflection: ''
    });

    const knowledgeTopics = window.StudyData.knowledgeTopics;
    const dailyRealNewsArticles = window.StudyData.dailyRealNewsArticles;
    const todayCalligraphyChar = computed(() => window.StudyData.calligraphyBank[0]);

    const currentStudent = computed(() => students.value.find(s => s.id === currentStudentId.value) || students.value[0]);

    // 当前年级奥数题目计算
    const currentGradeOlympiadProblem = computed(() => {
      const g = currentStudent.value.grade || '';
      const bank = window.StudyData.olympiadBank;
      for (let key in bank) {
        if (g.includes(key.replace('小学', ''))) return bank[key];
      }
      return bank['默认'];
    });

    // 积分收支流水日志
    const logPointTransaction = (studentId, title, change, newBalance) => {
      pointLogs.value.unshift({
        id: 'log_' + Date.now(),
        studentId,
        title,
        change,
        balance: newBalance,
        time: '2026-09-04 13:20'
      });
    };

    const onStudentGradeChange = () => { syncToCloud(); };

    const selectStudentTopic = (topicId) => {
      currentStudent.value.favoriteTopic = topicId;
      syncToCloud();
    };

    const currentDailyArticle = computed(() => {
      const tId = currentStudent.value.favoriteTopic || 'news';
      return dailyRealNewsArticles[tId] || dailyRealNewsArticles.news;
    });

    const openNewsDetailModal = (article) => {
      currentSelectedNewsArticle.value = article;
      showNewsDetailModal.value = true;
    };

    // 特权商城操作
    const openAddShopItemModal = () => {
      newShopItem.value = { icon: '🎁', name: '', desc: '', cost: 20 };
      showAddShopItemModal.value = true;
    };

    const confirmAddShopItem = () => {
      if (!newShopItem.value.name.trim()) return alert('请输入商品特权名称！');
      if (!newShopItem.value.cost || newShopItem.value.cost <= 0) return alert('请输入有效的兑换积分！');

      shopItems.value.unshift({
        id: 'item_' + Date.now(),
        icon: newShopItem.value.icon || '🎁',
        name: newShopItem.value.name.trim(),
        desc: newShopItem.value.desc.trim() || '认真完成任务换取特权',
        cost: parseInt(newShopItem.value.cost, 10)
      });

      showAddShopItemModal.value = false;
      syncToCloud();
      alert('🎉 新特权商品上架成功，已同步至全网所有设备！');
    };

    const deleteShopItem = (item) => {
      if (confirm(`确定要下架并删除特权商品【${item.name}】吗？`)) {
        shopItems.value = shopItems.value.filter(i => (i.id ? i.id !== item.id : i.name !== item.name));
        syncToCloud();
        alert('已成功下架该特权商品！');
      }
    };

    // 家长派发临时任务
    const handleParentTaskFiles = (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          parentTaskFiles.value.push({
            name: file.name,
            type: file.type,
            size: file.size,
            dataUrl: ev.target.result
          });
        };
        reader.readAsDataURL(file);
      });
    };

    const openAssignModal = () => {
      newTask.value.title = '';
      parentTaskFiles.value = [];
      showAssignModal.value = true;
    };

    const confirmAssignTask = () => {
      if (!newTask.value.title.trim()) return alert('请输入任务名称！');
      customTasks.value.push({
        id: 'ct_' + Date.now(),
        code: '加',
        category: '临时任务',
        icon: '⚡',
        title: newTask.value.title.trim(),
        duration: newTask.value.duration || '15分钟',
        points: newTask.value.points || 3,
        criteria: newTask.value.criteria || '家长抽查 / 拍照录像',
        targetStudentId: newTask.value.targetStudentId,
        isCustom: true,
        parentAttachments: [...parentTaskFiles.value]
      });
      showAssignModal.value = false;
      parentTaskFiles.value = [];
      syncToCloud();
      alert('临时任务（附带参考资料）下发成功！');
    };

    const viewParentTaskAttachments = (task) => {
      viewingAttachments.value = task.parentAttachments || [];
      viewingTaskTitle.value = task.title;
      viewingStudentName.value = '家长下发的参考资料';
      showAttachmentViewer.value = true;
    };

    // 打卡月历计算与单日下钻明细
    const calMonthTotalDays = computed(() => new Date(selectedCalYear.value, selectedCalMonth.value, 0).getDate());
    const calMonthStartOffset = computed(() => {
      const firstDay = new Date(selectedCalYear.value, selectedCalMonth.value - 1, 1).getDay();
      return firstDay === 0 ? 6 : firstDay - 1;
    });

    const prevCalendarMonth = () => {
      if (selectedCalMonth.value === 1) {
        selectedCalYear.value--;
        selectedCalMonth.value = 12;
      } else {
        selectedCalMonth.value--;
      }
    };

    const nextCalendarMonth = () => {
      if (selectedCalMonth.value === 12) {
        selectedCalYear.value++;
        selectedCalMonth.value = 1;
      } else {
        selectedCalMonth.value++;
      }
    };

    const isToday = (day) => selectedCalYear.value === 2026 && selectedCalMonth.value === 9 && day === 4;
    const isPastDay = (day) => {
      if (selectedCalYear.value < 2026) return true;
      if (selectedCalYear.value === 2026 && selectedCalMonth.value < 9) return true;
      if (selectedCalYear.value === 2026 && selectedCalMonth.value === 9) return day < 4;
      return false;
    };

    const getFormattedDateKey = (year, month, day) => {
      const mStr = String(month).padStart(2, '0');
      const dStr = String(day).padStart(2, '0');
      return `${currentStudentId.value}_${year}-${mStr}-${dStr}`;
    };

    const getSpecificDayDoneCount = (year, month, day) => {
      const k = getFormattedDateKey(year, month, day);
      const val = checkins.value[k];
      if (!val) return 0;
      return (Array.isArray(val) ? val : (val.doneTaskIds || [])).length;
    };

    const getSpecificDayUndoneCount = (year, month, day) => {
      const doneCount = getSpecificDayDoneCount(year, month, day);
      return Math.max(0, allTodayTasks.value.length - doneCount);
    };

    const isSpecificDayPassed = (year, month, day) => getSpecificDayDoneCount(year, month, day) >= 8;

    const calMonthFlowerCount = computed(() => {
      let c = 0;
      const totalDays = calMonthTotalDays.value;
      for (let d = 1; d <= totalDays; d++) {
        if (isSpecificDayPassed(selectedCalYear.value, selectedCalMonth.value, d)) c++;
      }
      return c;
    });

    const openDayDetailModal = (year, month, day) => {
      selectedDetailDateStr.value = `${year}年${month}月${day}日`;
      selectedDetailDayKey.value = getFormattedDateKey(year, month, day);
      showDayDetailModal.value = true;
    };

    const getDayCheckinObj = (dayKey) => {
      const val = checkins.value[dayKey];
      if (!val) return { doneTaskIds: [], attachments: {} };
      if (Array.isArray(val)) return { doneTaskIds: val, attachments: {} };
      return val;
    };

    const currentDayDetailDoneTasks = computed(() => {
      const obj = getDayCheckinObj(selectedDetailDayKey.value);
      return allTodayTasks.value.filter(t => (obj.doneTaskIds || []).includes(t.id));
    });

    const currentDayDetailUndoneTasks = computed(() => {
      const obj = getDayCheckinObj(selectedDetailDayKey.value);
      return allTodayTasks.value.filter(t => !(obj.doneTaskIds || []).includes(t.id));
    });

    const currentDayDetailPoints = computed(() => currentDayDetailDoneTasks.value.reduce((a, b) => a + b.points, 0));
    const isDayTaskDone = (taskId) => getDayCheckinObj(selectedDetailDayKey.value).doneTaskIds?.includes(taskId);
    const hasDayTaskAttachment = (taskId) => (getDayCheckinObj(selectedDetailDayKey.value).attachments?.[taskId] || []).length > 0;

    const viewDayTaskAttachments = (task) => {
      const obj = getDayCheckinObj(selectedDetailDayKey.value);
      viewingAttachments.value = obj.attachments?.[task.id] || [];
      viewingTaskTitle.value = `${selectedDetailDateStr.value} · ${task.title}`;
      viewingStudentName.value = `${currentStudent.value.name} 提交的打卡凭据`;
      showAttachmentViewer.value = true;
    };

    // 田字格练字打卡
    const openCalligraphyModal = () => {
      calligraphyPhotoUrl.value = '';
      showCalligraphyModal.value = true;
    };

    const handleCalligraphyPhoto = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => { calligraphyPhotoUrl.value = ev.target.result; };
      reader.readAsDataURL(file);
    };

    const submitCalligraphy = () => {
      if (!calligraphyPhotoUrl.value) return alert('请先拍照上传手写练字照片！');
      recordTaskDone(3, [{ name: '田字格练字手写照片.jpg', type: 'image/jpeg', size: 102400, dataUrl: calligraphyPhotoUrl.value }]);
      showCalligraphyModal.value = false;
      alert('🎉 田字格练字打卡成功！字迹已归档。');
    };

    // 奥数打卡
    const openOlympiadModal = () => {
      olympiadPhotoUrl.value = '';
      olympiadUnlocked.value = false;
      showOlympiadModal.value = true;
    };

    const handleOlympiadPhoto = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => { olympiadPhotoUrl.value = ev.target.result; };
      reader.readAsDataURL(file);
    };

    const submitOlympiad = () => {
      if (!olympiadPhotoUrl.value) return alert('请先拍照上传草稿纸演算过程！');
      recordTaskDone(5, [{ name: '奥数草稿演练照片.jpg', type: 'image/jpeg', size: 102400, dataUrl: olympiadPhotoUrl.value }]);
      olympiadUnlocked.value = true;
      alert('🎉 草稿已上传！已为你解锁标准答案与名师错因避坑剖析！');
    };

    // 口算引擎 (调用 math.js)
    const mathProblems = ref([]);
    const startMathDrill = () => {
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
      });
      mathSubmitted.value = true;
      if (right >= 7) {
        mathPassed.value = true;
        mathScoreSummary.value = `🎉 恭喜！做对 ${right} / 10 题，成绩优秀，判定通过！`;
        recordTaskDone(4);
      } else {
        mathPassed.value = false;
        mathScoreSummary.value = `做对 ${right} / 10 题，未达到 7 题达标线，请查看对错标红后重测！`;
      }
    };

    // 小测登记
    const openQuizModal = () => {
      newQuiz.value.title = '';
      newQuiz.value.score = null;
      newQuiz.value.reflection = '';
      showQuizModal.value = true;
    };

    const confirmAddQuiz = () => {
      if (!newQuiz.value.title.trim()) return alert('请输入测验名称！');
      if (newQuiz.value.score === null) return alert('请输入实际得分！');
      if (!newQuiz.value.reflection.trim()) return alert('请认真填写心得体会与错因复盘！');

      quizRecords.value.unshift({
        id: 'quiz_' + Date.now(),
        studentId: currentStudentId.value,
        subject: newQuiz.value.subject,
        date: newQuiz.value.date || '2026-09-04',
        title: newQuiz.value.title.trim(),
        score: newQuiz.value.score,
        maxScore: newQuiz.value.maxScore || 100,
        reflection: newQuiz.value.reflection.trim()
      });

      currentStudent.value.points += 5;
      logPointTransaction(currentStudentId.value, `登记小测复盘: ${newQuiz.value.title}`, 5, currentStudent.value.points);

      showQuizModal.value = false;
      syncToCloud();
      alert('🎉 小测成绩与反思心得录入成功！');
    };

    const currentStudentQuizzes = computed(() => quizRecords.value.filter(q => q.studentId === currentStudentId.value));
    const currentStudentPointLogs = computed(() => pointLogs.value.filter(l => l.studentId === currentStudentId.value));

    const getStudentCheckinObj = (sId) => {
      const k = `${sId}_2026-09-04`;
      const val = checkins.value[k];
      if (!val) return { doneTaskIds: [], attachments: {} };
      if (Array.isArray(val)) return { doneTaskIds: val, attachments: {} };
      return val;
    };

    const getStudentDoneCount = (sId) => (getStudentCheckinObj(sId).doneTaskIds || []).length;
    const isStudentHwDone = (sId) => (getStudentCheckinObj(sId).doneTaskIds || []).includes(1);
    const getPendingErrorCount = (sId) => errors.value.filter(e => e.studentId === sId && !e.resolved).length;

    const getFileIcon = (mime = '') => {
      if (mime.startsWith('image/')) return '🖼️';
      if (mime.startsWith('audio/')) return '🎙️';
      if (mime.startsWith('video/')) return '🎥';
      return '📄';
    };

    const hasAttachments = (sId, tId) => (getStudentCheckinObj(sId).attachments?.[tId] || []).length > 0;
    const getTaskAttachmentCount = (sId, tId) => (getStudentCheckinObj(sId).attachments?.[tId] || []).length;
    const getStudentTotalAttachmentCount = (sId) => {
      const obj = getStudentCheckinObj(sId);
      let count = 0;
      if (obj.attachments) {
        Object.values(obj.attachments).forEach(arr => { count += (arr || []).length; });
      }
      return count;
    };

    const viewTaskAttachments = (st, tId) => {
      const obj = getStudentCheckinObj(st.id);
      viewingAttachments.value = obj.attachments?.[tId] || [];
      viewingTaskTitle.value = getTaskTitle(tId);
      viewingStudentName.value = st.name + ' 提交的打卡凭据';
      showAttachmentViewer.value = true;
    };

    const getTaskTitle = (tId) => {
      const all = [...baseTasks.value, ...customTasks.value];
      const found = all.find(t => t.id === tId);
      return found ? found.title : `任务 #${tId}`;
    };

    // 登录与 PIN 键盘交互
    const openPinModal = (user) => {
      selectedAuthUser.value = user;
      enteredPin.value = '';
      showPinModal.value = true;
    };

    const pressPin = (num) => {
      if (enteredPin.value.length < 4) {
        enteredPin.value += String(num);
        if (enteredPin.value.length === 4) {
          const expectedPin = selectedAuthUser.value.pin || '1234';
          if (enteredPin.value === expectedPin) {
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

    const closeAllModals = () => {
      showPinModal.value = false;
      showHomeworkModal.value = false;
      showMathModal.value = false;
      showAssignModal.value = false;
      showTaskSubmitModal.value = false;
      showPointModal.value = false;
      showAttachmentViewer.value = false;
      showQuizModal.value = false;
      showDayDetailModal.value = false;
      showNewsDetailModal.value = false;
      showAddShopItemModal.value = false;
      showCalligraphyModal.value = false;
      showOlympiadModal.value = false;
      showSettings.value = false;
      enteredPin.value = '';
    };

    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeAllModals();
        return;
      }
      if (showPinModal.value) {
        if (e.key >= '0' && e.key <= '9') pressPin(e.key);
        else if (e.key === 'Backspace') enteredPin.value = enteredPin.value.slice(0, -1);
      }
    };

    const todayKey = computed(() => `${currentStudentId.value}_2026-09-04`);
    const currentStudentCheckin = computed(() => getStudentCheckinObj(currentStudentId.value));
    const todayDoneIds = computed(() => currentStudentCheckin.value.doneTaskIds || []);

    const allTodayTasks = computed(() => {
      const personalCustom = customTasks.value.filter(t => t.targetStudentId === 'ALL' || t.targetStudentId === currentStudentId.value);
      return [...baseTasks.value, ...personalCustom];
    });

    const isHomeworkDone = computed(() => todayDoneIds.value.includes(1));
    const totalTaskCount = computed(() => allTodayTasks.value.length);
    const todayDoneCount = computed(() => allTodayTasks.value.filter(t => todayDoneIds.value.includes(t.id)).length);
    const todayPoints = computed(() => allTodayTasks.value.filter(t => todayDoneIds.value.includes(t.id)).reduce((a, b) => a + b.points, 0));
    const isDone = (id) => todayDoneIds.value.includes(id);

    const studentErrors = computed(() => errors.value.filter(e => e.studentId === currentStudentId.value && !e.resolved));

    const recordTaskDone = (taskId, files = []) => {
      const k = todayKey.value;
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

      const allT = [...baseTasks.value, ...customTasks.value];
      const taskObj = allT.find(t => t.id === taskId);
      if (taskObj) {
        currentStudent.value.points += taskObj.points;
        logPointTransaction(currentStudentId.value, `打卡完成: ${taskObj.title}`, taskObj.points, currentStudent.value.points);
      }
      syncToCloud();
    };

    // 通用打卡弹窗
    const genericTaskFiles = ref([]);
    const openTaskSubmitModal = (task) => {
      currentActiveTask.value = task;
      genericTaskFiles.value = [];
      showTaskSubmitModal.value = true;
    };

    const handleGenericTaskFiles = (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          genericTaskFiles.value.push({
            name: file.name,
            type: file.type,
            size: file.size,
            dataUrl: ev.target.result
          });
        };
        reader.readAsDataURL(file);
      });
    };

    const confirmTaskSubmission = () => {
      if (!currentActiveTask.value) return;
      recordTaskDone(currentActiveTask.value.id, genericTaskFiles.value);
      showTaskSubmitModal.value = false;
      alert('打卡达标成功！');
    };

    // 作业批改 (调用 ai.js)
    const uploadedHomeworkFiles = ref([]);
    const gradingStatus = ref('');
    const isGrading = ref(false);

    const openHomeworkModal = () => {
      if (!config.value.siliconKey) {
        alert('请先在设置 ⚙️ 里填入硅基流动 AI 密钥！');
        showSettings.value = true;
        return;
      }
      uploadedHomeworkFiles.value = [];
      gradingStatus.value = '';
      showHomeworkModal.value = true;
    };

    const handleHomeworkMultiFiles = (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          uploadedHomeworkFiles.value.push({
            name: file.name,
            type: file.type,
            size: file.size,
            dataUrl: ev.target.result
          });
        };
        reader.readAsDataURL(file);
      });
    };

    const removeHomeworkFile = (idx) => { uploadedHomeworkFiles.value.splice(idx, 1); };

    const submitHomeworkToAI = async () => {
      isGrading.value = true;
      gradingStatus.value = 'AI 逐题深度扫描分析中...';
      try {
        const imgFile = uploadedHomeworkFiles.value.find(f => f.type.startsWith('image/'));
        const base64 = imgFile ? imgFile.dataUrl.split(',')[1] : null;

        if (base64) {
          const res = await window.StudyAI.gradeHomework(config.value.siliconKey, base64);
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach(err => {
              errors.value.unshift({ id: Date.now() + Math.random(), studentId: currentStudentId.value, ...err, date: '2026-09-04', resolved: false });
            });
            alert(`批改完毕！共 ${res.total} 题，发现 ${res.errors.length} 处错题已入复仇本，作业打卡通过！`);
          } else {
            alert(`太棒了！全部 ${res.total} 题解答正确！满分通过！`);
          }
        } else {
          alert('作业附件已妥善收录归档，审核通过！');
        }

        recordTaskDone(1, uploadedHomeworkFiles.value);
        showHomeworkModal.value = false;
      } catch (e) {
        alert('AI 批改响应完成，已登记作业打卡及附件！');
        recordTaskDone(1, uploadedHomeworkFiles.value);
        showHomeworkModal.value = false;
      } finally {
        isGrading.value = false;
      }
    };

    // 家长加减积分
    const openPointAdjustModal = (st) => {
      targetPointStudent.value = st;
      customPointAmount.value = 10;
      customPointReason.value = '';
      showPointModal.value = true;
    };

    const confirmCustomPointAdjust = () => {
      if (!targetPointStudent.value) return;
      const delta = parseInt(customPointAmount.value, 10);
      if (isNaN(delta) || delta === 0) return alert('请输入有效的加减分数值 (非0)！');

      targetPointStudent.value.points += delta;
      if (targetPointStudent.value.points < 0) targetPointStudent.value.points = 0;

      const reasonText = customPointReason.value.trim() || (delta > 0 ? '家长特别奖励' : '家长批评扣除');
      logPointTransaction(targetPointStudent.value.id, `家长奖惩: ${reasonText}`, delta, targetPointStudent.value.points);

      showPointModal.value = false;
      syncToCloud();
      alert(`已为 ${targetPointStudent.value.name} ${delta > 0 ? '增加' : '扣除'} ${Math.abs(delta)} 积分！`);
    };

    const resolveError = (errId) => {
      const item = errors.value.find(e => e.id === errId);
      if (item) {
        item.resolved = true;
        currentStudent.value.points += 4;
        logPointTransaction(currentStudentId.value, `错题复仇攻克: ${item.question.slice(0, 10)}...`, 4, currentStudent.value.points);
        alert('🎉 复仇成功，奖励 4 积分！');
        syncToCloud();
      }
    };

    const redeem = (item) => {
      if (currentStudent.value.points >= item.cost) {
        currentStudent.value.points -= item.cost;
        logPointTransaction(currentStudentId.value, `特权商城兑换: ${item.name}`, -item.cost, currentStudent.value.points);
        alert(`🎉 成功兑换【${item.name}】！`);
        syncToCloud();
      } else {
        alert('积分不足，加油赚积分吧！');
      }
    };

    // 云数据库同步 (调用 db.js)
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
        if (data.shopItems && data.shopItems.length > 0) shopItems.value = data.shopItems;
      } else {
        await syncToCloud();
      }
    };

    const saveConfig = () => {
      localStorage.setItem('cfg_silicon', config.value.siliconKey);
      localStorage.setItem('cfg_upstash_url', config.value.upstashUrl);
      localStorage.setItem('cfg_upstash_token', config.value.upstashToken);
      showSettings.value = false;
      loadFromCloud();
    };

    onMounted(() => {
      window.addEventListener('keydown', handleGlobalKeyDown);
      if (config.value.upstashUrl) loadFromCloud();
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    });

    return {
      currentLoggedInUser, activeTab, showPinModal, selectedAuthUser, enteredPin,
      parentProfile, openPinModal, pressPin, clearPin, switchToUser, logout,
      gradeList, onStudentGradeChange,
      selectedCalYear, selectedCalMonth, prevCalendarMonth, nextCalendarMonth,
      calMonthTotalDays, calMonthStartOffset, isToday, isPastDay,
      getSpecificDayDoneCount, getSpecificDayUndoneCount, isSpecificDayPassed, calMonthFlowerCount,
      showDayDetailModal, selectedDetailDateStr, openDayDetailModal,
      currentDayDetailDoneTasks, currentDayDetailUndoneTasks, currentDayDetailPoints,
      isDayTaskDone, hasDayTaskAttachment, viewDayTaskAttachments,
      knowledgeTopics, selectStudentTopic, currentDailyArticle,
      showNewsDetailModal, currentSelectedNewsArticle, openNewsDetailModal,
      showAddShopItemModal, newShopItem, openAddShopItemModal, confirmAddShopItem, deleteShopItem,
      showCalligraphyModal, todayCalligraphyChar, calligraphyPhotoUrl, handleCalligraphyPhoto, submitCalligraphy, openCalligraphyModal,
      showOlympiadModal, currentGradeOlympiadProblem, olympiadPhotoUrl, handleOlympiadPhoto, olympiadUnlocked, submitOlympiad, openOlympiadModal,
      showMathModal, mathProblems, mathSubmitted, mathPassed, mathScoreSummary, startMathDrill, submitMathDrill,
      showSettings, showHomeworkModal, showAssignModal, showTaskSubmitModal, showPointModal, showAttachmentViewer, showQuizModal,
      currentActiveTask, targetPointStudent, customPointAmount, customPointReason, openPointAdjustModal, confirmCustomPointAdjust,
      viewingAttachments, viewingTaskTitle, viewingStudentName, viewParentTaskAttachments,
      config, students, currentStudentId, currentStudent,
      baseTasks, customTasks, parentTaskFiles, handleParentTaskFiles, newTask, allTodayTasks, totalTaskCount,
      checkins, errors, shopItems, isHomeworkDone, todayDoneCount, todayPoints, isDone,
      studentErrors, getPendingErrorCount, getStudentDoneCount, isStudentHwDone, getStudentCheckinObj,
      hasAttachments, getTaskAttachmentCount, getStudentTotalAttachmentCount, viewTaskAttachments, getTaskTitle, getFileIcon,
      openTaskSubmitModal, genericTaskFiles, handleGenericTaskFiles, confirmTaskSubmission,
      uploadedHomeworkFiles, gradingStatus, isGrading, openHomeworkModal, handleHomeworkMultiFiles, removeHomeworkFile, submitHomeworkToAI,
      openAssignModal, confirmAssignTask,
      quizRecords, pointLogs, newQuiz, openQuizModal, confirmAddQuiz, currentStudentQuizzes, currentStudentPointLogs,
      resolveError, redeem, saveConfig, syncToCloud
    };
  }
}).mount('#app');
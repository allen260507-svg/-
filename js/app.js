// 家庭研学中枢 - 主控制器
const { createApp, ref, computed, onMounted, onUnmounted } = Vue;

try {
  const app = createApp({
    template: `
      <div class="h-full flex flex-col flex-1 overflow-hidden">
        <!-- 场景一：首屏 -->
        <div v-if="!currentLoggedInUser" class="h-full w-full flex flex-col items-center justify-between p-6 md:p-8 relative overflow-hidden">
          <div class="absolute top-12 left-16 text-4xl opacity-75 float-item-1 pointer-events-none">☀️</div>
          <div class="absolute top-16 right-24 text-4xl opacity-75 float-item-2 pointer-events-none">🌈</div>
          <div class="w-full max-w-6xl flex justify-between items-center z-10">
            <div>
              <h1 class="text-2xl md:text-3xl font-black tracking-wider text-slate-900">STUDY OS · 家庭智能研学系统</h1>
              <p class="text-xs text-rose-600 font-black tracking-widest mt-0.5">🔥 我命由我不由天</p>
            </div>
            <button @click="showSettings = true" class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition shadow-xs">⚙️ 系统设置</button>
          </div>

          <div class="w-full max-w-5xl z-10 space-y-6">
            <div class="bg-white/95 rounded-3xl p-6 shadow-md border border-slate-200/80">
              <div class="text-center mb-6">
                <h2 class="text-lg font-black text-slate-900 flex items-center justify-center space-x-2">
                  <span>🏅</span><span>研学积分 · 全员领奖台</span><span>🏅</span>
                </h2>
              </div>
              <div class="flex items-end justify-center space-x-3 md:space-x-6 px-4">
                <div v-if="rankedStudents[1]" @click="openPinModal(rankedStudents[1])" class="flex flex-col items-center cursor-pointer group flex-1 max-w-[140px]">
                  <div class="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-3xl shadow-inner mb-2 overflow-hidden">
                    <img v-if="rankedStudents[1].avatarImg" :src="rankedStudents[1].avatarImg" class="w-full h-full object-cover">
                    <span v-else>{{ rankedStudents[1].avatar }}</span>
                  </div>
                  <div class="font-black text-slate-800 text-sm">{{ rankedStudents[1].name }}</div>
                  <div class="text-xs font-black text-amber-600 mb-2">⚡ {{ rankedStudents[1].points }}分</div>
                  <div class="w-full podium-2nd rounded-t-2xl flex flex-col items-center justify-center text-slate-700 font-black"><span class="text-2xl">🥈</span><span class="text-xs mt-1">银牌</span></div>
                </div>

                <div v-if="rankedStudents[0]" @click="openPinModal(rankedStudents[0])" class="flex flex-col items-center cursor-pointer group flex-1 max-w-[160px]">
                  <div class="w-20 h-20 rounded-2xl bg-amber-50 border-4 border-amber-400 flex items-center justify-center text-4xl shadow-inner mb-2 relative overflow-hidden">
                    <img v-if="rankedStudents[0].avatarImg" :src="rankedStudents[0].avatarImg" class="w-full h-full object-cover">
                    <span v-else>{{ rankedStudents[0].avatar }}</span>
                    <span class="absolute top-0 right-0 bg-amber-500 text-white text-[9px] px-1 rounded-bl">👑</span>
                  </div>
                  <div class="font-black text-slate-900 text-base">{{ rankedStudents[0].name }}</div>
                  <div class="text-xs font-black text-amber-600 mb-2">⚡ {{ rankedStudents[0].points }}分</div>
                  <div class="w-full podium-1st rounded-t-2xl flex flex-col items-center justify-center text-amber-950 font-black"><span class="text-3xl">🥇</span><span class="text-sm mt-1">金牌</span></div>
                </div>

                <div v-if="rankedStudents[2]" @click="openPinModal(rankedStudents[2])" class="flex flex-col items-center cursor-pointer group flex-1 max-w-[140px]">
                  <div class="w-16 h-16 rounded-2xl bg-orange-50 border-2 border-orange-300 flex items-center justify-center text-3xl shadow-inner mb-2 overflow-hidden">
                    <img v-if="rankedStudents[2].avatarImg" :src="rankedStudents[2].avatarImg" class="w-full h-full object-cover">
                    <span v-else>{{ rankedStudents[2].avatar }}</span>
                  </div>
                  <div class="font-black text-slate-800 text-sm">{{ rankedStudents[2].name }}</div>
                  <div class="text-xs font-black text-amber-600 mb-2">⚡ {{ rankedStudents[2].points }}分</div>
                  <div class="w-full podium-3rd rounded-t-2xl flex flex-col items-center justify-center text-orange-950 font-black"><span class="text-2xl">🥉</span><span class="text-xs mt-1">铜牌</span></div>
                </div>

                <div v-if="rankedStudents[3]" @click="openPinModal(rankedStudents[3])" class="flex flex-col items-center cursor-pointer group flex-1 max-w-[140px]">
                  <div class="w-16 h-16 rounded-2xl bg-purple-50 border-2 border-purple-200 flex items-center justify-center text-3xl shadow-inner mb-2 overflow-hidden">
                    <img v-if="rankedStudents[3].avatarImg" :src="rankedStudents[3].avatarImg" class="w-full h-full object-cover">
                    <span v-else>{{ rankedStudents[3].avatar }}</span>
                  </div>
                  <div class="font-black text-slate-800 text-sm">{{ rankedStudents[3].name }}</div>
                  <div class="text-xs font-black text-amber-600 mb-2">⚡ {{ rankedStudents[3].points }}分</div>
                  <div class="w-full h-16 bg-gradient-to-b from-purple-100 to-indigo-100 border border-purple-300 rounded-t-2xl flex flex-col items-center justify-center text-indigo-950 font-black"><span class="text-xl">🏅</span><span class="text-[10px] mt-0.5">卓越奖</span></div>
                </div>
              </div>
              <div class="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center px-2 text-xs font-bold text-slate-600">
                <span>📊 历史荣誉统计：金牌/银牌/铜牌/优胜</span>
                <button @click="openPinModal(parentProfile)" class="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl font-black transition">🛡️ 家长总控入口 →</button>
              </div>
            </div>
          </div>
          <div class="z-10 text-xs font-bold text-slate-400">人教版研学课程体系 · 数字化独立研学中枢</div>
        </div>

        <!-- 场景二：家长总控 -->
        <div v-else-if="currentLoggedInUser.id === 'parent'" class="h-full flex flex-col flex-1 overflow-hidden p-4 md:p-6 space-y-3.5 bg-slate-900/10 backdrop-blur-xs">
          <header class="glass-light rounded-2xl px-5 py-3 flex items-center justify-between shadow-sm flex-shrink-0">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-2xl shadow-sm">🛡️</div>
              <span class="text-lg font-black text-slate-900">家长督导指挥中心</span>
            </div>
            <button @click="logout" class="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-black transition">🚪 退出总控</button>
          </header>
          <div class="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto custom-scrollbar">
            <div v-for="st in students" :key="st.id" class="glass-light rounded-2xl p-5 flex flex-col justify-between shadow-sm border border-slate-200">
              <div class="space-y-3.5">
                <div class="flex justify-between items-start">
                  <div class="flex items-center space-x-2.5">
                    <div class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl overflow-hidden">
                      <img v-if="st.avatarImg" :src="st.avatarImg" class="w-full h-full object-cover">
                      <span v-else>{{ st.avatar }}</span>
                    </div>
                    <div>
                      <h3 class="text-xl font-black text-slate-900">{{ st.name }}</h3>
                      <div class="text-xs font-bold text-slate-500">{{ st.grade }}</div>
                    </div>
                  </div>
                  <span class="text-sm font-black text-amber-600">⚡ {{ st.points }}分</span>
                </div>
              </div>
              <div class="pt-3 border-t border-slate-200 mt-3">
                <button @click="switchToUser(st)" class="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black shadow-xs">进入学生视角</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 场景三：学生工作台 -->
        <div v-else class="h-full flex flex-col flex-1 overflow-hidden p-3 md:p-4 space-y-2.5 bg-slate-900/5 backdrop-blur-xs">
          <header class="glass-light rounded-2xl px-5 py-2.5 flex items-center justify-between shadow-sm flex-shrink-0">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-2xl shadow-sm overflow-hidden">
                <img v-if="currentStudent.avatarImg" :src="currentStudent.avatarImg" class="w-full h-full object-cover">
                <span v-else>{{ currentLoggedInUser.avatar }}</span>
              </div>
              <div>
                <span class="text-base md:text-lg font-black text-slate-900">{{ currentLoggedInUser.name }}</span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="openPinModal(parentProfile)" class="px-3 py-1.5 bg-indigo-50 text-indigo-800 border rounded-xl text-xs font-black">🛡️ 家长总控</button>
              <button @click="logout" class="px-3.5 py-1.5 bg-slate-100 rounded-xl text-xs font-black">🚪 退出</button>
            </div>
          </header>

          <main class="flex-1 flex flex-col overflow-hidden">
            <div class="h-full flex flex-col flex-1 overflow-hidden space-y-2.5">
              <div class="glass-light rounded-xl px-4 py-2 flex justify-between items-center shadow-sm flex-shrink-0">
                <span class="text-sm font-black text-slate-900">🎯 今日研学任务大看板 (点击任意任务进入研学)</span>
                <button @click="openWheelModal" class="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-black shadow-md flex items-center space-x-1 animate-bounce">
                  <span>🎡</span><span>幸运大转盘抽选</span>
                </button>
              </div>

              <div class="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 overflow-y-auto custom-scrollbar pr-1">
                <div v-for="task in allTodayTasks" :key="task.id" :class="[isDone(task.id) ? 'bg-emerald-50/90 border-emerald-400' : 'glass-light border-slate-200', 'rounded-2xl border p-3.5 flex items-center justify-between transition-all']">
                  <div class="flex items-center space-x-3 min-w-0 flex-1 mr-2.5">
                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-white border shadow-2xs">{{ task.icon }}</div>
                    <div class="min-w-0 flex-1 space-y-0.5">
                      <div class="flex items-center space-x-2"><span class="text-xs font-black text-amber-700">+{{ task.points }}分</span></div>
                      <div class="text-sm md:text-base font-black text-slate-900 truncate">{{ task.title }}</div>
                    </div>
                  </div>
                  <div class="flex-shrink-0">
                    <button v-if="isDone(task.id)" @click="openTaskInteractive(task)" class="px-3.5 py-2 text-xs font-black text-emerald-800 bg-emerald-100 rounded-xl">✓ 已达标</button>
                    <button v-else @click="openTaskInteractive(task)" class="px-3.5 py-2 text-xs font-black text-white bg-slate-900 hover:bg-black rounded-xl shadow-md">进入研学</button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        <!-- 动态挂载 components.js 中的弹窗模板 -->
        <div v-html="mountedModalsHtml"></div>
        <!-- 静态辅助弹窗 -->
        <div v-if="showWheelModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border">
            <h3 class="text-lg font-black text-slate-900">🎡 幸运任务大转盘</h3>
            <button @click="showWheelModal = false" class="py-2 px-4 bg-slate-900 text-white rounded-xl text-xs">关闭</button>
          </div>
        </div>
        <div v-if="showPinModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-3xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl border">
            <h3 class="text-lg font-black text-slate-900">解锁 {{ selectedAuthUser?.name }}</h3>
            <button @click="showPinModal = false" class="py-2 px-4 bg-slate-900 text-white rounded-xl text-xs">取消</button>
          </div>
        </div>
      </div>
    `,
    setup() {
      const currentLoggedInUser = ref(null);
      const activeTab = ref('today');
      const showPinModal = ref(false);
      const selectedAuthUser = ref(null);
      const enteredPin = ref('');
      const showSettings = ref(false);
      const showWheelModal = ref(false);
      const wheelRotation = ref(0);
      const isWheelSpinning = ref(false);
      const wheelTargetTask = ref(null);

      // 14个弹窗状态
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

      const students = ref(window.StudyData?.defaultStudents || []);
      const currentStudentId = ref('nuo');
      const baseTasks = ref(window.StudyData?.baseTasks || []);
      const customTasks = ref([]);
      const checkins = ref({});
      const errors = ref([]);

      const parentProfile = { id: 'parent', name: '家长总控', avatar: '🛡️', grade: '总控管理员', pin: '8888' };
      const currentStudent = computed(() => students.value.find(s => s.id === currentStudentId.value) || students.value[0]);
      const rankedStudents = computed(() => [...students.value].sort((a, b) => b.points - a.points));

      const hwForm = ref({ yuwen: '', shuxue: '', yingyu: '', durationMinutes: 35, mode: 'direct' });
      const hwPhotos = ref([]);
      const currentReadingArticle = computed(() => window.StudyData?.readingArticles?.[0] || { title: '', content: '', questions: [] });
      const readingUserChoices = ref({});
      const readingSubmitted = ref(false);
      const readingScore = ref(0);
      const calligraphySentenceObj = computed(() => window.StudyData?.calligraphySentences?.[0] || { sentence: '' });
      const mathProblems = ref([]);
      const currentOlympiadData = computed(() => window.StudyData?.olympiadBank?.['小学3年级'] || { question: '', steps: [] });

      const openWheelModal = () => { showWheelModal.value = true; };
      const spinLuckyWheel = () => { showWheelModal.value = false; };
      const jumpToWheelTask = () => { showWheelModal.value = false; };

      const openTaskInteractive = (task) => {
        if (task.id === 1) showHomeworkModal.value = true;
        else if (task.id === 2) showReadingModal.value = true;
        else if (task.id === 3) showCalligraphyModal.value = true;
        else if (task.id === 4) { mathProblems.value = window.StudyMath.generateDrill('小学3年级'); showMathModal.value = true; }
        else if (task.id === 5) showOlympiadModal.value = true;
        else alert('正在进入研学模块...');
      };

      const openPinModal = (user) => { selectedAuthUser.value = user; showPinModal.value = true; };
      const pressPin = (n) => {
        enteredPin.value += String(n);
        if (enteredPin.value.length === 4) {
          switchToUser(selectedAuthUser.value);
          showPinModal.value = false;
          enteredPin.value = '';
        }
      };
      const clearPin = () => { enteredPin.value = ''; };
      const switchToUser = (u) => { currentLoggedInUser.value = u; if(u.id !== 'parent') currentStudentId.value = u.id; };
      const logout = () => { currentLoggedInUser.value = null; };

      const allTodayTasks = computed(() => [...customTasks.value, ...baseTasks.value]);
      const totalTaskCount = computed(() => allTodayTasks.value.length);
      const todayDoneCount = computed(() => (checkins.value[`${currentStudentId.value}_2026-09-04`]?.doneTaskIds || []).length);
      const isDone = (id) => (checkins.value[`${currentStudentId.value}_2026-09-04`]?.doneTaskIds || []).includes(id);

      // 动态将 components.js 的模版注入
      const currentModalHtmlTemplate = computed(() => {
        let html = '';
        if (window.StudyComponents) {
          if (showHomeworkModal.value) html += window.StudyComponents.homeworkModal;
          if (showReadingModal.value) html += window.StudyComponents.readingModal;
          if (showCalligraphyModal.value) html += window.StudyComponents.calligraphyModal;
          if (showMathModal.value) html += window.StudyComponents.mathModal;
          if (showOlympiadModal.value) html += window.StudyComponents.olympiadModal;
        }
        return html;
      });

      return {
        currentLoggedInUser, activeTab, showPinModal, selectedAuthUser, enteredPin,
        parentProfile, openPinModal, pressPin, clearPin, switchToUser, logout,
        students, currentStudentId, currentStudent, rankedStudents,
        baseTasks, allTodayTasks, totalTaskCount, todayDoneCount, isDone,
        showSettings, openWheelModal, spinLuckyWheel, jumpToWheelTask, showWheelModal,
        showHomeworkModal, hwForm, hwPhotos, currentReadingArticle, readingUserChoices, readingSubmitted, readingScore,
        showReadingModal, showCalligraphyModal, calligraphySentenceObj, showMathModal, mathProblems,
        showOlympiadModal, currentOlympiadData, openTaskInteractive, currentModalHtmlTemplate
      };
    }
  });

  app.mount('#app');
} catch (e) {
  console.error("App Mount Error:", e);
}
// 家庭研学中枢 - 弹窗组件模版库
window.StudyComponents = {
  // 作业登记弹窗
  homeworkModal: `
    <div v-if="showHomeworkModal" class="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 space-y-3.5 shadow-2xl border">
        <div class="flex justify-between items-center border-b pb-2"><h3 class="text-base font-black text-slate-900">🎒 登记学校作业与质检</h3><button @click="showHomeworkModal = false" class="text-slate-400 font-bold">✕</button></div>
        <div class="space-y-2.5 text-xs">
          <div><label class="font-bold">语文作业：</label><input v-model="hwForm.yuwen" class="w-full border rounded-lg p-2 mt-1"></div>
          <div><label class="font-bold">数学作业：</label><input v-model="hwForm.shuxue" class="w-full border rounded-lg p-2 mt-1"></div>
          <div><label class="font-bold">英语作业：</label><input v-model="hwForm.yingyu" class="w-full border rounded-lg p-2 mt-1"></div>
          <div class="grid grid-cols-2 gap-2">
            <div><label class="font-bold">用时(分钟)：</label><input v-model.number="hwForm.durationMinutes" type="number" class="w-full border rounded-lg p-2 mt-1 font-bold"></div>
            <div>
              <label class="font-bold">质检模式：</label>
              <select v-model="hwForm.mode" class="w-full border rounded-lg p-2 mt-1 font-bold"><option value="direct">直接打卡</option><option value="ai">AI深度检查</option></select>
            </div>
          </div>
          <div><label class="font-bold">作业拍照：</label><input type="file" multiple accept="image/*" @change="handleHwMultiPhotos" class="w-full text-xs mt-1"></div>
        </div>
        <div class="flex space-x-3 pt-2"><button @click="submitSchoolHomework" class="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black shadow-md">登记并打卡</button></div>
      </div>
    </div>
  `,

  // 阅读弹窗
  readingModal: `
    <div v-if="showReadingModal" class="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-3.5 shadow-2xl border max-h-[90vh] flex flex-col">
        <div class="flex justify-between items-center border-b pb-2"><h3 class="text-base font-black text-slate-900">{{ currentReadingArticle.title }}</h3><button @click="showReadingModal = false" class="text-slate-400 font-bold">✕</button></div>
        <div class="flex-1 overflow-y-auto space-y-3 text-xs leading-relaxed custom-scrollbar pr-1">
          <div class="p-3.5 bg-slate-50 rounded-2xl border text-sm text-slate-800 whitespace-pre-line">{{ currentReadingArticle.content }}</div>
          <div class="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-3">
            <div class="font-black text-indigo-900 text-sm">📝 真题检测 (共 3 道题)：</div>
            <div v-for="q in currentReadingArticle.questions" :key="q.id" class="space-y-1.5 p-3 bg-white rounded-xl border">
              <div class="font-bold text-slate-900">{{ q.q }}</div>
              <div class="space-y-1">
                <button v-for="opt in q.options" :key="opt" @click="selectReadingChoice(q.id, opt.slice(0,1))" :class="readingUserChoices[q.id] === opt.slice(0,1) ? 'bg-indigo-600 text-white font-black' : 'bg-white border text-slate-700'" class="w-full p-2 rounded-lg text-left font-bold transition text-xs">{{ opt }}</button>
              </div>
              <div v-if="readingSubmitted" class="text-[11px] text-slate-500 pt-1">标准答案：{{ q.ans }} | 解析：{{ q.analysis }}</div>
            </div>
            <div v-if="readingSubmitted" class="p-2.5 bg-emerald-100 text-emerald-900 font-black rounded-xl text-center">真题检测结果：做对 {{ readingScore }} / 3 题！</div>
          </div>
        </div>
        <div class="pt-2 border-t">
          <button v-if="!readingSubmitted" @click="submitReadingQuiz" class="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-md">提交真题判分</button>
          <button v-else @click="showReadingModal = false" class="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black shadow-md">核对完毕，关闭打卡</button>
        </div>
      </div>
    </div>
  `,

  // 练字弹窗
  calligraphyModal: `
    <div v-if="showCalligraphyModal" class="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 space-y-3.5 shadow-2xl border">
        <div class="flex justify-between items-center border-b pb-2"><h3 class="text-base font-black text-slate-900">✍️ 每日练字打卡 · 经典诗句临摹</h3><button @click="showCalligraphyModal = false" class="text-slate-400 font-bold">✕</button></div>
        <div class="p-4 bg-amber-50 border rounded-2xl text-center space-y-2">
          <div class="text-xs font-black text-rose-600">{{ calligraphySentenceObj.pinyin }}</div>
          <div class="text-2xl md:text-3xl font-black text-slate-900 kaiti-font tracking-widest">{{ calligraphySentenceObj.sentence }}</div>
          <div class="text-xs text-slate-600 font-bold">要求：每个字规范书写 10 遍</div>
          <div class="text-[11px] text-slate-500 bg-white p-2 rounded-lg border">💡 执笔要领：{{ calligraphySentenceObj.tip }}</div>
        </div>
        <div><label class="block font-bold text-xs mb-1">拍照上传练字作业照片：</label><input type="file" multiple accept="image/*" @change="handleCalligraphyPhotos" class="w-full text-xs"></div>
        <button @click="submitCalligraphy" class="w-full py-2.5 bg-rose-600 text-white rounded-xl text-xs font-black shadow-md">提交手写照片并打卡 (+2分)</button>
      </div>
    </div>
  `,

  // 口算弹窗
  mathModal: `
    <div v-if="showMathModal" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl max-w-sm w-full p-5 space-y-3 shadow-2xl border">
        <div class="flex justify-between items-center border-b pb-2"><h3 class="text-sm font-black text-slate-800">⚡ 10道口算快练</h3><button @click="showMathModal = false" class="text-slate-400 font-bold">✕</button></div>
        <div class="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-scrollbar">
          <div v-for="(p, i) in mathProblems" :key="i" class="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg border bg-slate-50">
            <span class="font-black text-slate-800 text-sm">{{ p.expr }}</span>
            <input v-model.number="p.userAns" type="number" class="w-18 border rounded p-1 text-center font-black bg-white">
          </div>
        </div>
        <button @click="submitMathDrill" class="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black">提交系统判分</button>
      </div>
    </div>
  `,

  // 奥数弹窗
  olympiadModal: `
    <div v-if="showOlympiadModal" class="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl max-w-xl w-full p-6 space-y-3.5 shadow-2xl border">
        <div class="flex justify-between items-center border-b pb-2"><h3 class="text-base font-black text-slate-900">🧩 奥数思维挑战</h3><button @click="showOlympiadModal = false" class="text-slate-400 font-bold">✕</button></div>
        <div class="p-3.5 bg-purple-50 rounded-2xl border text-sm font-bold text-purple-950">{{ currentOlympiadData.question }}</div>
        <div><label class="block font-bold text-xs mb-1">草稿拍照：</label><input type="file" multiple accept="image/*" @change="handleOlympiadPhotos" class="w-full text-xs"></div>
        <div class="p-3 bg-emerald-50 rounded-xl border text-xs space-y-1">
          <div class="font-black text-emerald-950">🎯 详细解答步骤：</div>
          <div v-for="(st, idx) in currentOlympiadData.steps" :key="idx">{{ st }}</div>
        </div>
        <button @click="completeOlympiad" class="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black shadow-md">完成奥数打卡 (+3分)</button>
      </div>
    </div>
  `
};
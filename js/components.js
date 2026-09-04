// 家庭研学中枢 - 弹窗与组件模板库
window.StudyComponents = {
  // 1. 幸运大转盘弹窗
  wheelModal: `
    <div v-if="showWheelModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border">
        <h3 class="text-lg font-black text-slate-900">🎡 幸运任务大转盘</h3>
        <p class="text-xs text-slate-500">转动轮盘，趣味决定下一个攻克的研学项目！</p>
        <div class="relative w-56 h-56 mx-auto flex items-center justify-center my-2">
          <div class="w-full h-full rounded-full border-4 border-amber-400 wheel-container relative overflow-hidden flex items-center justify-center" :style="{ transform: \`rotate(\${wheelRotation}deg)\` }">
            <div class="absolute inset-0 rounded-full" style="background: conic-gradient(#fde047 0deg 45deg, #a7f3d0 45deg 90deg, #fed7aa 90deg 135deg, #c7d2fe 135deg 180deg, #fbcfe8 180deg 225deg, #bae6fd 225deg 270deg, #fef08a 270deg 315deg, #ddd6fe 315deg 360deg);"></div>
            <div class="w-12 h-12 rounded-full bg-white border-4 border-amber-500 z-10 flex items-center justify-center font-black text-xs">GO</div>
          </div>
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 z-20 text-2xl">🔻</div>
        </div>
        <div v-if="!isWheelSpinning && wheelTargetTask" class="p-3 bg-amber-50 rounded-2xl border text-xs">
          <b>抽中任务：</b>{{ wheelTargetTask.title }}
        </div>
        <button v-if="!wheelTargetTask" @click="spinLuckyWheel" class="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-black shadow-md">开始旋转抽选！</button>
        <button v-else @click="jumpToWheelTask" class="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black shadow-md">立即开启该任务！</button>
      </div>
    </div>
  `,

  // 2. PIN 密码解锁弹窗
  pinModal: `
    <div v-if="showPinModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl border">
        <div class="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-4xl mx-auto overflow-hidden">
          <img v-if="selectedAuthUser?.avatarImg" :src="selectedAuthUser.avatarImg" class="w-full h-full object-cover">
          <span v-else>{{ selectedAuthUser?.avatar }}</span>
        </div>
        <h3 class="text-lg font-black text-slate-900">解锁 {{ selectedAuthUser?.name }} 的空间</h3>
        <div class="flex justify-center space-x-3 py-1">
          <div v-for="i in 4" :key="i" class="w-3.5 h-3.5 rounded-full" :class="enteredPin.length >= i ? 'bg-indigo-600 scale-110' : 'bg-slate-200'"></div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-slate-800 font-black text-lg pt-1">
          <button v-for="n in [1,2,3,4,5,6,7,8,9]" :key="n" @click="pressPin(n)" class="h-12 rounded-xl bg-slate-100 hover:bg-slate-200">{{ n }}</button>
          <button @click="clearPin" class="h-12 rounded-xl bg-slate-100 text-xs font-bold">清空</button>
          <button @click="pressPin(0)" class="h-12 rounded-xl bg-slate-100">0</button>
          <button @click="showPinModal = false; enteredPin = ''" class="h-12 rounded-xl bg-slate-100 text-rose-500 text-xs font-bold">取消</button>
        </div>
      </div>
    </div>
  `,

  // 3. 系统设置密钥弹窗
  settingsModal: `
    <div v-if="showSettings" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl max-w-md w-full p-5 space-y-3 shadow-2xl border">
        <h3 class="text-sm font-black text-slate-800">⚙️ 系统密钥与同步配置</h3>
        <div class="space-y-2 text-xs">
          <div><label class="block font-bold mb-1">硅基流动 AI 密钥 (sk-...)</label><input v-model="config.siliconKey" type="password" class="w-full border rounded-lg p-2 font-mono"></div>
          <div><label class="block font-bold mb-1">Upstash REST URL</label><input v-model="config.upstashUrl" type="text" class="w-full border rounded-lg p-2 font-mono"></div>
          <div><label class="block font-bold mb-1">Upstash REST TOKEN</label><input v-model="config.upstashToken" type="password" class="w-full border rounded-lg p-2 font-mono"></div>
        </div>
        <div class="flex space-x-2 pt-2">
          <button @click="showSettings = false" class="flex-1 py-2 border rounded-xl text-xs font-bold">取消</button>
          <button @click="saveConfig" class="flex-1 py-2 bg-slate-900 text-white rounded-xl text-xs font-black">保存连接</button>
        </div>
      </div>
    </div>
  `
};
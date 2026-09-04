// 家庭研学中枢 - 独立附件管理与多文件累加模块 (js/fileManager.js)
window.StudyFileManager = {
  // 单个文件转 Base64 Promise 封装
  readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: e.target.result,
          uploadTime: new Date().toISOString()
        });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  },

  // 核心：处理文件选择事件，实现“不管是一次多个，还是多次多个，所选附件全部累加”
  async handleFileSelection(event, targetRefArray) {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    try {
      // 异步转码所有新选中的文件
      const promises = files.map(file => this.readFileAsBase64(file));
      const newFileObjects = await Promise.all(promises);

      // 执行累加：将新文件追加到原有数组中，永不覆盖
      targetRefArray.value = [...targetRefArray.value, ...newFileObjects];
      
      console.log(`[FileManager] 成功追加 ${newFileObjects.length} 个文件，当前总计: ${targetRefArray.value.length} 个`);
    } catch (err) {
      console.error('[FileManager] 文件读取解析失败:', err);
      alert('部分文件读取失败，请重试！');
    } finally {
      // 清空 input 值，确保重复选择同名文件时能正常触发 change 事件
      event.target.value = '';
    }
  },

  // 移除指定索引的附件
  removeAttachment(targetRefArray, index) {
    if (index >= 0 && index < targetRefArray.value.length) {
      targetRefArray.value.splice(index, 1);
    }
  },

  // 合并持久化附件到打卡记录中（支持多次追加合并）
  mergeTaskAttachments(existingAttachments = {}, taskId, newFiles = []) {
    const updatedAttachments = { ...existingAttachments };
    const currentTaskFiles = updatedAttachments[taskId] || [];
    // 将新老文件完美合并
    updatedAttachments[taskId] = [...currentTaskFiles, ...newFiles];
    return updatedAttachments;
  }
};
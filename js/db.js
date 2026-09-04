// 云端数据库同步模块 (Upstash Redis)
window.StudyDB = {
  async save(url, token, data) {
    if (!url || !token) return false;
    const cleanUrl = url.replace(/\/+$/, '');
    const resp = await fetch(`${cleanUrl}/set/family_study_db`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    return resp.ok;
  },

  async load(url, token) {
    if (!url || !token) return null;
    const cleanUrl = url.replace(/\/+$/, '');
    const resp = await fetch(`${cleanUrl}/get/family_study_db`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const d = await resp.json();
    if (d && d.result) {
      return typeof d.result === 'string' ? JSON.parse(d.result) : d.result;
    }
    return null;
  }
};
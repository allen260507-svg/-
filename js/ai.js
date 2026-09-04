// 视觉 AI 批改与时事科普大模型交互模块
window.StudyAI = {
  // 视觉批改作业
  async gradeHomework(apiKey, base64Image) {
    const prompt = `你是人教版中小学老师。请逐题严格批改这张作业照片，判断正误。必须严格返回纯 JSON，禁止任何额外文本，格式如下:
{"total":5,"passed":4,"errors":[{"question":"题目简述","studentAnswer":"孩子错误写法","correctAnswer":"正确答案","errorType":"计算失误","analysis":"详细错因分析"}]}`;

    const resp = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-VL-7B-Instruct',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
          ]
        }]
      })
    });

    if (!resp.ok) throw new Error('AI 接口调用失败');
    const data = await resp.json();
    const content = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(content);
  },

  // 动态生成今日真实时事新闻与硬核科普事实
  async fetchRealTopicNews(apiKey, topicName) {
    const prompt = `请作为国家地理与科技少儿科普主编，为中小学生带来一条关于【${topicName}】的最新权威真实新闻或硬核事实。
必须是100%真实发生的事件、大国工程突破或权威科学定论，严禁编造任何虚假内容。
请直接输出：【标题】+【具体时间/背景】+【核心硬核知识浅显解读】+【启发孩子思考的一句话】。总字数控制在180字以内，语言生动、条理清晰。`;

    const resp = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-7B-Instruct',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!resp.ok) throw new Error('网络请求失败');
    const data = await resp.json();
    return data.choices[0].message.content.trim();
  }
};
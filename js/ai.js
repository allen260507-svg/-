// 视觉 AI 批改模块 (硅基流动 Qwen2.5-VL)
window.StudyAI = {
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
  }
};
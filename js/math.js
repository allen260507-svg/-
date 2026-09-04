// 智能学段口算生成引擎
window.StudyMath = {
  generateDrill(grade) {
    const problems = [];
    for (let i = 0; i < 10; i++) {
      let expr, ans;
      if (grade.includes('1年级') || grade.includes('2年级')) {
        let a = Math.floor(Math.random() * 15) + 1;
        let b = Math.floor(Math.random() * 10) + 1;
        expr = `${a} + ${b} =`; ans = a + b;
      } else if (grade.includes('3年级') || grade.includes('4年级')) {
        let a = Math.floor(Math.random() * 80) + 12;
        let b = Math.floor(Math.random() * 8) + 2;
        expr = `${a} × ${b} =`; ans = a * b;
      } else if (grade.includes('5年级') || grade.includes('6年级')) {
        let a = parseFloat((Math.random() * 8 + 1).toFixed(1));
        let b = parseFloat((Math.random() * 8 + 1).toFixed(1));
        expr = `${a} + ${b} =`; ans = parseFloat((a + b).toFixed(1));
      } else if (grade.includes('初中')) {
        let a = Math.floor(Math.random() * 26) - 13;
        let b = Math.floor(Math.random() * 18) - 9;
        let isMul = Math.random() > 0.5;
        ans = isMul ? a * b : a + b;
        let bStr = b < 0 ? `(${b})` : `${b}`;
        expr = `${a} ${isMul ? '×' : '+'} ${bStr} =`;
      } else {
        // 高中幂指数心算
        let base = Math.floor(Math.random() * 3) + 2;
        let exp = Math.floor(Math.random() * 3) + 2;
        expr = `${base}^${exp} =`; ans = Math.pow(base, exp);
      }
      problems.push({ expr, ans, userAns: null });
    }
    return problems;
  }
};
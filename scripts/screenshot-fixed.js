const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 대기 함수
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log('📷 스크린샷 생성 시작...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  
  const pages = [
    { url: 'http://localhost:3002', name: 'home.png', title: '🏠 홈페이지', delay: 1500 },
    { url: 'http://localhost:3002/templates', name: 'templates.png', title: '📋 템플릿', delay: 2000 },
    { url: 'http://localhost:3002/solutions', name: 'solutions.png', title: '🔧 솔루션', delay: 2000 },
    { url: 'http://localhost:3002/learn', name: 'learn.png', title: '📚 학습', delay: 1500 },
  ];

  const outputDir = path.join(__dirname, '..', 'public', 'screenshots');
  
  console.log(`💾 저장 경로: ${outputDir}\n`);

  for (const pageInfo of pages) {
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      
      console.log(`⏳ ${pageInfo.title} 로드 중...`);
      await page.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 40000 });
      
      // 페이지 로딩 후 추가 대기
      await sleep(pageInfo.delay);
      
      const filePath = path.join(outputDir, pageInfo.name);
      await page.screenshot({ path: filePath, fullPage: false });
      
      const stats = fs.statSync(filePath);
      console.log(`✓ ${pageInfo.title} → ${pageInfo.name} (${(stats.size/1024).toFixed(1)}KB)\n`);
      await page.close();
    } catch (e) {
      console.log(`✗ ${pageInfo.title} 실패: ${e.message}\n`);
    }
  }

  await browser.close();
  
  // 결과 확인
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.png'));
  console.log(`✅ 스크린샷 생성 완료!`);
  console.log(`📁 생성된 파일: ${files.length}개\n`);
  files.forEach(f => {
    const filePath = path.join(outputDir, f);
    const size = fs.statSync(filePath).size;
    console.log(`   ✓ ${f} (${(size/1024).toFixed(1)}KB)`);
  });
})();

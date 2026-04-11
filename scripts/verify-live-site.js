const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🌐 라이브 사이트 검증 시작...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const pages = [
    { url: 'https://ai-trainer-app-production.up.railway.app/', title: '홈페이지' },
    { url: 'https://ai-trainer-app-production.up.railway.app/templates', title: '템플릿' },
    { url: 'https://ai-trainer-app-production.up.railway.app/solutions', title: '솔루션' },
    { url: 'https://ai-trainer-app-production.up.railway.app/learn', title: '학습' },
  ];

  const results = [];
  
  for (const pageInfo of pages) {
    try {
      console.log(`⏳ ${pageInfo.title} 검증 중... (${pageInfo.url})`);
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      
      const startTime = Date.now();
      await page.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 30000 });
      const loadTime = Date.now() - startTime;
      
      // 페이지 메타데이터 확인
      const title = await page.title();
      const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 200));
      
      // SVG 이미지 개수 확인
      const svgCount = await page.evaluate(() => document.querySelectorAll('svg').length);
      const imgCount = await page.evaluate(() => document.querySelectorAll('img').length);
      
      console.log(`  ✓ 로드 성공: ${loadTime}ms`);
      console.log(`  ✓ 제목: ${title}`);
      console.log(`  ✓ SVG 요소: ${svgCount}개, 이미지: ${imgCount}개\n`);
      
      results.push({
        page: pageInfo.title,
        status: '✓',
        loadTime: loadTime,
        svgCount: svgCount,
        imgCount: imgCount,
        title: title
      });
      
      await page.close();
    } catch (e) {
      console.log(`  ✗ 실패: ${e.message}\n`);
      results.push({
        page: pageInfo.title,
        status: '✗',
        error: e.message
      });
    }
  }

  await browser.close();
  
  console.log('═══════════════════════════════════════');
  console.log('📊 라이브 사이트 검증 결과');
  console.log('═══════════════════════════════════════\n');
  
  results.forEach(r => {
    console.log(`${r.status} ${r.page}`);
    if (r.error) {
      console.log(`   오류: ${r.error}`);
    } else {
      console.log(`   로드: ${r.loadTime}ms`);
      console.log(`   SVG: ${r.svgCount}, 이미지: ${r.imgCount}`);
    }
    console.log();
  });
})();

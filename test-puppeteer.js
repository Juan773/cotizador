const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8089/');
  await page.waitForTimeout(2000);
  
  // click select element and select interlab
  await page.select('#companySelect', 'interlab');
  await page.waitForTimeout(1000);
  
  const text = await page.evaluate(() => document.getElementById('sheetBrandName').innerText);
  console.log("BRAND AFTER CHANGE:", text);
  
  await browser.close();
})();

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Configuration
const config = {
  baseUrl: process.argv.includes('--local')
    ? 'http://localhost:3000'
    : 'https://lotto-site-ten.vercel.app',
  outputDir: path.join(__dirname, 'output'),
  viewport: { width: 1280, height: 800 },
};

// Button labels for each step
const STEP_BUTTONS = {
  1: 'Next: Clear Your Debts',
  2: 'Next: Dream Homes',
  3: 'Next: Luxury & Travel',
  4: 'Next: Share the Wealth',
  5: 'Next: Your New Normal',
  6: 'Next: Plan Your Future',
  7: 'See My Results',
  8: 'Get My Report',
};

async function captureScreenshots() {
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  console.log(`📸 Starting screenshot capture from ${config.baseUrl}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: config.viewport });
  const page = await context.newPage();

  try {
    console.log('Loading page...');
    await page.goto(config.baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Step 1: The Setup
    console.log('📷 Step 1: The Setup');
    await page.screenshot({ path: path.join(config.outputDir, '01-setup.png') });

    // Step 2
    await page.click(`button:has-text("${STEP_BUTTONS[1]}")`);
    await page.waitForTimeout(600);
    console.log('📷 Step 2: Debts');
    await page.screenshot({ path: path.join(config.outputDir, '02-debts.png') });

    // Step 3
    await page.click(`button:has-text("${STEP_BUTTONS[2]}")`);
    await page.waitForTimeout(600);
    console.log('📷 Step 3: Homes');
    await page.screenshot({ path: path.join(config.outputDir, '03-homes.png') });

    // Step 4
    await page.click(`button:has-text("${STEP_BUTTONS[3]}")`);
    await page.waitForTimeout(600);
    console.log('📷 Step 4: Luxury & Travel');
    await page.screenshot({ path: path.join(config.outputDir, '04-luxury-travel.png') });

    // Step 5
    await page.click(`button:has-text("${STEP_BUTTONS[4]}")`);
    await page.waitForTimeout(600);
    console.log('📷 Step 5: Share the Wealth');
    await page.screenshot({ path: path.join(config.outputDir, '05-share-wealth.png') });

    // Step 6
    await page.click(`button:has-text("${STEP_BUTTONS[5]}")`);
    await page.waitForTimeout(600);
    console.log('📷 Step 6: Annual Expenses');
    await page.screenshot({ path: path.join(config.outputDir, '06-expenses.png') });

    // Step 7
    await page.click(`button:has-text("${STEP_BUTTONS[6]}")`);
    await page.waitForTimeout(600);
    console.log('📷 Step 7: The Future');
    await page.screenshot({ path: path.join(config.outputDir, '07-future.png') });

    // Step 8
    await page.click(`button:has-text("${STEP_BUTTONS[7]}")`);
    await page.waitForTimeout(600);
    console.log('📷 Step 8: Results');
    await page.screenshot({ path: path.join(config.outputDir, '08-results.png') });

    // Scroll down for more of results
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(config.outputDir, '08-results-bottom.png') });

    console.log('✅ Screenshots saved to:', config.outputDir);
    fs.readdirSync(config.outputDir).forEach(file => {
      console.log(`  - ${file}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: path.join(config.outputDir, 'error-state.png'), fullPage: true });
  } finally {
    await browser.close();
  }
}

captureScreenshots();

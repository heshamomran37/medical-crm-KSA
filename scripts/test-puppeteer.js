const puppeteer = require('puppeteer');

(async () => {
    console.log('Attempting to launch Puppeteer...');
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log('✅ Puppeteer launched successfully!');
        const page = await browser.newPage();
        await page.goto('https://example.com');
        console.log('✅ Page navigated to example.com');
        await browser.close();
        console.log('✅ Browser closed.');
    } catch (err) {
        console.error('❌ Puppeteer launch FAILED:', err);
    }
})();

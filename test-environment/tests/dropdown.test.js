const puppeteer = require("puppeteer");


let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({
        //headless: false,
        //slowMo: 500
    });
});

beforeEach(async () => {
    page = await browser.newPage();

    await page.goto("http://localhost:56789/#dropdown");
});

afterEach(async () => {
    await page.close();
});

afterAll(async () => {
    await browser.close();
});


describe(`dropdown`, () => {
    test(`dropdown content is hidden by default`, async () => {
        let element = await page.$("#for-default-test .element");
        let content = await page.$("#for-default-test .content");

        expect(content).toBeNull();
    });

    test(`dropdown content is show when show={true}`, async () => {
        let element = await page.$("#for-show-test .element");
        let content = await page.$("#for-show-test .content");

        expect(content).not.toBeNull();
    });

    test(`dropdown content is hidden when show={false}`, async () => {
        let element = await page.$("#for-hide-test .element");
        let content = await page.$("#for-hide-test .content");

        expect(content).toBeNull();
    });
});

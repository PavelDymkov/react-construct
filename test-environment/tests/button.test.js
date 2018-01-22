const puppeteer = require("puppeteer");
const looper = require("./looper.js");


let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({
/*
        headless: false,
        devtools: true,
        slowMo: 500
*/
    });
});

beforeEach(async () => {
    page = await browser.newPage();

    await page.goto("http://localhost:56789/#button");
});

afterEach(async () => {
    await page.close();
});

afterAll(async () => {
    await browser.close();
});


describe(`button onRelease`, () => {
    test(`onRelease callback by click`, done => {
        looper({
            page, done, 
            async messageLoop({ receivedMessage }) {
                await receivedMessage("button-release");
            },
            async browserLoop() {
                let element = await page.$("#release-test .element");

                await element.click();
            }
        });
    });

    test(`onRelease callback by enter key pressed`, done => {
        looper({
            page, done, 
            async messageLoop({ receivedMessage }) {
                await receivedMessage("button-release");
            },
            async browserLoop() {
                let element = await page.$("#release-test .rc-button__helper");

                await element.focus();
                await element.press("Enter");
            }
        });
    });
});
/*
describe(`button handle focus-events`, () => {
    test(`focusIn callback`, done => {
        looper({
            page, done,
            async messageLoop({ receivedMessage }) {
                await receivedMessage("button-focus-in");
            },
            async browserLoop() {
                await page.focus("#focus-in-out-test .element");
            }
        });
    });

    test(`focusOut callback`, done => {
        looper({
            page, done,
            async messageLoop({ receivedMessage }) {
                await receivedMessage("button-focus-out");
            },
            async browserLoop() {
                await page.focus("#focus-in-out-test .element");

                let outerInput = await page.$("#focus-in-out-test .input");

                await outerInput.focus();
            }
        });
    });

    test(`onFocusChange callback`, done => {
        looper({
            page, done,
            async messageLoop({ dataFromMessage }) {
                let focusStateValue;

                focusStateValue = await dataFromMessage("button-focus-change");

                expect(focusStateValue).toBe(true);

                focusStateValue = await dataFromMessage("button-focus-change");

                expect(focusStateValue).toBe(false);
            },
            async browserLoop() {
                await page.focus("#focus-in-out-test .element");

                let outerInput = await page.$("#focus-in-out-test .input");

                await outerInput.focus();
            }
        });
    });

    test(`correct handle by keyboard`, done => {
        looper({
            page, done,
            async messageLoop({ dataFromMessage }) {
                let focusStateValue;

                focusStateValue = await dataFromMessage("button-focus-change");

                expect(focusStateValue).toBe(true);

                focusStateValue = await dataFromMessage("button-focus-change");

                expect(focusStateValue).toBe(false);
            },
            async browserLoop() {
                let input1 = await page.$("#focus-test .input-1");

                await input1.focus();
                await input1.press("Tab");

                let componentInput = await page.$("#focus-test .rc-button__helper");

                await componentInput.press("Tab");
            }
        });
    });
});
*/
/*
describe(`button handle keyboard-events`, () => {
    test(`button handle "enter" key`, done => {
        looper({
            page, done, 
            async messageLoop({ dataFromMessage }) {
                let data = await dataFromMessage("button-key");

                expect(data.key).toBe(13);
            },
            async browserLoop() {
                let element = await page.$("#key-test .element");

                await element.click();
                await element.press("Enter");
            }
        });
    });
});
*/

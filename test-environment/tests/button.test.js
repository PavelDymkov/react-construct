const puppeteer = require("puppeteer");
const io = require("puppeteer-io");


let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch();
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
        io({
            page, done,
            async input() {
                await page.click("#release-test .element");
            },
            async output({ message }) {
                await message("button-release");
            }
        });
    });

    test(`onRelease callback by enter key pressed`, done => {
        io({
            page, done,
            async input() {
                await page.focus("#release-test .input");
                await page.keyboard.press("Tab");
                await page.keyboard.press("Enter");
            },
            async output({ message }) {
                await message("button-release");
            }
        });
    });
});

describe(`button handle focus-events`, () => {
    test(`focusIn callback`, done => {
        io({
            page, done,
            async input() {
                await page.focus("#focus-in-out-test .element");
            },
            async output({ message }) {
                await message("button-focus-in");
            }
        });
    });

    test(`focusOut callback`, done => {
        io({
            page, done,
            async input() {
                await page.focus("#focus-in-out-test .element");

                let outerInput = await page.$("#focus-in-out-test .input");

                await outerInput.focus();
            },
            async output({ message }) {
                await message("button-focus-out");
            }
        });
    });

    test(`onFocusChange callback`, done => {
        io({
            page, done,
            async input() {
                await page.focus("#focus-in-out-test .element");

                let outerInput = await page.$("#focus-in-out-test .input");

                await outerInput.focus();
            },
            async output({ dataFromMessage }) {
                let focusStateValue;

                focusStateValue = await dataFromMessage("button-focus-change");

                expect(focusStateValue).toBe(true);

                focusStateValue = await dataFromMessage("button-focus-change");

                expect(focusStateValue).toBe(false);
            }
        });
    });

    test(`correct handle by keyboard`, done => {
        io({
            page, done,
            async input() {
                await page.focus("#focus-test .input-1");
                await page.keyboard.press("Tab");
                await page.keyboard.press("Tab");
            },
            async output({ dataFromMessage }) {
                let focusStateValue;

                focusStateValue = await dataFromMessage("button-focus-change");

                expect(focusStateValue).toBe(true);

                focusStateValue = await dataFromMessage("button-focus-change");

                expect(focusStateValue).toBe(false);
            }
        });
    });
});

describe(`button handle keyboard-events`, () => {
    test(`button handle "enter" key`, done => {
        io({
            page, done,
            async input() {
                let element = await page.$("#key-test .element");

                await element.click();
                await element.press("Enter");
            },
            async output({ dataFromMessage }) {
                let data = await dataFromMessage("button-key");

                expect(data.key).toBe(13);
            }
        });
    });
});

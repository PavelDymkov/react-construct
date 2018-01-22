const puppeteer = require("puppeteer");
const io = require("puppeteer-io");


let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch();
});

beforeEach(async () => {
    page = await browser.newPage();

    await page.goto("http://localhost:56789/#outside-click");
});

afterEach(async () => {
    await page.close();
});

afterAll(async () => {
    await browser.close();
});


test(`do not call callback if click inside`, async () => {
    await page.click("#click-inside-test .element");

    let messageContainer = await page.$("#output-message");
    let message = await page.evaluate(element => element.textContent, messageContainer);

    await messageContainer.dispose();

    expect(message).not.toBe("ERROR");
});

test(`call callback if click outside`, done => {
    io({
        page, done,
        async input() {
            await page.click("#click-outside-test .outside-element");
        },
        async output({ message }) {
            await message("click-outside");
        }
    });
});

test(`call callback if click to another outside-click component`, done => {
    io({
        page, done,
        async input() {
            await page.click("#click-inside-test .element");
        },
        async output({ message }) {
            await message("click-outside");
        }
    });
});

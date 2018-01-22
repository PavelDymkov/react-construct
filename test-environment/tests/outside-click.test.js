const puppeteer = require("puppeteer");


let browser;
let page;
let triggered;

beforeAll(async () => {
    browser = await puppeteer.launch();
});

beforeEach(async () => {
    triggered = false;
    page = await browser.newPage();

    await page.goto("http://localhost:56789/#outside-click");
});

afterEach(async () => {
    await page.close();
});

afterAll(async () => {
    await browser.close();
});


describe(`dropdown`, () => {
    test(`do not call callback if click inside`, async () => {
        page.on("console", expectMessage("click-inside"));

        let element = await page.$("#click-inside-test .element");

        await element.click();

        expect(triggered).toBeFalsy();
    });

    test(`call callback if click outside`, async () => {
        page.on("console", expectMessage("click-outside"));

        let outsideElement = await page.$("#click-outside-test .outside-element");

        await outsideElement.click();

        expect(triggered).toBeTruthy();
    });

    test(`call callback if click to another outside-click component`, async () => {
        page.on("console", expectMessage("click-outside"));

        let anotherComponentElement = await page.$("#click-inside-test .element");

        await anotherComponentElement.click();

        expect(triggered).toBeTruthy();
    });
});


function expectMessage(message) {
    return ({ type, text }) => {
        if (type != "log") return;

        if (text == message) triggered = true;
    };
}

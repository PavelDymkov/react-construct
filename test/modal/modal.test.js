const puppeteer = require("puppeteer");
// const io = require("puppeteer-io");
const getUrl = require("../get-url.js");


let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch();
});

beforeEach(async () => {
    page = await browser.newPage();

    await page.goto(getUrl("modal"));
});

afterEach(async () => {
    await page.close();
});

afterAll(async () => {
    await browser.close();
});

jest.setTimeout(10000);


test(`modal has content`, async () => {
    // await page.$(".content");
});

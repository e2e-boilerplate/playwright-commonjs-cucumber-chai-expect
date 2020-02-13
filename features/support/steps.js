const {
  Given,
  When,
  Then,
  BeforeAll,
  AfterAll,
  setDefaultTimeout
} = require("cucumber");
const puppeteer = require("puppeteer");
const { expect } = require("chai");

let page;
let browser;

setDefaultTimeout(50 * 1000);

BeforeAll(async () => {
  browser = process.env.GITHUB_ACTIONS
    ? await puppeteer.launch()
    : await puppeteer.launch({ headless: false });

  page = await browser.newPage();
});

AfterAll(() => {
  if (!page.isClosed()) {
    browser.close();
  }
});

Given("Navigate to the sandbox", async () => {
  await page
    .goto("https://e2e-boilerplates.github.io/sandbox/", { waitUntil: "networkidle0" })
    .catch(() => {});
});

When("I am on the sandbox page", async () => {
  await page.waitFor("h1");
  expect(await page.title()).to.equal("Sandbox");
});

Then("The page header should be {string}", async header => {
  const title = await page.$eval("h1", el => el.textContent);
  expect(title).to.equal(header);
});

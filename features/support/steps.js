const {
  Given,
  When,
  Then,
  BeforeAll,
  AfterAll,
  setDefaultTimeout
} = require("cucumber");
const playwright = require("playwright").chromium;
const { expect } = require("chai");

let page;
let browser;
let context;

setDefaultTimeout(50 * 1000);

BeforeAll(async () => {
  browser = process.env.GITHUB_ACTIONS
    ? await playwright.launch({ headless: true })
    : await playwright.launch({ headless: false });
});

AfterAll(() => {
  if (!page.isClosed()) {
    browser.close();
  }
});

Given("Navigate to the sandbox", async () => {
  context = await browser.newContext();
  page = await context.newPage("https://e2e-boilerplates.github.io/sandbox/");
});

When("I am on the sandbox page", async () => {
  await page.waitFor("h1");
  expect(await page.title()).to.equal("Sandbox");
});

Then("The page header should be {string}", async header => {
  const title = await page.$eval("h1", el => el.textContent);
  expect(title).to.equal(header);
});

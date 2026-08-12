import puppeteer from "puppeteer";
import { fork } from "child_process";

jest.setTimeout(60000); // Увеличим таймаут до 60 сек на случай долгих загрузок

describe("Credit Card Validator form", () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = "http://localhost:9000";

  beforeAll(async () => {
    server = fork(`${__dirname}/server.js`);

    await new Promise((resolve, reject) => {
      server.on("error", reject);
      server.on("message", (message) => {
        if (message === "ok") {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    // Создаем новую вкладку сразу здесь
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test("должен определить Visa по валидному номеру и показать зеленую галочку", async () => {
    await page.goto(baseUrl);
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    const inputSelector = ".cc-input";
    const buttonSelector = ".cc-btn";
    const resultSelector = ".cc-result";

    await page.waitForSelector(inputSelector);
    await page.type(inputSelector, "4111111111111111");
    await page.click(buttonSelector);
    await page.waitForSelector(resultSelector);

    const text = await page.$eval(resultSelector, (el) =>
      el.textContent.trim()
    );
    expect(text).toContain("Валидный номер");
  });

  test("должен отклонить невалидный номер", async () => {
    await page.goto(baseUrl);
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    const inputSelector = ".cc-input";
    const buttonSelector = ".cc-btn";
    const resultSelector = ".cc-result";

    await page.waitForSelector(inputSelector);
    await page.type(inputSelector, "4111111111111112");
    await page.click(buttonSelector);
    await page.waitForSelector(resultSelector);

    const text = await page.$eval(resultSelector, (el) =>
      el.textContent.trim()
    );
    expect(text).toContain("Невалидный номер");
  });
});

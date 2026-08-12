import puppeteer from "puppeteer";
import { fork } from "child_process";

jest.setTimeout(30000);

describe("Credit Card Validator form", () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = "http://localhost:9000";

  beforeAll(async () => {
    // Запускаем сервер Webpack Dev Server как дочерний процесс
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
      headless: true, // Для CI лучше использовать без GUI
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test("должен определить Visa по валидному номеру и показать зеленую галочку", async () => {
    await page.goto(baseUrl);

    const inputSelector = ".cc-input";
    const buttonSelector = ".cc-btn";
    const resultSelector = ".cc-result";

    await page.waitForSelector(inputSelector);

    await page.type(inputSelector, "4111111111111111");

    await page.click(buttonSelector);

    await page.waitForSelector(resultSelector);

    const text = await page.$eval(resultSelector, (el) => el.textContent);

    expect(text).toContain("Валидный номер");
  });

  test("должен отклонить невалидный номер", async () => {
    await page.goto(baseUrl);

    const inputSelector = ".cc-input";
    const buttonSelector = ".cc-btn";
    const resultSelector = ".cc-result";

    await page.waitForSelector(inputSelector);
    await page.type(inputSelector, "4111111111111112"); // Изменена последняя цифра
    await page.click(buttonSelector);
    await page.waitForSelector(resultSelector);

    const text = await page.$eval(resultSelector, (el) => el.textContent);
    expect(text).toContain("Невалидный номер");
  });
});

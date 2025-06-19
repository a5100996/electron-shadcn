import {
  test,
  expect,
  _electron as electron,
  ElectronApplication,
  Page,
} from "@playwright/test";
import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers";

/*
 * Using Playwright with Electron:
 * https://www.electronjs.org/pt/docs/latest/tutorial/automated-testing#using-playwright
 */

let electronApp: ElectronApplication;

test.beforeAll(async () => {
  /*
  const latestBuild = findLatestBuild();
  const appInfo = parseElectronApp(latestBuild);
  process.env.CI = "e2e";

  electronApp = await electron.launch({
    args: [appInfo.main],
  });
  */

    // Launch Electron app.
    const electronApp = await electron.launch({ args: ['main.ts'] });

    // Evaluation expression in the Electron context.
    const appPath = await electronApp.evaluate(async ({ app }) => {
        // This runs in the main Electron process, parameter here is always
        // the result of the require('electron') in the main app script.
        return app.getAppPath();
    });
    console.log(appPath);

  electronApp.on("window", async (page) => {
    const filename = page.url()?.split("/").pop();
    console.log(`Window opened: ${filename}`);

    page.on("pageerror", (error) => {
      console.error(error);
    });
    page.on("console", (msg) => {
      console.log(msg.text());
    });
  });
});

test("renders the first page", async () => {
  const page: Page = await electronApp.firstWindow();
  const title = await page.waitForSelector("h1");
  const text = await title.textContent();
    expect(text).toBe("Sample management");
});

test("renders page name", async () => {
  const page: Page = await electronApp.firstWindow();
  await page.waitForSelector("h1");
  const pageName = await page.getByTestId("pageTitle");
  const text = await pageName.textContent();
  expect(text).toBe("Home Page");
});

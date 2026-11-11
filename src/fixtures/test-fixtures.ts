import { test as base, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { Logger } from '../utils/logger';
import { MovieApi, LoginResult } from '../api/MovieApi';
import { buildUser, TestUser } from '../data/testData';
import { HomePage } from '../pages/HomePage';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';
import { MovieDetailPage } from '../pages/MovieDetailPage';
import { PurchasePage } from '../pages/PurchasePage';
import { AccountPage } from '../pages/AccountPage';

interface Pages {
  log: Logger;
  api: MovieApi;
  homePage: HomePage;
  signInPage: SignInPage;
  signUpPage: SignUpPage;
  detailPage: MovieDetailPage;
  purchasePage: PurchasePage;
  accountPage: AccountPage;
  /** A brand-new customer account registered through the API (not logged in). */
  registeredUser: TestUser;
  /** Same account, already logged in (session injected into localStorage before the page loads). */
  loggedIn: { user: TestUser; session: LoginResult };
}

/** Injects the session exactly the way the app stores it after a UI login. */
export async function injectSession(page: Page, session: LoginResult) {
  // Only on the first load of the tab, so a later logout + reload is not undone.
  await page.addInitScript(s => {
    if (!window.sessionStorage.getItem('__pw_session_injected')) {
      window.localStorage.setItem('currentUser', s);
      window.sessionStorage.setItem('__pw_session_injected', '1');
    }
  }, JSON.stringify(session));
}

export const test = base.extend<Pages>({
  // eslint-disable-next-line no-empty-pattern
  log: async ({}, use, testInfo) => {
    const log = new Logger(testInfo.title.match(/TC_[A-Z]+_\d+/)?.[0] ?? 'test');
    log.info(`=== START: ${testInfo.title} [${testInfo.project.name}]`);
    await use(log);
    log.info(`=== END: ${testInfo.status?.toUpperCase()} in ${testInfo.duration} ms`);
    await testInfo.attach('test-log.txt', { body: log.content, contentType: 'text/plain' });
  },

  // Screenshot on failure, saved to ./screenshots/<TC>_<project>_<time>.png and attached to the report.
  // (playwright.config also keeps its own screenshot, video and trace for failed tests.)
  page: async ({ page, log }, use, testInfo) => {
    page.on('pageerror', err => log.warn(`Browser JS error: ${err.message}`));
    page.on('response', res => { if (res.status() >= 400 && res.url().includes('/api/')) log.warn(`HTTP ${res.status()} ${res.request().method()} ${res.url()}`); });
    await use(page);
    if (testInfo.status !== testInfo.expectedStatus) {
      const dir = path.resolve(process.cwd(), 'screenshots');
      fs.mkdirSync(dir, { recursive: true });
      const id = testInfo.title.match(/TC_[A-Z]+_\d+/)?.[0] ?? 'test';
      const file = path.join(dir, `${id}_${testInfo.project.name}_${Date.now()}.png`);
      try {
        await page.screenshot({ path: file, fullPage: true });
        await testInfo.attach('failure-screenshot', { path: file, contentType: 'image/png' });
        log.error(`FAILED - screenshot saved: ${path.relative(process.cwd(), file)}`);
      } catch (e) {
        log.error(`Could not capture screenshot: ${(e as Error).message}`);
      }
      if (testInfo.error?.message) log.error(testInfo.error.message.split('\n')[0]);
    }
  },

  api: async ({ request, log }, use) => { await use(new MovieApi(request, log)); },
  homePage: async ({ page, log }, use) => { await use(new HomePage(page, log)); },
  signInPage: async ({ page, log }, use) => { await use(new SignInPage(page, log)); },
  signUpPage: async ({ page, log }, use) => { await use(new SignUpPage(page, log)); },
  detailPage: async ({ page, log }, use) => { await use(new MovieDetailPage(page, log)); },
  purchasePage: async ({ page, log }, use) => { await use(new PurchasePage(page, log)); },
  accountPage: async ({ page, log }, use) => { await use(new AccountPage(page, log)); },

  registeredUser: async ({ api }, use) => {
    const user = buildUser();
    await api.register(user);
    await use(user);
  },

  loggedIn: async ({ page, api, registeredUser }, use) => {
    const session = await api.login(registeredUser.taiKhoan, registeredUser.matKhau);
    await injectSession(page, session);
    await use({ user: registeredUser, session });
  },
});

export { expect };

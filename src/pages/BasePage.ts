import { Page, expect } from '@playwright/test';
import { Logger } from '../utils/logger';
import { Header } from './components/Header';
import { SweetAlert } from './components/SweetAlert';

/** Shared behaviour for all pages: navigation, header, popups, broken-image check. */
export abstract class BasePage {
  readonly header: Header;
  readonly alert: SweetAlert;
  protected abstract readonly path: string;

  constructor(readonly page: Page, protected readonly log: Logger) {
    this.header = new Header(page, log);
    this.alert = new SweetAlert(page, log);
  }

  async open(pathOverride?: string) {
    const target = pathOverride ?? this.path;
    this.log.step(`Open ${target}`);
    await this.page.goto(target, { waitUntil: 'domcontentloaded' });
  }

  async expectUrl(pathOrRegex: string | RegExp) {
    await expect(this.page).toHaveURL(typeof pathOrRegex === 'string' ? new RegExp(`${pathOrRegex.replace(/[/]/g, '\\/')}$`) : pathOrRegex);
  }

  /** Returns src of every <img> that finished loading with no pixels (broken). */
  async brokenImages(): Promise<string[]> {
    await this.page.waitForLoadState('load');
    return this.page.evaluate(() =>
      Array.from(document.images)
        .filter(i => i.complete && i.naturalWidth === 0 && !!i.getAttribute('src'))
        .map(i => i.getAttribute('src') as string),
    );
  }

  async localStorageItem(key: string): Promise<string | null> {
    return this.page.evaluate(k => window.localStorage.getItem(k), key);
  }
}

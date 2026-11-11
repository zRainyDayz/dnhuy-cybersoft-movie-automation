import { Locator, Page, expect } from '@playwright/test';
import { Logger } from '../../utils/logger';

/** SweetAlert2 popup used for every confirmation / success / error message on the site. */
export class SweetAlert {
  readonly popup: Locator;
  readonly title: Locator;
  readonly text: Locator;
  readonly confirmBtn: Locator;
  readonly denyBtn: Locator;
  readonly cancelBtn: Locator;

  constructor(private readonly page: Page, private readonly log: Logger) {
    this.popup = page.locator('.swal2-popup');
    this.title = page.locator('#swal2-title');
    this.text = page.locator('#swal2-content, .swal2-html-container');
    this.confirmBtn = page.locator('.swal2-confirm');
    this.denyBtn = page.locator('.swal2-deny');
    this.cancelBtn = page.locator('.swal2-cancel');
  }

  async expectTitle(expected: string | RegExp) {
    this.log.step(`Expect popup title "${expected}"`);
    await expect(this.popup).toBeVisible();
    await expect(this.title).toHaveText(expected);
  }

  async confirm() { this.log.step('Popup: click confirm'); await this.confirmBtn.click(); }
  async deny() { this.log.step('Popup: click deny'); await this.denyBtn.click(); }
  async cancel() { this.log.step('Popup: click cancel'); await this.cancelBtn.click(); }
  async expectHidden() { await expect(this.popup).toBeHidden(); }
}

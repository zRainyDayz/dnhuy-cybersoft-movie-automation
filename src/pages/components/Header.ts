import { Locator, Page, expect } from '@playwright/test';
import { Logger } from '../../utils/logger';

export type NavItem = 'Lịch Chiếu' | 'Cụm Rạp' | 'Tin Tức' | 'Ứng Dụng';

export class Header {
  readonly root: Locator;
  readonly logo: Locator;
  readonly signInLink: Locator;
  readonly signUpLink: Locator;
  readonly accountLink: Locator;
  readonly logoutLink: Locator;

  constructor(private readonly page: Page, private readonly log: Logger) {
    this.root = page.locator('header');
    this.logo = this.root.locator('img[alt="Logo"]').first();
    this.signInLink = this.root.locator('a[href="/sign-in"]');
    this.signUpLink = this.root.locator('a[href="/sign-up"]');
    this.accountLink = this.root.locator('a[href="/account"]');
    this.logoutLink = this.root.locator('a', { hasText: 'Đăng xuất' });
  }

  navLink(item: NavItem): Locator {
    return this.root.locator('a', { hasText: item }).first();
  }

  async clickNav(item: NavItem) {
    this.log.step(`Header: click "${item}"`);
    await this.navLink(item).click();
  }

  async goToSignIn() { this.log.step('Header: click Đăng Nhập'); await this.signInLink.click(); }
  async goToSignUp() { this.log.step('Header: click Đăng Ký'); await this.signUpLink.click(); }
  async openAccount() { this.log.step('Header: open account'); await this.accountLink.click(); }
  async clickLogout() { this.log.step('Header: click Đăng xuất'); await this.logoutLink.click(); }

  async expectLoggedOut() {
    await expect(this.signInLink).toBeVisible();
    await expect(this.signUpLink).toBeVisible();
    await expect(this.accountLink).toHaveCount(0);
  }

  async expectLoggedInAs(hoTen: string) {
    await expect(this.accountLink).toContainText(hoTen);
    await expect(this.logoutLink).toBeVisible();
  }
}

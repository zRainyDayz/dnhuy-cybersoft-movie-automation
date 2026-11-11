import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignInPage extends BasePage {
  protected readonly path = '/sign-in';

  readonly username: Locator = this.page.locator('#taiKhoan');
  readonly password: Locator = this.page.locator('#matKhau');
  readonly rememberMe: Locator = this.page.locator('input[name="remember"]');
  readonly submitBtn: Locator = this.page.locator('form button[type="submit"]');
  readonly passwordToggle: Locator = this.page.locator('#matKhau').locator('xpath=ancestor::div[contains(@class,"MuiInputBase-root")]//button');
  readonly errorAlert: Locator = this.page.locator('.MuiAlert-standardError');
  readonly signUpLink: Locator = this.page.locator('form a[href="/sign-up"]');

  helperText(field: 'taiKhoan' | 'matKhau'): Locator {
    return this.page.locator(`#${field}-helper-text`);
  }

  async fill(taiKhoan: string, matKhau: string) {
    this.log.step(`Fill sign-in: user="${taiKhoan}"`);
    await this.username.fill(taiKhoan);
    await this.password.fill(matKhau);
  }

  async submit() { this.log.step('Click ĐĂNG NHẬP'); await this.submitBtn.click(); }

  async login(taiKhoan: string, matKhau: string, remember = false) {
    await this.fill(taiKhoan, matKhau);
    if (remember) await this.rememberMe.check();
    await this.submit();
  }

  /** Focus then leave each field so react-hook-form (mode: onBlur) validates it. */
  async touchAll() {
    this.log.step('Touch all sign-in fields');
    await this.username.click();
    await this.password.click();
    await this.username.click();
  }

  async expectFieldError(field: 'taiKhoan' | 'matKhau', message: string) {
    await expect(this.helperText(field)).toHaveText(message);
  }
}

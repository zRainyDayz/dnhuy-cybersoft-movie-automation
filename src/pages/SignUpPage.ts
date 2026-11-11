import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { TestUser } from '../data/testData';

export type SignUpField = 'taiKhoan' | 'matKhau' | 'confirmPassWord' | 'hoTen' | 'email';
export const SIGN_UP_FIELDS: SignUpField[] = ['taiKhoan', 'matKhau', 'confirmPassWord', 'hoTen', 'email'];

export class SignUpPage extends BasePage {
  protected readonly path = '/sign-up';

  readonly submitBtn: Locator = this.page.locator('form button[type="submit"]');
  readonly signInLink: Locator = this.page.locator('form a[href="/sign-in"]');
  readonly errorAlert: Locator = this.page.locator('.MuiAlert-standardError');

  field(name: SignUpField): Locator { return this.page.locator(`#${name}`); }
  helperText(name: SignUpField): Locator { return this.page.locator(`#${name}-helper-text`); }
  passwordToggle(name: 'matKhau' | 'confirmPassWord'): Locator {
    return this.field(name).locator('xpath=ancestor::div[contains(@class,"MuiInputBase-root")]//button');
  }

  async fillForm(data: Partial<Record<SignUpField, string>>) {
    for (const name of SIGN_UP_FIELDS) {
      const value = data[name];
      if (value === undefined) continue;
      this.log.step(`Fill ${name} = "${name.toLowerCase().includes('khau') || name === 'confirmPassWord' ? '******' : value}"`);
      await this.field(name).fill(value);
    }
  }

  async register(user: TestUser) {
    await this.fillForm({ taiKhoan: user.taiKhoan, matKhau: user.matKhau, confirmPassWord: user.matKhau, hoTen: user.hoTen, email: user.email });
    await this.submit();
  }

  async submit() { this.log.step('Click ĐĂNG KÝ'); await this.submitBtn.click(); }

  /** Focus every field once, then move focus away, to trigger on-blur validation. */
  async touchAll() {
    this.log.step('Touch all sign-up fields');
    for (const name of SIGN_UP_FIELDS) await this.field(name).click();
    await this.field('taiKhoan').click();
  }

  /** Leave the given field (blur) to trigger its validation. */
  async blur(name: SignUpField) {
    const other = name === 'taiKhoan' ? 'hoTen' : 'taiKhoan';
    await this.field(other).click();
  }

  async expectFieldError(name: SignUpField, message: string) {
    await expect(this.helperText(name)).toHaveText(message);
  }

  async expectFieldValid(name: SignUpField) {
    await expect(this.field(name)).toHaveAttribute('aria-invalid', 'false');
  }
}

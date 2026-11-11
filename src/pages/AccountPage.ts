import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type AccountField = 'taiKhoan' | 'matKhau' | 'hoTen' | 'email' | 'soDt';

export class AccountPage extends BasePage {
  protected readonly path = '/account';

  readonly heading: Locator = this.page.getByText('Cài đặt tài khoản chung');
  readonly roleSelect: Locator = this.page.locator('select[name="maLoaiNguoiDung"]');
  readonly updateBtn: Locator = this.page.getByRole('button', { name: 'Cập Nhật' });
  readonly historyHeading: Locator = this.page.getByText('Lịch sử đặt vé');
  readonly historyItems: Locator = this.page.locator('h3', { hasText: 'Ngày đặt:' });

  field(name: AccountField): Locator { return this.page.locator(`#${name}`); }
  helperText(name: AccountField): Locator { return this.page.locator(`#${name}-helper-text`); }

  /** The booking-history block is always rendered for a logged-in customer. */
  async waitLoaded() {
    await expect(this.historyHeading).toBeVisible({ timeout: 15_000 });
  }

  /**
   * The profile form only renders when the app finds the user by searching for their
   * FULL NAME (TimKiemNguoiDung?tuKhoa=<hoTen>) and then shows the first match.
   * For a new customer it often does not appear at all (BUG-18).
   */
  async waitProfileForm() {
    await expect(this.heading).toBeVisible({ timeout: 15_000 });
    await expect(this.field('taiKhoan')).not.toHaveValue('', { timeout: 15_000 });
  }

  async update(values: Partial<Record<AccountField, string>>) {
    for (const [k, v] of Object.entries(values)) {
      this.log.step(`Account: set ${k}`);
      await this.field(k as AccountField).fill(v as string);
    }
    this.log.step('Click Cập Nhật');
    await this.updateBtn.click();
  }

  /** History card containing the given movie name and seat number. */
  historyCard(tenPhim: string, tenGhe: string): Locator {
    return this.page.locator('.MuiGrid-container')
      .filter({ hasText: `Tên phim: ${tenPhim}` })
      .filter({ hasText: new RegExp(`Ghế số:.*\\b${tenGhe}\\b`) });
  }
}

import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type InfoLabel = 'Cụm Rạp' | 'Địa chỉ' | 'Rạp' | 'Ngày giờ chiếu' | 'Tên Phim' | 'Chọn';

export class PurchasePage extends BasePage {
  protected readonly path = '/purchase';

  /**
   * Every seat button (free ones show their number, booked ones show "X").
   * The legend also contains a sample "X" button followed by <p>Đã đặt</p>, so buttons
   * that are directly followed by a <p> are excluded.
   */
  private readonly seatButtons: Locator = this.page.locator('button:not(:has(+ p))');
  readonly allSeats: Locator = this.seatButtons.filter({ hasText: /^(\d{1,3}|X)$/ });
  readonly freeSeats: Locator = this.page.locator('button:not([disabled]):not(:has(+ p))').filter({ hasText: /^\d{1,3}$/ });
  readonly bookedSeats: Locator = this.seatButtons.filter({ hasText: /^X$/ });
  readonly bookBtn: Locator = this.page.getByRole('button', { name: 'ĐẶT VÉ' });
  readonly total: Locator = this.page.locator('p').filter({ hasText: /^[\d.,]+\s*VND$/ });
  readonly legend: Locator = this.page.locator('p').filter({ hasText: /^(Đã đặt|Thường|Vip)$/ });

  async openShowtime(maLichChieu: number) {
    await this.open(`/purchase/${maLichChieu}`);
    await expect(this.allSeats.first()).toBeVisible({ timeout: 20_000 });
  }

  seat(tenGhe: string): Locator {
    return this.page.locator('button').filter({ hasText: new RegExp(`^${tenGhe}$`) }).first();
  }

  async toggleSeat(tenGhe: string) {
    this.log.step(`Toggle seat ${tenGhe}`);
    await this.seat(tenGhe).click();
  }

  async clickBook() { this.log.step('Click ĐẶT VÉ'); await this.bookBtn.click(); }

  /** Value shown next to a label in the right-hand info panel. */
  info(label: InfoLabel): Locator {
    return this.page.locator('h3', { hasText: new RegExp(`^${label}:\\s*$`) }).locator('xpath=following-sibling::*[1]');
  }

  async totalAmount(): Promise<number> {
    const text = (await this.total.innerText()).replace(/[^\d]/g, '');
    return Number(text);
  }

  /** Background colour of a seat, read with the mouse moved away so the hover shade does not interfere. */
  async seatBackground(tenGhe: string): Promise<string> {
    await this.page.mouse.move(0, 0);
    await this.page.waitForTimeout(400); // let the hover transition finish
    return this.seat(tenGhe).evaluate(el => getComputedStyle(el).backgroundColor);
  }
}

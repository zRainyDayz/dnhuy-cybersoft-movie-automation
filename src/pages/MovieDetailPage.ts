import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MovieDetailPage extends BasePage {
  protected readonly path = '/detail';

  readonly buyTicketLink: Locator = this.page.getByText('Mua vé', { exact: true });
  readonly cinemaSystemTabs: Locator = this.page.getByRole('tab');
  readonly showtimeLinks: Locator = this.page.locator('a[href^="/purchase/"]');
  readonly ratingCircle: Locator = this.page.locator('.MuiCircularProgress-root').first();

  async openMovie(maPhim: number) { await this.open(`/detail/${maPhim}`); }

  showtimeLink(maLichChieu: number): Locator {
    return this.page.locator(`a[href="/purchase/${maLichChieu}"]`);
  }

  title(name: string): Locator { return this.page.getByText(name, { exact: true }).first(); }

  async selectCinemaSystem(index: number) {
    this.log.step(`Detail: select cinema system tab #${index}`);
    await this.cinemaSystemTabs.nth(index).click();
  }

  /** Visible showtime text, e.g. "09-10-2021 ~ 02:40" -> { date: '09-10-2021', time: '02:40' }. */
  async showtimeText(maLichChieu: number): Promise<{ date: string; time: string }> {
    const raw = (await this.showtimeLink(maLichChieu).innerText()).replace(/\s+/g, ' ').trim();
    const m = raw.match(/(\d{2}-\d{2}-\d{4})\s*~\s*(\d{2}:\d{2})/);
    return { date: m?.[1] ?? '', time: m?.[2] ?? '' };
  }
}

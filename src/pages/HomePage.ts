import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type HomeSection = 'lichChieu' | 'cumRap' | 'tinTuc' | 'ungDung';

export class HomePage extends BasePage {
  protected readonly path = '/';

  // Quick booking bar (desktop)
  readonly filmSelect: Locator = this.page.locator('select[name="film"]');
  readonly cinemaSelect: Locator = this.page.locator('select[name="cinema"]');
  readonly dateSelect: Locator = this.page.locator('select[name="date"]');
  readonly buyNowBtn: Locator = this.page.getByRole('button', { name: 'MUA VÉ NGAY' });

  // Movie list
  readonly movieCards: Locator = this.page.locator('#lichChieu a[href^="/detail/"]');
  readonly trailerModal: Locator = this.page.locator('.modal-video');
  readonly trailerIframe: Locator = this.page.locator('.modal-video iframe');
  readonly trailerClose: Locator = this.page.locator('.modal-video-close-btn');

  // Cinema section
  readonly tabs: Locator = this.page.getByRole('tab');
  readonly showtimeLinks: Locator = this.page.locator('a[href^="/purchase/"]');

  // News section
  readonly toggleNewsBtn: Locator = this.page.getByRole('button', { name: /XEM THÊM|RÚT GỌN/ });

  // Footer
  readonly footer: Locator = this.page.locator('footer');

  // Mobile only
  readonly searchBox: Locator = this.page.getByPlaceholder('Tìm kiếm phim');
  readonly mobileBuyLinks: Locator = this.page.getByRole('link', { name: 'MUA VÉ', exact: true });

  section(id: HomeSection): Locator { return this.page.locator(`#${id}`); }

  async waitForMovies() {
    await expect(this.movieCards.first()).toBeVisible({ timeout: 20_000 });
  }

  card(maPhim: number): Locator { return this.page.locator(`a[href="/detail/${maPhim}"]`).first(); }

  async openMovie(maPhim: number) {
    this.log.step(`Open movie card ${maPhim}`);
    await this.card(maPhim).click();
  }

  async playTrailer(maPhim: number) {
    this.log.step(`Play trailer of movie ${maPhim}`);
    await this.card(maPhim).hover();
    await this.card(maPhim).locator('button.MuiFab-root').click();
  }

  async selectFilm(maPhim: number | string) {
    this.log.step(`Quick booking: select film ${maPhim}`);
    await this.filmSelect.selectOption(String(maPhim));
  }

  async selectCinema(slug: string) {
    this.log.step(`Quick booking: select cinema ${slug}`);
    await expect(this.cinemaSelect.locator(`option[value="${slug}"]`)).toHaveCount(1);
    await this.cinemaSelect.selectOption(slug);
  }

  async selectShowtime(maLichChieu: number | string) {
    this.log.step(`Quick booking: select showtime ${maLichChieu}`);
    await expect(this.dateSelect.locator(`option[value="${maLichChieu}"]`)).toHaveCount(1);
    await this.dateSelect.selectOption(String(maLichChieu));
  }

  async clickBuyNow() { this.log.step('Click MUA VÉ NGAY'); await this.buyNowBtn.click(); }

  async optionValues(select: Locator): Promise<string[]> {
    return select.locator('option').evaluateAll(opts => opts.map(o => (o as HTMLOptionElement).value).filter(Boolean));
  }

  cinemaSystemTab(logoKeyword: string): Locator {
    return this.tabs.filter({ has: this.page.locator(`img[src*="${logoKeyword}"]`) });
  }

  branchTabs(prefix: string): Locator {
    return this.tabs.filter({ hasText: new RegExp(`^${prefix}`, 'i') });
  }

  newsTab(name: 'Điện Ảnh 24h' | 'Review' | 'Khuyến mãi'): Locator {
    return this.page.getByRole('tab', { name, exact: true });
  }

  footerLink(text: string): Locator { return this.footer.locator('a', { hasText: text }).first(); }

  async search(keyword: string) {
    this.log.step(`Mobile search "${keyword}"`);
    await this.searchBox.fill(keyword);
    await this.searchBox.press('Enter');
  }
}

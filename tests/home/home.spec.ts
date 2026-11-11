import { test, expect } from '../../src/fixtures/test-fixtures';
import { MSG, REF } from '../../src/data/testData';

test.describe('US03 - Home page & movie list', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
    await homePage.waitForMovies();
  });

  test('TC_HOME_01 @smoke Home page shows header, booking bar, movies, cinemas, news and footer', async ({ homePage }) => {
    for (const item of ['Lịch Chiếu', 'Cụm Rạp', 'Tin Tức', 'Ứng Dụng'] as const)
      await expect(homePage.header.navLink(item)).toBeVisible();
    await homePage.header.expectLoggedOut();
    await expect(homePage.filmSelect).toBeVisible();
    await expect(homePage.buyNowBtn).toBeVisible();
    for (const s of ['lichChieu', 'cumRap', 'tinTuc', 'ungDung'] as const) await expect(homePage.section(s)).toBeAttached();
    await expect(homePage.footer).toBeVisible();
  });

  test('TC_HOME_02 Movie cards link to their detail page', async ({ homePage, api }) => {
    const movies = await api.movies();
    expect(await homePage.movieCards.count()).toBeGreaterThan(0);
    const href = await homePage.movieCards.first().getAttribute('href');
    expect(href).toMatch(/^\/detail\/\d+$/);
    const id = Number(href!.split('/').pop());
    expect(movies.map(m => m.maPhim)).toContain(id);
  });

  test('TC_HOME_04 Trailer opens in a video modal and closes', async ({ homePage }) => {
    await homePage.playTrailer(REF.movie.id);
    await expect(homePage.trailerModal).toBeVisible();
    await expect(homePage.trailerIframe).toHaveAttribute('src', /youtube\.com\/embed\//);
    await homePage.trailerClose.click();
    await expect(homePage.trailerModal).toHaveCount(0);
    await homePage.expectUrl('/');
  });

  test('TC_HOME_05 Header "Cụm Rạp" scrolls to the cinema section', async ({ homePage }) => {
    await homePage.header.clickNav('Cụm Rạp');
    await expect.poll(() => homePage.page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
  });

  test('TC_HOME_06 News tabs switch between Điện Ảnh 24h / Review / Khuyến mãi', async ({ homePage }) => {
    for (const name of ['Review', 'Khuyến mãi', 'Điện Ảnh 24h'] as const) {
      await homePage.newsTab(name).click();
      await expect(homePage.newsTab(name)).toHaveAttribute('aria-selected', 'true');
    }
  });

  test('TC_HOME_07 "XEM THÊM" / "RÚT GỌN" toggles the news list', async ({ homePage }) => {
    const btn = homePage.toggleNewsBtn;
    const before = (await btn.innerText()).trim();
    await btn.click();
    await expect(btn).not.toHaveText(before);
    await btn.click();
    await expect(btn).toHaveText(before);
  });

  test('TC_HOME_08 @bug No broken images on the home page', async ({ homePage }) => {
    await homePage.section('tinTuc').scrollIntoViewIfNeeded();
    const broken = await homePage.brokenImages();
    expect(broken, `Broken images: ${broken.join(', ')}`).toEqual([]);
  });

  test('TC_HOME_10 @bug Footer policy links point to a real page', async ({ homePage }) => {
    for (const text of ['FAQ', 'Thỏa thuận sử dụng', 'Chính sách bảo mật']) {
      const href = await homePage.footerLink(text).getAttribute('href');
      expect(href, `footer link "${text}"`).toBeTruthy();
    }
  });

  test('TC_HOME_12 Logo in header returns to home page', async ({ homePage, page }) => {
    await page.goto('/sign-in');
    await homePage.header.logo.click();
    await homePage.expectUrl('/');
  });

  test('TC_HOME_13 Unknown route shows 404 page', async ({ page }) => {
    await page.goto('/khong-ton-tai');
    await expect(page.getByText(MSG.notFound)).toBeVisible();
  });
});

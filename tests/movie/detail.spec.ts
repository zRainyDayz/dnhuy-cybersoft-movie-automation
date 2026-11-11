import { test, expect } from '../../src/fixtures/test-fixtures';
import { REF } from '../../src/data/testData';

test.describe('US04 - Movie detail & showtimes', () => {
  test('TC_DET_01 @smoke Clicking a movie card opens its detail page', async ({ homePage, detailPage }) => {
    await homePage.open();
    await homePage.waitForMovies();
    await homePage.openMovie(REF.movie.id);
    await detailPage.expectUrl(`/detail/${REF.movie.id}`);
    await expect(detailPage.title(REF.movie.name)).toBeVisible();
    await expect(detailPage.buyTicketLink).toBeVisible();
    await expect(detailPage.page.getByText(/\d+\s*phút/)).toBeVisible();
  });

  test('TC_DET_02 Cinema system tabs show that system\'s showtimes', async ({ detailPage, api }) => {
    const data = await api.showtimesOfMovie(REF.movie.id);
    await detailPage.openMovie(REF.movie.id);
    await expect(detailPage.cinemaSystemTabs).toHaveCount(data.heThongRapChieu.length);
    for (let i = 0; i < data.heThongRapChieu.length; i++) {
      await detailPage.selectCinemaSystem(i);
      const firstShow = data.heThongRapChieu[i].cumRapChieu[0].lichChieuPhim[0].maLichChieu;
      await expect(detailPage.showtimeLink(Number(firstShow))).toBeVisible();
    }
  });

  test('TC_DET_03 Clicking a showtime opens the booking page', async ({ detailPage }) => {
    await detailPage.openMovie(REF.movie.id);
    await detailPage.showtimeLink(REF.movie.showtimeId).click();
    await detailPage.expectUrl(`/purchase/${REF.movie.showtimeId}`);
  });

  test('TC_DET_04 @bug Showtime on detail page equals showtime on booking page', async ({ detailPage, purchasePage }) => {
    await detailPage.openMovie(REF.movie.id);
    const shown = await detailPage.showtimeText(REF.movie.showtimeId);
    await purchasePage.openShowtime(REF.movie.showtimeId);
    const onBooking = (await purchasePage.info('Ngày giờ chiếu').innerText()).replace(/\s+/g, '');
    // Detail shows "02:40" but booking page shows "-02:10" (BUG-01: hh:MM month instead of HH:mm minutes)
    expect(onBooking).toContain(shown.time);
  });

  test('TC_DET_06 @bug Invalid movie id shows a not-found message', async ({ detailPage, page }) => {
    await detailPage.openMovie(REF.invalidMovieId);
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/không tìm thấy|not found|404/i)).toBeVisible({ timeout: 5_000 });
  });

  test('TC_DET_07 @bug Header logo image loads on the detail page', async ({ detailPage }) => {
    await detailPage.openMovie(REF.movie.id);
    await expect(detailPage.header.logo).toBeVisible();
    const ok = await detailPage.header.logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    expect(ok, `logo src resolves to ${await detailPage.header.logo.evaluate((i: HTMLImageElement) => i.src)}`).toBeTruthy();
  });
});

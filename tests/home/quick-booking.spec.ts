import { test, expect } from '../../src/fixtures/test-fixtures';
import { MSG, REF } from '../../src/data/testData';

test.describe('US06 - Quick booking bar (Phim → Rạp → Ngày giờ chiếu)', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
    await homePage.waitForMovies();
  });

  test('TC_QB_01 Film dropdown lists every movie of the group', async ({ homePage, api }) => {
    const apiIds = (await api.movies()).map(m => String(m.maPhim)).sort();
    await expect.poll(async () => (await homePage.optionValues(homePage.filmSelect)).length).toBe(apiIds.length);
    expect((await homePage.optionValues(homePage.filmSelect)).sort()).toEqual(apiIds);
  });

  test('TC_QB_02 Selecting a film fills the cinema dropdown', async ({ homePage }) => {
    expect(await homePage.optionValues(homePage.cinemaSelect)).toEqual([]);
    await homePage.selectFilm(REF.movie.id);
    await expect(homePage.cinemaSelect.locator(`option[value="${REF.movie.cinemaSlug}"]`)).toHaveCount(1);
  });

  test('TC_QB_03 Selecting a cinema fills the showtime dropdown', async ({ homePage }) => {
    await homePage.selectFilm(REF.movie.id);
    await homePage.selectCinema(REF.movie.cinemaSlug);
    await expect(homePage.dateSelect.locator(`option[value="${REF.movie.showtimeId}"]`)).toHaveCount(1);
  });

  test('TC_QB_04 @smoke Full selection + MUA VÉ NGAY opens the booking page', async ({ homePage }) => {
    await homePage.selectFilm(REF.movie.id);
    await homePage.selectCinema(REF.movie.cinemaSlug);
    await homePage.selectShowtime(REF.movie.showtimeId);
    await homePage.clickBuyNow();
    await homePage.expectUrl(`/purchase/${REF.movie.showtimeId}`);
  });

  test('TC_QB_05 MUA VÉ NGAY without a film asks to choose a film', async ({ homePage }) => {
    await homePage.clickBuyNow();
    await homePage.alert.expectTitle(MSG.noFilm);
    await homePage.expectUrl('/');
  });

  test('TC_QB_06 MUA VÉ NGAY without a cinema asks to choose a cinema', async ({ homePage }) => {
    await homePage.selectFilm(REF.movie.id);
    await homePage.clickBuyNow();
    await homePage.alert.expectTitle(MSG.noCinema);
  });

  test('TC_QB_07 MUA VÉ NGAY without a showtime asks to choose a showtime', async ({ homePage }) => {
    await homePage.selectFilm(REF.movie.id);
    await homePage.selectCinema(REF.movie.cinemaSlug);
    await homePage.clickBuyNow();
    await homePage.alert.expectTitle(MSG.noShowtime);
  });
});

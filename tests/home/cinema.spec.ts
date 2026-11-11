import { test, expect } from '../../src/fixtures/test-fixtures';
import { REF } from '../../src/data/testData';

test.describe('US05 - Showtimes by cinema system (Cụm Rạp)', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
    await homePage.waitForMovies();
    await homePage.header.clickNav('Cụm Rạp');
  });

  test('TC_CIN_01 The 6 cinema system logos are listed', async ({ homePage }) => {
    for (const logo of REF.cinemaSystems) await expect(homePage.cinemaSystemTab(logo)).toHaveCount(1);
  });

  test('TC_CIN_02 Selecting a cinema system lists its branches', async ({ homePage }) => {
    await homePage.cinemaSystemTab('cgv').click();
    await expect(homePage.cinemaSystemTab('cgv')).toHaveAttribute('aria-selected', 'true');
    await expect(homePage.branchTabs('CGV - ').first()).toBeVisible();
    await expect(homePage.branchTabs('BHD STAR')).toHaveCount(0);
  });

  test('TC_CIN_03 @smoke Branch showtimes link to the booking page', async ({ homePage }) => {
    await homePage.cinemaSystemTab('bhd-star').click();
    await homePage.branchTabs('BHD STAR CINEPLEX - ').first().click();
    const link = homePage.showtimeLinks.first();
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^\/purchase\/\d+$/);
    await link.click();
    await homePage.expectUrl(href!);
  });
});

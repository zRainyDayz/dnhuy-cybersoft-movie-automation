import { test, expect } from '../../src/fixtures/test-fixtures';
import { MSG, REF } from '../../src/data/testData';

// Runs only in the "mobile" project (Pixel 5 viewport) – see playwright.config.ts
test.describe('US09 - Mobile layout & movie search', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
    await expect(homePage.searchBox).toBeVisible({ timeout: 20_000 });
    await expect(homePage.mobileBuyLinks.first()).toBeVisible();
  });

  test('TC_MOB_01 Mobile shows a search box instead of the quick booking bar', async ({ homePage }) => {
    await expect(homePage.filmSelect).toHaveCount(0);
    const overflow = await homePage.page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow, 'horizontal scroll on mobile').toBeFalsy();
  });

  test('TC_MOB_02 @smoke Search by name returns the matching movie (case-insensitive)', async ({ homePage }) => {
    await homePage.search(REF.searchKeyword);
    await expect(homePage.mobileBuyLinks).toHaveCount(1);
    await expect(homePage.mobileBuyLinks.first()).toHaveAttribute('href', `/detail/${REF.searchExpectedId}`);
  });

  test('TC_MOB_03 Search without Vietnamese accents still matches', async ({ homePage }) => {
    await homePage.search(REF.searchNoAccent);
    await expect(homePage.mobileBuyLinks.first()).toHaveAttribute('href', `/detail/${REF.searchNoAccentExpectedId}`);
  });

  test('TC_MOB_04 Search with no match shows the empty message', async ({ homePage }) => {
    await homePage.search('zzzxxx-khong-co');
    await expect(homePage.page.getByText(MSG.searchNoResult)).toBeVisible();
    await expect(homePage.mobileBuyLinks).toHaveCount(0);
  });

  test('TC_MOB_05 Clearing the search restores the movie list', async ({ homePage }) => {
    const before = await homePage.mobileBuyLinks.count();
    await homePage.search(REF.searchKeyword);
    await expect(homePage.mobileBuyLinks).toHaveCount(1);
    await homePage.search('');
    await expect(homePage.mobileBuyLinks).toHaveCount(before);
  });
});

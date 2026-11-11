import { test, expect } from '../../src/fixtures/test-fixtures';
import { MSG } from '../../src/data/testData';

test.describe('US08 - Account info & booking history', () => {
  test('TC_ACC_01 @smoke Clicking the user name opens the account page', async ({ homePage, accountPage, loggedIn }) => {
    await homePage.open();
    await homePage.header.expectLoggedInAs(loggedIn.user.hoTen);
    await homePage.header.openAccount();
    await accountPage.expectUrl('/account');
    await accountPage.waitLoaded(); // "Lịch sử đặt vé" block
  });

  test('TC_ACC_09 @bug Account page shows the customer\'s own profile', async ({ accountPage, loggedIn }) => {
    await accountPage.open();
    // Expected: profile form with own data. Actual (BUG-18): for a new customer only "Lịch sử đặt vé" is shown,
    // because the app looks the profile up by searching for the full name and shows the first match.
    await accountPage.waitProfileForm();
    await expect(accountPage.field('taiKhoan')).toHaveValue(loggedIn.user.taiKhoan);
    await expect(accountPage.field('email')).toHaveValue(loggedIn.user.email);
  });

  test('TC_ACC_02 @bug Updating the full name succeeds and is saved (blocked by BUG-18)', async ({ accountPage, api, loggedIn }) => {
    await accountPage.open();
    await accountPage.waitProfileForm();
    const newName = 'Tran Thi Cap Nhat';
    await accountPage.update({ hoTen: newName });
    await accountPage.alert.expectTitle(MSG.updateSuccess);
    const info = await api.accountInfo(loggedIn.session.accessToken, loggedIn.user.taiKhoan);
    expect(info.hoTen).toBe(newName);
  });

  test('TC_ACC_05 Booked ticket appears in the booking history', async ({ api, purchasePage, accountPage, loggedIn }) => {
    void loggedIn;
    const map = await api.findShowtimeWithFreeSeats(5);
    const seat = map.danhSachGhe.find(s => !s.daDat && s.loaiGhe === 'Thuong')!;
    await purchasePage.openShowtime(map.thongTinPhim.maLichChieu);
    await purchasePage.toggleSeat(seat.tenGhe);
    await purchasePage.clickBook();
    await purchasePage.alert.expectTitle(MSG.bookingSuccess);
    await purchasePage.alert.confirm();
    await accountPage.open();
    await accountPage.waitLoaded();
    await expect(accountPage.historyCard(map.thongTinPhim.tenPhim, seat.tenGhe).first()).toBeVisible({ timeout: 15_000 });
  });

  test('TC_ACC_06 Guest opening /account is sent back to home', async ({ page }) => {
    await page.goto('/account');
    await expect(page).toHaveURL(/\/$/);
  });

  test('TC_ACC_07 Guest opening admin pages is sent back to home', async ({ page }) => {
    for (const p of ['/manage-user', '/manage-movie']) {
      await page.goto(p);
      await expect(page, p).toHaveURL(/\/$/);
    }
  });

  test('TC_ACC_08 Customer account cannot open admin pages', async ({ page, loggedIn }) => {
    void loggedIn;
    await page.goto('/');
    for (const p of ['/manage-user', '/manage-movie']) {
      await page.goto(p);
      await expect(page.getByText('Quản lí người dùng')).toHaveCount(0);
    }
  });
});

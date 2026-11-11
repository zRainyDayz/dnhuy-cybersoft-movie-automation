import { test, expect } from '../../src/fixtures/test-fixtures';
import { MSG, INVALID } from '../../src/data/testData';

test.describe('US02 - Login / Logout', () => {
  test('TC_LOG_01 @smoke Login with valid account redirects home and shows user name', async ({ signInPage, homePage, registeredUser }) => {
    await signInPage.open();
    await signInPage.login(registeredUser.taiKhoan, registeredUser.matKhau);
    await signInPage.alert.expectTitle(MSG.loginSuccess);
    await homePage.expectUrl('/');
    await homePage.header.expectLoggedInAs(registeredUser.hoTen);
  });

  test('TC_LOG_02 Empty username and password show required messages', async ({ signInPage }) => {
    await signInPage.open();
    await signInPage.touchAll();
    await signInPage.expectFieldError('taiKhoan', MSG.required);
    await signInPage.expectFieldError('matKhau', MSG.required);
  });

  test('TC_LOG_03 Password shorter than 6 characters shows message', async ({ signInPage }) => {
    await signInPage.open();
    await signInPage.password.fill(INVALID.shortPassword);
    await signInPage.username.click();
    await signInPage.expectFieldError('matKhau', MSG.passwordMin);
  });

  test('TC_LOG_04 Wrong password shows error and stays on sign-in', async ({ signInPage, registeredUser }) => {
    await signInPage.open();
    await signInPage.login(registeredUser.taiKhoan, INVALID.wrongPassword);
    await expect(signInPage.errorAlert).toBeVisible();
    await signInPage.expectUrl('/sign-in');
    expect(await signInPage.localStorageItem('currentUser')).toBeNull();
  });

  test('TC_LOG_05 Non-existent username shows error', async ({ signInPage }) => {
    await signInPage.open();
    await signInPage.login(`nouser${Date.now()}`, 'Whatever@123');
    await expect(signInPage.errorAlert).toBeVisible();
    await signInPage.expectUrl('/sign-in');
  });

  test('TC_LOG_06 Password show/hide toggle works', async ({ signInPage }) => {
    await signInPage.open();
    await signInPage.password.fill('Secret@1');
    await expect(signInPage.password).toHaveAttribute('type', 'password');
    await signInPage.passwordToggle.click();
    await expect(signInPage.password).toHaveAttribute('type', 'text');
    await signInPage.passwordToggle.click();
    await expect(signInPage.password).toHaveAttribute('type', 'password');
  });

  test('TC_LOG_07 "Nhớ tài khoản" pre-fills the username next time', async ({ signInPage, homePage, registeredUser }) => {
    await signInPage.open();
    await signInPage.login(registeredUser.taiKhoan, registeredUser.matKhau, true);
    await signInPage.alert.expectTitle(MSG.loginSuccess);
    await homePage.expectUrl('/');
    // end the session the same way logout does, then come back to the form
    await homePage.page.evaluate(() => window.localStorage.removeItem('currentUser'));
    await signInPage.open();
    await expect(signInPage.username).toHaveValue(registeredUser.taiKhoan);
    await expect(signInPage.rememberMe).toBeChecked();
  });

  test('TC_LOG_08 @bug "Nhớ tài khoản" must not store the password in plain text', async ({ signInPage, registeredUser }) => {
    await signInPage.open();
    await signInPage.login(registeredUser.taiKhoan, registeredUser.matKhau, true);
    await signInPage.alert.expectTitle(MSG.loginSuccess);
    const remembered = (await signInPage.localStorageItem('rememberUser')) ?? '';
    // Expected: no password in browser storage. Actual (BUG-08): {"taiKhoan":..,"matKhau":"<plain text>"}
    expect(remembered, 'localStorage.rememberUser').not.toContain(registeredUser.matKhau);
  });

  test('TC_LOG_09 @smoke Logout (confirm) clears the session', async ({ homePage, loggedIn }) => {
    await homePage.open();
    await homePage.header.expectLoggedInAs(loggedIn.user.hoTen);
    await homePage.header.clickLogout();
    await homePage.alert.expectTitle(MSG.logoutConfirm);
    await homePage.alert.confirm();
    await homePage.alert.expectTitle(MSG.logoutDone);
    await homePage.header.expectLoggedOut();
    expect(await homePage.localStorageItem('currentUser')).toBeNull();
  });

  test('TC_LOG_10 Logout cancelled keeps the user logged in', async ({ homePage, loggedIn }) => {
    await homePage.open();
    await homePage.header.clickLogout();
    await homePage.alert.expectTitle(MSG.logoutConfirm);
    await homePage.alert.cancel();
    await homePage.header.expectLoggedInAs(loggedIn.user.hoTen);
  });

  test('TC_LOG_11 "Chưa có tài khoản? Đăng ký" link opens sign-up', async ({ signInPage }) => {
    await signInPage.open();
    await signInPage.signUpLink.click();
    await signInPage.expectUrl('/sign-up');
  });

  test('TC_LOG_13 Session survives a page reload', async ({ homePage, loggedIn }) => {
    await homePage.open();
    await homePage.header.expectLoggedInAs(loggedIn.user.hoTen);
    await homePage.page.reload();
    await homePage.header.expectLoggedInAs(loggedIn.user.hoTen);
  });
});

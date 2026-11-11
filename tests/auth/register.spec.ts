import { test, expect } from '../../src/fixtures/test-fixtures';
import { MSG, INVALID, buildUser } from '../../src/data/testData';
import { SIGN_UP_FIELDS } from '../../src/pages/SignUpPage';

test.describe('US01 - Register account', () => {
  test.beforeEach(async ({ signUpPage }) => {
    await signUpPage.open();
    await expect(signUpPage.submitBtn).toBeVisible();
  });

  test('TC_REG_01 @smoke Register with valid data shows success', async ({ signUpPage }) => {
    const user = buildUser('reg');
    await signUpPage.register(user);
    await signUpPage.alert.expectTitle(MSG.registerSuccess);
  });

  test('TC_REG_02 Leaving all fields empty shows required message on each field', async ({ signUpPage }) => {
    await signUpPage.touchAll();
    for (const f of SIGN_UP_FIELDS) await signUpPage.expectFieldError(f, MSG.required);
  });

  test('TC_REG_03 Password shorter than 6 characters is rejected', async ({ signUpPage }) => {
    await signUpPage.fillForm({ matKhau: INVALID.shortPassword });
    await signUpPage.blur('matKhau');
    await signUpPage.expectFieldError('matKhau', MSG.passwordMin);
  });

  test('TC_REG_04 Confirm password must match password', async ({ signUpPage }) => {
    await signUpPage.fillForm({ matKhau: 'Valid@123', confirmPassWord: INVALID.mismatchConfirm });
    await signUpPage.blur('confirmPassWord');
    await signUpPage.expectFieldError('confirmPassWord', MSG.passwordMismatch);
  });

  test('TC_REG_05 Full name containing digits is rejected', async ({ signUpPage }) => {
    await signUpPage.fillForm({ hoTen: INVALID.nameWithDigits });
    await signUpPage.blur('hoTen');
    await signUpPage.expectFieldError('hoTen', MSG.nameNoDigits);
  });

  for (const [i, email] of ['abc', 'abc@'].entries()) {
    test(`TC_REG_0${6 + i} @bug Invalid email "${email}" is rejected`, async ({ signUpPage }) => {
      await signUpPage.fillForm({ email });
      await signUpPage.blur('email');
      // Expected: an error on the email field. Actual (BUG-03): field accepted, aria-invalid=false.
      await expect(signUpPage.field('email')).toHaveAttribute('aria-invalid', 'true');
    });
  }

  test('TC_REG_08 Registering an existing username shows an error', async ({ signUpPage, registeredUser }) => {
    await signUpPage.register({ ...buildUser('dup'), taiKhoan: registeredUser.taiKhoan });
    // The API rejects the duplicate; the app must not report success
    await expect(signUpPage.page.getByText(MSG.registerSuccess)).toHaveCount(0);
    await expect(signUpPage.errorAlert.or(signUpPage.alert.popup)).toBeVisible();
  });

  test('TC_REG_10 Password show/hide toggle works on sign-up', async ({ signUpPage }) => {
    const pw = signUpPage.field('matKhau');
    await pw.fill('Secret@1');
    await expect(pw).toHaveAttribute('type', 'password');
    await signUpPage.passwordToggle('matKhau').click();
    await expect(pw).toHaveAttribute('type', 'text');
    await signUpPage.passwordToggle('matKhau').click();
    await expect(pw).toHaveAttribute('type', 'password');
  });

  test('TC_REG_11 "Đã có tài khoản? Đăng nhập" link opens sign-in', async ({ signUpPage }) => {
    await signUpPage.signInLink.click();
    await signUpPage.expectUrl('/sign-in');
  });
});

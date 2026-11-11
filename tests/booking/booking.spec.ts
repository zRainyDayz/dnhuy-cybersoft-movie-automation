import { test, expect } from '../../src/fixtures/test-fixtures';
import { MSG, PRICE, REF } from '../../src/data/testData';
import type { SeatMap, Seat } from '../../src/api/MovieApi';

const GREEN = 'rgb(0, 128, 0)';

test.describe('US07 - Seat selection & booking', () => {
  let map: SeatMap;
  let normal: Seat[];
  let vip: Seat[];

  test.beforeEach(async ({ api, purchasePage }) => {
    map = await api.findShowtimeWithFreeSeats(5);
    const free = map.danhSachGhe.filter(s => !s.daDat);
    normal = free.filter(s => s.loaiGhe === 'Thuong');
    vip = free.filter(s => s.loaiGhe === 'Vip');
    await purchasePage.openShowtime(map.thongTinPhim.maLichChieu);
  });

  test('TC_BOOK_01 @smoke Booking page shows seat map, legend and showtime info', async ({ purchasePage }) => {
    await expect(purchasePage.allSeats).toHaveCount(map.danhSachGhe.length);
    await expect(purchasePage.legend).toHaveCount(3);
    await expect(purchasePage.info('Cụm Rạp')).toHaveText(map.thongTinPhim.tenCumRap);
    await expect(purchasePage.info('Rạp')).toHaveText(map.thongTinPhim.tenRap);
    await expect(purchasePage.info('Tên Phim')).toHaveText(map.thongTinPhim.tenPhim);
    await expect(purchasePage.info('Ngày giờ chiếu')).toContainText(map.thongTinPhim.ngayChieu);
    await expect(purchasePage.bookBtn).toBeVisible();
    expect(await purchasePage.totalAmount()).toBe(0);
  });

  test('TC_BOOK_02 Booked seats are shown as "X" and disabled', async ({ purchasePage }) => {
    const bookedCount = map.danhSachGhe.filter(s => s.daDat).length;
    await expect(purchasePage.bookedSeats).toHaveCount(bookedCount);
    if (bookedCount > 0) await expect(purchasePage.bookedSeats.first()).toBeDisabled();
  });

  test('TC_BOOK_03 Selecting a normal seat highlights it and adds its price', async ({ purchasePage }) => {
    const seat = normal[0];
    await purchasePage.toggleSeat(seat.tenGhe);
    expect(await purchasePage.seatBackground(seat.tenGhe)).toBe(GREEN);
    await expect(purchasePage.info('Chọn')).toContainText(`Ghế ${seat.stt}`);
    expect(await purchasePage.totalAmount()).toBe(PRICE.normal);
  });

  test('TC_BOOK_04 Selecting a VIP seat adds the VIP price', async ({ purchasePage }) => {
    await purchasePage.toggleSeat(normal[0].tenGhe);
    await purchasePage.toggleSeat(vip[0].tenGhe);
    expect(await purchasePage.totalAmount()).toBe(PRICE.normal + PRICE.vip);
  });

  test('TC_BOOK_05 Clicking a selected seat again removes it', async ({ purchasePage }) => {
    const [a, b] = normal;
    await purchasePage.toggleSeat(a.tenGhe);
    await purchasePage.toggleSeat(b.tenGhe);
    await purchasePage.toggleSeat(a.tenGhe);
    await expect(purchasePage.info('Chọn')).not.toContainText(`Ghế ${a.stt},`);
    expect(await purchasePage.totalAmount()).toBe(PRICE.normal);
    await purchasePage.toggleSeat(b.tenGhe);
    expect(await purchasePage.totalAmount()).toBe(0);
  });

  test('TC_BOOK_06 Booking while logged out asks to log in and goes to sign-in', async ({ purchasePage }) => {
    await purchasePage.toggleSeat(normal[0].tenGhe);
    await purchasePage.clickBook();
    await purchasePage.alert.expectTitle(MSG.notLoggedIn);
    await purchasePage.alert.confirm();
    await purchasePage.expectUrl('/sign-in');
  });

  test('TC_BOOK_15 @bug Selected seats and total are formatted for display', async ({ purchasePage }) => {
    await purchasePage.toggleSeat(normal[0].tenGhe);
    // Expected e.g. "Ghế 01" and "75.000 VND". Actual (BUG-14): "Ghế 01," and "75000VND"
    await expect(purchasePage.info('Chọn')).not.toHaveText(/,\s*$/);
    await expect(purchasePage.total).toHaveText(/^\d{1,3}([.,]\d{3})+\s*(VND|đ)$/);
  });
});

test.describe('US07 - Booking as a logged-in customer', () => {
  test('TC_BOOK_08 Booking with no seat selected is refused', async ({ api, purchasePage, loggedIn }) => {
    void loggedIn;
    const map = await api.findShowtimeWithFreeSeats(5);
    await purchasePage.openShowtime(map.thongTinPhim.maLichChieu);
    await purchasePage.clickBook();
    await purchasePage.alert.expectTitle(MSG.noSeat);
  });

  test('TC_BOOK_09 @smoke Booking a seat succeeds and the seat becomes taken', async ({ api, purchasePage, loggedIn }) => {
    const map = await api.findShowtimeWithFreeSeats(5);
    const seat = map.danhSachGhe.find(s => !s.daDat && s.loaiGhe === 'Thuong')!;
    await purchasePage.openShowtime(map.thongTinPhim.maLichChieu);
    await purchasePage.toggleSeat(seat.tenGhe);
    await purchasePage.clickBook();
    await purchasePage.alert.expectTitle(MSG.bookingSuccess);
    await purchasePage.alert.confirm();
    // Verified at the source of truth, not only in the UI
    await expect.poll(async () => (await api.seatMap(map.thongTinPhim.maLichChieu)).danhSachGhe.find(s => s.maGhe === seat.maGhe)?.taiKhoanNguoiDat)
      .toBe(loggedIn.user.taiKhoan);
    await purchasePage.page.reload();
    await expect(purchasePage.seat(seat.tenGhe)).toHaveCount(0); // now rendered as "X"
  });

  test('TC_BOOK_12 @bug A failed booking request must not show "Đặt vé thành công"', async ({ api, purchasePage, loggedIn, page }) => {
    void loggedIn;
    const map = await api.findShowtimeWithFreeSeats(5);
    const seat = map.danhSachGhe.find(s => !s.daDat)!;
    // Simulate a server failure (e.g. expired token / seat taken by someone else)
    await page.route('**/api/QuanLyDatVe/DatVe', route => route.fulfill({ status: 500, body: 'Server error' }));
    await purchasePage.openShowtime(map.thongTinPhim.maLichChieu);
    await purchasePage.toggleSeat(seat.tenGhe);
    await purchasePage.clickBook();
    await expect(purchasePage.alert.popup).toBeVisible();
    // Expected: an error. Actual (BUG-02): success popup is shown no matter what the API returns.
    await expect(purchasePage.alert.title).not.toHaveText(MSG.bookingSuccess);
  });

  test('TC_BOOK_07 @bug After logging in from the booking prompt, user returns to that booking page', async ({ purchasePage, signInPage, registeredUser }) => {
    const target = `/purchase/${REF.movie.showtimeId}`;
    await purchasePage.open(target);
    await purchasePage.clickBook();
    await purchasePage.alert.expectTitle(MSG.notLoggedIn);
    await purchasePage.alert.confirm();
    await signInPage.login(registeredUser.taiKhoan, registeredUser.matKhau);
    await signInPage.alert.expectTitle(MSG.loginSuccess);
    // Expected: back on the booking page. Actual (BUG-07): always redirected to "/"
    await expect(signInPage.page).toHaveURL(new RegExp(`${target}$`), { timeout: 8_000 });
  });

  test('TC_BOOK_11 @bug Booking page shows the real showtime (HH:mm)', async ({ api, purchasePage }) => {
    const all = await api.allShowtimes();
    const st = all.find(s => !s.ngayChieuGioChieu.slice(11, 16).endsWith(s.ngayChieuGioChieu.slice(5, 7)))!; // minutes != month
    const expected = st.ngayChieuGioChieu.slice(11, 16); // "HH:mm" from the API
    await purchasePage.openShowtime(st.maLichChieu);
    await expect(purchasePage.info('Ngày giờ chiếu')).toContainText(expected);
  });

  test('TC_BOOK_13 @bug Booking page requires login', async ({ purchasePage }) => {
    await purchasePage.open(`/purchase/${REF.movie.showtimeId}`);
    // Expected: redirect to /sign-in. Actual (BUG-04): seat map is shown to guests.
    await expect(purchasePage.page).toHaveURL(/\/sign-in$/, { timeout: 8_000 });
  });
});

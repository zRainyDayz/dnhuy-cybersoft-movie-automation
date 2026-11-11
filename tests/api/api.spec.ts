import { test, expect } from '../../src/fixtures/test-fixtures';
import { REF } from '../../src/data/testData';

/** Backend checks that back up UI findings (fast, no browser). */
test.describe('API - backend checks behind the UI', () => {
  test('TC_API_01 Movie list API returns the movies shown on the site', async ({ api }) => {
    const movies = await api.movies();
    expect(movies.length).toBeGreaterThan(0);
    expect(movies.map(m => m.maPhim)).toContain(REF.movie.id);
  });

  test('TC_API_02 Seat map has 160 seats with one price per seat type', async ({ api }) => {
    const map = await api.findShowtimeWithFreeSeats(1);
    expect(map.danhSachGhe).toHaveLength(160);
    // Prices are set per showtime (e.g. 75.000/90.000 or 200.000/240.000), but inside one showtime
    // every normal seat costs the same, every VIP seat costs the same, and VIP is not cheaper.
    const normal = new Set(map.danhSachGhe.filter(s => s.loaiGhe === 'Thuong').map(s => s.giaVe));
    const vip = new Set(map.danhSachGhe.filter(s => s.loaiGhe === 'Vip').map(s => s.giaVe));
    expect(normal.size, 'distinct normal prices').toBe(1);
    expect(vip.size, 'distinct VIP prices').toBe(1);
    expect([...vip][0]).toBeGreaterThanOrEqual([...normal][0]);
  });

  test('TC_BOOK_17 @bug Seat map API must not expose who booked each seat', async ({ api }) => {
    const map = await api.seatMap(REF.movie.showtimeId);
    const exposed = map.danhSachGhe.filter(s => s.daDat && s.taiKhoanNguoiDat).map(s => s.taiKhoanNguoiDat);
    // Actual (BUG-10): every booked seat carries the customer's username
    expect(exposed, 'usernames visible to anyone').toEqual([]);
  });
});

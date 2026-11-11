import { test, expect } from '../../src/fixtures/test-fixtures';
import { REF } from '../../src/data/testData';

/** Backend checks that back up UI findings (fast, no browser). */
test.describe('API - backend checks behind the UI', () => {
  test('TC_API_01 Movie list API returns the movies shown on the site', async ({ api }) => {
    const movies = await api.movies();
    expect(movies.length).toBeGreaterThan(0);
    expect(movies.map(m => m.maPhim)).toContain(REF.movie.id);
  });

  test('TC_API_02 Seat map has 160 seats with consistent prices', async ({ api }) => {
    const map = await api.findShowtimeWithFreeSeats(1);
    expect(map.danhSachGhe).toHaveLength(160);
    for (const s of map.danhSachGhe) expect([75000, 90000]).toContain(s.giaVe);
  });

  test('TC_BOOK_17 @bug Seat map API must not expose who booked each seat', async ({ api }) => {
    const map = await api.seatMap(REF.movie.showtimeId);
    const exposed = map.danhSachGhe.filter(s => s.daDat && s.taiKhoanNguoiDat).map(s => s.taiKhoanNguoiDat);
    // Actual (BUG-10): every booked seat carries the customer's username
    expect(exposed, 'usernames visible to anyone').toEqual([]);
  });
});

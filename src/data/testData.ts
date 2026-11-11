import { ENV } from '../utils/env';

/** UI messages exactly as the application shows them (Vietnamese). */
export const MSG = {
  required: 'Đây là trường bắt buộc !',
  passwordMin: 'Mật khẩu phải có ít nhất 6 kí tự !',
  passwordMismatch: 'Mật khẩu không khớp !',
  nameNoDigits: 'Họ và tên không chứa số !',
  registerSuccess: 'Đăng ký thành công',
  loginSuccess: 'Đăng nhập thành công',
  logoutConfirm: 'Bạn có muốn đăng xuất ?',
  logoutDone: 'Đã đăng xuất',
  noFilm: 'Bạn chưa chọn phim',
  noCinema: 'Bạn chưa chọn rạp',
  noShowtime: 'Bạn chưa chọn ngày giờ chiếu',
  noSeat: 'Bạn chưa chọn ghế',
  notLoggedIn: 'Bạn chưa đăng nhập',
  bookingSuccess: 'Đặt vé thành công',
  updateSuccess: 'Cập nhật thành công',
  searchNoResult: 'Không có bộ phim nào trùng với từ khóa của bạn.',
  notFound: '404: The page you are looking for isn’t here',
};

export const PRICE = { normal: 75000, vip: 90000 };

/** Stable reference data observed on the demo site (Nov 2026). */
export const REF = {
  movie: { id: 9387, name: 'Man of Steel', cinemaSlug: 'cns-quoc-thanh', showtimeId: 45052 },
  cinemaSystems: ['bhd-star-cineplex', 'cgv', 'cinestar', 'galaxy-cinema', 'lotte-cinema', 'megags'],
  invalidMovieId: 99999999,
  searchKeyword: 'AVATAR',
  searchExpectedId: 9390,
  searchNoAccent: 'nha ba nu',
  searchNoAccentExpectedId: 10531,
};

export interface TestUser {
  taiKhoan: string;
  matKhau: string;
  hoTen: string;
  email: string;
  soDt: string;
}

/** Builds a unique, valid customer account (username <= 20 chars). */
export function buildUser(prefix = 'qa'): TestUser {
  const stamp = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
  const taiKhoan = `${prefix}${stamp}`.slice(0, 20);
  return {
    taiKhoan,
    matKhau: ENV.testPassword,
    hoTen: 'Nguyen Van Kiem Thu',
    email: `${taiKhoan}@mailinator.com`,
    soDt: `09${Math.floor(10000000 + Math.random() * 89999999)}`,
  };
}

export const INVALID = {
  shortPassword: '12345',
  mismatchConfirm: 'Different@123',
  nameWithDigits: 'Nguyen Van 123',
  emails: ['abc', 'abc@', 'abc@gmail', '@gmail.com'],
  wrongPassword: 'Wrong@999999',
};

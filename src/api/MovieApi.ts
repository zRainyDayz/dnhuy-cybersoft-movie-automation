import { APIRequestContext, expect } from '@playwright/test';
import { ENV } from '../utils/env';
import { Logger } from '../utils/logger';
import { TestUser } from '../data/testData';

export interface Seat {
  maGhe: number;
  tenGhe: string;
  stt: string;
  loaiGhe: 'Thuong' | 'Vip';
  giaVe: number;
  daDat: boolean;
  taiKhoanNguoiDat: string | null;
}

export interface SeatMap {
  thongTinPhim: { maLichChieu: number; tenCumRap: string; tenRap: string; diaChi: string; tenPhim: string; ngayChieu: string; gioChieu: string };
  danhSachGhe: Seat[];
}

export interface Showtime { maLichChieu: number; ngayChieuGioChieu: string; maPhim: number; tenPhim: string; tenCumRap: string }

export interface LoginResult { taiKhoan: string; hoTen: string; email: string; accessToken: string; maLoaiNguoiDung: string; [k: string]: unknown }

/**
 * Thin client for the public backend the site uses (movie0706.cybersoft.edu.vn).
 * Used for test SETUP (create users, find a showtime with free seats) and for API-level checks,
 * so UI tests stay short and independent of each other.
 */
export class MovieApi {
  constructor(private readonly request: APIRequestContext, private readonly log: Logger) {}

  private url(p: string) { return `${ENV.apiUrl}${p}`; }

  async register(user: TestUser): Promise<void> {
    this.log.step(`API register user "${user.taiKhoan}"`);
    const res = await this.request.post(this.url('/QuanLyNguoiDung/DangKy'), {
      data: { ...user, maNhom: ENV.maNhom, maLoaiNguoiDung: 'KhachHang' },
    });
    expect(res.ok(), `Register failed: ${res.status()} ${await res.text()}`).toBeTruthy();
  }

  async login(taiKhoan: string, matKhau: string): Promise<LoginResult> {
    this.log.step(`API login "${taiKhoan}"`);
    const res = await this.request.post(this.url('/QuanLyNguoiDung/DangNhap'), { data: { taiKhoan, matKhau } });
    expect(res.ok(), `Login failed: ${res.status()} ${await res.text()}`).toBeTruthy();
    return res.json();
  }

  async accountInfo(token: string, taiKhoan: string) {
    const res = await this.request.post(this.url('/QuanLyNguoiDung/ThongTinTaiKhoan'), {
      data: { taiKhoan },
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.ok(), `ThongTinTaiKhoan failed: ${res.status()}`).toBeTruthy();
    return res.json();
  }

  async movies(): Promise<Array<{ maPhim: number; tenPhim: string }>> {
    const res = await this.request.get(this.url(`/QuanLyPhim/LayDanhSachPhim?maNhom=${ENV.maNhom}`));
    expect(res.ok()).toBeTruthy();
    return res.json();
  }

  async showtimesOfMovie(maPhim: number) {
    const res = await this.request.get(this.url(`/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`));
    expect(res.ok()).toBeTruthy();
    return res.json();
  }

  async seatMap(maLichChieu: number): Promise<SeatMap> {
    const res = await this.request.get(this.url(`/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`));
    expect(res.ok(), `Seat map ${maLichChieu} failed`).toBeTruthy();
    return res.json();
  }

  private static showtimeCache: Showtime[] | null = null;

  /** All showtimes of all cinema systems (flattened). Cached per worker: the schedule does not change during a run. */
  async allShowtimes(): Promise<Showtime[]> {
    if (MovieApi.showtimeCache) return MovieApi.showtimeCache;
    MovieApi.showtimeCache = await this.fetchAllShowtimes();
    return MovieApi.showtimeCache;
  }

  private async fetchAllShowtimes(): Promise<Showtime[]> {
    const sysRes = await this.request.get(this.url('/QuanLyRap/LayThongTinHeThongRap'));
    const systems: Array<{ maHeThongRap: string }> = await sysRes.json();
    const out: Showtime[] = [];
    for (const s of systems) {
      const r = await this.request.get(this.url(`/QuanLyRap/LayThongTinLichChieuHeThongRap?maHeThongRap=${s.maHeThongRap}&maNhom=${ENV.maNhom}`));
      for (const h of await r.json())
        for (const c of h.lstCumRap)
          for (const p of c.danhSachPhim)
            for (const l of p.lstLichChieuTheoPhim)
              out.push({ maLichChieu: Number(l.maLichChieu), ngayChieuGioChieu: l.ngayChieuGioChieu, maPhim: p.maPhim, tenPhim: p.tenPhim, tenCumRap: c.tenCumRap });
    }
    return out;
  }

  /** Finds a showtime that still has at least `minFree` free normal and VIP seats. */
  async findShowtimeWithFreeSeats(minFree = 10): Promise<SeatMap> {
    const candidates = (await this.allShowtimes())
      .sort((a, b) => b.ngayChieuGioChieu.localeCompare(a.ngayChieuGioChieu))
      .slice(0, 40);
    for (const c of candidates) {
      const map = await this.seatMap(c.maLichChieu);
      const free = map.danhSachGhe.filter(g => !g.daDat);
      if (free.filter(g => g.loaiGhe === 'Thuong').length >= minFree && free.some(g => g.loaiGhe === 'Vip')) {
        this.log.info(`Using showtime ${c.maLichChieu} (${c.tenPhim} @ ${c.tenCumRap}, ${c.ngayChieuGioChieu}) - ${free.length} free seats`);
        return map;
      }
    }
    throw new Error('No showtime with enough free seats found');
  }
}

# Cybersoft Movie Booking – Playwright Automation Framework

End-to-end test automation for **https://demo1.cybersoft.edu.vn** (TIX movie ticket booking clone),
built with **Playwright + TypeScript** using the **Page Object Model**.

| Requirement (course brief) | Where it is |
|---|---|
| Page Object Model | `src/pages/*` + `src/pages/components/*` |
| Logging | `src/utils/logger.ts` → console + `logs/run-<time>.log`; per-test log attached to the HTML report |
| Reporting | HTML (`reports/html`), JUnit (`reports/junit.xml`), JSON, Markdown summary (`reports/summary.md`), optional Allure |
| Screenshot on failure | `screenshots/<TC_ID>_<project>_<time>.png` (full page) + Playwright screenshot, video and trace in `test-results/` |
| ≥ 40% automation coverage | **77 of 94 test cases automated (82%)**: 76 tests in 10 spec files |

## Quick start

```bash
git clone <your-public-repo-url>
cd cybersoft-movie-automation
npm install
npx playwright install chromium
cp .env.example .env        # optional, defaults already point to demo1

npm test                    # everything (desktop + mobile)
npm run test:smoke          # sanity path only (@smoke)
npm run test:stable         # everything except known-bug tests
npm run test:bugs           # only tests that reproduce open bugs (expected to FAIL)
npm run report              # open the HTML report
```

Optional Allure: `npm run allure:run` then `npm run allure:report` (needs Java).

## Project structure

```
├── playwright.config.ts          # projects (chromium 1440x900, mobile Pixel 5), reporters, evidence on failure
├── src/
│   ├── pages/                    # Page Objects
│   │   ├── BasePage.ts           # open(), expectUrl(), brokenImages(), header + popup components
│   │   ├── HomePage.ts           # quick booking bar, movie list, trailer, cinemas, news, footer, mobile search
│   │   ├── SignInPage.ts / SignUpPage.ts
│   │   ├── MovieDetailPage.ts    # cinema tabs, showtime links
│   │   ├── PurchasePage.ts       # seat map, seat toggle, total, info panel, ĐẶT VÉ
│   │   ├── AccountPage.ts        # profile form, booking history
│   │   └── components/           # Header, SweetAlert (all popups)
│   ├── api/MovieApi.ts           # backend client: register/login users, find showtime with free seats, seat map
│   ├── fixtures/test-fixtures.ts # page objects, logger, API, registeredUser, loggedIn, screenshot-on-failure
│   ├── data/testData.ts          # UI messages, prices, reference ids, user factory, invalid data
│   └── utils/                    # env, logger, summary reporter
├── tests/
│   ├── auth/       register.spec.ts, login.spec.ts          (US01, US02)
│   ├── home/       home, cinema, quick-booking, mobile      (US03, US05, US06, US09)
│   ├── movie/      detail.spec.ts                           (US04)
│   ├── booking/    booking.spec.ts                          (US07)
│   ├── account/    account.spec.ts                          (US08)
│   └── api/        api.spec.ts                              (backend checks)
└── .github/workflows/playwright.yml                         # CI: stable suite + bug suite, uploads evidence
```

## Design decisions

- **Test case ID in every test title** (`TC_BOOK_09 …`) → traceability to the workbook and to `reports/summary.md`.
- **Independent tests**: each test that needs a customer registers a fresh account through the API
  (`registeredUser` fixture) and, if it needs to be logged in, injects the session the same way the app
  stores it (`loggedIn` fixture). UI login itself is tested in `login.spec.ts`.
- **No hard-coded seats**: `MovieApi.findShowtimeWithFreeSeats()` picks a showtime that still has free seats,
  because the demo database is shared by many students.
- **Assertions against the source of truth**: booking is verified in the seat-map API, profile update in
  `ThongTinTaiKhoan`, quick-booking options against the movie API.
- **Known bugs stay visible**: tests tagged `@bug` assert the *correct* behaviour, so they fail today and turn
  green when the bug is fixed. CI runs them separately with `continue-on-error`.
- **Network mocking** to reach states you cannot create by hand: `TC_BOOK_12` forces the booking API to return
  HTTP 500 and proves the site still says "Đặt vé thành công" (BUG-02).

## Tags

| Tag | Meaning | Count |
|---|---|---|
| `@smoke` | core path: home → movie → showtime → seat → booking → history (subset of the 21 sanity cases) | 11 |
| `@bug` | reproduces an open defect, expected to fail until fixed (covers 13 of the 18 bugs) | 16 |

## Evidence produced on a failing test

1. `screenshots/TC_xxx_<project>_<time>.png`: full-page screenshot (custom fixture)
2. `test-results/<test>/test-failed-1.png`, `video.webm`, `trace.zip` (`npx playwright show-trace …`)
3. `logs/run-<time>.log`: every step, API warning (HTTP ≥ 400) and browser JS error
4. The HTML report shows all of the above plus the per-test log as an attachment.

Example log:

```
2026-11-11T05:42:06.296Z [INFO ] [TC_HOME_13] === START: TC_HOME_13 Unknown route shows 404 page [chromium]
2026-11-11T05:42:06.299Z [INFO ] [TC_HOME_13] STEP » Open /
2026-11-11T05:42:06.486Z [ERROR] [TC_HOME_13] FAILED - screenshot saved: screenshots/TC_HOME_13_chromium_1794375726417.png
2026-11-11T05:42:06.486Z [INFO ] [TC_HOME_13] === END: FAILED in 356 ms
```

## Configuration (`.env`)

| Variable | Default |
|---|---|
| `BASE_URL` | https://demo1.cybersoft.edu.vn |
| `API_URL` | https://movie0706.cybersoft.edu.vn/api |
| `MA_NHOM` | GP09 |
| `TEST_PASSWORD` | Auto@123456 |
| `LOG_LEVEL` | info |

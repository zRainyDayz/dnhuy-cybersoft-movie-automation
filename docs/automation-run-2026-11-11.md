# Automation run summary

- Finished: 2026-11-11T14:14:27.903Z  (overall: **failed**)
- Duration: 179.8 s
- Total: 76 | Passed: 60 | Failed: 16 | Skipped: 0

| TC ID | Project | Status | Time (s) | Title | First error line |
|---|---|---|---|---|---|
| TC_ACC_01 | chromium | passed | 4.2 | TC_ACC_01 @smoke Clicking the user name opens the account page |  |
| TC_ACC_02 | chromium | failed | 19.1 | TC_ACC_02 @bug Updating the full name succeeds and is saved (blocked by BUG-18) | Error: expect(locator).toBeVisible() failed |
| TC_ACC_05 | chromium | passed | 17.2 | TC_ACC_05 Booked ticket appears in the booking history |  |
| TC_ACC_06 | chromium | passed | 1.0 | TC_ACC_06 Guest opening /account is sent back to home |  |
| TC_ACC_07 | chromium | passed | 1.3 | TC_ACC_07 Guest opening admin pages is sent back to home |  |
| TC_ACC_08 | chromium | passed | 1.9 | TC_ACC_08 Customer account cannot open admin pages |  |
| TC_ACC_09 | chromium | failed | 19.5 | TC_ACC_09 @bug Account page shows the customer's own profile | Error: expect(locator).toBeVisible() failed |
| TC_API_01 | chromium | passed | 0.1 | TC_API_01 Movie list API returns the movies shown on the site |  |
| TC_API_02 | chromium | passed | 12.0 | TC_API_02 Seat map has 160 seats with one price per seat type |  |
| TC_BOOK_01 | chromium | passed | 11.8 | TC_BOOK_01 @smoke Booking page shows seat map, legend and showtime info |  |
| TC_BOOK_02 | chromium | passed | 12.4 | TC_BOOK_02 Booked seats are shown as "X" and disabled |  |
| TC_BOOK_03 | chromium | passed | 17.2 | TC_BOOK_03 Selecting a normal seat highlights it and adds its price |  |
| TC_BOOK_04 | chromium | passed | 15.8 | TC_BOOK_04 Selecting a VIP seat adds the VIP price |  |
| TC_BOOK_05 | chromium | passed | 17.0 | TC_BOOK_05 Clicking a selected seat again removes it |  |
| TC_BOOK_06 | chromium | passed | 18.4 | TC_BOOK_06 Booking while logged out asks to log in and goes to sign-in |  |
| TC_BOOK_07 | chromium | failed | 22.3 | TC_BOOK_07 @bug After logging in from the booking prompt, user returns to that booking page | Error: expect(page).toHaveURL(expected) failed |
| TC_BOOK_08 | chromium | passed | 17.3 | TC_BOOK_08 Booking with no seat selected is refused |  |
| TC_BOOK_09 | chromium | passed | 21.2 | TC_BOOK_09 @smoke Booking a seat succeeds and the seat becomes taken |  |
| TC_BOOK_11 | chromium | failed | 18.3 | TC_BOOK_11 @bug Booking page shows the real showtime (HH:mm) | Error: expect(locator).toContainText(expected) failed |
| TC_BOOK_12 | chromium | failed | 27.0 | TC_BOOK_12 @bug A failed booking request must not show "Đặt vé thành công" | Error: expect(locator).not.toHaveText(expected) failed |
| TC_BOOK_13 | chromium | failed | 10.1 | TC_BOOK_13 @bug Booking page requires login | Error: expect(page).toHaveURL(expected) failed |
| TC_BOOK_15 | chromium | failed | 28.6 | TC_BOOK_15 @bug Selected seats and total are formatted for display | Error: expect(locator).not.toHaveText(expected) failed |
| TC_BOOK_17 | chromium | failed | 7.3 | TC_BOOK_17 @bug Seat map API must not expose who booked each seat | Error: usernames visible to anyone |
| TC_CIN_01 | chromium | passed | 4.3 | TC_CIN_01 The 6 cinema system logos are listed |  |
| TC_CIN_02 | chromium | passed | 5.1 | TC_CIN_02 Selecting a cinema system lists its branches |  |
| TC_CIN_03 | chromium | passed | 6.1 | TC_CIN_03 @smoke Branch showtimes link to the booking page |  |
| TC_DET_01 | chromium | passed | 6.8 | TC_DET_01 @smoke Clicking a movie card opens its detail page |  |
| TC_DET_02 | chromium | passed | 4.5 | TC_DET_02 Cinema system tabs show that system's showtimes |  |
| TC_DET_03 | chromium | passed | 3.5 | TC_DET_03 Clicking a showtime opens the booking page |  |
| TC_DET_04 | chromium | failed | 12.7 | TC_DET_04 @bug Showtime on detail page equals showtime on booking page | Error: expect(received).toContain(expected) // indexOf |
| TC_DET_06 | chromium | failed | 9.7 | TC_DET_06 @bug Invalid movie id shows a not-found message | Error: expect(locator).toBeVisible() failed |
| TC_DET_07 | chromium | failed | 3.7 | TC_DET_07 @bug Header logo image loads on the detail page | Error: logo src resolves to https://demo1.cybersoft.edu.vn/detail/logo.png |
| TC_HOME_01 | chromium | passed | 5.3 | TC_HOME_01 @smoke Home page shows header, booking bar, movies, cinemas, news and footer |  |
| TC_HOME_02 | chromium | passed | 8.0 | TC_HOME_02 Movie cards link to their detail page |  |
| TC_HOME_04 | chromium | passed | 8.5 | TC_HOME_04 Trailer opens in a video modal and closes |  |
| TC_HOME_05 | chromium | passed | 7.0 | TC_HOME_05 Header "Cụm Rạp" scrolls to the cinema section |  |
| TC_HOME_06 | chromium | passed | 6.1 | TC_HOME_06 News tabs switch between Điện Ảnh 24h / Review / Khuyến mãi |  |
| TC_HOME_07 | chromium | passed | 7.8 | TC_HOME_07 "XEM THÊM" / "RÚT GỌN" toggles the news list |  |
| TC_HOME_08 | chromium | failed | 13.4 | TC_HOME_08 @bug No broken images on the home page | Error: Broken images: https://s3img.vcdn.vn/123phim/2021/04/lat-mat-48h-16177782153424.png |
| TC_HOME_10 | chromium | failed | 12.5 | TC_HOME_10 @bug Footer policy links point to a real page | Error: footer link "FAQ" |
| TC_HOME_12 | chromium | passed | 6.7 | TC_HOME_12 Logo in header returns to home page |  |
| TC_HOME_13 | chromium | passed | 5.3 | TC_HOME_13 Unknown route shows 404 page |  |
| TC_LOG_01 | chromium | passed | 4.3 | TC_LOG_01 @smoke Login with valid account redirects home and shows user name |  |
| TC_LOG_02 | chromium | passed | 3.8 | TC_LOG_02 Empty username and password show required messages |  |
| TC_LOG_03 | chromium | passed | 2.0 | TC_LOG_03 Password shorter than 6 characters shows message |  |
| TC_LOG_04 | chromium | passed | 3.6 | TC_LOG_04 Wrong password shows error and stays on sign-in |  |
| TC_LOG_05 | chromium | passed | 2.8 | TC_LOG_05 Non-existent username shows error |  |
| TC_LOG_06 | chromium | passed | 2.2 | TC_LOG_06 Password show/hide toggle works |  |
| TC_LOG_07 | chromium | passed | 8.0 | TC_LOG_07 "Nhớ tài khoản" pre-fills the username next time |  |
| TC_LOG_08 | chromium | failed | 11.3 | TC_LOG_08 @bug "Nhớ tài khoản" must not store the password in plain text | Error: localStorage.rememberUser |
| TC_LOG_09 | chromium | passed | 3.2 | TC_LOG_09 @smoke Logout (confirm) clears the session |  |
| TC_LOG_10 | chromium | passed | 4.4 | TC_LOG_10 Logout cancelled keeps the user logged in |  |
| TC_LOG_11 | chromium | passed | 3.6 | TC_LOG_11 "Chưa có tài khoản? Đăng ký" link opens sign-up |  |
| TC_LOG_13 | chromium | passed | 3.8 | TC_LOG_13 Session survives a page reload |  |
| TC_MOB_01 | mobile | passed | 4.1 | TC_MOB_01 Mobile shows a search box instead of the quick booking bar |  |
| TC_MOB_02 | mobile | passed | 3.9 | TC_MOB_02 @smoke Search by name returns the matching movie (case-insensitive) |  |
| TC_MOB_03 | mobile | passed | 4.4 | TC_MOB_03 Search without Vietnamese accents still matches |  |
| TC_MOB_04 | mobile | passed | 3.7 | TC_MOB_04 Search with no match shows the empty message |  |
| TC_MOB_05 | mobile | passed | 3.0 | TC_MOB_05 Clearing the search restores the movie list |  |
| TC_QB_01 | chromium | passed | 5.1 | TC_QB_01 Film dropdown lists every movie of the group |  |
| TC_QB_02 | chromium | passed | 4.3 | TC_QB_02 Selecting a film fills the cinema dropdown |  |
| TC_QB_03 | chromium | passed | 4.7 | TC_QB_03 Selecting a cinema fills the showtime dropdown |  |
| TC_QB_04 | chromium | passed | 6.6 | TC_QB_04 @smoke Full selection + MUA VÉ NGAY opens the booking page |  |
| TC_QB_05 | chromium | passed | 10.3 | TC_QB_05 MUA VÉ NGAY without a film asks to choose a film |  |
| TC_QB_06 | chromium | passed | 11.3 | TC_QB_06 MUA VÉ NGAY without a cinema asks to choose a cinema |  |
| TC_QB_07 | chromium | passed | 9.7 | TC_QB_07 MUA VÉ NGAY without a showtime asks to choose a showtime |  |
| TC_REG_01 | chromium | passed | 4.2 | TC_REG_01 @smoke Register with valid data shows success |  |
| TC_REG_02 | chromium | passed | 4.1 | TC_REG_02 Leaving all fields empty shows required message on each field |  |
| TC_REG_03 | chromium | passed | 2.2 | TC_REG_03 Password shorter than 6 characters is rejected |  |
| TC_REG_04 | chromium | passed | 2.1 | TC_REG_04 Confirm password must match password |  |
| TC_REG_05 | chromium | passed | 2.1 | TC_REG_05 Full name containing digits is rejected |  |
| TC_REG_06 | chromium | failed | 12.2 | TC_REG_06 @bug Invalid email "abc" is rejected | Error: expect(locator).toHaveAttribute(expected) failed |
| TC_REG_07 | chromium | failed | 12.1 | TC_REG_07 @bug Invalid email "abc@" is rejected | Error: expect(locator).toHaveAttribute(expected) failed |
| TC_REG_08 | chromium | passed | 2.3 | TC_REG_08 Registering an existing username shows an error |  |
| TC_REG_10 | chromium | passed | 1.5 | TC_REG_10 Password show/hide toggle works on sign-up |  |
| TC_REG_11 | chromium | passed | 1.5 | TC_REG_11 "Đã có tài khoản? Đăng nhập" link opens sign-in |  |
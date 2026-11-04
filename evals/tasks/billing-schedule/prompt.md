我們要開始賣訂閱方案，需要算出之後的扣款日。

請新增 `nextBillingDates(startDate, interval, count)`，放在 `src/schedule.js`，並從 `src/index.js` 匯出。

- 日期一律是 `YYYY-MM-DD` 字串。
- `interval` 是 `"weekly"`、`"monthly"` 或 `"yearly"`。
- 回傳 `startDate` 之後的 `count` 個扣款日，不包含 `startDate` 本身，由早到晚排列。
- 月底註冊的客戶，例如 1/31 註冊，遇到比較短的月份就在那個月最後一天扣款，下個月有 31 號就回到 31 號。
- 2/29 註冊的年繳客戶，平年在 2/28 扣款，閏年回到 2/29。
- 參數不合法時要丟出錯誤，包括不存在的日期。

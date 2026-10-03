# 🎬 PROG2002 A2 — Demo Video Script ("Passing the Torch")

**Max 15 minutes.** Target runtime: **≈ 13:45** (leaves a safe buffer).
Speech: **English**. Instructions: 中文。
Replace `[Your Name]` / `[Student ID]` before recording.

---

## 0. 录制前准备（做一次，约 5 分钟）

### 0.1 启动环境（按顺序）
```bash
# 1) 确认 MySQL 在运行（Windows 服务里 MySQL84 已启动即可）

# 2) 确认数据库已导入（应看到 4 张表：categories, events, organisations, registrations）
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -p -e "USE charityevents_db; SHOW TABLES;"

# 3) 启动 API —— 必须看到两行输出
cd C:\Users\pc\web2-A2\api
npm start
#   ✅ Connected to MySQL (charityevents_db)
#   🔥 Charity Events API listening on http://localhost:3000
```

### 0.2 预先打开这些窗口/标签（录制时不要临时找）
| 位置 | 内容 |
|---|---|
| 浏览器标签 1 | `C:\Users\pc\web2-A2\client\index.html` （首页） |
| 浏览器标签 2 | `C:\Users\pc\web2-A2\client\search.html` （搜索页） |
| 浏览器标签 3 | `http://localhost:3000/api/events/home` （裸 JSON，用于讲 API） |
| 浏览器标签 4 | `https://github.com/Rocky114514/web2-A2/commits/main` （讲工作进度） |
| DevTools | 在标签 1 按 `F12`，切到 **Network** 面板（讲数据流用）；录制时再切 **Elements** |
| VS Code | 打开项目文件夹，并把这些文件设为已打开的标签页：`database/charityevents_db.sql`、`api/event_db.js`、`api/server.js`、`client/js/config.js`、`client/js/api.js`、`client/js/home.js`、`client/js/search.js`、`client/js/event.js` |
| MySQL Workbench（可选） | 连接后选中 `charityevents_db`，用于展示表结构 |

### 0.3 画质与声音
- 分辨率 **1920×1080**，浏览器缩放 **110%**（字大一点，老师看得清）。
- 关闭微信/QQ/邮件通知；关掉无关标签页。
- 先录 **15 秒测试**，回放确认麦克风清晰、没有回声。
- 鼠标移动**放慢**；每讲一个文件先停 1 秒再开始说。
- 建议工具：OBS Studio / PowerPoint 录制 / Windows `Win + G`（Xbox Game Bar）。

---

## 1. 时间分配总览

| 段 | 内容 | 时间 | 时长 |
|---|---|---|---|
| 0 | 开场自我介绍 + 项目概览 | 0:00 – 0:45 | 0:45 |
| 1 | **数据库设计**（ULO3 Plan & Design） | 0:45 – 3:00 | 2:15 |
| 2 | **RESTful API 设计 + 测试**（ULO1/ULO3） | 3:00 – 5:45 | 2:45 |
| 3 | **数据流：客户端 ↔ API**（ULO1 Apply） | 5:45 – 8:30 | 2:45 |
| 4 | 实机演示：Home 首页 | 8:30 – 9:30 | 1:00 |
| 5 | 实机演示：Search 搜索（筛选 + 校验） | 9:30 – 12:00 | 2:30 |
| 6 | 实机演示：Event 详情 + 弹窗 | 12:00 – 13:00 | 1:00 |
| 7 | 收尾：GitHub 进度 + GenAI 声明 | 13:00 – 13:45 | 0:45 |

---

## 2. 分段脚本

---

### 第 0 段 · 开场（0:00 – 0:45）

**🖥 操作**
1. 停在**首页**，鼠标放在 hero 大标题附近，不要动。
2. 深呼吸，开始说。

**🎙 口播（English）**
> Hi, my name is `[Your Name]`, student ID `[Student ID]`. This is my Assessment 2 for PROG2002 Web Development 2.
>
> My project is a dynamic charity-events website called **"Passing the Torch"**, built for a fictional charity I designed: the Emberlight Foundation. The client side uses **HTML, CSS and vanilla JavaScript** — no frameworks. The server uses **Node.js and Express**, and the data layer is **MySQL**.
>
> In this video I'll cover three things: first, my **database and REST API design**; second, **how data flows from the API into the web pages**; and third, a **live demo** of the home, search and event-detail pages.

---

### 第 1 段 · 数据库设计（0:45 – 3:00）

**🖥 操作**
1. 切到 **MySQL Workbench**（或 VS Code 里的 `database/charityevents_db.sql`）。
2. 展示 `charityevents_db` 下的 **4 张表**；有 EER 图就展开，没有就逐个点开表看字段。
3. 滚动 SQL 文件，停在 `CREATE TABLE events` 与两条 `FOREIGN KEY` 约束处。
4. 最后展示 `INSERT` 那一大段种子数据（12 条 events）。

**🎙 口播**
> Let's start with the **data layer**. I designed a normalised schema called `charityevents_db` with four tables.
>
> **`organisations`** stores the charity itself — name, mission and contact details. **`categories`** lists the event types, such as Fun Run, Gala Dinner and Silent Auction, each with a slug, an icon and a theme colour used by the interface. **`events`** is the core table: it holds the name, description, purpose, start and end date, venue, price, the fundraising goal, how much has been raised so far, and an `is_suspended` flag. And **`registrations`** is included now so the schema is ready for Assessment 3, where ticket purchasing will be added.
>
> The `events` table has **foreign keys** to `organisations` and `categories`, so referential integrity is enforced at the database level. One organisation can host many events, and one category can classify many events — a one-to-many relationship in both cases.
>
> Two design decisions are worth explaining. **First**, I do **not** store "past" or "upcoming" as a column. Instead, the API derives it by comparing `event_date` with `NOW()`, so the site stays correct as time passes, with no manual updates. **Second**, when an event breaches policy, I set `is_suspended` to one — the row stays in the database for the record, but it's filtered out of every public listing.
>
> I seeded **twelve realistic events across six categories**, and I generate their dates relative to `CURDATE()`, so there are always upcoming, past and suspended examples to demonstrate.

---

### 第 2 段 · RESTful API 设计 + 测试（3:00 – 5:45）

**🖥 操作**
1. 切到 VS Code → `api/event_db.js`：指向 `createPool`、`query()`、`require('dotenv').config()`。
2. 切到 `api/server.js`：慢慢滚过 5 个 `app.get(...)` 路由。
3. 切到浏览器标签 3（`http://localhost:3000/api/events/home`）→ 显示 JSON。
4. 依次在地址栏输入并展示：
   - `http://localhost:3000/api/events?category=2` → 2 条（两场 Gala Dinner）
   - `http://localhost:3000/api/categories` → 6 条
   - `http://localhost:3000/api/events/1` → 单条详情
   - 校验演示：`http://localhost:3000/api/events?date=abc` → **400** 报错 JSON

**🎙 口播**
> Next, the **connection layer**. `event_db.js` is the only file that talks to MySQL. It reads credentials from a `.env` file — which is git-ignored, so my password never reaches the repository — and it creates a **connection pool** rather than a single connection, so the server can handle several browser requests at the same time. The `query` helper wraps `pool.execute` and is used by every endpoint.
>
> Now the API itself, in `server.js`. I built **five read-only, resource-oriented endpoints** using Express.
>
> `GET /api/events/home` returns active, upcoming events for the home page, joined with their category and organisation. `GET /api/events` is the **search endpoint** — it accepts three optional query parameters, `category`, `location` and `date`, and builds the WHERE clause dynamically, so any combination works. `GET /api/events/:id` returns the full detail of one event, including a computed `is_past` flag. And `GET /api/categories` and `GET /api/locations` feed the two dropdowns on the search page.
>
> Two things about the design: **all SQL uses parameterised queries** with question-mark placeholders, which prevents SQL injection; and **every route validates its input** — for example, a non-numeric category or a malformed date returns a **400** with a clear JSON message instead of crashing.
>
> Let me test that live. `/api/events/home` — you can see the events returned as JSON. Now the search filter: `?category=2` returns only the two gala dinners. `/api/categories` gives the six categories for the dropdown. And `/api/events/1` gives one event with its organisation details. Finally, validation: if I send a malformed date, the API returns a 400 with a readable error message instead of failing.

---

### 第 3 段 · 数据流：客户端 ↔ API（5:45 – 8:30）

**🖥 操作**
1. VS Code → `client/js/config.js`（1 行 `API_BASE`）。
2. VS Code → `client/js/api.js`：指向 `apiGet()` 里的 `fetch` 与 `if (!response.ok ...) throw`。
3. VS Code → `client/js/home.js`：指向 `await apiGet('/api/events/home')` 与 `grid.innerHTML = data.events.map(renderEventCard).join('')`。
4. 切回浏览器首页 + **DevTools → Network**，按 `F5` 刷新 → 点 `home` 请求 → 看 **Response** 的 JSON。
5. 切到 **Elements** 面板 → 展开 `<div class="events-grid">` → 看到生成的 `<article class="event-card">`。

**🎙 口播**
> Now let's trace the **data flow** from the API into the page. Every page shares two scripts. `config.js` holds the API base URL in one place, and `api.js` contains a small fetch wrapper called `apiGet`. `apiGet` calls `fetch`, parses the JSON, and if the response is not OK, it **throws an error with the message from the server**, so the interface can show something readable.
>
> On the home page, `home.js` calls `apiGet('/api/events/home')`. While the request is in flight it shows **loading skeletons**. When the response arrives, it maps each event through a shared `renderEventCard` function and writes the result into the events grid as HTML. If there are no events, it shows an **empty state**; if the request fails, it shows an **error message** — all through DOM manipulation.
>
> The search page works the same way but with filters: `search.js` reads the three form controls, builds a query string containing **only the chosen filters**, and calls the API with it. The event page reads the id from the **URL query string** — `event.html?id=3` — and requests `/api/events/3`.
>
> Let me show this live. Here in the Network tab is the fetch request to `/api/events/home` — status 200 — and here is the **JSON response**. Switching to the Elements tab, here is the same data **already rendered into the DOM** as event cards.
>
> So the full chain is: **user action → fetch request → Express route → parameterised SQL query → JSON response → DOM rendering**.

---

### 第 4 段 · 实机演示：Home 首页（8:30 – 9:30）

**🖥 操作**
1. 切到首页，从顶部慢慢往下滚。
2. 停在动态事件卡片区，鼠标依次划过 2–3 张卡片的进度条。
3. 点第一张卡片的 **"View details →"**。

**🎙 口播**
> Now the live website. This is the **home page**. At the top, the hero introduces the organisation and the "Passing the Torch" theme — a deep cool background with a bright torch, which I kept **static** by design. Below are the impact statistics and the mission statement, which are static content.
>
> Further down is the **dynamic part**: the upcoming events list. These cards are **not hard-coded** — they come from the API. Each card shows the category, the artwork, the date and time, the venue, the ticket price, and a **live progress bar** of funds raised against the goal. Notice it correctly **excludes past events and the suspended event**. I'll click this event to open its detail page.

---

### 第 5 段 · 实机演示：Search 搜索（9:30 – 12:00）★ 重点

**🖥 操作**
1. 切到**搜索页**（此时应已显示全部 8 个活动）。
2. 打开 **Category** 下拉 → 选 **🥂 Gala Dinner** → 点 **Search** → 结果变 2 条。
3. 再打开 **Location** 下拉 → 选 **The Grand Pavilion** → 点 **Search** → 结果变 1 条（多条件组合）。
4. 演示**空结果**：把 **Date** 设成一年后（如 `2027-12-31`）→ 点 **Search** → 显示 empty state 提示。
5. 点 **Clear** → 三个条件被重置，恢复完整列表（DOM 操作）。
6. 演示**校验**：地址栏直接输入 `http://localhost:3000/api/events?date=abc` → 显示 400 错误 JSON。
7. （可选）DevTools → Network → 勾 **Offline** → 回搜索页点 **Search** → 页面显示错误提示 → 取消 Offline。

**🎙 口播**
> Here is the **search page**. The **Category** and **Location** dropdowns were populated at load time from `/api/categories` and `/api/locations`. On load it also shows all active events.
>
> I can filter by **any combination of the three criteria**. Let me choose "Gala Dinner" — the results update to two events. Now I'll add a location, "The Grand Pavilion" — only one event remains. And I can also add a date, which returns events on or after that day. That's the multiple-criteria search the brief asks for.
>
> Here's the **empty state**: if I choose a date with no matches, the page tells the user clearly, instead of showing a blank screen. And here's the **Clear Filters** button — it resets all three fields and re-runs the search, giving me back the full list.
>
> Now **validation**. The search endpoint validates its inputs on the **server**. If I send a malformed date directly to the API, it returns a **400** with a readable message rather than crashing. On the client side, if the API can't be reached, `apiGet` throws and the page shows a clear **error message** through basic DOM manipulation — [optional: switch Network to Offline, click Search] as you can see here.

---

### 第 6 段 · 实机演示：Event 详情 + 弹窗（12:00 – 13:00）

**🖥 操作**
1. 停在事件详情页，先看顶部 badge/标题/meta。
2. 滚到右侧 **Goal vs. Progress** 面板，指向进度条数字。
3. 在注册表单随便填 Name / Email / Tickets（不用真提交买票）。
4. 点 **Register** → 弹出 modal **"This feature is currently under construction."** → 点 **Got it** 关闭。

**🎙 口播**
> This is the **event detail page**. It only ever shows the event chosen from the home or search page, because the **id is passed in the URL query string**. At the top are the category badge, the title, the date and time, the venue and the ticket price. Below are the full description and the purpose — the cause that the money supports. On the right is the **Goal versus Progress** panel: the amount raised, the goal, the percentage funded, and how much is left to go.
>
> Finally, the **registration form** with name, email and ticket count, and the **Register** button. As specified in the brief, clicking Register shows a **modal** stating that the feature is currently under construction — ticket purchasing will be built in Assessment 3.

---

### 第 7 段 · 收尾（13:00 – 13:45）

**🖥 操作**
1. 切到 GitHub 提交历史页（`/commits/main`），慢慢滚动展示多条 commit。
2. 回到首页，结束。

**🎙 口播**
> To summarise: I designed and developed a **normalised MySQL database**, a **RESTful Express API**, and a **dynamic client-side website** that consumes it using HTML, CSS and vanilla JavaScript — **no client-side frameworks, no CDN assets and no template engine**; the server only ever returns JSON.
>
> Throughout the project I committed my work **regularly to GitHub**, with a clear message on every commit — you can see that history in the repository — and my full analysis and design are documented in the project report.
>
> **GenAI declaration:** *(读你实际使用的那一条，二选一)*
> - 用过 GenAI：*"I acknowledge that I have used GenAI tools to complete this assessment. I used `[tool name]` to `[purpose, e.g. brainstorm ideas and check grammar]` within the parameters outlined in the Assessment Brief and by the Unit Assessor."*
> - 没用过：*"I acknowledge that I have not knowingly used GenAI to complete this assessment."*
>
> Thank you for watching.

---

## 3. 录后检查清单
- [ ] 时长 **≤ 15:00**（建议 13–14 分钟）。
- [ ] 视频里能清楚看到：**SQL 表结构**、**Express 路由代码**、**API 返回的 JSON**、**三个页面的实机操作**、**搜索的筛选 + 校验**、**GitHub 提交记录**。
- [ ] 全程有**声音**，语速正常，没有长时间静音。
- [ ] 上传到 **SCU OneDrive** → 生成**可共享链接**（Anyone with the link）。
- [ ] 链接写进 Blackboard 提交（连同报告、两个 zip、GitHub 链接）。
- [ ] 录完之后**不要改**演示过的数据库/代码（可能会被要求现场复现）。

---

## 4. 老师可能的追问 & 答题要点

| 问题 | 答题要点 |
|---|---|
| 为什么把 past/upcoming 算出来而不是存字段？ | 状态随时间变化，存字段需要每天维护；用 `event_date` 对比 `NOW()` 永远正确。 |
| 搜索支持多条件是怎么实现的？ | 三个可选参数，动态拼接 `WHERE` 条件数组，未选的条件直接不加入。 |
| 怎么防止 SQL 注入？ | 全部使用 `?` 占位符的**参数化查询**（`pool.execute`），从不拼接用户输入。 |
| 为什么用连接池？ | 复用连接、支持并发请求，比每次新建连接高效。 |
| 事件 id 怎么在页面间传递？ | URL 查询字符串 `event.html?id=3`，可收藏、可刷新、可分享。 |
| `is_suspended` 有什么用？ | 违规活动保留数据但不进入任何公开列表（首页/搜索）。 |
| 为什么用原生 JS 不用框架？ | 题目要求只用 HTML/CSS/JS；`fetch` + Promise + DOM 已足够。 |
| Goal vs Progress 怎么算？ | `raised_amount / goal_amount` 取整并限制在 0–100%，满额显示特殊样式。 |
| Assessment 3 会加什么？ | POST 注册/购票（`registrations` 表已建好）、后台管理端。 |

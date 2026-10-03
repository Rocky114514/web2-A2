# 填写指南 — PROG2002 A2 Report + Storyboard

> 对应你上传的两份模板：**PROG2002 A2 Report.docx**（项目报告）和 **Storyboard-template.docx**（界面分镜）。
> 下面每一节都给出：**这一节要写什么（中文提示）** + **可直接粘贴的英文草稿**（按你实际项目 Emberlight Foundation / Passing the Torch / `charityevents_db` 定制）。
> 记得全文用 **Arial 12pt、1.5 倍行距**（Assessment Brief 要求）。

---

# 一、PROG2002 A2 Report.docx

## 0. 封面信息
| 字段 | 填什么 |
|---|---|
| Student ID / Last Name / First Name | 你的学号、姓、名 |
| Title of the project | `Emberlight Foundation — "Passing the Torch": A Dynamic Charity Events Website` |

---

## 1. Introduction/Motivation
**要写什么**：项目背景 + 你为什么做它（动机）+ 它覆盖了哪些技术栈（对应 ULO1/ULO3）。约 150–200 词。

**可粘贴草稿**
> Charitable organisations rely on events — fun runs, gala dinners, silent auctions and concerts — to raise both funds and awareness. However, discovering those events and understanding their impact is often difficult: information is scattered across social media, flyers and separate web pages, and supporters rarely see how close an event is to its fundraising goal.
>
> This project, *Passing the Torch*, is motivated by that gap. I wanted to build a single, trustworthy place where the public can discover active charity events in their city, filter them by what matters to them, and immediately see the real impact of a donation. The project also motivated me to apply the complete client–server stack taught in PROG2002: a MySQL data layer, a RESTful API built with Node.js and Express, and a dynamic client-side website built with pure HTML, CSS and JavaScript.

---

## 2. Problem Statement
**要写什么**：明确列出要解决的具体问题（3–4 条），并点出"为什么必须是动态网站"。约 150–200 词。

**可粘贴草稿**
> The case study requires a platform that connects a charitable organisation with potential attendees. Four practical problems must be solved:
>
> 1. **Discoverability.** Supporters cannot easily find events that match their interests — a particular cause, a date they are free, or a location near them.
> 2. **Transparency.** Fundraising progress is usually invisible. Donors cannot see how much has been raised against a goal, which weakens both trust and motivation.
> 3. **Time-sensitive data.** Events continuously move from *upcoming* to *past* as dates pass. A hard-coded page would become inaccurate and require constant manual maintenance.
> 4. **Policy compliance.** An event may breach policy and must be withheld from the public, but its record still needs to be kept for accountability.
>
> In addition, the website must be **dynamic**: event data has to live in a database and be delivered to the browser through APIs, rather than being written directly into the HTML.

---

## 3. Solution
**要写什么**：你的三层架构方案 + **客户端与服务器如何通信**（模板明确提示 "May relate to the client and server communication concept"）。约 200–250 词。

**可粘贴草稿**
> I designed and built a dynamic, three-tier website for a fictional charity, the **Emberlight Foundation**.
>
> - **Data layer (MySQL).** A normalised database, `charityevents_db`, models the domain with four tables: `organisations`, `categories`, `events` and `registrations`.
> - **Server layer (Node.js + Express).** A read-only RESTful API exposes the data as JSON through five resource-oriented endpoints. Every route validates its input and uses parameterised SQL to prevent injection.
> - **Client layer (HTML, CSS, JavaScript).** Three pages — Home, Search and Event Details — consume the API with `fetch` and the DOM. No CSS or JavaScript frameworks and no server-side template engine are used; the server returns only JSON and every page is a real HTML file.
>
> **Client–server communication.** The data flow is: a user action in the browser triggers a `fetch` request to an API endpoint; Express receives the request, executes a parameterised SQL query against MySQL through a connection pool, and returns a JSON response; the client then validates that response and renders it into the DOM. This separation means the presentation layer never talks to the database directly. Because the API is independent of the interface, the same endpoints could later serve a mobile app or an admin dashboard without any change to the data layer.

---

## 4. Web UX
**要写什么**：回答模板问题 *"How did you ensure the application is intuitive and easy to use? (e.g., wireframing, navigation)."* —— 用要点列出：导航、控件选择、反馈与错误处理、无障碍与响应式、线框图。约 200–250 词。

**可粘贴草稿**
> I aimed for an intuitive, low-friction experience, and planned every screen as a **storyboard** before writing any code (see the storyboard document).
>
> - **Consistent navigation.** A persistent top menu (Home / Find an Event) is present on every page, so users always know where they are and how to move between pages.
> - **Clear visual hierarchy.** The site uses a deliberate high-contrast identity — deep, cool backgrounds against a bright orange-gold flame ("Passing the Torch") — which creates a strong sense of purpose and draws the eye to the calls to action.
> - **The best input control for each data type.** On the search page, *category* and *location* are dropdowns (enumerated values fetched from the API, so an invalid value cannot be entered) and *date* uses a native date picker. Users may combine any of the three criteria, and a single **Clear Filters** button resets everything.
> - **Continuous feedback.** The interface always tells the user what is happening: loading skeletons while data is fetched, a clear empty state when a search returns nothing, and a readable error message if the API cannot be reached.
> - **Accessibility and responsiveness.** Semantic HTML landmarks, `aria-live` regions for search results, a keyboard-closable modal, visible focus styles, a mobile hamburger menu, and support for `prefers-reduced-motion`.
> - **Honest scoping.** The Register button opens a modal stating that the feature is under construction, which sets the correct expectation for users instead of showing a broken flow.

---

## 5. Data Schema
**要写什么**：高层数据模型 + 实体间关系（模板提示 "including the relationship between entities"）。建议：一段文字 + 一张 EER 图（用 MySQL Workbench 导出）+ 关系说明。

**可粘贴草稿（文字部分）**
> The database `charityevents_db` is normalised around four tables. The central entity is `events`.
>
> | Table | Purpose | Key columns |
> |---|---|---|
> | `organisations` | The charity that hosts events | `org_id` (PK), name, mission, contact details |
> | `categories` | Event types (Fun Run, Gala Dinner, Silent Auction…) | `category_id` (PK), name, slug, icon, theme_colour |
> | `events` | The core event record | `event_id` (PK), `org_id` (FK), `category_id` (FK), name, description, purpose, event_date, end_date, venue, price, goal_amount, raised_amount, is_suspended |
> | `registrations` | Reserved for Assessment 3 (ticket purchase) | `registration_id` (PK), `event_id` (FK), attendee details |
>
> **Relationships.** One organisation hosts **many** events, and one category classifies **many** events — both are one-to-many relationships enforced by foreign keys (`events.org_id → organisations.org_id`, `events.category_id → categories.category_id`). One event can later have many registrations (`registrations.event_id → events.event_id`). Because the foreign keys are declared with `InnoDB` constraints, referential integrity is enforced by the database itself.
>
> **Two design decisions.** First, *past* and *upcoming* are **not stored** as a column; they are derived at query time by comparing `event_date` with `NOW()`, so the status is always correct without manual maintenance. Second, the boolean `is_suspended` flag lets the charity withhold a policy-breaching event from all public listings while keeping its record in the database.

**建议插入**
- 在 MySQL Workbench 里 `Database → Reverse Engineer` 生成 **EER Diagram**，截图/导出 PNG 贴在下面；
- 或手绘一个简单 ER 图（方框 + 1—N 连线 + PK/FK 标注）。

**可粘贴的关系速写（如需纯文字版）**
```
organisations ──1 : N──▶ events ◀──N : 1── categories
                            │
                           1 : N
                            ▼
                      registrations
```

---

## 6. API design
**要写什么**：模板给了 3 个明确要求 —— (a) 列出主要端点；(b) 挑**一个**端点详述 purpose / request / response；(c) 解释 HTTP 方法的选择。

### (a) 端点清单（可粘贴）
> | Method | Endpoint | Purpose |
> |---|---|---|
> | `GET` | `/api/events/home` | Returns all active, upcoming events for the home page (joined with category and organisation). |
> | `GET` | `/api/events?category=&location=&date=` | Searches active events. All three filters are optional and may be combined. |
> | `GET` | `/api/events/:id` | Returns the complete detail of a single event, including a computed `is_past` flag. |
> | `GET` | `/api/categories` | Returns the event categories used to populate the search dropdown. |
> | `GET` | `/api/locations` | Returns the distinct venues of active events for the location dropdown. |

### (b) 单端点详述（以 `GET /api/events` 为例，可粘贴）
> **Endpoint:** `GET /api/events`
>
> **Purpose.** This is the search endpoint behind the Search page. It returns every *active* event — i.e. not suspended and not in the past — that matches the filters the user has chosen.
>
> **Request.** It is a `GET` request, so there is no request body. Filters are supplied as **optional query-string parameters**, and any combination (including none) is valid:
> - `category` — an integer category id, e.g. `?category=2`
> - `location` — a partial match against the city or the venue, e.g. `?location=Broadbeach`
> - `date` — events on or after this day, in `YYYY-MM-DD` format, e.g. `?date=2026-10-01`
>
> **Response.** A JSON object containing a `success` flag, a `count`, and an `events` array:
> ```json
> {
>   "success": true,
>   "count": 2,
>   "events": [
>     {
>       "event_id": 2,
>       "name": "Ignite the Night Gala",
>       "category_name": "Gala Dinner",
>       "event_date": "2026-10-25 18:00:00",
>       "venue": "The Grand Pavilion",
>       "city": "Gold Coast",
>       "price": "150.00",
>       "currency": "AUD",
>       "goal_amount": "120000.00",
>       "raised_amount": "96000.00"
>     }
>   ]
> }
> ```
> **Validation and errors.** If `category` is not a positive integer, or `date` is not in `YYYY-MM-DD` format, the endpoint returns **HTTP 400** with `{ "success": false, "message": "…" }`. If the event id in `/api/events/:id` does not exist, it returns **404**. Unexpected server errors return **500** with a generic message, so internal details are never leaked.
>
> **Security.** All SQL uses parameterised statements (`pool.execute(sql, params)` with `?` placeholders); user input is never concatenated into the query string, which prevents SQL injection.

### (c) HTTP 方法的选择（可粘贴）
> Every endpoint in Assessment 2 uses **`GET`**, for three reasons. First, the website only *reads* data in this assessment — there is nothing to create, update or delete. Second, `GET` is **safe and idempotent**: issuing the same request repeatedly has no side effects, which is exactly the semantics of a search or a lookup. Third, it makes responses **cacheable** and keeps the URLs shareable and bookmarkable (for example, `event.html?id=3`).
>
> `POST`, `PUT`, `PATCH` and `DELETE` are deliberately **out of scope** for this assessment. In Assessment 3, `POST /api/registrations` will be added to handle ticket purchase, together with `PUT`/`DELETE` for the admin side.

---

## 7. Gen AI acknowledgement and Chat Log
**要写什么**：模板要求"二选一，删掉另一个"。

- **用过 GenAI**（保留第 1 条并补全）：
  > I acknowledge that I have used GenAI tools to complete this assessment. I used **`<工具名，例如 ChatGPT / DeepSeek>`** to **`<具体用途，例如 brainstorm the database schema, explain Express routing concepts, and check the grammar of my report>`** within the parameters outlined in the Assessment Brief and by the Unit Assessor.
- **没用过**（保留第 2 条）：
  > I acknowledge that I have not knowingly used GenAI to complete this assessment.

> ⚠️ 标题里包含 **"Chat Log"**，所以如果你选第 1 条，**请把与 AI 的对话记录附在报告后面**（截图或复制文本）。同时注意 Brief 的限制：GenAI 允许用于头脑风暴、语法检查、改写、排版、设计版式；**不允许**直接生成报告正文或代码后粘贴。请如实声明。

---

# 二、Storyboard-template.docx

## 模板字段说明

| 字段 | 填什么 |
|---|---|
| `TITLE:` | 该页面名称，如 `Home Page` |
| `SCREEN ID:` | 编号，如 `HOME-01` |
| `DATE:` | 设计日期 |
| `Elements:` | 画一个简单的线框草图（方框代表区块，标出文字与按钮位置） |
| `Description:` | 这个界面是干什么的（一句话） |
| `Content:` | 界面上出现哪些内容、数据来自哪里 |
| `Interactions:` | 用户能做什么操作 |
| `Media Creation:` | 你**自己创作**的媒体/图形素材（不是网上下载的） |
| `Navigation:` | 从这个界面可以去到哪里 |

**操作提示**：一个界面复制一份这个表格（连同标题行）。至少做 **3 屏**：`HOME-01` / `SEARCH-02` / `DETAILS-03`。

---

## Storyboard 1 — HOME-01
- **TITLE:** Home Page
- **SCREEN ID:** HOME-01
- **Elements:** 顶部固定导航（火焰 Logo + 站点名 + Home / Find an Event）；Hero 区（小标题 + 大标题 "PASS THE TORCH. LIGHT THE DARK." + 说明 + 两个按钮 + 静态火炬插画）；4 个数据条；使命区（标题 + 3 张卡片）；**动态活动卡片网格**；号召横幅；页脚（联系方式/链接）。

| 字段 | 内容 |
|---|---|
| **Description** | The landing page. It introduces the charity and dynamically lists all active and upcoming charity events. |
| **Content** | Static: organisation mission, contact details and impact statistics. Dynamic: event cards fetched from `GET /api/events/home` (name, category, date/time, venue, price, funds raised vs goal). |
| **Interactions** | Use the top menu; click "Find an event" to open the Search page; hover a card; click a card's title or "View details" to open the Event Details page; toggle the mobile hamburger menu. |
| **Media Creation** | Custom inline **SVG torch and flame logo**; CSS **gradient "scenes"** for each event category (no stock photography); emoji category icons; flame-gradient display typography; a **static** (non-animated) hero torch. |
| **Navigation** | → `SEARCH-02` (menu, hero CTA, footer); → `DETAILS-03` (event card); → on-page anchor to the Mission section. |

---

## Storyboard 2 — SEARCH-02
- **TITLE:** Search Events Page
- **SCREEN ID:** SEARCH-02
- **Elements:** 页头标题；筛选表单卡（Category 下拉、Location 下拉、Date 选择器、Search 按钮、Clear 按钮）；结果标题 + 结果数量；消息区（错误/空结果提示）；结果卡片网格。

| 字段 | 内容 |
|---|---|
| **Description** | Lets a visitor discover active charity events by combining three search criteria. |
| **Content** | Dropdown options loaded from `GET /api/categories` and `GET /api/locations`; result cards loaded from `GET /api/events` (filtered). A results counter shows how many events matched. |
| **Interactions** | Choose any combination of category, location and date; submit the form to re-query the API; click **Clear Filters** to reset all fields and re-run the search; click a result to open its detail page; observe empty-state and error messages. |
| **Media Creation** | Reuses the event-card artwork (CSS gradients + emoji); skeleton loading placeholders; alert/empty-state styling; consistent form-control styling. |
| **Navigation** | → `HOME-01` (menu); → `DETAILS-03` (result card, passing `?id=`). |

---

## Storyboard 3 — DETAILS-03
- **TITLE:** Event Detail Page
- **SCREEN ID:** DETAILS-03
- **Elements:** 活动页头（分类徽章、标题、日期/时间/地点/票价）；左栏（About this event、Why it matters）；右栏（Goal vs. Progress 进度条、Register 表单、Hosted by）；"under construction" 弹窗。

| 字段 | 内容 |
|---|---|
| **Description** | Shows the complete detail of the single event the visitor selected from the Home or Search page, and invites them to register. |
| **Content** | Loaded from `GET /api/events/:id` — category, name, full description, purpose, start and end date/time, venue and address, ticket price, funds raised vs goal, and the hosting organisation. |
| **Interactions** | Read the details; fill in name, email and ticket count; click **Register** to open the modal; close the modal with the button, the backdrop, or the Escape key. |
| **Media Creation** | Animated goal-progress bar (fills on load); badge styling for past/suspended events; modal dialog styling; the same custom SVG/gradient visual language as the other screens. |
| **Navigation** | → `HOME-01` / `SEARCH-02` (menu); modal closes back to the same page. Ticket purchasing is intentionally out of scope until Assessment 3. |

---

## ⭐ `ELEMENTS` 四个格子怎么填（GRAPHICS / TEXT / AUDIO-VIDEO / NOTES）

模板的 `ELEMENTS:` ① 区是一个**多媒体元素清单**（四格），描述"这一屏由哪些元素构成"；下面那 5 行表格才是叙述性的设计说明。分工如下：

| 格子 | 填什么 | 不要写什么 |
|---|---|---|
| **GRAPHICS** | 视觉/图形元素：图片、图标、插画、图表、配色、版式、按钮与徽章样式 | 不要重复 TEXT 里的文案 |
| **TEXT** | 屏幕上出现的**所有文字**：标题、副文、按钮文字、标签、数字 —— **务必标注 Static / Dynamic（来自 API）** | 不要描述颜色和布局 |
| **AUDIO/VIDEO** | 音频/视频媒体。**本项目完全没有** → 如实写 `N/A — no audio or video media is used.` | ❌ 不要编造不存在的音视频 |
| **NOTES** | 数据来源、交互/动画行为、空/错误状态、无障碍、响应式、设计理由 | — |

### HOME-01

**GRAPHICS**
- Custom inline **SVG flame logo** (header + footer) and a custom **SVG torch illustration** in the hero, filled with an orange-gold gradient.
- Layered **radial-gradient background** with a cinematic **vignette** (chiaroscuro light-and-shadow).
- Four **stat blocks** with flame-gradient numerals; three **feature cards** with emoji icons.
- Dynamic **event-card** artwork: a per-category **CSS gradient banner** + emoji icon + category badge + a **gradient progress bar**.
- Sticky translucent header (background blur) with an animated underline on nav links.
- Palette: deep navy `#04060d–#17233d` background + ember gradient `#ff6a00 → #ff9d2e → #ffd166`.

**TEXT**
- *Static:* organisation name "Emberlight Foundation"; nav "Home / Find an Event"; hero kicker "Charity Events · Gold Coast"; headline "PASS THE TORCH. LIGHT THE DARK."; hero subtitle; buttons "Find an event →" / "Our mission"; four statistics (13 / $2.4M / 6,800+ / 120+); mission heading and three feature titles + descriptions; CTA band; footer contact text.
- *Dynamic (from `GET /api/events/home`):* for each card — event name, category name, date + time, venue + city, "$X raised", "N% of goal", ticket price, "View details →".
- All dynamic text is injected with HTML-escaping to prevent XSS.

**AUDIO/VIDEO**
- **N/A — no audio or video media is used on this screen.** The hero "torch" is a static **SVG illustration**, not a video, and the site deliberately plays no background audio (better performance, and no unexpected sound for the user).

**NOTES**
- Data source: `GET /api/events/home` — active, non-suspended, upcoming events only.
- States: loading **skeletons** while fetching · **empty state** when there are no events · a readable **error message** if the API is unreachable.
- The hero torch is intentionally **static** (the flicker animation was removed) — a deliberate, calmer design choice.
- Accessibility: `aria-live` on the events grid, semantic landmarks, visible focus styles, `prefers-reduced-motion` support.
- Responsive: grid goes 3 columns → 2 → 1; mobile hamburger menu below 640px.

### SEARCH-02

**GRAPHICS**
- Same header/footer flame logo; an elevated **filter card** with a drop shadow.
- Three consistently styled **form controls** (two `<select>` dropdowns, one native date picker) plus a **flame-gradient Search** button and an **outline Clear** button.
- Result cards reuse the home-page event-card artwork; **skeleton** placeholders while loading; **alert / empty-state** styling.

**TEXT**
- *Static:* page title "Find your cause"; subtitle; field labels "Category", "Location", "Date (on or after)"; buttons "Search" / "Clear"; heading "Results".
- *Dynamic:* dropdown options from `GET /api/categories` (icon + name) and `GET /api/locations` (venue names); results counter "**N** events found"; result-card text; empty-state and error messages.

**AUDIO/VIDEO**
- **N/A — no audio or video media is used on this screen.**

**NOTES**
- All three filters are **optional and combinable**; only the chosen ones are added to the query string sent to `GET /api/events`.
- **Clear Filters** resets all three controls and re-runs the search (basic DOM manipulation).
- Validation at two levels: control types on the client, and server-side checks that return **HTTP 400** for bad input; the page then displays the returned message.
- Both the **empty state** and the **error state** are explicitly designed, so the user is never left with a blank screen.
- Dropdowns are used instead of free text, so an invalid value cannot be entered.

### DETAILS-03

**GRAPHICS**
- Event hero band with a **category badge** (three variants: ember / grey "past" / red "suspended").
- A **Goal vs. Progress** bar whose gradient fill turns green at 100 %+.
- Two-column layout (main panels + side panels) and a **modal dialog** with a flame icon.
- Same header/footer logo and palette as the other screens.

**TEXT**
- *Dynamic (from `GET /api/events/:id`):* badge text; event title; meta line (date, time, venue + suburb + postcode, ticket price); "About this event" description; "Why it matters" purpose; "Raised" / "Goal" amounts; "N% funded"; "$X to go"; ticket price; host organisation name and mission.
- *Static:* panel titles; form labels "Full name", "Email", "Tickets"; the "Register" button; modal text "This feature is currently under construction."; the "Got it" button.

**AUDIO/VIDEO**
- **N/A — no audio or video media is used on this screen.**

**NOTES**
- The selected event id is passed in the **URL query string** (`event.html?id=3`) and fetched with `GET /api/events/:id`, so the page is bookmarkable and refresh-safe.
- The progress bar fills on load; at 100 %+ it switches to a "goal reached" style.
- The register form is intentionally **non-functional**: submitting it opens the "under construction" **modal**, because ticket purchase is delivered in Assessment 3.
- The modal closes via the button, the backdrop, or the **Escape** key, and is marked `aria-modal`.
- Past and suspended events display distinct badge styles (still reachable by direct URL).

> 💡 **一句话原则**：`GRAPHICS` 写"看到什么图形"，`TEXT` 写"读到什么文字（标静/动）"，`AUDIO/VIDEO` 如实写 `N/A`，`NOTES` 写"它怎么运作、为什么这样设计"。

---

# 三、提交前检查

- [ ] 报告全文 **Arial 12pt、1.5 倍行距**。
- [ ] 报告里已插入：**EER 数据模型图** + **三个页面的截图**（Home / Search / Details）。
- [ ] Storyboard 至少 **3 屏**，每屏都填满 5 个字段（Description / Content / Interactions / Media Creation / Navigation）。
- [ ] GenAI 声明**二选一**并处理干净（删掉没选的那条）；若选"用过"，**附上 Chat Log**。
- [ ] 文件名/提交物：报告、`usernameA2-clientside.zip`、`usernameA2-api.zip`、GitHub 链接、视频链接。

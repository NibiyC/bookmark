import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://bmbkahvhqdhbrzbyonuu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtYmthaHZocWRoYnJ6YnlvbnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwOTY2MTksImV4cCI6MjA5MjY3MjYxOX0.RW09_EOPzuPHNPOdD2yb44iCOSksqkwRr1mBXEMokcE";
const ADMIN_EMAIL = "2565667747@qq.com";

/*
  这里就是方案 A 的动画入口。
  你以后从 LottieFiles 复制 JSON 动画链接后，填到下面三个位置即可。

  例如：
  sidebar: "https://assets10.lottiefiles.com/packages/lf20_xxx.json"

  现在我先留空，所以页面不会加载任何外部动画，也不会出现丑东西。
*/
const LOTTIE_ANIMATIONS = {
  sidebar: "",
  intro: "",
  empty: ""
};

const DEFAULT_TEXT_ROWS = [
  ["brand.title", "我的书签", "左侧顶部网站名称"],
  ["brand.subtitle", "安静、柔和、实时同步", "左侧顶部副标题"],

  ["sidebar.groupTitle", "分组", "左侧分组标题"],
  ["sidebar.tipTitle", "管理提示", "左侧底部提示标题"],
  ["sidebar.tipDesc", "管理员可新增分组、编辑分组，并在左侧直接拖动调整顺序。", "左侧底部提示内容"],

  ["top.allTitle", "全部书签", "全部分组标题"],
  ["top.loadingSubtitle", "正在加载收藏内容", "加载时副标题"],
  ["top.allSubtitle", "共 {count} 个收藏", "全部书签数量文案"],
  ["top.categorySubtitle", "当前分组 {count} 个收藏", "当前分组数量文案"],
  ["top.searchSubtitle", "当前显示 {count} 个名称匹配结果", "搜索结果数量文案"],

  ["sync.connecting", "正在连接...", "同步连接中"],
  ["sync.online", "实时同步", "同步正常"],
  ["sync.partial", "部分同步", "部分同步"],
  ["sync.bookmarkError", "书签同步异常", "书签同步错误"],
  ["sync.categoryError", "分组同步异常", "分组同步错误"],
  ["sync.notConfigured", "数据库未配置", "数据库未配置"],
  ["sync.readError", "读取失败", "读取失败"],

  ["admin.badge", "管理员模式", "管理员模式标签"],
  ["admin.loginButton", "管理员登录", "登录按钮"],
  ["admin.logoutButton", "退出", "退出按钮"],
  ["admin.textButton", "页面文案", "页面文案管理按钮"],

  ["intro.title", "把常用网站放进一个舒服、柔和的收藏空间。", "介绍卡片标题"],
  ["intro.desc", "访客点击卡片直接打开书签；管理员登录后可以维护书签和分组，并实时同步给所有访问者。", "介绍卡片描述"],

  ["search.placeholder", "搜索书签名称...", "搜索框占位文字"],
  ["search.idle", "输入名称试试看", "搜索默认提示"],
  ["search.found", "找到 {count} 个", "搜索找到结果"],
  ["search.empty", "没有找到", "搜索无结果"],

  ["bookmark.addButton", "＋ 新增书签", "新增书签按钮"],
  ["bookmark.openHint", "点击打开 →", "访客卡片打开提示"],
  ["bookmark.emptyDesc", "暂无简介", "书签无简介时显示"],

  ["empty.title", "还没有书签", "空状态标题"],
  ["empty.desc", "登录管理员后，可以先添加第一条收藏。", "空状态描述"],

  ["login.title", "管理员登录", "登录弹窗标题"],
  ["login.desc", "登录后可以新增、编辑、删除书签，也可以维护左侧分组。", "登录弹窗描述"],
  ["login.emailLabel", "邮箱", "邮箱字段名"],
  ["login.emailPlaceholder", "请输入邮箱", "邮箱占位文字"],
  ["login.passwordLabel", "密码", "密码字段名"],
  ["login.passwordPlaceholder", "请输入密码", "密码占位文字"],
  ["login.submit", "登录", "登录提交按钮"],

  ["bookmarkForm.addTitle", "新增书签", "新增书签弹窗标题"],
  ["bookmarkForm.editTitle", "编辑书签", "编辑书签弹窗标题"],
  ["bookmarkForm.desc", "卡片上只展示名称和简介，链接仅用于点击打开。", "书签弹窗描述"],
  ["bookmarkForm.nameLabel", "名称", "书签名称字段名"],
  ["bookmarkForm.namePlaceholder", "请输入书签名称", "书签名称占位文字"],
  ["bookmarkForm.urlLabel", "链接", "书签链接字段名"],
  ["bookmarkForm.urlPlaceholder", "https://example.com", "书签链接占位文字"],
  ["bookmarkForm.descLabel", "简介", "书签简介字段名"],
  ["bookmarkForm.descPlaceholder", "请输入简介", "书签简介占位文字"],
  ["bookmarkForm.categoryLabel", "分组", "书签分组字段名"],
  ["bookmarkForm.save", "保存", "保存书签按钮"],

  ["categoryForm.addTitle", "新增分组", "新增分组弹窗标题"],
  ["categoryForm.editTitle", "编辑分组", "编辑分组弹窗标题"],
  ["categoryForm.desc", "这里只需要填写分组名称。创建后可在左侧直接拖动排序。", "分组弹窗描述"],
  ["categoryForm.nameLabel", "分组名称", "分组名称字段名"],
  ["categoryForm.namePlaceholder", "例如：AI 工具", "分组名称占位文字"],
  ["categoryForm.save", "保存分组", "保存分组按钮"],

  ["textForm.title", "页面文案", "页面文案弹窗标题"],
  ["textForm.desc", "这里可以修改页面上显示的主要文字。现在已经按区块分组，改起来更清楚。", "页面文案弹窗描述"],
  ["textForm.save", "保存文案", "页面文案保存按钮"],

  ["common.cancel", "取消", "取消按钮"],
  ["common.edit", "编辑", "编辑按钮"],
  ["common.delete", "删除", "删除按钮"],

  ["toast.loginSuccess", "管理员登录成功", "登录成功提示"],
  ["toast.notAdmin", "登录成功，但该账号不是管理员", "非管理员提示"],
  ["toast.logout", "已退出登录", "退出提示"],
  ["toast.bookmarkAdded", "已新增书签", "新增书签提示"],
  ["toast.bookmarkUpdated", "已更新书签", "更新书签提示"],
  ["toast.bookmarkDeleted", "已删除书签", "删除书签提示"],
  ["toast.categoryAdded", "已新增分组", "新增分组提示"],
  ["toast.categoryUpdated", "已更新分组", "更新分组提示"],
  ["toast.categoryDeleted", "已删除分组", "删除分组提示"],
  ["toast.categoryOrderUpdated", "分组顺序已更新", "分组排序提示"],
  ["toast.textSaved", "页面文案已保存", "文案保存提示"],
  ["toast.noPermission", "没有权限", "无权限提示"],
  ["toast.invalidUrl", "请输入正确的网址", "链接格式错误提示"],

  ["confirm.deleteBookmark", "确定删除「{title}」吗？", "删除书签确认"],
  ["confirm.deleteCategory", "确定删除分组「{name}」吗？该分组下的书签会移动到「其他」。", "删除分组确认"],

  ["setup.title", "还没有配置 Supabase。", "数据库未配置提示标题"],
  ["setup.desc", "请检查 Supabase URL、anon key 和管理员邮箱。", "数据库未配置提示描述"]
];

const TEXT_GROUP_META = {
  brand: { title: "品牌区", desc: "左侧顶部名称与副标题" },
  sidebar: { title: "左侧栏", desc: "分组标题、左下提示区域" },
  top: { title: "顶部栏", desc: "页面主标题与数量说明" },
  sync: { title: "同步状态", desc: "右上角实时同步相关文案" },
  admin: { title: "管理员区", desc: "登录 / 退出 / 页面文案按钮等" },
  intro: { title: "欢迎区", desc: "中间上方介绍卡片" },
  search: { title: "搜索区", desc: "搜索框与搜索反馈" },
  bookmark: { title: "书签卡片", desc: "新增按钮、卡片提示等" },
  empty: { title: "空状态", desc: "没有数据时显示的文案" },
  login: { title: "登录弹窗", desc: "管理员登录弹窗相关文案" },
  bookmarkForm: { title: "书签表单", desc: "新增 / 编辑书签弹窗文案" },
  categoryForm: { title: "分组表单", desc: "新增 / 编辑分组弹窗文案" },
  textForm: { title: "页面文案面板", desc: "当前这个页面文案管理弹窗" },
  common: { title: "通用按钮", desc: "取消 / 编辑 / 删除等通用文字" },
  toast: { title: "提示消息", desc: "保存成功、删除成功等提示" },
  confirm: { title: "确认弹窗", desc: "删除前确认提示" },
  setup: { title: "系统提示", desc: "数据库未配置等基础提示" },
  other: { title: "其他", desc: "未分类文案" }
};

const isConfigured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_PROJECT_ID") &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE");

const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const $ = (selector) => document.querySelector(selector);

const els = {
  themeOverlay: $("#themeOverlay"),

  setupNotice: $("#setupNotice"),
  setupNoticeTitle: $("#setupNoticeTitle"),
  setupNoticeDesc: $("#setupNoticeDesc"),

  brandTitle: $("#brandTitle"),
  brandSubtitle: $("#brandSubtitle"),
  sidebarGroupTitle: $("#sidebarGroupTitle"),
  sidebarTipTitle: $("#sidebarTipTitle"),
  sidebarTipDesc: $("#sidebarTipDesc"),

  sidebarLottieWrap: $("#sidebarLottieWrap"),
  sidebarLottie: $("#sidebarLottie"),
  introLottieWrap: $("#introLottieWrap"),
  introLottie: $("#introLottie"),
  emptyLottieWrap: $("#emptyLottieWrap"),
  emptyLottie: $("#emptyLottie"),

  loginOpenBtn: $("#loginOpenBtn"),
  logoutBtn: $("#logoutBtn"),
  adminBadge: $("#adminBadge"),
  textOpenBtn: $("#textOpenBtn"),

  themeToggle: $("#themeToggle"),

  addOpenBtn: $("#addOpenBtn"),
  addCategoryBtn: $("#addCategoryBtn"),

  groupList: $("#groupList"),
  searchShell: $("#searchShell"),
  searchInput: $("#searchInput"),
  searchFeedback: $("#searchFeedback"),

  currentTitle: $("#currentTitle"),
  currentSubtitle: $("#currentSubtitle"),

  realtimeDot: $("#realtimeDot"),
  syncStatus: $("#syncStatus"),

  introTitle: $("#introTitle"),
  introDesc: $("#introDesc"),

  bookmarkGrid: $("#bookmarkGrid"),
  emptyState: $("#emptyState"),
  emptyTitle: $("#emptyTitle"),
  emptyDesc: $("#emptyDesc"),
  toast: $("#toast"),

  loginDialog: $("#loginDialog"),
  bookmarkDialog: $("#bookmarkDialog"),
  categoryDialog: $("#categoryDialog"),
  textDialog: $("#textDialog"),

  loginForm: $("#loginForm"),
  loginEmail: $("#loginEmail"),
  loginPassword: $("#loginPassword"),
  loginDialogTitle: $("#loginDialogTitle"),
  loginDialogDesc: $("#loginDialogDesc"),
  loginEmailLabel: $("#loginEmailLabel"),
  loginPasswordLabel: $("#loginPasswordLabel"),
  loginCancelBtn: $("#loginCancelBtn"),
  loginSubmitBtn: $("#loginSubmitBtn"),

  bookmarkForm: $("#bookmarkForm"),
  bookmarkId: $("#bookmarkId"),
  titleInput: $("#titleInput"),
  urlInput: $("#urlInput"),
  descriptionInput: $("#descriptionInput"),
  categoryInput: $("#categoryInput"),
  formTitle: $("#formTitle"),
  bookmarkFormDesc: $("#bookmarkFormDesc"),
  bookmarkNameLabel: $("#bookmarkNameLabel"),
  bookmarkUrlLabel: $("#bookmarkUrlLabel"),
  bookmarkDescLabel: $("#bookmarkDescLabel"),
  bookmarkCategoryLabel: $("#bookmarkCategoryLabel"),
  bookmarkCancelBtn: $("#bookmarkCancelBtn"),
  bookmarkSaveBtn: $("#bookmarkSaveBtn"),

  categoryForm: $("#categoryForm"),
  categoryIdInput: $("#categoryIdInput"),
  categoryOldNameInput: $("#categoryOldNameInput"),
  categoryNameInput: $("#categoryNameInput"),
  categoryFormTitle: $("#categoryFormTitle"),
  categoryFormDesc: $("#categoryFormDesc"),
  categoryNameLabel: $("#categoryNameLabel"),
  categoryCancelBtn: $("#categoryCancelBtn"),
  categorySaveBtn: $("#categorySaveBtn"),

  textForm: $("#textForm"),
  textList: $("#textList"),
  textFormTitle: $("#textFormTitle"),
  textFormDesc: $("#textFormDesc"),
  textCancelBtn: $("#textCancelBtn"),
  textSaveBtn: $("#textSaveBtn"),
};

let bookmarks = [];
let categories = [];
let siteTextRows = [];
let texts = Object.fromEntries(DEFAULT_TEXT_ROWS.map(([key, value]) => [key, value]));

let currentCategory = "全部";
let currentUser = null;
let realtimeChannels = [];
let draggedCategoryId = null;
let highlightBookmarkId = null;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function t(key, params = {}) {
  let value = texts[key] ?? key;

  for (const [paramKey, paramValue] of Object.entries(params)) {
    value = value.replaceAll(`{${paramKey}}`, String(paramValue));
  }

  return value;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value = "") {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function normalizeUrl(url) {
  const value = url.trim();
  if (!value) return value;
  if (!/^https?:\/\//i.test(value)) return `https://${value}`;
  return value;
}

function isAdmin() {
  return currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

function showToast(message, type = "normal") {
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  els.toast.style.background = type === "error"
    ? "rgba(255, 90, 82, 0.96)"
    : "rgba(28, 28, 34, 0.94)";

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    els.toast.classList.add("hidden");
  }, 2200);
}

function applySiteTexts() {
  document.title = t("brand.title");

  els.brandTitle.textContent = t("brand.title");
  els.brandSubtitle.textContent = t("brand.subtitle");
  els.sidebarGroupTitle.textContent = t("sidebar.groupTitle");
  els.sidebarTipTitle.textContent = t("sidebar.tipTitle");
  els.sidebarTipDesc.textContent = t("sidebar.tipDesc");

  els.loginOpenBtn.textContent = t("admin.loginButton");
  els.logoutBtn.textContent = t("admin.logoutButton");
  els.adminBadge.textContent = t("admin.badge");
  els.textOpenBtn.textContent = t("admin.textButton");

  els.setupNoticeTitle.textContent = t("setup.title");
  els.setupNoticeDesc.textContent = t("setup.desc");

  els.introTitle.textContent = t("intro.title");
  els.introDesc.textContent = t("intro.desc");

  els.searchInput.placeholder = t("search.placeholder");
  els.searchFeedback.textContent = t("search.idle");
  els.addOpenBtn.textContent = t("bookmark.addButton");

  els.emptyTitle.textContent = t("empty.title");
  els.emptyDesc.textContent = t("empty.desc");

  els.loginDialogTitle.textContent = t("login.title");
  els.loginDialogDesc.textContent = t("login.desc");
  els.loginEmailLabel.textContent = t("login.emailLabel");
  els.loginPasswordLabel.textContent = t("login.passwordLabel");
  els.loginEmail.placeholder = t("login.emailPlaceholder");
  els.loginPassword.placeholder = t("login.passwordPlaceholder");
  els.loginCancelBtn.textContent = t("common.cancel");
  els.loginSubmitBtn.textContent = t("login.submit");

  els.bookmarkFormDesc.textContent = t("bookmarkForm.desc");
  els.bookmarkNameLabel.textContent = t("bookmarkForm.nameLabel");
  els.bookmarkUrlLabel.textContent = t("bookmarkForm.urlLabel");
  els.bookmarkDescLabel.textContent = t("bookmarkForm.descLabel");
  els.bookmarkCategoryLabel.textContent = t("bookmarkForm.categoryLabel");
  els.titleInput.placeholder = t("bookmarkForm.namePlaceholder");
  els.urlInput.placeholder = t("bookmarkForm.urlPlaceholder");
  els.descriptionInput.placeholder = t("bookmarkForm.descPlaceholder");
  els.bookmarkCancelBtn.textContent = t("common.cancel");
  els.bookmarkSaveBtn.textContent = t("bookmarkForm.save");

  els.categoryFormDesc.textContent = t("categoryForm.desc");
  els.categoryNameLabel.textContent = t("categoryForm.nameLabel");
  els.categoryNameInput.placeholder = t("categoryForm.namePlaceholder");
  els.categoryCancelBtn.textContent = t("common.cancel");
  els.categorySaveBtn.textContent = t("categoryForm.save");

  els.textFormTitle.textContent = t("textForm.title");
  els.textFormDesc.textContent = t("textForm.desc");
  els.textCancelBtn.textContent = t("common.cancel");
  els.textSaveBtn.textContent = t("textForm.save");

  renderTextEditor();
}

function setRealtimeStatus(status, textValue) {
  els.syncStatus.textContent = textValue;
  els.realtimeDot.classList.remove("online", "error");

  if (status === "online") {
    els.realtimeDot.classList.add("online");
  }

  if (status === "error") {
    els.realtimeDot.classList.add("error");
  }
}

function setAdminUI() {
  const admin = isAdmin();

  els.addOpenBtn.classList.toggle("hidden", !admin);
  els.addCategoryBtn.classList.toggle("hidden", !admin);
  els.textOpenBtn.classList.toggle("hidden", !admin);
  els.adminBadge.classList.toggle("hidden", !admin);
  els.logoutBtn.classList.toggle("hidden", !currentUser);
  els.loginOpenBtn.classList.toggle("hidden", !!currentUser);

  render();
}

function getSortedCategories() {
  return [...categories].sort((a, b) => {
    const sa = Number(a.sort_order ?? 0);
    const sb = Number(b.sort_order ?? 0);

    if (sa !== sb) return sa - sb;
    return String(a.name).localeCompare(String(b.name), "zh-CN");
  });
}

function getVisibleCategoryNames() {
  const result = [];
  const seen = new Set();

  result.push("全部");
  seen.add("全部");

  for (const category of getSortedCategories()) {
    if (category?.name && !seen.has(category.name)) {
      result.push(category.name);
      seen.add(category.name);
    }
  }

  for (const bookmark of bookmarks) {
    if (bookmark.category && !seen.has(bookmark.category)) {
      result.push(bookmark.category);
      seen.add(bookmark.category);
    }
  }

  if (!seen.has("其他")) {
    result.push("其他");
  }

  return result;
}

function getCategoryCount(name) {
  if (name === "全部") return bookmarks.length;
  return bookmarks.filter((item) => item.category === name).length;
}

function getFilteredBookmarks() {
  const q = els.searchInput.value.trim().toLowerCase();

  return bookmarks.filter((item) => {
    const categoryMatch = currentCategory === "全部" || item.category === currentCategory;
    const titleValue = String(item.title || "").toLowerCase();

    return categoryMatch && (!q || titleValue.includes(q));
  });
}

function updatePageMeta(filteredCount) {
  els.currentTitle.textContent = currentCategory === "全部" ? t("top.allTitle") : currentCategory;

  const searchText = els.searchInput.value.trim();

  if (searchText) {
    els.currentSubtitle.textContent = t("top.searchSubtitle", { count: filteredCount });
    return;
  }

  if (currentCategory === "全部") {
    els.currentSubtitle.textContent = t("top.allSubtitle", { count: bookmarks.length });
  } else {
    els.currentSubtitle.textContent = t("top.categorySubtitle", { count: filteredCount });
  }
}

function updateSearchFeedback(filteredCount) {
  const q = els.searchInput.value.trim();

  els.searchShell.classList.remove("searching", "no-results");

  if (!q) {
    els.searchFeedback.textContent = t("search.idle");
    return;
  }

  if (filteredCount > 0) {
    els.searchFeedback.textContent = t("search.found", { count: filteredCount });
    els.searchShell.classList.add("searching");
  } else {
    els.searchFeedback.textContent = t("search.empty");
    els.searchShell.classList.add("no-results");
  }
}

function updateCategoryIndicator() {
  const activeRow = els.groupList.querySelector(".group-row.is-active");
  const pill = els.groupList.querySelector(".group-active-pill");

  if (!activeRow || !pill) return;

  els.groupList.style.setProperty("--active-top", `${activeRow.offsetTop}px`);
  els.groupList.style.setProperty("--active-height", `${activeRow.offsetHeight}px`);
  els.groupList.style.setProperty("--active-opacity", "1");
}

function groupIcon(isAll = false) {
  if (isAll) {
    return `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M7 4.5c0-.83.67-1.5 1.5-1.5h7A1.5 1.5 0 0 1 17 4.5V21l-5-3-5 3V4.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="2.8" fill="currentColor"/>
      <circle cx="7" cy="9" r="1.5" fill="currentColor" opacity=".72"/>
      <circle cx="17" cy="9" r="1.5" fill="currentColor" opacity=".72"/>
      <circle cx="8.5" cy="16.5" r="1.3" fill="currentColor" opacity=".72"/>
      <circle cx="15.5" cy="16.5" r="1.3" fill="currentColor" opacity=".72"/>
    </svg>
  `;
}

function renderCategorySelect() {
  const names = getVisibleCategoryNames().filter((name) => name !== "全部");
  const uniqueNames = [...new Set(names)];

  els.categoryInput.innerHTML = uniqueNames
    .map((name) => `<option value="${escapeAttr(name)}">${escapeHtml(name)}</option>`)
    .join("");

  if (!els.categoryInput.innerHTML) {
    els.categoryInput.innerHTML = `<option value="其他">其他</option>`;
  }
}

function renderGroupList() {
  const visibleNames = getVisibleCategoryNames();

  els.groupList.innerHTML = `
    <div class="group-active-pill" aria-hidden="true"></div>
    ${visibleNames.map((name) => {
      const isAll = name === "全部";
      const isActive = currentCategory === name;
      const categoryObj = getSortedCategories().find((item) => item.name === name);
      const canManage = isAdmin() && !isAll && categoryObj;
      const draggable = canManage ? 'draggable="true"' : "";
      const categoryIdAttr = categoryObj ? `data-category-id="${escapeAttr(categoryObj.id)}"` : "";

      const tools = canManage
        ? `
          <div class="group-tools">
            <div class="drag-handle">⋮⋮</div>
            <button class="group-tool" type="button" data-category-edit="${escapeAttr(categoryObj.id)}">${escapeHtml(t("common.edit"))}</button>
            <button class="group-tool delete" type="button" data-category-delete="${escapeAttr(categoryObj.id)}">${escapeHtml(t("common.delete"))}</button>
          </div>
        `
        : "";

      return `
        <div
          class="group-row ${isActive ? "is-active" : ""} ${canManage ? "draggable" : ""}"
          ${draggable}
          ${categoryIdAttr}
          data-category-name="${escapeAttr(name)}"
        >
          <button class="group-main" type="button" data-category-name="${escapeAttr(name)}">
            <span class="group-icon">${groupIcon(isAll)}</span>
            <span class="group-name-wrap">
              <span class="group-name">${escapeHtml(isAll ? t("top.allTitle") : name)}</span>
              <span class="group-count">${getCategoryCount(name)} 个</span>
            </span>
          </button>
          ${tools}
        </div>
      `;
    }).join("")}
  `;

  requestAnimationFrame(updateCategoryIndicator);
}

function renderCard(item, index) {
  const admin = isAdmin();
  const isHighlighted = highlightBookmarkId && String(item.id) === String(highlightBookmarkId);

  const adminButtons = admin
    ? `
      <div class="admin-actions">
        <button class="mini-btn" type="button" data-edit="${escapeAttr(item.id)}">${escapeHtml(t("common.edit"))}</button>
        <button class="mini-btn delete" type="button" data-delete="${escapeAttr(item.id)}">${escapeHtml(t("common.delete"))}</button>
      </div>
    `
    : "";

  const guestAttrs = admin
    ? ""
    : `data-open-url="${escapeAttr(item.url)}" role="link" tabindex="0" aria-label="${escapeAttr(item.title)}"`;

  const guestHint = admin ? "" : `<div class="guest-hint">${escapeHtml(t("bookmark.openHint"))}</div>`;

  return `
    <article
      class="card ${admin ? "admin-card" : "guest-card"} ${isHighlighted ? "is-new" : ""}"
      data-card-id="${escapeAttr(item.id)}"
      style="animation-delay:${Math.min(index * 35, 280)}ms"
      ${guestAttrs}
    >
      <div class="card-content">
        <div class="card-top">
          <h3>${escapeHtml(item.title)}</h3>
          ${adminButtons}
        </div>
        <p class="card-desc">${escapeHtml(item.description || t("bookmark.emptyDesc"))}</p>
        ${guestHint}
      </div>
    </article>
  `;
}

function renderTextEditor() {
  const grouped = {};

  for (const row of siteTextRows) {
    const groupKey = row.key.includes(".") ? row.key.split(".")[0] : "other";

    if (!grouped[groupKey]) {
      grouped[groupKey] = [];
    }

    grouped[groupKey].push(row);
  }

  const groupOrder = [
    "brand",
    "sidebar",
    "top",
    "sync",
    "admin",
    "intro",
    "search",
    "bookmark",
    "empty",
    "login",
    "bookmarkForm",
    "categoryForm",
    "textForm",
    "common",
    "toast",
    "confirm",
    "setup",
    "other"
  ];

  els.textList.innerHTML = groupOrder
    .filter((key) => grouped[key]?.length)
    .map((groupKey) => {
      const meta = TEXT_GROUP_META[groupKey] || TEXT_GROUP_META.other;
      const rows = grouped[groupKey];

      return `
        <details class="text-group" open>
          <summary>
            <span class="text-group-head">
              <span>${escapeHtml(meta.title)}</span>
              <small>${escapeHtml(meta.desc)}</small>
            </span>
            <span class="text-group-arrow">›</span>
          </summary>

          <div class="text-group-body">
            ${rows.map((row) => `
              <label class="text-row">
                <span class="text-row-info">
                  <strong>${escapeHtml(row.key)}</strong>
                  <span>${escapeHtml(row.description || row.key)}</span>
                </span>
                <textarea data-text-key="${escapeAttr(row.key)}">${escapeHtml(texts[row.key] ?? "")}</textarea>
              </label>
            `).join("")}
          </div>
        </details>
      `;
    }).join("");
}

function render() {
  renderCategorySelect();
  renderGroupList();

  const filtered = getFilteredBookmarks();

  updatePageMeta(filtered.length);
  updateSearchFeedback(filtered.length);

  els.emptyState.classList.toggle("hidden", filtered.length > 0);
  els.bookmarkGrid.innerHTML = filtered
    .map((item, index) => renderCard(item, index))
    .join("");
}

function openBookmarkDialog(item = null) {
  els.bookmarkForm.reset();

  if (item) {
    els.formTitle.textContent = t("bookmarkForm.editTitle");
    els.bookmarkId.value = item.id;
    els.titleInput.value = item.title ?? "";
    els.urlInput.value = item.url ?? "";
    els.descriptionInput.value = item.description ?? "";

    const value = item.category || "其他";

    if (![...els.categoryInput.options].some((option) => option.value === value)) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      els.categoryInput.appendChild(option);
    }

    els.categoryInput.value = value;
  } else {
    els.formTitle.textContent = t("bookmarkForm.addTitle");
    els.bookmarkId.value = "";

    const defaultCategory =
      currentCategory === "全部"
        ? (els.categoryInput.options[0]?.value || "其他")
        : currentCategory;

    if (![...els.categoryInput.options].some((option) => option.value === defaultCategory)) {
      const option = document.createElement("option");
      option.value = defaultCategory;
      option.textContent = defaultCategory;
      els.categoryInput.appendChild(option);
    }

    els.categoryInput.value = defaultCategory;
  }

  els.bookmarkDialog.showModal();
  setTimeout(() => els.titleInput.focus(), 10);
}

function openCategoryDialog(category = null) {
  els.categoryForm.reset();

  if (category) {
    els.categoryFormTitle.textContent = t("categoryForm.editTitle");
    els.categoryIdInput.value = category.id;
    els.categoryOldNameInput.value = category.name;
    els.categoryNameInput.value = category.name ?? "";
  } else {
    els.categoryFormTitle.textContent = t("categoryForm.addTitle");
    els.categoryIdInput.value = "";
    els.categoryOldNameInput.value = "";
  }

  els.categoryDialog.showModal();
  setTimeout(() => els.categoryNameInput.focus(), 10);
}

function openTextDialog() {
  if (!isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  renderTextEditor();
  els.textDialog.showModal();
}

async function loadSiteTexts() {
  const defaultMap = new Map(
    DEFAULT_TEXT_ROWS.map(([key, value, description]) => [
      key,
      { key, value, description }
    ])
  );

  if (!supabase) {
    siteTextRows = [...defaultMap.values()];
    texts = Object.fromEntries(siteTextRows.map((row) => [row.key, row.value]));
    applySiteTexts();
    return;
  }

  const { data, error } = await supabase
    .from("site_texts")
    .select("key,value,description")
    .order("key", { ascending: true });

  if (error) {
    siteTextRows = [...defaultMap.values()];
    texts = Object.fromEntries(siteTextRows.map((row) => [row.key, row.value]));
    applySiteTexts();
    return;
  }

  for (const row of data ?? []) {
    defaultMap.set(row.key, {
      key: row.key,
      value: row.value ?? "",
      description: row.description ?? row.key,
    });
  }

  siteTextRows = [...defaultMap.values()];
  texts = Object.fromEntries(siteTextRows.map((row) => [row.key, row.value]));
  applySiteTexts();
}

async function saveSiteTexts(event) {
  event.preventDefault();

  if (!supabase || !isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  const inputs = [...els.textList.querySelectorAll("[data-text-key]")];

  const nextRows = inputs.map((input) => {
    const key = input.dataset.textKey;
    const meta = siteTextRows.find((row) => row.key === key);

    return {
      key,
      value: input.value,
      description: meta?.description || key,
    };
  });

  const { error } = await supabase
    .from("site_texts")
    .upsert(nextRows, { onConflict: "key" });

  if (error) {
    showToast(error.message, "error");
    return;
  }

  els.textDialog.close();
  showToast(t("toast.textSaved"));
  await loadSiteTexts();
  render();
}

async function loadSession() {
  if (!supabase) return;

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    showToast(error.message, "error");
    return;
  }

  currentUser = data.session?.user ?? null;
  setAdminUI();

  supabase.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user ?? null;
    setAdminUI();
  });
}

async function loadBookmarks() {
  if (!supabase) {
    bookmarks = [];
    els.setupNotice.classList.remove("hidden");
    setRealtimeStatus("error", t("sync.notConfigured"));
    render();
    return;
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .select("id,title,url,description,category,is_active,created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    bookmarks = [];
    setRealtimeStatus("error", t("sync.readError"));
    showToast(error.message, "error");
    render();
    return;
  }

  bookmarks = data ?? [];
  render();
}

async function loadCategories() {
  if (!supabase) {
    categories = [];
    render();
    return;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id,name,sort_order,is_active,created_at")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    categories = [];
    showToast(error.message, "error");
    render();
    return;
  }

  categories = data ?? [];
  render();
}

async function loadAllData() {
  await Promise.all([loadBookmarks(), loadCategories()]);
}

function subscribeRealtime() {
  if (!supabase) return;

  for (const channel of realtimeChannels) {
    supabase.removeChannel(channel);
  }

  realtimeChannels = [];

  let bookmarksReady = false;
  let categoriesReady = false;
  let textsReady = false;

  function updateRealtimeLabel() {
    if (bookmarksReady && categoriesReady && textsReady) {
      setRealtimeStatus("online", t("sync.online"));
    } else if (bookmarksReady || categoriesReady || textsReady) {
      setRealtimeStatus("online", t("sync.partial"));
    }
  }

  const bookmarksChannel = supabase
    .channel("bookmarks-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "bookmarks" },
      async () => {
        await loadBookmarks();
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        bookmarksReady = true;
        updateRealtimeLabel();
      }

      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        bookmarksReady = false;
        setRealtimeStatus("error", t("sync.bookmarkError"));
      }
    });

  const categoriesChannel = supabase
    .channel("categories-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "categories" },
      async () => {
        await loadCategories();
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        categoriesReady = true;
        updateRealtimeLabel();
      }

      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        categoriesReady = false;
        setRealtimeStatus("error", t("sync.categoryError"));
      }
    });

  const textsChannel = supabase
    .channel("site-texts-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "site_texts" },
      async () => {
        await loadSiteTexts();
        render();
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        textsReady = true;
        updateRealtimeLabel();
      }

      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        textsReady = false;
        setRealtimeStatus("error", t("sync.readError"));
      }
    });

  realtimeChannels = [bookmarksChannel, categoriesChannel, textsChannel];
}

async function saveBookmark() {
  if (!supabase || !isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  const payload = {
    title: els.titleInput.value.trim(),
    url: normalizeUrl(els.urlInput.value),
    description: els.descriptionInput.value.trim(),
    category: (els.categoryInput.value || "其他").trim(),
    is_active: true,
  };

  try {
    const parsed = new URL(payload.url);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("invalid protocol");
    }
  } catch {
    showToast(t("toast.invalidUrl"), "error");
    return;
  }

  const id = els.bookmarkId.value;

  const query = id
    ? supabase.from("bookmarks").update(payload).eq("id", id).select("id").single()
    : supabase.from("bookmarks").insert(payload).select("id").single();

  const { data, error } = await query;

  if (error) {
    showToast(error.message, "error");
    return;
  }

  highlightBookmarkId = data?.id || id || null;

  els.bookmarkDialog.close();
  showToast(id ? t("toast.bookmarkUpdated") : t("toast.bookmarkAdded"));

  await loadBookmarks();

  setTimeout(() => {
    highlightBookmarkId = null;
    render();
  }, 1200);
}

async function deleteBookmark(id) {
  if (!supabase || !isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  const target = bookmarks.find((item) => String(item.id) === String(id));
  const confirmed = window.confirm(t("confirm.deleteBookmark", { title: target?.title ?? "" }));

  if (!confirmed) return;

  const card = els.bookmarkGrid.querySelector(`[data-card-id="${CSS.escape(String(id))}"]`);

  if (card) {
    card.classList.add("is-removing");
    await wait(230);
  }

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);

  if (error) {
    showToast(error.message, "error");
    return;
  }

  showToast(t("toast.bookmarkDeleted"));
  await loadBookmarks();
}

async function saveCategory() {
  if (!supabase || !isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  const id = els.categoryIdInput.value;
  const oldName = els.categoryOldNameInput.value.trim();
  const newName = els.categoryNameInput.value.trim();

  if (!newName) {
    showToast(t("categoryForm.namePlaceholder"), "error");
    return;
  }

  if (newName === "全部") {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  const existing = categories.find((item) =>
    item.name.trim().toLowerCase() === newName.toLowerCase() &&
    String(item.id) !== String(id)
  );

  if (existing) {
    showToast(t("categoryForm.namePlaceholder"), "error");
    return;
  }

  const maxSort = Math.max(0, ...categories.map((item) => Number(item.sort_order ?? 0)));

  const payload = id
    ? { name: newName }
    : { name: newName, sort_order: maxSort + 10, is_active: true };

  const query = id
    ? supabase.from("categories").update(payload).eq("id", id)
    : supabase.from("categories").insert(payload);

  const { error } = await query;

  if (error) {
    showToast(error.message, "error");
    return;
  }

  if (id && oldName && oldName !== newName) {
    const { error: bookmarkError } = await supabase
      .from("bookmarks")
      .update({ category: newName })
      .eq("category", oldName);

    if (bookmarkError) {
      showToast(bookmarkError.message, "error");
    }

    if (currentCategory === oldName) {
      currentCategory = newName;
    }
  }

  els.categoryDialog.close();
  showToast(id ? t("toast.categoryUpdated") : t("toast.categoryAdded"));
  await loadAllData();
}

async function deleteCategory(id) {
  if (!supabase || !isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  const target = categories.find((item) => String(item.id) === String(id));

  if (!target) return;

  if (target.name === "其他") {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  const confirmed = window.confirm(t("confirm.deleteCategory", { name: target.name }));

  if (!confirmed) return;

  const { error: moveError } = await supabase
    .from("bookmarks")
    .update({ category: "其他" })
    .eq("category", target.name);

  if (moveError) {
    showToast(moveError.message, "error");
    return;
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    showToast(error.message, "error");
    return;
  }

  if (currentCategory === target.name) {
    currentCategory = "全部";
  }

  showToast(t("toast.categoryDeleted"));
  await loadAllData();
}

async function persistCategoryOrder() {
  if (!supabase || !isAdmin()) return;

  const sorted = getSortedCategories();

  const updates = sorted.map((item, index) => {
    const nextOrder = (index + 1) * 10;

    return supabase
      .from("categories")
      .update({ sort_order: nextOrder })
      .eq("id", item.id);
  });

  const results = await Promise.all(updates);
  const failed = results.find((result) => result.error);

  if (failed?.error) {
    showToast(failed.error.message, "error");
    await loadCategories();
    return;
  }

  showToast(t("toast.categoryOrderUpdated"));
  await loadCategories();
}

async function reorderCategories(dragId, targetId, position = "after") {
  if (!dragId || !targetId || dragId === targetId) return;

  const sorted = getSortedCategories();

  const fromIndex = sorted.findIndex((item) => String(item.id) === String(dragId));
  const targetIndex = sorted.findIndex((item) => String(item.id) === String(targetId));

  if (fromIndex === -1 || targetIndex === -1) return;

  const [moved] = sorted.splice(fromIndex, 1);

  let insertIndex = sorted.findIndex((item) => String(item.id) === String(targetId));

  if (position === "after") {
    insertIndex += 1;
  }

  sorted.splice(insertIndex, 0, moved);

  categories = sorted.map((item, index) => ({
    ...item,
    sort_order: (index + 1) * 10,
  }));

  render();
  await persistCategoryOrder();
}

async function login(event) {
  event.preventDefault();

  if (!supabase) {
    showToast(t("sync.notConfigured"), "error");
    return;
  }

  const email = els.loginEmail.value.trim();
  const password = els.loginPassword.value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    showToast(error.message, "error");
    return;
  }

  currentUser = data.user;
  els.loginDialog.close();
  els.loginForm.reset();

  if (isAdmin()) {
    showToast(t("toast.loginSuccess"));
  } else {
    showToast(t("toast.notAdmin"), "error");
  }

  setAdminUI();
}

async function logout() {
  if (!supabase) return;

  await supabase.auth.signOut();

  currentUser = null;
  showToast(t("toast.logout"));
  setAdminUI();
}

function initTheme() {
  const saved = localStorage.getItem("bookmark-theme");

  if (saved === "dark") {
    document.documentElement.dataset.theme = "dark";
  }
}

function toggleTheme() {
  els.themeOverlay.classList.add("active");

  setTimeout(() => {
    const current = document.documentElement.dataset.theme;
    const next = current === "dark" ? "light" : "dark";

    if (next === "dark") {
      document.documentElement.dataset.theme = "dark";
      localStorage.setItem("bookmark-theme", "dark");
    } else {
      delete document.documentElement.dataset.theme;
      localStorage.setItem("bookmark-theme", "light");
    }
  }, 120);

  setTimeout(() => {
    els.themeOverlay.classList.remove("active");
  }, 640);
}

function clearDropMarks() {
  els.groupList.querySelectorAll(".drop-before, .drop-after").forEach((el) => {
    el.classList.remove("drop-before", "drop-after");
  });
}

function bindEvents() {
  els.loginOpenBtn.addEventListener("click", () => {
    els.loginDialog.showModal();
  });

  els.textOpenBtn.addEventListener("click", openTextDialog);
  els.logoutBtn.addEventListener("click", logout);
  els.themeToggle.addEventListener("click", toggleTheme);

  els.addOpenBtn.addEventListener("click", () => {
    openBookmarkDialog();
  });

  els.addCategoryBtn.addEventListener("click", () => {
    openCategoryDialog();
  });

  els.loginForm.addEventListener("submit", login);

  els.bookmarkForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveBookmark();
  });

  els.categoryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveCategory();
  });

  els.textForm.addEventListener("submit", saveSiteTexts);

  els.searchInput.addEventListener("input", render);

  els.groupList.addEventListener("scroll", updateCategoryIndicator);
  window.addEventListener("resize", updateCategoryIndicator);

  els.groupList.addEventListener("click", async (event) => {
    const editBtn = event.target.closest("[data-category-edit]");
    const deleteBtn = event.target.closest("[data-category-delete]");
    const categoryBtn = event.target.closest("[data-category-name]");

    if (editBtn) {
      event.preventDefault();
      event.stopPropagation();

      const category = categories.find((item) => String(item.id) === String(editBtn.dataset.categoryEdit));
      if (category) openCategoryDialog(category);
      return;
    }

    if (deleteBtn) {
      event.preventDefault();
      event.stopPropagation();

      await deleteCategory(deleteBtn.dataset.categoryDelete);
      return;
    }

    if (categoryBtn) {
      currentCategory = categoryBtn.dataset.categoryName;
      render();
    }
  });

  els.groupList.addEventListener("dragstart", (event) => {
    if (!isAdmin()) return;

    const row = event.target.closest(".group-row[data-category-id]");
    if (!row) return;

    draggedCategoryId = row.dataset.categoryId;
    row.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedCategoryId);
  });

  els.groupList.addEventListener("dragend", (event) => {
    const row = event.target.closest(".group-row[data-category-id]");
    if (row) row.classList.remove("dragging");

    draggedCategoryId = null;
    clearDropMarks();
  });

  els.groupList.addEventListener("dragover", (event) => {
    if (!isAdmin()) return;

    const row = event.target.closest(".group-row[data-category-id]");
    if (!row || row.dataset.categoryId === draggedCategoryId) return;

    event.preventDefault();
    clearDropMarks();

    const rect = row.getBoundingClientRect();
    const before = event.clientY < rect.top + rect.height / 2;

    row.classList.add(before ? "drop-before" : "drop-after");
  });

  els.groupList.addEventListener("drop", async (event) => {
    if (!isAdmin()) return;

    const row = event.target.closest(".group-row[data-category-id]");
    if (!row || row.dataset.categoryId === draggedCategoryId) return;

    event.preventDefault();

    const position = row.classList.contains("drop-before") ? "before" : "after";

    clearDropMarks();

    await reorderCategories(draggedCategoryId, row.dataset.categoryId, position);
  });

  els.bookmarkGrid.addEventListener("mousemove", (event) => {
    const card = event.target.closest(".card");

    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const px = x / rect.width;
    const py = y / rect.height;

    const rotateY = (px - .5) * 7;
    const rotateX = (.5 - py) * 7;

    card.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
  });

  els.bookmarkGrid.addEventListener("mouseleave", () => {
    els.bookmarkGrid.querySelectorAll(".card").forEach((card) => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "50%");
    });
  });

  els.bookmarkGrid.addEventListener("click", async (event) => {
    const editBtn = event.target.closest("[data-edit]");
    const deleteBtn = event.target.closest("[data-delete]");
    const card = event.target.closest("[data-open-url]");

    if (editBtn) {
      event.preventDefault();
      event.stopPropagation();

      const item = bookmarks.find((bookmark) => String(bookmark.id) === String(editBtn.dataset.edit));
      if (item) openBookmarkDialog(item);
      return;
    }

    if (deleteBtn) {
      event.preventDefault();
      event.stopPropagation();

      await deleteBookmark(deleteBtn.dataset.delete);
      return;
    }

    if (card && !isAdmin()) {
      const url = card.dataset.openUrl;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    }
  });

  els.bookmarkGrid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest("[data-open-url]");
    if (!card || isAdmin()) return;

    event.preventDefault();

    const url = card.dataset.openUrl;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  });

  document.querySelectorAll("[data-close-dialog]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dialog = btn.closest("dialog");
      if (dialog) dialog.close();
    });
  });
}

async function loadLottieLibrary() {
  if (window.lottie) return window.lottie;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js";
    script.onload = () => resolve(window.lottie);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function mountOneLottie({ url, container, wrapper, renderer = "svg" }) {
  if (!url || !container || !wrapper) return;

  try {
    const lottie = await loadLottieLibrary();

    wrapper.classList.remove("hidden");
    container.innerHTML = "";

    lottie.loadAnimation({
      container,
      renderer,
      loop: true,
      autoplay: true,
      path: url,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet"
      }
    });
  } catch (error) {
    console.warn("Lottie 动画加载失败：", error);
    wrapper.classList.add("hidden");
  }
}

async function initLottieAnimations() {
  const hasAny = Object.values(LOTTIE_ANIMATIONS).some(Boolean);

  if (!hasAny) return;

  await Promise.all([
    mountOneLottie({
      url: LOTTIE_ANIMATIONS.sidebar,
      container: els.sidebarLottie,
      wrapper: els.sidebarLottieWrap,
    }),
    mountOneLottie({
      url: LOTTIE_ANIMATIONS.intro,
      container: els.introLottie,
      wrapper: els.introLottieWrap,
    }),
    mountOneLottie({
      url: LOTTIE_ANIMATIONS.empty,
      container: els.emptyLottie,
      wrapper: els.emptyLottieWrap,
    }),
  ]);
}

async function init() {
  initTheme();
  applySiteTexts();
  bindEvents();
  initLottieAnimations();

  if (!isConfigured) {
    bookmarks = [];
    categories = [];
    els.setupNotice.classList.remove("hidden");
    setRealtimeStatus("error", t("sync.notConfigured"));
    render();
    return;
  }

  await loadSiteTexts();
  await loadSession();
  await loadAllData();
  subscribeRealtime();
}

init();

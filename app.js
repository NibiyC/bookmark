import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://bmbkahvhqdhbrzbyonuu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtYmthaHZocWRoYnJ6YnlvbnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwOTY2MTksImV4cCI6MjA5MjY3MjYxOX0.RW09_EOPzuPHNPOdD2yb44iCOSksqkwRr1mBXEMokcE";
const ADMIN_EMAIL = "2565667747@qq.com";

const LOTTIE_ANIMATIONS = {
  sidebar: "",
  intro: "",
  empty: "",
  // 这里保留三个可选动画位，不再加载右下角猫狗互动组件。
};

const CATEGORY_TAG_PREFIX = "__bookmark_group__:";
const RESERVED_CATEGORY_NAMES = new Set(["全部", "其他"]);

const DEFAULT_TEXT_ROWS = [
  ["brand.title", "我的书签", "左侧顶部网站名称"],
  ["brand.subtitle", "安静、柔和、实时同步", "左侧顶部副标题"],

  ["sidebar.groupTitle", "分组", "左侧分组标题"],
  ["sidebar.tipTitle", "管理提示", "左侧底部提示标题"],
  ["sidebar.tipDesc", "管理员可新增分组、编辑分组，并在左侧直接拖动调整顺序；书签支持同时归入多个分组。", "左侧底部提示内容"],

  ["top.allTitle", "全部书签", "全部分组标题"],
  ["top.loadingSubtitle", "正在加载收藏内容", "加载时副标题"],
  ["top.allSubtitle", "共 {count} 个收藏", "全部书签数量文案"],
  ["top.categorySubtitle", "{count} 个收藏", "当前分组数量文案"],
  ["top.searchSubtitle", "匹配 {count} 个结果", "搜索结果数量文案"],

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
  ["search.idle", "⌘ K", "搜索默认提示"],
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
  ["bookmarkForm.desc", "卡片上展示名称、简介和所属分组；一个书签可以同时选择多个分组。", "书签弹窗描述"],
  ["bookmarkForm.nameLabel", "名称", "书签名称字段名"],
  ["bookmarkForm.namePlaceholder", "请输入书签名称", "书签名称占位文字"],
  ["bookmarkForm.urlLabel", "链接", "书签链接字段名"],
  ["bookmarkForm.urlPlaceholder", "https://example.com", "书签链接占位文字"],
  ["bookmarkForm.descLabel", "简介", "书签简介字段名"],
  ["bookmarkForm.descPlaceholder", "请输入简介", "书签简介占位文字"],
  ["bookmarkForm.categoryLabel", "分组（可多选）", "书签分组字段名"],
  ["bookmarkForm.save", "保存", "保存书签按钮"],

  ["categoryForm.addTitle", "新增分组", "新增分组弹窗标题"],
  ["categoryForm.editTitle", "编辑分组", "编辑分组弹窗标题"],
  ["categoryForm.desc", "这里只需要填写分组名称。创建后可在左侧直接拖动排序，也可以给同一个书签选择多个分组。", "分组弹窗描述"],
  ["categoryForm.nameLabel", "分组名称", "分组名称字段名"],
  ["categoryForm.namePlaceholder", "例如：AI 工具", "分组名称占位文字"],
  ["categoryForm.save", "保存分组", "保存分组按钮"],

  ["textForm.title", "页面文案", "页面文案弹窗标题"],
  ["textForm.desc", "这里可以修改页面上显示的主要文字。保存后所有访问者都会看到更新。", "页面文案弹窗描述"],
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
  ["confirm.deleteCategory", "确定删除分组「{name}」吗？关联书签会保留，但会从这个分组中移除。", "删除分组确认"],

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
  other: { title: "未分类", desc: "未分类文案" }
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
  groupManageBtn: $("#groupManageBtn"),

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
let sidebarEditMode = false;
let siteTextsRealtimeTimer = null;
let ignoreSiteTextRealtimeUntil = 0;
let realtimePaused = false;
let realtimeResumeTimer = null;
let dataRealtimeTimer = null;
let bookmarksDataSignature = "";
let categoriesDataSignature = "";
let quietRenderTimer = null;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stableValue(value) {
  if (Array.isArray(value)) return [...value].map(String).sort().join("|");
  return String(value ?? "");
}

function getBookmarksDataSignature(rows = []) {
  return JSON.stringify((rows || []).map((item) => [
    stableValue(item.id),
    stableValue(item.title),
    stableValue(item.url),
    stableValue(item.description),
    stableValue(item.category),
    stableValue(item.tags),
    stableValue(item.is_active),
    stableValue(item.created_at),
  ]));
}

function getCategoriesDataSignature(rows = []) {
  return JSON.stringify((rows || []).map((item) => [
    stableValue(item.id),
    stableValue(item.name),
    stableValue(item.sort_order),
    stableValue(item.is_active),
    stableValue(item.created_at),
  ]));
}

function safeRender(quiet = false) {
  if (quiet) {
    document.body.classList.add("render-quiet");
    clearTimeout(quietRenderTimer);
    quietRenderTimer = setTimeout(() => {
      document.body.classList.remove("render-quiet");
    }, 220);
  }

  render();
}

function pauseRealtime() {
  if (!supabase) return;

  realtimePaused = true;
  clearTimeout(realtimeResumeTimer);
  clearTimeout(dataRealtimeTimer);
  clearTimeout(siteTextsRealtimeTimer);

  for (const channel of realtimeChannels) {
    supabase.removeChannel(channel);
  }

  realtimeChannels = [];
}

function resumeRealtimeSoon(delay = 900) {
  if (!supabase) return;

  clearTimeout(realtimeResumeTimer);
  realtimeResumeTimer = setTimeout(() => {
    realtimePaused = false;
    subscribeRealtime();
  }, delay);
}

function scheduleDataRealtimeRefresh() {
  if (realtimePaused) return;

  clearTimeout(dataRealtimeTimer);
  dataRealtimeTimer = setTimeout(async () => {
    await loadAllData({ quiet: true });
  }, 360);
}

function t(key, params = {}) {
  let value = texts[key] ?? key;

  if (key === "top.allSubtitle" && value === "{count}") {
    value = "共 {count} 个收藏";
  }

  if (key === "top.categorySubtitle" && value === "{count}") {
    value = "{count} 个收藏";
  }

  if (key === "top.searchSubtitle" && value === "匹配 {count}") {
    value = "匹配 {count} 个结果";
  }

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

function getBookmarkIconUrl(url) {
  try {
    const parsed = new URL(normalizeUrl(url || ""));
    const origin = `${parsed.protocol}//${parsed.hostname}`;

    // 优先加载网站 favicon。只有图片加载失败时，才显示书签名称首字。
    return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(origin)}&sz=128`;
  } catch {
    return "";
  }
}

function getBookmarkDomain(url) {
  try {
    const parsed = new URL(normalizeUrl(url || ""));
    return parsed.hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

function getBookmarkInitial(title) {
  const value = String(title || "?").trim().replace(/\s+/g, " ");
  if (!value) return "?";

  const firstToken = value
    .split(/[\s·•|｜/\\_—–-]+/u)
    .find(Boolean) || value;
  const tokenChars = Array.from(firstToken);

  if (/^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(firstToken)) {
    return tokenChars[0] || "?";
  }

  const cleanToken = firstToken.replace(/[^\p{L}\p{N}]+/gu, "");
  if (!cleanToken) {
    return Array.from(value)[0]?.toUpperCase() || "?";
  }

  return Array.from(cleanToken).slice(0, 4).join("").toUpperCase();
}

function normalizeCategoryName(name) {
  return String(name ?? "").trim();
}

function isReservedCategoryName(name) {
  const value = normalizeCategoryName(name);
  return !value || RESERVED_CATEGORY_NAMES.has(value);
}

function uniqueCategoryNames(names = []) {
  const result = [];
  const seen = new Set();

  for (const name of names) {
    const value = normalizeCategoryName(name);
    const key = value.toLowerCase();

    if (isReservedCategoryName(value) || seen.has(key)) continue;

    result.push(value);
    seen.add(key);
  }

  return result;
}

function getRawBookmarkTags(item = {}) {
  const raw = item.tags;

  if (Array.isArray(raw)) {
    return raw.map((tag) => String(tag ?? "").trim()).filter(Boolean);
  }

  if (typeof raw === "string") {
    const value = raw.trim();
    if (!value) return [];

    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((tag) => String(tag ?? "").trim()).filter(Boolean);
      }
    } catch {
      // 旧数据如果不是 JSON，就按普通标签兼容处理。
    }

    return value
      .split(/[，,、|]/)
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function getCategoryTags(item = {}) {
  return uniqueCategoryNames(
    getRawBookmarkTags(item)
      .filter((tag) => tag.startsWith(CATEGORY_TAG_PREFIX))
      .map((tag) => tag.slice(CATEGORY_TAG_PREFIX.length))
  );
}

function getNonCategoryTags(item = {}) {
  return getRawBookmarkTags(item).filter((tag) => !tag.startsWith(CATEGORY_TAG_PREFIX));
}

function getBookmarkCategories(item = {}) {
  const fromTags = getCategoryTags(item);

  if (fromTags.length) {
    return fromTags;
  }

  return uniqueCategoryNames([item.category]);
}

function buildBookmarkTags(selectedCategories = [], item = {}) {
  const nonCategoryTags = getNonCategoryTags(item);
  const categoryTags = uniqueCategoryNames(selectedCategories).map((name) => `${CATEGORY_TAG_PREFIX}${name}`);

  return [...nonCategoryTags, ...categoryTags];
}

function getSelectableCategoryNames() {
  const result = [];

  for (const category of getSortedCategories()) {
    result.push(category?.name);
  }

  for (const bookmark of bookmarks) {
    result.push(...getBookmarkCategories(bookmark));
  }

  return uniqueCategoryNames(result);
}

function getCategoryCheckboxes() {
  return [...els.categoryInput.querySelectorAll('input[name="bookmark-categories"]')];
}

function ensureCategoryCheckboxOptions(names = []) {
  const existing = new Set(getCategoryCheckboxes().map((input) => input.value));
  const fragment = document.createDocumentFragment();

  for (const name of uniqueCategoryNames(names)) {
    if (existing.has(name)) continue;

    const label = document.createElement("label");
    label.className = "category-check";
    label.innerHTML = `
      <input type="checkbox" name="bookmark-categories" value="${escapeAttr(name)}">
      <span>${escapeHtml(name)}</span>
    `;
    fragment.appendChild(label);
  }

  els.categoryInput.appendChild(fragment);
}

function getSelectedBookmarkCategories() {
  return uniqueCategoryNames(
    getCategoryCheckboxes()
      .filter((input) => input.checked)
      .map((input) => input.value)
  );
}

function setSelectedBookmarkCategories(names = []) {
  const selected = new Set(uniqueCategoryNames(names));

  getCategoryCheckboxes().forEach((input) => {
    input.checked = selected.has(input.value);
  });
}

function getBookmarkCategoryPayload(selectedCategories = [], item = {}) {
  const normalized = uniqueCategoryNames(selectedCategories);

  return {
    category: normalized[0] || "",
    tags: buildBookmarkTags(normalized, item),
  };
}

async function updateBookmarkCategories(item, nextCategories) {
  const payload = getBookmarkCategoryPayload(nextCategories, item);

  return supabase
    .from("bookmarks")
    .update(payload)
    .eq("id", item.id);
}

async function replaceCategoryOnBookmarks(oldName, newName) {
  const oldValue = normalizeCategoryName(oldName);
  const newValue = normalizeCategoryName(newName);

  if (!oldValue || !newValue || oldValue === newValue) return { error: null };

  const affected = bookmarks.filter((item) => getBookmarkCategories(item).includes(oldValue));

  for (const item of affected) {
    const nextCategories = getBookmarkCategories(item).map((name) => name === oldValue ? newValue : name);
    const { error } = await updateBookmarkCategories(item, nextCategories);

    if (error) return { error };
  }

  return { error: null };
}

async function removeCategoryFromBookmarks(name) {
  const targetName = normalizeCategoryName(name);
  const affected = bookmarks.filter((item) => getBookmarkCategories(item).includes(targetName));

  for (const item of affected) {
    const nextCategories = getBookmarkCategories(item).filter((categoryName) => categoryName !== targetName);
    const { error } = await updateBookmarkCategories(item, nextCategories);

    if (error) return { error };
  }

  return { error: null };
}

function isAdmin() {
  return currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

function resetCardTilt(card) {
  card.style.setProperty("--rx", "0deg");
  card.style.setProperty("--ry", "0deg");
  card.style.setProperty("--mx", "50%");
  card.style.setProperty("--my", "50%");
}

function resetAllCardTilt() {
  document.querySelectorAll(".card").forEach((card) => {
    resetCardTilt(card);
  });
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

function getDefaultTextObjects() {
  return DEFAULT_TEXT_ROWS.map(([key, value, description]) => ({
    key,
    value,
    description: description || key,
  }));
}

function getTextRowsForEditor() {
  const defaultMap = new Map(
    getDefaultTextObjects().map((row) => [row.key, row])
  );

  for (const row of siteTextRows || []) {
    if (!row || !row.key) continue;

    const old = defaultMap.get(row.key);

    defaultMap.set(row.key, {
      key: row.key,
      value: String(row.value ?? "").trim() ? row.value : old?.value ?? "",
      description: row.description ?? old?.description ?? row.key,
    });
  }

  return [...defaultMap.values()];
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

  if (!els.textDialog?.open) {
    renderTextEditor();
  }
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

  if (!admin) {
    sidebarEditMode = false;
  }

  els.addOpenBtn.classList.toggle("hidden", !admin);
  els.addCategoryBtn.classList.toggle("hidden", !admin);
  els.groupManageBtn?.classList.toggle("hidden", !admin);
  els.groupManageBtn?.classList.toggle("is-active", admin && sidebarEditMode);
  els.groupManageBtn?.setAttribute("aria-pressed", String(admin && sidebarEditMode));
  if (els.groupManageBtn) {
    els.groupManageBtn.textContent = sidebarEditMode ? "完成" : "整理";
  }
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
  const result = ["全部", ...getSelectableCategoryNames()];
  return [...new Set(result)];
}


function getCategoryCount(name) {
  if (name === "全部") return bookmarks.length;
  return bookmarks.filter((item) => getBookmarkCategories(item).includes(name)).length;
}


function getFilteredBookmarks() {
  const q = els.searchInput.value.trim().toLowerCase();

  return bookmarks.filter((item) => {
    const categoryMatch = currentCategory === "全部" || getBookmarkCategories(item).includes(currentCategory);
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

function setBookmarkView(view, persist = true) {
  const nextView = view === "list" ? "list" : "grid";

  els.bookmarkGrid.classList.toggle("is-list", nextView === "list");

  document.querySelectorAll("[data-view-mode]").forEach((button) => {
    const isActive = button.dataset.viewMode === nextView;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (persist) {
    localStorage.setItem("bookmark-view", nextView);
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

function groupIcon(name, isAll = false) {
  const value = String(name || "").toLowerCase();

  if (isAll) {
    return `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
    `;
  }

  if (value.includes("工具") || value.includes("tool")) {
    return `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M9 7V5.8C9 4.8 9.8 4 10.8 4h2.4c1 0 1.8.8 1.8 1.8V7M5.8 20h12.4c1 0 1.8-.8 1.8-1.8V8.8c0-1-.8-1.8-1.8-1.8H5.8C4.8 7 4 7.8 4 8.8v9.4c0 1 .8 1.8 1.8 1.8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M4 12h16M10 12v1.2c0 .5.4.8.8.8h2.4c.4 0 .8-.3.8-.8V12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `;
  }

  if (value.includes("ai") || value.includes("智能")) {
    return `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="m5 19 9.8-9.8M13.4 6.6l4 4M4.4 16.8l2.8 2.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M18 3.6v3.2M16.4 5.2h3.2M8 4.8v2.4M6.8 6h2.4M19 16.8v2.8M17.6 18.2h2.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `;
  }

  if (value.includes("开发") || value.includes("code") || value.includes("dev")) {
    return `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="m9 7-5 5 5 5M15 7l5 5-5 5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  if (value.includes("设计") || value.includes("design")) {
    return `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M7.6 6.2a3.2 3.2 0 1 1 5.2 3.6l4.6 2.8a3 3 0 1 1-2 2.5l-5.1-3.1-1.7 3.9a3.1 3.1 0 1 1-2.6-1l2-4.5a3.2 3.2 0 0 1-.4-4.2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
      </svg>
    `;
  }

  if (value.includes("学习") || value.includes("阅读") || value.includes("book") || value.includes("read")) {
    return `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M5 5.8c0-.8.7-1.4 1.5-1.2 2.2.3 4 .9 5.5 2v13c-1.5-1.1-3.3-1.7-5.5-2A1.7 1.7 0 0 1 5 15.9V5.8ZM19 5.8c0-.8-.7-1.4-1.5-1.2-2.2.3-4 .9-5.5 2v13c1.5-1.1 3.3-1.7 5.5-2a1.7 1.7 0 0 0 1.5-1.7V5.8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
    `;
  }

  if (value.includes("生活") || value.includes("life")) {
    return `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M7 8h9v8.2a3.8 3.8 0 0 1-3.8 3.8H10.8A3.8 3.8 0 0 1 7 16.2V8ZM9 4v2M12 4v2M15 4v2M16 10h1.4a2.6 2.6 0 0 1 0 5.2H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
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
  const names = getSelectableCategoryNames();

  if (!names.length) {
    els.categoryInput.innerHTML = `
      <div class="category-check-empty">
        还没有可选择的分组，请先在左侧新增分组。
      </div>
    `;
    return;
  }

  els.categoryInput.innerHTML = names
    .map((name) => `
      <label class="category-check">
        <input type="checkbox" name="bookmark-categories" value="${escapeAttr(name)}">
        <span>${escapeHtml(name)}</span>
      </label>
    `)
    .join("");
}


function renderGroupList() {
  const visibleNames = getVisibleCategoryNames();
  const admin = isAdmin();

  els.groupList.classList.toggle("is-managing", admin && sidebarEditMode);

  const manageBanner = admin && sidebarEditMode
    ? `
      <div class="group-manage-banner">
        <span class="manage-dot" aria-hidden="true"></span>
        <span>拖动排序，点铅笔修改，点垃圾桶删除</span>
      </div>
    `
    : "";

  els.groupList.innerHTML = `
    <div class="group-active-pill" aria-hidden="true"></div>
    ${manageBanner}
    ${visibleNames.map((name) => {
      const isAll = name === "全部";
      const isActive = currentCategory === name;
      const categoryObj = getSortedCategories().find((item) => item.name === name);
      const canManage = admin && sidebarEditMode && !isAll && categoryObj;
      const draggable = canManage ? 'draggable="true"' : "";
      const categoryIdAttr = categoryObj ? `data-category-id="${escapeAttr(categoryObj.id)}"` : "";

      const tools = canManage
        ? `
          <div class="group-tools" aria-label="分组操作">
            <button class="drag-handle" type="button" aria-label="拖动排序" title="拖动排序">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 6.5h.01M15 6.5h.01M9 12h.01M15 12h.01M9 17.5h.01M15 17.5h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </button>
            <button class="group-tool" type="button" data-category-edit="${escapeAttr(categoryObj.id)}" aria-label="${escapeAttr(t("common.edit"))}" title="${escapeAttr(t("common.edit"))}">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m4.8 16.9-.7 3 3-.7L17.8 8.5l-2.3-2.3L4.8 16.9Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>
                <path d="m14.3 7.4 2.3 2.3" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
              </svg>
            </button>
            <button class="group-tool delete" type="button" data-category-delete="${escapeAttr(categoryObj.id)}" aria-label="${escapeAttr(t("common.delete"))}" title="${escapeAttr(t("common.delete"))}">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 7h10M10 7V5.5h4V7m-6 3v8m4-8v8m4-8v8M6.5 7l.6 13h9.8l.6-13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
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
            <span class="group-icon">${groupIcon(name, isAll)}</span>
            <span class="group-name-wrap">
              <span class="group-name">${escapeHtml(isAll ? t("top.allTitle") : name)}</span>
              <span class="group-count">${getCategoryCount(name)}</span>
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
  const iconUrl = getBookmarkIconUrl(item.url);
  const initial = getBookmarkInitial(item.title);
  const logoTextClass = initial.length >= 3 ? "is-word-logo" : initial.length >= 2 ? "is-short-logo" : "";
  const domain = getBookmarkDomain(item.url);
  const bookmarkCategories = getBookmarkCategories(item);
  const visibleCategoryChips = bookmarkCategories.slice(0, 3);
  const hiddenCategoryCount = Math.max(0, bookmarkCategories.length - visibleCategoryChips.length);
  const categoryChips = visibleCategoryChips.length
    ? `
      <div class="card-groups" aria-label="所属分组">
        ${visibleCategoryChips.map((name) => `<span>${escapeHtml(name)}</span>`).join("")}
        ${hiddenCategoryCount ? `<span>+${hiddenCategoryCount}</span>` : ""}
      </div>
    `
    : "";

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
        <span class="card-sheen" aria-hidden="true"></span>
        <div class="card-top">
          <span class="card-logo ${iconUrl ? "is-loading" : "is-fallback"} ${logoTextClass}" aria-hidden="true" ${iconUrl ? `data-icon-url="${escapeAttr(iconUrl)}"` : ""}>
            ${iconUrl ? `<img class="card-favicon" src="${escapeAttr(iconUrl)}" alt="" decoding="async" referrerpolicy="no-referrer">` : ""}
            <span class="card-logo-text">${escapeHtml(initial)}</span>
          </span>
          ${adminButtons}
        </div>
        <div class="card-title-wrap">
          <h3>${escapeHtml(item.title)}</h3>
          ${domain ? `<span class="card-domain">${escapeHtml(domain)}</span>` : ""}
        </div>
        <p class="card-desc">${escapeHtml(item.description || t("bookmark.emptyDesc"))}</p>
        ${categoryChips}
        ${guestHint}
      </div>
    </article>
  `;
}

function renderTextEditor() {
  if (!els.textList) return;

  const rowsForEditor = getTextRowsForEditor();
  const grouped = {};

  for (const row of rowsForEditor) {
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

  const html = groupOrder
    .filter((key) => grouped[key]?.length)
    .map((groupKey) => {
      const meta = TEXT_GROUP_META[groupKey] || TEXT_GROUP_META.other;
      const rows = grouped[groupKey];

      return `
        <section class="copy-group" data-copy-group="${escapeAttr(groupKey)}">
          <div class="copy-group-head">
            <div>
              <strong>${escapeHtml(meta.title)}</strong>
              <span>${escapeHtml(meta.desc)}</span>
            </div>
            <em>${rows.length} 项</em>
          </div>

          <div class="copy-group-body">
            ${rows.map((row) => {
              const value = row.value ?? texts[row.key] ?? "";
              return `
                <label class="copy-field">
                  <span class="copy-field-info">
                    <strong>${escapeHtml(row.description || row.key)}</strong>
                    <span>${escapeHtml(row.key)}</span>
                  </span>

                  <textarea
                    data-text-key="${escapeAttr(row.key)}"
                    spellcheck="false"
                    rows="2"
                  >${escapeHtml(value)}</textarea>
                </label>
              `;
            }).join("")}
          </div>
        </section>
      `;
    })
    .join("");

  els.textList.innerHTML = html || `
    <div class="copy-empty">暂无可编辑文案。</div>
  `;
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

  activateBookmarkIcons();
}

function activateBookmarkIcons() {
  const images = els.bookmarkGrid.querySelectorAll(".card-logo img.card-favicon");

  images.forEach((img) => {
    const logo = img.closest(".card-logo");
    if (!logo) return;

    let settled = false;
    let fallbackTimer = null;

    const cleanup = () => {
      settled = true;
      clearTimeout(fallbackTimer);
      img.removeEventListener("load", showIcon);
      img.removeEventListener("error", showFallback);
    };

    const showIcon = () => {
      if (settled) return;

      if (!img.naturalWidth) {
        showFallback();
        return;
      }

      cleanup();
      logo.classList.add("has-icon");
      logo.classList.remove("is-fallback", "is-loading");
    };

    const showFallback = () => {
      if (settled) return;

      cleanup();
      logo.classList.add("is-fallback");
      logo.classList.remove("has-icon", "is-loading");
      img.remove();
    };

    // 先给 favicon 2 秒加载窗口；超过 2 秒还没成功，就立刻回退为书签名首字。
    fallbackTimer = setTimeout(showFallback, 2000);

    if (img.complete) {
      requestAnimationFrame(showIcon);
      return;
    }

    img.addEventListener("load", showIcon);
    img.addEventListener("error", showFallback);
  });
}

function openBookmarkDialog(item = null) {
  els.bookmarkForm.reset();
  renderCategorySelect();

  if (item) {
    els.formTitle.textContent = t("bookmarkForm.editTitle");
    els.bookmarkId.value = item.id;
    els.titleInput.value = item.title ?? "";
    els.urlInput.value = item.url ?? "";
    els.descriptionInput.value = item.description ?? "";

    const selectedCategories = getBookmarkCategories(item);
    ensureCategoryCheckboxOptions(selectedCategories);
    setSelectedBookmarkCategories(selectedCategories);
  } else {
    els.formTitle.textContent = t("bookmarkForm.addTitle");
    els.bookmarkId.value = "";

    const defaultCategories = currentCategory !== "全部" && !isReservedCategoryName(currentCategory)
      ? [currentCategory]
      : [];

    ensureCategoryCheckboxOptions(defaultCategories);
    setSelectedBookmarkCategories(defaultCategories);
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

async function openTextDialog() {
  if (!isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  await loadSiteTexts();
  renderTextEditor();
  els.textDialog.showModal();
}

async function loadSiteTexts() {
  const defaultMap = new Map(
    getDefaultTextObjects().map((row) => [row.key, row])
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
    if (!row?.key) continue;

    const old = defaultMap.get(row.key);

    defaultMap.set(row.key, {
      key: row.key,
      value: String(row.value ?? "").trim() ? row.value : old?.value ?? "",
      description: row.description ?? old?.description ?? row.key,
    });
  }

  siteTextRows = [...defaultMap.values()];
  texts = Object.fromEntries(siteTextRows.map((row) => [row.key, row.value]));
  applySiteTexts();
}

async function saveSiteTextRowsWithFallback(rows) {
  const upsertResult = await supabase
    .from("site_texts")
    .upsert(rows, { onConflict: "key" });

  if (!upsertResult.error) {
    return { error: null };
  }

  const fallbackRows = rows.map((row) => ({
    key: row.key,
    value: row.value,
    description: row.description,
  }));

  for (const row of fallbackRows) {
    const updateResult = await supabase
      .from("site_texts")
      .update(row)
      .eq("key", row.key)
      .select("key");

    if (updateResult.error) {
      return { error: updateResult.error };
    }

    if (!updateResult.data?.length) {
      const insertResult = await supabase
        .from("site_texts")
        .insert(row);

      if (insertResult.error) {
        return { error: insertResult.error };
      }
    }
  }

  return { error: null };
}

async function saveSiteTexts(event) {
  event.preventDefault();

  if (!supabase || !isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  const inputs = [...els.textList.querySelectorAll("[data-text-key]")];
  const metaMap = new Map(getTextRowsForEditor().map((row) => [row.key, row]));

  const nextRows = inputs
    .map((input) => {
      const key = input.dataset.textKey;
      const meta = metaMap.get(key);
      const inputValue = String(input.value ?? "");
      const normalizedValue = inputValue.trim() ? inputValue : (meta?.value ?? "");

      return {
        key,
        value: normalizedValue,
        description: meta?.description || key,
      };
    })
    .filter((row) => row.key);

  if (!nextRows.length) return;

  const oldMap = new Map(getTextRowsForEditor().map((row) => [row.key, row.value ?? ""]));
  const changedRows = nextRows.filter((row) => String(row.value ?? "") !== String(oldMap.get(row.key) ?? ""));

  if (!changedRows.length) {
    els.textDialog.close();
    showToast("页面文案没有变化");
    return;
  }

  els.textSaveBtn.disabled = true;
  els.textSaveBtn.classList.add("is-loading");

  // 保存前暂停当前页面的 Realtime 订阅。
  // Supabase 会把本窗口写入产生的事件再推回来，如果不暂停，页面会被同一批事件反复重绘。
  pauseRealtime();
  ignoreSiteTextRealtimeUntil = Date.now() + 4000;

  const { error } = await saveSiteTextRowsWithFallback(changedRows);

  els.textSaveBtn.disabled = false;
  els.textSaveBtn.classList.remove("is-loading");

  if (error) {
    resumeRealtimeSoon();
    showToast(error.message, "error");
    return;
  }

  const changedTextMap = Object.fromEntries(changedRows.map((row) => [row.key, row.value]));
  texts = { ...texts, ...changedTextMap };
  siteTextRows = getTextRowsForEditor().map((row) => ({
    ...row,
    value: changedTextMap[row.key] ?? row.value,
  }));

  els.textDialog.close();
  applySiteTexts();
  safeRender(true);
  showToast(t("toast.textSaved"));
  resumeRealtimeSoon();
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

async function loadBookmarks(options = {}) {
  const { renderAfter = true, quiet = true } = options;

  if (!supabase) {
    bookmarks = [];
    bookmarksDataSignature = "";
    els.setupNotice.classList.remove("hidden");
    setRealtimeStatus("error", t("sync.notConfigured"));
    if (renderAfter) safeRender(quiet);
    return true;
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .select("id,title,url,description,category,tags,is_active,created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    bookmarks = [];
    bookmarksDataSignature = "";
    setRealtimeStatus("error", t("sync.readError"));
    showToast(error.message, "error");
    if (renderAfter) safeRender(quiet);
    return true;
  }

  const nextRows = data ?? [];
  const nextSignature = getBookmarksDataSignature(nextRows);
  const changed = nextSignature !== bookmarksDataSignature;

  bookmarks = nextRows;
  bookmarksDataSignature = nextSignature;

  if (changed && renderAfter) {
    safeRender(quiet);
  }

  return changed;
}

async function loadCategories(options = {}) {
  const { renderAfter = true, quiet = true } = options;

  if (!supabase) {
    categories = [];
    categoriesDataSignature = "";
    if (renderAfter) safeRender(quiet);
    return true;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id,name,sort_order,is_active,created_at")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    categories = [];
    categoriesDataSignature = "";
    showToast(error.message, "error");
    if (renderAfter) safeRender(quiet);
    return true;
  }

  const nextRows = data ?? [];
  const nextSignature = getCategoriesDataSignature(nextRows);
  const changed = nextSignature !== categoriesDataSignature;

  categories = nextRows;
  categoriesDataSignature = nextSignature;

  if (changed && renderAfter) {
    safeRender(quiet);
  }

  return changed;
}

async function loadAllData(options = {}) {
  const { quiet = true } = options;
  const [bookmarksChanged, categoriesChanged] = await Promise.all([
    loadBookmarks({ renderAfter: false }),
    loadCategories({ renderAfter: false }),
  ]);

  if (bookmarksChanged || categoriesChanged) {
    safeRender(quiet);
  }
}

function subscribeRealtime() {
  if (!supabase || realtimePaused) return;

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
      () => {
        scheduleDataRealtimeRefresh();
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
      () => {
        scheduleDataRealtimeRefresh();
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
      () => {
        if (realtimePaused || Date.now() < ignoreSiteTextRealtimeUntil) {
          return;
        }

        clearTimeout(siteTextsRealtimeTimer);
        siteTextsRealtimeTimer = setTimeout(async () => {
          await loadSiteTexts();
          safeRender(true);
        }, 650);
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

  const selectedCategories = getSelectedBookmarkCategories();

  if (!selectedCategories.length) {
    showToast("请至少选择一个分组", "error");
    return;
  }

  const id = els.bookmarkId.value;
  const currentItem = id
    ? bookmarks.find((item) => String(item.id) === String(id))
    : null;

  const categoryPayload = getBookmarkCategoryPayload(selectedCategories, currentItem || {});

  const payload = {
    title: els.titleInput.value.trim(),
    url: normalizeUrl(els.urlInput.value),
    description: els.descriptionInput.value.trim(),
    ...categoryPayload,
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

  pauseRealtime();

  const query = id
    ? supabase.from("bookmarks").update(payload).eq("id", id).select("id").single()
    : supabase.from("bookmarks").insert(payload).select("id").single();

  const { data, error } = await query;

  if (error) {
    resumeRealtimeSoon();
    showToast(error.message, "error");
    return;
  }

  highlightBookmarkId = data?.id || id || null;

  els.bookmarkDialog.close();
  showToast(id ? t("toast.bookmarkUpdated") : t("toast.bookmarkAdded"));

  await loadBookmarks({ quiet: true });
  resumeRealtimeSoon();

  setTimeout(() => {
    highlightBookmarkId = null;
    safeRender(true);
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

  pauseRealtime();

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);

  if (error) {
    resumeRealtimeSoon();
    showToast(error.message, "error");
    return;
  }

  showToast(t("toast.bookmarkDeleted"));
  await loadBookmarks({ quiet: true });
  resumeRealtimeSoon();
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

  if (isReservedCategoryName(newName)) {
    showToast("这个分组名称不能使用", "error");
    return;
  }

  if (newName.length > 40) {
    showToast("分组名称最多 40 个字符", "error");
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

  pauseRealtime();

  const query = id
    ? supabase.from("categories").update(payload).eq("id", id)
    : supabase.from("categories").insert(payload);

  const { error } = await query;

  if (error) {
    resumeRealtimeSoon();
    showToast(error.message, "error");
    return;
  }

  if (id && oldName && oldName !== newName) {
    const { error: bookmarkError } = await replaceCategoryOnBookmarks(oldName, newName);

    if (bookmarkError) {
      resumeRealtimeSoon();
      showToast(bookmarkError.message, "error");
      return;
    }

    if (currentCategory === oldName) {
      currentCategory = newName;
    }
  }

  els.categoryDialog.close();
  showToast(id ? t("toast.categoryUpdated") : t("toast.categoryAdded"));
  await loadAllData({ quiet: true });
  resumeRealtimeSoon();
}

async function deleteCategory(id) {
  if (!supabase || !isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  const target = categories.find((item) => String(item.id) === String(id));

  if (!target) return;

  const confirmed = window.confirm(t("confirm.deleteCategory", { name: target.name }));

  if (!confirmed) return;

  pauseRealtime();

  const { error: bookmarkError } = await removeCategoryFromBookmarks(target.name);

  if (bookmarkError) {
    resumeRealtimeSoon();
    showToast(bookmarkError.message, "error");
    return;
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    resumeRealtimeSoon();
    showToast(error.message, "error");
    return;
  }

  if (currentCategory === target.name) {
    currentCategory = "全部";
  }

  showToast(t("toast.categoryDeleted"));
  await loadAllData({ quiet: true });
  resumeRealtimeSoon();
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

  pauseRealtime();
  const results = await Promise.all(updates);
  const failed = results.find((result) => result.error);

  if (failed?.error) {
    showToast(failed.error.message, "error");
    await loadCategories({ quiet: true });
    resumeRealtimeSoon();
    return;
  }

  showToast(t("toast.categoryOrderUpdated"));
  await loadCategories({ quiet: true });
  resumeRealtimeSoon();
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
  sidebarEditMode = false;
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

    resetAllCardTilt();
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
  setBookmarkView(localStorage.getItem("bookmark-view") || "grid", false);

  document.querySelectorAll("[data-view-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      setBookmarkView(button.dataset.viewMode);
    });
  });

  window.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      els.searchInput.focus();
    }
  });

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

  els.groupManageBtn?.addEventListener("click", () => {
    if (!isAdmin()) return;
    sidebarEditMode = !sidebarEditMode;
    els.groupManageBtn.classList.toggle("is-active", sidebarEditMode);
    els.groupManageBtn.setAttribute("aria-pressed", String(sidebarEditMode));
    els.groupManageBtn.textContent = sidebarEditMode ? "完成" : "整理";
    renderGroupList();
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
    const dragBtn = event.target.closest(".drag-handle");
    const categoryBtn = event.target.closest("[data-category-name]");

    if (dragBtn) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

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

    const px = Math.min(Math.max(x / rect.width, 0), 1);
    const py = Math.min(Math.max(y / rect.height, 0), 1);
    const isDark = document.documentElement.dataset.theme === "dark";
    const strength = isDark ? 4.2 : 6.4;

    const rotateY = (px - .5) * strength;
    const rotateX = (.5 - py) * strength;

    card.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--mx", `${(px * 100).toFixed(2)}%`);
    card.style.setProperty("--my", `${(py * 100).toFixed(2)}%`);
  });

  els.bookmarkGrid.addEventListener("mouseleave", () => {
    resetAllCardTilt();
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
  await loadAllData({ quiet: false });
  subscribeRealtime();
}

init();

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

const RESERVED_CATEGORY_NAMES = new Set(["全部", "其他"]);

const CATEGORY_ICON_OPTIONS = [
  { key: "paw-cat", label: "猫爪" },
  { key: "paw-dog", label: "狗爪" },
  { key: "star", label: "星星" },
  { key: "ai", label: "AI" },
  { key: "code", label: "代码" },
  { key: "tool", label: "工具" },
  { key: "game", label: "游戏" },
  { key: "book", label: "阅读" },
  { key: "image", label: "图片" },
  { key: "link", label: "链接" },
  { key: "heart", label: "喜欢" },
];

const CATEGORY_ICON_KEYS = new Set(CATEGORY_ICON_OPTIONS.map((item) => item.key));
const IMPORT_BATCH_SIZE = 40;

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

const EDITABLE_TEXT_KEYS = new Set([
  "brand.title",
  "brand.subtitle",
  "sidebar.groupTitle",
  "sidebar.tipTitle",
  "sidebar.tipDesc",
  "top.allTitle",
  "top.allSubtitle",
  "top.categorySubtitle",
  "top.searchSubtitle",
  "admin.badge",
  "admin.loginButton",
  "admin.logoutButton",
  "admin.textButton",
  "search.placeholder",
  "search.idle",
  "search.found",
  "search.empty",
  "bookmark.addButton",
  "bookmark.emptyDesc",
  "bookmark.openHint",
  "empty.title",
  "empty.desc",
]);

const EDITABLE_TEXT_KEY_LIST = [...EDITABLE_TEXT_KEYS];

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
  batchToggleBtn: $("#batchToggleBtn"),
  importExportBtn: $("#importExportBtn"),
  trashOpenBtn: $("#trashOpenBtn"),
  systemCheckBtn: $("#systemCheckBtn"),

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
  categoryIconInput: $("#categoryIconInput"),
  categoryIconList: $("#categoryIconList"),
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

  batchToolbar: $("#batchToolbar"),
  batchCount: $("#batchCount"),
  batchSelectVisibleBtn: $("#batchSelectVisibleBtn"),
  batchClearBtn: $("#batchClearBtn"),
  batchExitBtn: $("#batchExitBtn"),
  batchAddGroupBtn: $("#batchAddGroupBtn"),
  batchReplaceGroupBtn: $("#batchReplaceGroupBtn"),
  batchRemoveGroupBtn: $("#batchRemoveGroupBtn"),
  batchPinBtn: $("#batchPinBtn"),
  batchUnpinBtn: $("#batchUnpinBtn"),
  batchRefreshIconBtn: $("#batchRefreshIconBtn"),
  batchExportBtn: $("#batchExportBtn"),
  batchDeleteBtn: $("#batchDeleteBtn"),
  batchCategoryDialog: $("#batchCategoryDialog"),
  batchCategoryForm: $("#batchCategoryForm"),
  batchCategoryTitle: $("#batchCategoryTitle"),
  batchCategoryDesc: $("#batchCategoryDesc"),
  batchCategoryMode: $("#batchCategoryMode"),
  batchCategoryList: $("#batchCategoryList"),
  batchCategoryCancelBtn: $("#batchCategoryCancelBtn"),
  batchCategorySaveBtn: $("#batchCategorySaveBtn"),

  importExportDialog: $("#importExportDialog"),
  importExportForm: $("#importExportForm"),
  exportJsonBtn: $("#exportJsonBtn"),
  exportCsvBtn: $("#exportCsvBtn"),
  importFileInput: $("#importFileInput"),
  importSkipDuplicates: $("#importSkipDuplicates"),
  importStatus: $("#importStatus"),
  importRunBtn: $("#importRunBtn"),
  importPreview: $("#importPreview"),

  trashDialog: $("#trashDialog"),
  trashStatus: $("#trashStatus"),
  trashList: $("#trashList"),
  trashEmptyBtn: $("#trashEmptyBtn"),

  systemCheckDialog: $("#systemCheckDialog"),
  systemCheckRunBtn: $("#systemCheckRunBtn"),
  systemCheckSummary: $("#systemCheckSummary"),
  systemCheckList: $("#systemCheckList"),

  errorDialog: $("#errorDialog"),
  errorDialogTitle: $("#errorDialogTitle"),
  errorDialogMessage: $("#errorDialogMessage"),
  errorDialogDetail: $("#errorDialogDetail"),
  errorDialogFix: $("#errorDialogFix"),
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
let batchMode = false;
let selectedBookmarkIds = new Set();
let siteTextsRealtimeTimer = null;
let ignoreSiteTextRealtimeUntil = 0;
let realtimePaused = false;
let realtimeResumeTimer = null;
let dataRealtimeTimer = null;
let bookmarksDataSignature = "";
let categoriesDataSignature = "";
let quietRenderTimer = null;
let pendingImportFile = null;
let pendingImportPreview = null;
let activeCardMenuId = null;
let isInitialLoading = true;
let deletedBookmarksCache = [];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function timeoutError(label = "请求") {
  const error = new Error(`${label} 超时，请检查网络、Supabase 项目状态或浏览器控制台错误。`);
  error.code = "REQUEST_TIMEOUT";
  return error;
}

async function withTimeout(promise, ms = 12000, label = "请求") {
  let timer = null;

  try {
    return await Promise.race([
      Promise.resolve(promise),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(timeoutError(label)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function runSupabaseQuery(query, label = "数据库请求", ms = 12000) {
  try {
    return await withTimeout(query, ms, label);
  } catch (error) {
    return { data: null, error };
  }
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
    stableValue(item.category_ids),
    stableValue(item.category_names),
    stableValue(item.icon_url),
    stableValue(item.icon_status),
    stableValue(item.is_pinned),
    stableValue(item.open_count),
    stableValue(item.last_opened_at),
    stableValue(item.is_deleted),
    stableValue(item.deleted_at),
    stableValue(item.is_active),
    stableValue(item.created_at),
  ]));
}

function getCategoriesDataSignature(rows = []) {
  return JSON.stringify((rows || []).map((item) => [
    stableValue(item.id),
    stableValue(item.name),
    stableValue(item.sort_order),
    stableValue(item.icon),
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

function renderLoadingSkeleton() {
  isInitialLoading = true;
  document.body.classList.add("is-loading-data");
  if (els.currentTitle) els.currentTitle.textContent = t("top.allTitle");
  if (els.currentSubtitle) els.currentSubtitle.textContent = t("top.loadingSubtitle");
  if (!els.bookmarkGrid) return;

  els.bookmarkGrid.classList.remove("has-sections");
  els.bookmarkGrid.innerHTML = Array.from({ length: 8 }).map((_, index) => {
    const delay = Math.min(index * 30, 180);
    return `
      <article class="card skeleton-card" style="animation-delay:${delay}ms" aria-hidden="true">
        <div class="card-content">
          <div class="skeleton-logo"></div>
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-line skeleton-domain"></div>
          <div class="skeleton-line skeleton-desc"></div>
          <div class="skeleton-line skeleton-small"></div>
        </div>
      </article>
    `;
  }).join("");
}

function finishLoadingSkeleton() {
  isInitialLoading = false;
  document.body.classList.remove("is-loading-data");
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

function getRefreshBookmarkIconUrl(url) {
  const base = getBookmarkIconUrl(url);
  if (!base) return "";
  const joiner = base.includes("?") ? "&" : "?";
  return `${base}${joiner}v=${Date.now()}`;
}

function getDefaultCategoryIcon(name = "") {
  const value = String(name || "").toLowerCase();
  if (value.includes("ai") || value.includes("智能")) return "ai";
  if (value.includes("开发") || value.includes("code") || value.includes("dev")) return "code";
  if (value.includes("工具") || value.includes("tool")) return "tool";
  if (value.includes("游戏") || value.includes("game")) return "game";
  if (value.includes("阅读") || value.includes("学习") || value.includes("book")) return "book";
  if (value.includes("图") || value.includes("image") || value.includes("design") || value.includes("设计")) return "image";
  if (value.includes("收藏") || value.includes("favorite") || value.includes("love")) return "heart";
  return "paw-cat";
}

function normalizeCategoryIcon(icon, fallbackName = "") {
  const value = String(icon || "").trim();
  return CATEGORY_ICON_KEYS.has(value) ? value : getDefaultCategoryIcon(fallbackName);
}

function createDownload(filename, content, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function csvCell(value = "") {
  const escaped = String(value ?? "").replaceAll('"', '""');
  return `"${escaped}"`;
}

function normalizedUrlKey(url = "") {
  try {
    const parsed = new URL(normalizeUrl(url));
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return String(url || "").trim().toLowerCase();
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

function uniqueIds(ids = []) {
  const result = [];
  const seen = new Set();

  for (const id of ids) {
    const value = String(id ?? "").trim();

    if (!value || seen.has(value)) continue;

    result.push(value);
    seen.add(value);
  }

  return result;
}

function getSelectableCategories() {
  return getSortedCategories().filter((category) => !isReservedCategoryName(category?.name));
}

function getSelectableCategoryNames() {
  return getSelectableCategories().map((category) => category.name);
}

function getCategoryById(id) {
  const value = String(id ?? "");
  return categories.find((category) => String(category.id) === value) || null;
}

function getCategoryIdsByNames(names = []) {
  const normalizedNames = uniqueCategoryNames(names).map((name) => name.toLowerCase());
  const ids = [];

  for (const name of normalizedNames) {
    const category = categories.find((item) => String(item.name || "").trim().toLowerCase() === name);
    if (category?.id) ids.push(String(category.id));
  }

  return uniqueIds(ids);
}

function getBookmarkCategoryIds(item = {}) {
  if (Array.isArray(item.category_ids) && item.category_ids.length) {
    return uniqueIds(item.category_ids);
  }

  const names = Array.isArray(item.category_names) && item.category_names.length
    ? item.category_names
    : [item.category];

  return getCategoryIdsByNames(names);
}

function getBookmarkCategories(item = {}) {
  if (Array.isArray(item.category_names) && item.category_names.length) {
    return uniqueCategoryNames(item.category_names);
  }

  const fromIds = getBookmarkCategoryIds(item)
    .map((id) => getCategoryById(id)?.name)
    .filter(Boolean);

  if (fromIds.length) {
    return uniqueCategoryNames(fromIds);
  }

  return uniqueCategoryNames([item.category]);
}

function getCategoryCheckboxes() {
  return [...els.categoryInput.querySelectorAll('input[name="bookmark-categories"]')];
}

function ensureCategoryCheckboxOptions() {
}

function getSelectedBookmarkCategoryIds() {
  return uniqueIds(
    getCategoryCheckboxes()
      .filter((input) => input.checked)
      .map((input) => input.value)
  );
}

function getSelectedBookmarkCategories() {
  return getSelectedBookmarkCategoryIds()
    .map((id) => getCategoryById(id)?.name)
    .filter(Boolean);
}

function setSelectedBookmarkCategoryIds(ids = []) {
  const selected = new Set(uniqueIds(ids));

  getCategoryCheckboxes().forEach((input) => {
    input.checked = selected.has(String(input.value));
  });
}

function setSelectedBookmarkCategories(names = []) {
  setSelectedBookmarkCategoryIds(getCategoryIdsByNames(names));
}

function getBookmarkCategoryPayload(categoryIds = []) {
  const firstCategory = uniqueIds(categoryIds)
    .map((id) => getCategoryById(id))
    .find(Boolean);

  return {
    category: firstCategory?.name || "",
  };
}

async function replaceBookmarkCategoryLinks(bookmarkId, categoryIds = []) {
  const normalizedIds = uniqueIds(categoryIds);

  const deleteResult = await supabase
    .from("bookmark_categories")
    .delete()
    .eq("bookmark_id", bookmarkId);

  if (deleteResult.error) {
    return { error: deleteResult.error };
  }

  if (!normalizedIds.length) {
    return { error: null };
  }

  const rows = normalizedIds.map((categoryId) => ({
    bookmark_id: bookmarkId,
    category_id: categoryId,
  }));

  const insertResult = await supabase
    .from("bookmark_categories")
    .insert(rows);

  return { error: insertResult.error || null };
}

async function updateBookmarkCategories(item, nextCategoryIds = []) {
  const categoryPayload = getBookmarkCategoryPayload(nextCategoryIds);

  const bookmarkResult = await supabase
    .from("bookmarks")
    .update(categoryPayload)
    .eq("id", item.id);

  if (bookmarkResult.error) {
    return { error: bookmarkResult.error };
  }

  return replaceBookmarkCategoryLinks(item.id, nextCategoryIds);
}

async function replaceCategoryOnBookmarks(oldName, newName) {
  const oldValue = normalizeCategoryName(oldName);
  const newValue = normalizeCategoryName(newName);

  if (!oldValue || !newValue || oldValue === newValue) return { error: null };

  return supabase
    .from("bookmarks")
    .update({ category: newValue })
    .eq("category", oldValue);
}

async function removeCategoryFromBookmarks(name) {
  const value = normalizeCategoryName(name);

  if (!value) return { error: null };

  return supabase
    .from("bookmarks")
    .update({ category: "" })
    .eq("category", value);
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

function closeCardMenus(exceptId = null) {
  document.querySelectorAll(".card-menu.is-open").forEach((menu) => {
    const toggle = menu.querySelector("[data-card-menu-toggle]");
    const menuId = toggle?.dataset.cardMenuToggle;

    if (exceptId !== null && String(menuId) === String(exceptId)) return;

    menu.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  });

  if (exceptId === null) {
    activeCardMenuId = null;
  }
}

function toggleCardMenu(menuToggle) {
  const nextId = menuToggle?.dataset?.cardMenuToggle;
  const menu = menuToggle?.closest(".card-menu");

  if (!nextId || !menu) return;

  const wasOpen = menu.classList.contains("is-open");

  closeCardMenus();

  if (wasOpen) {
    activeCardMenuId = null;
    return;
  }

  activeCardMenuId = String(nextId);
  menu.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
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


function getReadableError(error) {
  if (!error) return "未知错误";
  return error.message || error.error_description || error.details || String(error);
}

function getDatabaseFixHint(error) {
  const message = getReadableError(error).toLowerCase();

  if (message.includes("column") && message.includes("does not exist")) {
    return "数据库字段和当前前端代码不匹配。请先运行最新 SQL 文件，或者在 Supabase Table Editor 里补齐缺失字段。";
  }

  if (message.includes("relation") && message.includes("does not exist")) {
    return "数据库表或关联表不存在。请确认已经运行包含 bookmark_categories、icon_url、icon_status、is_pinned 等结构的最新 SQL。";
  }

  if (message.includes("permission") || message.includes("row-level security") || message.includes("rls")) {
    return "当前账号没有通过 RLS 权限检查。请确认你登录的是管理员邮箱，并且 bookmarks、categories、bookmark_categories、site_texts 的 RLS 策略允许管理员写入。";
  }

  if (message.includes("duplicate") || message.includes("unique")) {
    return "数据库存在重复数据或唯一约束冲突。请检查分类名称、页面文案 key 或书签关联表是否有重复记录。";
  }

  return "可以先强制刷新网页。如果仍然出现，请运行系统检查，或把这条错误截图发给我。";
}

function showErrorDialog(title, message, detail = "", fix = "") {
  if (!els.errorDialog) {
    showToast(message || title || "操作失败", "error");
    return;
  }

  els.errorDialogTitle.textContent = title || "出现问题";
  els.errorDialogMessage.textContent = message || "操作没有完成。";

  const detailText = detail ? String(detail) : "";
  els.errorDialogDetail.textContent = detailText;
  els.errorDialogDetail.classList.toggle("hidden", !detailText);

  const fixText = fix ? String(fix) : "";
  els.errorDialogFix.textContent = fixText;
  els.errorDialogFix.classList.toggle("hidden", !fixText);

  els.errorDialog.showModal();
}

function handleOperationError(error, title = "操作失败", userMessage = "这次操作没有完成。", options = {}) {
  const detail = getReadableError(error);
  const fix = options.fix || getDatabaseFixHint(error);

  showToast(userMessage, "error");

  if (options.dialog !== false) {
    showErrorDialog(title, userMessage, detail, fix);
  }
}

function getDefaultTextObjects() {
  return DEFAULT_TEXT_ROWS.map(([key, value, description]) => ({
    key,
    value,
    description: description || key,
  }));
}

function getEditableTextObjects() {
  return getDefaultTextObjects().filter((row) => EDITABLE_TEXT_KEYS.has(row.key));
}

function getTextRowsForEditor() {
  const defaultMap = new Map(
    getEditableTextObjects().map((row) => [row.key, row])
  );

  for (const row of siteTextRows || []) {
    if (!row || !EDITABLE_TEXT_KEYS.has(row.key)) continue;

    const old = defaultMap.get(row.key);

    defaultMap.set(row.key, {
      key: row.key,
      value: row.value ?? old?.value ?? "",
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

function updateAdminVisibility() {
  const admin = isAdmin();

  if (!admin) {
    sidebarEditMode = false;
    batchMode = false;
    selectedBookmarkIds.clear();
  }

  els.addOpenBtn?.classList.toggle("hidden", !admin);
  els.addCategoryBtn?.classList.toggle("hidden", !admin);
  els.groupManageBtn?.classList.toggle("hidden", !admin);
  els.groupManageBtn?.classList.toggle("is-active", admin && sidebarEditMode);
  els.groupManageBtn?.setAttribute("aria-pressed", String(admin && sidebarEditMode));
  if (els.groupManageBtn) {
    els.groupManageBtn.textContent = sidebarEditMode ? "取消整理" : "整理";
    els.groupManageBtn.title = sidebarEditMode ? "退出分组整理模式" : "整理分组";
  }

  els.batchToggleBtn?.classList.toggle("hidden", !admin);
  els.batchToggleBtn?.classList.toggle("is-active", admin && batchMode);
  els.batchToggleBtn?.setAttribute("aria-pressed", String(admin && batchMode));
  if (els.batchToggleBtn) {
    els.batchToggleBtn.textContent = batchMode ? "取消批量" : "批量管理";
    els.batchToggleBtn.title = batchMode ? "退出批量管理" : "进入批量管理";
  }

  els.textOpenBtn?.classList.toggle("hidden", !admin);
  els.importExportBtn?.classList.toggle("hidden", !admin);
  els.trashOpenBtn?.classList.toggle("hidden", !admin);
  els.systemCheckBtn?.classList.toggle("hidden", !admin);
  els.adminBadge.classList.toggle("hidden", !admin);
  els.logoutBtn.classList.toggle("hidden", !currentUser);
  els.loginOpenBtn.classList.toggle("hidden", !!currentUser);
}

function setAdminUI(options = {}) {
  const { renderAfter = true, quiet = true } = options;

  updateAdminVisibility();

  if (renderAfter) {
    safeRender(quiet);
  }
}

function setSidebarEditMode(nextValue, options = {}) {
  if (!isAdmin()) return;

  const { renderAfter = true } = options;
  sidebarEditMode = Boolean(nextValue);
  updateAdminVisibility();

  if (renderAfter) {
    renderGroupList();
  }
}

function exitAdminModes(options = {}) {
  const { renderAfter = true } = options;
  let changed = false;

  if (sidebarEditMode) {
    sidebarEditMode = false;
    changed = true;
  }

  if (batchMode) {
    batchMode = false;
    selectedBookmarkIds.clear();
    changed = true;
  }

  if (!changed) return false;

  updateAdminVisibility();
  if (renderAfter) {
    render();
  }

  return true;
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

function groupIcon(iconKey = "paw-cat", isAll = false) {
  const key = isAll ? "all" : normalizeCategoryIcon(iconKey);

  const icons = {
    all: `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
    `,
    "paw-cat": `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M7.7 10.2c-1.1.1-2.1-.9-2.3-2.3-.2-1.4.5-2.6 1.6-2.8 1.1-.1 2.1.9 2.3 2.3.2 1.4-.5 2.6-1.6 2.8ZM16.3 10.2c1.1.1 2.1-.9 2.3-2.3.2-1.4-.5-2.6-1.6-2.8-1.1-.1-2.1.9-2.3 2.3-.2 1.4.5 2.6 1.6 2.8ZM11.9 8.6c-1.1 0-2-1.1-2-2.5s.9-2.5 2-2.5 2 1.1 2 2.5-.9 2.5-2 2.5Z" fill="currentColor" opacity=".72"/>
        <path d="M6.8 16.6c0-2.4 2.1-5.1 5.2-5.1s5.2 2.7 5.2 5.1c0 2-1.5 3.8-3.5 3.1-.8-.3-1.2-.7-1.7-.7s-.9.4-1.7.7c-2 .7-3.5-1.1-3.5-3.1Z" fill="currentColor"/>
      </svg>
    `,
    "paw-dog": `
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="7.2" cy="8.6" r="2" fill="currentColor" opacity=".72"/>
        <circle cx="16.8" cy="8.6" r="2" fill="currentColor" opacity=".72"/>
        <circle cx="10.1" cy="6" r="2" fill="currentColor" opacity=".72"/>
        <circle cx="13.9" cy="6" r="2" fill="currentColor" opacity=".72"/>
        <path d="M6.7 16.8c0-2.5 2.3-5 5.3-5s5.3 2.5 5.3 5c0 2.2-1.7 3.8-3.8 3-.7-.3-1-.6-1.5-.6s-.8.3-1.5.6c-2.1.8-3.8-.8-3.8-3Z" fill="currentColor"/>
      </svg>
    `,
    star: `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="m12 3.8 2.3 5 5.4.6-4 3.7 1.1 5.4-4.8-2.7-4.8 2.7 1.1-5.4-4-3.7 5.4-.6L12 3.8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
    `,
    ai: `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="m5 19 9.8-9.8M13.4 6.6l4 4M4.4 16.8l2.8 2.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M18 3.6v3.2M16.4 5.2h3.2M8 4.8v2.4M6.8 6h2.4M19 16.8v2.8M17.6 18.2h2.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `,
    code: `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="m9 7-5 5 5 5M15 7l5 5-5 5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    tool: `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M9 7V5.8C9 4.8 9.8 4 10.8 4h2.4c1 0 1.8.8 1.8 1.8V7M5.8 20h12.4c1 0 1.8-.8 1.8-1.8V8.8c0-1-.8-1.8-1.8-1.8H5.8C4.8 7 4 7.8 4 8.8v9.4c0 1 .8 1.8 1.8 1.8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M4 12h16M10 12v1.2c0 .5.4.8.8.8h2.4c.4 0 .8-.3.8-.8V12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `,
    game: `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M7.5 9h9A4.5 4.5 0 0 1 21 13.5v1.2a3.3 3.3 0 0 1-5.7 2.3l-1.1-1.1H9.8L8.7 17A3.3 3.3 0 0 1 3 14.7v-1.2A4.5 4.5 0 0 1 7.5 9Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M8 12v3M6.5 13.5h3M16.5 12.8h.01M18.2 14.5h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      </svg>
    `,
    book: `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M5 5.8c0-.8.7-1.4 1.5-1.2 2.2.3 4 .9 5.5 2v13c-1.5-1.1-3.3-1.7-5.5-2A1.7 1.7 0 0 1 5 15.9V5.8ZM19 5.8c0-.8-.7-1.4-1.5-1.2-2.2.3-4 .9-5.5 2v13c1.5-1.1 3.3-1.7 5.5-2a1.7 1.7 0 0 0 1.5-1.7V5.8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
    `,
    image: `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M5 6.5c0-.8.7-1.5 1.5-1.5h11c.8 0 1.5.7 1.5 1.5v11c0 .8-.7 1.5-1.5 1.5h-11c-.8 0-1.5-.7-1.5-1.5v-11Z" stroke="currentColor" stroke-width="1.8"/>
        <path d="m6 17 4.2-4.2 2.8 2.8 2-2 3 3M15.5 9h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    link: `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M9.6 14.4 14.4 9.6M10.6 7.1l.9-.9a4 4 0 0 1 5.7 5.7l-.9.9M13.4 16.9l-.9.9a4 4 0 1 1-5.7-5.7l.9-.9" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
      </svg>
    `,
    heart: `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 20s-7-4.2-7-10.2A3.9 3.9 0 0 1 12 7.4a3.9 3.9 0 0 1 7 2.4C19 15.8 12 20 12 20Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
    `,
  };

  return icons[key] || icons["paw-cat"];
}

function renderCategoryIconChoices(selectedIcon = "paw-cat") {
  if (!els.categoryIconList) return;

  const activeIcon = normalizeCategoryIcon(selectedIcon);

  els.categoryIconInput.value = activeIcon;
  els.categoryIconList.innerHTML = CATEGORY_ICON_OPTIONS
    .map((option) => {
      const isActive = option.key === activeIcon;
      return `
        <button class="icon-choice ${isActive ? "is-active" : ""}" type="button" data-category-icon="${escapeAttr(option.key)}" aria-pressed="${String(isActive)}" title="${escapeAttr(option.label)}">
          <span class="icon-choice-svg">${groupIcon(option.key)}</span>
          <span>${escapeHtml(option.label)}</span>
        </button>
      `;
    })
    .join("");
}

function setCategoryIconChoice(icon) {
  const nextIcon = normalizeCategoryIcon(icon);
  els.categoryIconInput.value = nextIcon;

  els.categoryIconList?.querySelectorAll("[data-category-icon]").forEach((button) => {
    const isActive = button.dataset.categoryIcon === nextIcon;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderCategorySelect() {
  const selectableCategories = getSelectableCategories();

  if (!selectableCategories.length) {
    els.categoryInput.innerHTML = `
      <div class="category-check-empty">
        还没有可选择的分组，请先在左侧新增分组。
      </div>
    `;
    return;
  }

  els.categoryInput.innerHTML = selectableCategories
    .map((category) => `
      <label class="category-check">
        <input type="checkbox" name="bookmark-categories" value="${escapeAttr(category.id)}">
        <span class="category-check-icon">${groupIcon(category.icon || getDefaultCategoryIcon(category.name))}</span>
        <span>${escapeHtml(category.name)}</span>
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
            <span class="group-icon">${groupIcon(categoryObj?.icon || getDefaultCategoryIcon(name), isAll)}</span>
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
  const shouldTryIcon = item.icon_status !== "failed";
  const iconUrl = shouldTryIcon ? (item.icon_url || getBookmarkIconUrl(item.url)) : "";
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

  const isBatchSelected = selectedBookmarkIds.has(String(item.id));
  const batchSelector = admin && batchMode
    ? `
      <label class="batch-card-check" aria-label="选择 ${escapeAttr(item.title)}">
        <input type="checkbox" data-batch-check="${escapeAttr(item.id)}" ${isBatchSelected ? "checked" : ""}>
        <span></span>
      </label>
    `
    : "";

  const isMenuOpen = activeCardMenuId && String(activeCardMenuId) === String(item.id);
  const adminButtons = admin && !batchMode
    ? `
      <div class="card-menu ${isMenuOpen ? "is-open" : ""}">
        <button class="card-menu-toggle" type="button" data-card-menu-toggle="${escapeAttr(item.id)}" aria-label="打开书签菜单" aria-expanded="${String(isMenuOpen)}">•••</button>
        <div class="card-menu-panel" role="menu">
          <button type="button" data-edit="${escapeAttr(item.id)}" role="menuitem">编辑</button>
          <button type="button" data-copy-link="${escapeAttr(item.id)}" role="menuitem">复制链接</button>
          <button type="button" data-refresh-icon="${escapeAttr(item.id)}" role="menuitem">刷新图标</button>
          <button type="button" data-pin="${escapeAttr(item.id)}" data-pin-value="${item.is_pinned ? "false" : "true"}" role="menuitem">${item.is_pinned ? "取消置顶" : "置顶"}</button>
          <button class="danger" type="button" data-delete="${escapeAttr(item.id)}" role="menuitem">删除</button>
        </div>
      </div>
    `
    : "";

  const guestAttrs = admin
    ? ""
    : `data-open-url="${escapeAttr(item.url)}" role="link" tabindex="0" aria-label="${escapeAttr(item.title)}"`;

  const guestHint = admin ? "" : `<div class="guest-hint">${escapeHtml(t("bookmark.openHint"))}</div>`;
  const pinnedBadge = item.is_pinned ? `<span class="pin-badge" title="置顶">★</span>` : "";

  return `
    <article
      class="card ${admin ? "admin-card" : "guest-card"} ${batchMode ? "is-batch-mode" : ""} ${item.is_pinned ? "is-pinned" : ""} ${isBatchSelected ? "is-selected" : ""} ${isHighlighted ? "is-new" : ""}"
      data-card-id="${escapeAttr(item.id)}"
      style="animation-delay:${Math.min(index * 35, 280)}ms"
      ${guestAttrs}
    >
      <div class="card-content">
        <span class="card-sheen" aria-hidden="true"></span>
        <div class="card-top">
          ${batchSelector}
          <span class="card-logo ${iconUrl ? "is-loading" : "is-fallback"} ${logoTextClass}" aria-hidden="true" ${iconUrl ? `data-icon-url="${escapeAttr(iconUrl)}"` : ""}>
            ${iconUrl ? `<img class="card-favicon" src="${escapeAttr(iconUrl)}" alt="" decoding="async" referrerpolicy="no-referrer" data-bookmark-icon-id="${escapeAttr(item.id)}">` : ""}
            <span class="card-logo-text">${escapeHtml(initial)}</span>
          </span>
          ${pinnedBadge}
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

function renderBookmarkSection(title, items, startIndex = 0, variant = "normal", desc = "") {
  if (!items.length) return "";

  return `
    <section class="bookmark-section bookmark-section-${escapeAttr(variant)}">
      <div class="bookmark-section-head">
        <div>
          <strong>${escapeHtml(title)}</strong>
          ${desc ? `<em>${escapeHtml(desc)}</em>` : ""}
        </div>
        <span>${items.length} 个</span>
      </div>
      <div class="section-grid">
        ${items.map((item, index) => renderCard(item, startIndex + index)).join("")}
      </div>
    </section>
  `;
}

function render() {
  renderCategorySelect();
  renderGroupList();

  if (isInitialLoading) return;

  const filtered = getFilteredBookmarks();
  const searchText = els.searchInput.value.trim();
  const pinned = !searchText
    ? filtered.filter((item) => item.is_pinned)
    : [];
  const pinnedIds = new Set(pinned.map((item) => String(item.id)));
  const recent = !searchText
    ? [...filtered]
        .filter((item) => item.last_opened_at && !pinnedIds.has(String(item.id)))
        .sort((a, b) => String(b.last_opened_at || "").localeCompare(String(a.last_opened_at || "")))
        .slice(0, 4)
    : [];
  const recentIds = new Set(recent.map((item) => String(item.id)));
  const frequent = !searchText
    ? getTopFrequentBookmarks(filtered, 4, new Set([...pinnedIds, ...recentIds]))
    : [];
  const frequentIds = new Set(frequent.map((item) => String(item.id)));
  const usedIds = new Set([...pinnedIds, ...recentIds, ...frequentIds]);
  const normal = filtered.filter((item) => !usedIds.has(String(item.id)));
  const shouldSection = recent.length > 0 || pinned.length > 0 || frequent.length > 0;

  updatePageMeta(filtered.length);
  updateSearchFeedback(filtered.length);

  els.emptyState.classList.toggle("hidden", filtered.length > 0);
  els.bookmarkGrid.classList.toggle("has-sections", shouldSection);
  els.bookmarkGrid.innerHTML = shouldSection
    ? [
        renderBookmarkSection("置顶收藏", pinned, 0, "pinned", "重要链接始终放在最前面"),
        renderBookmarkSection("最近打开", recent, pinned.length, "recent", "按照最近访问时间自动更新"),
        renderBookmarkSection("最常用", frequent, pinned.length + recent.length, "frequent", "根据打开次数自动排序"),
        renderBookmarkSection(currentCategory === "全部" ? "全部收藏" : "普通收藏", normal, pinned.length + recent.length + frequent.length, "normal", "其余收藏按当前分组展示"),
      ].join("")
    : filtered.map((item, index) => renderCard(item, index)).join("");

  activateBookmarkIcons();
  updateBatchUI();
}

async function updateBookmarkIconCache(bookmarkId, patch = {}) {
  if (!supabase || !isAdmin() || !bookmarkId) return;

  const safePatch = {
    ...patch,
    icon_checked_at: new Date().toISOString(),
  };

  await supabase
    .from("bookmarks")
    .update(safePatch)
    .eq("id", bookmarkId);
}

function activateBookmarkIcons() {
  const images = els.bookmarkGrid.querySelectorAll(".card-logo img.card-favicon");

  images.forEach((img) => {
    const logo = img.closest(".card-logo");
    if (!logo || img.dataset.iconHandled === "true") return;

    img.dataset.iconHandled = "true";

    const showIcon = () => {
      clearTimeout(img.iconFallbackTimer);

      if (!img.naturalWidth) {
        showFallback();
        return;
      }

      logo.classList.add("has-icon");
      logo.classList.remove("is-fallback", "is-loading");

      const bookmarkId = img.dataset.bookmarkIconId;
      const item = bookmarks.find((bookmark) => String(bookmark.id) === String(bookmarkId));
      if (bookmarkId && isAdmin() && item && (item.icon_status !== "ok" || !item.icon_url)) {
        updateBookmarkIconCache(bookmarkId, {
          icon_url: img.currentSrc || img.src,
          icon_status: "ok",
        });
      }
    };

    const showFallback = () => {
      clearTimeout(img.iconFallbackTimer);
      logo.classList.add("is-fallback");
      logo.classList.remove("has-icon", "is-loading");

      const bookmarkId = img.dataset.bookmarkIconId;
      const item = bookmarks.find((bookmark) => String(bookmark.id) === String(bookmarkId));
      if (bookmarkId && isAdmin() && item && item.icon_status !== "failed") {
        updateBookmarkIconCache(bookmarkId, { icon_status: "failed" });
      }

      img.remove();
    };

    if (img.complete) {
      showIcon();
      return;
    }

    img.iconFallbackTimer = setTimeout(showFallback, 2000);
    img.addEventListener("load", showIcon, { once: true });
    img.addEventListener("error", showFallback, { once: true });
  });
}


function getSelectedBookmarks() {
  const selected = new Set([...selectedBookmarkIds].map(String));
  return bookmarks.filter((item) => selected.has(String(item.id)));
}

function pruneBatchSelection() {
  const existingIds = new Set(bookmarks.map((item) => String(item.id)));
  selectedBookmarkIds = new Set([...selectedBookmarkIds].filter((id) => existingIds.has(String(id))));
}

function updateBatchUI() {
  pruneBatchSelection();

  const admin = isAdmin();
  const selectedCount = selectedBookmarkIds.size;

  els.batchToolbar?.classList.toggle("hidden", !(admin && batchMode));
  els.bookmarkGrid?.classList.toggle("batch-mode", admin && batchMode);
  document.body.classList.toggle("batch-mode-active", admin && batchMode);

  if (els.batchCount) {
    els.batchCount.textContent = selectedCount
      ? `已选择 ${selectedCount} 个书签`
      : "请选择要批量处理的书签";
  }

  const disableAction = !selectedCount;

  [
    els.batchClearBtn,
    els.batchAddGroupBtn,
    els.batchReplaceGroupBtn,
    els.batchRemoveGroupBtn,
    els.batchPinBtn,
    els.batchUnpinBtn,
    els.batchRefreshIconBtn,
    els.batchExportBtn,
    els.batchDeleteBtn,
  ].forEach((button) => {
    if (button) button.disabled = disableAction;
  });

  els.batchToggleBtn?.classList.toggle("is-active", admin && batchMode);
  els.batchToggleBtn?.setAttribute("aria-pressed", String(admin && batchMode));
  if (els.batchToggleBtn) {
    els.batchToggleBtn.textContent = batchMode ? "取消批量" : "批量管理";
    els.batchToggleBtn.title = batchMode ? "退出批量管理" : "进入批量管理";
  }
}

function setBatchMode(nextValue) {
  if (!isAdmin()) return;

  batchMode = Boolean(nextValue);

  if (!batchMode) {
    selectedBookmarkIds.clear();
  }

  render();
  updateAdminVisibility();
}

function toggleBookmarkSelection(id, forceValue = null) {
  const value = String(id ?? "");
  if (!value) return;

  const shouldSelect = forceValue === null
    ? !selectedBookmarkIds.has(value)
    : Boolean(forceValue);

  if (shouldSelect) {
    selectedBookmarkIds.add(value);
  } else {
    selectedBookmarkIds.delete(value);
  }

  const card = els.bookmarkGrid.querySelector(`[data-card-id="${CSS.escape(value)}"]`);
  const input = els.bookmarkGrid.querySelector(`[data-batch-check="${CSS.escape(value)}"]`);

  card?.classList.toggle("is-selected", selectedBookmarkIds.has(value));
  if (input) input.checked = selectedBookmarkIds.has(value);

  updateBatchUI();
}

function selectVisibleBookmarks() {
  if (!isAdmin() || !batchMode) return;

  getFilteredBookmarks().forEach((item) => {
    selectedBookmarkIds.add(String(item.id));
  });

  render();
}

function clearBatchSelection() {
  selectedBookmarkIds.clear();
  render();
}

function renderBatchCategoryOptions() {
  const selectable = getSelectableCategories();

  if (!selectable.length) {
    els.batchCategoryList.innerHTML = `
      <div class="category-check-empty">
        还没有可选择的分组，请先在左侧新增分组。
      </div>
    `;
    return;
  }

  els.batchCategoryList.innerHTML = selectable
    .map((category) => `
      <label class="category-check">
        <input type="checkbox" name="batch-categories" value="${escapeAttr(category.id)}">
        <span>${escapeHtml(category.name)}</span>
      </label>
    `)
    .join("");
}

function getSelectedBatchCategoryIds() {
  return uniqueIds(
    [...els.batchCategoryList.querySelectorAll('input[name="batch-categories"]')]
      .filter((input) => input.checked)
      .map((input) => input.value)
  );
}

function openBatchCategoryDialog(mode) {
  if (!isAdmin() || !batchMode || !selectedBookmarkIds.size) return;

  renderBatchCategoryOptions();

  els.batchCategoryMode.value = mode;
  const titleMap = {
    remove: "批量移除分组",
    replace: "批量替换分组",
    add: "批量添加分组",
  };

  const descMap = {
    remove: `将从 ${selectedBookmarkIds.size} 个书签里移除选中的分组。`,
    replace: `将把 ${selectedBookmarkIds.size} 个书签的分组替换成选中的分组。`,
    add: `将给 ${selectedBookmarkIds.size} 个书签添加选中的分组。`,
  };

  els.batchCategoryTitle.textContent = titleMap[mode] || titleMap.add;
  els.batchCategoryDesc.textContent = descMap[mode] || descMap.add;

  els.batchCategoryDialog.showModal();
}

async function batchAddCategories(categoryIds = []) {
  const bookmarkIds = [...selectedBookmarkIds];

  if (!bookmarkIds.length || !categoryIds.length) {
    showToast("请选择书签和分组", "error");
    return;
  }

  const rows = [];

  for (const bookmarkId of bookmarkIds) {
    for (const categoryId of categoryIds) {
      rows.push({
        bookmark_id: bookmarkId,
        category_id: categoryId,
      });
    }
  }

  pauseRealtime();

  const { error } = await supabase
    .from("bookmark_categories")
    .upsert(rows, { onConflict: "bookmark_id,category_id", ignoreDuplicates: true });

  if (error) {
    resumeRealtimeSoon();
    showToast(error.message, "error");
    return;
  }

  showToast(`已给 ${bookmarkIds.length} 个书签添加分组`);
  selectedBookmarkIds.clear();
  await loadAllData({ quiet: true });
  resumeRealtimeSoon();
}

async function batchRemoveCategories(categoryIds = []) {
  const bookmarkIds = [...selectedBookmarkIds];

  if (!bookmarkIds.length || !categoryIds.length) {
    showToast("请选择书签和分组", "error");
    return;
  }

  pauseRealtime();

  const { error } = await supabase
    .from("bookmark_categories")
    .delete()
    .in("bookmark_id", bookmarkIds)
    .in("category_id", categoryIds);

  if (error) {
    resumeRealtimeSoon();
    showToast(error.message, "error");
    return;
  }

  showToast(`已从 ${bookmarkIds.length} 个书签移除分组`);
  selectedBookmarkIds.clear();
  await loadAllData({ quiet: true });
  resumeRealtimeSoon();
}

async function batchReplaceCategories(categoryIds = []) {
  const bookmarkIds = [...selectedBookmarkIds];

  if (!bookmarkIds.length || !categoryIds.length) {
    showToast("请选择书签和分组", "error");
    return;
  }

  pauseRealtime();

  for (const bookmarkId of bookmarkIds) {
    const item = bookmarks.find((bookmark) => String(bookmark.id) === String(bookmarkId));
    if (!item) continue;

    const result = await updateBookmarkCategories(item, categoryIds);

    if (result.error) {
      resumeRealtimeSoon();
      showToast(result.error.message, "error");
      return;
    }
  }

  showToast(`已替换 ${bookmarkIds.length} 个书签的分组`);
  selectedBookmarkIds.clear();
  await loadAllData({ quiet: true });
  resumeRealtimeSoon();
}

async function batchSetPinned(isPinned) {
  if (!supabase || !isAdmin() || !selectedBookmarkIds.size) return;

  const ids = [...selectedBookmarkIds];
  pauseRealtime();

  const { error } = await supabase
    .from("bookmarks")
    .update({ is_pinned: Boolean(isPinned) })
    .in("id", ids);

  if (error) {
    resumeRealtimeSoon();
    showToast(error.message, "error");
    return;
  }

  showToast(isPinned ? `已置顶 ${ids.length} 个书签` : `已取消置顶 ${ids.length} 个书签`);
  selectedBookmarkIds.clear();
  await loadBookmarks({ quiet: true });
  resumeRealtimeSoon();
}

async function setBookmarkPinned(id, isPinned) {
  if (!supabase || !isAdmin() || !id) return;

  pauseRealtime();

  const { error } = await supabase
    .from("bookmarks")
    .update({ is_pinned: Boolean(isPinned) })
    .eq("id", id);

  if (error) {
    resumeRealtimeSoon();
    showToast(error.message, "error");
    return;
  }

  showToast(isPinned ? "已置顶书签" : "已取消置顶");
  await loadBookmarks({ quiet: true });
  resumeRealtimeSoon();
}


async function copyBookmarkLink(id) {
  const item = bookmarks.find((bookmark) => String(bookmark.id) === String(id));
  if (!item?.url) return;

  try {
    await navigator.clipboard.writeText(normalizeUrl(item.url));
    showToast("链接已复制");
  } catch {
    const input = document.createElement("input");
    input.value = normalizeUrl(item.url);
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
    showToast("链接已复制");
  }
}

async function refreshBookmarkIcon(id) {
  if (!supabase || !isAdmin()) return;

  const item = bookmarks.find((bookmark) => String(bookmark.id) === String(id));
  if (!item) return;

  pauseRealtime();

  const { error } = await supabase
    .from("bookmarks")
    .update({
      icon_url: getRefreshBookmarkIconUrl(item.url),
      icon_status: "pending",
      icon_checked_at: null,
    })
    .eq("id", item.id);

  if (error) {
    resumeRealtimeSoon();
    showToast(error.message, "error");
    return;
  }

  showToast("已刷新图标缓存");
  await loadBookmarks({ quiet: true });
  resumeRealtimeSoon();
}

async function batchRefreshIcons() {
  if (!supabase || !isAdmin() || !selectedBookmarkIds.size) return;

  const selected = getSelectedBookmarks();
  if (!selected.length) return;

  pauseRealtime();

  for (const item of selected) {
    const { error } = await supabase
      .from("bookmarks")
      .update({
        icon_url: getRefreshBookmarkIconUrl(item.url),
        icon_status: "pending",
        icon_checked_at: null,
      })
      .eq("id", item.id);

    if (error) {
      resumeRealtimeSoon();
      showToast(error.message, "error");
      return;
    }
  }

  showToast(`已刷新 ${selected.length} 个图标`);
  selectedBookmarkIds.clear();
  await loadBookmarks({ quiet: true });
  resumeRealtimeSoon();
}

function exportSelectedBookmarks() {
  const selected = getSelectedBookmarks();
  if (!selected.length) {
    showToast("请先选择书签", "error");
    return;
  }

  exportBookmarksJson(selected, `bookmark-hub-selected-${new Date().toISOString().slice(0, 10)}.json`);
}

async function saveBatchCategoryChange(event) {
  event.preventDefault();

  if (!supabase || !isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  const categoryIds = getSelectedBatchCategoryIds();

  if (!categoryIds.length) {
    showToast("请至少选择一个分组", "error");
    return;
  }

  const mode = els.batchCategoryMode.value;

  els.batchCategorySaveBtn.disabled = true;
  els.batchCategorySaveBtn.classList.add("is-loading");

  if (mode === "remove") {
    await batchRemoveCategories(categoryIds);
  } else if (mode === "replace") {
    await batchReplaceCategories(categoryIds);
  } else {
    await batchAddCategories(categoryIds);
  }

  els.batchCategorySaveBtn.disabled = false;
  els.batchCategorySaveBtn.classList.remove("is-loading");
  els.batchCategoryDialog.close();
}

async function batchDeleteSelectedBookmarks() {
  if (!supabase || !isAdmin() || !selectedBookmarkIds.size) return;

  const count = selectedBookmarkIds.size;
  const ids = [...selectedBookmarkIds];
  const confirmed = window.confirm(`确定把选中的 ${count} 个书签移入回收站吗？`);

  if (!confirmed) return;

  pauseRealtime();

  const { error } = await supabase
    .from("bookmarks")
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
      is_active: false,
    })
    .in("id", ids);

  if (error) {
    resumeRealtimeSoon();
    handleOperationError(error, "批量删除失败", "移动到回收站时出错。", { dialog: true });
    return;
  }

  selectedBookmarkIds.clear();
  showToast(`已把 ${count} 个书签移入回收站`);
  await loadAllData({ quiet: true });
  resumeRealtimeSoon();
}

function buildExportPayload(selectedItems = bookmarks) {
  return {
    version: 2,
    exported_at: new Date().toISOString(),
    categories: getSortedCategories().map((category) => ({
      name: category.name,
      icon: normalizeCategoryIcon(category.icon, category.name),
      sort_order: Number(category.sort_order ?? 0),
    })),
    bookmarks: selectedItems.map((item) => ({
      title: item.title,
      url: item.url,
      description: item.description || "",
      icon_url: item.icon_url || "",
      icon_status: item.icon_status || "pending",
      is_pinned: Boolean(item.is_pinned),
      categories: getBookmarkCategories(item),
    })),
  };
}

function exportBookmarksJson(selectedItems = bookmarks, filename = `bookmark-hub-backup-${new Date().toISOString().slice(0, 10)}.json`) {
  const payload = buildExportPayload(selectedItems);
  createDownload(filename, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
  showToast("JSON 已导出");
}

function exportBookmarksCsv(selectedItems = bookmarks) {
  const header = ["title", "url", "description", "categories", "icon_url", "icon_status", "is_pinned"];
  const rows = selectedItems.map((item) => [
    item.title,
    item.url,
    item.description || "",
    getBookmarkCategories(item).join(" | "),
    item.icon_url || "",
    item.icon_status || "",
    item.is_pinned ? "true" : "false",
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\n");

  createDownload(`bookmark-hub-${new Date().toISOString().slice(0, 10)}.csv`, csv, "text/csv;charset=utf-8");
  showToast("CSV 已导出");
}


function getTopFrequentBookmarks(source = bookmarks, limit = 4, excludeIds = new Set()) {
  return [...source]
    .filter((item) => Number(item.open_count || 0) > 0 && !excludeIds.has(String(item.id)))
    .sort((a, b) => {
      const diff = Number(b.open_count || 0) - Number(a.open_count || 0);
      if (diff !== 0) return diff;
      return String(b.last_opened_at || b.created_at || "").localeCompare(String(a.last_opened_at || a.created_at || ""));
    })
    .slice(0, limit);
}

function openSystemCheckDialog() {
  if (!isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  if (els.systemCheckSummary) {
    els.systemCheckSummary.textContent = "点击下方按钮开始检查。";
  }

  if (els.systemCheckList) {
    els.systemCheckList.innerHTML = "";
  }

  els.systemCheckDialog?.showModal();
}

function renderSystemCheckResults(results = []) {
  if (!els.systemCheckList || !els.systemCheckSummary) return;

  const errorCount = results.filter((item) => item.status === "error").length;
  const warnCount = results.filter((item) => item.status === "warn").length;

  els.systemCheckSummary.textContent = errorCount
    ? `发现 ${errorCount} 个需要处理的问题。`
    : warnCount
      ? `基本正常，有 ${warnCount} 个建议优化项。`
      : "系统检查通过，数据库结构和基础权限看起来正常。";

  els.systemCheckList.innerHTML = results.map((item) => `
    <div class="check-item check-${escapeAttr(item.status)}">
      <span class="check-dot" aria-hidden="true"></span>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.message)}</p>
        ${item.fix ? `<em>${escapeHtml(item.fix)}</em>` : ""}
      </div>
    </div>
  `).join("");
}

async function runCheck(title, action, successMessage, fix = "") {
  try {
    const result = await action();
    if (result?.error) {
      return {
        status: "error",
        title,
        message: getReadableError(result.error),
        fix: fix || getDatabaseFixHint(result.error),
      };
    }

    return {
      status: result?.status || "ok",
      title,
      message: result?.message || successMessage,
      fix: result?.fix || "",
    };
  } catch (error) {
    return {
      status: "error",
      title,
      message: getReadableError(error),
      fix: fix || getDatabaseFixHint(error),
    };
  }
}

async function runSystemCheck() {
  if (!supabase || !isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  els.systemCheckRunBtn.disabled = true;
  els.systemCheckRunBtn.classList.add("is-loading");
  els.systemCheckSummary.textContent = "正在检查数据库结构和前端运行状态...";
  els.systemCheckList.innerHTML = "";

  const results = [];

  results.push(await runCheck(
    "bookmarks 表字段",
    () => supabase.from("bookmarks").select("id,title,url,description,category,icon_url,icon_status,icon_checked_at,is_pinned,is_active,created_at").limit(1),
    "bookmarks 表字段完整。",
    "缺字段时请运行最新的 supabase_upgrade_icons_batch_import.sql。"
  ));

  results.push(await runCheck(
    "categories 表字段",
    () => supabase.from("categories").select("id,name,icon,sort_order,is_active,created_at").limit(1),
    "categories 表字段完整。",
    "缺少 icon 字段时请运行最新 SQL。"
  ));

  results.push(await runCheck(
    "bookmark_categories 关联表",
    () => supabase.from("bookmark_categories").select("bookmark_id,category_id").limit(1),
    "多分组关联表可以正常读取。",
    "如果这个表不存在，多选分组无法工作，请运行最终数据库结构 SQL。"
  ));

  results.push(await runCheck(
    "site_texts 页面文案",
    async () => {
      const { data, error } = await supabase.from("site_texts").select("key,value,description").limit(1000);
      if (error) return { error };
      const counts = new Map();
      for (const row of data || []) {
        counts.set(row.key, (counts.get(row.key) || 0) + 1);
      }
      const duplicated = [...counts.entries()].filter(([, count]) => count > 1).map(([key]) => key);
      if (duplicated.length) {
        return {
          status: "warn",
          message: `发现重复文案 key：${duplicated.slice(0, 6).join("、")}${duplicated.length > 6 ? "..." : ""}`,
          fix: "建议在 Supabase SQL Editor 运行 site_texts 去重和唯一约束修复 SQL。",
        };
      }
      return { message: "页面文案表可以正常读取，未发现重复 key。" };
    },
    "页面文案表正常。"
  ));

  results.push({
    status: realtimeChannels.length ? "ok" : "warn",
    title: "Realtime 连接",
    message: realtimeChannels.length ? "当前页面已经创建 Realtime 订阅。" : "当前页面还没有 Realtime 订阅，可能只是刚打开或网络较慢。",
    fix: realtimeChannels.length ? "" : "页面可以正常浏览；如果一直无法同步，请检查 Supabase Realtime 是否开启。",
  });

  results.push({
    status: isAdmin() ? "ok" : "error",
    title: "管理员状态",
    message: isAdmin() ? `当前登录管理员：${currentUser?.email || "未知邮箱"}` : "当前账号不是管理员。",
    fix: isAdmin() ? "" : "请使用 ADMIN_EMAIL 对应的账号登录。",
  });

  els.systemCheckRunBtn.disabled = false;
  els.systemCheckRunBtn.classList.remove("is-loading");
  renderSystemCheckResults(results);
}

function extractChromeBookmarksFromHtml(html = "") {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const result = [];

  function walk(node, folderStack = []) {
    const children = [...node.children];

    for (let index = 0; index < children.length; index += 1) {
      const child = children[index];
      const tag = child.tagName?.toLowerCase();

      if (tag === "dt") {
        const h3 = child.querySelector(":scope > h3");
        const link = child.querySelector(":scope > a[href]");
        const dl = child.querySelector(":scope > dl");

        if (h3 && dl) {
          const folderName = h3.textContent.trim();
          walk(dl, folderName ? [...folderStack, folderName] : folderStack);
          continue;
        }

        if (link) {
          const url = normalizeUrl(link.getAttribute("href") || "");
          if (!url) continue;

          result.push({
            title: link.textContent.trim() || getBookmarkDomain(url) || url,
            url,
            description: "",
            categories: uniqueCategoryNames(folderStack.slice(-2)),
          });
        }
      } else if (tag === "dl" || tag === "body") {
        walk(child, folderStack);
      }
    }
  }

  walk(doc.body || doc);
  return result;
}

function normalizeImportedBookmarks(payload, filename = "") {
  const lowerName = filename.toLowerCase();

  if (lowerName.endsWith(".html") || lowerName.endsWith(".htm") || /^\s*<!doctype NETSCAPE-Bookmark-file-1/i.test(payload)) {
    return extractChromeBookmarksFromHtml(payload);
  }

  const parsed = JSON.parse(payload);
  const rawBookmarks = Array.isArray(parsed) ? parsed : parsed.bookmarks;
  if (!Array.isArray(rawBookmarks)) return [];

  return rawBookmarks
    .map((item) => {
      const categories = Array.isArray(item.categories)
        ? item.categories
        : Array.isArray(item.category_names)
          ? item.category_names
          : [item.category].filter(Boolean);

      return {
        title: String(item.title || item.name || "").trim(),
        url: normalizeUrl(String(item.url || item.href || "").trim()),
        description: String(item.description || item.desc || "").trim(),
        icon_url: String(item.icon_url || "").trim(),
        icon_status: String(item.icon_status || "pending").trim() || "pending",
        is_pinned: Boolean(item.is_pinned),
        categories: uniqueCategoryNames(categories),
      };
    })
    .filter((item) => item.title && item.url);
}

async function ensureImportCategories(categoryNames = []) {
  const wantedNames = uniqueCategoryNames(categoryNames);
  const nameToCategory = new Map(categories.map((category) => [String(category.name).trim().toLowerCase(), category]));
  const missingNames = wantedNames.filter((name) => !nameToCategory.has(name.toLowerCase()));

  if (missingNames.length) {
    const maxSort = Math.max(0, ...categories.map((item) => Number(item.sort_order ?? 0)));
    const rows = missingNames.map((name, index) => ({
      name,
      icon: getDefaultCategoryIcon(name),
      sort_order: maxSort + ((index + 1) * 10),
      is_active: true,
    }));

    const { error } = await supabase.from("categories").insert(rows);
    if (error) return { error };

    await loadCategories({ renderAfter: false });
  }

  return { error: null };
}

async function buildImportPreview(file) {
  if (!file) {
    return { error: new Error("请选择要导入的文件") };
  }

  const text = await file.text();
  let imported = [];

  try {
    imported = normalizeImportedBookmarks(text, file.name);
  } catch (error) {
    return { error: new Error(`导入文件解析失败：${error.message}`) };
  }

  const existingUrls = new Set(bookmarks.map((item) => normalizedUrlKey(item.url)));
  const seenUrls = new Set();
  const duplicatesInFile = [];
  const duplicatesExisting = [];
  const uniqueItems = [];

  for (const item of imported) {
    const key = normalizedUrlKey(item.url);
    if (!key) continue;

    if (seenUrls.has(key)) {
      duplicatesInFile.push(item);
      continue;
    }

    seenUrls.add(key);

    if (existingUrls.has(key)) {
      duplicatesExisting.push(item);
    }

    uniqueItems.push(item);
  }

  const skipDuplicates = els.importSkipDuplicates?.checked !== false;
  const itemsToImport = uniqueItems.filter((item) => {
    return !(skipDuplicates && existingUrls.has(normalizedUrlKey(item.url)));
  });

  const categoryNames = uniqueCategoryNames(
    itemsToImport.flatMap((item) => item.categories?.length ? item.categories : [currentCategory])
  );

  return {
    fileName: file.name,
    total: imported.length,
    unique: uniqueItems.length,
    duplicatesInFile: duplicatesInFile.length,
    duplicatesExisting: duplicatesExisting.length,
    skipDuplicates,
    items: itemsToImport,
    categoryNames,
    sample: itemsToImport.slice(0, 8),
    error: null,
  };
}

function renderImportPreview(preview) {
  pendingImportPreview = preview || null;

  if (!els.importPreview) return;

  if (!preview || preview.error) {
    els.importPreview.classList.add("hidden");
    els.importPreview.innerHTML = "";
    if (els.importRunBtn) els.importRunBtn.disabled = true;
    return;
  }

  const sampleHtml = preview.sample.length
    ? preview.sample.map((item) => `
        <li>
          <span class="import-preview-icon">${escapeHtml(getBookmarkInitial(item.title))}</span>
          <span class="import-preview-copy">
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(getBookmarkDomain(item.url) || item.url)}</span>
          </span>
        </li>
      `).join("")
    : `<li><span class="import-preview-icon">!</span><span class="import-preview-copy"><strong>没有可导入的书签</strong><span>可以取消“跳过已存在的网址”后重新预览。</span></span></li>`;

  const duplicateWarning = preview.duplicatesExisting || preview.duplicatesInFile
    ? `<div class="import-preview-warning">检测到重复链接：已存在 ${preview.duplicatesExisting} 条，文件内重复 ${preview.duplicatesInFile} 条。</div>`
    : "";

  els.importPreview.classList.remove("hidden");
  els.importPreview.innerHTML = `
    <div class="import-preview-hero">
      <div>
        <strong>${preview.items.length}</strong>
        <span>条将导入</span>
      </div>
      <p>${escapeHtml(preview.fileName)} · ${preview.skipDuplicates ? "已开启跳过重复" : "重复网址也会导入"}</p>
    </div>
    <div class="import-preview-stats">
      <span>识别 ${preview.total} 条</span>
      <span>可导入 ${preview.items.length} 条</span>
      <span>已存在 ${preview.duplicatesExisting} 条</span>
      <span>文件内重复 ${preview.duplicatesInFile} 条</span>
    </div>
    ${duplicateWarning}
    <div class="import-preview-cats">
      <strong>将使用 / 创建分组</strong>
      <p>${preview.categoryNames.length ? preview.categoryNames.map(escapeHtml).join("、") : "当前分组或未分组"}</p>
    </div>
    <ul class="import-preview-list">${sampleHtml}</ul>
  `;

  if (els.importRunBtn) {
    els.importRunBtn.disabled = preview.items.length === 0;
  }

  if (els.importStatus) {
    els.importStatus.textContent = `预览完成：可导入 ${preview.items.length} 条。确认后才会写入数据库。`;
  }
}

async function prepareImportPreview() {
  if (!supabase || !isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  if (!pendingImportFile) {
    showToast("请选择要导入的文件", "error");
    renderImportPreview(null);
    return;
  }

  if (els.importStatus) els.importStatus.textContent = "正在解析并生成预览...";
  if (els.importRunBtn) els.importRunBtn.disabled = true;

  const preview = await buildImportPreview(pendingImportFile);

  if (preview.error) {
    handleOperationError(preview.error, "导入预览失败", getReadableError(preview.error), { dialog: false });
    renderImportPreview(null);
    if (els.importStatus) els.importStatus.textContent = getReadableError(preview.error);
    return;
  }

  renderImportPreview(preview);
}

async function importPreparedBookmarks() {
  if (!supabase || !isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  const preview = pendingImportPreview;

  if (!preview?.items?.length) {
    showToast("没有可导入的书签，请先选择文件并查看预览", "error");
    return;
  }

  const ensureResult = await ensureImportCategories(preview.categoryNames);

  if (ensureResult.error) {
    handleOperationError(ensureResult.error, "导入失败", "创建导入分组时出错。", { dialog: true });
    return;
  }

  pauseRealtime();

  let createdCount = 0;

  for (let index = 0; index < preview.items.length; index += IMPORT_BATCH_SIZE) {
    const chunk = preview.items.slice(index, index + IMPORT_BATCH_SIZE);
    const rows = chunk.map((item) => {
      const categoryNames = uniqueCategoryNames(item.categories?.length ? item.categories : [currentCategory]);
      const firstCategoryName = categoryNames[0] || "";

      return {
        title: item.title.slice(0, 80),
        url: normalizeUrl(item.url),
        description: item.description || "",
        category: firstCategoryName,
        icon_url: item.icon_url || getBookmarkIconUrl(item.url),
        icon_status: item.icon_url ? (item.icon_status || "ok") : "pending",
        is_pinned: Boolean(item.is_pinned),
        is_active: true,
      };
    });

    const { data, error } = await supabase
      .from("bookmarks")
      .insert(rows)
      .select("id,url");

    if (error) {
      resumeRealtimeSoon();
      handleOperationError(error, "导入失败", "写入书签时出错。", { dialog: true });
      return;
    }

    createdCount += data?.length || 0;

    for (const saved of data || []) {
      const source = chunk.find((item) => normalizedUrlKey(item.url) === normalizedUrlKey(saved.url));
      const names = uniqueCategoryNames(source?.categories?.length ? source.categories : [currentCategory]);
      const ids = getCategoryIdsByNames(names);
      if (ids.length) {
        const result = await replaceBookmarkCategoryLinks(saved.id, ids);
        if (result.error) {
          resumeRealtimeSoon();
          handleOperationError(result.error, "导入失败", "保存书签分组关联时出错。", { dialog: true });
          return;
        }
      }
    }
  }

  selectedBookmarkIds.clear();
  pendingImportPreview = null;
  pendingImportFile = null;
  if (els.importFileInput) els.importFileInput.value = "";
  renderImportPreview(null);

  await loadAllData({ quiet: true });
  resumeRealtimeSoon();

  els.importExportDialog?.close();
  showToast(`已导入 ${createdCount} 个书签`);
}

async function importBookmarksFromFile(file) {
  pendingImportFile = file;
  await prepareImportPreview();
}

function openImportExportDialog() {
  if (!isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  pendingImportFile = null;
  pendingImportPreview = null;

  if (els.importFileInput) {
    els.importFileInput.value = "";
  }

  if (els.importStatus) {
    els.importStatus.textContent = "尚未选择文件。";
  }

  if (els.importRunBtn) {
    els.importRunBtn.disabled = true;
    els.importRunBtn.classList.remove("is-loading");
  }

  renderImportPreview(null);
  els.importExportDialog?.showModal();
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

    setSelectedBookmarkCategoryIds(getBookmarkCategoryIds(item));
  } else {
    els.formTitle.textContent = t("bookmarkForm.addTitle");
    els.bookmarkId.value = "";

    const defaultCategoryIds = currentCategory !== "全部" && !isReservedCategoryName(currentCategory)
      ? getCategoryIdsByNames([currentCategory])
      : [];

    setSelectedBookmarkCategoryIds(defaultCategoryIds);
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
    renderCategoryIconChoices(category.icon || getDefaultCategoryIcon(category.name));
  } else {
    els.categoryFormTitle.textContent = t("categoryForm.addTitle");
    els.categoryIdInput.value = "";
    els.categoryOldNameInput.value = "";
    renderCategoryIconChoices("paw-cat");
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
  const allDefaults = getDefaultTextObjects();
  const defaultTextMap = new Map(allDefaults.map((row) => [row.key, row.value]));
  const editableMap = new Map(getEditableTextObjects().map((row) => [row.key, row]));

  if (!supabase) {
    siteTextRows = [...editableMap.values()];
    texts = Object.fromEntries(allDefaults.map((row) => [row.key, row.value]));
    applySiteTexts();
    return;
  }

  const { data, error } = await runSupabaseQuery(
    supabase
      .from("site_texts")
      .select("key,value,description")
      .in("key", EDITABLE_TEXT_KEY_LIST)
      .order("key", { ascending: true }),
    "读取页面文案"
  );

  if (!error) {
    for (const row of data ?? []) {
      if (!row?.key || !EDITABLE_TEXT_KEYS.has(row.key)) continue;

      const old = editableMap.get(row.key);

      editableMap.set(row.key, {
        key: row.key,
        value: String(row.value ?? "").trim() ? row.value : old?.value ?? "",
        description: row.description ?? old?.description ?? row.key,
      });

      defaultTextMap.set(row.key, String(row.value ?? "").trim() ? row.value : old?.value ?? "");
    }
  }

  siteTextRows = [...editableMap.values()];
  texts = Object.fromEntries(defaultTextMap.entries());
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
    .filter((row) => row.key && EDITABLE_TEXT_KEYS.has(row.key));

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

async function loadSession(options = {}) {
  const { renderAfter = true } = options;

  if (!supabase) return;

  const { data, error } = await runSupabaseQuery(supabase.auth.getSession(), "读取登录状态", 9000);

  if (error) {
    showToast(error.message, "error");
    return;
  }

  currentUser = data.session?.user ?? null;
  setAdminUI({ renderAfter });

  supabase.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user ?? null;
    setAdminUI({ renderAfter: true, quiet: true });
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

  const enhancedSelect = [
    "id",
    "title",
    "url",
    "description",
    "category",
    "icon_url",
    "icon_status",
    "icon_checked_at",
    "is_pinned",
    "open_count",
    "last_opened_at",
    "is_deleted",
    "deleted_at",
    "is_active",
    "created_at",
  ].join(",");

  const iconOnlySelect = [
    "id",
    "title",
    "url",
    "description",
    "category",
    "icon_url",
    "is_active",
    "created_at",
  ].join(",");

  const baseSelect = [
    "id",
    "title",
    "url",
    "description",
    "category",
    "is_active",
    "created_at",
  ].join(",");

  let data = null;
  let error = null;
  let enhancedFieldsAvailable = true;

  const enhancedResult = await runSupabaseQuery(
    supabase
      .from("bookmarks")
      .select(enhancedSelect)
      .eq("is_active", true)
      .or("is_deleted.is.null,is_deleted.eq.false")
      .order("created_at", { ascending: false }),
    "读取书签"
  );

  data = enhancedResult.data;
  error = enhancedResult.error;

  // 如果新字段暂时没有进入 PostgREST schema cache，或者数据库还没补齐字段，退回旧字段读取。
  // 这样页面至少能先显示原有书签，不会一直停在骨架屏。
  if (error) {
    enhancedFieldsAvailable = false;
    console.warn("enhanced bookmarks query failed, fallback to icon-only query", error);

    const iconFallbackResult = await runSupabaseQuery(
      supabase
        .from("bookmarks")
        .select(iconOnlySelect)
        .eq("is_active", true)
        .order("created_at", { ascending: false }),
      "读取基础书签"
    );

    data = iconFallbackResult.data;
    error = iconFallbackResult.error;
  }

  if (error) {
    console.warn("icon-only bookmarks query failed, fallback to minimal query", error);

    const minimalResult = await runSupabaseQuery(
      supabase
        .from("bookmarks")
        .select(baseSelect)
        .eq("is_active", true)
        .order("created_at", { ascending: false }),
      "读取最小书签"
    );

    data = minimalResult.data;
    error = minimalResult.error;
  }

  if (error) {
    bookmarks = [];
    bookmarksDataSignature = "";
    setRealtimeStatus("error", t("sync.readError"));
    handleOperationError(
      error,
      "读取书签失败",
      "前端已自动尝试新结构、旧结构和最小字段读取，但仍然失败。请确认 bookmarks 表存在 id、title、url、description、category、is_active、created_at 字段，且 anon 角色拥有读取权限。",
      { dialog: true }
    );
    if (renderAfter) safeRender(quiet);
    return true;
  }

  if (!enhancedFieldsAvailable) {
    setRealtimeStatus("error", "兼容模式");
  }

  const bookmarkIds = (data ?? []).map((item) => item.id).filter(Boolean);
  const categoryById = new Map((categories || []).map((category) => [String(category.id), category]));
  const categoriesByName = new Map((categories || []).map((category) => [normalizeCategoryName(category.name).toLowerCase(), category]));
  const linksByBookmarkId = new Map();

  if (bookmarkIds.length > 0) {
    const { data: linkRows, error: linkError } = await runSupabaseQuery(
      supabase
        .from("bookmark_categories")
        .select("bookmark_id,category_id")
        .in("bookmark_id", bookmarkIds),
      "读取书签分组关联"
    );

    if (linkError) {
      console.warn("bookmark_categories read failed, fallback to bookmarks.category", linkError);
      if (enhancedFieldsAvailable) setRealtimeStatus("error", t("sync.partial"));
    } else {
      for (const link of linkRows ?? []) {
        const key = String(link.bookmark_id);
        const arr = linksByBookmarkId.get(key) || [];
        arr.push(String(link.category_id));
        linksByBookmarkId.set(key, arr);
      }
    }
  }

  const nextRows = (data ?? [])
    .filter((item) => item && item.is_active !== false && !item.is_deleted)
    .map((item) => {
      const linkedCategoryIds = uniqueIds(linksByBookmarkId.get(String(item.id)) || []);
      let linkedCategories = linkedCategoryIds
        .map((id) => categoryById.get(String(id)))
        .filter((category) => category && category.is_active !== false && !isReservedCategoryName(category.name));

      if (linkedCategories.length === 0 && item.category && !isReservedCategoryName(item.category)) {
        const fallback = categoriesByName.get(normalizeCategoryName(item.category).toLowerCase());
        if (fallback) {
          linkedCategories = [fallback];
        } else {
          linkedCategories = [{ id: "", name: item.category, icon: "paw-cat", sort_order: 999999, is_active: true }];
        }
      }

      linkedCategories = linkedCategories.sort((a, b) => {
        const sa = Number(a.sort_order ?? 0);
        const sb = Number(b.sort_order ?? 0);
        if (sa !== sb) return sa - sb;
        return String(a.name).localeCompare(String(b.name), "zh-CN");
      });

      return {
        ...item,
        icon_url: item.icon_url || getBookmarkIconUrl(item.url),
        icon_status: item.icon_status || (item.icon_url ? "ok" : "pending"),
        icon_checked_at: item.icon_checked_at || null,
        is_pinned: Boolean(item.is_pinned),
        open_count: Number(item.open_count || 0),
        last_opened_at: item.last_opened_at || null,
        is_deleted: Boolean(item.is_deleted),
        deleted_at: item.deleted_at || null,
        category_ids: uniqueIds(linkedCategories.map((category) => category.id).filter(Boolean)),
        category_names: uniqueCategoryNames(linkedCategories.map((category) => category.name)),
      };
    }).sort((a, b) => {
      const pa = a.is_pinned ? 1 : 0;
      const pb = b.is_pinned ? 1 : 0;
      if (pa !== pb) return pb - pa;
      return String(b.created_at || "").localeCompare(String(a.created_at || ""));
    });

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

  let data = null;
  let error = null;

  const enhancedResult = await runSupabaseQuery(
    supabase
      .from("categories")
      .select("id,name,icon,sort_order,is_active,created_at")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    "读取分组"
  );

  data = enhancedResult.data;
  error = enhancedResult.error;

  // 兼容旧数据库 / PostgREST schema cache 未及时刷新的情况：如果 icon 字段暂时读不到，退回基础字段。
  if (error) {
    console.warn("enhanced categories query failed, fallback to base query", error);

    const fallbackResult = await runSupabaseQuery(
      supabase
        .from("categories")
        .select("id,name,sort_order,is_active,created_at")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      "读取基础分组"
    );

    data = fallbackResult.data;
    error = fallbackResult.error;
  }

  if (error) {
    categories = [];
    categoriesDataSignature = "";
    setRealtimeStatus("error", t("sync.readError"));
    handleOperationError(
      error,
      "读取分组失败",
      "请确认 categories 表存在 id、name、sort_order、is_active、created_at 字段，并且 anon 角色拥有读取权限。",
      { dialog: true }
    );
    if (renderAfter) safeRender(quiet);
    return true;
  }

  const nextRows = (data ?? [])
    .filter((category) => category?.name && !isReservedCategoryName(category.name))
    .map((category) => ({
      ...category,
      icon: normalizeCategoryIcon(category.icon, category.name),
    }));
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
  const { quiet = true, renderAfter = true } = options;

  // 先读取分组，再读取书签与 bookmark_categories。这样不依赖 PostgREST 的嵌套关系，
  // 即使数据库关联缓存暂时没刷新，页面也能正常显示。
  const categoriesChanged = await loadCategories({ renderAfter: false });
  const bookmarksChanged = await loadBookmarks({ renderAfter: false });
  const changed = bookmarksChanged || categoriesChanged;

  if (renderAfter && changed) {
    safeRender(quiet);
  }

  return changed;
}

function subscribeRealtime() {
  if (!supabase || realtimePaused) return;

  for (const channel of realtimeChannels) {
    supabase.removeChannel(channel);
  }

  realtimeChannels = [];

  const realtimeChannel = supabase
    .channel("bookmark-hub-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "bookmarks" },
      () => scheduleDataRealtimeRefresh()
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "bookmark_categories" },
      () => scheduleDataRealtimeRefresh()
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "categories" },
      () => scheduleDataRealtimeRefresh()
    )
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
        setRealtimeStatus("online", t("sync.online"));
      }

      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
        setRealtimeStatus("error", t("sync.readError"));
      }
    });

  realtimeChannels = [realtimeChannel];
}

async function saveBookmark() {
  if (!supabase || !isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  const selectedCategoryIds = getSelectedBookmarkCategoryIds();

  if (!selectedCategoryIds.length) {
    showToast("请至少选择一个分组", "error");
    return;
  }

  const id = els.bookmarkId.value;
  const categoryPayload = getBookmarkCategoryPayload(selectedCategoryIds);

  const payload = {
    title: els.titleInput.value.trim(),
    url: normalizeUrl(els.urlInput.value),
    description: els.descriptionInput.value.trim(),
    icon_url: getBookmarkIconUrl(els.urlInput.value),
    icon_status: "pending",
    icon_checked_at: null,
    ...categoryPayload,
    is_deleted: false,
    deleted_at: null,
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

  const savedBookmarkId = data?.id || id;
  const linkResult = await replaceBookmarkCategoryLinks(savedBookmarkId, selectedCategoryIds);

  if (linkResult.error) {
    resumeRealtimeSoon();
    showToast(linkResult.error.message, "error");
    return;
  }

  highlightBookmarkId = savedBookmarkId || null;

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
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
      is_active: false,
    })
    .eq("id", id);

  if (error) {
    resumeRealtimeSoon();
    handleOperationError(error, "删除失败", "移动到回收站时出错。", { dialog: true });
    return;
  }

  selectedBookmarkIds.delete(String(id));
  showToast("已移入回收站");
  await loadBookmarks({ quiet: true });
  resumeRealtimeSoon();
}


async function loadDeletedBookmarks() {
  if (!supabase || !isAdmin()) return [];

  const { data, error } = await supabase
    .from("bookmarks")
    .select("id,title,url,description,deleted_at,created_at")
    .eq("is_deleted", true)
    .order("deleted_at", { ascending: false, nullsFirst: false });

  if (error) {
    handleOperationError(error, "读取回收站失败", "请确认 bookmarks 表存在 is_deleted 和 deleted_at 字段。", { dialog: true });
    return [];
  }

  deletedBookmarksCache = data || [];
  return deletedBookmarksCache;
}

function renderTrashList(rows = []) {
  if (!els.trashList || !els.trashStatus) return;

  els.trashStatus.textContent = rows.length
    ? `回收站里有 ${rows.length} 个书签。`
    : "回收站是空的。";

  if (els.trashEmptyBtn) els.trashEmptyBtn.disabled = rows.length === 0;

  if (!rows.length) {
    els.trashList.innerHTML = `<div class="trash-empty">没有被删除的书签。</div>`;
    return;
  }

  els.trashList.innerHTML = rows.map((item) => `
    <article class="trash-item" data-trash-id="${escapeAttr(item.id)}">
      <div class="trash-item-main">
        <strong>${escapeHtml(item.title || "未命名书签")}</strong>
        <span>${escapeHtml(getBookmarkDomain(item.url) || item.url || "")}</span>
        <em>${item.deleted_at ? `删除于 ${escapeHtml(new Date(item.deleted_at).toLocaleString())}` : "删除时间未知"}</em>
      </div>
      <div class="trash-item-actions">
        <button class="ghost-btn compact-btn" type="button" data-trash-restore="${escapeAttr(item.id)}">恢复</button>
        <button class="ghost-btn compact-btn danger" type="button" data-trash-delete="${escapeAttr(item.id)}">彻底删除</button>
      </div>
    </article>
  `).join("");
}

async function openTrashDialog() {
  if (!isAdmin()) return;
  els.trashStatus.textContent = "正在读取回收站...";
  els.trashList.innerHTML = "";
  if (els.trashEmptyBtn) els.trashEmptyBtn.disabled = true;
  els.trashDialog.showModal();
  const rows = await loadDeletedBookmarks();
  renderTrashList(rows);
}

async function restoreBookmark(id) {
  if (!supabase || !isAdmin() || !id) return;

  pauseRealtime();
  const { error } = await supabase
    .from("bookmarks")
    .update({ is_deleted: false, deleted_at: null, is_active: true })
    .eq("id", id);

  if (error) {
    resumeRealtimeSoon();
    handleOperationError(error, "恢复失败", "恢复书签时出错。", { dialog: true });
    return;
  }

  showToast("已恢复书签");
  const rows = await loadDeletedBookmarks();
  renderTrashList(rows);
  await loadBookmarks({ quiet: true });
  resumeRealtimeSoon();
}

async function permanentlyDeleteBookmark(id) {
  if (!supabase || !isAdmin() || !id) return;
  const target = deletedBookmarksCache.find((item) => String(item.id) === String(id));
  if (!window.confirm(`确定彻底删除「${target?.title || "这个书签"}」吗？这个操作不能撤销。`)) return;

  pauseRealtime();
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("is_deleted", true);

  if (error) {
    resumeRealtimeSoon();
    handleOperationError(error, "彻底删除失败", "删除回收站书签时出错。", { dialog: true });
    return;
  }

  showToast("已彻底删除");
  const rows = await loadDeletedBookmarks();
  renderTrashList(rows);
  resumeRealtimeSoon();
}

async function emptyTrash() {
  if (!supabase || !isAdmin()) return;
  if (!deletedBookmarksCache.length) return;
  if (!window.confirm(`确定清空回收站里的 ${deletedBookmarksCache.length} 个书签吗？这个操作不能撤销。`)) return;

  pauseRealtime();
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("is_deleted", true);

  if (error) {
    resumeRealtimeSoon();
    handleOperationError(error, "清空回收站失败", "彻底删除回收站全部书签时出错。", { dialog: true });
    return;
  }

  deletedBookmarksCache = [];
  renderTrashList([]);
  showToast("回收站已清空");
  resumeRealtimeSoon();
}

async function recordBookmarkOpen(id) {
  if (!supabase || !id) return;
  const item = bookmarks.find((bookmark) => String(bookmark.id) === String(id));
  if (!item) return;

  const nextCount = Number(item.open_count || 0) + 1;
  const openedAt = new Date().toISOString();
  item.open_count = nextCount;
  item.last_opened_at = openedAt;

  await supabase
    .from("bookmarks")
    .update({ open_count: nextCount, last_opened_at: openedAt })
    .eq("id", id);
}

function openBookmarkById(id) {
  const item = bookmarks.find((bookmark) => String(bookmark.id) === String(id));
  if (!item?.url) return;

  window.open(normalizeUrl(item.url), "_blank", "noopener,noreferrer");
  recordBookmarkOpen(item.id);
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

  const icon = normalizeCategoryIcon(els.categoryIconInput?.value, newName);

  const payload = id
    ? { name: newName, icon }
    : { name: newName, icon, sort_order: maxSort + 10, is_active: true };

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


function hasOpenDialog() {
  return Boolean(document.querySelector("dialog[open]"));
}

function isTypingTarget(target) {
  const tag = target?.tagName?.toLowerCase();
  return target?.isContentEditable || ["input", "textarea", "select"].includes(tag);
}

function closeTopDialogOrMenu() {
  if (activeCardMenuId) {
    closeCardMenus();
    return true;
  }

  const openDialogs = [...document.querySelectorAll("dialog[open]")];
  const topDialog = openDialogs.at(-1);
  if (topDialog) {
    topDialog.close();
    return true;
  }

  return false;
}

function handleGlobalShortcuts(event) {
  const key = String(event?.key || "").toLowerCase();

  if (!key) return;

  if (key === "escape") {
    if (closeTopDialogOrMenu()) {
      event.preventDefault();
      return;
    }

    if (exitAdminModes()) {
      event.preventDefault();
    }
    return;
  }

  if ((event.metaKey || event.ctrlKey) && key === "k") {
    event.preventDefault();
    els.searchInput.focus();
    els.searchInput.select();
    return;
  }

  if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target) || hasOpenDialog()) return;


  if (key === "n" && isAdmin()) {
    event.preventDefault();
    openBookmarkDialog();
    return;
  }

  if (key === "b" && isAdmin()) {
    event.preventDefault();
    setBatchMode(!batchMode);
    return;
  }

  if (key === "t") {
    event.preventDefault();
    toggleTheme();
  }
}

function bindEvents() {
  setBookmarkView(localStorage.getItem("bookmark-view") || "grid", false);

  document.querySelectorAll("[data-view-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      setBookmarkView(button.dataset.viewMode);
    });
  });

  window.addEventListener("keydown", handleGlobalShortcuts);

  els.loginOpenBtn.addEventListener("click", () => {
    els.loginDialog.showModal();
  });

  els.textOpenBtn.addEventListener("click", openTextDialog);
  els.importExportBtn?.addEventListener("click", openImportExportDialog);
  els.trashOpenBtn?.addEventListener("click", openTrashDialog);
  els.systemCheckBtn?.addEventListener("click", openSystemCheckDialog);
  els.systemCheckRunBtn?.addEventListener("click", runSystemCheck);
  els.trashEmptyBtn?.addEventListener("click", emptyTrash);
  els.trashList?.addEventListener("click", async (event) => {
    const restoreBtn = event.target.closest("[data-trash-restore]");
    const deleteBtn = event.target.closest("[data-trash-delete]");
    if (restoreBtn) {
      event.preventDefault();
      await restoreBookmark(restoreBtn.dataset.trashRestore);
      return;
    }
    if (deleteBtn) {
      event.preventDefault();
      await permanentlyDeleteBookmark(deleteBtn.dataset.trashDelete);
    }
  });
  els.batchToggleBtn?.addEventListener("click", () => {
    setBatchMode(!batchMode);
  });
  els.batchSelectVisibleBtn?.addEventListener("click", selectVisibleBookmarks);
  els.batchClearBtn?.addEventListener("click", clearBatchSelection);
  els.batchExitBtn?.addEventListener("click", () => setBatchMode(false));
  els.batchAddGroupBtn?.addEventListener("click", () => openBatchCategoryDialog("add"));
  els.batchReplaceGroupBtn?.addEventListener("click", () => openBatchCategoryDialog("replace"));
  els.batchRemoveGroupBtn?.addEventListener("click", () => openBatchCategoryDialog("remove"));
  els.batchPinBtn?.addEventListener("click", () => batchSetPinned(true));
  els.batchUnpinBtn?.addEventListener("click", () => batchSetPinned(false));
  els.batchRefreshIconBtn?.addEventListener("click", batchRefreshIcons);
  els.batchExportBtn?.addEventListener("click", exportSelectedBookmarks);
  els.batchDeleteBtn?.addEventListener("click", batchDeleteSelectedBookmarks);
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
    setSidebarEditMode(!sidebarEditMode);
    showToast(sidebarEditMode ? "已进入分组整理，可再次点击取消" : "已退出分组整理");
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
  els.batchCategoryForm?.addEventListener("submit", saveBatchCategoryChange);

  els.categoryIconList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category-icon]");
    if (!button) return;
    setCategoryIconChoice(button.dataset.categoryIcon);
  });

  els.exportJsonBtn?.addEventListener("click", () => exportBookmarksJson());
  els.exportCsvBtn?.addEventListener("click", () => exportBookmarksCsv());
  els.importFileInput?.addEventListener("change", async () => {
    pendingImportFile = els.importFileInput.files?.[0] || null;
    pendingImportPreview = null;
    if (els.importStatus) {
      els.importStatus.textContent = pendingImportFile
        ? `已选择：${pendingImportFile.name}，正在生成预览...`
        : "尚未选择文件。";
    }
    renderImportPreview(null);
    if (pendingImportFile) {
      await prepareImportPreview();
    }
  });
  els.importSkipDuplicates?.addEventListener("change", async () => {
    if (pendingImportFile) {
      await prepareImportPreview();
    }
  });
  els.importExportForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    els.importRunBtn.disabled = true;
    els.importRunBtn.classList.add("is-loading");
    await importPreparedBookmarks();
    els.importRunBtn.disabled = !pendingImportPreview?.items?.length;
    els.importRunBtn.classList.remove("is-loading");
  });

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
    const batchInput = event.target.closest("[data-batch-check]");
    const batchCard = event.target.closest(".card[data-card-id]");

    if (batchMode && isAdmin() && batchInput) {
      event.preventDefault();
      event.stopPropagation();
      toggleBookmarkSelection(batchInput.dataset.batchCheck, batchInput.checked);
      return;
    }

    if (batchMode && isAdmin() && batchCard) {
      event.preventDefault();
      event.stopPropagation();
      toggleBookmarkSelection(batchCard.dataset.cardId);
      return;
    }

    const menuToggle = event.target.closest("[data-card-menu-toggle]");
    const refreshIconBtn = event.target.closest("[data-refresh-icon]");
    const pinBtn = event.target.closest("[data-pin]");
    const editBtn = event.target.closest("[data-edit]");
    const copyLinkBtn = event.target.closest("[data-copy-link]");
    const deleteBtn = event.target.closest("[data-delete]");
    const card = event.target.closest("[data-open-url]");

    if (menuToggle) {
      event.preventDefault();
      event.stopPropagation();
      toggleCardMenu(menuToggle);
      return;
    }

    if (refreshIconBtn) {
      event.preventDefault();
      event.stopPropagation();
      closeCardMenus();
      await refreshBookmarkIcon(refreshIconBtn.dataset.refreshIcon);
      return;
    }

    if (pinBtn) {
      event.preventDefault();
      event.stopPropagation();
      closeCardMenus();
      await setBookmarkPinned(pinBtn.dataset.pin, pinBtn.dataset.pinValue === "true");
      return;
    }

    if (editBtn) {
      event.preventDefault();
      event.stopPropagation();

      closeCardMenus();
      const item = bookmarks.find((bookmark) => String(bookmark.id) === String(editBtn.dataset.edit));
      if (item) openBookmarkDialog(item);
      return;
    }

    if (copyLinkBtn) {
      event.preventDefault();
      event.stopPropagation();
      closeCardMenus();
      await copyBookmarkLink(copyLinkBtn.dataset.copyLink);
      return;
    }

    if (deleteBtn) {
      event.preventDefault();
      event.stopPropagation();
      closeCardMenus();

      await deleteBookmark(deleteBtn.dataset.delete);
      return;
    }

    if (card && !isAdmin()) {
      openBookmarkById(card.dataset.cardId);
    }
  });

  els.bookmarkGrid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest("[data-open-url]");
    if (!card || isAdmin()) return;

    event.preventDefault();

    openBookmarkById(card.dataset.cardId);
  });

  document.addEventListener("click", (event) => {
    if (!activeCardMenuId) return;
    if (event.target.closest(".card-menu")) return;
    closeCardMenus();
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
  renderLoadingSkeleton();
  bindEvents();
  initLottieAnimations();

  if (!isConfigured) {
    bookmarks = [];
    categories = [];
    els.setupNotice.classList.remove("hidden");
    setRealtimeStatus("error", t("sync.notConfigured"));
    finishLoadingSkeleton();
    safeRender(false);
    return;
  }

  setRealtimeStatus("online", t("sync.connecting"));

  try {
    const results = await withTimeout(
      Promise.allSettled([
        loadSiteTexts(),
        loadSession({ renderAfter: false }),
        loadAllData({ quiet: false, renderAfter: false }),
      ]),
      16000,
      "初始化数据"
    );

    const rejected = results.find((result) => result.status === "rejected");
    if (rejected) {
      console.error("init task failed", rejected.reason);
      setRealtimeStatus("error", t("sync.partial"));
      handleOperationError(
        rejected.reason,
        "初始化部分失败",
        "页面会先显示已读取到的内容。请打开浏览器控制台查看红色错误，或运行最新数据库修复 SQL 后强制刷新。",
        { dialog: false }
      );
    }
  } catch (error) {
    console.error("init timeout or failed", error);
    setRealtimeStatus("error", t("sync.readError"));
    handleOperationError(
      error,
      "数据库连接超时",
      "前端已经停止骨架屏，避免页面一直卡住。请确认当前网络能访问 Supabase，或打开浏览器控制台把红色错误发给我。",
      { dialog: true }
    );
  } finally {
    updateAdminVisibility();
    finishLoadingSkeleton();
    safeRender(false);
    subscribeRealtime();
  }
}

init();

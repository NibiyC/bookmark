import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

/**
 * 1. 在 Supabase 项目 Settings -> API 里复制 Project URL 和 anon/public key
 * 2. 把 ADMIN_EMAIL 改成你登录 Supabase Auth 的管理员邮箱
 * 3. 不要把 service_role key 放到前端代码里
 */
const SUPABASE_URL = "https://bmbkahvhqdhbrzbyonuu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtYmthaHZocWRoYnJ6YnlvbnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwOTY2MTksImV4cCI6MjA5MjY3MjYxOX0.RW09_EOPzuPHNPOdD2yb44iCOSksqkwRr1mBXEMokcE";
const ADMIN_EMAIL = "2565667747@qq.com";

const isConfigured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_PROJECT_ID") &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE");

const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const $ = (selector) => document.querySelector(selector);

const els = {
  setupNotice: $("#setupNotice"),
  loginOpenBtn: $("#loginOpenBtn"),
  logoutBtn: $("#logoutBtn"),
  addOpenBtn: $("#addOpenBtn"),
  loginDialog: $("#loginDialog"),
  bookmarkDialog: $("#bookmarkDialog"),
  loginForm: $("#loginForm"),
  bookmarkForm: $("#bookmarkForm"),
  loginEmail: $("#loginEmail"),
  loginPassword: $("#loginPassword"),
  bookmarkId: $("#bookmarkId"),
  titleInput: $("#titleInput"),
  urlInput: $("#urlInput"),
  categoryInput: $("#categoryInput"),
  descriptionInput: $("#descriptionInput"),
  tagsInput: $("#tagsInput"),
  formTitle: $("#formTitle"),
  searchInput: $("#searchInput"),
  categorySelect: $("#categorySelect"),
  categoryPills: $("#categoryPills"),
  bookmarkGrid: $("#bookmarkGrid"),
  emptyState: $("#emptyState"),
  toast: $("#toast"),
  statsText: $("#statsText"),
  syncStatus: $("#syncStatus"),
  realtimeDot: $("#realtimeDot"),
  themeToggle: $("#themeToggle"),
};

let bookmarks = [];
let currentCategory = "全部";
let currentUser = null;
let realtimeChannel = null;

const demoBookmarks = [
  {
    id: "demo-1",
    title: "ChatGPT",
    url: "https://chatgpt.com",
    description: "AI 对话、写作、编程和学习助手。",
    category: "AI 工具",
    tags: ["AI", "效率", "写作"],
  },
  {
    id: "demo-2",
    title: "GitHub",
    url: "https://github.com",
    description: "代码托管、开源项目和 GitHub Pages 部署平台。",
    category: "开发",
    tags: ["代码", "开源", "部署"],
  },
  {
    id: "demo-3",
    title: "Supabase",
    url: "https://supabase.com",
    description: "Postgres 数据库、Auth 和 Realtime 服务。",
    category: "开发",
    tags: ["数据库", "实时", "后端"],
  },
];

function showToast(message, type = "normal") {
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  els.toast.style.background = type === "error" ? "rgba(255, 59, 48, 0.94)" : "rgba(28, 28, 30, 0.92)";
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.add("hidden"), 2600);
}

function getInitialFromTitle(title = "?") {
  return title.trim().slice(0, 1).toUpperCase() || "?";
}

function normalizeUrl(url) {
  const value = url.trim();
  if (!value) return value;
  if (!/^https?:\/\//i.test(value)) return `https://${value}`;
  return value;
}

function parseTags(value) {
  return value
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function isAdmin() {
  return currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

function setRealtimeStatus(status, text) {
  els.syncStatus.textContent = text;
  els.realtimeDot.classList.remove("online", "error");

  if (status === "online") els.realtimeDot.classList.add("online");
  if (status === "error") els.realtimeDot.classList.add("error");
}

function setAdminUI() {
  const admin = isAdmin();
  els.addOpenBtn.classList.toggle("hidden", !admin);
  els.logoutBtn.classList.toggle("hidden", !currentUser);
  els.loginOpenBtn.classList.toggle("hidden", !!currentUser);
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
    bookmarks = demoBookmarks;
    els.setupNotice.classList.remove("hidden");
    setRealtimeStatus("error", "演示模式");
    els.statsText.textContent = "请先配置 Supabase";
    render();
    return;
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    setRealtimeStatus("error", "读取失败");
    showToast(error.message, "error");
    return;
  }

  bookmarks = data ?? [];
  els.statsText.textContent = `${bookmarks.length} 个收藏`;
  render();
}

function subscribeRealtime() {
  if (!supabase) return;

  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
  }

  realtimeChannel = supabase
    .channel("public-bookmarks-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks",
      },
      async () => {
        await loadBookmarks();
        showToast("收藏已实时同步");
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        setRealtimeStatus("online", "实时同步已连接");
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
        setRealtimeStatus("error", "实时连接异常");
      } else {
        setRealtimeStatus("normal", "正在连接...");
      }
    });
}

function getCategories() {
  const categories = new Set(["全部"]);
  for (const item of bookmarks) {
    if (item.category) categories.add(item.category);
  }
  return [...categories];
}

function getFilteredBookmarks() {
  const q = els.searchInput.value.trim().toLowerCase();

  return bookmarks.filter((item) => {
    const categoryMatch = currentCategory === "全部" || item.category === currentCategory;
    const haystack = [
      item.title,
      item.url,
      item.description,
      item.category,
      ...(item.tags ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return categoryMatch && (!q || haystack.includes(q));
  });
}

function renderCategories() {
  const categories = getCategories();

  els.categorySelect.innerHTML = categories
    .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    .join("");

  els.categorySelect.value = currentCategory;

  els.categoryPills.innerHTML = categories
    .map(
      (category) =>
        `<button class="pill ${category === currentCategory ? "active" : ""}" type="button" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`
    )
    .join("");
}

function render() {
  renderCategories();
  const filtered = getFilteredBookmarks();
  els.emptyState.classList.toggle("hidden", filtered.length > 0);
  els.bookmarkGrid.innerHTML = filtered.map(renderCard).join("");
  els.statsText.textContent = `${bookmarks.length} 个收藏，当前显示 ${filtered.length} 个`;
}

function renderCard(item) {
  const tags = (item.tags ?? [])
    .map((tag) => `<span class="tag">#${escapeHtml(tag)}</span>`)
    .join("");

  const adminButtons = isAdmin()
    ? `<div class="admin-actions">
        <button class="mini-btn" type="button" data-edit="${item.id}">编辑</button>
        <button class="mini-btn delete" type="button" data-delete="${item.id}">删除</button>
      </div>`
    : "";

  return `<article class="card">
    <div class="card-top">
      <div class="site-icon">${escapeHtml(getInitialFromTitle(item.title))}</div>
      <span class="badge">${escapeHtml(item.category || "未分类")}</span>
    </div>

    <h3>${escapeHtml(item.title)}</h3>
    <p class="card-desc">${escapeHtml(item.description || "暂无描述")}</p>

    <div class="tags">${tags}</div>

    <div class="card-actions">
      <a class="open-link" href="${escapeAttr(item.url)}" target="_blank" rel="noopener noreferrer">打开网站 →</a>
      ${adminButtons}
    </div>
  </article>`;
}

function openBookmarkDialog(item = null) {
  els.bookmarkForm.reset();

  if (item) {
    els.formTitle.textContent = "编辑收藏";
    els.bookmarkId.value = item.id;
    els.titleInput.value = item.title ?? "";
    els.urlInput.value = item.url ?? "";
    els.categoryInput.value = item.category ?? "";
    els.descriptionInput.value = item.description ?? "";
    els.tagsInput.value = (item.tags ?? []).join(", ");
  } else {
    els.formTitle.textContent = "新增收藏";
    els.bookmarkId.value = "";
  }

  els.bookmarkDialog.showModal();
}

async function saveBookmark() {
  if (!supabase || !isAdmin()) {
    showToast("没有保存权限，请使用管理员账号登录", "error");
    return;
  }

  const payload = {
    title: els.titleInput.value.trim(),
    url: normalizeUrl(els.urlInput.value),
    category: els.categoryInput.value.trim() || "其他",
    description: els.descriptionInput.value.trim(),
    tags: parseTags(els.tagsInput.value),
    is_active: true,
  };

  try {
    const parsed = new URL(payload.url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("链接必须以 http 或 https 开头");
    }
  } catch {
    showToast("请输入正确的网址", "error");
    return;
  }

  const id = els.bookmarkId.value;
  const query = id
    ? supabase.from("bookmarks").update(payload).eq("id", id)
    : supabase.from("bookmarks").insert(payload);

  const { error } = await query;

  if (error) {
    showToast(error.message, "error");
    return;
  }

  els.bookmarkDialog.close();
  showToast(id ? "已更新收藏" : "已新增收藏");
  await loadBookmarks();
}

async function deleteBookmark(id) {
  if (!supabase || !isAdmin()) {
    showToast("没有删除权限", "error");
    return;
  }

  const target = bookmarks.find((item) => String(item.id) === String(id));
  const confirmed = window.confirm(`确定删除「${target?.title ?? "这个收藏"}」吗？`);
  if (!confirmed) return;

  const { error } = await supabase.from("bookmarks").delete().eq("id", id);

  if (error) {
    showToast(error.message, "error");
    return;
  }

  showToast("已删除收藏");
  await loadBookmarks();
}

async function login(event) {
  event.preventDefault();

  if (!supabase) {
    showToast("请先配置 Supabase", "error");
    return;
  }

  const email = els.loginEmail.value.trim();
  const password = els.loginPassword.value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    showToast(error.message, "error");
    return;
  }

  currentUser = data.user;
  els.loginDialog.close();
  els.loginForm.reset();

  if (!isAdmin()) {
    showToast("登录成功，但该账号不是管理员，无法写入数据", "error");
  } else {
    showToast("管理员登录成功");
  }

  setAdminUI();
}

async function logout() {
  if (!supabase) return;
  await supabase.auth.signOut();
  currentUser = null;
  showToast("已退出登录");
  setAdminUI();
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

function initTheme() {
  const saved = localStorage.getItem("bookmark-theme");
  if (saved === "dark") {
    document.documentElement.dataset.theme = "dark";
    els.themeToggle.textContent = "☀️";
  }
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const next = current === "dark" ? "light" : "dark";

  if (next === "dark") {
    document.documentElement.dataset.theme = "dark";
    els.themeToggle.textContent = "☀️";
    localStorage.setItem("bookmark-theme", "dark");
  } else {
    delete document.documentElement.dataset.theme;
    els.themeToggle.textContent = "🌙";
    localStorage.setItem("bookmark-theme", "light");
  }
}

function bindEvents() {
  els.loginOpenBtn.addEventListener("click", () => els.loginDialog.showModal());
  els.logoutBtn.addEventListener("click", logout);
  els.addOpenBtn.addEventListener("click", () => openBookmarkDialog());
  els.loginForm.addEventListener("submit", login);
  els.bookmarkForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveBookmark();
  });

  els.searchInput.addEventListener("input", render);

  els.categorySelect.addEventListener("change", (event) => {
    currentCategory = event.target.value;
    render();
  });

  els.categoryPills.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-category]");
    if (!btn) return;
    currentCategory = btn.dataset.category;
    render();
  });

  els.bookmarkGrid.addEventListener("click", (event) => {
    const editBtn = event.target.closest("[data-edit]");
    const deleteBtn = event.target.closest("[data-delete]");

    if (editBtn) {
      const item = bookmarks.find((bookmark) => String(bookmark.id) === String(editBtn.dataset.edit));
      if (item) openBookmarkDialog(item);
    }

    if (deleteBtn) {
      deleteBookmark(deleteBtn.dataset.delete);
    }
  });

  document.querySelectorAll("[data-close-dialog]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dialog = btn.closest("dialog");
      if (dialog) dialog.close();
    });
  });

  els.themeToggle.addEventListener("click", toggleTheme);
}

async function init() {
  initTheme();
  bindEvents();

  if (!isConfigured) {
    await loadBookmarks();
    return;
  }

  await loadSession();
  await loadBookmarks();
  subscribeRealtime();
}

init();

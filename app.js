/*
  书签小屋 app.js（整理版 v32）
  说明：这个文件按功能区整理，注释尽量用大白话写。
  注意：Supabase anon key 可以放前端；service_role key 绝对不能放这里。
*/

// =========================
// 1. 基础配置：项目地址、管理员、功能开关
// =========================
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

const SEARCH_SCOPE_LABELS = {
  title: "名称",
};
const DEFAULT_SEARCH_SCOPE = "title";
const SEARCH_SCOPE_VERSION_KEY = "bookmark-search-scope-version-v2";
const CARD_DENSITY_STORAGE_KEY = "bookmark-card-density-v1";
const DEFAULT_CARD_DENSITY = "comfortable";
const CARD_DENSITY_OPTIONS = [
  { key: "comfortable", label: "舒适", desc: "大卡片，更适合慢慢浏览" },
  { key: "compact", label: "紧凑", desc: "一屏显示更多书签" },
  { key: "mini", label: "极简", desc: "最小卡片，适合大量书签" },
];
const BOOKMARK_SITE_ICONS_ENABLED = true;
const ICON_EDGE_FUNCTION_NAME = "fetch-bookmark-icon";
const LINK_CHECK_EDGE_FUNCTION_NAME = "check-bookmark-link";
const STORAGE_ICON_BUCKET = "bookmark-icons";

const PINYIN_PHRASE_ALIASES = new Map(Object.entries({
  "抖音": "douyin dy", "快手": "kuaishou ks", "小红书": "xiaohongshu xhs", "微博": "weibo wb", "微信": "weixin wx", "知乎": "zhihu zh", "豆瓣": "douban db",
  "百度": "baidu bd", "谷歌": "google gg", "必应": "bing by", "夸克": "kuake kk", "搜狗": "sougou sg", "神马": "shenma sm",
  "淘宝": "taobao tb", "天猫": "tianmao tm", "京东": "jingdong jd", "拼多多": "pinduoduo pdd", "闲鱼": "xianyu xy", "美团": "meituan mt", "饿了么": "eleme elm",
  "腾讯": "tengxun tx", "阿里": "ali al", "网易": "wangyi wy", "搜狐": "souhu sh", "字节": "zijie zj", "飞书": "feishu fs", "钉钉": "dingding dd",
  "哔哩哔哩": "bilibili blbl bili", "哔哩": "bili bl", "b站": "bilibili bzhan bz", "B站": "bilibili bzhan bz",
  "苹果": "apple pingguo pg", "微软": "microsoft weiruan wr", "亚马逊": "amazon yamaxun ymx", "脸书": "facebook lianshu ls", "推特": "twitter tuite tt", "油管": "youtube youguan yg",
  "短信": "duanxin dx", "设备": "shebei sb", "服务": "fuwu fw", "平台": "pingtai pt", "后台": "houtai ht", "系统": "xitong xt", "管理": "guanli gl", "数据": "shuju sj",
  "代理": "daili dl", "节点": "jiedian jd", "机场": "jichang jc", "飞机": "feiji fj", "网络": "wangluo wl", "工具": "gongju gj", "导航": "daohang dh", "收藏": "shoucang sc", "书签": "shuqian sq",
  "区块链": "qukuailian qkl", "钱包": "qianbao qb", "交易": "jiaoyi jy", "游戏": "youxi yx", "图片": "tupian tp", "图标": "tubiao tb", "阅读": "yuedu yd", "学习": "xuexi xx", "设计": "sheji sj", "代码": "daima dm", "开发": "kaifa kf", "登录": "denglu dl", "登录页": "dengluye dly"
}));

const PINYIN_CHAR_MAP = {
  "一":"yi","乙":"yi","二":"er","三":"san","四":"si","五":"wu","六":"liu","七":"qi","八":"ba","九":"jiu","十":"shi","百":"bai","千":"qian","万":"wan","个":"ge","全":"quan","部":"bu","其":"qi","他":"ta",
  "阿":"a","啊":"a","爱":"ai","安":"an","按":"an","案":"an","奥":"ao","澳":"ao",
  "吧":"ba","巴":"ba","把":"ba","白":"bai","版":"ban","办":"ban","半":"ban","包":"bao","宝":"bao","保":"bao","备":"bei","本":"ben","比":"bi","币":"bi","必":"bi","便":"bian","标":"biao","表":"biao","别":"bie","博":"bo","播":"bo","不":"bu","布":"bu",
  "才":"cai","采":"cai","彩":"cai","菜":"cai","藏":"cang","查":"cha","插":"cha","产":"chan","常":"chang","厂":"chang","长":"chang","超":"chao","车":"che","成":"cheng","程":"cheng","城":"cheng","持":"chi","充":"chong","出":"chu","储":"chu","传":"chuan","创":"chuang","次":"ci","从":"cong","存":"cun","错":"cuo",
  "大":"da","达":"da","代":"dai","单":"dan","导":"dao","到":"dao","德":"de","登":"deng","等":"deng","地":"di","点":"dian","电":"dian","店":"dian","钉":"ding","定":"ding","动":"dong","东":"dong","抖":"dou","豆":"dou","短":"duan","端":"duan","队":"dui","多":"duo",
  "饿":"e","发":"fa","法":"fa","返":"fan","方":"fang","防":"fang","访":"fang","飞":"fei","费":"fei","分":"fen","风":"feng","服":"fu","符":"fu","复":"fu","付":"fu","富":"fu",
  "改":"gai","高":"gao","告":"gao","格":"ge","给":"gei","更":"geng","工":"gong","公":"gong","功":"gong","供":"gong","狗":"gou","购":"gou","谷":"gu","股":"gu","管":"guan","关":"guan","广":"guang","规":"gui","归":"gui","国":"guo",
  "哈":"ha","海":"hai","号":"hao","好":"hao","合":"he","和":"he","黑":"hei","很":"hen","后":"hou","狐":"hu","互":"hu","花":"hua","画":"hua","换":"huan","回":"hui","会":"hui","火":"huo",
  "机":"ji","基":"ji","集":"ji","极":"ji","级":"ji","记":"ji","加":"jia","家":"jia","价":"jia","架":"jia","检":"jian","简":"jian","见":"jian","件":"jian","键":"jian","间":"jian","节":"jie","接":"jie","界":"jie","京":"jing","精":"jing","镜":"jing","久":"jiu","具":"ju","据":"ju","局":"ju","剧":"ju","卷":"juan","觉":"jue","决":"jue",
  "卡":"ka","开":"kai","看":"kan","靠":"kao","科":"ke","可":"ke","客":"ke","空":"kong","口":"kou","快":"kuai","块":"kuai","款":"kuan","况":"kuang","矿":"kuang",
  "来":"lai","蓝":"lan","栏":"lan","览":"lan","老":"lao","了":"le","类":"lei","里":"li","理":"li","立":"li","链":"lian","联":"lian","脸":"lian","量":"liang","聊":"liao","列":"lie","林":"lin","灵":"ling","领":"ling","浏":"liu","流":"liu","录":"lu","路":"lu","络":"luo",
  "码":"ma","买":"mai","卖":"mai","猫":"mao","美":"mei","门":"men","密":"mi","名":"ming","明":"ming","模":"mo","目":"mu",
  "拿":"na","哪":"na","内":"nei","能":"neng","你":"ni","年":"nian","鸟":"niao","牛":"niu","农":"nong","女":"nv",
  "牌":"pai","排":"pai","盘":"pan","跑":"pao","配":"pei","朋":"peng","批":"pi","片":"pian","频":"pin","苹":"ping","平":"ping","评":"ping","拼":"pin","铺":"pu",
  "期":"qi","奇":"qi","企":"qi","器":"qi","启":"qi","气":"qi","钱":"qian","前":"qian","签":"qian","强":"qiang","桥":"qiao","切":"qie","清":"qing","情":"qing","区":"qu","取":"qu","趣":"qu","群":"qun",
  "热":"re","人":"ren","任":"ren","日":"ri","入":"ru","软":"ruan","若":"ruo",
  "色":"se","删":"shan","商":"shang","上":"shang","设":"she","社":"she","身":"shen","审":"shen","生":"sheng","声":"sheng","省":"sheng","时":"shi","实":"shi","识":"shi","首":"shou","手":"shou","收":"shou","书":"shu","数":"shu","输":"shu","双":"shuang","水":"shui","说":"shuo","搜":"sou","速":"su","算":"suan","随":"sui","索":"suo",
  "台":"tai","淘":"tao","套":"tao","腾":"teng","提":"ti","体":"ti","天":"tian","条":"tiao","贴":"tie","通":"tong","同":"tong","图":"tu","团":"tuan","推":"tui",
  "外":"wai","网":"wang","微":"wei","为":"wei","未":"wei","文":"wen","问":"wen","我":"wo","无":"wu","物":"wu",
  "西":"xi","息":"xi","习":"xi","系":"xi","细":"xi","下":"xia","先":"xian","闲":"xian","显":"xian","线":"xian","箱":"xiang","项":"xiang","像":"xiang","小":"xiao","效":"xiao","消":"xiao","些":"xie","写":"xie","协":"xie","信":"xin","新":"xin","星":"xing","型":"xing","行":"xing","需":"xu","选":"xuan","学":"xue","讯":"xun",
  "压":"ya","亚":"ya","验":"yan","言":"yan","研":"yan","页":"ye","业":"ye","夜":"ye","易":"yi","已":"yi","以":"yi","义":"yi","音":"yin","应":"ying","用":"yong","优":"you","游":"you","油":"you","有":"you","邮":"you","友":"you","右":"you","于":"yu","语":"yu","域":"yu","预":"yu","源":"yuan","原":"yuan","远":"yuan","月":"yue","阅":"yue","云":"yun","运":"yun",
  "在":"zai","站":"zhan","账":"zhang","找":"zhao","折":"zhe","这":"zhe","真":"zhen","正":"zheng","支":"zhi","知":"zhi","直":"zhi","置":"zhi","智":"zhi","中":"zhong","种":"zhong","众":"zhong","重":"zhong","周":"zhou","主":"zhu","注":"zhu","专":"zhuan","转":"zhuan","装":"zhuang","资":"zi","字":"zi","自":"zi","总":"zong","组":"zu","左":"zuo","作":"zuo"
};


// 启动稳定性：不要让 Supabase CDN / 数据库慢连接把整个页面卡成空白。
// 页面会先渲染默认文案和本地缓存，再在后台连接 Supabase 更新数据。
const SUPABASE_CLIENT_URLS = [
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm",
  "https://esm.sh/@supabase/supabase-js@2",
];
const SUPABASE_CLIENT_QUICK_TIMEOUT = 9000;
const INITIAL_VISIBLE_TIMEOUT = 2600;
const DB_REQUEST_TIMEOUT = 13000;
const AUTH_REQUEST_TIMEOUT = 8000;
const TEXT_REQUEST_TIMEOUT = 7000;
const APP_CACHE_KEY = "bookmark-hub-fast-cache-v4";
const APP_CACHE_MAX_AGE = 1000 * 60 * 60 * 24 * 10;
const BROKEN_ICON_CACHE_KEY = "bookmark-hub-broken-icons-v1";
const BROKEN_ICON_CACHE_MAX_AGE = 1000 * 60 * 60 * 24 * 7;
const MAX_REMOTE_RETRY_DELAY = 30000;


// =========================
// 2. 页面文案配置：页面上能改的文字都集中在这里
// =========================
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

  ["search.placeholder", "搜索全部：名称、简介、链接、分组...", "搜索框占位文字"],
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

// =========================
// 3. Supabase 客户端和页面元素：连接数据库、收集 DOM 节点
// =========================
const isConfigured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_PROJECT_ID") &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE");

let supabase = null;
let supabaseClientPromise = null;
let supabaseLoadError = null;
let initialRemoteLoading = false;
let remoteRetryInFlight = false;

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
  adminModeBtn: $("#adminModeBtn"),
  adminBadge: $("#adminBadge"),
  groupOpenBtn: $("#groupOpenBtn"),
  textOpenBtn: $("#textOpenBtn"),
  batchToggleBtn: $("#batchToggleBtn"),
  repairIconBtn: $("#repairIconBtn"),
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
  searchScopeTabs: $("#searchScopeTabs"),
  groupFilterSelect: $("#groupFilterSelect"),
  groupFilterDropdown: $("#groupFilterDropdown"),
  groupFilterButton: $("#groupFilterButton"),
  groupFilterLabel: $("#groupFilterLabel"),
  groupFilterMenu: $("#groupFilterMenu"),
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

// =========================
// 4. 页面运行状态：当前分组、登录状态、批量模式、排序模式等
// =========================
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
let dataRefreshInFlight = false;
let dataRefreshQueued = false;
let currentSearchScope = DEFAULT_SEARCH_SCOPE;
localStorage.setItem("bookmark-search-scope", DEFAULT_SEARCH_SCOPE);
localStorage.setItem(SEARCH_SCOPE_VERSION_KEY, "3");
let currentCardDensity = normalizeCardDensity(localStorage.getItem(CARD_DENSITY_STORAGE_KEY));
let bookmarksDataSignature = "";
let categoriesDataSignature = "";
let quietRenderTimer = null;
let pendingImportFile = null;
let pendingImportPreview = null;
let activeCardMenuId = null;
let draggedBookmarkId = null;
let bookmarkDragSuppressClickUntil = 0;
let bookmarkSortMode = null;
let isInitialLoading = true;
let deletedBookmarksCache = [];
let remoteRetryCount = 0;
let mobileNavMounted = false;
let linkCheckInProgress = false;

// =========================
// 5. 通用小工具：超时、缓存、转义、URL、数组去重
// =========================
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function timeoutError(label = "请求") {
  const error = new Error(`${label} 超时，请检查网络、Supabase 项目状态或浏览器控制台错误。`);
  error.code = "REQUEST_TIMEOUT";
  return error;
}

async function withTimeout(promise, ms = DB_REQUEST_TIMEOUT, label = "请求") {
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

function isRequestTimeout(error) {
  const message = getReadableError(error).toLowerCase();
  return error?.code === "REQUEST_TIMEOUT" || message.includes("超时") || message.includes("timeout");
}

function shouldTrySchemaFallback(error) {
  if (!error || isRequestTimeout(error)) return false;

  const message = getReadableError(error).toLowerCase();
  return (
    message.includes("column") ||
    message.includes("schema cache") ||
    message.includes("could not find") ||
    message.includes("relation") ||
    message.includes("does not exist")
  );
}

async function runSupabaseQuery(query, label = "数据库请求", ms = DB_REQUEST_TIMEOUT) {
  try {
    return await withTimeout(query, ms, label);
  } catch (error) {
    return { data: null, error };
  }
}

function createSupabaseClient(createClient) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: (input, init = {}) => fetch(input, {
        ...init,
        cache: "no-store",
      }),
    },
  });
}

// 这里负责加载 Supabase SDK；CDN 慢时会换备用源，避免页面卡死。
async function ensureSupabaseClient(options = {}) {
  const { timeout = SUPABASE_CLIENT_QUICK_TIMEOUT, silent = false } = options;

  if (!isConfigured) return null;
  if (supabase) return supabase;

  if (!supabaseClientPromise) {
    supabaseClientPromise = (async () => {
      let lastError = null;

      for (const url of SUPABASE_CLIENT_URLS) {
        try {
          const mod = await withTimeout(import(url), timeout, "加载 Supabase 客户端");
          const createClient = mod?.createClient || mod?.default?.createClient;

          if (typeof createClient !== "function") {
            throw new Error("Supabase 客户端加载成功，但没有找到 createClient。");
          }

          supabase = createSupabaseClient(createClient);
          supabaseLoadError = null;
          return supabase;
        } catch (error) {
          lastError = error;
          console.warn("Supabase client source failed:", url, error);
        }
      }

      supabaseLoadError = lastError || timeoutError("加载 Supabase 客户端");
      throw supabaseLoadError;
    })().finally(() => {
      if (!supabase) supabaseClientPromise = null;
    });
  }

  try {
    return await withTimeout(supabaseClientPromise, timeout + 800, "等待 Supabase 客户端");
  } catch (error) {
    supabaseLoadError = error;
    if (!silent) console.error("Supabase 客户端加载失败：", error);
    return null;
  }
}

function saveAppCache() {
  try {
    if (!Array.isArray(bookmarks) || !Array.isArray(categories)) return;

    localStorage.setItem(APP_CACHE_KEY, JSON.stringify({
      version: 3,
      savedAt: Date.now(),
      bookmarks,
      categories,
      siteTextRows,
      texts,
    }));
  } catch (error) {
    console.warn("保存本地缓存失败：", error);
  }
}

function restoreAppCache() {
  try {
    const raw = localStorage.getItem(APP_CACHE_KEY);
    if (!raw) return false;

    const cached = JSON.parse(raw);
    if (!cached || Date.now() - Number(cached.savedAt || 0) > APP_CACHE_MAX_AGE) {
      localStorage.removeItem(APP_CACHE_KEY);
      return false;
    }

    if (Array.isArray(cached.categories)) {
      categories = cached.categories;
      categoriesDataSignature = getCategoriesDataSignature(categories);
    }

    if (Array.isArray(cached.bookmarks)) {
      bookmarks = cached.bookmarks;
      bookmarksDataSignature = getBookmarksDataSignature(bookmarks);
    }

    if (Array.isArray(cached.siteTextRows)) {
      siteTextRows = cached.siteTextRows;
    }

    if (cached.texts && typeof cached.texts === "object") {
      texts = { ...texts, ...cached.texts };
      applySiteTexts();
    }

    return Boolean(bookmarks.length || categories.length || siteTextRows.length);
  } catch (error) {
    console.warn("读取本地缓存失败：", error);
    return false;
  }
}


function normalizeIconCacheUrl(url = "") {
  return String(url || "").trim();
}

function getBrokenIconCache() {
  try {
    const raw = localStorage.getItem(BROKEN_ICON_CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const now = Date.now();
    let changed = false;

    for (const [key, time] of Object.entries(parsed)) {
      if (!time || now - Number(time) > BROKEN_ICON_CACHE_MAX_AGE) {
        delete parsed[key];
        changed = true;
      }
    }

    if (changed) {
      localStorage.setItem(BROKEN_ICON_CACHE_KEY, JSON.stringify(parsed));
    }

    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function getBrokenIconKey(bookmarkId, iconUrl) {
  return `${String(bookmarkId || "")}|${normalizeIconCacheUrl(iconUrl)}`;
}

function isBrokenIcon(bookmarkId, iconUrl) {
  const url = normalizeIconCacheUrl(iconUrl);
  if (!url) return false;

  const cache = getBrokenIconCache();
  return Boolean(cache[getBrokenIconKey(bookmarkId, url)]);
}

function rememberBrokenIcon(bookmarkId, iconUrl) {
  const url = normalizeIconCacheUrl(iconUrl);
  if (!bookmarkId || !url) return;

  try {
    const cache = getBrokenIconCache();
    cache[getBrokenIconKey(bookmarkId, url)] = Date.now();
    localStorage.setItem(BROKEN_ICON_CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

function forgetBrokenIcon(bookmarkId, iconUrl) {
  const url = normalizeIconCacheUrl(iconUrl);
  if (!bookmarkId || !url) return;

  try {
    const cache = getBrokenIconCache();
    const key = getBrokenIconKey(bookmarkId, url);
    if (cache[key]) {
      delete cache[key];
      localStorage.setItem(BROKEN_ICON_CACHE_KEY, JSON.stringify(cache));
    }
  } catch {}
}

function isSupabaseStorageIconUrl(url = "") {
  const value = String(url || "").trim();
  if (!value) return false;

  try {
    const parsed = new URL(value);
    const supabaseHost = new URL(SUPABASE_URL).hostname;
    return parsed.hostname === supabaseHost && parsed.pathname.includes(`/storage/v1/object/public/${STORAGE_ICON_BUCKET}/`);
  } catch {
    return false;
  }
}

function getRenderableIconUrl(item = {}) {
  // 只显示 Supabase Storage 已缓存的图标。
  // 不再请求 google favicon / gstatic / DuckDuckGo / 目标站 favicon.ico。
  if (!BOOKMARK_SITE_ICONS_ENABLED) return "";

  const iconUrl = String(item.icon_url || "").trim();
  if (!isSupabaseStorageIconUrl(iconUrl)) return "";
  if (isBrokenIcon(item.id, iconUrl)) return "";

  return iconUrl;
}

function renderCardLogo(item = {}, initial = "?", logoTextClass = "") {
  const iconUrl = getRenderableIconUrl(item);
  const baseClass = iconUrl ? "has-icon" : "is-fallback";

  return `
    <span class="card-logo ${baseClass} ${logoTextClass}" data-fallback-initial="${escapeAttr(initial)}" aria-hidden="true">
      <span class="card-logo-text">${escapeHtml(initial)}</span>
      ${iconUrl ? `
        <img
          class="card-favicon"
          data-card-icon-img
          data-bookmark-id="${escapeAttr(item.id)}"
          src="${escapeAttr(iconUrl)}"
          alt=""
          loading="lazy"
          decoding="async"
          referrerpolicy="no-referrer"
        />
      ` : ""}
    </span>
  `;
}

function finishInitialPaint(quiet = false) {
  updateAdminVisibility();
  finishLoadingSkeleton();
  safeRender(quiet);
}

function retryRemoteLoadSoon(delay = 5000) {
  if (remoteRetryInFlight || !isConfigured) return;

  const finalDelay = Math.min(Number(delay) || 5000, MAX_REMOTE_RETRY_DELAY);
  let nextDelay = Math.min(Math.max(finalDelay * 1.7, 6500), MAX_REMOTE_RETRY_DELAY);
  let succeeded = false;
  remoteRetryInFlight = true;

  setTimeout(async () => {
    try {
      const client = await ensureSupabaseClient({ timeout: Math.max(DB_REQUEST_TIMEOUT, SUPABASE_CLIENT_QUICK_TIMEOUT), silent: true });
      if (!client) {
        throw supabaseLoadError || timeoutError("加载 Supabase 客户端");
      }

      initialRemoteLoading = true;
      const results = await Promise.allSettled([
        loadSiteTexts(),
        loadAllData({ quiet: true, renderAfter: false }),
      ]);

      loadSession({ renderAfter: true }).catch((error) => {
        console.warn("后台读取登录状态失败：", error);
      });

      const hasDataSuccess = results.some((result) => result.status === "fulfilled" && result.value !== false);
      const rejected = results.find((result) => result.status === "rejected");

      if (!hasDataSuccess) {
        throw rejected?.reason || new Error("后台数据读取暂未成功");
      }

      remoteRetryCount = 0;
      succeeded = true;
      setRealtimeStatus("online", t("sync.online"));
      finishInitialPaint(true);
      subscribeRealtime();
    } catch (error) {
      remoteRetryCount += 1;
      nextDelay = Math.min(4000 * Math.pow(1.7, remoteRetryCount), MAX_REMOTE_RETRY_DELAY);
      console.warn("后台重连 Supabase 失败：", error);
      setRealtimeStatus("error", `连接重试中 ${Math.ceil(nextDelay / 1000)}s`);
    } finally {
      initialRemoteLoading = false;
      remoteRetryInFlight = false;

      if (!succeeded) {
        retryRemoteLoadSoon(nextDelay);
      }
    }
  }, finalDelay);
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
    stableValue(item.icon_checked_at),
    stableValue(item.icon_storage_path),
    stableValue(item.is_pinned),
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

function scheduleDataRealtimeRefresh(delay = 850) {
  if (realtimePaused) return;

  clearTimeout(dataRealtimeTimer);
  const finalDelay = document.hidden ? Math.max(delay, 1600) : delay;

  dataRealtimeTimer = setTimeout(async () => {
    if (dataRefreshInFlight) {
      dataRefreshQueued = true;
      return;
    }

    dataRefreshInFlight = true;

    try {
      await loadAllData({ quiet: true, renderAfter: true });
    } finally {
      dataRefreshInFlight = false;

      if (dataRefreshQueued) {
        dataRefreshQueued = false;
        scheduleDataRealtimeRefresh(1000);
      }
    }
  }, finalDelay);
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


// 已清理：getBookmarkIconUrl 是旧版本遗留函数，当前流程不再调用。


// 已清理：getAlternateBookmarkIconUrl 是旧版本遗留函数，当前流程不再调用。


// 已清理：getRefreshBookmarkIconUrl 是旧版本遗留函数，当前流程不再调用。

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


// 已清理：ensureCategoryCheckboxOptions 是旧版本遗留函数，当前流程不再调用。

function getSelectedBookmarkCategoryIds() {
  return uniqueIds(
    getCategoryCheckboxes()
      .filter((input) => input.checked)
      .map((input) => input.value)
  );
}


// 已清理：getSelectedBookmarkCategories 是旧版本遗留函数，当前流程不再调用。

function setSelectedBookmarkCategoryIds(ids = []) {
  const selected = new Set(uniqueIds(ids));

  getCategoryCheckboxes().forEach((input) => {
    input.checked = selected.has(String(input.value));
  });
}


// 已清理：setSelectedBookmarkCategories 是旧版本遗留函数，当前流程不再调用。

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
    return "数据库表或关联表不存在。请确认已经运行包含 bookmark_categories、is_pinned 等结构的最新 SQL。";
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

  requestAnimationFrame(() => {
    try {
      if (els.errorDialog.open) els.errorDialog.close();
      els.errorDialog.showModal();
      els.errorDialog.focus();
    } catch (error) {
      console.error("error dialog failed", error);
      showToast(message || title || "操作失败", "error");
    }
  });
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

// =========================
// 6. 文案和状态栏：把数据库里的页面文案渲染到页面上
// =========================
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

  updateSearchPlaceholder();
  els.searchFeedback.textContent = SEARCH_SCOPE_LABELS[getSearchScope()] || t("search.idle");
  renderSearchScopeTabs();
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


function scrollToTopArea() {
  const topTarget = document.querySelector(".main") || document.body;
  topTarget.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setMobileNavCategory(name) {
  currentCategory = name || "全部";
  if (els.searchInput) els.searchInput.value = "";
  closeMobileCategorySheet();
  render();
  scrollToTopArea();
}

function getMobileCategorySheetHtml() {
  const names = getVisibleCategoryNames();

  return `
    <div class="mobile-sheet-backdrop" data-mobile-close></div>
    <section class="mobile-category-sheet" role="dialog" aria-modal="true" aria-label="选择分组">
      <div class="mobile-sheet-handle" aria-hidden="true"></div>
      <div class="mobile-sheet-head">
        <div>
          <strong>选择分组</strong>
          <span>快速切换当前书签分类</span>
        </div>
        <button type="button" class="mobile-sheet-close" data-mobile-close aria-label="关闭">×</button>
      </div>
      <div class="mobile-category-list">
        ${names.map((name) => {
          const isAll = name === "全部";
          const categoryObj = getSortedCategories().find((item) => item.name === name);
          const active = currentCategory === name;
          return `
            <button class="mobile-category-item ${active ? "is-active" : ""}" type="button" data-mobile-category="${escapeAttr(name)}">
              <span class="mobile-category-icon">${groupIcon(categoryObj?.icon || getDefaultCategoryIcon(name), isAll)}</span>
              <span class="mobile-category-name">${escapeHtml(isAll ? t("top.allTitle") : name)}</span>
              <em>${getCategoryCount(name)}</em>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function openMobileCategorySheet() {
  const sheet = document.getElementById("mobileCategorySheet");
  if (!sheet) return;

  sheet.innerHTML = getMobileCategorySheetHtml();
  sheet.classList.add("is-open");
  document.body.classList.add("mobile-sheet-open");
}

function closeMobileCategorySheet() {
  const sheet = document.getElementById("mobileCategorySheet");
  if (!sheet) return;

  sheet.classList.remove("is-open");
  document.body.classList.remove("mobile-sheet-open");
}

function getMobileBottomNavHtml() {
  const admin = isAdmin();
  const hasSearch = Boolean(els.searchInput?.value?.trim());

  return `
    <button type="button" class="mobile-nav-item ${currentCategory === "全部" && !hasSearch ? "is-active" : ""}" data-mobile-action="home" aria-label="回到全部书签">
      <span>⌂</span><em>首页</em>
    </button>
    <button type="button" class="mobile-nav-item ${currentCategory !== "全部" ? "is-active" : ""}" data-mobile-action="categories" aria-label="打开分组">
      <span>☰</span><em>分组</em>
    </button>
    <button type="button" class="mobile-nav-item ${hasSearch ? "is-active" : ""}" data-mobile-action="search" aria-label="搜索书签">
      <span>⌕</span><em>搜索</em>
    </button>
    <button type="button" class="mobile-nav-item ${admin ? "is-admin" : ""}" data-mobile-action="${admin ? "add" : "login"}" aria-label="${admin ? "新增书签" : "管理员登录"}">
      <span>${admin ? "+" : "◎"}</span><em>${admin ? "新增" : "登录"}</em>
    </button>
    <button type="button" class="mobile-nav-item" data-mobile-action="theme" aria-label="切换主题">
      <span>◐</span><em>主题</em>
    </button>
  `;
}

// =========================
// 7. 手机端：底部导航和分组抽屉
// =========================
function renderMobileBottomNav() {
  const nav = document.getElementById("mobileBottomNav");
  if (!nav) return;
  nav.innerHTML = getMobileBottomNavHtml();
}

function ensureMobileNavMount() {
  if (mobileNavMounted) return;

  const nav = document.createElement("nav");
  nav.id = "mobileBottomNav";
  nav.className = "mobile-bottom-nav";
  nav.setAttribute("aria-label", "手机端快捷导航");

  const sheet = document.createElement("div");
  sheet.id = "mobileCategorySheet";
  sheet.className = "mobile-category-sheet-wrap";

  document.body.append(nav, sheet);
  mobileNavMounted = true;
  renderMobileBottomNav();

  nav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mobile-action]");
    if (!button) return;

    const action = button.dataset.mobileAction;

    if (action === "home") {
      setMobileNavCategory("全部");
      return;
    }

    if (action === "categories") {
      openMobileCategorySheet();
      return;
    }

    if (action === "search") {
      scrollToTopArea();
      setTimeout(() => {
        els.searchInput?.focus();
        els.searchInput?.select();
      }, 220);
      return;
    }

    if (action === "add") {
      openBookmarkDialog();
      return;
    }

    if (action === "login") {
      els.loginDialog?.showModal();
      return;
    }

    if (action === "theme") {
      toggleTheme();
    }
  });

  sheet.addEventListener("click", (event) => {
    const closeBtn = event.target.closest("[data-mobile-close]");
    const categoryBtn = event.target.closest("[data-mobile-category]");

    if (closeBtn) {
      closeMobileCategorySheet();
      return;
    }

    if (categoryBtn) {
      setMobileNavCategory(categoryBtn.dataset.mobileCategory);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileCategorySheet();
  });
}

// =========================
// 8. 管理员界面：登录后才显示管理按钮，访客看到干净页面
// =========================
function updateAdminVisibility() {
  const admin = isAdmin();
  const titlebar = document.querySelector(".titlebar");
  const heroPanel = document.querySelector(".hero-action-panel");
  const heroAdminGroup = document.querySelector(".hero-action-admin");
  const heroPrimaryGroup = document.querySelector(".hero-action-primary");

  document.body.classList.toggle("is-admin-user", admin);
  document.body.classList.toggle("is-guest-user", !admin);
  titlebar?.classList.toggle("is-admin-layout", admin);
  titlebar?.classList.toggle("is-guest-layout", !admin);
  heroPanel?.classList.toggle("only-guest", !admin);
  heroAdminGroup?.classList.toggle("hidden", !admin);
  heroPrimaryGroup?.classList.toggle("only-guest", !admin);

  if (!admin) {
    sidebarEditMode = false;
    batchMode = false;
    bookmarkSortMode = null;
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

  els.repairIconBtn?.classList.toggle("hidden", !admin);
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
  updateLinkCheckButtonState();

  const modeText = admin ? "管理员模式" : (currentUser ? "已登录" : t("admin.loginButton"));
  [els.adminBadge, els.adminModeBtn].forEach((button) => {
    if (!button) return;
    button.textContent = modeText;
    button.classList.remove("hidden");
    button.classList.toggle("is-admin", admin);
    button.classList.toggle("is-login", !currentUser);
    button.title = currentUser ? "当前为管理员模式" : "未登录管理员";
  });

  if (els.loginOpenBtn) {
    const topAdminText = currentUser ? "退出" : t("admin.loginButton");
    els.loginOpenBtn.textContent = topAdminText;
    els.loginOpenBtn.classList.remove("hidden");
    els.loginOpenBtn.removeAttribute("aria-hidden");
    els.loginOpenBtn.removeAttribute("tabindex");
    els.loginOpenBtn.style.removeProperty("display");
    els.loginOpenBtn.classList.toggle("is-admin", admin);
    els.loginOpenBtn.classList.toggle("is-login", !currentUser);
    els.loginOpenBtn.title = currentUser ? "退出管理员登录" : "登录管理员";
  }

  if (els.logoutBtn) {
    els.logoutBtn.classList.add("hidden");
    els.logoutBtn.setAttribute("aria-hidden", "true");
    els.logoutBtn.setAttribute("tabindex", "-1");
    els.logoutBtn.style.setProperty("display", "none", "important");
  }
  renderMobileBottomNav();
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

  if (bookmarkSortMode) {
    bookmarkSortMode = null;
    draggedBookmarkId = null;
    document.body.classList.remove("is-bookmark-dragging");
    resumeRealtimeSoon(500);
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


function getSearchScope() {
  return SEARCH_SCOPE_LABELS[currentSearchScope] ? currentSearchScope : DEFAULT_SEARCH_SCOPE;
}

function getSearchPlaceholder(scope = getSearchScope()) {
  return "搜索书签名称 / 拼音 / 首字母...";
}

function updateSearchPlaceholder() {
  if (!els.searchInput) return;
  els.searchInput.placeholder = getSearchPlaceholder();
}

// =========================
// 9. 搜索和筛选：名称搜索、拼音/首字母搜索、分组筛选
// =========================
function renderSearchScopeTabs() {
  currentSearchScope = DEFAULT_SEARCH_SCOPE;
  updateSearchPlaceholder();
}

function renderGroupFilterSelect() {
  const visibleNames = getVisibleCategoryNames();
  if (!visibleNames.includes(currentCategory)) {
    currentCategory = "全部";
  }

  const signature = JSON.stringify(visibleNames.map((name) => [name, getCategoryCount(name)]));

  if (els.groupFilterSelect && els.groupFilterSelect.tagName === "SELECT" && els.groupFilterSelect.dataset.signature !== signature) {
    els.groupFilterSelect.innerHTML = visibleNames.map((name) => {
      const label = name === "全部" ? "全部分组" : name;
      const count = getCategoryCount(name);
      return `<option value="${escapeAttr(name)}">${escapeHtml(label)}（${count}）</option>`;
    }).join("");
    els.groupFilterSelect.dataset.signature = signature;
  }

  if (els.groupFilterSelect) {
    els.groupFilterSelect.value = currentCategory;
    els.groupFilterSelect.dataset.signature = signature;
  }

  if (els.groupFilterMenu && els.groupFilterMenu.dataset.signature !== signature) {
    els.groupFilterMenu.innerHTML = visibleNames.map((name) => {
      const label = name === "全部" ? "全部分组" : name;
      const count = getCategoryCount(name);
      const active = name === currentCategory;
      return `
        <button
          type="button"
          class="group-filter-option ${active ? "is-active" : ""}"
          role="option"
          aria-selected="${String(active)}"
          data-group-filter-value="${escapeAttr(name)}"
        >
          <span>${escapeHtml(label)}</span>
          <strong>${count}</strong>
        </button>
      `;
    }).join("");
    els.groupFilterMenu.dataset.signature = signature;
  } else if (els.groupFilterMenu) {
    els.groupFilterMenu.querySelectorAll("[data-group-filter-value]").forEach((button) => {
      const active = button.dataset.groupFilterValue === currentCategory;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
  }

  const label = currentCategory === "全部" ? "全部分组" : currentCategory;
  const count = getCategoryCount(currentCategory);
  if (els.groupFilterLabel) els.groupFilterLabel.textContent = label;
  els.groupFilterDropdown?.querySelector(".group-filter-count")?.replaceChildren(document.createTextNode(String(count)));
}

function closeGroupFilterDropdown() {
  els.groupFilterDropdown?.classList.remove("is-open");
  els.groupFilterButton?.setAttribute("aria-expanded", "false");
}

function toggleGroupFilterDropdown() {
  const open = !els.groupFilterDropdown?.classList.contains("is-open");
  els.groupFilterDropdown?.classList.toggle("is-open", open);
  els.groupFilterButton?.setAttribute("aria-expanded", String(open));
}

function selectGroupFilter(value) {
  if (bookmarkSortMode) {
    bookmarkSortMode = null;
    resumeRealtimeSoon(500);
  }
  currentCategory = value || "全部";
  if (els.groupFilterSelect) els.groupFilterSelect.value = currentCategory;
  closeGroupFilterDropdown();
  render();
  requestAnimationFrame(updateCategoryIndicator);
}

function setSearchScope(scope, renderAfter = true) {
  if (!SEARCH_SCOPE_LABELS[scope]) return;

  currentSearchScope = scope;
  localStorage.setItem("bookmark-search-scope", scope);
  renderSearchScopeTabs();

  if (renderAfter) render();
}


function normalizeSearchToken(value = "") {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function compactSearchToken(value = "") {
  return normalizeSearchToken(value)
    .replace(/[^\p{L}\p{N}\u4e00-\u9fff]+/gu, "");
}

function getSearchTerms() {
  const raw = String(els.searchInput?.value || "").trim();
  if (!raw) return [];

  const parts = raw
    .split(/[\s,，、|/\\]+/u)
    .map((item) => item.trim())
    .filter(Boolean);

  if (!parts.length && raw) parts.push(raw);

  const seen = new Set();
  return parts
    .filter((term) => {
      const key = normalizeSearchToken(term);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.length - a.length)
    .slice(0, 8);
}

function escapeRegExp(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function shouldHighlightField(field) {
  const scope = getSearchScope();
  if (!els.searchInput?.value?.trim()) return false;
  if (scope === "all") return true;
  return scope === field;
}

function highlightSearchHtml(value = "", field = "all") {
  const text = String(value ?? "");
  if (!text) return "";
  if (!shouldHighlightField(field)) return escapeHtml(text);

  const terms = getSearchTerms()
    .filter((term) => term.length <= 80)
    .map(escapeRegExp)
    .filter(Boolean);

  if (!terms.length) return escapeHtml(text);

  const reg = new RegExp(`(${terms.join("|")})`, "giu");
  let lastIndex = 0;
  let output = "";
  let matched = false;

  text.replace(reg, (match, _group, offset) => {
    matched = true;
    output += escapeHtml(text.slice(lastIndex, offset));
    output += `<mark class="search-hit">${escapeHtml(match)}</mark>`;
    lastIndex = offset + match.length;
    return match;
  });

  if (!matched) return escapeHtml(text);
  output += escapeHtml(text.slice(lastIndex));
  return output;
}

function hasDirectSearchMatch(item = {}) {
  const rawQuery = normalizeSearchToken(els.searchInput?.value || "");
  const compactQuery = compactSearchToken(els.searchInput?.value || "");
  if (!rawQuery && !compactQuery) return false;

  const categories = getBookmarkCategories(item).join(" ");
  const domain = getBookmarkDomain(item.url);
  const directText = normalizeSearchToken([item.title, item.description, item.url, domain, categories].join(" "));
  const directCompact = compactSearchToken([item.title, item.description, item.url, domain, categories].join(" "));

  return Boolean(
    rawQuery && directText.includes(rawQuery) ||
    compactQuery && directCompact.includes(compactQuery)
  );
}

function getPinyinMatchBadgeHtml(item = {}) {
  if (!els.searchInput?.value?.trim()) return "";
  if (hasDirectSearchMatch(item)) return "";
  return `<span class="search-alias-badge" title="通过拼音或首字母匹配">拼音匹配</span>`;
}

function getPinyinAliases(value = "") {
  const text = String(value ?? "");
  const aliases = new Set();
  const normalized = normalizeSearchToken(text);
  const compact = compactSearchToken(text);

  if (normalized) aliases.add(normalized);
  if (compact) aliases.add(compact);

  for (const [phrase, aliasText] of PINYIN_PHRASE_ALIASES.entries()) {
    if (!text.includes(phrase)) continue;

    String(aliasText || "")
      .split(/\s+/)
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean)
      .forEach((item) => aliases.add(item));
  }

  const full = [];
  const initials = [];

  for (const char of Array.from(text)) {
    const pinyin = PINYIN_CHAR_MAP[char];

    if (pinyin) {
      full.push(pinyin);
      initials.push(pinyin[0]);
      continue;
    }

    if (/^[a-z0-9]$/i.test(char)) {
      const lower = char.toLowerCase();
      full.push(lower);
      initials.push(lower);
    }
  }

  const fullText = full.join("");
  const initialText = initials.join("");

  if (fullText) aliases.add(fullText);
  if (initialText) aliases.add(initialText);

  return [...aliases].filter(Boolean).join(" ");
}

function buildSearchValue(...values) {
  const raw = values.map((item) => String(item ?? "")).filter(Boolean).join(" ");
  const aliases = values.map((item) => getPinyinAliases(item)).filter(Boolean).join(" ");
  return normalizeSearchToken(`${raw} ${aliases}`);
}

function getBookmarkSearchText(item, scope = getSearchScope()) {
  return buildSearchValue(item.title);
}

function getFilteredBookmarks() {
  const q = compactSearchToken(els.searchInput.value);
  const looseQ = normalizeSearchToken(els.searchInput.value);
  const scope = getSearchScope();

  return bookmarks.filter((item) => {
    const categoryMatch = currentCategory === "全部" || getBookmarkCategories(item).includes(currentCategory);
    const searchableText = getBookmarkSearchText(item, scope);
    const searchableCompact = compactSearchToken(searchableText);

    return categoryMatch && (!q || searchableText.includes(looseQ) || searchableCompact.includes(q));
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
    els.searchFeedback.textContent = currentCategory === "全部" ? "全部分组" : currentCategory;
    return;
  }

  if (filteredCount > 0) {
    els.searchFeedback.textContent = `名称 · ${t("search.found", { count: filteredCount })}`;
    els.searchShell.classList.add("searching");
  } else {
    els.searchFeedback.textContent = t("search.empty");
    els.searchShell.classList.add("no-results");
  }
}

function updateGroupOpenButton(filteredCount = getFilteredBookmarks().length) {
  if (!els.groupOpenBtn) return;

  const hasSearch = Boolean(els.searchInput.value.trim());
  const label = hasSearch
    ? `打开结果（${filteredCount}）`
    : currentCategory === "全部"
      ? `一键打开全部（${filteredCount}）`
      : `一键打开本组（${filteredCount}）`;

  els.groupOpenBtn.textContent = label;
  els.groupOpenBtn.disabled = filteredCount <= 0;
}

function openCurrentVisibleBookmarks() {
  const items = getFilteredBookmarks().filter((item) => item?.url);

  if (!items.length) {
    showToast("当前没有可以打开的书签", "error");
    return;
  }

  if (items.length > 12) {
    const confirmed = window.confirm(`即将打开 ${items.length} 个网页。浏览器可能会拦截批量弹窗，确定继续吗？`);
    if (!confirmed) return;
  }

  let blockedCount = 0;

  for (const item of items) {
    const opened = window.open(normalizeUrl(item.url), "_blank", "noopener,noreferrer");
    if (!opened) blockedCount += 1;
  }

  if (blockedCount > 0) {
    showToast(`有 ${blockedCount} 个网页可能被浏览器拦截，请允许此网站弹出窗口。`, "error");
  } else {
    showToast(`已打开 ${items.length} 个网页`);
  }
}


function setBookmarkView(view, persist = true) {
  const nextView = "grid";

  els.bookmarkGrid?.classList.remove("is-list");

  document.querySelectorAll("[data-view-mode]").forEach((button) => {
    const isActive = button.dataset.viewMode === nextView;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (persist) {
    localStorage.setItem("bookmark-view", nextView);
  }
}

function normalizeCardDensity(value = "") {
  const key = String(value || "").trim();
  return CARD_DENSITY_OPTIONS.some((item) => item.key === key) ? key : DEFAULT_CARD_DENSITY;
}

function getCardDensityMeta(key = currentCardDensity) {
  return CARD_DENSITY_OPTIONS.find((item) => item.key === normalizeCardDensity(key)) || CARD_DENSITY_OPTIONS[0];
}

function updateCardDensityControl() {
  const control = document.getElementById("cardDensityControl");
  if (!control) return;

  const activeMeta = getCardDensityMeta();
  const currentLabel = control.querySelector("[data-density-current]");
  if (currentLabel) currentLabel.textContent = activeMeta.label;

  control.querySelectorAll("[data-card-density]").forEach((button) => {
    const active = button.dataset.cardDensity === currentCardDensity;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function applyCardDensity(value = currentCardDensity, persist = false) {
  currentCardDensity = normalizeCardDensity(value);
  document.body.dataset.cardDensity = currentCardDensity;
  els.bookmarkGrid?.setAttribute("data-card-density", currentCardDensity);
  updateCardDensityControl();

  if (persist) {
    localStorage.setItem(CARD_DENSITY_STORAGE_KEY, currentCardDensity);
  }
}

function setCardDensity(value) {
  const next = normalizeCardDensity(value);
  applyCardDensity(next, true);
  const meta = getCardDensityMeta(next);
  showToast(`已切换为${meta.label}模式`);
}

function getCardDensityControlHtml() {
  return `
    <div class="density-segmented density-segmented-compact" role="group" aria-label="切换卡片密度">
      ${CARD_DENSITY_OPTIONS.map((item) => `
        <button
          type="button"
          data-card-density="${escapeAttr(item.key)}"
          class="density-chip ${item.key === currentCardDensity ? "is-active" : ""}"
          aria-pressed="${String(item.key === currentCardDensity)}"
          title="${escapeAttr(item.desc)}"
        >${escapeHtml(item.label)}</button>
      `).join("")}
    </div>
  `;
}

function ensureCardDensityControlMount() {
  let control = document.getElementById("cardDensityControl");

  if (!control) {
    const panel = document.querySelector(".hero-action-panel");
    if (!panel) return;

    control = document.createElement("div");
    control.id = "cardDensityControl";
    control.className = "top-density-control hero-action-group hero-action-density";
    const adminGroup = panel.querySelector(".hero-action-admin");
    panel.insertBefore(control, adminGroup || null);
  }

  if (!control.innerHTML.trim()) {
    control.innerHTML = getCardDensityControlHtml();
  }

  if (control.dataset.bound !== "true") {
    control.addEventListener("click", (event) => {
      const button = event.target.closest("[data-card-density]");
      if (!button) return;
      setCardDensity(button.dataset.cardDensity);
    });
    control.dataset.bound = "true";
  }

  updateCardDensityControl();
}

function ensureLinkCheckControlMount() {
  const adminGroup = document.querySelector(".hero-action-admin");
  if (!adminGroup || document.getElementById("checkLinkBtn")) return;

  const button = document.createElement("button");
  button.id = "checkLinkBtn";
  button.className = "ghost-btn link-check-btn hidden";
  button.type = "button";
  button.textContent = "检查链接";
  button.title = "检测书签是否可以正常访问";
  adminGroup.insertBefore(button, adminGroup.firstChild);
  els.checkLinkBtn = button;

  button.addEventListener("click", checkVisibleBookmarkLinks);
}

function updateLinkCheckButtonState() {
  const button = els.checkLinkBtn || document.getElementById("checkLinkBtn");
  if (!button) return;

  button.classList.toggle("hidden", !isAdmin());
  button.disabled = linkCheckInProgress;
  button.textContent = linkCheckInProgress ? "检查中..." : "检查链接";
}

function initCardDensity() {
  applyCardDensity(currentCardDensity, false);
}

function updateCategoryIndicator() {
  const activeRow = els.groupList.querySelector(".group-row.is-active");
  const pill = els.groupList.querySelector(".group-active-pill");

  if (!activeRow || !pill) return;

  els.groupList.style.setProperty("--active-top", `${activeRow.offsetTop}px`);
  els.groupList.style.setProperty("--active-height", `${activeRow.offsetHeight}px`);
  els.groupList.style.setProperty("--active-opacity", "1");
}

// =========================
// 10. 页面渲染：左侧分组、书签卡片、分区、空状态
// =========================
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

// 单张书签卡片的 HTML 都从这里生成。
function renderCard(item, index, sectionKey = "") {
  const admin = isAdmin();
  const isHighlighted = highlightBookmarkId && String(item.id) === String(highlightBookmarkId);
  const initial = getBookmarkInitial(item.title);
  const logoTextClass = initial.length >= 3 ? "is-word-logo" : initial.length >= 2 ? "is-short-logo" : "";
  const domain = getBookmarkDomain(item.url);
  const bookmarkCategories = getBookmarkCategories(item);
  const visibleCategoryChips = bookmarkCategories.slice(0, 3);
  const hiddenCategoryCount = Math.max(0, bookmarkCategories.length - visibleCategoryChips.length);
  const categoryChips = visibleCategoryChips.length
    ? `
      <div class="card-groups" aria-label="所属分组">
        ${visibleCategoryChips.map((name) => `<span>${highlightSearchHtml(name, "category")}</span>`).join("")}
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

  const isSortingCard = Boolean(bookmarkSortMode && bookmarkSortMode.key === sectionKey);
  const canDragSort = admin && !batchMode && isSortingCard;
  const dragHandle = canDragSort
    ? `<button class="card-drag-handle" type="button" draggable="true" data-bookmark-drag="${escapeAttr(item.id)}" aria-label="拖动排序" title="按住拖动排序">⋮⋮</button>`
    : "";
  const sortMoveControls = canDragSort
    ? `
      <div class="card-sort-controls" aria-label="排序微调">
        <button type="button" data-sort-move="up" data-sort-id="${escapeAttr(item.id)}" title="上移">↑</button>
        <button type="button" data-sort-move="down" data-sort-id="${escapeAttr(item.id)}" title="下移">↓</button>
      </div>
    `
    : "";

  const isMenuOpen = activeCardMenuId && String(activeCardMenuId) === String(item.id);
  const adminButtons = admin && !batchMode && !isSortingCard
    ? `
      <div class="card-menu ${isMenuOpen ? "is-open" : ""}">
        <button class="card-menu-toggle" type="button" data-card-menu-toggle="${escapeAttr(item.id)}" aria-label="打开书签菜单" aria-expanded="${String(isMenuOpen)}">•••</button>
        <div class="card-menu-panel" role="menu">
          <button type="button" data-edit="${escapeAttr(item.id)}" role="menuitem">编辑</button>
          <button type="button" data-copy-link="${escapeAttr(item.id)}" role="menuitem">复制链接</button>
          <button type="button" data-refresh-icon="${escapeAttr(item.id)}" role="menuitem">修复图标</button>
          <button type="button" data-upload-icon="${escapeAttr(item.id)}" role="menuitem">上传图标</button>
          <button type="button" data-pin="${escapeAttr(item.id)}" data-pin-value="${item.is_pinned ? "false" : "true"}" role="menuitem">${item.is_pinned ? "取消置顶" : "置顶"}</button>
          <button class="danger" type="button" data-delete="${escapeAttr(item.id)}" role="menuitem">删除</button>
        </div>
      </div>
    `
    : "";

  const openAttrs = isSortingCard ? `role="listitem" aria-label="${escapeAttr(item.title)}"` : `data-open-url="${escapeAttr(item.url)}" role="link" tabindex="0" aria-label="${escapeAttr(item.title)}"`;

  const guestHint = batchMode ? "" : `<div class="guest-hint">${escapeHtml(t("bookmark.openHint"))}</div>`;
  const pinnedBadge = item.is_pinned ? `<span class="pin-badge" title="置顶">★</span>` : "";
  const matchBadge = getPinyinMatchBadgeHtml(item);
  const descriptionText = item.description || t("bookmark.emptyDesc");

  return `
    <article
      class="card ${admin ? "admin-card" : "guest-card"} ${batchMode ? "is-batch-mode" : ""} ${isSortingCard ? "is-sort-mode" : ""} ${isMenuOpen ? "is-menu-open" : ""} ${item.is_pinned ? "is-pinned" : ""} ${isBatchSelected ? "is-selected" : ""} ${isHighlighted ? "is-new" : ""}"
      data-card-id="${escapeAttr(item.id)}"
      data-sort-section="${escapeAttr(sectionKey)}"
      style="animation-delay:${Math.min(index * 35, 280)}ms"
      ${openAttrs}
    >
      <div class="card-content">
        <span class="card-sheen" aria-hidden="true"></span>
        <div class="card-top">
          ${batchSelector}
          ${dragHandle}
          ${renderCardLogo(item, initial, logoTextClass)}
          ${pinnedBadge}
          ${adminButtons}
          ${sortMoveControls}
        </div>
        <div class="card-title-wrap">
          <h3 class="${getCardTitleFitClass(item.title)}" title="${escapeAttr(item.title)}">${highlightSearchHtml(item.title, "title")}</h3>
          <div class="card-meta-row">
            ${domain ? `<span class="card-domain">${highlightSearchHtml(domain, "url")}</span>` : ""}
            ${matchBadge}
          </div>
        </div>
        <p class="card-desc">${highlightSearchHtml(descriptionText, "description")}</p>
        ${categoryChips}
        ${guestHint}
      </div>
    </article>
  `;
}


function getCardTitleFitClass(title = "") {
  const text = String(title || "").trim();
  const chars = Array.from(text);
  const cjkCount = chars.filter((ch) => /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(ch)).length;
  const asciiCount = Math.max(chars.length - cjkCount, 0);
  const visualLength = cjkCount * 1.65 + asciiCount;

  if (visualLength >= 34) return "title-fit-xxl";
  if (visualLength >= 27) return "title-fit-xl";
  if (visualLength >= 21) return "title-fit-lg";
  if (visualLength >= 15) return "title-fit-md";
  return "title-fit-normal";
}

function renderTextEditor() {
  if (!els.textList) return;

  const rowsForEditor = getTextRowsForEditor();
  const grouped = {};

  for (const row of rowsForEditor) {
    const groupKey = row.key.includes(".") ? row.key.split(".")[0] : "other";

    if (!grouped[groupKey]) grouped[groupKey] = [];
    grouped[groupKey].push(row);
  }

  const groupOrder = [
    "brand",
    "sidebar",
    "top",
    "admin",
    "search",
    "bookmark",
    "empty",
    "intro",
    "login",
    "bookmarkForm",
    "categoryForm",
    "textForm",
    "common",
    "sync",
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
        <section class="copy-group copy-group-open" data-copy-group="${escapeAttr(groupKey)}">
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
              const isLongText = String(value).length > 42 || String(value).includes("，") || String(value).includes("。");
              return `
                <label class="copy-field">
                  <span class="copy-field-info">
                    <strong>${escapeHtml(row.description || row.key)}</strong>
                    <span>${escapeHtml(row.key)}</span>
                  </span>

                  <textarea
                    data-text-key="${escapeAttr(row.key)}"
                    spellcheck="false"
                    rows="${isLongText ? 3 : 2}"
                  >${escapeHtml(value)}</textarea>
                </label>
              `;
            }).join("")}
          </div>
        </section>
      `;
    })
    .join("");

  els.textList.innerHTML = html
    ? `<div class="copy-editor-tip">所有可编辑文案已展开显示，直接修改右侧输入框后点击“保存文案”。这里只保留普通访问者能看到或管理员常用的页面文字。</div>${html}`
    : `<div class="copy-empty">暂无可编辑文案。</div>`;
}

function renderBookmarkSection(title, items, startIndex = 0, variant = "normal", desc = "") {
  if (!items.length) return "";

  const searchText = els.searchInput?.value?.trim?.() || "";
  const admin = isAdmin();
  const isSorting = Boolean(bookmarkSortMode && bookmarkSortMode.key === variant);
  const canSort = admin && !batchMode && !searchText && items.length > 1;
  const displayItems = applyBookmarkDraftOrder(variant, items);
  const sortActions = canSort
    ? isSorting
      ? `
        <div class="section-sort-actions">
          <button class="section-sort-btn is-save" type="button" data-sort-action="save" data-sort-section="${escapeAttr(variant)}">保存排序</button>
          <button class="section-sort-btn" type="button" data-sort-action="cancel" data-sort-section="${escapeAttr(variant)}">取消</button>
        </div>
      `
      : `
        <div class="section-sort-actions">
          <button class="section-sort-btn" type="button" data-sort-action="start" data-sort-section="${escapeAttr(variant)}">整理排序</button>
        </div>
      `
    : "";

  return `
    <section class="bookmark-section bookmark-section-${escapeAttr(variant)} ${isSorting ? "is-sorting" : ""}" data-bookmark-section="${escapeAttr(variant)}">
      <div class="bookmark-section-head">
        <div>
          <strong>${escapeHtml(title)}</strong>
          ${desc ? `<em>${escapeHtml(isSorting ? "正在本地整理顺序，点击保存后一次性同步。" : desc)}</em>` : ""}
        </div>
        <div class="bookmark-section-meta">
          <span>${items.length} 个</span>
          ${sortActions}
        </div>
      </div>
      <div class="section-grid" role="list">
        ${displayItems.map((item, index) => renderCard(item, startIndex + index, variant)).join("")}
      </div>
    </section>
  `;
}

// 页面大刷新入口：分组、卡片、按钮状态都会在这里统一更新。
function render() {
  renderCategorySelect();
  renderGroupList();
  renderGroupFilterSelect();

  if (isInitialLoading) return;

  const filtered = getFilteredBookmarks();
  const searchText = els.searchInput.value.trim();
  const pinned = !searchText
    ? filtered.filter((item) => item.is_pinned)
    : [];
  const pinnedIds = new Set(pinned.map((item) => String(item.id)));
  const normal = filtered.filter((item) => !pinnedIds.has(String(item.id)));
  const admin = isAdmin();
  const shouldSection = pinned.length > 0 || (admin && !searchText && filtered.length > 0);

  updatePageMeta(filtered.length);
  updateSearchFeedback(filtered.length);
  updateGroupOpenButton(filtered.length);

  els.emptyState.classList.toggle("hidden", filtered.length > 0);
  els.bookmarkGrid.classList.toggle("has-sections", shouldSection);
  els.bookmarkGrid.classList.toggle("has-pinned-section", pinned.length > 0);
  els.bookmarkGrid.classList.toggle("no-pinned-section", shouldSection && pinned.length === 0);
  document.body.classList.toggle("has-pinned-section", pinned.length > 0);
  document.body.classList.toggle("no-pinned-section", shouldSection && pinned.length === 0);
  els.bookmarkGrid.classList.toggle("sort-mode-active", Boolean(bookmarkSortMode));
  document.body.classList.toggle("bookmark-sort-mode-active", Boolean(bookmarkSortMode));
  if (shouldSection) {
    const sections = [];

    if (pinned.length > 0) {
      sections.push(renderBookmarkSection("置顶收藏", pinned, 0, "pinned", "重要链接始终放在最前面"));
    }

    if (normal.length > 0) {
      sections.push(renderBookmarkSection(currentCategory === "全部" ? "全部收藏" : "普通收藏", normal, pinned.length, "normal", "其余收藏按当前分组展示"));
    }

    els.bookmarkGrid.innerHTML = sections.join("");
  } else {
    els.bookmarkGrid.innerHTML = filtered.map((item, index) => renderCard(item, index, "normal")).join("");
  }

  updateBatchUI();
  updateCardDensityControl();
  updateLinkCheckButtonState();
  renderMobileBottomNav();
}

async function updateBookmarkIconCache(bookmarkId, patch = {}, options = {}) {
  const index = bookmarks.findIndex((item) => String(item.id) === String(bookmarkId));
  if (index < 0) return;

  bookmarks[index] = {
    ...bookmarks[index],
    ...patch,
  };

  bookmarksDataSignature = getBookmarksDataSignature(bookmarks);
  saveAppCache();

  if (options.renderAfter) {
    safeRender(true);
  }
}

function activateBookmarkIcons() {
  if (activateBookmarkIcons.bound || !els.bookmarkGrid) return;

  els.bookmarkGrid.addEventListener("error", (event) => {
    const img = event.target?.closest?.("[data-card-icon-img]");
    if (!img) return;

    const bookmarkId = img.dataset.bookmarkId;
    const iconUrl = img.getAttribute("src") || "";
    rememberBrokenIcon(bookmarkId, iconUrl);

    const logo = img.closest(".card-logo");
    if (logo) {
      logo.classList.remove("has-icon", "is-loading");
      logo.classList.add("is-fallback");
    }

    img.remove();
  }, true);

  activateBookmarkIcons.bound = true;
}

// =========================
// 11. 图标缓存：前端只读 Storage 图标，抓取交给 Edge Function
// =========================
async function fetchBookmarkIconWithEdge(bookmarkId, url, options = {}) {
  const { force = false, debug = true } = options;

  if (!BOOKMARK_SITE_ICONS_ENABLED) {
    return { data: null, error: new Error("图标功能未启用") };
  }

  if (!isAdmin()) {
    return { data: null, error: new Error(t("toast.noPermission")) };
  }

  if (!supabase) {
    const client = await ensureSupabaseClient({ timeout: SUPABASE_CLIENT_QUICK_TIMEOUT, silent: true });
    if (!client) {
      return { data: null, error: timeoutError("连接 Supabase") };
    }
  }

  try {
    const result = await withTimeout(
      supabase.functions.invoke(ICON_EDGE_FUNCTION_NAME, {
        body: {
          bookmark_id: bookmarkId,
          url,
          force,
          debug,
        },
      }),
      45000,
      "修复图标"
    );

    if (result.error) return result;

    if (result.data && result.data.ok === false) {
      const message = getIconRepairErrorMessage(result.data, null);
      return { data: result.data, error: new Error(message || "图标修复失败") };
    }

    if (result.data?.ok && result.data?.icon_url) {
      const nextIconUrl = String(result.data.icon_url || "").trim();

      if (!isSupabaseStorageIconUrl(nextIconUrl)) {
        return {
          data: result.data,
          error: new Error("Edge Function 返回的不是 Supabase Storage 图标，已跳过。"),
        };
      }

      forgetBrokenIcon(bookmarkId, nextIconUrl);
      await updateBookmarkIconCache(bookmarkId, {
        icon_url: nextIconUrl,
        icon_status: "success",
        icon_checked_at: new Date().toISOString(),
        icon_storage_path: result.data.icon_storage_path || result.data.icon_path || null,
      });
    }

    return result;
  } catch (error) {
    return { data: null, error };
  }
}

function getIconRepairErrorMessage(data = null, error = null) {
  if (error?.message) return error.message;
  if (typeof error === "string") return error;
  if (data?.error) return String(data.error);

  const attempts = Array.isArray(data?.attempts) ? data.attempts : [];
  const failed = attempts.filter((item) => item && item.ok === false);
  const last = failed.at(-1) || attempts.at(-1);

  if (last?.reason) return String(last.reason);
  if (last?.status) return `HTTP ${last.status}`;

  return "未知原因";
}

function getIconRepairAttemptSummary(data = null, limit = 5) {
  const attempts = Array.isArray(data?.attempts) ? data.attempts : [];
  if (!attempts.length) return "";

  return attempts
    .filter((item) => item && item.ok === false)
    .slice(-limit)
    .map((item) => {
      const source = item.source || "候选地址";
      const reason = item.reason || (item.status ? `HTTP ${item.status}` : "失败");
      return `${source}：${reason}`;
    })
    .join("；");
}


// 已清理：queueBookmarkIconFetch 是旧版本遗留函数，当前流程不再调用。

function getIconRepairTargets(mode = "missing") {
  const rows = bookmarks.filter((item) => item?.id && item?.url && item.is_deleted !== true && item.is_active !== false);

  if (mode === "all") return rows;
  if (mode === "failed") return rows.filter((item) => item.icon_status === "failed");

  return rows.filter((item) => !isSupabaseStorageIconUrl(item.icon_url) || item.icon_status === "failed");
}

function getIconRepairSummary() {
  const rows = bookmarks.filter((item) => item?.id && item?.url && item.is_deleted !== true && item.is_active !== false);
  const ready = rows.filter((item) => isSupabaseStorageIconUrl(item.icon_url)).length;
  const failed = rows.filter((item) => item.icon_status === "failed").length;
  const missing = rows.filter((item) => !isSupabaseStorageIconUrl(item.icon_url)).length;

  return { total: rows.length, ready, missing, failed };
}

// =========================
// 12. 书签排序：先本地排序，点保存后一次性写入数据库
// =========================
function getSortableBookmarkSections() {
  const filtered = getFilteredBookmarks();
  const pinned = filtered.filter((item) => item.is_pinned);
  const pinnedIds = new Set(pinned.map((item) => String(item.id)));
  const normal = filtered.filter((item) => !pinnedIds.has(String(item.id)));
  return { pinned, normal };
}

function getCurrentSortableItems(sectionKey = "normal") {
  const sections = getSortableBookmarkSections();
  return sectionKey === "pinned" ? sections.pinned : sections.normal;
}

function applyBookmarkDraftOrder(sectionKey, items = []) {
  if (!bookmarkSortMode || bookmarkSortMode.key !== sectionKey || !Array.isArray(bookmarkSortMode.draftIds)) {
    return items;
  }

  const byId = new Map(items.map((item) => [String(item.id), item]));
  const ordered = bookmarkSortMode.draftIds.map((id) => byId.get(String(id))).filter(Boolean);
  const remaining = items.filter((item) => !bookmarkSortMode.draftIds.includes(String(item.id)));
  return [...ordered, ...remaining];
}

function startBookmarkSortMode(sectionKey = "normal") {
  if (!isAdmin()) return;

  const searchText = els.searchInput?.value?.trim?.() || "";
  if (searchText) {
    showToast("请先清空搜索关键词，再整理排序", "error");
    return;
  }

  if (batchMode) {
    batchMode = false;
    selectedBookmarkIds.clear();
  }

  const items = getCurrentSortableItems(sectionKey);
  const ids = items.map((item) => String(item.id)).filter(Boolean);

  if (ids.length < 2) {
    showToast("当前区域书签太少，不需要排序");
    return;
  }

  closeCardMenus();
  bookmarkSortMode = {
    key: sectionKey,
    originalIds: [...ids],
    draftIds: [...ids],
  };
  pauseRealtime();
  render();
  showToast("已进入排序模式，拖动卡片后点击保存");
}

function cancelBookmarkSortMode() {
  if (!bookmarkSortMode) return;
  bookmarkSortMode = null;
  draggedBookmarkId = null;
  document.body.classList.remove("is-bookmark-dragging");
  clearBookmarkDropMarks();
  resumeRealtimeSoon(500);
  render();
  showToast("已取消排序");
}

// 排序模式保存：拖动时不写数据库，点保存才统一写 sort_order。
async function saveBookmarkSortMode() {
  if (!bookmarkSortMode) return;

  const draftIds = [...bookmarkSortMode.draftIds];
  const sectionKey = bookmarkSortMode.key;
  bookmarkSortMode = null;
  draggedBookmarkId = null;
  document.body.classList.remove("is-bookmark-dragging");
  clearBookmarkDropMarks();

  const changed = draftIds.join("|") !== getCurrentSortableItems(sectionKey).map((item) => String(item.id)).join("|");
  if (!changed) {
    resumeRealtimeSoon(500);
    render();
    showToast("顺序没有变化");
    return;
  }

  await updateBookmarkSortOrder(draftIds);
}

function reorderBookmarkDraft(sourceId, targetId, position = "before") {
  if (!bookmarkSortMode || !sourceId || !targetId || String(sourceId) === String(targetId)) return false;

  const draft = [...bookmarkSortMode.draftIds.map(String)];
  const fromIndex = draft.indexOf(String(sourceId));
  const targetIndex = draft.indexOf(String(targetId));

  if (fromIndex < 0 || targetIndex < 0) return false;

  draft.splice(fromIndex, 1);
  const nextTargetIndex = draft.indexOf(String(targetId));
  draft.splice(position === "after" ? nextTargetIndex + 1 : nextTargetIndex, 0, String(sourceId));

  bookmarkSortMode = {
    ...bookmarkSortMode,
    draftIds: draft,
  };
  return true;
}

function moveBookmarkInDraft(id, direction = "up") {
  if (!bookmarkSortMode) return;

  const draft = [...bookmarkSortMode.draftIds.map(String)];
  const index = draft.indexOf(String(id));
  if (index < 0) return;

  const nextIndex = direction === "down" ? index + 1 : index - 1;
  if (nextIndex < 0 || nextIndex >= draft.length) return;

  const [moved] = draft.splice(index, 1);
  draft.splice(nextIndex, 0, moved);
  bookmarkSortMode = {
    ...bookmarkSortMode,
    draftIds: draft,
  };
  render();
}

function clearBookmarkDropMarks() {
  els.bookmarkGrid?.querySelectorAll(".card.drop-before, .card.drop-after").forEach((card) => {
    card.classList.remove("drop-before", "drop-after");
  });
}

function getBookmarkDragPosition(event, card) {
  const rect = card.getBoundingClientRect();
  const sameRowThreshold = rect.height * 0.38;
  const centerY = rect.top + rect.height / 2;

  if (Math.abs(event.clientY - centerY) < sameRowThreshold) {
    return event.clientX < rect.left + rect.width / 2 ? "before" : "after";
  }

  return event.clientY < centerY ? "before" : "after";
}


// 已清理：getBookmarkOrderContainer 是旧版本遗留函数，当前流程不再调用。

async function updateBookmarkSortOrder(ids = []) {
  const orderedIds = uniqueIds(ids);

  if (!orderedIds.length || !supabase || !isAdmin()) return false;

  const previous = new Map(bookmarks.map((item) => [String(item.id), Number(item.sort_order ?? 0)]));

  bookmarks = bookmarks.map((item) => {
    const index = orderedIds.indexOf(String(item.id));
    if (index < 0) return item;
    return {
      ...item,
      sort_order: (index + 1) * 10,
    };
  });

  bookmarksDataSignature = getBookmarksDataSignature(bookmarks);
  saveAppCache();
  safeRender(true);
  pauseRealtime();

  try {
    for (let index = 0; index < orderedIds.length; index += 1) {
      const id = orderedIds[index];
      const nextSort = (index + 1) * 10;
      const { error } = await supabase
        .from("bookmarks")
        .update({ sort_order: nextSort })
        .eq("id", id);

      if (error) throw error;
    }

    showToast("书签顺序已保存");
    await loadAllData({ quiet: true, renderAfter: true });
    resumeRealtimeSoon(900);
    return true;
  } catch (error) {
    bookmarks = bookmarks.map((item) => {
      const oldSort = previous.get(String(item.id));
      return oldSort === undefined ? item : { ...item, sort_order: oldSort };
    });
    bookmarksDataSignature = getBookmarksDataSignature(bookmarks);
    saveAppCache();
    safeRender(true);
    resumeRealtimeSoon(900);
    handleOperationError(error, "书签排序保存失败", "拖拽排序没有保存成功，请确认 bookmarks 表存在 sort_order 字段，并且管理员 RLS 允许更新。", { dialog: true });
    return false;
  }
}


// 已清理：reorderBookmarkByDrop 是旧版本遗留函数，当前流程不再调用。

function showIconRepairResultDialog(summary = {}) {
  const { success = 0, skipped = 0, failures = [], total = 0, label = "图标" } = summary;
  const failed = failures.length;
  const completed = success + skipped + failed;

  if (!els.errorDialog) {
    showToast(`图标修复完成：成功 ${success} 个，失败 ${failed} 个`);
    return;
  }

  els.errorDialogTitle.textContent = failed ? "图标修复结果" : "图标修复完成";
  els.errorDialogMessage.textContent = `${label}处理完成：共 ${total || completed} 个，成功 ${success} 个${skipped ? `，跳过 ${skipped} 个` : ""}${failed ? `，失败 ${failed} 个` : "，失败 0 个"}`;

  const failureHtml = failed
    ? `
      <div class="icon-repair-failure-list">
        ${failures.slice(0, 24).map((item, index) => `
          <div class="icon-repair-failure">
            <strong>${index + 1}. ${escapeHtml(item.title || "未命名书签")}</strong>
            ${item.url ? `<span>${escapeHtml(item.url)}</span>` : ""}
            <em>${escapeHtml(item.reason || "未知原因")}</em>
            ${item.attempts ? `<small>${escapeHtml(item.attempts)}</small>` : ""}
          </div>
        `).join("")}
        ${failed > 24 ? `<p class="icon-repair-more">还有 ${failed - 24} 个失败项已省略，可打开控制台查看完整日志。</p>` : ""}
      </div>
    `
    : `<p class="icon-repair-ok">所有可处理图标都已经缓存到 Supabase Storage。</p>`;

  els.errorDialogDetail.innerHTML = `
    <div class="icon-repair-summary">
      <div><strong>${success}</strong><span>成功</span></div>
      <div><strong>${skipped}</strong><span>跳过</span></div>
      <div><strong>${failed}</strong><span>失败</span></div>
    </div>
    ${failureHtml}
  `;
  els.errorDialogDetail.classList.remove("hidden");

  els.errorDialogFix.innerHTML = failed
    ? "自动失败通常是目标网站 403/404、Cloudflare 风控、返回登录页、内部系统或 IP 面板导致的。公开网站可以稍后重试；内部/特殊网站建议在书签菜单里使用 <strong>上传图标</strong> 手动补齐。"
    : "页面会直接显示 Supabase Storage 缓存图标，不会再请求外部 favicon。";
  els.errorDialogFix.classList.remove("hidden");

  requestAnimationFrame(() => {
    try {
      if (els.errorDialog.open) els.errorDialog.close();
      els.errorDialog.showModal();
      els.errorDialog.focus();
    } catch (error) {
      showToast(els.errorDialogMessage.textContent || "图标修复完成");
    }
  });
}

async function repairBookmarkIconsSequential(targets = [], options = {}) {
  const { force = false, label = "图标" } = options;
  const finalTargets = targets.filter((item) => item?.id && item?.url);

  if (!finalTargets.length) {
    showToast("没有需要修复的图标");
    return;
  }

  let success = 0;
  let skipped = 0;
  const failures = [];

  pauseRealtime();

  try {
    for (let index = 0; index < finalTargets.length; index += 1) {
      const item = finalTargets[index];
      showToast(`正在修复${label} ${index + 1}/${finalTargets.length}：${item.title || "未命名"}`);

      const result = await fetchBookmarkIconWithEdge(item.id, item.url, { force, debug: true });

      if (result.error || result.data?.ok === false) {
        const reason = getIconRepairErrorMessage(result.data, result.error);
        const attempts = getIconRepairAttemptSummary(result.data);
        failures.push({
          title: item.title || item.url || "未命名书签",
          url: item.url || "",
          reason,
          attempts,
        });
        console.warn("图标修复失败：", item.title, result.error || result.data);
      } else if (result.data?.skipped) {
        skipped += 1;
      } else {
        success += 1;
      }

      await wait(800);
    }
  } finally {
    await loadAllData({ quiet: true, renderAfter: true });
    resumeRealtimeSoon(1200);
  }

  showIconRepairResultDialog({
    success,
    skipped,
    failures,
    total: finalTargets.length,
    label,
  });
}

async function repairMissingBookmarkIcons() {
  if (!isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  const summary = getIconRepairSummary();
  const targets = getIconRepairTargets("missing");

  if (!targets.length) {
    showToast("所有书签都已经有 Storage 图标");
    return;
  }

  const confirmed = window.confirm(
    `准备修复缺失图标：${targets.length} 个\n\n总书签：${summary.total}\n已有 Storage 图标：${summary.ready}\n缺失 / 旧外链图标：${summary.missing}\n失败记录：${summary.failed}\n\n修复过程会逐个调用 Edge Function，并强制把旧外链图标重新缓存到 Supabase Storage；不会请求前端外部 favicon。`
  );

  if (!confirmed) return;

  await repairBookmarkIconsSequential(targets, { force: true, label: "缺失图标" });
}

async function refreshBookmarkIcon(id) {
  const item = bookmarks.find((bookmark) => String(bookmark.id) === String(id));
  if (!item) {
    showToast("没有找到这个书签", "error");
    return;
  }

  showToast(`正在修复图标：${item.title}`);
  const result = await fetchBookmarkIconWithEdge(item.id, item.url, { force: true });

  if (result.error || result.data?.ok === false) {
    showToast(result.error?.message || result.data?.error || "图标修复失败", "error");
    return;
  }

  await loadAllData({ quiet: true, renderAfter: true });
  showToast("图标已更新");
}

async function batchRefreshIcons() {
  if (!isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  const selectedItems = getSelectedBookmarks().filter((item) => item?.url);

  if (!selectedItems.length) {
    showToast("请先选择要修复图标的书签", "error");
    return;
  }

  const confirmed = window.confirm(`确定强制重新修复选中的 ${selectedItems.length} 个图标吗？`);
  if (!confirmed) return;

  await repairBookmarkIconsSequential(selectedItems, { force: true, label: "选中图标" });
}

function pickLocalIconFile() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.ico";
    input.className = "hidden";

    input.addEventListener("change", () => {
      const file = input.files?.[0] || null;
      input.remove();
      resolve(file);
    }, { once: true });

    document.body.appendChild(input);
    input.click();
  });
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result || "");
      resolve(value.includes(",") ? value.split(",").pop() : value);
    };
    reader.onerror = () => reject(reader.error || new Error("读取文件失败"));
    reader.readAsDataURL(file);
  });
}

async function uploadBookmarkIcon(id) {
  if (!isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  const item = bookmarks.find((bookmark) => String(bookmark.id) === String(id));
  if (!item) {
    showToast("没有找到这个书签", "error");
    return;
  }

  const file = await pickLocalIconFile();
  if (!file) return;

  const maxSize = 1024 * 1024 * 1.5;
  if (file.size > maxSize) {
    showToast("图标文件太大，请控制在 1.5MB 以内", "error");
    return;
  }

  if (!supabase) {
    const client = await ensureSupabaseClient({ timeout: SUPABASE_CLIENT_QUICK_TIMEOUT, silent: true });
    if (!client) {
      showToast("连接 Supabase 失败", "error");
      return;
    }
  }

  try {
    showToast(`正在上传图标：${item.title || "未命名"}`);
    const fileBase64 = await readFileAsBase64(file);

    const result = await withTimeout(
      supabase.functions.invoke(ICON_EDGE_FUNCTION_NAME, {
        body: {
          mode: "upload",
          bookmark_id: item.id,
          url: item.url,
          file_name: file.name || "manual-icon.png",
          content_type: file.type || "application/octet-stream",
          file_base64: fileBase64,
          force: true,
        },
      }),
      45000,
      "上传图标"
    );

    if (result.error || result.data?.ok === false) {
      const message = getIconRepairErrorMessage(result.data, result.error);
      showErrorDialog(
        "图标上传失败",
        message || "上传图标没有完成。",
        getIconRepairAttemptSummary(result.data),
        "请确认文件是 png、jpg、webp、svg 或 ico，且大小不超过 1.5MB。"
      );
      return;
    }

    const nextIconUrl = String(result.data?.icon_url || "").trim();
    if (!isSupabaseStorageIconUrl(nextIconUrl)) {
      showToast("上传成功但返回地址异常", "error");
      return;
    }

    forgetBrokenIcon(item.id, nextIconUrl);
    await updateBookmarkIconCache(item.id, {
      icon_url: nextIconUrl,
      icon_status: "success",
      icon_checked_at: new Date().toISOString(),
      icon_storage_path: result.data.icon_storage_path || null,
    });

    await loadAllData({ quiet: true, renderAfter: true });
    showToast("图标已上传并缓存到 Storage");
  } catch (error) {
    showErrorDialog("图标上传失败", getReadableError(error), "", "请稍后重试，或检查 Edge Function 是否已经部署 v8。由前端直接上传到 Storage 的方式未使用，Service Role 仍只在 Edge Function 内部。 ");
  }
}


function getLinkCheckTargets() {
  return getFilteredBookmarks()
    .filter((item) => item?.url)
    .slice(0, 150);
}

function getLinkStatusMeta(result = {}) {
  const status = String(result.status || "unknown");
  const httpStatus = Number(result.http_status || 0);

  if (status === "ok") return { label: "正常", level: "ok" };
  if (status === "redirect") return { label: "跳转", level: "ok" };
  if (status === "blocked" || httpStatus === 401 || httpStatus === 403) return { label: "受限", level: "warn" };
  if (status === "not_found" || httpStatus === 404 || httpStatus === 410) return { label: "失效", level: "bad" };
  if (status === "timeout") return { label: "超时", level: "bad" };
  if (status === "network_error") return { label: "网络错误", level: "bad" };
  return { label: "未知", level: "warn" };
}

function getLinkCheckMessage(result = {}) {
  const status = Number(result.http_status || 0);
  const statusText = result.status_text ? ` ${result.status_text}` : "";
  const error = result.error ? String(result.error) : "";
  const finalUrl = result.final_url && result.final_url !== result.url ? ` → ${result.final_url}` : "";

  if (status) return `HTTP ${status}${statusText}${finalUrl}`;
  return error || "没有返回有效状态";
}

async function invokeLinkCheck(item) {
  const response = await withTimeout(
    supabase.functions.invoke(LINK_CHECK_EDGE_FUNCTION_NAME, {
      body: {
        bookmark_id: item.id,
        title: item.title,
        url: item.url,
      },
    }),
    26000,
    "检查链接"
  );

  if (response.error) {
    return {
      bookmark_id: item.id,
      title: item.title,
      url: item.url,
      status: "network_error",
      error: response.error.message || getReadableError(response.error),
    };
  }

  return {
    bookmark_id: item.id,
    title: item.title,
    url: item.url,
    ...(response.data || {}),
  };
}

function showLinkCheckResultDialog(results = []) {
  const ok = results.filter((item) => getLinkStatusMeta(item).level === "ok");
  const warn = results.filter((item) => getLinkStatusMeta(item).level === "warn");
  const bad = results.filter((item) => getLinkStatusMeta(item).level === "bad");
  const problemItems = [...bad, ...warn].slice(0, 40);

  if (!els.errorDialog) {
    showToast(`检查完成：正常 ${ok.length}，异常 ${bad.length}，受限 ${warn.length}`);
    return;
  }

  els.errorDialogTitle.textContent = bad.length ? "链接检查完成" : "链接状态良好";
  els.errorDialogMessage.textContent = `共检查 ${results.length} 个书签：正常/跳转 ${ok.length} 个，受限 ${warn.length} 个，可能失效 ${bad.length} 个。`;

  const rows = problemItems.map((item) => {
    const meta = getLinkStatusMeta(item);
    return `
      <div class="link-check-row link-check-${escapeAttr(meta.level)}">
        <div class="link-check-main">
          <strong>${escapeHtml(item.title || "未命名书签")}</strong>
          <span>${escapeHtml(item.url || "")}</span>
        </div>
        <div class="link-check-status">
          <em>${escapeHtml(meta.label)}</em>
          <small>${escapeHtml(getLinkCheckMessage(item))}</small>
        </div>
      </div>
    `;
  }).join("");

  els.errorDialogDetail.innerHTML = `
    <div class="link-check-summary-grid">
      <div><strong>${ok.length}</strong><span>正常 / 跳转</span></div>
      <div><strong>${warn.length}</strong><span>受限</span></div>
      <div><strong>${bad.length}</strong><span>可能失效</span></div>
    </div>
    ${problemItems.length ? `<div class="link-check-list">${rows}</div>` : `<p class="link-check-empty">没有发现明显失效链接。</p>`}
  `;
  els.errorDialogDetail.classList.remove("hidden");

  els.errorDialogFix.innerHTML = bad.length
    ? "404 / 410 / 超时通常需要手动检查或删除；403 / 401 多数是网站限制服务器访问，不一定真的失效。"
    : "当前检测结果正常。部分网站可能会限制服务器检测，实际仍以浏览器打开为准。";
  els.errorDialogFix.classList.remove("hidden");

  requestAnimationFrame(() => {
    try {
      if (els.errorDialog.open) els.errorDialog.close();
      els.errorDialog.showModal();
      els.errorDialog.focus();
    } catch {
      showToast(els.errorDialogMessage.textContent || "链接检查完成");
    }
  });
}

// =========================
// 13. 链接检测：通过 Edge Function 检查当前可见书签
// =========================
async function checkVisibleBookmarkLinks() {
  if (!isAdmin()) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  if (!supabase) {
    const client = await ensureSupabaseClient({ timeout: SUPABASE_CLIENT_QUICK_TIMEOUT, silent: true });
    if (!client) {
      showToast("连接 Supabase 失败", "error");
      return;
    }
  }

  const targets = getLinkCheckTargets();
  if (!targets.length) {
    showToast("当前没有可以检查的链接", "error");
    return;
  }

  const confirmed = window.confirm(`准备检查当前范围内 ${targets.length} 个链接。\n\n检测会逐个调用 Supabase Edge Function，不会在前端直接请求目标网站。是否继续？`);
  if (!confirmed) return;

  linkCheckInProgress = true;
  updateLinkCheckButtonState();
  showToast(`开始检查 ${targets.length} 个链接...`);

  const results = [];

  try {
    for (let index = 0; index < targets.length; index += 1) {
      const item = targets[index];
      const button = els.checkLinkBtn || document.getElementById("checkLinkBtn");
      if (button) button.textContent = `检查 ${index + 1}/${targets.length}`;

      try {
        const result = await invokeLinkCheck(item);
        results.push(result);
      } catch (error) {
        results.push({
          bookmark_id: item.id,
          title: item.title,
          url: item.url,
          status: "network_error",
          error: getReadableError(error),
        });
      }

      await wait(280);
    }
  } finally {
    linkCheckInProgress = false;
    updateLinkCheckButtonState();
  }

  showLinkCheckResultDialog(results);
}


function getSelectedBookmarks() {
  const selected = new Set([...selectedBookmarkIds].map(String));
  return bookmarks.filter((item) => selected.has(String(item.id)));
}

function pruneBatchSelection() {
  const existingIds = new Set(bookmarks.map((item) => String(item.id)));
  selectedBookmarkIds = new Set([...selectedBookmarkIds].filter((id) => existingIds.has(String(id))));
}

// =========================
// 14. 批量管理：批量分组、置顶、删除、导出
// =========================
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

  if (batchMode && bookmarkSortMode) {
    bookmarkSortMode = null;
    resumeRealtimeSoon(500);
  }

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

async function saveBatchCategoryChange(event) {
  event?.preventDefault?.();

  if (!supabase || !isAdmin() || !batchMode) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  if (!selectedBookmarkIds.size) {
    showToast("请先选择要处理的书签", "error");
    return;
  }

  const mode = els.batchCategoryMode?.value || "add";
  const categoryIds = getSelectedBatchCategoryIds();

  if (!categoryIds.length) {
    showToast("请至少选择一个分组", "error");
    return;
  }

  if (els.batchCategorySaveBtn) {
    els.batchCategorySaveBtn.disabled = true;
    els.batchCategorySaveBtn.classList.add("is-loading");
  }

  try {
    if (mode === "remove") {
      await batchRemoveCategories(categoryIds);
    } else if (mode === "replace") {
      await batchReplaceCategories(categoryIds);
    } else {
      await batchAddCategories(categoryIds);
    }

    if (els.batchCategoryDialog?.open) {
      els.batchCategoryDialog.close();
    }
  } finally {
    if (els.batchCategorySaveBtn) {
      els.batchCategorySaveBtn.disabled = false;
      els.batchCategorySaveBtn.classList.remove("is-loading");
    }
  }
}

async function batchDeleteSelectedBookmarks() {
  if (!supabase || !isAdmin() || !batchMode) {
    showToast(t("toast.noPermission"), "error");
    return;
  }

  const selectedItems = getSelectedBookmarks();
  const ids = selectedItems.map((item) => String(item.id)).filter(Boolean);

  if (!ids.length) {
    showToast("请先选择要删除的书签", "error");
    return;
  }

  const confirmed = window.confirm(`确定把选中的 ${ids.length} 个书签移入回收站吗？`);
  if (!confirmed) return;

  ids.forEach((id) => {
    const card = els.bookmarkGrid?.querySelector(`[data-card-id="${CSS.escape(id)}"]`);
    card?.classList.add("is-removing");
  });

  await wait(180);
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
    handleOperationError(error, "批量删除失败", "移动到回收站时出错。请确认 bookmarks 表存在 is_deleted、deleted_at、is_active 字段，并且管理员 RLS 允许更新。", { dialog: true });
    return;
  }

  ids.forEach((id) => selectedBookmarkIds.delete(id));
  showToast(`已将 ${ids.length} 个书签移入回收站`);
  await loadBookmarks({ quiet: true });
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



function buildExportPayload(selectedItems = bookmarks) {
  const normalizedItems = (selectedItems || []).map((item) => ({
    title: item.title || "",
    url: item.url || "",
    description: item.description || "",
    category: item.category || "",
    categories: getBookmarkCategories(item),
    category_names: getBookmarkCategories(item),
    is_pinned: Boolean(item.is_pinned),
    sort_order: Number.isFinite(Number(item.sort_order)) ? Number(item.sort_order) : 0,
    open_count: Number.isFinite(Number(item.open_count)) ? Number(item.open_count) : 0,
  }));

  return {
    version: 2,
    exported_at: new Date().toISOString(),
    app: "bookmark-hub",
    total: normalizedItems.length,
    categories: getSelectableCategories().map((category) => ({
      name: category.name || "",
      icon: normalizeCategoryIcon(category.icon, category.name),
      sort_order: Number.isFinite(Number(category.sort_order)) ? Number(category.sort_order) : 0,
    })),
    bookmarks: normalizedItems,
  };
}

function getExportDateSuffix() {
  return new Date().toISOString().slice(0, 10);
}

function exportBookmarksJson(selectedItems = bookmarks, filename = `bookmark-hub-backup-${new Date().toISOString().slice(0, 10)}.json`) {
  const payload = buildExportPayload(selectedItems);
  createDownload(filename, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
  showToast("JSON 已导出");
}

function exportBookmarksCsv(selectedItems = bookmarks) {
  const header = ["title", "url", "description", "categories", "is_pinned"];
  const rows = selectedItems.map((item) => [
    item.title,
    item.url,
    item.description || "",
    getBookmarkCategories(item).join(" | "),
    item.is_pinned ? "true" : "false",
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\n");

  createDownload(`bookmark-hub-${new Date().toISOString().slice(0, 10)}.csv`, csv, "text/csv;charset=utf-8");
  showToast("CSV 已导出");
}

function exportSelectedBookmarks() {
  if (!selectedBookmarkIds.size) {
    showToast("请先选择要导出的书签", "error");
    return;
  }

  const selectedItems = getSelectedBookmarks();

  if (!selectedItems.length) {
    showToast("没有可导出的书签", "error");
    return;
  }

  const filename = `bookmark-hub-selected-${selectedItems.length}-${getExportDateSuffix()}.json`;
  exportBookmarksJson(selectedItems, filename);
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
    () => supabase.from("bookmarks").select("id,title,url,description,category,is_pinned,is_active,created_at,icon_url,icon_status,icon_checked_at,icon_storage_path").limit(1),
    "bookmarks 表字段完整。",
    "缺字段时请确认 bookmarks 表至少包含 id、title、url、description、category、is_pinned、is_active、created_at，以及 icon_url、icon_status、icon_checked_at、icon_storage_path。"
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


// 已清理：importBookmarksFromFile 是旧版本遗留函数，当前流程不再调用。

// =========================
// 15. 导入导出：JSON / CSV / 浏览器书签 HTML
// =========================
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

// =========================
// 16. 数据读取：文案、用户会话、书签、分组、关联表
// =========================
async function loadSiteTexts() {
  const allDefaults = getDefaultTextObjects();
  const defaultTextMap = new Map(allDefaults.map((row) => [row.key, row.value]));
  const editableMap = new Map(getEditableTextObjects().map((row) => [row.key, row]));

  if (!isConfigured) {
    siteTextRows = [...editableMap.values()];
    texts = Object.fromEntries(allDefaults.map((row) => [row.key, row.value]));
    applySiteTexts();
    return;
  }

  if (!supabase) {
    const client = await ensureSupabaseClient({ timeout: SUPABASE_CLIENT_QUICK_TIMEOUT, silent: true });
    if (!client) {
      siteTextRows = [...editableMap.values()];
      texts = { ...texts, ...Object.fromEntries(allDefaults.map((row) => [row.key, row.value])) };
      applySiteTexts();
      return;
    }
  }

  let { data, error } = await runSupabaseQuery(
    supabase
      .from("site_texts")
      .select("key,value,description")
      .in("key", EDITABLE_TEXT_KEY_LIST)
      .order("key", { ascending: true }),
    "读取页面文案",
    TEXT_REQUEST_TIMEOUT
  );

  if (error && getReadableError(error).toLowerCase().includes("description")) {
    const fallbackResult = await runSupabaseQuery(
      supabase
        .from("site_texts")
        .select("key,value")
        .in("key", EDITABLE_TEXT_KEY_LIST)
        .order("key", { ascending: true }),
      "读取基础页面文案",
      TEXT_REQUEST_TIMEOUT
    );

    data = fallbackResult.data;
    error = fallbackResult.error;
  }

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
  saveAppCache();
}

async function saveSiteTextRowsWithFallback(rows) {
  const fullRows = rows.map((row) => ({
    key: row.key,
    value: row.value,
    description: row.description,
  }));
  const simpleRows = rows.map((row) => ({
    key: row.key,
    value: row.value,
  }));

  const trySaveRows = async (targetRows) => {
    const upsertResult = await supabase
      .from("site_texts")
      .upsert(targetRows, { onConflict: "key" });

    if (!upsertResult.error) {
      return { error: null };
    }

    for (const row of targetRows) {
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
  };

  const fullResult = await trySaveRows(fullRows);
  if (!fullResult.error) return fullResult;

  const message = getReadableError(fullResult.error).toLowerCase();
  if (message.includes("description") || message.includes("column")) {
    return trySaveRows(simpleRows);
  }

  return fullResult;
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

  if (!isConfigured) return;

  if (!supabase) {
    const client = await ensureSupabaseClient({ timeout: SUPABASE_CLIENT_QUICK_TIMEOUT, silent: true });
    if (!client) return;
  }

  const { data, error } = await runSupabaseQuery(supabase.auth.getSession(), "读取登录状态", AUTH_REQUEST_TIMEOUT);

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

  if (!isConfigured) {
    bookmarks = [];
    bookmarksDataSignature = "";
    els.setupNotice.classList.remove("hidden");
    setRealtimeStatus("error", t("sync.notConfigured"));
    if (renderAfter) safeRender(quiet);
    return true;
  }

  if (!supabase) {
    const client = await ensureSupabaseClient({ timeout: SUPABASE_CLIENT_QUICK_TIMEOUT, silent: true });
    if (!client) return false;
  }

  const enhancedSelect = [
    "id",
    "title",
    "url",
    "description",
    "category",
    "is_pinned",
    "is_deleted",
    "deleted_at",
    "is_active",
    "created_at",
    "icon_url",
    "icon_status",
    "icon_checked_at",
    "icon_storage_path",
  ].join(",");

  const baseSelect = [
    "id",
    "title",
    "url",
    "description",
    "category",
    "is_active",
    "sort_order",
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
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    "读取书签"
  );

  data = enhancedResult.data;
  error = enhancedResult.error;

  // 如果 is_pinned / is_deleted 等新字段暂时没有进入 PostgREST schema cache，退回最小字段读取。
  // 只读取 Supabase Storage 缓存图标字段，不再触发任何前端外部 favicon 请求。
  if (error && shouldTrySchemaFallback(error)) {
    enhancedFieldsAvailable = false;
    console.warn("enhanced bookmarks query failed, fallback to minimal query", error);

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
    setRealtimeStatus("error", t("sync.readError"));
    handleOperationError(
      error,
      "读取书签失败",
      "前端已自动尝试新结构、旧结构和最小字段读取，但仍然失败。请确认 bookmarks 表存在 id、title、url、description、category、is_active、created_at 字段，且 anon 角色拥有读取权限。",
      { dialog: !initialRemoteLoading }
    );
    return false;
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
        icon_url: item.icon_url || "",
        icon_status: item.icon_status || "",
        icon_checked_at: item.icon_checked_at || null,
        icon_storage_path: item.icon_storage_path || null,
        is_pinned: Boolean(item.is_pinned),
        sort_order: Number.isFinite(Number(item.sort_order)) ? Number(item.sort_order) : 0,
        is_deleted: Boolean(item.is_deleted),
        deleted_at: item.deleted_at || null,
        category_ids: uniqueIds(linkedCategories.map((category) => category.id).filter(Boolean)),
        category_names: uniqueCategoryNames(linkedCategories.map((category) => category.name)),
      };
    }).sort((a, b) => {
      const pa = a.is_pinned ? 1 : 0;
      const pb = b.is_pinned ? 1 : 0;
      if (pa !== pb) return pb - pa;

      const sa = Number(a.sort_order ?? 0);
      const sb = Number(b.sort_order ?? 0);
      if (sa !== sb) return sa - sb;

      return String(b.created_at || "").localeCompare(String(a.created_at || ""));
    });

  const nextSignature = getBookmarksDataSignature(nextRows);
  const changed = nextSignature !== bookmarksDataSignature;

  bookmarks = nextRows;
  bookmarksDataSignature = nextSignature;
  saveAppCache();

  if (changed && renderAfter) {
    safeRender(quiet);
  }

  return changed;
}

async function loadCategories(options = {}) {
  const { renderAfter = true, quiet = true } = options;

  if (!isConfigured) {
    categories = [];
    categoriesDataSignature = "";
    if (renderAfter) safeRender(quiet);
    return true;
  }

  if (!supabase) {
    const client = await ensureSupabaseClient({ timeout: SUPABASE_CLIENT_QUICK_TIMEOUT, silent: true });
    if (!client) return false;
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
  if (error && shouldTrySchemaFallback(error)) {
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
    setRealtimeStatus("error", t("sync.readError"));
    handleOperationError(
      error,
      "读取分组失败",
      "请确认 categories 表存在 id、name、sort_order、is_active、created_at 字段，并且 anon 角色拥有读取权限。",
      { dialog: !initialRemoteLoading }
    );
    return false;
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
  saveAppCache();

  if (changed && renderAfter) {
    safeRender(quiet);
  }

  return changed;
}


function normalizeCategoryRows(rawRows = []) {
  return (rawRows ?? [])
    .filter((category) => category?.name && !isReservedCategoryName(category.name))
    .map((category) => ({
      ...category,
      icon: normalizeCategoryIcon(category.icon, category.name),
    }));
}

function normalizeBookmarkRows(rawRows = [], linkRows = [], categoryRows = categories) {
  const categoryById = new Map((categoryRows || []).map((category) => [String(category.id), category]));
  const categoriesByName = new Map((categoryRows || []).map((category) => [normalizeCategoryName(category.name).toLowerCase(), category]));
  const linksByBookmarkId = new Map();

  for (const link of linkRows ?? []) {
    const bookmarkId = String(link.bookmark_id || "");
    const categoryId = String(link.category_id || "");
    if (!bookmarkId || !categoryId) continue;
    const arr = linksByBookmarkId.get(bookmarkId) || [];
    arr.push(categoryId);
    linksByBookmarkId.set(bookmarkId, arr);
  }

  return (rawRows ?? [])
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
        icon_url: item.icon_url || "",
        icon_status: item.icon_status || "",
        icon_checked_at: item.icon_checked_at || null,
        icon_storage_path: item.icon_storage_path || null,
        is_pinned: Boolean(item.is_pinned),
        sort_order: Number.isFinite(Number(item.sort_order)) ? Number(item.sort_order) : 0,
        is_deleted: Boolean(item.is_deleted),
        deleted_at: item.deleted_at || null,
        category_ids: uniqueIds(linkedCategories.map((category) => category.id).filter(Boolean)),
        category_names: uniqueCategoryNames(linkedCategories.map((category) => category.name)),
      };
    })
    .sort((a, b) => {
      const pa = a.is_pinned ? 1 : 0;
      const pb = b.is_pinned ? 1 : 0;
      if (pa !== pb) return pb - pa;

      const sa = Number(a.sort_order ?? 0);
      const sb = Number(b.sort_order ?? 0);
      if (sa !== sb) return sa - sb;

      return String(b.created_at || "").localeCompare(String(a.created_at || ""));
    });
}

async function queryCategoryRowsFast() {
  let result = await runSupabaseQuery(
    supabase
      .from("categories")
      .select("id,name,icon,sort_order,is_active,created_at")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    "读取分组",
    DB_REQUEST_TIMEOUT
  );

  if (result.error && shouldTrySchemaFallback(result.error)) {
    result = await runSupabaseQuery(
      supabase
        .from("categories")
        .select("id,name,sort_order,is_active,created_at")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      "读取基础分组",
      DB_REQUEST_TIMEOUT
    );
  }

  return result;
}

async function queryBookmarkRowsFast() {
  let result = await runSupabaseQuery(
    supabase
      .from("bookmarks")
      .select("id,title,url,description,category,is_pinned,is_deleted,deleted_at,is_active,sort_order,created_at,icon_url,icon_status,icon_checked_at,icon_storage_path")
      .eq("is_active", true)
      .or("is_deleted.is.null,is_deleted.eq.false")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    "读取书签",
    DB_REQUEST_TIMEOUT
  );

  if (result.error && shouldTrySchemaFallback(result.error)) {
    result = await runSupabaseQuery(
      supabase
        .from("bookmarks")
        .select("id,title,url,description,category,is_active,created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false }),
      "读取最小书签",
      DB_REQUEST_TIMEOUT
    );
  }

  return result;
}

async function queryBookmarkLinksFast() {
  const result = await runSupabaseQuery(
    supabase
      .from("bookmark_categories")
      .select("bookmark_id,category_id"),
    "读取书签分组关联",
    Math.min(DB_REQUEST_TIMEOUT, 9000)
  );

  if (result.error) {
    console.warn("bookmark_categories read failed, fallback to bookmarks.category", result.error);
    return { data: [], error: result.error };
  }

  return result;
}

// 一次性读取书签、分组、关联关系；读取慢时会优先显示缓存。
async function loadAllData(options = {}) {
  const { quiet = true, renderAfter = true } = options;

  if (isConfigured && !supabase) {
    const client = await ensureSupabaseClient({ timeout: SUPABASE_CLIENT_QUICK_TIMEOUT, silent: true });
    if (!client) {
      setRealtimeStatus("error", "连接较慢");
      return false;
    }
  }

  // 快速读取：分组、书签、关联表并发请求，减少 Supabase 慢网络下的串行等待。
  // 只读取 Storage 缓存图标字段，不在前端请求任何 favicon 外链。
  const [categoryResult, bookmarkResult, linkResult] = await Promise.all([
    queryCategoryRowsFast(),
    queryBookmarkRowsFast(),
    queryBookmarkLinksFast(),
  ]);

  let changed = false;

  if (categoryResult.error) {
    setRealtimeStatus("error", t("sync.partial"));
    handleOperationError(
      categoryResult.error,
      "读取分组失败",
      "页面会继续显示缓存或书签数据，后台会自动重试。请确认 categories 表权限和网络状态。",
      { dialog: !initialRemoteLoading }
    );
  } else {
    const nextCategories = normalizeCategoryRows(categoryResult.data);
    const nextCategorySignature = getCategoriesDataSignature(nextCategories);
    if (nextCategorySignature !== categoriesDataSignature) {
      categories = nextCategories;
      categoriesDataSignature = nextCategorySignature;
      changed = true;
    }
  }

  if (bookmarkResult.error) {
    setRealtimeStatus("error", t("sync.readError"));
    handleOperationError(
      bookmarkResult.error,
      "读取书签失败",
      "页面会继续显示本地缓存，后台会自动重试。请确认 bookmarks 表权限和网络状态。",
      { dialog: !initialRemoteLoading }
    );
  } else {
    if (linkResult.error) {
      setRealtimeStatus("error", t("sync.partial"));
    }

    const nextBookmarks = normalizeBookmarkRows(bookmarkResult.data, linkResult.data || [], categories);
    const nextBookmarkSignature = getBookmarksDataSignature(nextBookmarks);
    if (nextBookmarkSignature !== bookmarksDataSignature) {
      bookmarks = nextBookmarks;
      bookmarksDataSignature = nextBookmarkSignature;
      changed = true;
    }
  }

  saveAppCache();

  if (renderAfter && changed) {
    safeRender(quiet);
  }

  return !categoryResult.error || !bookmarkResult.error;
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

      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        setRealtimeStatus("error", t("sync.readError"));
        setTimeout(() => {
          if (!realtimePaused) subscribeRealtime();
        }, 2200);
      }

      if (status === "CLOSED" && !realtimePaused) {
        setRealtimeStatus("error", t("sync.partial"));
        setTimeout(() => {
          if (!realtimePaused) subscribeRealtime();
        }, 2800);
      }
    });

  realtimeChannels = [realtimeChannel];
}

// =========================
// 17. 数据写入：新增/编辑/删除书签、回收站、分组
// =========================
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
  const existingBookmark = id
    ? bookmarks.find((item) => String(item.id) === String(id))
    : null;
  const normalizedUrl = normalizeUrl(els.urlInput.value);
  const urlChanged = !existingBookmark || normalizedUrlKey(existingBookmark.url) !== normalizedUrlKey(normalizedUrl);

  const payload = {
    title: els.titleInput.value.trim(),
    url: normalizedUrl,
    description: els.descriptionInput.value.trim(),
    ...categoryPayload,
    is_deleted: false,
    deleted_at: null,
    is_active: true,
  };

  if (!id) {
    const maxSort = Math.max(0, ...bookmarks.map((item) => Number(item.sort_order ?? 0)).filter(Number.isFinite));
    payload.sort_order = maxSort + 10;
  }

  if (urlChanged) {
    Object.assign(payload, {
      icon_url: null,
      icon_status: "pending",
      icon_checked_at: null,
      icon_storage_path: null,
    });
  }

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

function openBookmarkById(id) {
  const item = bookmarks.find((bookmark) => String(bookmark.id) === String(id));
  if (!item?.url) return;

  window.open(normalizeUrl(item.url), "_blank", "noopener,noreferrer");
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

// =========================
// 18. 登录和主题：管理员登录、退出、日/月模式切换
// =========================
async function login(event) {
  event.preventDefault();

  if (!isConfigured) {
    showToast(t("sync.notConfigured"), "error");
    return;
  }

  if (!supabase) {
    showToast("正在连接数据库，请稍等...", "normal");
    const client = await ensureSupabaseClient({ timeout: SUPABASE_CLIENT_QUICK_TIMEOUT, silent: true });
    if (!client) {
      showToast("数据库连接较慢，请稍后再试", "error");
      return;
    }
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

// =========================
// 19. 事件绑定：所有按钮、快捷键、拖拽、弹窗入口集中在这里
// =========================
function bindEvents() {
  localStorage.removeItem("bookmark-view");
  setBookmarkView("grid", false);
  activateBookmarkIcons();
  ensureCardDensityControlMount();
  ensureLinkCheckControlMount();
  ensureMobileNavMount();

  window.addEventListener("keydown", handleGlobalShortcuts);

  const openLoginDialog = () => els.loginDialog.showModal();
  const handleAdminModeClick = async () => {
    if (currentUser) {
      await logout();
      return;
    }
    openLoginDialog();
  };

  els.loginOpenBtn?.addEventListener("click", handleAdminModeClick);
  els.adminBadge?.addEventListener("click", handleAdminModeClick);
  els.adminModeBtn?.addEventListener("click", handleAdminModeClick);

  els.textOpenBtn.addEventListener("click", openTextDialog);
  els.groupOpenBtn?.addEventListener("click", openCurrentVisibleBookmarks);
  els.importExportBtn?.addEventListener("click", openImportExportDialog);
  els.trashOpenBtn?.addEventListener("click", openTrashDialog);
  els.systemCheckBtn?.addEventListener("click", openSystemCheckDialog);
  els.repairIconBtn?.addEventListener("click", repairMissingBookmarkIcons);
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
  els.logoutBtn?.addEventListener("click", logout);
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

  els.searchInput.addEventListener("input", () => {
    if (bookmarkSortMode) {
      bookmarkSortMode = null;
      resumeRealtimeSoon(500);
    }
    render();
  });
  els.groupFilterSelect?.addEventListener("change", () => {
    selectGroupFilter(els.groupFilterSelect.value || "全部");
  });
  els.groupFilterButton?.addEventListener("click", (event) => {
    event.preventDefault();
    toggleGroupFilterDropdown();
  });
  els.groupFilterMenu?.addEventListener("click", (event) => {
    const option = event.target.closest("[data-group-filter-value]");
    if (!option) return;
    selectGroupFilter(option.dataset.groupFilterValue || "全部");
  });
  document.addEventListener("click", (event) => {
    if (!els.groupFilterDropdown || els.groupFilterDropdown.contains(event.target)) return;
    closeGroupFilterDropdown();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeGroupFilterDropdown();
  });
  els.searchScopeTabs?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-search-scope]");
    if (!button) return;
    setSearchScope(button.dataset.searchScope);
  });

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

  els.bookmarkGrid.addEventListener("dragstart", (event) => {
    if (!isAdmin() || batchMode || !bookmarkSortMode) return;

    const handle = event.target.closest("[data-bookmark-drag]");
    const card = handle?.closest?.(".card[data-card-id]");

    if (!handle || !card || card.dataset.sortSection !== bookmarkSortMode.key) return;

    draggedBookmarkId = String(card.dataset.cardId);
    card.classList.add("dragging");
    document.body.classList.add("is-bookmark-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedBookmarkId);
    closeCardMenus();
  });

  els.bookmarkGrid.addEventListener("dragend", (event) => {
    const card = event.target.closest(".card[data-card-id]") || els.bookmarkGrid.querySelector(".card.dragging");
    card?.classList.remove("dragging");
    draggedBookmarkId = null;
    bookmarkDragSuppressClickUntil = Date.now() + 420;
    document.body.classList.remove("is-bookmark-dragging");
    clearBookmarkDropMarks();
  });

  els.bookmarkGrid.addEventListener("dragover", (event) => {
    if (!isAdmin() || !draggedBookmarkId || batchMode || !bookmarkSortMode) return;

    const card = event.target.closest(".card[data-card-id]");
    if (!card || String(card.dataset.cardId) === String(draggedBookmarkId) || card.dataset.sortSection !== bookmarkSortMode.key) return;

    event.preventDefault();
    clearBookmarkDropMarks();

    const position = getBookmarkDragPosition(event, card);
    card.classList.add(position === "before" ? "drop-before" : "drop-after");
  });

  els.bookmarkGrid.addEventListener("drop", (event) => {
    if (!isAdmin() || !draggedBookmarkId || batchMode || !bookmarkSortMode) return;

    const card = event.target.closest(".card[data-card-id]");
    if (!card || String(card.dataset.cardId) === String(draggedBookmarkId) || card.dataset.sortSection !== bookmarkSortMode.key) return;

    event.preventDefault();
    const position = card.classList.contains("drop-after") ? "after" : "before";
    const sourceId = String(draggedBookmarkId);
    clearBookmarkDropMarks();
    draggedBookmarkId = null;
    bookmarkDragSuppressClickUntil = Date.now() + 420;
    document.body.classList.remove("is-bookmark-dragging");

    if (reorderBookmarkDraft(sourceId, card.dataset.cardId, position)) {
      render();
    }
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
    if (Date.now() < bookmarkDragSuppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const sortActionBtn = event.target.closest("[data-sort-action]");
    if (sortActionBtn) {
      event.preventDefault();
      event.stopPropagation();
      const action = sortActionBtn.dataset.sortAction;
      const sectionKey = sortActionBtn.dataset.sortSection || "normal";
      if (action === "start") startBookmarkSortMode(sectionKey);
      if (action === "cancel") cancelBookmarkSortMode();
      if (action === "save") await saveBookmarkSortMode();
      return;
    }

    const sortMoveBtn = event.target.closest("[data-sort-move]");
    if (sortMoveBtn) {
      event.preventDefault();
      event.stopPropagation();
      moveBookmarkInDraft(sortMoveBtn.dataset.sortId, sortMoveBtn.dataset.sortMove);
      return;
    }

    const dragHandle = event.target.closest("[data-bookmark-drag]");
    if (dragHandle) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

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
    const pinBtn = event.target.closest("[data-pin]");
    const editBtn = event.target.closest("[data-edit]");
    const copyLinkBtn = event.target.closest("[data-copy-link]");
    const refreshIconBtn = event.target.closest("[data-refresh-icon]");
    const uploadIconBtn = event.target.closest("[data-upload-icon]");
    const deleteBtn = event.target.closest("[data-delete]");
    const card = event.target.closest(".card[data-card-id]");

    if (menuToggle) {
      event.preventDefault();
      event.stopPropagation();
      toggleCardMenu(menuToggle);
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

    if (refreshIconBtn) {
      event.preventDefault();
      event.stopPropagation();
      closeCardMenus();
      await refreshBookmarkIcon(refreshIconBtn.dataset.refreshIcon);
      return;
    }

    if (uploadIconBtn) {
      event.preventDefault();
      event.stopPropagation();
      closeCardMenus();
      await uploadBookmarkIcon(uploadIconBtn.dataset.uploadIcon);
      return;
    }

    if (deleteBtn) {
      event.preventDefault();
      event.stopPropagation();
      closeCardMenus();

      await deleteBookmark(deleteBtn.dataset.delete);
      return;
    }

    if (bookmarkSortMode && card) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (card && !event.target.closest("button, a, input, label, textarea, select, .card-menu")) {
      openBookmarkById(card.dataset.cardId);
    }
  });

  els.bookmarkGrid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest(".card[data-card-id]");
    if (!card || batchMode) return;

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

// =========================
// 20. 启动入口：先渲染，再后台连接 Supabase，避免页面空白
// =========================
async function init() {
  initTheme();
  initCardDensity();
  applySiteTexts();
  renderLoadingSkeleton();
  bindEvents();
  initLottieAnimations();

  const hasCache = restoreAppCache();
  if (hasCache) {
    finishInitialPaint(false);
  }

  if (!isConfigured) {
    bookmarks = [];
    categories = [];
    els.setupNotice.classList.remove("hidden");
    setRealtimeStatus("error", t("sync.notConfigured"));
    finishInitialPaint(false);
    return;
  }

  setRealtimeStatus("online", t("sync.connecting"));

  let visibleTimer = null;
  let remoteLoaded = false;
  initialRemoteLoading = true;

  visibleTimer = setTimeout(() => {
    if (remoteLoaded || !isInitialLoading) return;

    setRealtimeStatus("error", "连接较慢，先显示本地页面");
    finishInitialPaint(false);
  }, INITIAL_VISIBLE_TIMEOUT);

  try {
    const client = await ensureSupabaseClient({ timeout: SUPABASE_CLIENT_QUICK_TIMEOUT, silent: true });

    if (!client) {
      throw supabaseLoadError || timeoutError("加载 Supabase 客户端");
    }

    const results = await Promise.allSettled([
      loadSiteTexts(),
      loadAllData({ quiet: false, renderAfter: false }),
    ]);

    loadSession({ renderAfter: true }).catch((error) => {
      console.warn("初始化登录状态读取失败：", error);
    });

    const rejected = results.find((result) => result.status === "rejected");
    const hasDataSuccess = results.some((result) => result.status === "fulfilled" && result.value !== false);

    if (rejected || !hasDataSuccess) {
      console.error("init task failed", rejected?.reason || "no data task success");
      setRealtimeStatus("error", t("sync.partial"));
      handleOperationError(
        rejected?.reason || new Error("初始化数据读取暂未成功"),
        "初始化部分失败",
        "页面已经先显示出来，后台会自动继续重试数据库连接，不需要反复强制刷新。",
        { dialog: false }
      );
      retryRemoteLoadSoon(4500);
    } else {
      remoteRetryCount = 0;
      setRealtimeStatus("online", t("sync.online"));
    }
  } catch (error) {
    console.error("init timeout or failed", error);
    setRealtimeStatus("error", "连接较慢");
    showToast("数据库连接较慢，页面已先显示本地内容", "error");
    retryRemoteLoadSoon(4500);
  } finally {
    remoteLoaded = true;
    initialRemoteLoading = false;
    clearTimeout(visibleTimer);
    finishInitialPaint(false);
    subscribeRealtime();
  }
}

init();

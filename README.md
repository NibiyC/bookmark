# 云端收藏夹 Bookmark Hub

这是一个基于 **GitHub Pages + Supabase** 的实时同步收藏夹网站。

## 功能

- 公开浏览收藏
- 搜索标题、描述、分类、标签
- 分类筛选
- 管理员登录后新增、编辑、删除
- Supabase Realtime 实时同步
- 浅色 / 深色模式
- 响应式布局，手机和电脑都能用

## 一、创建 Supabase 项目

1. 进入 https://supabase.com
2. 创建新项目
3. 打开 SQL Editor
4. 打开本项目里的 `supabase.sql`
5. 把所有 `YOUR_ADMIN_EMAIL@example.com` 替换成你的管理员邮箱
6. 运行 SQL

## 二、创建管理员账号

1. Supabase Dashboard -> Authentication -> Users
2. Add user
3. 邮箱使用你在 SQL 里填写的管理员邮箱
4. 设置密码
5. 确认用户是已验证状态

建议在 Authentication 设置里关闭公开注册，避免别人用你的 anon key 注册账号后尝试写入。

## 三、配置前端

打开 `app.js`，修改：

```js
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_PUBLIC_KEY";
const ADMIN_EMAIL = "you@example.com";
```

注意：

- `SUPABASE_ANON_KEY` 可以放前端。
- `service_role key` 绝对不要放前端。
- 真正的写入权限由 Supabase RLS 控制。

## 四、开启 Realtime

SQL 脚本已经包含：

```sql
alter publication supabase_realtime add table public.bookmarks;
```

如果没有生效，可以到 Supabase Dashboard：

Database -> Replication / Publications -> supabase_realtime -> 打开 `bookmarks` 表。

## 五、部署到 GitHub Pages

1. 新建 GitHub 仓库，例如 `bookmark-hub`
2. 上传本项目所有文件
3. 进入仓库 Settings -> Pages
4. Source 选择 `Deploy from a branch`
5. Branch 选择 `main`
6. Folder 选择 `/root`
7. 保存
8. 访问生成的 GitHub Pages 链接

地址通常是：

```text
https://你的用户名.github.io/bookmark-hub/
```

## 文件说明

```text
bookmark-hub/
├─ index.html       页面结构
├─ style.css        页面样式
├─ app.js           前端逻辑 + Supabase 连接
├─ supabase.sql     数据库表、RLS、Realtime 初始化
└─ README.md        部署说明
```

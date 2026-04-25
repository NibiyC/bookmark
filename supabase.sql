-- Bookmark Hub Supabase 初始化脚本
-- 使用方法：
-- 1. 先把下面所有 2565667747@qq.com 替换成你的管理员邮箱
-- 2. 打开 Supabase Dashboard -> SQL Editor
-- 3. 粘贴并运行本脚本
-- 4. 在 Authentication -> Users 里创建同邮箱的用户并设置密码
-- 5. 在 Project Settings -> API 复制 Project URL 和 anon/public key 到 app.js

create extension if not exists pgcrypto;

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) <= 80),
  url text not null check (url ~* '^https?://'),
  description text default '' check (char_length(description) <= 240),
  category text not null default '其他' check (char_length(category) <= 40),
  tags text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookmarks_created_at_idx on public.bookmarks (created_at desc);
create index if not exists bookmarks_category_idx on public.bookmarks (category);
create index if not exists bookmarks_tags_idx on public.bookmarks using gin (tags);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_bookmarks_updated_at on public.bookmarks;

create trigger set_bookmarks_updated_at
before update on public.bookmarks
for each row
execute function public.set_updated_at();

alter table public.bookmarks enable row level security;

drop policy if exists "Anyone can read active bookmarks" on public.bookmarks;
drop policy if exists "Only admin can insert bookmarks" on public.bookmarks;
drop policy if exists "Only admin can update bookmarks" on public.bookmarks;
drop policy if exists "Only admin can delete bookmarks" on public.bookmarks;

create policy "Anyone can read active bookmarks"
on public.bookmarks
for select
to anon, authenticated
using (is_active = true);

create policy "Only admin can insert bookmarks"
on public.bookmarks
for insert
to authenticated
with check (
  (auth.jwt() ->> 'email') = '2565667747@qq.com'
);

create policy "Only admin can update bookmarks"
on public.bookmarks
for update
to authenticated
using (
  (auth.jwt() ->> 'email') = '2565667747@qq.com'
)
with check (
  (auth.jwt() ->> 'email') = '2565667747@qq.com'
);

create policy "Only admin can delete bookmarks"
on public.bookmarks
for delete
to authenticated
using (
  (auth.jwt() ->> 'email') = '2565667747@qq.com'
);

-- 给 Realtime 订阅用。
-- 如果提示 already member of publication，可以忽略。
do $$
begin
  alter publication supabase_realtime add table public.bookmarks;
exception
  when duplicate_object then null;
end $$;

-- 初始示例数据，可按需删除
insert into public.bookmarks (title, url, description, category, tags)
values
  ('ChatGPT', 'https://chatgpt.com', 'AI 对话、写作、编程和学习助手。', 'AI 工具', array['AI', '效率', '写作']),
  ('GitHub', 'https://github.com', '代码托管、开源项目和 GitHub Pages 部署平台。', '开发', array['代码', '开源', '部署']),
  ('Supabase', 'https://supabase.com', 'Postgres 数据库、Auth 和 Realtime 服务。', '开发', array['数据库', '实时', '后端'])
on conflict do nothing;

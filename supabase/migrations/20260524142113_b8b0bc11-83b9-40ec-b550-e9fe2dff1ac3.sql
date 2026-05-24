-- ROLES
create type public.app_role as enum ('admin', 'editor');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'admin',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  )
$$;

create policy "users read own roles"
  on public.user_roles for select to authenticated
  using (auth.uid() = user_id);

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "users read own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = id);
create policy "users update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- PROJECTS
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text,
  year text,
  client text,
  timeline text,
  role text,
  overview text,
  challenge text,
  solution text,
  cover text,
  gallery jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  tech jsonb not null default '[]'::jsonb,
  results jsonb not null default '[]'::jsonb,
  live_url text,
  repo_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create policy "public read published projects"
  on public.projects for select using (published = true);
create policy "admins read all projects"
  on public.projects for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "admins insert projects"
  on public.projects for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "admins update projects"
  on public.projects for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
create policy "admins delete projects"
  on public.projects for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- BLOG POSTS
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  category text,
  cover_image text,
  content text,
  read_time text,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.blog_posts enable row level security;

create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

create policy "public read published posts"
  on public.blog_posts for select using (published = true);
create policy "admins read all posts"
  on public.blog_posts for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "admins insert posts"
  on public.blog_posts for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "admins update posts"
  on public.blog_posts for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
create policy "admins delete posts"
  on public.blog_posts for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- SITE SETTINGS
create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

create policy "public read settings"
  on public.site_settings for select using (true);
create policy "admins insert settings"
  on public.site_settings for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "admins update settings"
  on public.site_settings for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Seed default settings
insert into public.site_settings (key, value) values
  ('hero', '{"name":"Jahid Hasan","tagline":"Design Engineer","intro":"I craft premium digital experiences","avatar":null,"cta_label":"View My Work","cta_url":"/work"}'::jsonb),
  ('about', '{"headline":"","bio":"","image":null,"skills":""}'::jsonb),
  ('contact', '{"email":"hello@jahid.com","phone":"","location":"Dhaka, Bangladesh"}'::jsonb),
  ('social', '{"github":"","twitter":"","linkedin":"","instagram":"","facebook":"","youtube":""}'::jsonb)
on conflict (key) do nothing;

-- STORAGE BUCKET (media)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "admins upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));

create policy "admins update media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));

create policy "admins delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));

-- Lock down SECURITY DEFINER helpers
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
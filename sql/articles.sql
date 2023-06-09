create table public.articles (
  id bigint generated by default as identity primary key,
  title text not null,
  slug text not null unique,
  content1 text not null,
  content2 text not null,
  user_id uuid not null references auth.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create extension if not exists moddatetime schema extensions;

create trigger handle_articles_updated_at before update on public.articles
  for each row execute procedure moddatetime (updated_at);

alter table public.articles enable row level security;

create policy "Enable all actions for users based on user_id" on public.articles
as permissive for all
to public
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Enable read access for all users" on public.articles
as permissive for select
to public
using (true);

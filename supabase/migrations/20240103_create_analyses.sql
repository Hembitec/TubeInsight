-- Create analyses table
create table public.analyses (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    video_id text not null,
    url text not null,
    metadata jsonb not null default '{}',
    analysis jsonb not null default '{}',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.analyses enable row level security;

-- Create policies
create policy "Users can view their own analyses"
    on analyses for select
    using (auth.uid() = user_id);

create policy "Users can insert their own analyses"
    on analyses for insert
    with check (auth.uid() = user_id);

-- Create indexes
create index analyses_user_id_idx on analyses(user_id);
create index analyses_video_id_idx on analyses(video_id);
create index analyses_created_at_idx on analyses(created_at desc);

-- Add updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_analyses_updated_at
    before update on analyses
    for each row
    execute procedure handle_updated_at();

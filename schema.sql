CREATE TABLE public.profiles (
  id uuid PRIMARY KEY NOT NULL REFERENCES auth.users (id),
  first_name VARCHAR CHECK (first_name <> ''),
  last_name VARCHAR CHECK (last_name <> ''),
  email TEXT UNIQUE NOT NULL CHECK (email <> ''),
  username VARCHAR UNIQUE CHECK (username <> ''),
  avatar_url TEXT CHECK (avatar_url <> ''),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at TIMESTAMP
);

-- Trigger to handle new registered user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER  AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (new.id, new.email);

  return new;
END
$$ language plpgsql security definer;

CREATE TRIGGER on_auth_user_created_create_public_user_record
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE handle_new_user();

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

  create policy "Profiles are viewable by users who created them."
  on profiles for select
  using ( auth.uid() = id );

----------- NOTES TABLE ------------
create table notes (
  id bigint generated by default as identity primary key,
  user_id uuid not null references auth.users (id),
  title text,
  description text,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

alter table notes enable row level security;

create policy "User can create note." on notes for
  insert with check (auth.uid() = user_id);

create policy "User can update their own notes." on notes for
  update using (auth.uid() = user_id);

create policy "User can delete their own notes." on notes for
  delete using (auth.uid() = user_id);

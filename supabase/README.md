# Supabase Migrations

This project is not yet linked to a Supabase CLI project (no `supabase/config.toml`).

To apply `migrations/0001_init_schema.sql`:

- **Option A (quickest):** paste the file contents into the Supabase Dashboard → SQL Editor and run it against your project.
- **Option B (CLI):** run `npx supabase link --project-ref <your-project-ref>`, then `npx supabase db push`.

Add new migrations as additional numbered files (`0002_*.sql`, etc.) rather than editing `0001_init_schema.sql` after it has been applied to any environment.

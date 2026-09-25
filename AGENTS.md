# Agent notes

- Run: `docker compose -f docker-compose.base44.yml up -d` → http://localhost:3000 (site) and `/admin` (admin portal).
- Single process: `server.ts` (Express, via `tsx watch`) serves the API and mounts Vite in middleware mode. Server edits auto-restart; `index.html`/`js`/`css` are served live.
- `npm install` needs `--legacy-peer-deps` (devDep `esbuild@^0.25` conflicts with vite 8's peer range). Upstream lockfile is `bun.lock`; compose uses `--no-package-lock` so no `package-lock.json` is generated.
- Data is a JSON file store: `data/db.json` (auto-seeded if missing/invalid). Uploads go to `public/uploads/`. Both are excluded from the tsx watcher so writes don't restart the server.
- Seed admin logins (from `server.ts`): `admin` / `Admin@Jijau2026`, `manager` / `Manager@Jijau2026`.
- `GEMINI_API_KEY` / `APP_URL` in `.env.example` are AI Studio leftovers — not referenced anywhere in the code.
- Verify: `curl -s localhost:3000/ | grep /@vite/client` and `curl -s -o /dev/null -w '%{http_code}' localhost:3000/admin`.

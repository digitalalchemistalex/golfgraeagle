---
name: golf-platform-deploy
description: "Deploy code changes to golfgraeagle.com via GitHub → Vercel auto-deploy. Use this whenever committing, pushing, deploying, fixing builds, modifying files, or updating code in the golfgraeagle repository."
---

# GolfGraeagle Deployment Skill

Always read `golfgraeagle-master` and `live-site-protection` before making any changes.

---

## Project Identity

| Field | Value |
|-------|-------|
| GitHub repo | digitalalchemistalex/golfgraeagle |
| Domain (target) | golfgraeagle.com |
| Live Vercel URL | golfgraeagle.vercel.app |
| Vercel project | golfgraeagle |
| Vercel project ID | prj_PH8j2XqMfaWlqstkrlDWJeC2GsLl |
| Vercel team | golfbookingsystem |
| Vercel team ID | team_DIp7IhTyWkStmeevzS9FPx20 |
| Supabase project | egplpluvbfsjrqzecnjf |
| Stack | Astro 6 + Tailwind v4 + Vercel adapter |

**Local project path:** `/home/claude/golfgraeagle/`

---

## Credentials (read from project files — never hardcode)

```bash
GITHUB_TOKEN=$(cat /mnt/project/goit_classic_token_)
VERCEL_TOKEN=$(cat /mnt/project/vercel_token)
ANON=$(grep -A1 'anon keys' /mnt/project/https___supabase_com_dashboard_project_egplpluvbfsjrqzecnjf_settings_api-keys_legacy | tail -1 | tr -d ' ')
SVC=$(grep 'service roll secret' -A1 /mnt/project/https___supabase_com_dashboard_project_egplpluvbfsjrqzecnjf_settings_api-keys_legacy | tail -1 | tr -d ' ')
SUPA_URL="https://egplpluvbfsjrqzecnjf.supabase.co"
```

---

## Standard Deployment Workflow

```bash
cd /home/claude/golfgraeagle

# 1. Verify build is clean BEFORE committing
npx astro build

# 2. If build passes, commit and push
git add -A
git commit -m "type: short description"
git push origin main

# Vercel auto-deploys in ~20 seconds
```

### Commit message format
```
feat: add FAQ page with schema markup
fix: null-safety on lodging course data
content: write Nakoma Dragon course page
seo: add schema markup to course pages
style: update hero section spacing
```

---

## Build Verification

After pushing, check deployment status:

```bash
VERCEL_TOKEN=$(cat /mnt/project/vercel_token)
curl -s "https://api.vercel.com/v6/deployments?projectId=prj_PH8j2XqMfaWlqstkrlDWJeC2GsLl&teamId=team_DIp7IhTyWkStmeevzS9FPx20&limit=1" \
  -H "Authorization: Bearer $VERCEL_TOKEN" | python3 -c "import sys,json; d=json.load(sys.stdin)['deployments'][0]; print(d['state'], d.get('url',''))"
```

Expected output: `READY golfgraeagle-[hash].vercel.app`

---

## GitHub API — Read File Before Modifying

```bash
GITHUB_TOKEN=$(cat /mnt/project/goit_classic_token_)
REPO="digitalalchemistalex/golfgraeagle"
FILE_PATH="src/pages/index.astro"

curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/$REPO/contents/$FILE_PATH"
```

Always get the current SHA before updating a file via API.

---

## Supabase Operations (gg_* tables only)

```bash
ANON=$(grep -A2 'anon keys' /mnt/project/https___supabase_com_dashboard_project_egplpluvbfsjrqzecnjf_settings_api-keys_legacy | tail -1 | tr -d ' ')
SVC=$(grep -A2 'service roll secret' /mnt/project/https___supabase_com_dashboard_project_egplpluvbfsjrqzecnjf_settings_api-keys_legacy | tail -1 | tr -d ' ')
SUPA_URL="https://egplpluvbfsjrqzecnjf.supabase.co"

# Query a table
curl -s "$SUPA_URL/rest/v1/gg_leads?limit=5&apikey=$ANON" \
  -H "Authorization: Bearer $SVC"

# Insert a record
curl -s -X POST "$SUPA_URL/rest/v1/gg_leads?apikey=$ANON" \
  -H "Authorization: Bearer $SVC" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"first_name": "Test", ...}'
```

**CRITICAL:** Only touch `gg_*` prefixed tables. The same Supabase project hosts MSG golf platform tables. Never touch `leads`, `courses`, `blog_posts`, etc. (without `gg_` prefix).

---

## Hard Rules

1. **Always build first** (`npx astro build`) — never push broken code
2. **One commit = one logical change** — don't batch unrelated changes
3. **Never touch non-gg_ tables** in Supabase
4. **Never hardcode secrets** in source files
5. **Tailwind v4:** No `tailwind.config.mjs` — CSS-first in `global.css`
6. **Prerender pattern:** All pages `export const prerender = true`; API routes `export const prerender = false`
7. **Wait for READY** before verifying a live change

---

## Common Issues & Fixes

### Build fails: "Cannot find module"
```bash
cd /home/claude/golfgraeagle && npm install
```

### Build fails: Tailwind classes not found
- Check `src/styles/global.css` has `@import "tailwindcss"`
- Check `astro.config.mjs` uses `@tailwindcss/vite` plugin
- Do NOT add `tailwind.config.mjs`

### Vercel shows old content after push
- Check deployment state with verification command above
- State must be `READY` not `BUILDING` or `ERROR`

### API route 500 error
- Check Supabase keys are loading correctly from env vars
- Check `export const prerender = false` on the route file
- Check table name has `gg_` prefix

### Null safety errors in Astro
```astro
<!-- Safe pattern for optional data -->
{course?.name ?? 'Unknown'}
{lodging?.amenities?.map(a => ...) ?? []}
```

---

## Content Update Checklist

| Change | Requires Deploy? | Also update |
|--------|-----------------|-------------|
| New page file | ✅ Yes | sitemap.xml, llms.txt |
| Blog post | ✅ Yes | sitemap.xml, llms.txt |
| DB insert (gg_leads) | ❌ No | — |
| DB insert (gg_blog_posts) | ❌ No | llms.txt |
| Course data update | ❌ No (if DB-driven) | — |
| Style/layout change | ✅ Yes | — |
| Schema markup change | ✅ Yes | — |

---

## Astro Config (do not change without reason)

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  }
});
```

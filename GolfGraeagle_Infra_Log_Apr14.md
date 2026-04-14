# GolfGraeagle.com — Infrastructure Change Log

## Apr 14, 2026 — SiteGround Migration Complete

### Changes Made
| Item | Before | After |
|------|--------|-------|
| DNS provider | SiteGround (NS1/NS2.SITEGROUND.NET) | GoDaddy (ns77/ns78.domaincontrol.com) |
| Email sending | SiteGround SMTP (info@golfgraeagle.com) | Resend API (GGE_RESEND_API_KEY) |
| SiteGround account | Active | Cancelled (expires at billing cycle end) |
| Resend domain | Failed → Verified | ✅ Verified |

### Vercel Env Vars (current state)
- `GGE_RESEND_API_KEY` — Resend full-access API key (active, working)
- `SMTP_HOST/PORT/USER/PASS` — legacy, not used by mailer.ts (can be deleted)

### DNS Records in GoDaddy
- A @ → 216.150.1.1 (Vercel)
- CNAME www → 646b998cd2e703b1.vercel-dns-016.com
- TXT resend._domainkey → Resend DKIM (verified)
- MX send → feedback-smtp.us-east-1.amazonses.com pri 10
- TXT send → v=spf1 include:amazonses.com ~all
- TXT google._domainkey → Google DKIM
- TXT @ → google-site-verification

### Tests Passed
- ✅ golfgraeagle.com → 200
- ✅ www.golfgraeagle.com → 301 → golfgraeagle.com
- ✅ Lead form submission → Supabase saved
- ✅ All 5 admin emails received via Resend
- ✅ Branded email (Graeagle Golf Packages)
- ✅ Resend domain verified

### Remaining Cleanup
- Delete legacy SMTP_* env vars from Vercel (not urgent — harmless)

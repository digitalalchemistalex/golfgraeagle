# GolfGraeagle Master Skill — Updates Apr 14, 2026

## REPLACE these sections in golfgraeagle-master/SKILL.md:

---

### BUSINESS IDENTITY table — update Admin email row:
OLD: | Admin email | info@golfgraeagle.com (SiteGround SMTP — migration pending post Apr 8) |
NEW: | Admin email | info@golfgraeagle.com (Resend API — migration complete Apr 14, 2026) |

---

### EMAIL SYSTEM (new section to add after TECH STACK):

## EMAIL SYSTEM

| Field | Value |
|-------|-------|
| Provider | Resend (resend.com) |
| From address | info@golfgraeagle.com |
| From name | Graeagle Golf Packages |
| Env var | GGE_RESEND_API_KEY (Vercel — full access key) |
| Resend domain status | Verified ✅ (Apr 14 2026) |
| mailer file | src/lib/mailer.ts — uses Resend API directly (NOT SMTP) |
| SMTP vars | SMTP_HOST/PORT/USER/PASS in Vercel are IRRELEVANT — mailer.ts ignores them |
| Reply-To | Not set — replies go to sender's email client default |

**CRITICAL:** The mailer uses `GGE_RESEND_API_KEY` env var. SMTP_PASS is not used. If email breaks, check this key first.

---

### DNS — GoDaddy (new section to replace any SiteGround DNS references):

## DNS — GODADDY (active as of Apr 14, 2026)

Nameservers: ns77.domaincontrol.com / ns78.domaincontrol.com

| Type | Name | Value | Notes |
|------|------|-------|-------|
| A | @ | 216.150.1.1 | Vercel |
| CNAME | www | 646b998cd2e703b1.vercel-dns-016.com | Vercel www |
| TXT | resend._domainkey | p=MIGfMA0GCSqGSlb3... | Resend DKIM |
| MX | send | feedback-smtp.us-east-1.amazonses.com (pri 10) | Resend feedback |
| TXT | send | v=spf1 include:amazonses.com ~all | Resend SPF |
| TXT | google._domainkey | v=DKIM1; k=rsa; p=MIIBIj... | Google DKIM |
| TXT | @ | google-site-verification=z4VbVm... | GSC verification |

SiteGround: CANCELLED Apr 14, 2026. Do not reference SiteGround anywhere.

---

### WHAT STILL NEEDS DOING — replace task #1:

OLD: | 1 | SiteGround migration | After April 8: GoDaddy DNS + Resend SMTP + GoDaddy email forwarding + cancel SiteGround |
NEW: | 1 | ~~SiteGround migration~~ | ✅ COMPLETE Apr 14 2026 — GoDaddy DNS + Resend email + SiteGround cancelled |

# Accounts & Services — Quick Guide

_Every account the three Beauty Forward apps use, and where to sign in. **No passwords or
secret values live in this doc — or should ever be added to it.** (Full detail? See
[the detailed version](accounts-and-services.md).)_

> 🔁 **Replicated file** — the same doc lives in all three repos. Change one, change all
> three.

---

## Who owns what

| Service | What it's for | Owned by |
| --- | --- | --- |
| 🔥 **Firebase / Google Cloud** | Databases, backends, all 3 websites, secrets, AI | ⏳ Dev's account — **being transferred to BF** |
| 🐘 **Data Connect (Postgres)** | The inventory database (dashboard reads it) | Part of Firebase project |
| 🤖 **Vertex AI (Gemini)** | IMS photo scan + barcode AI fallback | Part of Google Cloud project |
| 💳 **Givebutter** | Takes the donation contribution | ✅ Beauty Forward |
| 🚚 **Roadie** | The courier | ✅ Beauty Forward (team has logins) |
| ✉️ **Resend** | Sends the donation emails | ✅ Beauty Forward (`info@beauty-forward.org`) |
| 🏷️ **UPCitemdb / Open Beauty Facts** | Barcode lookup (IMS) | Free — no account needed |
| 💻 **GitHub** | The code (3 repos) | ✅ Beauty Forward (admin) |

---

## Which app uses what

- **Donation app** → Firebase · Givebutter · Roadie · Resend
- **Inventory (IMS)** → Firebase · Postgres · Vertex AI · barcode lookups
- **Dashboard** → Firebase · Postgres (read-only)

**Firebase / Google Cloud is shared by all three** — one project, `beauty-forward`.

---

## Where to sign in

- 🔥 **Firebase** → [console.firebase.google.com](https://console.firebase.google.com) (project `beauty-forward`); billing / Postgres / AI in the [Google Cloud console](https://console.cloud.google.com)
- 💳 **Givebutter** → [givebutter.com](https://givebutter.com)
- 🚚 **Roadie** → [connect.roadie.com](https://connect.roadie.com)
- ✉️ **Resend** → [resend.com](https://resend.com)
- 💻 **GitHub** → [donation](https://github.com/Beauty-Forward/donation-delivery-app) · [inventory](https://github.com/Beauty-Forward/inventory-management-system) · [dashboard](https://github.com/Beauty-Forward/data-dashboard)

---

## Still to finish (handover)

- ⬜ Transfer **Firebase + Google Cloud** to a Beauty Forward account _(hands over all 3 apps at once)_
- ⬜ Note the **Firebase spend so far**
- ⬜ Confirm BF's **Givebutter** login sees the same campaigns
- ⬜ Confirm **Roadie** production (not test) is live
- ⬜ Confirm the **Resend** sending domain is verified
- ⬜ Confirm **Vertex AI** is enabled + **Cloud SQL** is set up for production

---

## One rule

🔒 The most sensitive keys (Roadie, the Givebutter webhook secret) live in **Firebase's
secret store** — never in the code or a plain settings file. Keep them there.

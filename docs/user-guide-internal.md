# Internal User Guide — Inventory System

> **Who this is for:** The Beauty Forward warehouse and operations team — the people who
> receive donations, catalog stock, and send batches to shelters. This is the day-to-day
> operating manual.
>
> **Related:** the **[Inventory Lifecycle](inventory-lifecycle-state-machine.md)** doc
> explains every status; this guide explains what to _do_.

---

## Signing in

The inventory system is **staff-only** — you sign in with your Beauty Forward account. If
you don't have a login or can't get in, that's an account issue for your technical contact
(see **[Accounts & Services](accounts-and-services.md)**), not something to work around.

---

## The daily jobs, at a glance

| Job | In short |
| --- | --- |
| **1. Receive a donation** | Confirm what's arrived — from the app, or log a walk-in |
| **2. Catalog products** | Scan a barcode or take a photo to add each item to stock |
| **3. Manage stock** | Find items, mark things expired or discarded |
| **4. Build a batch** | Group in-stock items into a shipment for a shelter |
| **5. Ship & deliver** | Send the batch and record when the shelter receives it |

---

## 1. Receive a donation

Donations reach the warehouse two ways:

- **From the donation app** — these **appear automatically**. When a donor schedules a
  pickup, ships, or drops off, that donation syncs in on its own, so you can see what's
  coming without anyone re-typing it.
- **Walk-ins** — someone brings items in without going through the app. You log these
  yourself as a new donation.

> A donation appearing in the list means the _package_ is known — its individual items still
> need to be cataloged (next step).

---

## 2. Catalog products

This is the core task: turning a received donation into countable stock. For each item you
have three ways to capture it:

- **📷 Scan the barcode** — the app looks the code up automatically and fills in the product
  name, brand, and details. (Behind the scenes it checks several product databases, and asks
  AI if they come up empty.)
- **📸 Take a photo** — for items without a usable barcode, snap a photo and the app's AI
  reads the label to fill in the fields for you.
- **✍️ Enter it by hand** — always available if scanning and photos don't get it right.

Whatever the method, **check the details before saving** — the barcode and AI lookups are
helpers, not gospel. Once saved, the item is **in stock** and ready to be batched.

---

## 3. Manage stock

- **Find items** in the inventory section — filter by status, type, and so on.
- **Mark expired** when an item is past its date, or **discarded** if it's damaged or
  unusable. This removes it from available stock. **Both are manual** — the app won't expire
  things for you, so a periodic sweep keeps stock counts honest.

---

## 4. Build a batch for a shelter

A **batch** is one outgoing shipment to one shelter.

1. **Create a batch** and choose the **shelter** it's going to.
2. **Add in-stock products** to it. As you add them, they become **allocated** (reserved for
   this batch) so they can't be put in another.
3. When the batch is complete, **finalize** it — this locks the contents and marks it ready
   to send.

> Need an item back? Removing it from the batch (or returning the whole batch to stock)
> puts those products back to **in stock**.

---

## 5. Ship & deliver

1. **Ship** the batch when it physically goes out — this marks the batch _shipped_ and flips
   all its products to _shipped_ too.
2. **Mark it delivered** once the shelter confirms they received it.

The app doesn't track the courier between shipped and delivered — delivery is recorded by
you, based on what the shelter tells you.

---

## Managing shelters

Shelters are your distribution partners. In the shelters section you can add and edit them —
their contact details, what product types they accept or reject, preferred brands, and
capacity. Keeping this current makes building the right batch for each shelter easier. A
shelter you no longer work with can be **deactivated** rather than deleted.

---

## The in-app dashboard

The app's own dashboard gives you an at-a-glance view of the warehouse — stock on hand,
recent donations, batch activity. It's for quick operational awareness. Deeper reporting
and impact analytics (for leadership and partners) live in the separate **Data dashboard**
app.

---

## Common questions

**A donation is in the list but has no products.**
Normal — the sync records the package, not the items. Catalog its products (step 2).

**A product won't go into a new batch.**
It's probably already **allocated** to another batch. Free it by removing it from that
batch first.

**The barcode scan found nothing.**
Try a photo, or enter the item by hand. Some products just aren't in the barcode databases.

**Stock counts look too high.**
Check for items that should be expired or discarded but haven't been marked — that's a
manual step.

**I can't sign in.**
That's an account matter — contact your technical contact. See **[Accounts & Services](accounts-and-services.md)**.

---

## Where this fits

This is the middle of three apps. Donations start in the public **donation app** and flow
here; the **[System Overview](https://github.com/Beauty-Forward/donation-delivery-app/blob/main/docs/system-overview.md)**
shows the whole picture.

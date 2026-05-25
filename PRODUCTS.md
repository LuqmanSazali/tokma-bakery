# How to Add / Edit Products 🍰

## 📱 Updating Social Media Links

Edit the links at the top of `src/components/Footer.tsx`:

```ts
const SOCIAL_LINKS = {
  facebook:  'https://facebook.com/YOUR_PAGE',
  instagram: 'https://instagram.com/YOUR_USERNAME',
  tiktok:    'https://tiktok.com/@YOUR_USERNAME',
}
```

---

This guide is for adding new bakery items to the website. No coding needed!

---

## 📁 Folder Structure

Every product is its own folder inside `public/products/`:

```
public/
  products/
    cheese-cake/          ← one folder = one product
      info.json
      1.jpg
      2.jpg
    banana-cake/
      info.json
      1.jpg
```

---

## ➕ Adding a New Product

### Step 1 — Create a folder

Inside `public/products/`, create a new folder. Use lowercase letters and dashes, no spaces.

✅ Good: `chocolate-cake`, `pandan-layer-cake`, `almond-cookies`
❌ Avoid: `Chocolate Cake`, `chocolate_cake`

---

### Step 2 — Create `info.json`

Inside your new folder, create a file named exactly `info.json` and fill it in:

```json
{
  "name": "Cheese Cake",
  "price": 25.00,
  "description": "Creamy homemade cheesecake with graham cracker crust. 🧀",
  "category": "cake"
}
```

| Field | Required | Value |
|---|---|---|
| `name` | ✅ | Display name shown on the website |
| `price` | ✅ | Price in RM, use numbers only (e.g. `12.50`) |
| `description` | ✅ | Short description, 1–2 sentences. Emoji encouraged! |
| `category` | ✅ | Must be one of: `cake` `bread` `pastry` `cookies` |
| `order` | ☑️ Optional | Number to control display position. Lower = appears first. Products with the same number appear side by side. Products without `order` go to the end. |
| `featured` | ☑️ Optional | `true` to show in the **Seasonal Specials** section at the top |
| `limitedEdition` | ☑️ Optional | `true` to show a ⭐ Limited ribbon badge on the card |

---

### Step 3 — Add photos

Drop your photos inside the folder. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

```
public/products/cheese-cake/
  info.json
  1.jpg       ← shown first (main photo)
  2.jpg
  3.jpg
```

> 💡 **Tips:**
> - Photos are shown in **alphabetical order** — name them `1.jpg`, `2.jpg` etc. to control the order
> - Resize photos to around **800×600px** before adding — keeps the site fast on mobile
> - The more photos the better! Customers can swipe through them on the product card

---

### Step 4 — Push to GitHub

```bash
git add .
git commit -m "Add new product: Cheese Cake"
git push
```

The website will automatically update within ~1 minute. ✅

---

## ✏️ Editing a Product

- **Change name/price/description/category** → edit `info.json` in that product's folder
- **Add more photos** → drop new image files into the folder
- **Change main photo** → rename files so the one you want is first alphabetically (e.g. rename it to `0.jpg`)
- **Remove a photo** → delete the image file from the folder

Then push to GitHub as usual.

---

## 🗑️ Removing a Product

Simply delete the entire product folder and push:

```bash
git rm -r public/products/cheese-cake
git commit -m "Remove product: Cheese Cake"
git push
```

---

## ⚠️ Common Mistakes

| Problem | Fix |
|---|---|
| Product not showing on website | Check that `info.json` exists and has no typos |
| Wrong category, product missing from filter | `category` must be exactly: `cake`, `bread`, `pastry`, or `cookies` |
| Image not showing | Make sure the file is `.jpg`, `.jpeg`, `.png`, or `.webp` |
| Price showing wrong | In `info.json`, price must be a number — `25.00` not `"25.00"` |

---

## 📋 Full Example

Folder: `public/products/pandan-layer-cake/`

**info.json:**
```json
{
  "name": "Pandan Layer Cake",
  "price": 35.00,
  "description": "Soft and fragrant pandan layer cake made with fresh pandan juice. A Malaysian favourite! 🌿",
  "category": "cake",
  "order": 1
}
```

> 💡 **Ordering tip:** Give all pot pies `"order": 2` and all fruit tarts `"order": 3` — they'll automatically appear grouped together on the website.

**Files:**
```
pandan-layer-cake/
  info.json
  1.jpg   ← whole cake
  2.jpg   ← slice close-up
  3.jpg   ← packaging
```

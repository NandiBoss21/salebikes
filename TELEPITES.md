# SaleBikes – Telepítési útmutató

## 1. lépés: Supabase adatbázis beállítása

1. Menj a Supabase dashboardra: https://supabase.com/dashboard
2. Válaszd ki a `salebikes` projektet
3. Bal oldali menü → **SQL Editor**
4. Kattints: **New Query**
5. Másold be a `supabase-schema.sql` fájl teljes tartalmát
6. Kattints: **Run** (zöld gomb)
7. Ellenőrzés: bal menü → **Table Editor** → látnod kell a `bikes` táblát

---

## 2. lépés: GitHub feltöltés

```bash
# Terminal / PowerShell megnyitása a salebikes mappában
cd salebikes

git init
git add .
git commit -m "Initial commit – SaleBikes website"
git branch -M main
git remote add origin https://github.com/FELHASZNÁLÓNEVED/salebikes.git
git push -u origin main
```

---

## 3. lépés: Vercel deploy

1. Menj ide: https://vercel.com/new
2. **Import Git Repository** → válaszd a `salebikes` repót
3. Framework: **Next.js** (automatikusan felismeri)
4. **Environment Variables** hozzáadása (FONTOS!):

| Változó neve | Érték |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://gbauulozffwjpqkgrmla.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_TGvDINr7S2iwmmh02HcHIQ_ULkVlK8T` |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | (válassz egy erős jelszót!) |

5. Kattints: **Deploy**
6. ~2 perc és kész – kapsz egy `.vercel.app` linket

---

## 4. lépés: Domain beállítás (salebikes.hu)

1. Vercel Dashboard → a projekt → **Settings** → **Domains**
2. Add hozzá: `salebikes.hu` és `www.salebikes.hu`
3. Vercel megmutatja milyen DNS rekordokat kell beállítani
4. A domain regisztrátorodban (ahol a salebikes.hu-t vetted) állítsd be ezeket a DNS rekordokat
5. ~24 óra és él az éles domain

---

## 5. lépés: Admin jelszó beállítása

Az admin felület elérhető: `https://salebikes.hu/admin`

A jelszót a Vercel Environment Variables-ben add meg:
`NEXT_PUBLIC_ADMIN_PASSWORD` = valami erős jelszó

---

## Használat

**Kerékpár feltöltése:**
1. Menj: `https://salebikes.hu/admin`
2. Add meg a jelszót
3. Kattints: **Új kerékpár**
4. Töltsd ki az adatokat, töltsd fel a képeket
5. Kattints: **Kerékpár hozzáadása**
6. Azonnal megjelenik az oldalon

**Kerékpár elrejtése ha eladtad:**
- Admin listában kattints a szem ikonra → eltűnik az oldalról de az adatok megmaradnak

---

## Segítség

Ha bármi elakad a telepítésnél, írd le hol tartasz és segítek.

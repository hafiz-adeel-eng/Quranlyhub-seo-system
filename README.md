# Quranlyhub SEO System — Hobart Appliance Care

Yeh tool Google Analytics (GA4) aur Google Search Console (GSC) se data khud fetch
karta hai taake pata chal sake **kaunse pages kis query pe rank kar rahe hain**, kahan
clicks/traffic kam ya zyada hai, aur kahan on-page SEO behtar kar ke jaldi result mil
sakta hai.

## Access kaise dein (5-10 minute)

Google account **share nahi karna** — Google Cloud se ek "service account" banayen aur
sirf usay **read-only (Viewer)** access dein. Password kabhi share nahi hoga.

### 1. Service account banayen
1. https://console.cloud.google.com par jayen, ek project select/create karen.
2. **APIs & Services > Library** mein jayen aur enable karen:
   - `Google Analytics Data API`
   - `Google Search Console API`
3. **APIs & Services > Credentials > Create Credentials > Service Account** par jayen,
   naam dein (e.g. `hobart-seo-readonly`), Create.
4. Us service account par click karen > **Keys** tab > **Add Key > Create new key > JSON**.
   Ek `.json` file download hogi — **isay kisi ke sath share na karein, chat mein bhi
   paste na karein.**
5. Us JSON file ke andar ek `client_email` hoga, jaisa:
   `hobart-seo-readonly@your-project.iam.gserviceaccount.com` — yehi email agle steps
   mein access dene ke liye use hoga.

### 2. GA4 mein access dein
1. https://analytics.google.com par Hobart site ki property kholen.
2. **Admin > Property Access Management** > `+` > us service account ka email add karen
   > Role: **Viewer**.

### 3. Search Console mein access dein
1. https://search.google.com/search-console par jayen, Hobart property select karen.
2. **Settings > Users and permissions > Add user** > service account ka email daalen
   > Permission: **Restricted (Full nahi chahiye, read hi kaafi hai)**.

### 4. JSON key is project mein rakhein
1. `credentials/` folder banayen (yeh `.gitignore` mein hai, GitHub par kabhi nahi
   jayega) aur downloaded JSON file ko `credentials/service-account.json` naam se rakhen.
2. `.env.example` ko copy kar ke `.env` banayen aur fill karen:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=credentials/service-account.json
   GSC_SITE_URL=https://hobartappliancecare.com/     # GSC mein jo exact property naam hai
   GA4_PROPERTY_ID=123456789                          # GA4 Admin > Property Settings se
   ```

## Chalanay ka tareeqa

```bash
pip install -r requirements.txt
python main.py --days 28
```

Yeh `outputs/` folder mein 4 CSV reports banayega:

- **pages_overview.csv** — har page ke clicks, impressions, average position, GA4 sessions
- **quick_win_pages.csv** — jo pages position 5-20 par rank kar rahe hain (page 1 ke qareeb)
  aur search volume bhi hai — inko improve karna sab se pehle faida dega
- **low_ctr_pages.csv** — jo pages achi position par hain lekin CTR kam hai — yani
  title/meta description behtar karne se clicks badh sakte hain
- **missed_queries.csv** — un queries ki list jin par demand hai lekin site page 1 par
  nahi — naya content ya optimization ka mauqa

Har baar chalane ke baad main inhi reports ko dekh kar aage ki SEO improvements
(titles, meta descriptions, internal linking, naya content) suggest/implement kar sakta
hoon.

## Security note

- `.env` aur `credentials/` dono `.gitignore` mein hain — kabhi commit nahi hote.
- Service account sirf **read-only** hai, kuch edit/delete nahi kar sakta.
- Access wapas lena ho to GA4/GSC ki users list se us email ko remove kar dein.

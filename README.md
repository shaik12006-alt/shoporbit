# ShopOrbit 🪐
> **Tagline:** Discover More. Spend Smarter.

A professional, fully responsive affiliate e-commerce and deals aggregator built with **React**, **Vite**, **Tailwind CSS**, and **Supabase**, optimized for deployment on **Cloudflare Pages**.

ShopOrbit curates handpicked price drops, verified electronics steals, and trending fashion from **Amazon India** and **Myntra India**.

---

## 🌟 Key Features

1. **Curated Deals Hub:**
   - **Amazon India Deals:** Laptops, true wireless audio, smartphones, wearables, and smart home appliances.
   - **Myntra Fashion Edit:** Men's denim, streetwear hoodies, ethnic kurtas, designer handbags, and running sneakers.
2. **Affiliate Link Redirection & Tracking:**
   - One-click outbound redirection to Amazon.in (`tag=...`) and Myntra (`aff_id=...`).
   - Outbound click counter and live event logger.
   - Compliant `rel="nofollow sponsored noopener"` link attributes and celebration animations.
3. **Advanced Product Search & Multi-Criteria Filtering:**
   - Instant search auto-suggestions.
   - Platform filters (All, Amazon India, Myntra India).
   - Category selector with live count badges.
   - Minimum discount filters (20%+, 30%+, 50%+).
   - Dynamic price slider and multi-column sorting (Popularity, Price: Low to High, Price: High to Low, Highest Discount, Highest Rated).
4. **Admin Dashboard:**
   - Add, edit, and delete affiliate products with live preview.
   - Outbound click analytics: Total clicks, platform breakdown, top 5 most popular products.
   - Recent shopper click event log.
   - Supabase connection status indicator with SQL schema setup script.
   - Demo catalog reset button.
   - Protected with admin passcode (Default demo passcode: `orbitadmin`).
5. **SEO & Compliance Ready:**
   - Dynamic document titles and meta descriptions per page.
   - Prominent **Affiliate Disclosure Banner** and footer statement compliant with FTC, ASCI, and Amazon Associates Operating Agreement guidelines.
   - Clearly labeled **Demo Data** badges on sample items.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ (tested with Node v26)
- npm 9+

### 2. Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized production bundle is generated in the `dist/` directory.

---

## 🗄️ Supabase Free Tier Setup (Optional)

ShopOrbit operates seamlessly out of the box using persistent LocalStorage. When you're ready to sync with your Supabase database:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard and run the schema query:

```sql
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  platform TEXT NOT NULL,
  category TEXT NOT NULL,
  mrp NUMERIC NOT NULL,
  deal_price NUMERIC NOT NULL,
  discount_percentage NUMERIC NOT NULL,
  rating NUMERIC DEFAULT 4.5,
  review_count NUMERIC DEFAULT 0,
  image TEXT NOT NULL,
  additional_images TEXT[] DEFAULT '{}',
  affiliate_url TEXT NOT NULL,
  badge TEXT,
  is_demo BOOLEAN DEFAULT false,
  demo_label TEXT,
  featured BOOLEAN DEFAULT false,
  trending BOOLEAN DEFAULT false,
  clicks NUMERIC DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS product_clicks (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  referrer TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public insert product_clicks" ON product_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update clicks" ON products FOR UPDATE USING (true);
```

3. Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

---

## ☁️ Cloudflare Pages Deployment

1. Push this project to your GitHub repository.
2. In the **Cloudflare Dashboard**:
   - Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
   - Select your repository.
   - Configure build settings:
     - **Framework preset:** `Vite`
     - **Build command:** `npm run build`
     - **Build output directory:** `dist`
   - Add environment variables (optional): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
3. Click **Save and Deploy**. Cloudflare Pages will build and deploy your site with global edge CDN and instant SSL.

Cloudflare Pages natively handles Single-Page Application (SPA) routing: any client-side routes (such as `/admin`, `/amazon-deals`, `/myntra-fashion`, `/categories`, `/product/:id`) automatically serve `dist/index.html` with HTTP 200 without requiring any `_redirects` file.

---

## 🛡️ Affiliate Disclaimer & Editorial Integrity
ShopOrbit participates in the Amazon Associates Programme and Myntra Affiliate Network. We may earn an advertising or referral fee when shoppers purchase through outbound links at zero extra cost. All sample products are labeled as demo catalog listings.

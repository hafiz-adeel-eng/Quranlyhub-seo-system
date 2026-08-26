export type CityDef = {
  slug: string;
  nameUr: string;
  nameEn: string;
  province: string;
  featured: boolean;
};

// Major Pakistani cities — landing pages are generated for every entry here.
// Add a city and a new /rishta/[slug] SEO landing page appears automatically.
export const CITIES: CityDef[] = [
  { slug: "lahore", nameUr: "لاہور", nameEn: "Lahore", province: "Punjab", featured: true },
  { slug: "karachi", nameUr: "کراچی", nameEn: "Karachi", province: "Sindh", featured: true },
  { slug: "islamabad", nameUr: "اسلام آباد", nameEn: "Islamabad", province: "Islamabad", featured: true },
  { slug: "rawalpindi", nameUr: "راولپنڈی", nameEn: "Rawalpindi", province: "Punjab", featured: true },
  { slug: "faisalabad", nameUr: "فیصل آباد", nameEn: "Faisalabad", province: "Punjab", featured: true },
  { slug: "gujranwala", nameUr: "گوجرانوالہ", nameEn: "Gujranwala", province: "Punjab", featured: true },
  { slug: "gujrat", nameUr: "گجرات", nameEn: "Gujrat", province: "Punjab", featured: true },
  { slug: "jhelum", nameUr: "جہلم", nameEn: "Jhelum", province: "Punjab", featured: true },
  { slug: "sialkot", nameUr: "سیالکوٹ", nameEn: "Sialkot", province: "Punjab", featured: true },
  { slug: "multan", nameUr: "ملتان", nameEn: "Multan", province: "Punjab", featured: true },
  { slug: "sargodha", nameUr: "سرگودھا", nameEn: "Sargodha", province: "Punjab", featured: true },
  { slug: "sheikhupura", nameUr: "شیخوپورہ", nameEn: "Sheikhupura", province: "Punjab", featured: false },
  { slug: "sahiwal", nameUr: "ساہیوال", nameEn: "Sahiwal", province: "Punjab", featured: false },
  { slug: "bahawalpur", nameUr: "بہاولپور", nameEn: "Bahawalpur", province: "Punjab", featured: false },
  { slug: "okara", nameUr: "اوکاڑہ", nameEn: "Okara", province: "Punjab", featured: false },
  { slug: "wah-cantt", nameUr: "وہ کینٹ", nameEn: "Wah Cantt", province: "Punjab", featured: false },
  { slug: "kasur", nameUr: "قصور", nameEn: "Kasur", province: "Punjab", featured: false },
  { slug: "mandi-bahauddin", nameUr: "منڈی بہاؤالدین", nameEn: "Mandi Bahauddin", province: "Punjab", featured: false },
  { slug: "hafizabad", nameUr: "حافظ آباد", nameEn: "Hafizabad", province: "Punjab", featured: false },
  { slug: "chiniot", nameUr: "چنیوٹ", nameEn: "Chiniot", province: "Punjab", featured: false },
  { slug: "jhang", nameUr: "جھنگ", nameEn: "Jhang", province: "Punjab", featured: false },
  { slug: "dera-ghazi-khan", nameUr: "ڈیرہ غازی خان", nameEn: "Dera Ghazi Khan", province: "Punjab", featured: false },
  { slug: "attock", nameUr: "اٹک", nameEn: "Attock", province: "Punjab", featured: false },
  { slug: "peshawar", nameUr: "پشاور", nameEn: "Peshawar", province: "Khyber Pakhtunkhwa", featured: true },
  { slug: "abbottabad", nameUr: "ایبٹ آباد", nameEn: "Abbottabad", province: "Khyber Pakhtunkhwa", featured: false },
  { slug: "mardan", nameUr: "مردان", nameEn: "Mardan", province: "Khyber Pakhtunkhwa", featured: false },
  { slug: "swat", nameUr: "سوات", nameEn: "Swat", province: "Khyber Pakhtunkhwa", featured: false },
  { slug: "quetta", nameUr: "کوئٹہ", nameEn: "Quetta", province: "Balochistan", featured: true },
  { slug: "hyderabad", nameUr: "حیدرآباد", nameEn: "Hyderabad", province: "Sindh", featured: true },
  { slug: "sukkur", nameUr: "سکھر", nameEn: "Sukkur", province: "Sindh", featured: false },
  { slug: "larkana", nameUr: "لاڑکانہ", nameEn: "Larkana", province: "Sindh", featured: false },
  { slug: "mirpur-azad-kashmir", nameUr: "میرپور آزاد کشمیر", nameEn: "Mirpur (AJK)", province: "Azad Kashmir", featured: false },
];

export const CITY_SLUGS = CITIES.map((c) => c.slug);

export function getCityBySlug(slug: string): CityDef | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export const FEATURED_CITIES = CITIES.filter((c) => c.featured);

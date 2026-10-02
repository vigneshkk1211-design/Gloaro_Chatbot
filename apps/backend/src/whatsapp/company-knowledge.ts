// ─────────────────────────────────────────────────────────────────────────────
// GLOARO PVT LTD — Official AI Business Assistant Knowledge Base
// ─────────────────────────────────────────────────────────────────────────────

export const BUTTON_IDS = {
  DM:   'btn_dm',
  TECH: 'btn_tech',
  ECOM: 'btn_ecom',
} as const;

export const MAIN_MENU_BUTTONS = [
  { id: BUTTON_IDS.DM,   title: 'Digital Marketing' },
  { id: BUTTON_IDS.TECH, title: 'Technology Solutions' },
  { id: BUTTON_IDS.ECOM, title: 'E-Commerce Solutions' },
];

/** Triggers Rule 1 — welcome message + 3 buttons */
export const MENU_TRIGGER_KEYWORDS = [
  'hi', 'hello', 'hey', 'start', 'menu', 'help',
  'services', 'service', 'good morning', 'good evening',
  'வணக்கம்', 'தொடங்கு',
];

/** Triggers Rule 4 — pricing reply */
export const PRICING_KEYWORDS = [
  'price', 'pricing', 'cost', 'budget', 'charge', 'charges', 'fee', 'fees',
  'rate', 'rates', 'quote', 'quotation', 'how much', 'what is the cost',
  'what is the price', 'expense', 'affordable', 'cheap', 'expensive', 'amount',
];

// ─────────────────────────────────────────────────────────────────────────────
// RULE 1: Welcome text shown with 3 interactive buttons
// ─────────────────────────────────────────────────────────────────────────────
export const WELCOME_TEXT =
  '👋 Hello! Welcome to *GLOARO PVT LTD*! 🚀✨\n\n' +
  '*"One Ecosystem. Multiple Business Solutions."*\n\n' +
  'We are a technology-driven business networking and digital solutions company ' +
  'empowering entrepreneurs, startups, SMEs, and enterprises.\n\n' +
  'How can we help scale your business today? Please choose a service below:';

// ─────────────────────────────────────────────────────────────────────────────
// RULE 2: Button click → ONLY bullet list of service names (no paragraphs)
// ─────────────────────────────────────────────────────────────────────────────
export const BUTTON_SERVICE_LIST = {
  btn_dm: `📈 *Digital Marketing Services*\n\n• Digital Marketing\n• Social Media Marketing\n• Google & Meta Ads\n• SEO (Search Engine Optimization)\n• Content Marketing\n• Branding & Design\n\n_Reply with any service name above to know more details!_`,

  btn_tech: `💻 *Technology Solutions*\n\n• Website Development\n• Mobile App Development\n• Custom Software Development\n• CRM & ERP Solutions\n• WhatsApp BOT & AI Business Solutions\n\n_Reply with any service name above to know more details!_`,

  btn_ecom: `🛒 *E-Commerce Solutions*\n\n• E-Commerce Website & App\n• Online Store Development\n• Product Listing & Management\n• B2B & B2C Sales\n• E-Commerce Marketing\n• Payment Gateway Integration\n\n_Reply with any service name above to know more details!_`,
};

// ─────────────────────────────────────────────────────────────────────────────
// RULE 3: Detailed explanations (only when user asks about a specific service)
// ─────────────────────────────────────────────────────────────────────────────
export const SERVICE_DETAILS: Record<string, { trigger: string[]; reply: string }> = {
  digital_marketing: {
    trigger: ['digital marketing'],
    reply:
      '📈 *Digital Marketing*\n\nPromoting your business online to reach targeted customers and build a strong brand presence.\n\n📞 Contact us: 7200537033 / 7200073704\n📧 info@gloaro.com',
  },
  social_media: {
    trigger: ['social media marketing', 'social media', 'smm', 'instagram', 'facebook', 'linkedin'],
    reply:
      '📲 *Social Media Marketing*\n\nEngaging audiences and building brand loyalty across platforms like Instagram, Facebook, and LinkedIn.\n\n📞 Contact us: 7200537033 / 7200073704\n📧 info@gloaro.com',
  },
  google_meta_ads: {
    trigger: ['google & meta ads', 'google ads', 'meta ads', 'paid ads', 'ppc'],
    reply:
      '🎯 *Google & Meta Ads*\n\nRunning high-converting targeted ads on Google and social media to drive instant leads and sales.\n\n📞 Contact us: 7200537033 / 7200073704\n📧 info@gloaro.com',
  },
  seo: {
    trigger: ['seo', 'search engine optimization', 'organic traffic', 'google ranking', 'rank higher'],
    reply:
      '🔍 *SEO (Search Engine Optimization)*\n\nOptimizing your website to rank higher on Google search results and drive organic traffic.\n\n📞 Contact us: 7200537033 / 7200073704\n📧 info@gloaro.com',
  },
  content_marketing: {
    trigger: ['content marketing', 'content creation', 'blog', 'blogs', 'video content'],
    reply:
      '✍️ *Content Marketing*\n\nCreating valuable, engaging content, blogs, and videos to attract and retain customers.\n\n📞 Contact us: 7200537033 / 7200073704\n📧 info@gloaro.com',
  },
  branding: {
    trigger: ['branding', 'branding & design', 'brand design', 'logo', 'visual design', 'brand identity'],
    reply:
      '🎨 *Branding & Design*\n\nCrafting a unique brand identity with professional logos, banners, and visual designs.\n\n📞 Contact us: 7200537033 / 7200073704\n📧 info@gloaro.com',
  },
  website_dev: {
    trigger: ['website development', 'website', 'web development', 'web design', 'web app'],
    reply:
      '🌐 *Website Development*\n\nBuilding fast, responsive, and modern websites tailored specifically for your business.\n\n📞 Contact us: 7200537033 / 7200073704\n📧 info@gloaro.com',
  },
  mobile_app: {
    trigger: ['mobile app development', 'mobile app', 'android app', 'ios app', 'app development'],
    reply:
      '📱 *Mobile App Development*\n\nDeveloping high-performance custom mobile applications for both Android and iOS platforms.\n\n📞 Contact us: 7200537033 / 7200073704\n📧 info@gloaro.com',
  },
  custom_software: {
    trigger: ['custom software development', 'custom software', 'software development', 'software solution'],
    reply:
      '🛠️ *Custom Software Development*\n\nCreating scalable, tailor-made software solutions to fit your unique business workflows.\n\n📞 Contact us: 7200537033 / 7200073704\n📧 info@gloaro.com',
  },
  crm_erp: {
    trigger: ['crm & erp solutions', 'crm', 'erp', 'customer relations', 'business management'],
    reply:
      '📊 *CRM & ERP Solutions*\n\nStreamlining your customer relations, data management, and daily business operations effortlessly.\n\n📞 Contact us: 7200537033 / 7200073704\n📧 info@gloaro.com',
  },
  whatsapp_bot: {
    trigger: ['whatsapp bot', 'whatsapp bot & ai business solutions', 'ai business solutions', 'chatbot', 'ai solution', 'automation'],
    reply:
      '🤖 *WhatsApp BOT & AI Business Solutions*\n\nAutomating customer support and lead generation 24/7 using smart WhatsApp chatbots and AI tools.\n\n📞 Contact us: 7200537033 / 7200073704\n📧 info@gloaro.com',
  },
  ecom_website: {
    trigger: ['e-commerce website & app', 'ecommerce website', 'e-commerce website', 'online shopping app', 'shopping app'],
    reply:
      '🛍️ *E-Commerce Website & App*\n\nLaunching feature-rich online shopping stores and dedicated mobile apps for your products.\n\n📞 Contact us: 7200537033 / 7200073704\n📧 info@gloaro.com',
  },
  online_store: {
    trigger: ['online store development', 'online store', 'digital store', 'ecommerce store'],
    reply:
      '🏪 *Online Store Development*\n\nSetting up user-friendly digital stores designed to deliver a seamless shopping experience.\n\n📞 Contact us: 7200537033 / 7200073704\n📧 info@gloaro.com',
  },
  product_listing: {
    trigger: ['product listing & management', 'product listing', 'product management', 'catalog management', 'inventory'],
    reply:
      '📦 *Product Listing & Management*\n\nProfessionally listing products and managing catalog inventories across digital storefronts.\n\n📞 Contact us: 7200537033 / 7200073704\n📧 info@gloaro.com',
  },
  b2b_b2c: {
    trigger: ['b2b & b2c sales', 'b2b', 'b2c', 'wholesale', 'retail sales'],
    reply:
      '🤝 *B2B & B2C Sales*\n\nSetting up robust digital sales channels tailored for both wholesale (B2B) and retail (B2C) markets.\n\n📞 Contact us: 7200537033 / 7200073704\n📧 info@gloaro.com',
  },
  ecom_marketing: {
    trigger: ['e-commerce marketing', 'ecommerce marketing', 'online marketing', 'drive traffic', 'store promotion'],
    reply:
      '📢 *E-Commerce Marketing*\n\nExecuting result-driven campaigns to drive traffic to your online store and maximize online sales.\n\n📞 Contact us: 7200537033 / 7200073704\n📧 info@gloaro.com',
  },
  payment_gateway: {
    trigger: ['payment gateway integration', 'payment gateway', 'upi', 'payment integration', 'checkout', 'online payment'],
    reply:
      '💳 *Payment Gateway Integration*\n\nIntegrating secure, hassle-free payment options (UPI, Credit Cards, Wallets) for smooth checkout experiences.\n\n📞 Contact us: 7200537033 / 7200073704\n📧 info@gloaro.com',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// RULE 4: Pricing reply (exact wording — never deviate)
// ─────────────────────────────────────────────────────────────────────────────
export const PRICING_REPLY =
  'Our service charges vary depending on your requirements. Please contact our company for further details!';

// ─────────────────────────────────────────────────────────────────────────────
// RULE 5: Out-of-scope fallback (exact wording — never deviate)
// ─────────────────────────────────────────────────────────────────────────────
export const OUT_OF_SCOPE_REPLY =
  "This is outside our company's scope. Please contact our company for further assistance.";

// ─────────────────────────────────────────────────────────────────────────────
// Lookup: General company info (contact, about, etc.)
// ─────────────────────────────────────────────────────────────────────────────
export const COMPANY_INFO = {
  name:    'GLOARO PVT LTD',
  phones:  '7200537033 / 7200073704',
  email:   'info@gloaro.com',
  website: 'www.gloaro.com / www.gloaro.in',
  address: 'SF No. 101/2B, Esai Towers, Salem Main Road, Near Bypass, Emapper, Kallakurichi - 606202, Tamil Nadu, India.',
  cin:     'U63120TN2026PTC194972',
  gst:     '33AANCG1952H1ZL',
  tagline: '"One Ecosystem. Multiple Business Solutions."',
};

// ─────────────────────────────────────────────────────────────────────────────
// Main keyword resolver — Rules 3 + 5
// ─────────────────────────────────────────────────────────────────────────────
export function getCompanyAnswerByKeyword(userQuery: string): string {
  const q = userQuery.toLowerCase().trim();

  // Rule 4 — Pricing
  if (PRICING_KEYWORDS.some((k) => q.includes(k))) {
    return PRICING_REPLY;
  }

  // Rule 3 — Specific service explanation
  for (const detail of Object.values(SERVICE_DETAILS)) {
    if (detail.trigger.some((t) => q.includes(t))) {
      return detail.reply;
    }
  }

  // General company info queries (not out-of-scope)
  if (q.includes('contact') || q.includes('phone') || q.includes('number') || q.includes('email') || q.includes('website') || q.includes('reach')) {
    return `📞 *Contact GLOARO PVT LTD*\n\n• 📱 Phone: ${COMPANY_INFO.phones}\n• 📧 Email: ${COMPANY_INFO.email}\n• 🌐 Website: ${COMPANY_INFO.website}`;
  }

  if (q.includes('address') || q.includes('location') || q.includes('office') || q.includes('where')) {
    return `📍 *Corporate Office - GLOARO PVT LTD*\n\n${COMPANY_INFO.address}`;
  }

  if (q.includes('about') || q.includes('company') || q.includes('who') || q.includes('gloaro') || q.includes('overview') || q.includes('vision') || q.includes('mission') || q.includes('ecosystem')) {
    return `🏢 *About GLOARO PVT LTD*\n\n${COMPANY_INFO.tagline}\n\nA technology-driven business networking and digital solutions company empowering entrepreneurs, startups, SMEs, and enterprises.\n\n📱 ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
  }

  if (q.includes('cin') || q.includes('gst') || q.includes('registration') || q.includes('legal')) {
    return `📋 *Registration Details*\n\n• CIN: ${COMPANY_INFO.cin}\n• GST: ${COMPANY_INFO.gst}`;
  }

  // Rule 5 — Out of scope
  return OUT_OF_SCOPE_REPLY;
}
// ─────────────────────────────────────────────────────────────────────────────
// GLOARO PVT LTD — Multilingual Knowledge Base
// Supports: English (en) | Tamil (ta) | Hindi (hi)
//
// Conversation flow:
//   Step 1 → Any first message  : Language selection buttons (no flags)
//   Step 2 → Language chosen    : Save [Lang:xx] marker → Send Welcome Image (Link 1) + Welcome text with 3 service buttons
//   Step 3 → Service button     : Send Mapped Service Image (Link 2/3/4) + Bullet list ONLY (no contact info)
//   Step 4 → Specific keyword   : Send parent-category image FIRST → Sub-service details WITH official contact info
// ─────────────────────────────────────────────────────────────────────────────

export const COMPANY_INFO = {
  name:    'GLOARO PVT LTD',
  phones:  '7200537033 / 7200073704',
  email:   'info@gloaro.com',
  website: 'https://www.gloaro.com',
  address: 'SF No. 101/2B, Esai Towers, Salem Main Road, Near Bypass, Emapper, Kallakurichi - 606202, Tamil Nadu, India.',
};

// ─── Stable button IDs ────────────────────────────────────────────────────────
export const BUTTON_IDS = {
  // Main Categories
  DM:               'btn_dm',
  TECH:             'btn_tech',
  ECOM:             'btn_ecom',
  // Languages
  LANG_EN:          'lang_en',
  LANG_TA:          'lang_ta',
  LANG_HI:          'lang_hi',
  // Digital Marketing Sub-Services
  SUB_DM:           'btn_sub_dm',
  SUB_SMM:          'btn_sub_smm',
  SUB_ADS:          'btn_sub_ads',
  SUB_SEO:          'btn_sub_seo',
  SUB_CONTENT:      'btn_sub_content',
  SUB_BRANDING:     'btn_sub_branding',
  // Technology Sub-Services
  SUB_WEB:          'btn_sub_web',
  SUB_MOBILE:       'btn_sub_mobile',
  SUB_SOFTWARE:     'btn_sub_software',
  SUB_CRM:          'btn_sub_crm',
  SUB_BOT:          'btn_sub_bot',
  // E-Commerce Sub-Services
  SUB_ECOM_APP:     'btn_sub_ecom_app',
  SUB_STORE:        'btn_sub_store',
  SUB_LISTING:      'btn_sub_listing',
  SUB_B2B:          'btn_sub_b2b',
  SUB_ECOM_MARKETING: 'btn_sub_ecom_marketing',
  SUB_PAYMENT:      'btn_sub_payment',
  // Backward compatibility aliases
  SEO:              'btn_seo',
  SMM:              'btn_smm',
  ADS:              'btn_ads',
  CONTENT:          'btn_content',
  BRANDING:         'btn_branding',
  DIGITAL:          'btn_digital',
  WEB:              'btn_web',
  MOBILE:           'btn_mobile',
  CUSTOM_SOFTWARE:  'btn_software',
  CRM_ERP:          'btn_crm',
  WHATSAPP_BOT:     'btn_bot',
  AUTOMATION:       'btn_automation',
  AI_BUSINESS:      'btn_ai',
  ECOM_APP:         'btn_ecom_app',
  ONLINE_STORE:     'btn_store',
  PRODUCT_LISTING:  'btn_product_listing',
  B2B_B2C:          'btn_b2b_b2c',
  WELCOME:          'btn_welcome',
} as const;

/** Language codes */
export type Lang = 'ta' | 'hi' | 'en';

/** All three language button IDs in one array (for quick lookup) */
export const LANG_BUTTON_IDS: string[] = [
  BUTTON_IDS.LANG_EN,
  BUTTON_IDS.LANG_TA,
  BUTTON_IDS.LANG_HI,
];

// ─── Image Mapping (GitHub Raw URLs for 100% Reliable Loading) ────────────────
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/vigneshkk1211-design/Gloaro_Chatbot/main/apps/backend/src/assets/images';

export const SERVICE_IMAGES = {
  welcome:              process.env.IMAGE_URL_WELCOME               || `${GITHUB_RAW_BASE}/welcome.jpg`,
  // Main Categories
  dm:                   process.env.IMAGE_URL_DM                    || `${GITHUB_RAW_BASE}/digital-marketing.jpg`,
  tech:                 process.env.IMAGE_URL_TECH                  || `${GITHUB_RAW_BASE}/Technology%20solutions.jpg`,
  ecom:                 process.env.IMAGE_URL_ECOM                  || `${GITHUB_RAW_BASE}/e-commerce.jpg`,
  
  // Digital Marketing Sub-Services
  digitalMarketing:     process.env.IMAGE_URL_DIGITAL_MARKETING     || `${GITHUB_RAW_BASE}/digital-marketing.jpg`,
  digitalMarketingAlt:  process.env.IMAGE_URL_DM_ALT                || `${GITHUB_RAW_BASE}/digital-marketing.jpg`,
  socialMedia:          process.env.IMAGE_URL_SOCIAL_MEDIA          || `${GITHUB_RAW_BASE}/Socialmedia.jpg`,
  googleMetaAds:        process.env.IMAGE_URL_GOOGLE_META_ADS       || `${GITHUB_RAW_BASE}/Google%20%26%20meta%20ads.jpg`,
  seo:                  process.env.IMAGE_URL_SEO                   || `${GITHUB_RAW_BASE}/SEO.jpeg`,
  content:              process.env.IMAGE_URL_CONTENT               || `${GITHUB_RAW_BASE}/Content.jpg`,
  brandingDesign:       process.env.IMAGE_URL_BRANDING_DESIGN       || `${GITHUB_RAW_BASE}/Branding%20%26%20design.jpg`,
  
  // Technology Sub-Services
  technologySolutions:  process.env.IMAGE_URL_TECH_SOLUTIONS        || `${GITHUB_RAW_BASE}/Technology%20solutions.jpg`,
  websiteDevelopment:   process.env.IMAGE_URL_WEBSITE_DEV           || `${GITHUB_RAW_BASE}/Website%20development.jpeg`,
  mobileApp:            process.env.IMAGE_URL_MOBILE_APP            || `${GITHUB_RAW_BASE}/mobile%20app.jpg`,
  customSoftware:       process.env.IMAGE_URL_CUSTOM_SOFTWARE       || `${GITHUB_RAW_BASE}/custom%20software.jpeg`,
  crmErp:               process.env.IMAGE_URL_CRM_ERP               || `${GITHUB_RAW_BASE}/CRM%20%26%20ERP.jpg`,
  whatsappBott:         process.env.IMAGE_URL_WHATSAPP_BOTT         || `${GITHUB_RAW_BASE}/Whatsapp%20bott.jpg`,
  businessAutomation:   process.env.IMAGE_URL_BUSINESS_AUTOMATION   || `${GITHUB_RAW_BASE}/Business%20automation.jpg`,
  aiBusinessSolution:   process.env.IMAGE_URL_AI_BUSINESS_SOLUTION  || `${GITHUB_RAW_BASE}/AI%20business%20solution.jpg`,

  // E-Commerce Sub-Services
  ecommerce:            process.env.IMAGE_URL_ECOMMERCE             || `${GITHUB_RAW_BASE}/e-commerce.jpg`,
  ecommerceJpeg:        process.env.IMAGE_URL_ECOMMERCE_JPEG        || `${GITHUB_RAW_BASE}/E-commerce.jpeg`,
  onlineStore:          process.env.IMAGE_URL_ONLINE_STORE          || `${GITHUB_RAW_BASE}/online%20store.jpg`,
  productListingMgmt:   process.env.IMAGE_URL_PRODUCT_LISTING_MGMT  || `${GITHUB_RAW_BASE}/Product%20listing%20%26%20management.jpg`,
  b2bB2cSales:          process.env.IMAGE_URL_B2B_B2C_SALES         || `${GITHUB_RAW_BASE}/B2B%20%26%20B2C%20sales.jpg`,

  // Compatibility aliases
  LINK_1_WELCOME:       process.env.IMAGE_URL_WELCOME               || `${GITHUB_RAW_BASE}/welcome.jpg`,
  LINK_2_DM:            process.env.IMAGE_URL_DM                    || `${GITHUB_RAW_BASE}/digital-marketing.jpg`,
  LINK_3_TECH:          process.env.IMAGE_URL_TECH                  || `${GITHUB_RAW_BASE}/Technology%20solutions.jpg`,
  LINK_4_ECOM:          process.env.IMAGE_URL_ECOM                  || `${GITHUB_RAW_BASE}/e-commerce.jpg`,
} as const;

export function getServiceImageUrl(buttonIdOrKeyword: string): string | null {
  if (!buttonIdOrKeyword) return null;
  const q = buttonIdOrKeyword.toLowerCase().trim();

  // 1. Welcome & Main Categories
  if (q === BUTTON_IDS.WELCOME || q === 'welcome' || q === 'btn_welcome') return SERVICE_IMAGES.welcome;
  if (q === BUTTON_IDS.DM || q === 'btn_dm' || q === 'dm' || q === 'digital marketing' || q === 'digital-marketing') return SERVICE_IMAGES.digitalMarketing;
  if (q === BUTTON_IDS.TECH || q === 'btn_tech' || q === 'tech' || q === 'technology' || q === 'technology solutions') return SERVICE_IMAGES.technologySolutions;
  if (q === BUTTON_IDS.ECOM || q === 'btn_ecom' || q === 'ecom' || q === 'ecommerce' || q === 'e-commerce' || q === 'e-commerce solutions') return SERVICE_IMAGES.ecommerce;

  // 2. Digital Marketing Sub-Services / Buttons
  if (q === BUTTON_IDS.SUB_DM || q === BUTTON_IDS.DIGITAL || q === 'btn_digital' || q === 'btn_sub_dm') return SERVICE_IMAGES.digitalMarketing;
  if (q === BUTTON_IDS.SUB_SEO || q === BUTTON_IDS.SEO || q === 'btn_seo' || q === 'btn_sub_seo' || q === 'seo' || q.includes('seo') || q.includes('search engine') || q.includes('எஸ்சிஓ') || q.includes('எஸ்இஓ') || q.includes('एसईओ')) return SERVICE_IMAGES.seo;
  if (q === BUTTON_IDS.SUB_SMM || q === BUTTON_IDS.SMM || q === 'btn_smm' || q === 'btn_sub_smm' || q === 'smm' || q.includes('social') || q.includes('smm') || q.includes('instagram') || q.includes('facebook') || q.includes('சோஷியல்') || q.includes('सोशल')) return SERVICE_IMAGES.socialMedia;
  if (q === BUTTON_IDS.SUB_ADS || q === BUTTON_IDS.ADS || q === 'btn_ads' || q === 'btn_sub_ads' || q === 'ads' || q.includes('meta ads') || q.includes('google ads') || q.includes('google & meta ads') || q.includes('paid ads') || q.includes('ppc') || q.includes('விளம்பரங்கள்') || q.includes('विज्ञापन')) return SERVICE_IMAGES.googleMetaAds;
  if (q === BUTTON_IDS.SUB_CONTENT || q === BUTTON_IDS.CONTENT || q === 'btn_content' || q === 'btn_sub_content' || q === 'content' || q.includes('content') || q.includes('copywriting') || q.includes('blog') || q.includes('கன்டென்ட்') || q.includes('कंटेंट')) return SERVICE_IMAGES.content;
  if (q === BUTTON_IDS.SUB_BRANDING || q === BUTTON_IDS.BRANDING || q === 'btn_branding' || q === 'btn_sub_branding' || q === 'branding' || q.includes('branding') || q.includes('logo') || q.includes('பிராண்டிங்') || q.includes('லோகோ') || q.includes('ब्रांडिंग') || q.includes('लोगो')) return SERVICE_IMAGES.brandingDesign;

  // 3. Technology Sub-Services / Buttons
  if (q === BUTTON_IDS.SUB_WEB || q === BUTTON_IDS.WEB || q === 'btn_web' || q === 'btn_sub_web' || q === 'web_dev' || q === 'website' || q.includes('website') || q.includes('web development') || q.includes('வலைத்தளம்') || q.includes('வெப்சைட்') || q.includes('वेबसाइट')) return SERVICE_IMAGES.websiteDevelopment;
  if (q === BUTTON_IDS.SUB_MOBILE || q === BUTTON_IDS.MOBILE || q === 'btn_mobile' || q === 'btn_sub_mobile' || q === 'mobile_app' || q === 'mobile' || q.includes('mobile app') || q.includes('app') || q.includes('செயலி') || q.includes('மொபைல்') || q.includes('मोबाइल') || q.includes('ऐप')) return SERVICE_IMAGES.mobileApp;
  if (q === BUTTON_IDS.SUB_SOFTWARE || q === BUTTON_IDS.CUSTOM_SOFTWARE || q === 'btn_software' || q === 'btn_sub_software' || q === 'custom_software' || q === 'software' || q.includes('software') || q.includes('சாஃப்ட்வேர்') || q.includes('மென்பொருள்') || q.includes('सॉफ्टवेयर')) return SERVICE_IMAGES.customSoftware;
  if (q === BUTTON_IDS.SUB_CRM || q === BUTTON_IDS.CRM_ERP || q === 'btn_crm' || q === 'btn_sub_crm' || q === 'crm_erp' || q === 'crm' || q === 'erp' || q.includes('crm') || q.includes('erp') || q.includes('சிஆர்எம்') || q.includes('ஈஆர்பி') || q.includes('सीआरएम') || q.includes('ईआरपी')) return SERVICE_IMAGES.crmErp;
  if (q === BUTTON_IDS.SUB_BOT || q === BUTTON_IDS.WHATSAPP_BOT || q === 'btn_bot' || q === 'btn_sub_bot' || q === 'bot_ai' || q === 'whatsapp' || q === 'chatbot' || q.includes('whatsapp') || q.includes('வாட்ஸ்அப்') || q.includes('व्हाट्सएप') || q.includes('chatbot') || q.includes('சாட்பாட்') || q.includes('चैटबॉट')) return SERVICE_IMAGES.whatsappBott;
  if (q === BUTTON_IDS.AUTOMATION || q === 'btn_automation' || q === 'automation' || q.includes('automation') || q.includes('தானியங்கி') || q.includes('स्वचालन')) return SERVICE_IMAGES.businessAutomation;
  if (q === BUTTON_IDS.AI_BUSINESS || q === 'btn_ai' || q === 'ai_business' || q === 'ai' || q.includes('ai business') || q.includes('artificial intelligence') || q.includes('ஏஐ') || q.includes('एआई')) return SERVICE_IMAGES.aiBusinessSolution;

  // 4. E-Commerce Sub-Services / Buttons
  if (q === BUTTON_IDS.SUB_STORE || q === BUTTON_IDS.ONLINE_STORE || q === 'btn_store' || q === 'btn_sub_store' || q === 'online_store' || q.includes('online store') || q.includes('store') || q.includes('ஆன்லைன் ஸ்டோர்') || q.includes('ऑनलाइन स्टोर')) return SERVICE_IMAGES.onlineStore;
  if (q === BUTTON_IDS.SUB_LISTING || q === BUTTON_IDS.PRODUCT_LISTING || q === 'btn_product_listing' || q === 'btn_sub_listing' || q === 'product_listing' || q.includes('product listing') || q.includes('product management') || q.includes('catalog') || q.includes('inventory') || q.includes('தயாரிப்பு') || q.includes('उत्पाद')) return SERVICE_IMAGES.productListingMgmt;
  if (q === BUTTON_IDS.SUB_B2B || q === BUTTON_IDS.B2B_B2C || q === 'btn_b2b_b2c' || q === 'btn_sub_b2b' || q === 'b2b_b2c' || q.includes('b2b') || q.includes('b2c') || q.includes('wholesale') || q.includes('retail') || q.includes('மொத்த விற்பனை') || q.includes('थोक')) return SERVICE_IMAGES.b2bB2cSales;
  if (q === BUTTON_IDS.SUB_ECOM_APP || q === BUTTON_IDS.ECOM_APP || q === 'btn_ecom_app' || q === 'btn_sub_ecom_app' || q === 'ecom_web_app' || q.includes('shopping app') || q.includes('shopping website')) return SERVICE_IMAGES.ecommerce;
  if (q === BUTTON_IDS.SUB_ECOM_MARKETING || q.includes('ecommerce marketing') || q.includes('e-commerce marketing')) return SERVICE_IMAGES.ecommerce;
  if (q === BUTTON_IDS.SUB_PAYMENT || q.includes('payment gateway') || q.includes('payment integration')) return SERVICE_IMAGES.ecommerce;

  return null;
}

// ─── Video Mapping (GitHub Raw URLs for Reliable Video Delivery) ─────────────
const GITHUB_RAW_VIDEO_BASE = 'https://raw.githubusercontent.com/vigneshkk1211-design/Gloaro_Chatbot/main/apps/backend/src/assets/videos';

export const SERVICE_VIDEOS = {
  crm:        process.env.VIDEO_URL_CRM        || `${GITHUB_RAW_VIDEO_BASE}/intro.mp4`,
  management: process.env.VIDEO_URL_MANAGEMENT || `${GITHUB_RAW_VIDEO_BASE}/service-demo.mp4`,
} as const;

export function getServiceVideoUrl(queryOrKeyword: string): string | null {
  const q = queryOrKeyword.toLowerCase().trim();
  if (
    q.includes('crm') ||
    q.includes('erp') ||
    q.includes('சிஆர்எம்') ||
    q.includes('ஈஆர்பி') ||
    q.includes('सीआरएम') ||
    q.includes('ईआरपी')
  ) {
    return SERVICE_VIDEOS.crm;
  }
  if (
    q.includes('product listing') ||
    q.includes('product management') ||
    q.includes('catalog management') ||
    q.includes('inventory management') ||
    q.includes('தயாரிப்பு மேலாண்மை') ||
    q.includes('தயாரிப்பு பட்டியல்') ||
    q.includes('उत्पाद सूची') ||
    q.includes('उत्पाद प्रबंधन')
  ) {
    return SERVICE_VIDEOS.management;
  }
  return null;
}

// ─── Sub-Service → Parent Category Mapper ────────────────────────────────────
/**
 * Given any free-text keyword, resolves the parent-category button ID
 * (BUTTON_IDS.DM | BUTTON_IDS.TECH | BUTTON_IDS.ECOM) so the controller
 * can send the correct service image FIRST before the sub-service text reply.
 */
export function getSubServiceCategory(keyword: string): string | null {
  const q = keyword.toLowerCase().trim();

  // ── Digital Marketing sub-services ──
  const dmTerms = [
    'social media', 'smm', 'instagram', 'facebook', 'linkedin',
    'google ads', 'meta ads', 'facebook ads', 'paid ads', 'ppc', 'lead generation',
    'seo', 'search engine', 'keyword ranking', 'organic traffic', 'google ranking',
    'content marketing', 'content writing', 'copywriting', 'blog writing', 'content',
    'branding', 'logo design', 'graphic design', 'brand identity',
    // Tamil
    'சோஷியல் மீடியா', 'எஸ்எம்எம்', 'இன்ஸ்டாகிராம்', 'பேஸ்புக்',
    'கூகுள் விளம்பரங்கள்', 'மெட்டா விளம்பரங்கள்', 'விளம்பரங்கள்',
    'தேடுபொறி', 'எஸ்சிஓ', 'எஸ்இஓ',
    'கன்டென்ட் மார்க்கெட்டிங்', 'கன்டென்ட்', 'உள்ளடக்கம்',
    'பிராண்டிங்', 'லோகோ', 'டிசைன்',
    // Hindi
    'सोशल मीडिया', 'एसएमएम', 'इंस्टाग्राम', 'फेसबुक',
    'गूगल विज्ञापन', 'मेटा विज्ञापन', 'विज्ञापन',
    'एसईओ', 'सर्च इंजन',
    'कंटेंट', 'सामग्री',
    'ब्रांडिंग', 'लोगो', 'डिज़ाइन',
  ];
  if (dmTerms.some((t) => q.includes(t))) return BUTTON_IDS.DM;

  // ── Technology Solutions sub-services ──
  const techTerms = [
    'website', 'web development', 'web design', 'web portal', 'web app',
    'mobile app', 'android app', 'ios app', 'flutter', 'react native',
    'custom software', 'software development', 'software solution',
    'crm', 'erp',
    'whatsapp bot', 'chatbot', 'ai solution', 'whatsapp automation',
    // Tamil
    'வெப்சைட்', 'வலைத்தளம்', 'வலைப்பக்கம்',
    'மொபைல் ஆப்', 'செயலி', 'ஆப் உருவாக்கம்',
    'கஸ்டம் சாஃப்ட்வேர்', 'சாஃப்ட்வேர்', 'மென்பொருள்',
    'சிஆர்எம்', 'ஈஆர்பி',
    'வாட்ஸ்அப் பாட்', 'சாட்பாட்', 'ஏஐ',
    // Hindi
    'वेबसाइट', 'वेब',
    'मोबाइल ऐप', 'ऐप',
    'सॉफ्टवेयर',
    'सीआरएम', 'ईआरपी',
    'व्हाट्सएप बॉट', 'चैटबॉट', 'एआई',
  ];
  if (techTerms.some((t) => q.includes(t))) return BUTTON_IDS.TECH;

  // ── E-Commerce Solutions sub-services ──
  const ecomTerms = [
    'ecommerce', 'e-commerce', 'online store', 'shopping website', 'shopping app',
    'product listing', 'product management', 'catalog', 'inventory',
    'b2b', 'b2c', 'wholesale', 'retail',
    'ecommerce marketing', 'e-commerce marketing', 'online store marketing',
    'payment gateway', 'payment integration', 'upi', 'razorpay', 'stripe',
    // Tamil
    'இ-காமர்ஸ்', 'ஆன்லைன் ஸ்டோர்',
    'தயாரிப்பு மேலாண்மை', 'தயாரிப்பு பட்டியல்', 'கேட்டலாக்',
    'மொத்த விற்பனை', 'சில்லறை விற்பனை',
    'பேமெண்ட்',
    // Hindi
    'ई-कॉमर्स', 'ऑनलाइन स्टोर',
    'उत्पाद सूची', 'उत्पाद प्रबंधन', 'कैटलॉग', 'इन्वेंट्री',
    'थोक', 'खुदरा',
    'पेमेंट',
  ];
  if (ecomTerms.some((t) => q.includes(t))) return BUTTON_IDS.ECOM;

  return null;
}

// ─── DB session language markers ──────────────────────────────────────────────
/** Builds the hidden marker stored as a bot message body: e.g. "[Lang:ta]" */
export function buildLangMarker(lang: Lang): string { return `[Lang:${lang}]`; }

/** Parses "[Lang:ta]" → 'ta'; returns null if not a marker */
export function parseLangMarker(body: string): Lang | null {
  const m = body.match(/^\[Lang:(ta|hi|en)\]$/);
  return m ? (m[1] as Lang) : null;
}

/** Maps a language button ID → Lang code */
export function buttonIdToLang(id: string): Lang | null {
  if (id === BUTTON_IDS.LANG_TA) return 'ta';
  if (id === BUTTON_IDS.LANG_EN) return 'en';
  if (id === BUTTON_IDS.LANG_HI) return 'hi';
  return null;
}

// ─── Trigger keyword lists ────────────────────────────────────────────────────
export const MENU_TRIGGER_KEYWORDS: string[] = [
  'hi', 'hello', 'hey', 'start', 'menu', 'help',
  'services', 'service', 'good morning', 'good evening',
  'வணக்கம்', 'தொடங்கு', 'नमस्ते', 'नमस्कार',
];

export const PRICING_KEYWORDS: string[] = [
  'price', 'pricing', 'cost', 'budget', 'charge', 'charges', 'fee', 'fees',
  'rate', 'rates', 'quote', 'quotation', 'how much', 'what is the cost',
  'what is the price', 'expense', 'affordable', 'cheap', 'expensive', 'amount',
  'விலை', 'கட்டணம்', 'எவ்வளவு',
  'मूल्य', 'शुल्क', 'कितना', 'खर्च', 'दाम',
];

export const THANK_YOU_KEYWORDS: string[] = [
  'thank you', 'thanks', 'thank u', 'thx', 'thankyou', 'ty',
  'நன்றி', 'மிக்க நன்றி',
  'धन्यवाद', 'शुक्रिया', 'बहुत धन्यवाद',
];

export function isThankYouMessage(text: string): boolean {
  const clean = text.toLowerCase().trim();
  return THANK_YOU_KEYWORDS.some((kw) => clean === kw || clean.startsWith(`${kw} `) || clean.endsWith(` ${kw}`));
}

export function getThankYouReply(lang: Lang = 'en'): string {
  const c = COMPANY_INFO;
  if (lang === 'ta') {
    return (
      '🙏 *GLOARO PVT LTD*-ஐ தொடர்பு கொண்டதற்கு நன்றி!\n\n' +
      'கூடுதல் உதவிக்கு எப்போது வேண்டுமானாலும் எங்களைத் தொடர்பு கொள்ளலாம்.\n\n' +
      `📞 தொடர்புக்கு: ${c.phones}\n📧 மின்னஞ்சல்: ${c.email}`
    );
  }
  if (lang === 'hi') {
    return (
      '🙏 *GLOARO PVT LTD* से संपर्क करने के लिए धन्यवाद!\n\n' +
      'यदि आपको किसी अन्य सहायता की आवश्यकता है तो कभी भी हमसे संपर्क कर सकते हैं।\n\n' +
      `📞 संपर्क: ${c.phones}\n📧 ईमेल: ${c.email}`
    );
  }
  return (
    '🙏 Thank you for contacting *GLOARO PVT LTD*!\n\n' +
    'Feel free to reach out anytime if you need further assistance.\n\n' +
    `📞 Contact: ${c.phones}\n📧 Email: ${c.email}`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Language selection prompt (no flags, clean text)
// ─────────────────────────────────────────────────────────────────────────────
export function getLanguageSelectionContent(): { body: string; buttons: { id: string; title: string }[] } {
  return {
    body:
      '👋 Welcome to *GLOARO PVT LTD*!\n\n' +
      'Please select your preferred language:\n' +
      'தயவுசெய்து உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்:\n' +
      'कृपया अपनी भाषा चुनें:',
    buttons: [
      { id: BUTTON_IDS.LANG_EN, title: 'English' },
      { id: BUTTON_IDS.LANG_TA, title: 'தமிழ்' },
      { id: BUTTON_IDS.LANG_HI, title: 'हिंदी' },
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Welcome message + 3 service buttons (after language is chosen)
// ─────────────────────────────────────────────────────────────────────────────
export function getServiceMenuContent(lang: Lang): {
  body: string;
  buttons: { id: string; title: string }[];
} {
  if (lang === 'ta') {
    return {
      body: (
        'வணக்கம்! GLOARO PVT LTD-க்கு வரவேற்கிறோம்! 🚀✨\n\n' +
        '"ஒரு சுற்றுச்சூழல் அமைப்பு. பல வணிகத் தீர்வுகள்."\n\n' +
        'தொழில்முனைவோர், ஸ்டார்ட்அப்கள் மற்றும் நிறுவனங்களை வளர்க்க உதவும் தொழில்நுட்ப சுற்றுச்சூழல் அமைப்பு நாங்கள்.\n\n' +
        'இன்று உங்கள் வணிகத்தை எப்படி உயர்த்த உதவ முடியும்? கீழே உள்ள சேவைகளில் ஒன்றைத் தேர்ந்தெடுக்கவும்:'
      ),
      buttons: [
        { id: BUTTON_IDS.DM,   title: 'டிஜிட்டல் மார்க்கெட்டிங்' },
        { id: BUTTON_IDS.TECH, title: 'தொழில்நுட்ப தீர்வுகள்' },
        { id: BUTTON_IDS.ECOM, title: 'இ-காமர்ஸ் தீர்வுகள்' },
      ],
    };
  }
  if (lang === 'hi') {
    return {
      body: (
        'नमस्ते! GLOARO PVT LTD में आपका स्वागत है! 🚀✨\n\n' +
        '"एक पारिस्थितिकी तंत्र। कई व्यावसायिक समाधान।"\n\n' +
        'हम उद्यमियों, स्टार्टअप्स और उद्यमों को सशक्त बनाने वाली एक तकनीकी कंपनी हैं।\n\n' +
        'आज हम आपके व्यवसाय को बढ़ाने में कैसे मदद कर सकते हैं? कृपया नीचे एक सेवा चुनें:'
      ),
      buttons: [
        { id: BUTTON_IDS.DM,   title: 'डिजिटल मार्केटिंग' },
        { id: BUTTON_IDS.TECH, title: 'तकनीकी समाधान' },
        { id: BUTTON_IDS.ECOM, title: 'ई-कॉमर्स समाधान' },
      ],
    };
  }
  // English (default)
  return {
    body: (
      '👋 Hello! Welcome to *GLOARO PVT LTD*! 🚀✨\n\n' +
      '"One Ecosystem. Multiple Business Solutions."\n\n' +
      'We are a technology-driven business ecosystem empowering entrepreneurs, startups, SMEs, and enterprises.\n\n' +
      'How can we help scale your business today? Please choose a service below:'
    ),
    buttons: [
      { id: BUTTON_IDS.DM,   title: 'Digital Marketing' },
      { id: BUTTON_IDS.TECH, title: 'Technology Solutions' },
      { id: BUTTON_IDS.ECOM, title: 'E-Commerce Solutions' },
    ],
  };
}

/** Returns the 3 main service buttons with the mapped Welcome Image URL */
export function getMainServiceButtons(lang: Lang = 'en'): {
  imageUrl: string;
  buttons: { id: string; title: string }[];
} {
  return {
    imageUrl: SERVICE_IMAGES.welcome,
    buttons: getServiceMenuContent(lang).buttons,
  };
}

/** @deprecated alias — bot-engine.service.ts uses getWelcomeContent */
export function getWelcomeContent(lang: Lang): {
  body: string;
  buttons: { id: string; title: string }[];
} {
  return getServiceMenuContent(lang);
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — Service button click → bullet list ONLY (no contact info)
// ─────────────────────────────────────────────────────────────────────────────
export function getButtonServiceList(buttonId: string, lang: Lang): string {
  if (lang === 'ta') {
    if (buttonId === BUTTON_IDS.DM) {
      return (
        '📈 *டிஜிட்டல் மார்க்கெட்டிங் சேவைகள்*\n\n' +
        '• *டிஜிட்டல் மார்க்கெட்டிங்:* இலக்கு வாடிக்கையாளர்களை அடைய ஆன்லைனில் விளம்பரப்படுத்துதல்.\n' +
        '• *சோஷியல் மீடியா மார்க்கெட்டிங் (SMM):* இன்ஸ்டாகிராம், பேஸ்புக் மூலம் வாடிக்கையாளர்களை ஈர்ப்பது.\n' +
        '• *கூகுள் & மெட்டா விளம்பரங்கள்:* உடனடி லீட்ஸ் மற்றும் விற்பனைக்கான விளம்பரங்கள்.\n' +
        '• *SEO (தேடுபொறி உகப்பாக்கம்):* கூகுளில் உங்கள் வெப்சைட்டை முன்னிலைப்படுத்துவது.\n' +
        '• *கன்டென்ட் மார்க்கெட்டிங்:* வாடிக்கையாளர்களை ஈர்க்கும் தரமான உள்ளடக்கம் உருவாக்குதல்.\n' +
        '• *பிராண்டிங் & டிசைன்:* தொழில்முறை லோகோ மற்றும் பிராண்ட் வடிவமைப்பு.\n\n' +
        '_குறிப்பிட்ட சேவை பெயரை தட்டச்சு செய்து விரிவான விவரங்களைப் பெறுங்கள்!_'
      );
    }
    if (buttonId === BUTTON_IDS.TECH) {
      return (
        '💻 *தொழில்நுட்ப தீர்வுகள்*\n\n' +
        '• *வெப்சைட் உருவாக்கம்:* வேகமான, நவீன மற்றும் ரெஸ்பான்சிவ் வலைத்தளங்கள்.\n' +
        '• *மொபைல் ஆப் உருவாக்கம்:* ஆண்ட்ராய்டு மற்றும் ஐஓஎஸ் செயலிகள்.\n' +
        '• *கஸ்டம் சாஃப்ட்வேர்:* உங்கள் வணிகத் தேவைக்கேற்ப பிரத்யேக மென்பொருள்.\n' +
        '• *CRM & ERP தீர்வுகள்:* வாடிக்கையாளர் தரவு மற்றும் செயல்பாடுகளை எளிமைப்படுத்துதல்.\n' +
        '• *வாட்ஸ்அப் பாட் & AI:* 24/7 தானியங்கி வாடிக்கையாளர் ஆதரவு.\n\n' +
        '_குறிப்பிட்ட சேவை பெயரை தட்டச்சு செய்து விரிவான விவரங்களைப் பெறுங்கள்!_'
      );
    }
    return (
      '🛒 *இ-காமர்ஸ் தீர்வுகள்*\n\n' +
      '• *இ-காமர்ஸ் வெப்சைட் & ஆப்:* ஆன்லைன் ஷாப்பிங் ஸ்டோர் உருவாக்கம்.\n' +
      '• *ஆன்லைன் ஸ்டோர் டெவலப்மென்ட்:* எளிமையான டிஜிட்டல் ஸ்டோர் அமைப்பு.\n' +
      '• *தயாரிப்பு மேலாண்மை (Product Listing):* கேட்டலாக் மற்றும் இன்வெண்டரி மேலாண்மை.\n' +
      '• *B2B & B2C விற்பனை:* மொத்த மற்றும் சில்லறை விற்பனை சேனல்கள்.\n' +
      '• *இ-காமர்ஸ் மார்க்கெட்டிங்:* ஆன்லைன் விற்பனையை அதிகரிக்கும் விளம்பர உத்திகள்.\n' +
      '• *பேமெண்ட் கேட்வே:* பாதுகாப்பான யுபிஐ, கார்டு பரிவர்த்தனைகள்.\n\n' +
      '_குறிப்பிட்ட சேவை பெயரை தட்டச்சு செய்து விரிவான விவரங்களைப் பெறுங்கள்!_'
    );
  }

  if (lang === 'hi') {
    if (buttonId === BUTTON_IDS.DM) {
      return (
        '📈 *डिजिटल मार्केटिंग सेवाएँ*\n\n' +
        '• *डिजिटल मार्केटिंग:* लक्षित ग्राहकों तक पहुँचना।\n' +
        '• *सोशल मीडिया मार्केटिंग (SMM):* इंस्टाग्राम और फेसबुक पर जुड़ाव।\n' +
        '• *गूगल और मेटा विज्ञापन:* त्वरित लीड और बिक्री।\n' +
        '• *एसईओ (सर्च इंजन ऑप्टिमाइजेशन):* गूगल खोज में रैंकिंग बढ़ाना।\n' +
        '• *कंटेंट मार्केटिंग:* आकर्षक कंटेंट बनाना।\n' +
        '• *ब्रांडिंग और डिज़ाइन:* पेशेवर लोगो और विजुअल डिज़ाइन।\n\n' +
        '_किसी विशेष सेवा का नाम टाइप करके विस्तृत जानकारी पाएं!_'
      );
    }
    if (buttonId === BUTTON_IDS.TECH) {
      return (
        '💻 *तकनीकी समाधान*\n\n' +
        '• *वेबसाइट डेवलपमेंट:* आधुनिक और तेज़ वेबसाइटें।\n' +
        '• *मोबाइल ऐप डेवलपमेंट:* एंड्रॉइड और आईओएस ऐप।\n' +
        '• *कस्टम सॉफ्टवेयर:* आपकी व्यावसायिक ज़रूरतों के अनुसार।\n' +
        '• *CRM और ERP समाधान:* डेटा और संचालन को सुव्यवस्थित करना।\n' +
        '• *व्हाट्सएप बॉट और AI:* 24/7 स्वचालित सहायता।\n\n' +
        '_किसी विशेष सेवा का नाम टाइप करके विस्तृत जानकारी पाएं!_'
      );
    }
    return (
      '🛒 *ई-कॉमर्स समाधान*\n\n' +
      '• *ई-कॉमर्स वेबसाइट और ऐप:* ऑनलाइन शॉपिंग स्टोर।\n' +
      '• *ऑनलाइन स्टोर विकास:* सहज खरीदारी अनुभव।\n' +
      '• *उत्पाद सूची और प्रबंधन:* कैटलॉग इन्वेंट्री प्रबंधन।\n' +
      '• *B2B और B2C बिक्री:* थोक और खुदरा बिक्री चैनल।\n' +
      '• *ई-कॉमर्स मार्केटिंग:* ऑनलाइन बिक्री बढ़ाने के अभियान।\n' +
      '• *पेमेंट गेटवे एकीकरण:* सुरक्षित भुगतान विकल्प।\n\n' +
      '_किसी विशेष सेवा का नाम टाइप करके विस्तृत जानकारी पाएं!_'
    );
  }

  // English (default)
  if (buttonId === BUTTON_IDS.DM) {
    return (
      '📈 *Digital Marketing Services*\n\n' +
      '• *Digital Marketing:* Promoting your business online to reach targeted customers.\n' +
      '• *Social Media Marketing (SMM):* Engaging audiences across Instagram, Facebook, and LinkedIn.\n' +
      '• *Google & Meta Ads:* Running targeted ads to drive instant leads and sales.\n' +
      '• *SEO (Search Engine Optimization):* Optimizing your website to rank higher on Google.\n' +
      '• *Content Marketing:* Creating blogs, videos, and content that attract customers.\n' +
      '• *Branding & Design:* Crafting a unique brand identity with professional logos.\n\n' +
      '_Reply with any service name above to get detailed information!_'
    );
  }
  if (buttonId === BUTTON_IDS.TECH) {
    return (
      '💻 *Technology Solutions*\n\n' +
      '• *Website Development:* Building fast, responsive, and modern websites.\n' +
      '• *Mobile App Development:* High-performance apps for Android and iOS.\n' +
      '• *Custom Software Development:* Tailor-made software solutions for your business.\n' +
      '• *CRM & ERP Solutions:* Streamlining customer relations and business operations.\n' +
      '• *WhatsApp BOT & AI Solutions:* Automating 24/7 customer support.\n\n' +
      '_Reply with any service name above to get detailed information!_'
    );
  }
  // btn_ecom
  return (
    '🛒 *E-Commerce Solutions*\n\n' +
    '• *E-Commerce Website & App:* Launching feature-rich online shopping stores.\n' +
    '• *Online Store Development:* User-friendly digital stores built to convert.\n' +
    '• *Product Listing & Management:* Catalog and inventory management.\n' +
    '• *B2B & B2C Sales:* Robust digital sales channels for wholesale and retail.\n' +
    '• *E-Commerce Marketing:* Result-driven campaigns to maximize online sales.\n' +
    '• *Payment Gateway Integration:* Secure UPI, credit card, and wallet payments.\n\n' +
    '_Reply with any service name above to get detailed information!_'
  );
}

/** Helper returning both the bullet list text and the mapped ImgBB image URL */
export function getButtonServiceDetail(buttonId: string, lang: Lang = 'en'): {
  text: string;
  imageUrl: string | null;
} {
  return {
    text: getButtonServiceList(buttonId, lang),
    imageUrl: getServiceImageUrl(buttonId),
  };
}

// ─── Official Contact Footer Helper ──────────────────────────────────────────
export function getContactFooter(lang: Lang): string {
  const c = COMPANY_INFO;
  if (lang === 'ta') {
    return `📞 தொடர்புக்கு: ${c.phones}\n📧 மின்னஞ்சல்: ${c.email}`;
  }
  if (lang === 'hi') {
    return `📞 संपर्क: ${c.phones}\n📧 ईमेल: ${c.email}`;
  }
  return `📞 Contact: ${c.phones}\n📧 Email: ${c.email}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Interactive List Sub-Menu Specifications
// ─────────────────────────────────────────────────────────────────────────────
export interface InteractiveListSection {
  title: string;
  rows: {
    id: string;
    title: string;
    description?: string;
  }[];
}

export interface InteractiveListContent {
  headerText?: string;
  bodyText: string;
  footerText?: string;
  buttonText: string;
  sections: InteractiveListSection[];
}

export function getCategorySubMenuContent(categoryId: string, lang: Lang = 'en'): InteractiveListContent {
  const cat = categoryId.toLowerCase().trim();

  // 1. Digital Marketing Sub-Menu
  if (cat === BUTTON_IDS.DM || cat === 'btn_dm' || cat === 'dm' || cat.includes('digital marketing') || cat.includes('டிஜிட்டல்') || cat.includes('डिजिटल')) {
    if (lang === 'ta') {
      return {
        headerText: '📈 டிஜிட்டல் மார்க்கெட்டிங்',
        bodyText: 'எங்கள் நிபுணத்துவம் வாய்ந்த டிஜிட்டல் மார்க்கெட்டிங் சேவைகளைக் கண்டறியுங்கள். விவரங்களை அறிய கீழே உள்ள சேவைகளில் ஒன்றைத் தேர்ந்தெடுக்கவும்:',
        footerText: 'GLOARO PVT LTD',
        buttonText: 'சேவைகள் பட்டியல்',
        sections: [
          {
            title: 'டிஜிட்டல் மார்க்கெட்டிங்',
            rows: [
              { id: BUTTON_IDS.SUB_DM,        title: 'டிஜிட்டல் மார்க்கெட்டிங்' },
              { id: BUTTON_IDS.SUB_SMM,       title: 'சோஷியல் மீடியா (SMM)' },
              { id: BUTTON_IDS.SUB_ADS,       title: 'கூகுள் & மெட்டா Ads' },
              { id: BUTTON_IDS.SUB_SEO,       title: 'SEO (தேடுபொறி)' },
              { id: BUTTON_IDS.SUB_CONTENT,   title: 'கன்டென்ட் மார்க்கெட்டிங்' },
              { id: BUTTON_IDS.SUB_BRANDING,  title: 'பிராண்டிங் & டிசைன்' },
            ],
          },
        ],
      };
    }
    if (lang === 'hi') {
      return {
        headerText: '📈 डिजिटल मार्केटिंग',
        bodyText: 'हमारी विशेष डिजिटल मार्केटिंग सेवाओं को एक्सप्लोर करें। विस्तृत जानकारी के लिए नीचे एक सेवा चुनें:',
        footerText: 'GLOARO PVT LTD',
        buttonText: 'सेवाएं देखें',
        sections: [
          {
            title: 'डिजिटल मार्केटिंग',
            rows: [
              { id: BUTTON_IDS.SUB_DM,        title: 'डिजिटल मार्केटिंग' },
              { id: BUTTON_IDS.SUB_SMM,       title: 'सोशल मीडिया (SMM)' },
              { id: BUTTON_IDS.SUB_ADS,       title: 'गूगल और मेटा विज्ञापन' },
              { id: BUTTON_IDS.SUB_SEO,       title: 'एसईओ (SEO)' },
              { id: BUTTON_IDS.SUB_CONTENT,   title: 'कंटेंट मार्केटिंग' },
              { id: BUTTON_IDS.SUB_BRANDING,  title: 'ब्रांडिंग और डिज़ाइन' },
            ],
          },
        ],
      };
    }
    // English (default)
    return {
      headerText: '📈 Digital Marketing Services',
      bodyText: 'Explore our high-impact digital marketing solutions designed to scale your brand and generate high-intent leads:',
      footerText: 'GLOARO PVT LTD',
      buttonText: 'View Services',
      sections: [
        {
          title: 'Specialized Services',
          rows: [
            { id: BUTTON_IDS.SUB_DM,        title: 'Digital Marketing' },
            { id: BUTTON_IDS.SUB_SMM,       title: 'Social Media Marketing' },
            { id: BUTTON_IDS.SUB_ADS,       title: 'Google & Meta Ads' },
            { id: BUTTON_IDS.SUB_SEO,       title: 'SEO' },
            { id: BUTTON_IDS.SUB_CONTENT,   title: 'Content Marketing' },
            { id: BUTTON_IDS.SUB_BRANDING,  title: 'Branding & Design' },
          ],
        },
      ],
    };
  }

  // 2. Technology Solutions Sub-Menu
  if (cat === BUTTON_IDS.TECH || cat === 'btn_tech' || cat === 'tech' || cat.includes('technology') || cat.includes('தொழில்நுட்ப') || cat.includes('तकनीक')) {
    if (lang === 'ta') {
      return {
        headerText: '💻 தொழில்நுட்ப தீர்வுகள்',
        bodyText: 'எங்கள் நவீன மென்பொருள் மற்றும் தொழில்நுட்ப சேவைகளைக் கண்டறியுங்கள். விவரங்களை அறிய கீழே உள்ள சேவைகளில் ஒன்றைத் தேர்ந்தெடுக்கவும்:',
        footerText: 'GLOARO PVT LTD',
        buttonText: 'சேவைகள் பட்டியல்',
        sections: [
          {
            title: 'தொழில்நுட்ப தீர்வுகள்',
            rows: [
              { id: BUTTON_IDS.SUB_WEB,      title: 'வெப்சைட் உருவாக்கம்' },
              { id: BUTTON_IDS.SUB_MOBILE,   title: 'மொபைல் ஆப் உருவாக்கம்' },
              { id: BUTTON_IDS.SUB_SOFTWARE, title: 'கஸ்டம் சாஃப்ட்வேர்' },
              { id: BUTTON_IDS.SUB_CRM,      title: 'CRM & ERP தீர்வுகள்' },
              { id: BUTTON_IDS.SUB_BOT,      title: 'வாட்ஸ்அப் பாட் & AI' },
            ],
          },
        ],
      };
    }
    if (lang === 'hi') {
      return {
        headerText: '💻 तकनीकी समाधान',
        bodyText: 'हमारे आधुनिक सॉफ्टवेयर और तकनीकी समाधानों को एक्सप्लोर करें। विस्तृत जानकारी के लिए नीचे एक सेवा चुनें:',
        footerText: 'GLOARO PVT LTD',
        buttonText: 'सेवाएं देखें',
        sections: [
          {
            title: 'तकनीकी समाधान',
            rows: [
              { id: BUTTON_IDS.SUB_WEB,      title: 'वेबसाइट डेवलपमेंट' },
              { id: BUTTON_IDS.SUB_MOBILE,   title: 'मोबाइल ऐप डेवलपमेंट' },
              { id: BUTTON_IDS.SUB_SOFTWARE, title: 'कस्टम सॉफ्टवेयर' },
              { id: BUTTON_IDS.SUB_CRM,      title: 'CRM और ERP समाधान' },
              { id: BUTTON_IDS.SUB_BOT,      title: 'व्हाट्सएप बॉट और AI' },
            ],
          },
        ],
      };
    }
    // English (default)
    return {
      headerText: '💻 Technology Solutions',
      bodyText: 'Discover our robust enterprise technologies and custom software engineered to accelerate your business operations:',
      footerText: 'GLOARO PVT LTD',
      buttonText: 'View Services',
      sections: [
        {
          title: 'Specialized Services',
          rows: [
            { id: BUTTON_IDS.SUB_WEB,      title: 'Website Development' },
            { id: BUTTON_IDS.SUB_MOBILE,   title: 'Mobile App Development' },
            { id: BUTTON_IDS.SUB_SOFTWARE, title: 'Custom Software' },
            { id: BUTTON_IDS.SUB_CRM,      title: 'CRM & ERP' },
            { id: BUTTON_IDS.SUB_BOT,      title: 'WhatsApp & AI Bot' },
          ],
        },
      ],
    };
  }

  // 3. E-Commerce Solutions Sub-Menu (default)
  if (lang === 'ta') {
    return {
      headerText: '🛒 இ-காமர்ஸ் தீர்வுகள்',
      bodyText: 'எங்கள் விரிவான இ-காமர்ஸ் மற்றும் ஆன்லைன் விற்பனை சேவைகளைக் கண்டறியுங்கள். விவரங்களை அறிய கீழே உள்ள சேவைகளில் ஒன்றைத் தேர்ந்தெடுக்கவும்:',
      footerText: 'GLOARO PVT LTD',
      buttonText: 'சேவைகள் பட்டியல்',
      sections: [
        {
          title: 'இ-காமர்ஸ் தீர்வுகள்',
          rows: [
            { id: BUTTON_IDS.SUB_ECOM_APP,        title: 'இ-காமர்ஸ் வெப்சைட் & ஆப்' },
            { id: BUTTON_IDS.SUB_STORE,           title: 'ஆன்லைன் ஸ்டோர் அமைப்பு' },
            { id: BUTTON_IDS.SUB_LISTING,         title: 'தயாரிப்பு மேலாண்மை' },
            { id: BUTTON_IDS.SUB_B2B,             title: 'B2B & B2C விற்பனை' },
            { id: BUTTON_IDS.SUB_ECOM_MARKETING,  title: 'இ-காமர்ஸ் மார்க்கெட்டிங்' },
            { id: BUTTON_IDS.SUB_PAYMENT,         title: 'பேமெண்ட் கேட்வே' },
          ],
        },
      ],
    };
  }
  if (lang === 'hi') {
    return {
      headerText: '🛒 ई-कॉमर्स समाधान',
      bodyText: 'हमारे संपूर्ण ई-कॉमर्स और ऑनलाइन बिक्री समाधानों को एक्सप्लोर करें। विस्तृत जानकारी के लिए नीचे एक सेवा चुनें:',
      footerText: 'GLOARO PVT LTD',
      buttonText: 'सेवाएं देखें',
      sections: [
        {
          title: 'ई-कॉमर्स समाधान',
          rows: [
            { id: BUTTON_IDS.SUB_ECOM_APP,        title: 'ई-कॉमर्स वेबसाइट व ऐप' },
            { id: BUTTON_IDS.SUB_STORE,           title: 'ऑनलाइन स्टोर विकास' },
            { id: BUTTON_IDS.SUB_LISTING,         title: 'उत्पाद सूची और प्रबंधन' },
            { id: BUTTON_IDS.SUB_B2B,             title: 'B2B और B2C बिक्री' },
            { id: BUTTON_IDS.SUB_ECOM_MARKETING,  title: 'ई-कॉमर्स मार्केटिंग' },
            { id: BUTTON_IDS.SUB_PAYMENT,         title: 'पेमेंट गेटवे एकीकरण' },
          ],
        },
      ],
    };
  }
  // English (default)
  return {
    headerText: '🛒 E-Commerce Solutions',
    bodyText: 'Empower your digital commerce ecosystem with our proven e-commerce platforms, catalog operations, and conversion marketing:',
    footerText: 'GLOARO PVT LTD',
    buttonText: 'View Services',
    sections: [
      {
        title: 'Specialized Services',
        rows: [
          { id: BUTTON_IDS.SUB_ECOM_APP,        title: 'E-Commerce Web & App' },
          { id: BUTTON_IDS.SUB_STORE,           title: 'Online Store Dev' },
          { id: BUTTON_IDS.SUB_LISTING,         title: 'Product Listing & Mgmt' },
          { id: BUTTON_IDS.SUB_B2B,             title: 'B2B & B2C Sales' },
          { id: BUTTON_IDS.SUB_ECOM_MARKETING,  title: 'E-Commerce Marketing' },
          { id: BUTTON_IDS.SUB_PAYMENT,         title: 'Payment Gateway' },
        ],
      },
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-Service Detail Specifications (Singular Sub-Services)
// ─────────────────────────────────────────────────────────────────────────────
export interface SubServiceDetail {
  id: string;
  keywords: string[];
  en: string;
  ta: string;
  hi: string;
}

export const SUB_SERVICES: SubServiceDetail[] = [
  // 0. Digital Marketing
  {
    id: 'digital_marketing',
    keywords: [
      BUTTON_IDS.SUB_DM, BUTTON_IDS.DIGITAL, 'btn_sub_dm', 'btn_digital',
      'digital marketing', 'digital-marketing', 'online marketing', 'internet marketing',
      'digital promotion', 'online promotion', 'digital',
      'டிஜிட்டல் மார்க்கெட்டிங்', 'டிஜிட்டல் சந்தைப்படுத்தல்', 'ஆன்லைன் விளம்பரம்', 'டிஜிட்டல்',
      'डिजिटल मार्केटिंग', 'ऑनलाइन मार्केटिंग', 'डिजिटल विपणन', 'डिजिटल',
    ],
    en:
      '📈 *Digital Marketing — GLOARO PVT LTD*\n\n' +
      'Accelerate your business growth, generate high-intent leads, and maximize ROI with our 360° performance-driven digital marketing solutions.\n\n' +
      '• Targeted Multi-Channel Customer Acquisition\n' +
      '• Strategic Lead Generation & Conversion Funnels\n' +
      '• Comprehensive Brand Visibility & Market Dominance\n' +
      '• In-depth Analytics, Tracking & Performance Reporting',
    ta:
      '📈 *டிஜிட்டல் மார்க்கெட்டிங் — GLOARO PVT LTD*\n\n' +
      'உங்கள் வணிகத்தை வேகமாக வளர்க்கவும், புதிய வாடிக்கையாளர்களை ஈர்க்கவும் எங்களின் 360° டிஜிட்டல் மார்க்கெட்டிங் சேவைகள் உதவுகின்றன.\n\n' +
      '• இலக்கு வாடிக்கையாளர்களை துல்லியமாக சென்றடைதல்\n' +
      '• உடனடி லீட்ஸ் மற்றும் விற்பனை வாய்ப்புகள்\n' +
      '• பிராண்ட் விழிப்புணர்வு மற்றும் சந்தை விரிவாக்கம்\n' +
      '• துல்லியமான செயல்திறன் கண்காணிப்பு மற்றும் பகுப்பாய்வு',
    hi:
      '📈 *डिजिटल मार्केटिंग — GLOARO PVT LTD*\n\n' +
      'अपने व्यवसाय के विकास को गति दें, उच्च-गुणवत्ता वाले लीड उत्पन्न करें और हमारे 360° प्रदर्शन-आधारित डिजिटल मार्केटिंग समाधानों के साथ आरओआई को अधिकतम करें।\n\n' +
      '• लक्षित मल्टी-चैनल ग्राहक अधिग्रहण\n' +
      '• रणनीतिक लीड जनरेशन और रूपांतरण फ़नल\n' +
      '• व्यापक ब्रांड दृश्यता और बाजार में बढ़त\n' +
      '• गहन एनालिटिक्स, ट्रैकिंग और प्रदर्शन रिपोर्टिंग',
  },

  // 1. Website Development
  {
    id: 'web_dev',
    keywords: [
      BUTTON_IDS.SUB_WEB, BUTTON_IDS.WEB, 'btn_sub_web', 'btn_web',
      'website development', 'web development', 'website design', 'web design',
      'website', 'web portal', 'web dev', 'web app', 'web application',
      'வெப்சைட் உருவாக்கம்', 'வலைத்தளம் உருவாக்கம்', 'வெப்சைட் டிசைன்', 'வெப்சைட்', 'வலைத்தளம்', 'வலைப்பக்கம்',
      'वेबसाइट डेवलपमेंट', 'वेबसाइट विकास', 'वेबसाइट डिजाइन', 'वेबसाइट डिज़ाइन', 'वेबसाइट',
    ],
    en:
      '💻 *Website Development — GLOARO PVT LTD*\n\n' +
      'Website Development: Building fast, modern, responsive, and SEO-optimized websites tailored precisely to your business requirements.\n\n' +
      '• Custom Website Design & UI/UX\n' +
      '• Fast Loading Speed & Secure Hosting Support\n' +
      '• Mobile & Search Engine Friendly (SEO)\n' +
      '• Corporate, Business & Portfolio Portals',
    ta:
      '💻 *வெப்சைட் உருவாக்கம் — GLOARO PVT LTD*\n\n' +
      'Website Development: உங்கள் வணிகத் தேவைகளுக்கேற்ப அதிவேக, நவீன மற்றும் ரெஸ்பான்சிவ் வலைத்தளங்களை நாங்கள் உருவாக்குகிறோம்.\n\n' +
      '• பிரத்யேக வெப்சைட் வடிவமைப்பு மற்றும் கவர்ச்சிகரமான UI/UX\n' +
      '• அதிவேக செயல்பாடு மற்றும் உயர் பாதுகாப்பு\n' +
      '• மொபைல் மற்றும் SEO உகப்பாக்கம்\n' +
      '• கார்ப்பரேட் மற்றும் வணிக வலைத்தளங்கள்',
    hi:
      '💻 *वेबसाइट विकास (Website Development) — GLOARO PVT LTD*\n\n' +
      'Website Development: हम आपके व्यवसाय के लिए तेज़, आधुनिक और रेस्पॉन्सिव वेबसाइटें बनाते हैं जो ग्राहकों को आकर्षित करती हैं।\n\n' +
      '• कस्टम वेबसाइट डिज़ाइन और बेहतरीन UI/UX\n' +
      '• तेज़ लोडिंग गति और सुरक्षित संरचना\n' +
      '• एसईओ और मोबाइल अनुकूलन\n' +
      '• कॉर्पोरेट और व्यावसायिक वेब पोर्टल',
  },

  // 2. Mobile App Development
  {
    id: 'mobile_app',
    keywords: [
      BUTTON_IDS.SUB_MOBILE, BUTTON_IDS.MOBILE, 'btn_sub_mobile', 'btn_mobile',
      'mobile app development', 'mobile app', 'app development', 'android app',
      'ios app', 'mobile application', 'flutter', 'react native', 'app dev', 'mobile', 'app',
      'மொபைல் ஆப் உருவாக்கம்', 'மொபைல் ஆப்', 'செயலி உருவாக்கம்', 'மொபைல் அப்ளிகேஷன்', 'ஆப் உருவாக்கம்', 'மொபைல்', 'ஆப்', 'செயலி',
      'मोबाइल ऐप डेवलपमेंट', 'मोबाइल ऐप विकास', 'मोबाइल ऐप', 'ऐप डेवलपमेंट', 'मोबाइल एप्लिकेशन', 'मोबाइल', 'ऐप',
    ],
    en:
      '📱 *Mobile App Development — GLOARO PVT LTD*\n\n' +
      'We engineer high-performance native and cross-platform mobile apps for Android and iOS devices.\n\n' +
      '• High-performance Android & iOS Apps\n' +
      '• Sleek UI/UX Design & Seamless User Experience\n' +
      '• Scalable APIs & Real-time Database Integration\n' +
      '• Play Store & App Store Launch Assistance',
    ta:
      '📱 *மொபைல் ஆப் உருவாக்கம் — GLOARO PVT LTD*\n\n' +
      'ஆண்ட்ராய்டு மற்றும் ஐஓஎஸ் இயங்குதளங்களுக்கான அதிவேக மற்றும் நவீன மொபைல் செயலிகளை நாங்கள் உருவாக்குகிறோம்.\n\n' +
      '• Android & iOS செயலிகள்\n' +
      '• கவர்ச்சிகரமான UI/UX வடிவமைப்பு\n' +
      '• அதிவேக செயல்பாடு மற்றும் பாதுகாப்பான API கட்டமைப்பு\n' +
      '• பிளே ஸ்டோர் மற்றும் ஆப் ஸ்டோர் வெளியீடு',
    hi:
      '📱 *मोबाइल ऐप डेवलपमेंट — GLOARO PVT LTD*\n\n' +
      'हम एंड्रॉइड और आईओएस के लिए उच्च प्रदर्शन वाले नेटिव और क्रॉस-प्लेटफॉर्म मोबाइल ऐप विकसित करते हैं।\n\n' +
      '• एंड्रॉइड और आईओएस (Android & iOS) ऐप\n' +
      '• सहज और आकर्षक UI/UX इंटरफ़ेस\n' +
      '• स्केलेबल एपीआई और रीयल-टाइम बैकएंड\n' +
      '• प्ले स्टोर और ऐप स्टोर लॉन्च सहायता',
  },

  // 3. Social Media Marketing (SMM)
  {
    id: 'smm',
    keywords: [
      BUTTON_IDS.SUB_SMM, BUTTON_IDS.SMM, 'btn_sub_smm', 'btn_smm',
      'social media marketing', 'smm', 'social media', 'instagram marketing',
      'facebook marketing', 'linkedin marketing', 'social ads', 'insta', 'facebook', 'instagram',
      'சோஷியல் மீடியா மார்க்கெட்டிங்', 'சமூக ஊடக சந்தைப்படுத்தல்', 'சோஷியல் மீடியா', 'இன்ஸ்டாகிராம்', 'பேஸ்புக்', 'எஸ்எம்எம்',
      'सोशल मीडिया मार्केटिंग', 'सोशल मीडिया', 'इंस्टाग्राम मार्केटिंग', 'फेसबुक मार्केटिंग', 'एसएमएम',
    ],
    en:
      '📱 *Social Media Marketing (SMM) — GLOARO PVT LTD*\n\n' +
      'Grow your brand presence and engage active audiences across Instagram, Facebook, LinkedIn, and YouTube.\n\n' +
      '• Social Media Strategy & Page Management\n' +
      '• High-converting Creative Posts, Carousels & Reels\n' +
      '• Targeted Audience Growth & Community Engagement\n' +
      '• Analytics & Performance Optimization',
    ta:
      '📱 *சோஷியல் மீடியா மார்க்கெட்டிங் (SMM) — GLOARO PVT LTD*\n\n' +
      'இன்ஸ்டாகிராம், பேஸ்புக், லிங்க்ட்இன் போன்ற சமூக வலைத்தளங்களில் உங்கள் பிராண்டை வாடிக்கையாளர்களிடம் கொண்டு சேர்க்கிறோம்.\n\n' +
      '• சமூக ஊடக பக்க மேலாண்மை மற்றும் திட்டமிடல்\n' +
      '• கவர்ச்சிகரமான போஸ்ட்கள், கரோசல்கள் மற்றும் ரீல்ஸ்\n' +
      '• பிராண்ட் விழிப்புணர்வு மற்றும் வாடிக்கையாளர் ஈர்ப்பு\n' +
      '• மாதாந்திர செயல்திறன் அறிக்கைகள்',
    hi:
      '📱 *सोशल मीडिया मार्केटिंग (SMM) — GLOARO PVT LTD*\n\n' +
      'इंस्टाग्राम, फेसबुक, लिंक्डइन और यूट्यूब के माध्यम से अपने ब्रांड को बढ़ाएं और लक्षित ग्राहकों तक पहुंचें।\n\n' +
      '• सोशल मीडिया पेज प्रबंधन और कंटेंट रणनीति\n' +
      '• आकर्षक पोस्ट, रील्स और बैनर डिज़ाइन\n' +
      '• ऑडियंस जुड़ाव और ब्रांड ग्रोथ\n' +
      '• मासिक प्रदर्शन और एनालिटिक्स रिपोर्ट',
  },

  // 4. SEO (Search Engine Optimization)
  {
    id: 'seo',
    keywords: [
      BUTTON_IDS.SUB_SEO, BUTTON_IDS.SEO, 'btn_sub_seo', 'btn_seo',
      'search engine optimization', 'seo', 'google ranking', 'search ranking',
      'website ranking', 'keyword ranking', 'organic traffic', 'on-page seo', 'off-page seo',
      'தேடுபொறி உகப்பாக்கம்', 'எஸ்சிஓ', 'எஸ்இஓ', 'கூகுள் ரேங்கிங்', 'தேடுபொறி',
      'सर्च इंजन ऑप्टिमाइजेशन', 'एसईओ', 'गूगल रैंकिंग', 'सर्च रैंकिंग',
    ],
    en:
      '🔍 *SEO (Search Engine Optimization) — GLOARO PVT LTD*\n\n' +
      'SEO (Search Engine Optimization): Optimizing your website to rank higher on Google search results and drive organic traffic.\n\n' +
      '• In-depth Keyword Research & Competitor Analysis\n' +
      '• On-Page, Off-Page & Technical SEO\n' +
      '• High-Authority Backlink Acquisition\n' +
      '• Local SEO & Google Business Profile Optimization',
    ta:
      '🔍 *SEO (தேடுபொறி உகப்பாக்கம்) — GLOARO PVT LTD*\n\n' +
      'SEO (Search Engine Optimization): Optimizing your website to rank higher on Google search results and drive organic traffic.\n\n' +
      '• முக்கிய வார்த்தை ஆராய்ச்சி (Keyword Research)\n' +
      '• ஆன்-பேஜ் மற்றும் தொழில்நுட்ப SEO\n' +
      '• உயர்தர பேக்லிங்க் கட்டமைப்பு\n' +
      '• லோக்கல் SEO மற்றும் கூகுள் மேப் உகப்பாக்கம்',
    hi:
      '🔍 *एसईओ (Search Engine Optimization) — GLOARO PVT LTD*\n\n' +
      'SEO (Search Engine Optimization): Optimizing your website to rank higher on Google search results and drive organic traffic.\n\n' +
      '• कीवर्ड रिसर्च और प्रतिस्पर्धी विश्लेषण\n' +
      '• ऑन-पेज, ऑफ-पेज और तकनीकी एसईओ\n' +
      '• उच्च गुणवत्ता वाले बैकलिंक्स\n' +
      '• लोकल एसईओ और गूगल बिजनेस प्रोफाइल ऑप्टिमाइजेशन',
  },

  // 5. Google & Meta Ads (Paid Advertising)
  {
    id: 'ads',
    keywords: [
      BUTTON_IDS.SUB_ADS, BUTTON_IDS.ADS, 'btn_sub_ads', 'btn_ads',
      'google & meta ads', 'google ads', 'meta ads', 'facebook ads', 'instagram ads',
      'paid ads', 'ppc', 'lead generation ads', 'google ad', 'meta ad', 'ads', 'advertising',
      'கூகுள் & மெட்டா விளம்பரங்கள்', 'கூகுள் விளம்பரங்கள்', 'மெட்டா விளம்பரங்கள்', 'விளம்பரங்கள்', 'பேஸ்புக் விளம்பரங்கள்',
      'गूगल और मेटा विज्ञापन', 'गूगल विज्ञापन', 'मेटा विज्ञापन', 'विज्ञापन', 'फेसबुक विज्ञापन',
    ],
    en:
      '🎯 *Google & Meta Ads — GLOARO PVT LTD*\n\n' +
      'Generate high-quality instant leads and sales through highly targeted ad campaigns on Google, YouTube, Facebook, and Instagram.\n\n' +
      '• Google Search, Display, YouTube & Performance Max Ads\n' +
      '• Meta (Facebook & Instagram) Targeted Lead Ads\n' +
      '• High-ROI Conversion Campaigns & Retargeting\n' +
      '• Real-time Tracking & Continuous A/B Testing',
    ta:
      '🎯 *கூகுள் & மெட்டா விளம்பரங்கள் — GLOARO PVT LTD*\n\n' +
      'கூகுள், யூடியூப், பேஸ்புக் மற்றும் இன்ஸ்டாகிராமில் துல்லியமான விளம்பரங்கள் மூலம் உடனடி லீட்ஸ் மற்றும் விற்பனையைப் பெறுங்கள்.\n\n' +
      '• கூகுள் தேடல் மற்றும் டிஸ்ப்ளே விளம்பரங்கள்\n' +
      '• Meta (Facebook & Instagram) லீட் விளம்பரங்கள்\n' +
      '• அதிக ROI தரும் விற்பனை பிரச்சாரங்கள்\n' +
      '• துல்லியமான கண்காணிப்பு மற்றும் உகப்பாக்கம்',
    hi:
      '🎯 *गूगल और मेटा विज्ञापन — GLOARO PVT LTD*\n\n' +
      'गूगल, यूट्यूब, फेसबुक और इंस्टाग्राम पर लक्षित विज्ञापनों के माध्यम से तुरंत लीड और बिक्री उत्पन्न करें।\n\n' +
      '• गूगल सर्च, डिस्प्ले और यूट्यूब विज्ञापन\n' +
      '• मेटा (फेसबुक और इंस्टाग्राम) टार्गेटेड विज्ञापन\n' +
      '• उच्च आरओआई (ROI) लीड जनरेशन अभियान\n' +
      '• निरंतर रूपांतरण ट्रैकिंग और अनुकूलन',
  },

  // 6. Content Marketing
  {
    id: 'content',
    keywords: [
      BUTTON_IDS.SUB_CONTENT, BUTTON_IDS.CONTENT, 'btn_sub_content', 'btn_content',
      'content marketing', 'content writing', 'copywriting', 'blog writing',
      'article writing', 'content strategy', 'content',
      'கன்டென்ட் மார்க்கெட்டிங்', 'உள்ளடக்க சந்தைப்படுத்தல்', 'கன்டென்ட்', 'உள்ளடக்கம்', 'கட்டுரை எழுதுதல்',
      'कंटेंट मार्केटिंग', 'कंटेंट राइटिंग', 'कंटेंट', 'सामग्री विपणन',
    ],
    en:
      '✍️ *Content Marketing — GLOARO PVT LTD*\n\n' +
      'Content Marketing: Creating valuable, engaging content, blogs, and videos to attract and retain customers.\n\n' +
      '• High-converting Copywriting & Blog Writing\n' +
      '• Video Scripts, Case Studies & Whitepapers\n' +
      '• SEO-optimized Articles to Boost Organic Traffic\n' +
      '• Brand Storytelling & Customer Education',
    ta:
      '✍️ *கன்டென்ட் மார்க்கெட்டிங் — GLOARO PVT LTD*\n\n' +
      'Content Marketing: Creating valuable, engaging content, blogs, and videos to attract and retain customers.\n\n' +
      '• கவர்ச்சிகரமான வலைப்பதிவுகள் மற்றும் கட்டுரைகள்\n' +
      '• வீடியோ ஸ்கிரிப்ட் மற்றும் தயாரிப்பு விளக்கங்கள்\n' +
      '• SEO சார்ந்த உள்ளடக்க உருவாக்கம்\n' +
      '• பிராண்ட் கதை சொல்லும் உத்திகள்',
    hi:
      '✍️ *कंटेंट मार्केटिंग — GLOARO PVT LTD*\n\n' +
      'Content Marketing: Creating valuable, engaging content, blogs, and videos to attract and retain customers.\n\n' +
      '• उच्च-रूपांतरण ब्लॉग और आर्टिकल लेखन\n' +
      '• वीडियो स्क्रिप्ट और उत्पाद विवरण\n' +
      '• एसईओ-अनुकूलित सामग्री निर्माण\n' +
      '• ब्रांड स्टोरीटेलिंग और ग्राहक सहभागिता',
  },

  // 7. Branding & Design
  {
    id: 'branding',
    keywords: [
      BUTTON_IDS.SUB_BRANDING, BUTTON_IDS.BRANDING, 'btn_sub_branding', 'btn_branding',
      'branding & design', 'branding', 'logo design', 'graphic design',
      'brand identity', 'ui/ux design', 'logo', 'graphic', 'design',
      'பிராண்டிங் & டிசைன்', 'பிராண்டிங்', 'லோகோ டிசைன்', 'கிராபிக் டிசைன்', 'வடிவமைப்பு', 'லோகோ', 'டிசைன்',
      'ब्रांडिंग और डिज़ाइन', 'ब्रांडिंग', 'लोगो डिज़ाइन', 'ग्राफिक डिज़ाइन', 'लोगो', 'डिज़ाइन',
    ],
    en:
      '🎨 *Branding & Graphic Design — GLOARO PVT LTD*\n\n' +
      'Build a memorable, premium brand identity that stands out in your market.\n\n' +
      '• Professional Logo Design & Brand Identity Kits\n' +
      '• Brochures, Flyers, Packaging & Business Cards\n' +
      '• Social Media Creatives & Marketing Collaterals\n' +
      '• Modern UI/UX Visual Guidelines',
    ta:
      '🎨 *பிராண்டிங் & டிசைன் — GLOARO PVT LTD*\n\n' +
      'உங்கள் நிறுவனத்திற்கு தனித்துவமான மற்றும் கவர்ச்சிகரமான பிராண்ட் அடையாளத்தை நாங்கள் உருவாக்குகிறோம்.\n\n' +
      '• தொழில்முறை லோகோ வடிவமைப்பு & பிராண்ட் கிட்\n' +
      '• பிரசுரங்கள், விசிட்டிங் கார்டுகள் மற்றும் பேக்கேஜிங்\n' +
      '• சமூக ஊடக விளம்பர கிராபிக்ஸ்\n' +
      '• நவீன UI/UX காட்சி வடிவமைப்பு',
    hi:
      '🎨 *ब्रांडिंग और ग्राफिक डिज़ाइन — GLOARO PVT LTD*\n\n' +
      'अपने व्यवसाय के लिए एक विशिष्ट और प्रीमियम ब्रांड पहचान स्थापित करें।\n\n' +
      '• पेशेवर लोगो डिज़ाइन और ब्रांड पहचान किट\n' +
      '• ब्रोशर, फ़्लायर्स, विज़िटिंग कार्ड और पैकेजिंग\n' +
      '• सोशल मीडिया क्रिएटिव्स और बैनर\n' +
      '• आधुनिक UI/UX विज़ुअल डिज़ाइन',
  },

  // 8. Custom Software Development
  {
    id: 'custom_software',
    keywords: [
      BUTTON_IDS.SUB_SOFTWARE, BUTTON_IDS.CUSTOM_SOFTWARE, 'btn_sub_software', 'btn_software',
      'custom software development', 'custom software', 'software development',
      'software solution', 'software solutions', 'software',
      'கஸ்டம் சாஃப்ட்வேர்', 'சாப்ட்வேர் உருவாக்கம்', 'மென்பொருள் உருவாக்கம்', 'சாஃப்ட்வேர்', 'மென்பொருள்',
      'कस्टम सॉफ्टवेयर डेवलपमेंट', 'कस्टम सॉफ्टवेयर', 'सॉफ्टवेयर डेवलपमेंट', 'सॉफ्टवेयर विकास', 'सॉफ्टवेयर',
    ],
    en:
      '⚙️ *Custom Software Development — GLOARO PVT LTD*\n\n' +
      'Tailor-made, robust, and scalable software solutions designed to automate and empower your unique business workflows.\n\n' +
      '• Custom Web & Enterprise Software\n' +
      '• API Integration & Cloud Architecture\n' +
      '• Scalable, Secure & High-performance Systems\n' +
      '• Continuous Maintenance & Technical Support',
    ta:
      '⚙️ *கஸ்டம் சாஃப்ட்வேர் உருவாக்கம் — GLOARO PVT LTD*\n\n' +
      'உங்கள் வணிகத் தேவைகளுக்கு முற்றிலும் ஏற்ற தனிப்பயன் மென்பொருள் தீர்வுகளை நாங்கள் வழங்குகிறோம்.\n\n' +
      '• என்டர்பிரைஸ் மற்றும் கிளவுட் மென்பொருட்கள்\n' +
      '• பாதுகாப்பான API இணைப்பு மற்றும் கட்டமைப்பு\n' +
      '• வேகமான மற்றும் நம்பகமான செயல்திறன்\n' +
      '• தொடர் பராமரிப்பு மற்றும் தொழில்நுட்ப ஆதரவு',
    hi:
      '⚙️ *कस्टम सॉफ्टवेयर डेवलपमेंट — GLOARO PVT LTD*\n\n' +
      'आपकी व्यावसायिक प्रक्रियाओं को स्वचालित और सुव्यवस्थित करने के लिए कस्टम सॉफ्टवेयर समाधान।\n\n' +
      '• कस्टम वेब और एंटरप्राइज सॉफ्टवेयर\n' +
      '• सुरक्षित एपीआई और क्लाउड आर्किटेक्चर\n' +
      '• उच्च प्रदर्शन और स्केलेबल सिस्टम\n' +
      '• निरंतर रखरखाव और तकनीकी सहायता',
  },

  // 9. CRM & ERP Solutions
  {
    id: 'crm_erp',
    keywords: [
      BUTTON_IDS.SUB_CRM, BUTTON_IDS.CRM_ERP, 'btn_sub_crm', 'btn_crm',
      'crm & erp solutions', 'crm & erp', 'crm solutions', 'erp solutions',
      'crm software', 'erp software', 'crm', 'erp',
      'சிஆர்எம் & ஈஆர்பி', 'சிஆர்எம்', 'ஈஆர்பி',
      'सीआरएम और ईआरपी', 'सीआरएम', 'ईआरपी',
    ],
    en:
      '📊 *CRM & ERP Solutions — GLOARO PVT LTD*\n\n' +
      'Streamline your customer relationships, sales pipelines, inventory, and end-to-end enterprise resource operations.\n\n' +
      '• Customer Relationship Management (CRM) Systems\n' +
      '• Enterprise Resource Planning (ERP) Implementation\n' +
      '• Lead Tracking, Sales Automation & Billing\n' +
      '• Inventory, HR & Accounting Integration',
    ta:
      '📊 *CRM & ERP தீர்வுகள் — GLOARO PVT LTD*\n\n' +
      'வாடிக்கையாளர் உறவுகள், விற்பனை பைப்லைன் மற்றும் வணிக செயல்பாடுகளை எளிமைப்படுத்துங்கள்.\n\n' +
      '• வாடிக்கையாளர் உறவு மேலாண்மை (CRM) அமைப்புகள்\n' +
      '• நிறுவன வள திட்டமிடல் (ERP) தீர்வுகள்\n' +
      '• லீட் டிராக்கிங், விற்பனை ஆட்டோமேஷன் & பில்லிங்\n' +
      '• சரக்கு மற்றும் கணக்கியல் ஒருங்கிணைப்பு',
    hi:
      '📊 *CRM और ERP समाधान — GLOARO PVT LTD*\n\n' +
      'अपने ग्राहक संबंधों, बिक्री, इन्वेंट्री और व्यावसायिक संचालन को एक ही स्थान से सुव्यवस्थित करें।\n\n' +
      '• ग्राहक संबंध प्रबंधन (CRM) सिस्टम\n' +
      '• एंटरप्राइज रिसोर्स प्लानिंग (ERP) समाधान\n' +
      '• लीड ट्रैकिंग, बिक्री स्वचालन और बिलिंग\n' +
      '• इन्वेंटरी, एचआर और अकाउंटिंग एकीकरण',
  },

  // 10. WhatsApp BOT & AI Solutions
  {
    id: 'bot_ai',
    keywords: [
      BUTTON_IDS.SUB_BOT, BUTTON_IDS.WHATSAPP_BOT, 'btn_sub_bot', 'btn_bot',
      'whatsapp bot & ai solutions', 'whatsapp bot & ai business solution', 'whatsapp bot & ai business solutions',
      'whatsapp bot & ai', 'whatsapp bot', 'whatsapp chatbot', 'ai solutions', 'chatbot', 'whatsapp automation',
      'ai bot', 'bot', 'ai', 'whatsapp bott',
      'வாட்ஸ்அப் பாட் & ai', 'வாட்ஸ்அப் பாட்', 'சாட்பாட்', 'தானியங்கி பாட்', 'ஏஐ பாட்', 'பாட்', 'ஏஐ',
      'व्हाट्सएप बॉट और ai', 'व्हाट्सएप बॉट', 'चैटबॉट', 'एआई समाधान', 'बॉट', 'एआई',
    ],
    en:
      '🤖 *WhatsApp BOT & AI Solutions — GLOARO PVT LTD*\n\n' +
      'Automate your 24/7 customer service, lead generation, and order processing with smart WhatsApp Bots & AI assistants.\n\n' +
      '• Official Meta WhatsApp Business Cloud API Integration\n' +
      '• Automated Multi-lingual FAQs & Customer Support\n' +
      '• AI-Powered Conversational Workflows\n' +
      '• Live Chat & CRM Notification Integration',
    ta:
      '🤖 *வாட்ஸ்அப் பாட் & AI தீர்வுகள் — GLOARO PVT LTD*\n\n' +
      'உங்கள் வாடிக்கையாளர்களுக்கு 24/7 உடனடி தானியங்கி ஆதரவு மற்றும் லீட் சேகரிப்பை வழங்கவும்.\n\n' +
      '• அதிகாரப்பூர்வ Meta WhatsApp Cloud API ஒருங்கிணைப்பு\n' +
      '• பன்மொழி தானியங்கி வாடிக்கையாளர் ஆதரவு\n' +
      '• AI அடிப்படையிலான உரையாடல் வசதி\n' +
      '• நேரடி சாட் மற்றும் CRM அறிவிப்புகள்',
    hi:
      '🤖 *व्हाट्सएप बॉट और AI समाधान — GLOARO PVT LTD*\n\n' +
      'स्मार्ट व्हाट्सएप बॉट्स के साथ अपनी 24/7 ग्राहक सहायता और लीड जनरेशन को स्वचालित करें।\n\n' +
      '• आधिकारिक मेटा व्हाट्सएप क्लाउड एपीआई एकीकरण\n' +
      '• बहुभाषी स्वचालित ग्राहक सहायता\n' +
      '• एआई-संचालित संवादात्मक वर्कफ़्लो\n' +
      '• लाइव एजेंट टेकओवर और सीआरएम अलर्ट',
  },

  // 11. E-Commerce Website & App
  {
    id: 'ecom_web_app',
    keywords: [
      BUTTON_IDS.SUB_ECOM_APP, BUTTON_IDS.ECOM_APP, 'btn_sub_ecom_app', 'btn_ecom_app',
      'e-commerce website & app', 'ecommerce website & app', 'ecommerce website', 'e-commerce website',
      'ecommerce app', 'e-commerce app', 'online store app', 'shopping app', 'shopping website',
      'இ-காமர்ஸ் வெப்சைட் & ஆப்', 'இ-காமர்ஸ் வெப்சைட்', 'இ-காமர்ஸ் ஆப்', 'ஷாப்பிங் ஆப்',
      'ई-कॉमर्स वेबसाइट और ऐप', 'ई-कॉमर्स वेबसाइट', 'ई-कॉमर्स ऐप', 'शॉपिंग ऐप',
    ],
    en:
      '🛒 *E-Commerce Website & App — GLOARO PVT LTD*\n\n' +
      'Launch powerful, feature-rich, and conversion-optimized online shopping platforms for web and mobile.\n\n' +
      '• Custom E-Commerce Web Stores & Mobile Shopping Apps\n' +
      '• Secure Checkout, Cart & Multi-Payment Integration\n' +
      '• Real-time Order Tracking & Customer Accounts\n' +
      '• High-Speed Performance Built for Scale',
    ta:
      '🛒 *இ-காமர்ஸ் வெப்சைட் & ஆப் — GLOARO PVT LTD*\n\n' +
      'ஆன்லைனில் உங்கள் தயாரிப்புகளை விற்பனை செய்ய நவீன ஷாப்பிங் வெப்சைட் மற்றும் மொபைல் ஆப் உருவாக்கம்.\n\n' +
      '• நவீன இ-காமர்ஸ் வலைத்தளம் மற்றும் மொபைல் ஆப்\n' +
      '• பாதுகாப்பான கார்ட் மற்றும் கட்டண பரிவர்த்தனை\n' +
      '• ஆர்டர் டிராக்கிங் மற்றும் வாடிக்கையாளர் கணக்குகள்\n' +
      '• வேகமான மற்றும் எளிமையான ஷாப்பிங் அனுபவம்',
    hi:
      '🛒 *ई-कॉमर्स वेबसाइट और ऐप — GLOARO PVT LTD*\n\n' +
      'अपने उत्पादों को ऑनलाइन बेचने के लिए आधुनिक और तेज़ ई-कॉमर्स वेबसाइट और मोबाइल ऐप शुरू करें।\n\n' +
      '• कस्टम ई-कॉमर्स वेब स्टोर और शॉपिंग ऐप\n' +
      '• सुरक्षित चेकआउट और मल्टी-पेमेंट गेटवे\n' +
      '• रीयल-टाइम ऑर्डर ट्रैकिंग और ग्राहक खाते\n' +
      '• तेज़ और स्केलेबल प्रदर्शन',
  },

  // 12. Online Store Development
  {
    id: 'online_store',
    keywords: [
      BUTTON_IDS.SUB_STORE, BUTTON_IDS.ONLINE_STORE, 'btn_sub_store', 'btn_store',
      'online store development', 'online store', 'digital store', 'web store',
      'ஆன்லைன் ஸ்டோர் டெவலப்மென்ட்', 'ஆன்லைன் ஸ்டோர்', 'டிஜிட்டல் ஸ்டோர்',
      'ऑनलाइन स्टोर विकास', 'ऑनलाइन स्टोर', 'डिजिटल स्टोर',
    ],
    en:
      '🏬 *Online Store Development — GLOARO PVT LTD*\n\n' +
      'Build a robust, easy-to-manage digital storefront to showcase and sell your products 24/7.\n\n' +
      '• Shopify, WooCommerce & Custom Store Setup\n' +
      '• Mobile-friendly Layouts & Fast Checkout\n' +
      '• Automated Invoicing & Tax Calculations\n' +
      '• Built-in Discount Codes & Offer Banners',
    ta:
      '🏬 *ஆன்லைன் ஸ்டோர் டெவலப்மென்ட் — GLOARO PVT LTD*\n\n' +
      'உங்கள் தயாரிப்புகளை 24/7 விற்பனை செய்ய எளிமையான மற்றும் நவீன ஆன்லைன் ஸ்டோர் அமைப்பு.\n\n' +
      '• Shopify, WooCommerce மற்றும் தனிப்பயன் ஸ்டோர்கள்\n' +
      '• மொபைலுக்கு ஏற்ற வடிவமைப்பு மற்றும் விரைவு செக்அவுட்\n' +
      '• தானியங்கி பில்லிங் மற்றும் சலுகைக் குறியீடுகள்\n' +
      '• எளிதான தயாரிப்பு மேலாண்மை',
    hi:
      '🏬 *ऑनलाइन स्टोर विकास — GLOARO PVT LTD*\n\n' +
      'अपने उत्पादों को 24/7 ऑनलाइन प्रदर्शित करने और बेचने के लिए एक संपूर्ण डिजिटल स्टोर बनाएं।\n\n' +
      '• Shopify, WooCommerce और कस्टम स्टोर सेटअप\n' +
      '• मोबाइल अनुकूल डिज़ाइन और तेज़ चेकआउट\n' +
      '• स्वचालित बिलिंग और डिस्काउंट कूपन\n' +
      '• आसान उत्पाद प्रबंधन',
  },

  // 13. Product Listing & Management
  {
    id: 'product_listing',
    keywords: [
      BUTTON_IDS.SUB_LISTING, BUTTON_IDS.PRODUCT_LISTING, 'btn_sub_listing', 'btn_product_listing',
      'product listing & management', 'product listing', 'product management',
      'catalog management', 'inventory management',
      'தயாரிப்பு மேலாண்மை', 'தயாரிப்பு பட்டியல்', 'கேட்டலாக் மேலாண்மை',
      'उत्पाद सूची और प्रबंधन', 'उत्पाद सूची', 'उत्पाद प्रबंधन', 'कैटलॉग प्रबंधन',
    ],
    en:
      '📦 *Product Listing & Catalog Management — GLOARO PVT LTD*\n\n' +
      'Optimize your product catalog with professional listings, images, and automated inventory sync.\n\n' +
      '• Multi-Category Product & SKU Setup\n' +
      '• High-quality Image Uploads & SEO Descriptions\n' +
      '• Real-time Inventory & Stock Tracking\n' +
      '• Marketplace Catalog Management (Amazon, Flipkart)',
    ta:
      '📦 *தயாரிப்பு மேலாண்மை — GLOARO PVT LTD*\n\n' +
      'உங்கள் தயாரிப்புகளை தொழில்முறை விளக்கங்கள், படங்கள் மற்றும் இன்வெண்டரி மேலாண்மையுடன் பட்டியலிடுங்கள்.\n\n' +
      '• தயாரிப்பு பிரிவுகள் மற்றும் SKU கட்டமைப்பு\n' +
      '• உயர்தர படங்கள் மற்றும் SEO விளக்கங்கள்\n' +
      '• நிகழ்நேர ஸ்டாக் மற்றும் இன்வெண்டரி கண்காணிப்பு\n' +
      '• அமேசான், ஃபிளிப்கார்ட் கேட்டலாக் மேலாண்மை',
    hi:
      '📦 *उत्पाद सूची और प्रबंधन — GLOARO PVT LTD*\n\n' +
      'पेशेवर विवरण, चित्र और स्वचालित इन्वेंट्री सिंक के साथ अपने उत्पाद कैटलॉग को प्रबंधित करें।\n\n' +
      '• उत्पाद श्रेणियां और एसकेयू (SKU) सेटअप\n' +
      '• उच्च गुणवत्ता वाले चित्र और एसईओ विवरण\n' +
      '• रीयल-टाइम स्टॉक और इन्वेंट्री ट्रैकिंग\n' +
      '• अमेज़ॅन, फ्लिपकार्ट कैटलॉग प्रबंधन',
  },

  // 14. B2B & B2C Sales
  {
    id: 'b2b_b2c',
    keywords: [
      BUTTON_IDS.SUB_B2B, BUTTON_IDS.B2B_B2C, 'btn_sub_b2b', 'btn_b2b_b2c',
      'b2b & b2c sales', 'b2b & b2c', 'b2b sales', 'b2c sales', 'b2b', 'b2c',
      'wholesale sales', 'retail sales', 'wholesale', 'retail',
      'b2b & b2c விற்பனை', 'மொத்த விற்பனை', 'சில்லறை விற்பனை',
      'b2b और b2c बिक्री', 'थोक बिक्री', 'खुदरा बिक्री',
    ],
    en:
      '💼 *B2B & B2C Digital Sales Channels — GLOARO PVT LTD*\n\n' +
      'Expand your reach with specialized digital sales channels designed for both wholesale (B2B) and retail (B2C) markets.\n\n' +
      '• Tiered Bulk Pricing & Wholesale Portals (B2B)\n' +
      '• Direct-to-Consumer (D2C / B2C) Retail Channels\n' +
      '• Custom Quotation & Invoicing Workflows\n' +
      '• Distributor & Dealer Management Integration',
    ta:
      '💼 *B2B & B2C விற்பனை சேனல்கள் — GLOARO PVT LTD*\n\n' +
      'மொத்த விற்பனை (B2B) மற்றும் நேரடி வாடிக்கையாளர் சில்லறை விற்பனைக்கான (B2C) டிஜிட்டல் அமைப்புகள்.\n\n' +
      '• மொத்த விற்பனைக்கான பிரத்யேக விலை கட்டமைப்பு (B2B)\n' +
      '• நேரடி நுகர்வோர் சில்லறை விற்பனை அமைப்புகள் (B2C)\n' +
      '• பிரத்யேக விலைப்பட்டியல் மற்றும் மேற்கோள் முறைகள்\n' +
      '• டீலர் மற்றும் விநியோகஸ்தர் மேலாண்மை',
    hi:
      '💼 *B2B और B2C डिजिटल बिक्री — GLOARO PVT LTD*\n\n' +
      'थोक (B2B) और खुदरा (B2C) दोनों बाजारों के लिए विशेष डिजिटल बिक्री चैनल स्थापित करें।\n\n' +
      '• थोक मूल्य निर्धारण और थोक पोर्टल (B2B)\n' +
      '• डायरेक्ट-टू-कंज्यूमर खुदरा बिक्री चैनल (B2C)\n' +
      '• कस्टम कोटेशन और इनवॉइसिंग वर्कफ़्लो\n' +
      '• डीलर और वितरक प्रबंधन',
  },

  // 15. E-Commerce Marketing
  {
    id: 'ecom_marketing',
    keywords: [
      BUTTON_IDS.SUB_ECOM_MARKETING, 'btn_sub_ecom_marketing',
      'e-commerce marketing', 'ecommerce marketing', 'online store marketing',
      'store sales marketing', 'ecommerce ads',
      'இ-காமர்ஸ் மார்க்கெட்டிங்',
      'ई-कॉमर्स मार्केटिंग',
    ],
    en:
      '🛍️ *E-Commerce Marketing — GLOARO PVT LTD*\n\n' +
      'Boost your store conversions and maximize online sales revenue with laser-targeted e-commerce ad strategies.\n\n' +
      '• Google Shopping & Performance Max Campaigns\n' +
      '• Meta Dynamic Product Retargeting Ads\n' +
      '• Abandoned Cart Recovery Strategies\n' +
      '• High-ROI Conversion Rate Optimization (CRO)',
    ta:
      '🛍️ *இ-காமர்ஸ் மார்க்கெட்டிங் — GLOARO PVT LTD*\n\n' +
      'உங்கள் ஆன்லைன் ஸ்டோரின் விற்பனையை அதிகரிக்க துல்லியமான விளம்பர உத்திகள்.\n\n' +
      '• கூகுள் ஷாப்பிங் விளம்பரங்கள்\n' +
      '• Meta டைனமிக் ரீடார்கெட்டிங் விளம்பரங்கள்\n' +
      '• விடுபட்ட கார்ட் மீட்பு உத்திகள் (Cart Recovery)\n' +
      '• விற்பனை மாற்ற விகித உகப்பாக்கம் (CRO)',
    hi:
      '🛍️ *ई-कॉमर्स मार्केटिंग — GLOARO PVT LTD*\n\n' +
      'लक्षित ई-कॉमर्स विज्ञापन रणनीतियों के साथ अपनी ऑनलाइन बिक्री और रूपांतरण को अधिकतम करें।\n\n' +
      '• गूगल शॉपिंग और परफॉर्मेंस मैक्स अभियान\n' +
      '• मेटा डायनामिक प्रोडक्ट रीमार्केटिंग विज्ञापन\n' +
      '• अबेंडन्ड कार्ट रिकवरी रणनीतियाँ\n' +
      '• उच्च-आरओआई रूपांतरण दर अनुकूलन (CRO)',
  },

  // 16. Payment Gateway Integration
  {
    id: 'payment_gateway',
    keywords: [
      BUTTON_IDS.SUB_PAYMENT, 'btn_sub_payment',
      'payment gateway integration', 'payment gateway', 'payment integration',
      'payment', 'payments', 'upi payment', 'razorpay', 'stripe', 'gateway',
      'பேமெண்ட் கேட்வே', 'பேமெண்ட்', 'பரிவர்த்தனை', 'கட்டண கேட்வே',
      'पेमेंट गेटवे एकीकरण', 'पेमेंट गेटवे', 'पेमेंट', 'भुगतान',
    ],
    en:
      '💳 *Payment Gateway Integration — GLOARO PVT LTD*\n\n' +
      'Integrate fast, secure, and multi-option payment gateways for effortless customer checkout.\n\n' +
      '• UPI (GPay, PhonePe, Paytm), Cards & Net Banking\n' +
      '• Razorpay, Cashfree, Stripe & International Gateways\n' +
      '• Instant Settlement & Secure 128-bit Encryption\n' +
      '• Automated Refund & Transaction Management',
    ta:
      '💳 *பேமெண்ட் கேட்வே ஒருங்கிணைப்பு — GLOARO PVT LTD*\n\n' +
      'உங்கள் வணிகத்திற்கு வேகமான மற்றும் பாதுகாப்பான ஆன்லைன் பேமெண்ட் கேட்வே ஒருங்கிணைப்பு.\n\n' +
      '• UPI (GPay, PhonePe), டெபிட்/கிரெடிட் கார்டு & நெட் பேங்கிங்\n' +
      '• Razorpay, Stripe போன்ற முன்னணி கேட்வேகள்\n' +
      '• உடனடி பணப் பரிமாற்றம் மற்றும் உயர் பாதுகாப்பு\n' +
      '• தானியங்கி கட்டண ரசீது முறை',
    hi:
      '💳 *पेमेंट गेटवे एकीकरण — GLOARO PVT LTD*\n\n' +
      'ग्राहकों के आसान चेकआउट के लिए तेज़ और सुरक्षित मल्टी-ऑप्शन पेमेंट गेटवे एकीकृत करें।\n\n' +
      '• UPI (GPay, PhonePe, Paytm), कार्ड और नेट बैंकिंग\n' +
      '• Razorpay, Cashfree, Stripe और अंतर्राष्ट्रीय गेटवे\n' +
      '• त्वरित सेटलमेंट और उच्च सुरक्षा एन्क्रिप्शन\n' +
      '• स्वचालित रिफंड और लेन-देन प्रबंधन',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — Specific Sub-Service Reply (Single sub-service + contact footer)
// ─────────────────────────────────────────────────────────────────────────────
export function getSubServiceReply(subService: SubServiceDetail, lang: Lang): string {
  const content = subService[lang] || subService.en;
  const footer = getContactFooter(lang);
  return `${content}\n\n${footer}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Broad Category Detailed Overviews (Only when broad category is queried)
// ─────────────────────────────────────────────────────────────────────────────
export function getDetailedServiceReply(serviceKey: 'dm' | 'tech' | 'ecom', lang: Lang): string {
  const footer = getContactFooter(lang);

  if (lang === 'ta') {
    if (serviceKey === 'dm') {
      return (
        '📈 *டிஜிட்டல் மார்க்கெட்டிங் — விரிவான விவரங்கள்*\n\n' +
        '• *டிஜிட்டல் மார்க்கெட்டிங்:* இலக்கு வாடிக்கையாளர்களை அடைய ஆன்லைனில் விளம்பரப்படுத்துதல்.\n' +
        '• *சோஷியல் மீடியா மார்க்கெட்டிங் (SMM):* இன்ஸ்டாகிராம், பேஸ்புக் மூலம் வாடிக்கையாளர்களை ஈர்ப்பது.\n' +
        '• *கூகுள் & மெட்டா விளம்பரங்கள்:* உடனடி லீட்ஸ் மற்றும் விற்பனைக்கான விளம்பரங்கள்.\n' +
        '• *SEO (தேடுபொறி உகப்பாக்கம்):* கூகுளில் உங்கள் வெப்சைட்டை முன்னிலைப்படுத்துவது.\n' +
        '• *கன்டென்ட் மார்க்கெட்டிங்:* வாடிக்கையாளர்களை ஈர்க்கும் தரமான உள்ளடக்கங்கள்.\n' +
        '• *பிராண்டிங் & டிசைன்:* தொழில்முறை லோகோ மற்றும் பிராண்ட் அடையாளம்.\n\n' +
        footer
      );
    }
    if (serviceKey === 'tech') {
      return (
        '💻 *தொழில்நுட்ப தீர்வுகள் — விரிவான விவரங்கள்*\n\n' +
        '• *வெப்சைட் உருவாக்கம்:* வேகமான, ரெஸ்பான்சிவ் மற்றும் நவீன வலைத்தளங்கள்.\n' +
        '• *மொபைல் ஆப் உருவாக்கம்:* ஆண்ட்ராய்டு மற்றும் ஐஓஎஸ் செயலிகள்.\n' +
        '• *கஸ்டம் சாஃப்ட்வேர்:* உங்கள் வணிகத் தேவைக்கேற்ப பிரத்யேக மென்பொருள்.\n' +
        '• *CRM & ERP தீர்வுகள்:* வாடிக்கையாளர் தரவு மற்றும் வணிக செயல்பாடுகளை எளிமைப்படுத்துதல்.\n' +
        '• *வாட்ஸ்அப் பாட் & AI:* 24/7 தானியங்கி வாடிக்கையாளர் ஆதரவு.\n\n' +
        footer
      );
    }
    return (
      '🛒 *இ-காமர்ஸ் தீர்வுகள் — விரிவான விவரங்கள்*\n\n' +
      '• *இ-காமர்ஸ் வெப்சைட் & ஆப்:* ஆன்லைன் ஷாப்பிங் ஸ்டோர் உருவாக்கம்.\n' +
      '• *ஆன்லைன் ஸ்டோர் டெவலப்மென்ட்:* எளிமையான டிஜிட்டல் ஸ்டோர் அமைப்பு.\n' +
      '• *தயாரிப்பு மேலாண்மை:* கேட்டலாக் மற்றும் இன்வெண்டரி மேலாண்மை.\n' +
      '• *B2B & B2C விற்பனை:* மொத்த மற்றும் சில்லறை விற்பனை சேனல்கள்.\n' +
      '• *இ-காமர்ஸ் மார்க்கெட்டிங்:* ஆன்லைன் விற்பனையை அதிகரிக்கும் பிரச்சாரங்கள்.\n' +
      '• *பேமெண்ட் கேட்வே:* பாதுகாப்பான யுபிஐ, கார்டு பரிவர்த்தனைகள்.\n\n' +
      footer
    );
  }

  if (lang === 'hi') {
    if (serviceKey === 'dm') {
      return (
        '📈 *डिजिटल मार्केटिंग — विस्तृत जानकारी*\n\n' +
        '• *डिजिटल मार्केटिंग:* लक्षित ग्राहकों तक पहुँचना।\n' +
        '• *सोशल मीडिया मार्केटिंग (SMM):* इंस्टाग्राम, फेसबुक और लिंक्डइन पर जुड़ाव।\n' +
        '• *गूगल और मेटा विज्ञापन:* त्वरित लीड और बिक्री।\n' +
        '• *एसईओ (सर्च इंजन ऑप्टिमाइजेशन):* गूगल खोज में रैंकिंग बढ़ाना।\n' +
        '• *कंटेंट मार्केटिंग:* आकर्षक ब्लॉग, वीडियो और कंटेंट बनाना।\n' +
        '• *ब्रांडिंग और डिज़ाइन:* पेशेवर लोगो और विजुअल डिज़ाइन।\n\n' +
        footer
      );
    }
    if (serviceKey === 'tech') {
      return (
        '💻 *तकनीकी समाधान — विस्तृत जानकारी*\n\n' +
        '• *वेबसाइट डेवलपमेंट:* आधुनिक और तेज़ वेबसाइटें।\n' +
        '• *मोबाइल ऐप डेवलपमेंट:* एंड्रॉइड और आईओएस ऐप।\n' +
        '• *कस्टम सॉफ्टवेयर:* आपकी व्यावसायिक ज़रूरतों के अनुसार।\n' +
        '• *CRM और ERP समाधान:* डेटा और संचालन को सुव्यवस्थित करना।\n' +
        '• *व्हाट्सएप बॉट और AI:* 24/7 स्वचालित सहायता।\n\n' +
        footer
      );
    }
    return (
      '🛒 *ई-कॉमर्स समाधान — विस्तृत जानकारी*\n\n' +
      '• *ई-कॉमर्स वेबसाइट और ऐप:* ऑनलाइन शॉपिंग स्टोर।\n' +
      '• *ऑनलाइन स्टोर विकास:* सहज खरीदारी अनुभव।\n' +
      '• *उत्पाद सूची और प्रबंधन:* कैटलॉग इन्वेंट्री प्रबंधन।\n' +
      '• *B2B और B2C बिक्री:* थोक और खुदरा बिक्री चैनल।\n' +
      '• *ई-कॉमर्स मार्केटिंग:* ऑनलाइन बिक्री बढ़ाने के अभियान।\n' +
      '• *पेमेंट गेटवे एकीकरण:* सुरक्षित भुगतान विकल्प (UPI, Cards)।\n\n' +
      footer
    );
  }

  // English (default)
  if (serviceKey === 'dm') {
    return (
      '📈 *Digital Marketing Services — Detailed*\n\n' +
      '• *Digital Marketing:* Promoting your business online to reach targeted customers.\n' +
      '• *Social Media Marketing (SMM):* Engaging audiences across Instagram, Facebook, and LinkedIn.\n' +
      '• *Google & Meta Ads:* Data-driven paid ad campaigns to generate instant leads.\n' +
      '• *SEO (Search Engine Optimization):* Optimizing your website to rank higher on Google organic search.\n' +
      '• *Content Marketing:* Creating valuable blogs, videos, and content that attract customers.\n' +
      '• *Branding & Design:* Crafting a premium brand identity with professional logos.\n\n' +
      footer
    );
  }
  if (serviceKey === 'tech') {
    return (
      '💻 *Technology Solutions — Detailed*\n\n' +
      '• *Website Development:* Building fast, responsive, SEO-friendly websites.\n' +
      '• *Mobile App Development:* High-performance apps for Android and iOS.\n' +
      '• *Custom Software Development:* Tailor-made software solutions for your business.\n' +
      '• *CRM & ERP Solutions:* Streamlining customer relations and business operations.\n' +
      '• *WhatsApp BOT & AI Solutions:* Automating 24/7 customer support.\n\n' +
      footer
    );
  }
  return (
    '🛒 *E-Commerce Solutions — Detailed*\n\n' +
    '• *E-Commerce Website & App:* Launching feature-rich online shopping stores.\n' +
    '• *Online Store Development:* User-friendly digital storefronts built for conversions.\n' +
    '• *Product Listing & Management:* Comprehensive catalog and inventory management.\n' +
    '• *B2B & B2C Sales:* Robust channels supporting wholesale and retail digital sales.\n' +
    '• *E-Commerce Marketing:* Data-driven campaigns to maximize online reach and revenue.\n' +
    '• *Payment Gateway Integration:* Secure UPI, card, and digital wallet payments.\n\n' +
    footer
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pricing reply (multilingual) — WITH contact info
// ─────────────────────────────────────────────────────────────────────────────
export function getPricingReply(lang: Lang): string {
  const footer = getContactFooter(lang);
  if (lang === 'ta') {
    return (
      'கட்டண விவரங்கள் மற்றும் சேவைக் கட்டணங்கள் உங்களது தேவைகளைப் பொறுத்து மாறுபடும்.\n' +
      'கூடுதல் விவரங்களுக்கு எங்களது நிறுவனத்தைத் தொடர்பு கொள்ளவும்!\n\n' +
      footer
    );
  }
  if (lang === 'hi') {
    return (
      'मूल्य विवरण और सेवा शुल्क आपकी आवश्यकताओं के अनुसार भिन्न हो सकते हैं।\n' +
      'अधिक जानकारी के लिए कृपया हमारी कंपनी से संपर्क करें!\n\n' +
      footer
    );
  }
  return (
    'Pricing details and service charges vary based on your specific requirements.\n' +
    'Please contact our company for a customised quote!\n\n' +
    footer
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Out-of-scope reply (multilingual) — WITH contact info
// ─────────────────────────────────────────────────────────────────────────────
export function getOutOfScopeReply(lang: Lang): string {
  const footer = getContactFooter(lang);
  if (lang === 'ta') {
    return (
      'இது எங்கள் நிறுவனத்தின் சேவைக் குறிப்புகளுக்கு அப்பாற்பட்டது.\n' +
      'கூடுதல் விவரங்கள் அல்லது உதவிக்கு எங்களது நிறுவனத்தைத் தொடர்பு கொள்ளவும்!\n\n' +
      footer
    );
  }
  if (lang === 'hi') {
    return (
      'यह हमारी कंपनी के दायरे से बाहर है।\n' +
      'अधिक जानकारी के लिए कृपया हमारी कंपनी से संपर्क करें!\n\n' +
      footer
    );
  }
  return (
    "This is outside our company's scope.\n" +
    'Please contact us for further assistance!\n\n' +
    footer
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Precise Keyword-based Answer Router
// Priority:
//   1. Pricing queries
//   2. Contact / Address / About queries
//   3. Specific sub-services (returns ONLY that sub-service description + contact)
//   4. Broad parent categories (only if broad category keyword)
//   5. Out-of-scope fallback
// ─────────────────────────────────────────────────────────────────────────────
export function getCompanyAnswerByKeyword(userQuery: string, lang: Lang = 'en'): string {
  const q = userQuery.toLowerCase().trim();
  const c = COMPANY_INFO;

  // 1. Thank You / Appreciation
  if (isThankYouMessage(userQuery)) {
    return getThankYouReply(lang);
  }

  // 2. Pricing
  if (PRICING_KEYWORDS.some((k) => q.includes(k))) {
    return getPricingReply(lang);
  }

  // 3. Website link queries (ONLY when explicitly asked for the website URL/link)
  if (
    q.includes('website link') || q.includes('official website') || q.includes('visit website') ||
    q.includes('website url') || q.includes('web link') || q.includes('site link') ||
    q.includes('company website') || q.includes('gloaro website') ||
    q.includes('வலைத்தள இணைப்பு') || q.includes('இணையதள முகவரி') ||
    q.includes('वेबसाइट लिंक')
  ) {
    if (lang === 'ta') return `🌐 *GLOARO PVT LTD அதிகாரப்பூர்வ வலைத்தளம்*:\n${c.website}\n\n📞 தொடர்புக்கு: ${c.phones}\n📧 மின்னஞ்சல்: ${c.email}`;
    if (lang === 'hi') return `🌐 *GLOARO PVT LTD आधिकारिक वेबसाइट*:\n${c.website}\n\n📞 संपर्क: ${c.phones}\n📧 ईमेल: ${c.email}`;
    return `🌐 *GLOARO PVT LTD Official Website*:\n${c.website}\n\n📞 Contact: ${c.phones}\n📧 Email: ${c.email}`;
  }

  // 4. General Contact info (phones & email ONLY)
  if (
    q.includes('contact') || q.includes('phone') || q.includes('number') ||
    q.includes('call') || q.includes('email') || q.includes('reach') ||
    q.includes('தொடர்பு') || q.includes('எண்') || q.includes('மின்னஞ்சல்') ||
    q.includes('संपर्क') || q.includes('फोन') || q.includes('ईमेल')
  ) {
    if (lang === 'ta') return `📞 தொடர்புக்கு: ${c.phones}\n📧 மின்னஞ்சல்: ${c.email}`;
    if (lang === 'hi') return `📞 संपर्क: ${c.phones}\n📧 ईमेल: ${c.email}`;
    return `📞 Contact: ${c.phones}\n📧 Email: ${c.email}`;
  }

  // 3. Address / location
  if (
    q.includes('address') || q.includes('location') || q.includes('office') || q.includes('where') ||
    q.includes('முகவரி') || q.includes('அலுவலகம்') || q.includes('எங்கே') ||
    q.includes('पता') || q.includes('कार्यालय') || q.includes('कहाँ')
  ) {
    if (lang === 'ta') return `📍 *தலைமை அலுவலகம்*:\n${c.address}\n\n📞 ${c.phones}`;
    if (lang === 'hi') return `📍 *कार्यालय का पता*:\n${c.address}\n\n📞 ${c.phones}`;
    return `📍 *Corporate Office*:\n${c.address}\n\n📞 ${c.phones}`;
  }

  // 4. About company
  if (
    q.includes('about') || q.includes('company') || q.includes('gloaro') || q.includes('who are you') ||
    q.includes('பற்றி') || q.includes('யார்') ||
    q.includes('कंपनी') || q.includes('बारे में')
  ) {
    if (lang === 'ta') return `🏢 *GLOARO PVT LTD*\n\n"ஒரு சுற்றுச்சூழல் அமைப்பு. பல வணிகத் தீர்வுகள்."\n\nதொழில்முனைவோர் மற்றும் நிறுவனங்களை இணைக்கும் தொழில்நுட்ப சுற்றுச்சூழல் அமைப்பு.\n\n📞 ${c.phones} | 📧 ${c.email}`;
    if (lang === 'hi') return `🏢 *GLOARO PVT LTD*\n\n"एक पारिस्थितिकी तंत्र। कई व्यावसायिक समाधान।"\n\n📞 ${c.phones} | 📧 ${c.email}`;
    return `🏢 *GLOARO PVT LTD*\n\n"One Ecosystem. Multiple Business Solutions."\n\nA technology-driven business ecosystem empowering entrepreneurs, startups, SMEs, and enterprises.\n\n📞 ${c.phones} | 📧 ${c.email}`;
  }

  // 5. Specific Sub-Service Matching (PRECISE LOOKUP FIRST)
  // Check longer/more specific phrases first to prevent partial match conflicts
  for (const sub of SUB_SERVICES) {
    // Sort keywords by length descending so multi-word matches take precedence
    const sortedKeywords = [...sub.keywords].sort((a, b) => b.length - a.length);
    for (const kw of sortedKeywords) {
      if (q.includes(kw.toLowerCase())) {
        return getSubServiceReply(sub, lang);
      }
    }
  }

  // 6. Broad Category Fallbacks (only if user explicitly asked for entire category)
  if (
    q.includes('digital marketing') || q.includes('marketing') ||
    q.includes('டிஜிட்டல் மார்க்கெட்டிங்') || q.includes('டிஜிட்டல்') ||
    q.includes('डिजिटल मार्केटिंग') || q.includes('डिजिटल')
  ) {
    return getDetailedServiceReply('dm', lang);
  }

  if (
    q.includes('technology solutions') || q.includes('tech solutions') || q.includes('tech') ||
    q.includes('தொழில்நுட்ப தீர்வுகள்') || q.includes('தொழில்நுட்பம்') ||
    q.includes('तकनीकी समाधान') || q.includes('तकनीक')
  ) {
    return getDetailedServiceReply('tech', lang);
  }

  if (
    q.includes('e-commerce solutions') || q.includes('ecommerce solutions') || q.includes('e-commerce') || q.includes('ecommerce') ||
    q.includes('இ-காமர்ஸ் தீர்வுகள்') || q.includes('இ-காமர்ஸ்') ||
    q.includes('ई-कॉमर्स समाधान') || q.includes('ई-कॉमर्स')
  ) {
    return getDetailedServiceReply('ecom', lang);
  }

  // 7. Out-of-scope fallback
  return getOutOfScopeReply(lang);
}

// ─────────────────────────────────────────────────────────────────────────────
// Language detection utility (for bot-engine.service.ts compatibility)
// ─────────────────────────────────────────────────────────────────────────────
export function detectLanguage(text: string): Lang {
  if (!text) return 'en';
  const tamilRegex = /[\u0B80-\u0BFF]/;
  const hindiRegex = /[\u0900-\u097F]/;
  if (tamilRegex.test(text)) return 'ta';
  if (hindiRegex.test(text)) return 'hi';
  return 'en';
}

// ─────────────────────────────────────────────────────────────────────────────
// Legacy compatibility exports — required by bot-engine.service.ts
// DO NOT DELETE — these are compile-time dependencies.
// ─────────────────────────────────────────────────────────────────────────────
const _enMenu = getServiceMenuContent('en');

/** @deprecated Use getServiceMenuContent(lang).body */
export const WELCOME_TEXT: string = _enMenu.body;

/** @deprecated Use getServiceMenuContent(lang).buttons */
export const MAIN_MENU_BUTTONS: { id: string; title: string }[] = _enMenu.buttons;

/** @deprecated Use getButtonServiceList(id, lang) */
export const BUTTON_SERVICE_LIST: Record<string, string> = {
  [BUTTON_IDS.DM]:   getButtonServiceList(BUTTON_IDS.DM,   'en'),
  [BUTTON_IDS.TECH]: getButtonServiceList(BUTTON_IDS.TECH, 'en'),
  [BUTTON_IDS.ECOM]: getButtonServiceList(BUTTON_IDS.ECOM, 'en'),
};

/** @deprecated Use getPricingReply(lang) */
export const PRICING_REPLY: string = getPricingReply('en');
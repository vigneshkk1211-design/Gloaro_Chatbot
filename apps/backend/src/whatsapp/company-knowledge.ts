// ─────────────────────────────────────────────────────────────────────────────
// GLOARO PVT LTD — Official AI Business Assistant Knowledge Base
// Supports: English (en) | Tamil (ta) | Hindi (hi)
// ─────────────────────────────────────────────────────────────────────────────

export const COMPANY_INFO = {
  name:    'GLOARO PVT LTD',
  phones:  '7200537033 / 7200073704',
  email:   'info@gloaro.com',
  website: 'www.gloaro.com / www.gloaro.in',
  address: 'SF No. 101/2B, Esai Towers, Salem Main Road, Near Bypass, Emapper, Kallakurichi - 606202, Tamil Nadu, India.',
};

// ─── Button IDs (stable identifiers, language-independent) ────────────────────
export const BUTTON_IDS = {
  DM:   'btn_dm',
  TECH: 'btn_tech',
  ECOM: 'btn_ecom',
} as const;

// ─── Trigger keyword sets ─────────────────────────────────────────────────────
export const MENU_TRIGGER_KEYWORDS: string[] = [
  // English
  'hi', 'hello', 'hey', 'start', 'menu', 'help',
  'services', 'service', 'good morning', 'good evening',
  // Tamil
  'வணக்கம்', 'தொடங்கு',
  // Hindi
  'नमस्ते', 'नमस्कार',
];

export const PRICING_KEYWORDS: string[] = [
  // English
  'price', 'pricing', 'cost', 'budget', 'charge', 'charges', 'fee', 'fees',
  'rate', 'rates', 'quote', 'quotation', 'how much', 'what is the cost',
  'what is the price', 'expense', 'affordable', 'cheap', 'expensive', 'amount',
  // Tamil
  'விலை', 'கட்டணம்', 'எவ்வளவு',
  // Hindi
  'मूल्य', 'शुल्क', 'कितना', 'खर्च',
];

// ─────────────────────────────────────────────────────────────────────────────
// Language detection
// ─────────────────────────────────────────────────────────────────────────────
export function detectLanguage(text: string): 'ta' | 'hi' | 'en' {
  if (!text) return 'en';
  const tamilRegex = /[\u0B80-\u0BFF]/;
  const hindiRegex = /[\u0900-\u097F]/;
  if (tamilRegex.test(text)) return 'ta';
  if (hindiRegex.test(text)) return 'hi';
  return 'en';
}

// ─────────────────────────────────────────────────────────────────────────────
// RULE 1 — Welcome message + 3 interactive buttons (multilingual)
// ─────────────────────────────────────────────────────────────────────────────
export function getWelcomeContent(lang: 'ta' | 'hi' | 'en'): { body: string; buttons: { id: string; title: string }[] } {
  if (lang === 'ta') {
    return {
      body: `வணக்கம்! GLOARO PVT LTD-க்கு வரவேற்கிறோம்! \u{1F680}\u2728\n\n"ஒரு சுற்றுச்சூழல் அமைப்பு. பல வணிகத் தீர்வுகள்."\n\nதொழில்முனைவோர், ஸ்டார்ட்அப்கள் மற்றும் நிறுவனங்களை வளர்க்க உதவும் தொழில்நுட்ப சுற்றுச்சூழல் அமைப்பு நாங்கள்.\n\nகீழே உள்ள சேவைகளில் ஒன்றைத் தேர்ந்தெடுக்கவும்:`,
      buttons: [
        { id: BUTTON_IDS.DM,   title: 'டிஜிட்டல் மார்க்கெட்டிங்' },
        { id: BUTTON_IDS.TECH, title: 'தொழில்நுட்ப தீர்வுகள்' },
        { id: BUTTON_IDS.ECOM, title: 'இ-காமர்ஸ் தீர்வுகள்' },
      ],
    };
  }
  if (lang === 'hi') {
    return {
      body: `नमस्ते! GLOARO PVT LTD में आपका स्वागत है! \u{1F680}\u2728\n\n"एक पारिस्थितिकी तंत्र। कई व्यावसायिक समाधान।"\n\nहम उद्यमियों, स्टार्टअप्स और उद्यमों को सशक्त बनाने वाली एक तकनीकी कंपनी हैं।\n\nकृपया नीचे एक सेवा चुनें:`,
      buttons: [
        { id: BUTTON_IDS.DM,   title: 'डिजिटल मार्केटिंग' },
        { id: BUTTON_IDS.TECH, title: 'तकनीकी समाधान' },
        { id: BUTTON_IDS.ECOM, title: 'ई-कॉमर्स समाधान' },
      ],
    };
  }
  return {
    body: `👋 Hello! Welcome to *GLOARO PVT LTD*! 🚀✨\n\n"One Ecosystem. Multiple Business Solutions."\n\nWe are a technology-driven business ecosystem empowering entrepreneurs, startups, SMEs, and enterprises.\n\nHow can we help scale your business today? Please choose a service below:`,
    buttons: [
      { id: BUTTON_IDS.DM,   title: 'Digital Marketing' },
      { id: BUTTON_IDS.TECH, title: 'Technology Solutions' },
      { id: BUTTON_IDS.ECOM, title: 'E-Commerce Solutions' },
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// RULE 2 — Button click → bullet list of service names only (multilingual)
// ─────────────────────────────────────────────────────────────────────────────
export function getButtonServiceList(buttonId: string, lang: 'ta' | 'hi' | 'en'): string {
  if (lang === 'ta') {
    if (buttonId === BUTTON_IDS.DM) {
      return `📈 *டிஜிட்டல் மார்க்கெட்டிங் சேவைகள்*\n\n• டிஜிட்டல் மார்க்கெட்டிங்\n• சோஷியல் மீடியா மார்க்கெட்டிங்\n• கூகுள் & மெட்டா விளம்பரங்கள்\n• SEO (தேடுபொறி மேம்படுத்தல்)\n• கன்டென்ட் மார்க்கெட்டிங்\n• பிராண்டிங் & டிசைன்\n\n_குறிப்பிட்ட சேவை பெயரை தட்டச்சு செய்து விவரங்கள் பெறுங்கள்!_\n\n📞 ${COMPANY_INFO.phones} | 📧 ${COMPANY_INFO.email}`;
    }
    if (buttonId === BUTTON_IDS.TECH) {
      return `💻 *தொழில்நுட்ப தீர்வுகள்*\n\n• வெப்சைட் உருவாக்கம்\n• மொபைல் ஆப் உருவாக்கம்\n• கஸ்டம் சாஃப்ட்வேர் டெவலப்மென்ட்\n• CRM & ERP தீர்வுகள்\n• வாட்ஸ்அப் பாட் & AI வணிகத் தீர்வுகள்\n\n_குறிப்பிட்ட சேவை பெயரை தட்டச்சு செய்து விவரங்கள் பெறுங்கள்!_\n\n📞 ${COMPANY_INFO.phones} | 📧 ${COMPANY_INFO.email}`;
    }
    return `🛒 *இ-காமர்ஸ் தீர்வுகள்*\n\n• இ-காமர்ஸ் வெப்சைட் & ஆப்\n• ஆன்லைன் ஸ்டோர் உருவாக்கம்\n• தயாரிப்பு பட்டியல் & மேலாண்மை\n• B2B & B2C விற்பனை\n• இ-காமர்ஸ் மார்க்கெட்டிங்\n• பேமெண்ட் கேட்வே ஒருங்கிணைப்பு\n\n_குறிப்பிட்ட சேவை பெயரை தட்டச்சு செய்து விவரங்கள் பெறுங்கள்!_\n\n📞 ${COMPANY_INFO.phones} | 📧 ${COMPANY_INFO.email}`;
  }

  if (lang === 'hi') {
    if (buttonId === BUTTON_IDS.DM) {
      return `📈 *डिजिटल मार्केटिंग सेवाएँ*\n\n• डिजिटल मार्केटिंग\n• सोशल मीडिया मार्केटिंग\n• गूगल और मेटा विज्ञापन\n• एसईओ (सर्च इंजन ऑप्टिमाइजेशन)\n• कंटेंट मार्केटिंग\n• ब्रांडिंग और डिजाइन\n\n_किसी विशेष सेवा का नाम टाइप करके विस्तृत जानकारी पाएं!_\n\n📞 ${COMPANY_INFO.phones} | 📧 ${COMPANY_INFO.email}`;
    }
    if (buttonId === BUTTON_IDS.TECH) {
      return `💻 *तकनीकी समाधान*\n\n• वेबसाइट डेवलपमेंट\n• मोबाइल ऐप डेवलपमेंट\n• कस्टम सॉफ्टवेयर डेवलपमेंट\n• CRM और ERP समाधान\n• व्हाट्सएप बॉट और AI व्यावसायिक समाधान\n\n_किसी विशेष सेवा का नाम टाइप करके विस्तृत जानकारी पाएं!_\n\n📞 ${COMPANY_INFO.phones} | 📧 ${COMPANY_INFO.email}`;
    }
    return `🛒 *ई-कॉमर्स समाधान*\n\n• ई-कॉमर्स वेबसाइट और ऐप\n• ऑनलाइन स्टोर डेवलपमेंट\n• उत्पाद सूची और प्रबंधन\n• B2B और B2C बिक्री\n• ई-कॉमर्स मार्केटिंग\n• पेमेंट गेटवे एकीकरण\n\n_किसी विशेष सेवा का नाम टाइप करके विस्तृत जानकारी पाएं!_\n\n📞 ${COMPANY_INFO.phones} | 📧 ${COMPANY_INFO.email}`;
  }

  // English (default)
  if (buttonId === BUTTON_IDS.DM) {
    return `📈 *Digital Marketing Services*\n\n• Digital Marketing\n• Social Media Marketing\n• Google & Meta Ads\n• SEO (Search Engine Optimization)\n• Content Marketing\n• Branding & Design\n\n_Reply with any service name above to get detailed information!_\n\n📞 ${COMPANY_INFO.phones} | 📧 ${COMPANY_INFO.email}`;
  }
  if (buttonId === BUTTON_IDS.TECH) {
    return `💻 *Technology Solutions*\n\n• Website Development\n• Mobile App Development\n• Custom Software Development\n• CRM & ERP Solutions\n• WhatsApp BOT & AI Business Solutions\n\n_Reply with any service name above to get detailed information!_\n\n📞 ${COMPANY_INFO.phones} | 📧 ${COMPANY_INFO.email}`;
  }
  return `🛒 *E-Commerce Solutions*\n\n• E-Commerce Website & App\n• Online Store Development\n• Product Listing & Management\n• B2B & B2C Sales\n• E-Commerce Marketing\n• Payment Gateway Integration\n\n_Reply with any service name above to get detailed information!_\n\n📞 ${COMPANY_INFO.phones} | 📧 ${COMPANY_INFO.email}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// RULE 4 — Pricing reply (exact wording, multilingual)
// ─────────────────────────────────────────────────────────────────────────────
export function getPricingReply(lang: 'ta' | 'hi' | 'en'): string {
  if (lang === 'ta') {
    return `கட்டண விவரங்கள் மற்றும் சேவைக் கட்டணங்கள் உங்களது தேவைகளைப் பொறுத்து மாறுபடும். கூடுதல் விவரங்களுக்கு எங்களது நிறுவனத்தைத் தொடர்பு கொள்ளவும்!\n\n📞 ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
  }
  if (lang === 'hi') {
    return `मूल्य विवरण और सेवा शुल्क आपकी आवश्यकताओं के अनुसार भिन्न हो सकते हैं। अधिक जानकारी के लिए कृपया हमारी कंपनी से संपर्क करें!\n\n📞 ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
  }
  return `Our service charges vary depending on your requirements. Please contact our company for further details!\n\n📞 ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// RULE 5 — Out-of-scope reply (exact wording, multilingual)
// ─────────────────────────────────────────────────────────────────────────────
export function getOutOfScopeReply(lang: 'ta' | 'hi' | 'en'): string {
  if (lang === 'ta') {
    return `இது எங்கள் நிறுவனத்தின் சேவைக் குறிப்புகளுக்கு அப்பாற்பட்டது. கூடுதல் உதவிக்கு எங்களது நிறுவனத்தைத் தொடர்பு கொள்ளவும்!\n\n📞 ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
  }
  if (lang === 'hi') {
    return `यह हमारी कंपनी के दायरे से बाहर है। अधिक जानकारी के लिए कृपया हमारी कंपनी से संपर्क करें!\n\n📞 ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
  }
  return `This is outside our company's scope. Please contact our company for further assistance!\n\n📞 ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// RULE 3 — Keyword-grounded answers (service details, contact, about)
// ─────────────────────────────────────────────────────────────────────────────
export function getCompanyAnswerByKeyword(userQuery: string, lang: 'ta' | 'hi' | 'en' = 'en'): string {
  const q = userQuery.toLowerCase().trim();

  // Pricing guard
  if (PRICING_KEYWORDS.some((k) => q.includes(k))) {
    return getPricingReply(lang);
  }

  // Contact info
  if (q.includes('contact') || q.includes('phone') || q.includes('number') || q.includes('email') || q.includes('reach') || q.includes('தொடர்பு') || q.includes('संपर्क')) {
    if (lang === 'ta') return `📞 தொடர்புக்கு: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}\n🌐 ${COMPANY_INFO.website}`;
    if (lang === 'hi') return `📞 संपर्क: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}\n🌐 ${COMPANY_INFO.website}`;
    return `📞 Contact: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}\n🌐 ${COMPANY_INFO.website}`;
  }

  // Address
  if (q.includes('address') || q.includes('location') || q.includes('office') || q.includes('where') || q.includes('முகவரி') || q.includes('पता')) {
    if (lang === 'ta') return `📍 *தலைமை அலுவலகம்*:\n${COMPANY_INFO.address}\n\n📞 ${COMPANY_INFO.phones}`;
    if (lang === 'hi') return `📍 *कार्यालय का पता*:\n${COMPANY_INFO.address}\n\n📞 ${COMPANY_INFO.phones}`;
    return `📍 *Corporate Office*:\n${COMPANY_INFO.address}\n\n📞 ${COMPANY_INFO.phones}`;
  }

  // About / Company
  if (q.includes('about') || q.includes('company') || q.includes('gloaro') || q.includes('who') || q.includes('overview') || q.includes('பற்றி') || q.includes('कंपनी')) {
    if (lang === 'ta') return `🏢 *GLOARO PVT LTD*\n\n"ஒரு சுற்றுச்சூழல் அமைப்பு. பல வணிகத் தீர்வுகள்."\n\nதொழில்முனைவோர், ஸ்டார்ட்அப்கள் மற்றும் நிறுவனங்களை வளர்க்க உதவும் தொழில்நுட்ப சுற்றுச்சூழல் அமைப்பு.\n\n📞 ${COMPANY_INFO.phones} | 📧 ${COMPANY_INFO.email}`;
    if (lang === 'hi') return `🏢 *GLOARO PVT LTD*\n\n"एक पारिस्थितिकी तंत्र। कई व्यावसायिक समाधान।"\n\nहम उद्यमियों, स्टार्टअप्स और उद्यमों को सशक्त बनाने वाली एक तकनीकी कंपनी हैं।\n\n📞 ${COMPANY_INFO.phones} | 📧 ${COMPANY_INFO.email}`;
    return `🏢 *GLOARO PVT LTD*\n\n"One Ecosystem. Multiple Business Solutions."\n\nA technology-driven business ecosystem empowering entrepreneurs, startups, SMEs, and enterprises.\n\n📞 ${COMPANY_INFO.phones} | 📧 ${COMPANY_INFO.email}`;
  }

  // Fallback (Rule 5)
  return getOutOfScopeReply(lang);
}

// ─────────────────────────────────────────────────────────────────────────────
// Legacy compatibility exports — used by bot-engine.service.ts
// These provide the English defaults so the service compiles without changes.
// ─────────────────────────────────────────────────────────────────────────────
const _enWelcome = getWelcomeContent('en');
/** @deprecated Use getWelcomeContent(lang) for multilingual support */
export const WELCOME_TEXT: string = _enWelcome.body;
/** @deprecated Use getWelcomeContent(lang).buttons for multilingual support */
export const MAIN_MENU_BUTTONS: { id: string; title: string }[] = _enWelcome.buttons;

/** @deprecated Use getButtonServiceList(id, lang) for multilingual support */
export const BUTTON_SERVICE_LIST: Record<string, string> = {
  [BUTTON_IDS.DM]:   getButtonServiceList(BUTTON_IDS.DM,   'en'),
  [BUTTON_IDS.TECH]: getButtonServiceList(BUTTON_IDS.TECH, 'en'),
  [BUTTON_IDS.ECOM]: getButtonServiceList(BUTTON_IDS.ECOM, 'en'),
};

/** @deprecated Use getPricingReply(lang) for multilingual support */
export const PRICING_REPLY: string = getPricingReply('en');
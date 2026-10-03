// ─────────────────────────────────────────────────────────────────────────────
// GLOARO PVT LTD — Multilingual Knowledge Base
// Supports: English (en) | Tamil (ta) | Hindi (hi)
//
// Conversation flow:
//   Step 1 → Any first message  : Language selection buttons (no flags)
//   Step 2 → Language chosen    : Save [Lang:xx] marker → Welcome + 3 service buttons
//   Step 3 → Service button     : Bullet list ONLY (no contact info)
//   Step 4 → Keyword follow-up  : Detailed description WITH contact info
// ─────────────────────────────────────────────────────────────────────────────

export const COMPANY_INFO = {
  name:    'GLOARO PVT LTD',
  phones:  '7200537033 / 7200073704',
  email:   'info@gloaro.com',
  website: 'www.gloaro.com',
  address: 'SF No. 101/2B, Esai Towers, Salem Main Road, Near Bypass, Emapper, Kallakurichi - 606202, Tamil Nadu, India.',
};

// ─── Stable button IDs ────────────────────────────────────────────────────────
export const BUTTON_IDS = {
  DM:      'btn_dm',
  TECH:    'btn_tech',
  ECOM:    'btn_ecom',
  LANG_EN: 'lang_en',
  LANG_TA: 'lang_ta',
  LANG_HI: 'lang_hi',
} as const;

/** Language codes */
export type Lang = 'ta' | 'hi' | 'en';

/** All three language button IDs in one array (for quick lookup) */
export const LANG_BUTTON_IDS: string[] = [
  BUTTON_IDS.LANG_EN,
  BUTTON_IDS.LANG_TA,
  BUTTON_IDS.LANG_HI,
];

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
  'मूल्य', 'शुल्क', 'कितना', 'खर्च',
];

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
      { id: BUTTON_IDS.LANG_EN, title: 'English'  },
      { id: BUTTON_IDS.LANG_TA, title: 'தமிழ்'    },
      { id: BUTTON_IDS.LANG_HI, title: 'हिंदी'    },
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Welcome message + 3 service buttons (after language is chosen)
// ─────────────────────────────────────────────────────────────────────────────
export function getServiceMenuContent(lang: Lang): { body: string; buttons: { id: string; title: string }[] } {
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
        { id: BUTTON_IDS.TECH, title: 'தொழில்நுட்ப தீர்வுகள்'      },
        { id: BUTTON_IDS.ECOM, title: 'இ-காமர்ஸ் தீர்வுகள்'        },
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
        { id: BUTTON_IDS.TECH, title: 'तकनीकी समाधान'      },
        { id: BUTTON_IDS.ECOM, title: 'ई-कॉमर्स समाधान'   },
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
      { id: BUTTON_IDS.DM,   title: 'Digital Marketing'      },
      { id: BUTTON_IDS.TECH, title: 'Technology Solutions'   },
      { id: BUTTON_IDS.ECOM, title: 'E-Commerce Solutions'   },
    ],
  };
}

/** @deprecated alias — bot-engine.service.ts uses getWelcomeContent */
export function getWelcomeContent(lang: Lang): { body: string; buttons: { id: string; title: string }[] } {
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
        '• *சோஷியல் மீடியா மார்க்கெட்டிங்:* இன்ஸ்டாகிராம், பேஸ்புக் மூலம் பிராண்ட் வாடிக்கையாளர்களை ஈர்ப்பது.\n' +
        '• *கூகுள் & மெட்டா விளம்பரங்கள்:* உடனடி லீட்ஸ் மற்றும் விற்பனைக்கான விளம்பரங்கள்.\n' +
        '• *SEO (தேடுபொறி உகப்பாக்கம்):* கூகுளில் உங்கள் வெப்சைட்டை முன்னிலைப்படுத்துவது.\n' +
        '• *கன்டென்ட் மார்க்கெட்டிங்:* தரமான உள்ளடக்கம் உருவாக்குதல்.\n' +
        '• *பிராண்டிங் & டிசைன்:* தொழில்முறை லோகோ மற்றும் வடிவமைப்பு.\n\n' +
        '_குறிப்பிட்ட சேவை பெயரை தட்டச்சு செய்து விவரங்கள் பெறுங்கள்!_'
      );
    }
    if (buttonId === BUTTON_IDS.TECH) {
      return (
        '💻 *தொழில்நுட்ப தீர்வுகள்*\n\n' +
        '• *வெப்சைட் உருவாக்கம்:* வேகமான மற்றும் நவீன வலைத்தளங்கள்.\n' +
        '• *மொபைல் ஆப் உருவாக்கம்:* ஆண்ட்ராய்டு மற்றும் ஐஓஎஸ் செயலிகள்.\n' +
        '• *கஸ்டம் சாஃப்ட்வேர்:* உங்கள் வணிகத் தேவைக்கேற்ப பிரத்யேக மென்பொருள்.\n' +
        '• *CRM & ERP தீர்வுகள்:* வாடிக்கையாளர் தரவு மற்றும் செயல்பாடுகளை எளிமைப்படுத்துதல்.\n' +
        '• *வாட்ஸ்அப் பாட் & AI:* 24/7 தானியங்கி வாடிக்கையாளர் ஆதரவு.\n\n' +
        '_குறிப்பிட்ட சேவை பெயரை தட்டச்சு செய்து விவரங்கள் பெறுங்கள்!_'
      );
    }
    return (
      '🛒 *இ-காமர்ஸ் தீர்வுகள்*\n\n' +
      '• *இ-காமர்ஸ் வெப்சைட் & ஆப்:* ஆன்லைன் ஷாப்பிங் ஸ்டோர் உருவாக்கம்.\n' +
      '• *ஆன்லைன் ஸ்டோர் டெவலப்மென்ட்:* எளிமையான டிஜிட்டல் ஸ்டோர் அமைப்பு.\n' +
      '• *தயாரிப்பு மேலாண்மை (Product Listing):* கேட்டலாக் தயாரிப்பு மற்றும் மேலாண்மை.\n' +
      '• *B2B & B2C விற்பனை:* மொத்த மற்றும் சில்லறை விற்பனை சேனல்கள்.\n' +
      '• *இ-காமர்ஸ் மார்க்கெட்டிங்:* ஆன்லைன் விற்பனையை அதிகரிக்கும் பிரச்சாரங்கள்.\n' +
      '• *பேமெண்ட் கேட்வே:* பாதுகாப்பான யுபிஐ, கார்டு பரிவர்த்தனைகள்.\n\n' +
      '_குறிப்பிட்ட சேவை பெயரை தட்டச்சு செய்து விவரங்கள் பெறுங்கள்!_'
    );
  }

  if (lang === 'hi') {
    if (buttonId === BUTTON_IDS.DM) {
      return (
        '📈 *डिजिटल मार्केटिंग सेवाएँ*\n\n' +
        '• *डिजिटल मार्केटिंग:* लक्षित ग्राहकों तक पहुँचना।\n' +
        '• *सोशल मीडिया मार्केटिंग:* इंस्टाग्राम और फेसबुक पर जुड़ाव।\n' +
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

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — Keyword follow-up → detailed description WITH contact info
// ─────────────────────────────────────────────────────────────────────────────
export function getDetailedServiceReply(serviceKey: 'dm' | 'tech' | 'ecom', lang: Lang): string {
  const c = COMPANY_INFO;

  if (lang === 'ta') {
    if (serviceKey === 'dm') {
      return (
        '📈 *டிஜிட்டல் மார்க்கெட்டிங் — விரிவான விவரங்கள்*\n\n' +
        '• *டிஜிட்டல் மார்க்கெட்டிங்:* இலக்கு வாடிக்கையாளர்களை அடைய ஆன்லைனில் விளம்பரப்படுத்துதல்.\n' +
        '• *சோஷியல் மீடியா மார்க்கெட்டிங் (SMM):* இன்ஸ்டாகிராம், பேஸ்புக், லிங்க்ட்இன் மூலம் பிராண்ட் வாடிக்கையாளர்களை ஈர்ப்பது.\n' +
        '• *கூகுள் & மெட்டா விளம்பரங்கள்:* உடனடி லீட்ஸ் மற்றும் விற்பனைக்கான விளம்பரங்கள்.\n' +
        '• *SEO (தேடுபொறி உகப்பாக்கம்):* கூகுளில் உங்கள் வெப்சைட்டை முன்னிலைப்படுத்துவது.\n' +
        '• *கன்டென்ட் மார்க்கெட்டிங்:* வாடிக்கையாளர்களை ஈர்க்கும் தரமான வலைப்பதிவுகள் மற்றும் வீடியோக்கள்.\n' +
        '• *பிராண்டிங் & டிசைன்:* தொழில்முறை லோகோ மற்றும் பிராண்ட் அடையாளம்.\n\n' +
        `📞 தொடர்புக்கு: ${c.phones}\n📧 மின்னஞ்சல்: ${c.email}`
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
        `📞 தொடர்புக்கு: ${c.phones}\n📧 மின்னஞ்சல்: ${c.email}`
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
      `📞 தொடர்புக்கு: ${c.phones}\n📧 மின்னஞ்சல்: ${c.email}`
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
        `📞 संपर्क: ${c.phones}\n📧 ईमेल: ${c.email}`
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
        `📞 संपर्क: ${c.phones}\n📧 ईमेल: ${c.email}`
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
      `📞 संपर्क: ${c.phones}\n📧 ईमेल: ${c.email}`
    );
  }

  // English (default)
  if (serviceKey === 'dm') {
    return (
      '📈 *Digital Marketing Services — Detailed*\n\n' +
      '• *Digital Marketing:* Promoting your business online to reach targeted customers and build a strong brand presence.\n' +
      '• *Social Media Marketing (SMM):* Engaging audiences and building brand loyalty across Instagram, Facebook, and LinkedIn.\n' +
      '• *Google & Meta Ads:* Data-driven paid ad campaigns to generate instant leads and drive sales.\n' +
      '• *SEO (Search Engine Optimization):* Optimizing your website to rank higher on Google organic search.\n' +
      '• *Content Marketing:* Creating valuable blogs, videos, and content that attract and convert customers.\n' +
      '• *Branding & Design:* Crafting a premium brand identity with professional logos and creative design.\n\n' +
      `📞 Contact: ${c.phones}\n📧 Email: ${c.email}`
    );
  }
  if (serviceKey === 'tech') {
    return (
      '💻 *Technology Solutions — Detailed*\n\n' +
      '• *Website Development:* Building fast, responsive, SEO-friendly websites that convert visitors.\n' +
      '• *Mobile App Development:* High-performance native and cross-platform apps for Android and iOS.\n' +
      '• *Custom Software Development:* Tailor-made software solutions built to your exact specifications.\n' +
      '• *CRM & ERP Solutions:* Streamlining customer relations, inventory, and business operations.\n' +
      '• *WhatsApp BOT & AI Solutions:* Automating 24/7 customer support with intelligent chatbots.\n\n' +
      `📞 Contact: ${c.phones}\n📧 Email: ${c.email}`
    );
  }
  return (
    '🛒 *E-Commerce Solutions — Detailed*\n\n' +
    '• *E-Commerce Website & App:* Launching feature-rich, conversion-optimized online stores.\n' +
    '• *Online Store Development:* User-friendly digital storefronts built for seamless shopping.\n' +
    '• *Product Listing & Management:* Comprehensive catalog, inventory, and order management.\n' +
    '• *B2B & B2C Sales:* Robust channels supporting both wholesale and retail digital sales.\n' +
    '• *E-Commerce Marketing:* Data-driven campaigns to maximize online reach and revenue.\n' +
    '• *Payment Gateway Integration:* Secure UPI, credit/debit card, and digital wallet payments.\n\n' +
    `📞 Contact: ${c.phones}\n📧 Email: ${c.email}`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pricing reply (multilingual) — WITH contact info
// ─────────────────────────────────────────────────────────────────────────────
export function getPricingReply(lang: Lang): string {
  const c = COMPANY_INFO;
  if (lang === 'ta') {
    return (
      'கட்டண விவரங்கள் மற்றும் சேவைக் கட்டணங்கள் உங்களது தேவைகளைப் பொறுத்து மாறுபடும்.\n' +
      'கூடுதல் விவரங்களுக்கு எங்களது நிறுவனத்தைத் தொடர்பு கொள்ளவும்!\n\n' +
      `📞 தொடர்புக்கு: ${c.phones}\n📧 மின்னஞ்சல்: ${c.email}`
    );
  }
  if (lang === 'hi') {
    return (
      'मूल्य विवरण और सेवा शुल्क आपकी आवश्यकताओं के अनुसार भिन्न हो सकते हैं।\n' +
      'अधिक जानकारी के लिए कृपया हमारी कंपनी से संपर्क करें!\n\n' +
      `📞 संपर्क: ${c.phones}\n📧 ईमेल: ${c.email}`
    );
  }
  return (
    'Pricing details and service charges vary based on your specific requirements.\n' +
    'Please contact our company for a customised quote!\n\n' +
    `📞 Contact: ${c.phones}\n📧 Email: ${c.email}`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Out-of-scope reply (multilingual) — WITH contact info
// ─────────────────────────────────────────────────────────────────────────────
export function getOutOfScopeReply(lang: Lang): string {
  const c = COMPANY_INFO;
  if (lang === 'ta') {
    return (
      'இது எங்கள் நிறுவனத்தின் சேவைக் குறிப்புகளுக்கு அப்பாற்பட்டது.\n' +
      'கூடுதல் விவரங்கள் அல்லது உதவிக்கு எங்களது நிறுவனத்தைத் தொடர்பு கொள்ளவும்!\n\n' +
      `📞 தொடர்புக்கு: ${c.phones}\n📧 மின்னஞ்சல்: ${c.email}`
    );
  }
  if (lang === 'hi') {
    return (
      'यह हमारी कंपनी के दायरे से बाहर है।\n' +
      'अधिक जानकारी के लिए कृपया हमारी कंपनी से संपर्क करें!\n\n' +
      `📞 संपर्क: ${c.phones}\n📧 ईमेल: ${c.email}`
    );
  }
  return (
    "This is outside our company's scope.\n" +
    'Please contact us for further assistance!\n\n' +
    `📞 Contact: ${c.phones}\n📧 Email: ${c.email}`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Keyword-based answer router — WITH contact info (for free-text follow-ups)
// ─────────────────────────────────────────────────────────────────────────────
export function getCompanyAnswerByKeyword(userQuery: string, lang: Lang = 'en'): string {
  const q = userQuery.toLowerCase().trim();
  const c = COMPANY_INFO;

  // Pricing
  if (PRICING_KEYWORDS.some((k) => q.includes(k))) return getPricingReply(lang);

  // Digital Marketing keywords
  if (
    q.includes('smm') || q.includes('seo') || q.includes('ads') ||
    q.includes('social media') || q.includes('social') || q.includes('branding') ||
    q.includes('content') || q.includes('digital marketing') || q.includes('digital') ||
    q.includes('meta ads') || q.includes('google ads') || q.includes('marketing') ||
    q.includes('டிஜிட்டல்') || q.includes('மார்க்கெட்டிங்') ||
    q.includes('डिजिटल') || q.includes('मार्केटिंग') || q.includes('एसईओ')
  ) { return getDetailedServiceReply('dm', lang); }

  // Technology keywords
  if (
    q.includes('website') || q.includes('web') || q.includes('mobile app') ||
    q.includes('mobile') || q.includes('app') || q.includes('software') ||
    q.includes('crm') || q.includes('erp') || q.includes('whatsapp bot') ||
    q.includes('bot') || q.includes('ai') || q.includes('tech') ||
    q.includes('வெப்சைட்') || q.includes('மொபைல்') || q.includes('சாஃப்ட்வேர்') ||
    q.includes('वेबसाइट') || q.includes('मोबाइल') || q.includes('सॉफ्टवेयर')
  ) { return getDetailedServiceReply('tech', lang); }

  // E-Commerce keywords
  if (
    q.includes('ecommerce') || q.includes('e-commerce') || q.includes('online store') ||
    q.includes('store') || q.includes('b2b') || q.includes('b2c') ||
    q.includes('payment') || q.includes('listing') || q.includes('product') ||
    q.includes('இ-காமர்ஸ்') || q.includes('ई-कॉमर्स')
  ) { return getDetailedServiceReply('ecom', lang); }

  // Contact info
  if (
    q.includes('contact') || q.includes('phone') || q.includes('number') ||
    q.includes('call') || q.includes('email') || q.includes('reach') ||
    q.includes('தொடர்பு') || q.includes('संपर्क')
  ) {
    if (lang === 'ta') return `📞 தொடர்புக்கு: ${c.phones}\n📧 மின்னஞ்சல்: ${c.email}\n🌐 வலைத்தளம்: ${c.website}`;
    if (lang === 'hi') return `📞 संपर्क: ${c.phones}\n📧 ईमेल: ${c.email}\n🌐 वेबसाइट: ${c.website}`;
    return `📞 Contact: ${c.phones}\n📧 Email: ${c.email}\n🌐 Website: ${c.website}`;
  }

  // Address / location
  if (
    q.includes('address') || q.includes('location') || q.includes('office') || q.includes('where') ||
    q.includes('முகவரி') || q.includes('पता')
  ) {
    if (lang === 'ta') return `📍 *தலைமை அலுவலகம்*:\n${c.address}\n\n📞 ${c.phones}`;
    if (lang === 'hi') return `📍 *कार्यालय का पता*:\n${c.address}\n\n📞 ${c.phones}`;
    return `📍 *Corporate Office*:\n${c.address}\n\n📞 ${c.phones}`;
  }

  // About company
  if (
    q.includes('about') || q.includes('company') || q.includes('gloaro') || q.includes('who') ||
    q.includes('பற்றி') || q.includes('कंपनी')
  ) {
    if (lang === 'ta') return `🏢 *GLOARO PVT LTD*\n\n"ஒரு சுற்றுச்சூழல் அமைப்பு. பல வணிகத் தீர்வுகள்."\n\nதொழில்முனைவோர் மற்றும் நிறுவனங்களை இணைக்கும் தொழில்நுட்ப சுற்றுச்சூழல் அமைப்பு.\n\n📞 ${c.phones} | 📧 ${c.email}`;
    if (lang === 'hi') return `🏢 *GLOARO PVT LTD*\n\n"एक पारिस्थितिकी तंत्र। कई व्यावसायिक समाधान।"\n\n📞 ${c.phones} | 📧 ${c.email}`;
    return `🏢 *GLOARO PVT LTD*\n\n"One Ecosystem. Multiple Business Solutions."\n\nA technology-driven business ecosystem empowering entrepreneurs, startups, SMEs, and enterprises.\n\n📞 ${c.phones} | 📧 ${c.email}`;
  }

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
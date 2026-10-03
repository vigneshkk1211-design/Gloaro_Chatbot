// ─────────────────────────────────────────────────────────────────────────────
// GLOARO PVT LTD — Multilingual Knowledge Base (Full Service Match & Auto Welcome)
// ─────────────────────────────────────────────────────────────────────────────

export const COMPANY_INFO = {
  name: 'GLOARO PVT LTD',
  phones: '7200537033 / 7200073704',
  email: 'info@gloaro.com',
  website: 'www.gloaro.com',
  address: 'SF No. 101/2B, Esai Towers, Salem Main Road, Near Bypass, Emapper, Kallakurichi - 606202, Tamil Nadu, India.',
};

export const MENU_TRIGGER_KEYWORDS = [
  'hi', 'hello', 'hey', 'start', 'menu', 'help',
  'services', 'service', 'good morning', 'good evening',
  'வணக்கம்', 'தொடங்கு', 'नमस्ते', 'a', 'b', 'ok', '1', '2'
];

export const PRICING_KEYWORDS = [
  'price', 'pricing', 'cost', 'budget', 'charge', 'charges', 'fee', 'fees',
  'rate', 'rates', 'quote', 'quotation', 'how much', 'what is the cost',
  'விலை', 'கட்டணம்', 'मूल्य', 'शुल्क'
];

export const WELCOME_TEXT = `வணக்கம்! GLOARO PVT LTD-க்கு வரவேற்கிறோம்! 🚀✨\n\n"ஒரு சுற்றுச்சூழல் அமைப்பு. பல வணிகத் தீர்வுகள்."\n\nதொழில்முனைவோர் மற்றும் நிறுவனங்களை வளர்க்க உதவும் தொழில்நுட்ப சுற்றுச்சூழல் அமைப்பு.`;
export const MAIN_MENU_BUTTONS = [
  { id: 'btn_dm', title: 'டிஜிட்டல் மார்க்கெட்டிங்' },
  { id: 'btn_tech', title: 'தொழில்நுட்ப தீர்வுகள்' },
  { id: 'btn_ecom', title: 'இ-காமர்ஸ் தீர்வுகள்' },
];
export const BUTTON_IDS = { DM: 'btn_dm', TECH: 'btn_tech', ECOM: 'btn_ecom' };

// மொழி கண்டறியும் துல்லியமான லாஜிக்
export function detectLanguage(text: string): 'ta' | 'hi' | 'en' {
  if (!text) return 'en';
  const clean = text.toLowerCase();

  const tamilRegex = /[\u0B80-\u0BFF]/;
  const hindiRegex = /[\u0900-\u097F]/;

  if (
    tamilRegex.test(text) ||
    clean.includes('வணக்கம்') ||
    clean.includes('டிஜிட்டல்') ||
    clean.includes('தொழில்நுட்ப') ||
    clean.includes('இ-காமர்ஸ்') ||
    clean.includes('வெப்சைட்') ||
    clean.includes('மொபைல்') ||
    clean.includes('மார்க்கெட்டிங்')
  ) {
    return 'ta';
  }

  if (
    hindiRegex.test(text) ||
    clean.includes('नमस्ते') ||
    clean.includes('डिजिटल') ||
    clean.includes('तकनीकी') ||
    clean.includes('ई-कॉमर्स') ||
    clean.includes('वेबसाइट') ||
    clean.includes('मोबाइल')
  ) {
    return 'hi';
  }

  return 'en';
}

export function getWelcomeContent(lang: 'ta' | 'hi' | 'en') {
  if (lang === 'ta') {
    return {
      body: `வணக்கம்! GLOARO PVT LTD-க்கு வரவேற்கிறோம்! 🚀✨\n\n"ஒரு சுற்றுச்சூழல் அமைப்பு. பல வணிகத் தீர்வுகள்."\n\nதொழில்முனைவோர், ஸ்டார்ட்அப்கள் மற்றும் நிறுவனங்களை வளர்க்க உதவும் தொழில்நுட்ப சுற்றுச்சூழல் அமைப்பு நாங்கள்.\n\nஇன்று உங்கள் வணிகத்தை எப்படி உயர்த்த உதவ முடியும்? கீழே உள்ள சேவைகளில் ஒன்றைத் தேர்ந்தெடுக்கவும்:`,
      buttons: [
        { id: 'btn_dm', title: 'டிஜிட்டல் மார்க்கெட்டிங்' },
        { id: 'btn_tech', title: 'தொழில்நுட்ப தீர்வுகள்' },
        { id: 'btn_ecom', title: 'இ-காமர்ஸ் தீர்வுகள்' }
      ]
    };
  } else if (lang === 'hi') {
    return {
      body: `नमस्ते! GLOARO PVT LTD में आपका स्वागत है! 🚀✨\n\n"एक पारिस्थितिकी तंत्र। कई व्यावसायिक समाधान।"\n\nहम उद्यमियों और उद्यमों को सशक्त बनाने वाली एक तकनीकी कंपनी हैं।\n\nआज हम आपके व्यवसाय को बढ़ाने में कैसे मदद कर सकते हैं? कृपया नीचे एक सेवा चुनें:`,
      buttons: [
        { id: 'btn_dm', title: 'डिजिटल मार्केटिंग' },
        { id: 'btn_tech', title: 'तकनीकी समाधान' },
        { id: 'btn_ecom', title: 'ई-कॉमर्स समाधान' }
      ]
    };
  } else {
    return {
      body: `👋 Hello! Welcome to *GLOARO PVT LTD*! 🚀✨\n\n"One Ecosystem. Multiple Business Solutions."\n\nA technology-driven business ecosystem connecting entrepreneurs and startups.\n\nHow can we help scale your business today? Please choose a service below:`,
      buttons: [
        { id: 'btn_dm', title: 'Digital Marketing' },
        { id: 'btn_tech', title: 'Technology Solutions' },
        { id: 'btn_ecom', title: 'E-Commerce Solutions' }
      ]
    };
  }
}

// தனிப்பட்ட சேவை விவரங்கள் (Images 1 & 2 படி மும்மொழியில்)
export function getDetailedServiceReply(serviceKey: string, lang: 'ta' | 'hi' | 'en'): string {
  if (lang === 'ta') {
    if (serviceKey === 'dm') {
      return `📈 *டிஜிட்டல் மார்க்கெட்டிங் சேவைகள்*:\n\n• டிஜிட்டல் மார்க்கெட்டிங்: இலக்கு வாடிக்கையாளர்களை அடைய ஆன்லைனில் விளம்பரப்படுத்துதல்.\n• சோஷியல் மீடியா மார்க்கெட்டிங்: இன்ஸ்டாகிராம், பேஸ்புக் மூலம் பிராண்ட் வாடிக்கையாளர்களை ஈர்ப்பது.\n• கூகுள் & மெட்டா விளம்பரங்கள்: உடனடி லீட்ஸ் மற்றும் விற்பனைக்கான விளம்பரங்கள்.\n• SEO (தேடுபொறி உகப்பாக்கம்): கூகுளில் உங்கள் வெப்சைட்டை முன்னிலைப்படுத்துவது.\n• பிராண்டிங் & டிசைன்: தொழில்முறை லோகோ மற்றும் வடிவமைப்பு.\n\n📞 தொடர்புக்கு: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
    } else if (serviceKey === 'tech') {
      return `💻 *தொழில்நுட்ப தீர்வுகள்*:\n\n• வெப்சைட் உருவாக்கம்: வேகமான மற்றும் நவீன வலைத்தளங்கள்.\n• மொபைல் ஆப் உருவாக்கம்: ஆண்ட்ராய்டு மற்றும் ஐஓஎஸ் செயலிகள்.\n• கஸ்டம் சாஃப்ட்வேர்: உங்கள் வணிகத் தேவைக்கேற்ப பிரத்யேக மென்பொருள்.\n• CRM & ERP தீர்வுகள்: வாடிக்கையாளர் தரவு மற்றும் செயல்பாடுகளை எளிமைப்படுத்துதல்.\n• வாட்ஸ்அப் பாட் & AI: 24/7 தானியங்கி வாடிக்கையாளர் ஆதரவு.\n\n📞 தொடர்புக்கு: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
    } else if (serviceKey === 'ecom') {
      return `🛒 *இ-காமர்ஸ் தீர்வுகள்*:\n\n• இ-காமர்ஸ் வெப்சைட் & ஆப்: ஆன்லைன் ஷாப்பிங் ஸ்டோர் உருவாக்கம்.\n• ஆன்லைன் ஸ்டோர் டெவலப்மென்ட்: எளிமையான டிஜிட்டல் ஸ்டோர் அமைப்பு.\n• தயாரிப்பு மேலாண்மை (Product Listing): கேட்டலாக் தயாரிப்பு மற்றும் மேலாண்மை.\n• B2B & B2C விற்பனை: மொத்த மற்றும் சில்லறை விற்பனை சேனல்கள்.\n• பேமெண்ட் கேட்வே: பாதுகாப்பான யுபிஐ, கார்டு பரிவர்த்தனைகள்.\n\n📞 தொடர்புக்கு: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
    }
  } else if (lang === 'hi') {
    if (serviceKey === 'dm') {
      return `📈 *डिजिटल मार्केटिंग सेवाएँ*:\n\n• डिजिटल मार्केटिंग: लक्षित ग्राहकों तक पहुँचना।\n• सोशल मीडिया मार्केटिंग: इंस्टाग्राम और फेसबुक पर जुड़ाव।\n• गूगल और मेटा विज्ञापन: त्वरित लीड और बिक्री।\n• एसईओ: गूगल खोज परिणामों में रैंकिंग बढ़ाना।\n• ब्रांडिंग और डिज़ाइन: पेशेवर लोगो और विजुअल डिज़ाइन।\n\n📞 संपर्क: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
    } else if (serviceKey === 'tech') {
      return `💻 *तकनीकी समाधान*:\n\n• वेबसाइट विकास: आधुनिक और तेज़ वेबसाइटें।\n• मोबाइल ऐप विकास: एंड्रॉइड और आईओएस ऐप।\n• कस्टम सॉफ्टवेयर: आपकी व्यावसायिक ज़रूरतों के अनुसार।\n• CRM और ERP समाधान: डेटा और संचालन को सुव्यवस्थित करना।\n• व्हाट्सएप बॉट और AI: 24/7 स्वचालित सहायता।\n\n📞 संपर्क: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
    } else if (serviceKey === 'ecom') {
      return `🛒 *ई-कॉमर्स समाधान*:\n\n• ई-कॉमर्स वेबसाइट और ऐप: ऑनलाइन शॉपिंग स्टोर।\n• ऑनलाइन स्टोर विकास: सहज खरीदारी अनुभव।\n• उत्पाद सूची और प्रबंधन: कैटलॉग इन्वेंट्री प्रबंधन।\n• B2B और B2C बिक्री: थोक और खुदरा बिक्री चैनल।\n• पेमेंट गेटवे एकीकरण: सुरक्षित भुगतान विकल्प।\n\n📞 संपर्क: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
    }
  }

  // English Default
  if (serviceKey === 'dm') {
    return `📈 *Digital Marketing Services*:\n\n• Digital Marketing: Promoting your business online to reach targeted customers.\n• Social Media Marketing: Engaging audiences across Instagram, Facebook, and LinkedIn.\n• Google & Meta Ads: Running targeted ads to drive instant leads.\n• SEO (Search Engine Optimization): Optimizing your website to rank higher.\n• Branding & Design: Crafting a unique brand identity.\n\n📞 Contact: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
  } else if (serviceKey === 'tech') {
    return `💻 *Technology Solutions*:\n\n• Website Development: Building fast, responsive websites.\n• Mobile App Development: High-performance mobile apps for Android & iOS.\n• Custom Software Development: Tailor-made software solutions.\n• CRM & ERP Solutions: Streamlining customer relations and operations.\n• Whatsapp BOT & AI Solutions: Automating 24/7 customer support.\n\n📞 Contact: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
  } else {
    return `🛒 *E-Commerce Solutions*:\n\n• E-Commerce Website & App: Launching feature-rich online stores.\n• Online Store Development: User-friendly digital stores.\n• Product Listing & Management: Catalog inventories management.\n• B2B & B2C Sales: Robust digital sales channels.\n• Payment Gateway Integration: Secure payment options (UPI, Cards).\n\n📞 Contact: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
  }
}

export function getButtonServiceList(buttonId: string, lang: 'ta' | 'hi' | 'en'): string {
  if (buttonId === 'btn_dm') return getDetailedServiceReply('dm', lang);
  if (buttonId === 'btn_tech') return getDetailedServiceReply('tech', lang);
  return getDetailedServiceReply('ecom', lang);
}

export function getPricingReply(lang: 'ta' | 'hi' | 'en'): string {
  if (lang === 'ta') {
    return `கட்டண விவரங்கள் மற்றும் சேவைக் கட்டணங்கள் உங்களது தேவைகளைப் பொறுத்து மாறுபடும். கூடுதல் விவரங்களுக்கு எங்களது நிறுவனத்தைத் தொடர்பு கொள்ளவும்!\n\n📞 தொடர்புக்கு: ${COMPANY_INFO.phones}\n📧 மின்னஞ்சல்: ${COMPANY_INFO.email}`;
  } else if (lang === 'hi') {
    return `मूल्य विवरण और सेवा शुल्क आपकी आवश्यकताओं के अनुसार भिन्न हो सकते हैं। अधिक जानकारी के लिए कृपया हमारी कंपनी से संपर्क करें!\n\n📞 संपर्क: ${COMPANY_INFO.phones}\n📧 ईमेल: ${COMPANY_INFO.email}`;
  } else {
    return `Pricing details and service charges vary based on your specific requirements. Please contact our company for further details!\n\n📞 Contact: ${COMPANY_INFO.phones}\n📧 Email: ${COMPANY_INFO.email}`;
  }
}

export function getOutOfScopeReply(lang: 'ta' | 'hi' | 'en'): string {
  if (lang === 'ta') {
    return `இது எங்கள் நிறுவனத்தின் சேவைக் குறிப்புகளுக்கு அப்பாற்பட்டது. கூடுதல் விவரங்கள் அல்லது உதவிக்கு எங்களது நிறுவனத்தைத் தொடர்பு கொள்ளவும்!\n\n📞 தொடர்புக்கு: ${COMPANY_INFO.phones}\n📧 மின்னஞ்சல்: ${COMPANY_INFO.email}`;
  } else if (lang === 'hi') {
    return `यह हमारी कंपनी के दायरे से बाहर है। अधिक जानकारी के लिए कृपया हमारी कंपनी से संपर्क करें!\n\n📞 संपर्क: ${COMPANY_INFO.phones}\n📧 ईमेल: ${COMPANY_INFO.email}`;
  } else {
    return `This is outside our company's scope. Please contact our company for further assistance!\n\n📞 Contact: ${COMPANY_INFO.phones}\n📧 Email: ${COMPANY_INFO.email}`;
  }
}

// கீவேர்ட் மூலம் சேவைகளைக் கண்டறிந்து அந்தந்த மொழியிலேயே பதில் அளித்தல்
export function getCompanyAnswerByKeyword(userQuery: string, lang: 'ta' | 'hi' | 'en'): string {
  const q = userQuery.toLowerCase().trim();

  if (q.includes('digital') || q.includes('social') || q.includes('seo') || q.includes('ads') || q.includes('டிஜிட்டல்') || q.includes('மார்க்கெட்டிங்') || q.includes('डिजिटल') || q.includes('मार्केटिंग') || q.includes('एसईओ')) {
    return getDetailedServiceReply('dm', lang);
  }
  if (q.includes('website') || q.includes('mobile') || q.includes('software') || q.includes('crm') || q.includes('erp') || q.includes('bot') || q.includes('வெப்சைட்') || q.includes('மொபைல்') || q.includes('சாஃப்ட்வேர்') || q.includes('வேலை') || q.includes('वेबसाइट') || q.includes('मोबाइल') || q.includes('सॉफ्टवेयर')) {
    return getDetailedServiceReply('tech', lang);
  }
  if (q.includes('e-commerce') || q.includes('ecommerce') || q.includes('store') || q.includes('listing') || q.includes('b2b') || q.includes('b2c') || q.includes('payment') || q.includes('இ-காமர்ஸ்') || q.includes('வலைத்தளம்') || q.includes('ई-कॉमर्स')) {
    return getDetailedServiceReply('ecom', lang);
  }

  if (PRICING_KEYWORDS.some((k) => q.includes(k))) {
    return getPricingReply(lang);
  }

  if (q.includes('contact') || q.includes('phone') || q.includes('number') || q.includes('email') || q.includes('தொடர்பு') || q.includes('संपर्क')) {
    if (lang === 'ta') return `📞 தொடர்புக்கு: ${COMPANY_INFO.phones}\n📧 மின்னஞ்சல்: ${COMPANY_INFO.email}\n🌐 வலைத்தளம்: ${COMPANY_INFO.website}`;
    if (lang === 'hi') return `📞 संपर्क: ${COMPANY_INFO.phones}\n📧 ईमेल: ${COMPANY_INFO.email}\n🌐 वेबसाइट: ${COMPANY_INFO.website}`;
    return `📞 Contact: ${COMPANY_INFO.phones}\n📧 Email: ${COMPANY_INFO.email}\n🌐 Website: ${COMPANY_INFO.website}`;
  }

  if (q.includes('address') || q.includes('location') || q.includes('office') || q.includes('முகவரி') || q.includes('पता')) {
    if (lang === 'ta') return `📍 *தலைமை அலுவலகம்*:\n${COMPANY_INFO.address}\n\n📞 ${COMPANY_INFO.phones}`;
    if (lang === 'hi') return `📍 *कार्यालय का पता*:\n${COMPANY_INFO.address}\n\n📞 ${COMPANY_INFO.phones}`;
    return `📍 *Corporate Office*:\n${COMPANY_INFO.address}\n\n📞 ${COMPANY_INFO.phones}`;
  }

  if (q.includes('about') || q.includes('company') || q.includes('gloaro') || q.includes('பற்றி') || q.includes('कंपनी')) {
    if (lang === 'ta') return `🏢 *GLOARO PVT LTD*\n\n"ஒரு சுற்றுச்சூழல் அமைப்பு. பல வணிகத் தீர்வுகள்."\nதொழில்முனைவோர் மற்றும் நிறுவனங்களை இணைக்கும் தொழில்நுட்ப சுற்றுச்சூழல் அமைப்பு.\n\n📞 ${COMPANY_INFO.phones} | 📧 ${COMPANY_INFO.email}`;
    if (lang === 'hi') return `🏢 *GLOARO PVT LTD*\n\n"एक पारिस्थितिकी तंत्र। कई व्यावसायिक समाधान।"\n\n📞 ${COMPANY_INFO.phones} | 📧 ${COMPANY_INFO.email}`;
    return `🏢 *GLOARO PVT LTD*\n\n"One Ecosystem. Multiple Business Solutions."\nA technology-driven business ecosystem connecting entrepreneurs and startups.\n\n📞 ${COMPANY_INFO.phones} | 📧 ${COMPANY_INFO.email}`;
  }

  return getOutOfScopeReply(lang);
}

// ─────────────────────────────────────────────────────────────────────────────
// Legacy compatibility exports — required by bot-engine.service.ts.
// DO NOT DELETE — these are compile-time dependencies.
// ─────────────────────────────────────────────────────────────────────────────

/** @deprecated Use getButtonServiceList(id, lang) for multilingual support */
export const BUTTON_SERVICE_LIST: Record<string, string> = {
  btn_dm:   getButtonServiceList('btn_dm',   'en'),
  btn_tech: getButtonServiceList('btn_tech', 'en'),
  btn_ecom: getButtonServiceList('btn_ecom', 'en'),
};

/** @deprecated Use getPricingReply(lang) for multilingual support */
export const PRICING_REPLY: string = getPricingReply('en');
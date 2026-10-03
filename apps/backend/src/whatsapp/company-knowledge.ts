// ─────────────────────────────────────────────────────────────────────────────
// GLOARO PVT LTD — Clean Multilingual Knowledge Base (No citations)
// ─────────────────────────────────────────────────────────────────────────────

export const COMPANY_INFO = {
  name: 'GLOARO PVT LTD',
  phones: '7200537033 / 7200073704',
  email: 'info@gloaro.com',
  website: 'www.gloaro.com',
  address: 'SF No. 101/2B, Esai Towers, Salem Main Road, Near Bypass, Emapper, Kallakurichi - 606202, Tamil Nadu, India.',
  cin: 'U63120TN2026PTC194972',
  gst: '33AANCG1952H1ZL',
  tagline: 'One Ecosystem. Multiple Business Solutions.',
};

export const MENU_TRIGGER_KEYWORDS = [
  'hi', 'hello', 'hey', 'start', 'menu', 'help',
  'services', 'service', 'good morning', 'good evening',
  'வணக்கம்', 'தொடங்கு', 'नमस्ते'
];

export const PRICING_KEYWORDS = [
  'price', 'pricing', 'cost', 'budget', 'charge', 'charges', 'fee', 'fees',
  'rate', 'rates', 'quote', 'quotation', 'how much', 'what is the cost',
  'விலை', 'கட்டணம்', 'मूल्य', 'शुल्क'
];

// மொழி கண்டறியும் உதவி
export function detectLanguage(text: string): 'ta' | 'hi' | 'en' {
  const tamilRegex = /[\u0B80-\u0BFF]/;
  const hindiRegex = /[\u0900-\u097F]/;

  if (tamilRegex.test(text) || text.includes('வணக்கம்') || text.includes('டிஜிட்டல்') || text.includes('தொழில்நுட்ப') || text.includes('இ-காமர்ஸ்')) return 'ta';
  if (hindiRegex.test(text) || text.includes('नमस्ते') || text.includes('डिजिटल') || text.includes('तकनीकी') || text.includes('ई-कॉमर्स')) return 'hi';
  return 'en';
}

// வெல்கம் மெசேஜ் (எந்தவித [cite] குறிப்புகளும் இல்லாமல்)
export function getWelcomeContent(userText: string) {
  const lang = detectLanguage(userText);
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
      body: `नमस्ते! GLOARO PVT LTD में आपका स्वागत है! 🚀✨\n\n"एक पारिस्थितिकी तंत्र। कई व्यावसायिक समाधान।"\n\nहम उद्यमियों, स्टार्टअप्स और उद्यमों को सशक्त बनाने वाली एक तकनीकी कंपनी हैं।\n\nआज हम आपके व्यवसाय को बढ़ाने में कैसे मदद कर सकते हैं? कृपया नीचे एक सेवा चुनें:`,
      buttons: [
        { id: 'btn_dm', title: 'डिजिटल मार्केटिंग' },
        { id: 'btn_tech', title: 'तकनीकी समाधान' },
        { id: 'btn_ecom', title: 'ई-कॉमर्स समाधान' }
      ]
    };
  } else {
    return {
      body: `👋 Hello! Welcome to *GLOARO PVT LTD*! 🚀✨\n\n"One Ecosystem. Multiple Business Solutions."\n\nWe are a technology-driven business ecosystem connecting entrepreneurs, startups, SMEs, and established businesses.\n\nHow can we help scale your business today? Please choose a service below:`,
      buttons: [
        { id: 'btn_dm', title: 'Digital Marketing' },
        { id: 'btn_tech', title: 'Technology Solutions' },
        { id: 'btn_ecom', title: 'E-Commerce Solutions' }
      ]
    };
  }
}

// பட்டன் கிளிக் செய்யும்போது அந்தந்த மொழியிலேயே விவரங்களை அனுப்புதல்
export function getButtonServiceList(buttonId: string, userText: string): string {
  const lang = detectLanguage(userText);

  if (lang === 'ta') {
    if (buttonId === 'btn_dm') {
      return `📈 *டிஜிட்டல் மார்க்கெட்டிங் சேவைகள்*:\n\n• டிஜிட்டல் மார்க்கெட்டிங்\n• சோஷியல் மீடியா மார்க்கெட்டிங்\n• கூகுள் & மெட்டா விளம்பரங்கள்\n• SEO & கன்டென்ட் மார்க்கெட்டிங்\n• பிராண்டிங் & டிசைன்\n\n📞 தொடர்புக்கு: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
    } else if (buttonId === 'btn_tech') {
      return `💻 *தொழில்நுட்ப தீர்வுகள்*:\n\n• வெப்சைட் & மொபைல் ஆப் உருவாக்கம்\n• கஸ்டம் சாஃப்ட்வேர் டெவலப்மென்ட்\n• CRM & ERP தீர்வுகள்\n• வாட்ஸ்அப் பாட் & AI வணிகத் தீர்வுகள்\n\n📞 தொடர்புக்கு: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
    } else {
      return `🛒 *இ-காமர்ஸ் தீர்வுகள்*:\n\n• இ-காமர்ஸ் வெப்சைட் & ஆப்\n• ஆன்லைன் ஸ்டோர் உருவாக்கம்\n• தயாரிப்பு மேலாண்மை (Product Listing)\n• B2B & B2C விற்பனை\n• பேமெண்ட் கேட்வே ஒருங்கிணைப்பு\n\n📞 தொடர்புக்கு: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
    }
  } else if (lang === 'hi') {
    if (buttonId === 'btn_dm') {
      return `📈 *डिजिटल मार्केटिंग सेवाएँ*:\n\n• डिजिटल मार्केटिंग\n• सोशल मीडिया मार्केटिंग\n• गूगल और मेटा विज्ञापन\n• एसईओ और ब्रांडिंग\n\n📞 संपर्क: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
    } else if (buttonId === 'btn_tech') {
      return `💻 *तकनीकी समाधान*:\n\n• वेबसाइट और मोबाइल ऐप विकास\n• कस्टम सॉफ्टवेयर\n• CRM और ERP समाधान\n• व्हाट्सएप बॉट और AI समाधान\n\n📞 संपर्क: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
    } else {
      return `🛒 *ई-कॉमर्स समाधान*:\n\n• ई-कॉमर्स वेबसाइट और ऐप\n• ऑनलाइन स्टोर विकास\n• B2B और B2C बिक्री\n• पेमेंट गेटवे एकीकरण\n\n📞 संपर्क: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
    }
  }

  // English Default
  if (buttonId === 'btn_dm') {
    return `📈 *Digital Marketing Services*:\n\n• Digital Marketing\n• Social Media Marketing\n• Google & Meta Ads\n• SEO & Content Marketing\n• Branding & Design\n\n📞 Contact: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
  } else if (buttonId === 'btn_tech') {
    return `💻 *Technology Solutions*:\n\n• Website & Mobile App Development\n• Custom Software Development\n• CRM & ERP Solutions\n• WhatsApp BOT & AI Business Solutions\n\n📞 Contact: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
  } else {
    return `🛒 *E-Commerce Solutions*:\n\n• E-Commerce Website & App\n• Online Store Development\n• Product Listing & Management\n• B2B & B2C Sales\n• Payment Gateway Integration\n\n📞 Contact: ${COMPANY_INFO.phones}\n📧 ${COMPANY_INFO.email}`;
  }
}

// விலை விவரங்கள்
export function getPricingReply(userText: string): string {
  const lang = detectLanguage(userText);
  if (lang === 'ta') {
    return `கட்டண விவரங்கள் மற்றும் சேவைக் கட்டணங்கள் உங்களது தேவைகளைப் பொறுத்து மாறுபடும். கூடுதல் விவரங்களுக்கு எங்களது நிறுவனத்தைத் தொடர்பு கொள்ளவும்!\n\n📞 தொடர்புக்கு: ${COMPANY_INFO.phones}\n📧 மின்னஞ்சல்: ${COMPANY_INFO.email}`;
  } else if (lang === 'hi') {
    return `मूल्य विवरण और सेवा शुल्क आपकी आवश्यकताओं के अनुसार भिन्न हो सकते हैं। अधिक जानकारी के लिए कृपया हमारी कंपनी से संपर्क करें!\n\n📞 संपर्क: ${COMPANY_INFO.phones}\n📧 ईमेल: ${COMPANY_INFO.email}`;
  } else {
    return `Pricing details and service charges vary based on your specific requirements. Please contact our company for further details!\n\n📞 Contact: ${COMPANY_INFO.phones}\n📧 Email: ${COMPANY_INFO.email}`;
  }
}

// சம்பந்தமில்லாத கேள்விகளுக்கு
export function getOutOfScopeReply(userText: string): string {
  const lang = detectLanguage(userText);
  if (lang === 'ta') {
    return `இது எங்கள் நிறுவனத்தின் சேவைக் குறிப்புகளுக்கு அப்பாற்பட்டது. கூடுதல் விவரங்கள் அல்லது உதவிக்கு எங்களது நிறுவனத்தைத் தொடர்பு கொள்ளவும்!\n\n📞 தொடர்புக்கு: ${COMPANY_INFO.phones}\n📧 மின்னஞ்சல்: ${COMPANY_INFO.email}`;
  } else if (lang === 'hi') {
    return `यह हमारी कंपनी के दायरे से बाहर है। अधिक जानकारी के लिए कृपया हमारी कंपनी से संपर्क करें!\n\n📞 संपर्क: ${COMPANY_INFO.phones}\n📧 ईमेल: ${COMPANY_INFO.email}`;
  } else {
    return `This is outside our company's scope. Please contact our company for further assistance!\n\n📞 Contact: ${COMPANY_INFO.phones}\n📧 Email: ${COMPANY_INFO.email}`;
  }
}

export function getCompanyAnswerByKeyword(userQuery: string): string {
  const q = userQuery.toLowerCase().trim();
  const lang = detectLanguage(userQuery);

  if (PRICING_KEYWORDS.some((k) => q.includes(k))) {
    return getPricingReply(userQuery);
  }

  if (q.includes('contact') || q.includes('phone') || q.includes('number') || q.includes('email') || q.includes('தொடர்பு') || q.includes('संपर्क')) {
    if (lang === 'ta') return `📞 தொடர்புக்கு: ${COMPANY_INFO.phones}\n📧 மின்னஞ்சல்: ${COMPANY_INFO.email}\n🌐 வலைத்தளம்: ${COMPANY_INFO.website}`;
    if (lang === 'hi') return `📞 संपर्क: ${COMPANY_INFO.phones}\n📧 ईमेल: ${COMPANY_INFO.email}\n🌐 वेबसाइट: ${COMPANY_INFO.website}`;
    return `📞 Contact: ${COMPANY_INFO.phones}\n📧 Email: ${COMPANY_INFO.email}\n🌐 Website: ${COMPANY_INFO.website}`;
  }

  if (q.includes('address') || q.includes('location') || q.includes('office') || q.includes('முகவரி') || q.includes('पता')) {
    return `📍 *Corporate Office*:\n${COMPANY_INFO.address}\n\n📞 ${COMPANY_INFO.phones}`;
  }

  if (q.includes('about') || q.includes('company') || q.includes('gloaro') || q.includes('பற்றி') || q.includes('कंपनी')) {
    if (lang === 'ta') return `🏢 *GLOARO PVT LTD*\n\n"ஒரு சுற்றுச்சூழல் அமைப்பு. பல வணிகத் தீர்வுகள்."\nதொழில்முனைவோர் மற்றும் நிறுவனங்களை இணைக்கும் தொழில்நுட்ப சுற்றுச்சூழல் அமைப்பு.\n\n📞 ${COMPANY_INFO.phones} | 📧 ${COMPANY_INFO.email}`;
    if (lang === 'hi') return `🏢 *GLOARO PVT LTD*\n\n"एक पारिस्थितिकी तंत्र। कई व्यावसायिक समाधान।"\n\n📞 ${COMPANY_INFO.phones} | 📧 ${COMPANY_INFO.email}`;
    return `🏢 *GLOARO PVT LTD*\n\n"One Ecosystem. Multiple Business Solutions."\nA technology-driven business ecosystem connecting entrepreneurs and startups.\n\n📞 ${COMPANY_INFO.phones} | 📧 ${COMPANY_INFO.email}`;
  }

  return getOutOfScopeReply(userQuery);
}
import { Injectable, Logger } from '@nestjs/common';

export interface IncomingMessage {
  from: string;
  text: string;
  from_user_id?: string;
}

@Injectable()
export class BotEngineService {
  private readonly logger = new Logger(BotEngineService.name);

  // Language Detection Helper
  private detectLanguage(text: string): 'ta' | 'en' | 'hi' {
    const tamilRegex = /[\u0B80-\u0BFF]/;
    const hindiRegex = /[\u0900-\u097F]/;
    
    if (tamilRegex.test(text)) return 'ta';
    if (hindiRegex.test(text)) return 'hi';
    return 'en'; // Default to English
  }

  async processIncomingMessage(incoming: IncomingMessage): Promise<void> {
    const userMessage = incoming.text || '';
    const lang = this.detectLanguage(userMessage);
    const lowerMsg = userMessage.toLowerCase();

    this.logger.log(`📩 Processing message from ${incoming.from} [Lang: ${lang}]: "${userMessage}"`);

    // 1. Check for Cost / Pricing queries in any language
    const isCostQuery = 
      lowerMsg.includes('cost') || 
      lowerMsg.includes('price') || 
      lowerMsg.includes('charge') || 
      lowerMsg.includes('fee') || 
      lowerMsg.includes('விலை') || 
      lowerMsg.includes('கட்டணம்') || 
      lowerMsg.includes('कैटलॉग') || 
      lowerMsg.includes('मूल्य') || 
      lowerMsg.includes('शुल्क');

    let responseText = '';

    if (isCostQuery) {
      if (lang === 'ta') {
        responseText = `கட்டண விவரங்கள் மற்றும் சேவைக் கட்டணங்கள் உங்களது தேவைகளைப் பொறுத்து மாறுபடும். கூடுதல் விவரங்களுக்கு எங்களது நிறுவனத்தைத் தொடர்பு கொள்ளவும்!\n📞 தொடர்புக்கு: 7200537033 / 7200073704\n📧 மின்னஞ்சல்: info@gloaro.com`;
      } else if (lang === 'hi') {
        responseText = `मूल्य विवरण और सेवा शुल्क आपकी आवश्यकताओं के अनुसार भिन्न हो सकते हैं। अधिक जानकारी के लिए कृपया हमारी कंपनी से संपर्क करें!\n📞 संपर्क: 7200537033 / 7200073704\n📧 ईमेल: info@gloaro.com`;
      } else {
        responseText = `Pricing details and service charges vary based on your specific requirements. Please contact our company for further details!\n📞 Contact: 7200537033 / 7200073704\n📧 Email: info@gloaro.com`;
      }
    } else {
      // General Services & Brochure Knowledge Base responses based on language
      if (lang === 'ta') {
        responseText = `வணக்கம்! GLOARO PVT LTD-க்கு வரவேற்கிறோம். நாங்கள் தொழில்முனைவோர் மற்றும் ஸ்டார்ட்அப்களுக்கான தொழில்நுட்ப வணிக சுற்றுச்சூழல் அமைப்பாகும்.\n\nஎங்கள் சேவைகள்:\n1. டிஜிட்டல் மார்க்கெட்டிங் (Digital Marketing)\n2. தொழில்நுட்ப தீர்வுகள் (Technology Solutions)\n3. இ-காமர்ஸ் தீர்வுகள் (E-Commerce Solutions)\n\nமேலே உள்ள சேவைகளில் எதைப் பற்றி அறிய விரும்புகிறீர்கள்?`;
      } else if (lang === 'hi') {
        responseText = `नमस्ते! GLOARO PVT LTD में आपका स्वागत है। हम उद्यमियों और स्टार्टअप्स के लिए एक तकनीकी व्यावसायिक पारिस्थितिकी तंत्र हैं।\n\nहमारी सेवाएँ:\n1. डिजिटल मार्केटिंग\n2. प्रौद्योगिकी समाधान\n3. ई-कॉमर्स समाधान\n\nआप किसके बारे में जानना चाहते हैं?`;
      } else {
        responseText = `Hello! Welcome to GLOARO PVT LTD. We are a technology-driven business ecosystem connecting entrepreneurs and startups.\n\nOur Services:\n1. Digital Marketing\n2. Technology Solutions\n3. E-Commerce Solutions\n\nWhich service would you like to explore?`;
      }
    }

    // TODO: Meta WhatsApp Cloud API மூலம் இந்த responseText-ஐ சம்பந்தப்பட்ட நபருக்கு அனுப்பும் பங்கஷனை இங்கே அழைக்கவும்.
    this.logger.log(`✅ Response prepared for ${incoming.from}: ${responseText}`);
  }
}
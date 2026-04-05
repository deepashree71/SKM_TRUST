import { createContext, useContext, useState } from 'react'

const translations = {
  en: {
    // Nav
    whoWeAre: 'Who We Are',
    whatWeDo: 'What We Do',
    howToEmpower: 'How To Empower Us',
    gallery: 'Gallery',
    login: 'Login',
    generateId: 'Generate ID Card',
    donateNow: 'Donate Now',
    applyMembership: 'Apply Membership',
    aboutUs: 'About Us',
    programs: 'Programs & Campaigns',
    events: 'Events',
    contact: 'Contact Us',
    volunteer: 'Become a Volunteer',
    // Hero
    heroTag: 'Government Registered Trust · Established 2023',
    heroHeading1: 'Supporting Early Childhood Education',
    heroHeading2: 'For Rural Community Children',
    heroSub: 'Shree Kankai Mataji Education & Charitable Trust is committed to providing accessible foundational education and value-based learning opportunities to children belonging to rural and economically weaker communities through its Bhavya Pre-School initiative.',
    heroDonate: 'Donate Now — Support a Child',
    heroVolunteer: 'Become a Volunteer',
    // Stats
    statCommunity: 'Community-Based\nEducational Initiative',
    statChildren: 'Children\nBenefitted',
    statArea: 'Operational Area\nAlindra, Nadiad',
    statSince: 'Working\nSince',
    // General
    knowMore: 'Know More',
    latestNews: 'Latest News & Updates',
    viewAll: 'View All Updates',
  },
  hi: {
    whoWeAre: 'हम कौन हैं',
    whatWeDo: 'हम क्या करते हैं',
    howToEmpower: 'हमें सशक्त कैसे करें',
    gallery: 'गैलरी',
    login: 'लॉगिन',
    generateId: 'आईडी कार्ड बनाएं',
    donateNow: 'अभी दान करें',
    applyMembership: 'सदस्यता लागू करें',
    aboutUs: 'हमारे बारे में',
    programs: 'कार्यक्रम और अभियान',
    events: 'आयोजन',
    contact: 'संपर्क करें',
    volunteer: 'स्वयंसेवक बनें',
    heroTag: 'सरकार पंजीकृत ट्रस्ट · स्थापना 2023',
    heroHeading1: 'ग्रामीण समुदाय के बच्चों के लिए',
    heroHeading2: 'प्रारंभिक बाल शिक्षा का समर्थन',
    heroSub: 'श्री कंकाई माताजी शिक्षा एवं धर्मार्थ ट्रस्ट, भव्य प्री-स्कूल पहल के माध्यम से ग्रामीण और आर्थिक रूप से कमजोर वर्ग के बच्चों को सुलभ मूलभूत शिक्षा और मूल्य-आधारित अधिगम अवसर प्रदान करने के लिए प्रतिबद्ध है।',
    heroDonate: 'अभी दान करें — एक बच्चे की मदद करें',
    heroVolunteer: 'स्वयंसेवक बनें',
    statCommunity: 'सामुदायिक\nशैक्षिक पहल',
    statChildren: 'लाभान्वित\nबच्चे',
    statArea: 'कार्य क्षेत्र\nअलिंद्रा, नडियाद',
    statSince: 'कार्यरत\nवर्ष से',
    knowMore: 'अधिक जानें',
    latestNews: 'नवीनतम समाचार और अपडेट',
    viewAll: 'सभी अपडेट देखें',
  },
  gu: {
    whoWeAre: 'આપણે કોણ છીએ',
    whatWeDo: 'આપણે શું કરીએ',
    howToEmpower: 'અમને કેવી રીતે સશક્ત કરો',
    gallery: 'ગેલેરી',
    login: 'લૉગિન',
    generateId: 'ID કાર્ડ બનાવો',
    donateNow: 'હવે દાન કરો',
    applyMembership: 'સભ્યપદ માટે અરજી',
    aboutUs: 'અમારા વિશે',
    programs: 'કાર્યક્રમો અને ઝુંબેશ',
    events: 'ઘટનાઓ',
    contact: 'સંપર્ક કરો',
    volunteer: 'સ્વૈચ્છિક સેવક બનો',
    heroTag: 'સરકાર નોંધાયેલ ટ્રસ્ટ · સ્થાપના 2023',
    heroHeading1: 'ગ્રામ્ય સમુદાયના બાળકો માટે',
    heroHeading2: 'બાળ શિક્ષણને સહાય',
    heroSub: 'શ્રી કંકાઈ માતાજી શિક્ષણ અને ધર્માદા ટ્રસ્ટ, ભવ્ય પ્રી-સ્કૂલ પહેલ દ્વારા ગ્રામ્ય અને આર્થિક રીતે નબળા સમુદાયોના બાળકો માટે સુલભ મૂળભૂત શિક્ષણ પ્રદાન કરવા પ્રતિબદ્ધ છે.',
    heroDonate: 'હવે દાન કરો — એક બાળકને સહાય',
    heroVolunteer: 'સ્વૈચ્છિક સેવક બનો',
    statCommunity: 'સામુદાયિક\nશૈક્ષણિક પહેલ',
    statChildren: 'લાભ મેળવ્યો\nબાળકો',
    statArea: 'કાર્ય ક્ષેત્ર\nઅલિન્દ્રા, નડિયાદ',
    statSince: 'કાર્યરત\nવર્ષ',
    knowMore: 'વધુ જાણો',
    latestNews: 'તાજા સમાચાર',
    viewAll: 'બધા અપડેટ જુઓ',
  },
  mr: {
    whoWeAre: 'आम्ही कोण आहोत',
    whatWeDo: 'आम्ही काय करतो',
    howToEmpower: 'आम्हाला कसे सक्षम करावे',
    gallery: 'गॅलरी',
    login: 'लॉगिन',
    generateId: 'आयडी कार्ड तयार करा',
    donateNow: 'आता दान करा',
    applyMembership: 'सदस्यत्वासाठी अर्ज',
    aboutUs: 'आमच्याबद्दल',
    programs: 'कार्यक्रम व मोहीम',
    events: 'कार्यक्रम',
    contact: 'संपर्क',
    volunteer: 'स्वयंसेवक व्हा',
    heroTag: 'शासकीय नोंदणीकृत ट्रस्ट · स्थापना 2023',
    heroHeading1: 'ग्रामीण समुदायातील मुलांसाठी',
    heroHeading2: 'बालशिक्षणाला पाठिंबा',
    heroSub: 'श्री कंकाई माताजी शिक्षण व धर्मादाय ट्रस्ट, भव्य प्री-स्कूल उपक्रमाद्वारे ग्रामीण आणि आर्थिकदृष्ट्या दुर्बल घटकातील मुलांना मूलभूत शिक्षण देण्यास वचनबद्ध आहे.',
    heroDonate: 'आता दान करा — एका मुलाला मदत करा',
    heroVolunteer: 'स्वयंसेवक व्हा',
    statCommunity: 'समुदाय-आधारित\nशैक्षणिक उपक्रम',
    statChildren: 'लाभार्थी\nमुले',
    statArea: 'कार्यक्षेत्र\nअलिंद्रा, नडियाद',
    statSince: 'कार्यरत\nवर्षापासून',
    knowMore: 'अधिक जाणून घ्या',
    latestNews: 'ताज्या बातम्या',
    viewAll: 'सर्व अपडेट पहा',
  },
  ta: {
    whoWeAre: 'நாங்கள் யார்',
    whatWeDo: 'நாங்கள் என்ன செய்கிறோம்',
    howToEmpower: 'எங்களை எப்படி வலுப்படுத்துவது',
    gallery: 'படத்தொகுப்பு',
    login: 'உள்நுழை',
    generateId: 'அடையாள அட்டை',
    donateNow: 'இப்போது நன்கொடை',
    applyMembership: 'உறுப்பினர் விண்ணப்பம்',
    aboutUs: 'எங்களைப் பற்றி',
    programs: 'திட்டங்கள்',
    events: 'நிகழ்வுகள்',
    contact: 'தொடர்பு',
    volunteer: 'தன்னார்வலராகுங்கள்',
    heroTag: 'அரசு பதிவு பெற்ற அறக்கட்டளை · நிறுவப்பட்டது 2023',
    heroHeading1: 'கிராமப்புற சமூக குழந்தைகளுக்கான',
    heroHeading2: 'ஆரம்பகால கல்விக்கு ஆதரவு',
    heroSub: 'ஸ்ரீ கங்கை மாதாஜி கல்வி மற்றும் அறநல அறக்கட்டளை, பவ்யா பள்ளிக்கூட முன்முயற்சி மூலம் கிராமப்புற மற்றும் பொருளாதார ரீதியாக பலவீனமான சமூகத்தின் குழந்தைகளுக்கு அடிப்படை கல்வி வழங்க உறுதிபூண்டுள்ளது.',
    heroDonate: 'இப்போது நன்கொடை — ஒரு குழந்தைக்கு உதவுங்கள்',
    heroVolunteer: 'தன்னார்வலராகுங்கள்',
    statCommunity: 'சமூக அடிப்படையிலான\nகல்வி முன்முயற்சி',
    statChildren: 'பயனடைந்த\nகுழந்தைகள்',
    statArea: 'செயல்பாட்டு பகுதி\nஆலிந்திரா, நடியாட்',
    statSince: 'பணியாற்றும்\nஆண்டிலிருந்து',
    knowMore: 'மேலும் அறிக',
    latestNews: 'சமீபத்திய செய்திகள்',
    viewAll: 'அனைத்தையும் காண்க',
  },
}

const LangContext = createContext(null)

export const LANG_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'mr', label: 'मराठी' },
  { code: 'ta', label: 'தமிழ்' },
]

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en')
  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key

  return (
    <LangContext.Provider value={{ lang, setLang, t, LANG_OPTIONS }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be inside LangProvider')
  return ctx
}

import { Region } from './types';

const REGIONS_AZ: Region[] = [
  { id: 'naxcivan', name: 'Naxçıvan', coordinates: { x: 15, y: 75 }, description: 'Qədim su kanalları və mühəndislik möcüzələri.', placeholderImg: 'https://picsum.photos/seed/naxcivan/800/600' },
  { id: 'qax', name: 'Qax', coordinates: { x: 35, y: 15 }, description: 'Ənənəvi toxuculuq və sənətkarlıq.', placeholderImg: 'https://picsum.photos/seed/qax/800/600' },
  { id: 'zaqatala', name: 'Zaqatala', coordinates: { x: 30, y: 18 }, description: 'XV əsr Çingiz qalası və fındıq bağları.', placeholderImg: 'https://picsum.photos/seed/zaqatala/800/600' },
  { id: 'quba', name: 'Quba', coordinates: { x: 75, y: 20 }, description: 'Qırmızı qəsəbə və xalçaçılıq.', placeholderImg: 'https://picsum.photos/seed/quba/800/600' },
  { id: 'baki', name: 'Bakı', coordinates: { x: 90, y: 45 }, description: 'Qızıl və Gümüş bəzəklər, İçərişəhər.', placeholderImg: 'https://picsum.photos/seed/baki/800/600' },
  { id: 'gence', name: 'Gəncə', coordinates: { x: 30, y: 40 }, description: 'Ənənəvi mis qablar, Nizami irsi.', placeholderImg: 'https://picsum.photos/seed/gence/800/600' },
  { id: 'agstafa', name: 'Ağstafa', coordinates: { x: 20, y: 35 }, description: 'Qədim mağara tikintiləri və saz sənəti.', placeholderImg: 'https://picsum.photos/seed/agstafa/800/600' },
  { id: 'lerik', name: 'Lerik', coordinates: { x: 65, y: 85 }, description: 'Dağlıq ərazilərdəki uzunömürlülər diyarı.', placeholderImg: 'https://picsum.photos/seed/lerik/800/600' },
  { id: 'lenkeran', name: 'Lənkəran', coordinates: { x: 70, y: 80 }, description: 'Dairəvi Qala və çay plantasiyaları.', placeholderImg: 'https://picsum.photos/seed/lenkeran/800/600' },
  { id: 'ordubad', name: 'Ordubad', coordinates: { x: 18, y: 80 }, description: 'Gəmiqaya rəsmləri və ipəkçilik.', placeholderImg: 'https://picsum.photos/seed/ordubad/800/600' },
];

const REGIONS_EN: Region[] = [
  { id: 'naxcivan', name: 'Nakhchivan', coordinates: { x: 15, y: 75 }, description: 'Ancient water channels and engineering marvels.', placeholderImg: 'https://picsum.photos/seed/naxcivan/800/600' },
  { id: 'qax', name: 'Qakh', coordinates: { x: 35, y: 15 }, description: 'Traditional weaving and craftsmanship.', placeholderImg: 'https://picsum.photos/seed/qax/800/600' },
  { id: 'zaqatala', name: 'Zaqatala', coordinates: { x: 30, y: 18 }, description: '15th-century Chingiz fortress and hazelnut orchards.', placeholderImg: 'https://picsum.photos/seed/zaqatala/800/600' },
  { id: 'quba', name: 'Quba', coordinates: { x: 75, y: 20 }, description: 'Red Village and carpet weaving.', placeholderImg: 'https://picsum.photos/seed/quba/800/600' },
  { id: 'baki', name: 'Baku', coordinates: { x: 90, y: 45 }, description: 'Gold and silver jewelry, Old City (Icherisheher).', placeholderImg: 'https://picsum.photos/seed/baki/800/600' },
  { id: 'gence', name: 'Ganja', coordinates: { x: 30, y: 40 }, description: 'Traditional copperware, Nizami heritage.', placeholderImg: 'https://picsum.photos/seed/gence/800/600' },
  { id: 'agstafa', name: 'Agstafa', coordinates: { x: 20, y: 35 }, description: 'Ancient cave constructions and saz art.', placeholderImg: 'https://picsum.photos/seed/agstafa/800/600' },
  { id: 'lerik', name: 'Lerik', coordinates: { x: 65, y: 85 }, description: 'Land of centenarians in mountainous areas.', placeholderImg: 'https://picsum.photos/seed/lerik/800/600' },
  { id: 'lenkeran', name: 'Lankaran', coordinates: { x: 70, y: 80 }, description: 'Circular Fortress and tea plantations.', placeholderImg: 'https://picsum.photos/seed/lenkeran/800/600' },
  { id: 'ordubad', name: 'Ordubad', coordinates: { x: 18, y: 80 }, description: 'Gemigaya rock carvings and silk production.', placeholderImg: 'https://picsum.photos/seed/ordubad/800/600' },
];

export const REGIONS_DATA = {
  az: REGIONS_AZ,
  en: REGIONS_EN
};

export const ARTIST_CONTEXT_DATA = `
Ərazi,Rəssam,Məşhur Əsərlər (Nümunələr)
Bakı,Səttar Bəhlulzadə (1909–1974),"Qədim Şamaxı", "Buzovna. Sahil", "Mənzərə", "Qız bənövşəyə gedən yol", "Torpağın həsrəti", "Kəpəzin göz yaşları"
,Tahir Salahov (1928–2021),"Səhər eşalonu", "Qadınların portretləri" silsiləsi (Məsələn, "Aydan"), "Neftçilər", "Bəstəkar Qara Qarayevin portreti"
,Toğrul Nərimanbəyov (1930–2013),"Bolluq", "Ailə", "Qobustan kölgələri" (dekorasiya), "Sirli gecə"
,Güllü Mustafayeva (1919–1994),"Nizami Gəncəvinin portreti", "Xalça toxuyanlar", "Quba mənzərəsi", "Şuşa mənzərəsi"
Naxçıvan,Bəhruz Kəngərli (1892–1922),"Köhnə Ordubad" mənzərələri, "Naxçıvan mənzərələri", "Qaçqınlar" silsiləsi (Naxçıvanla bağlı)
,Hüseynqulu Əliyev (1949–),"Düşüncələr" (20 Yanvar faciəsinə həsr olunan əsərləri də var)
,Elmira Şahtaxtinskaya (1930–1996),"Portretlər silsiləsi", "Naxçıvan" mövzusunda qrafika və rəngkarlıq əsərləri
Quba,Səttar Bəhlulzadə (Əslən Əmirxanlı kəndindən),"Yuxarıda qeyd olunan əsərləri, həmçinin Quba bölgəsi mənzərələrini də çəkmişdir."
,Güllü Mustafayeva,"Quba mənzərəsi" (1945, 1957)
Gəncə,Qəzənfər Xalıqov (1898–1981),"Qız qalası" tablosu, "Şah İsmayıl Xətai", "Məcnun heyvanlar arasında" (xalçaçı rəssam kimi)
,Hacıyev Altay Əmir oğlu (1937–2021),"Füzulinin portreti", "Nəsimi" (illüstrasiyalar)
Lənkəran,Həyat Şirvanova,"Vətənim" sərgisində müxtəlif janrlı əsərlər və portretlər (yerli rəssam)
,Raminə Qurbanova,"Vətənim" sərgisində müxtəlif janrlı əsərlər və portretlər (yerli rəssam)
Ordubad,Bəhruz Kəngərli (Naxçıvan hissəsinə baxın),"Köhnə Ordubad" mənzərələri
Ağstafa,Kamil Xanlarov (1915–2012),"Mənzərələr", "Natürmortlar", "Səhər", "Dağlıq rayon mənzərəsi"
Lerik,Ədalət Qasımov (1940–),"Lerik rayonunun mənzərələri", "Dağlıq təbiət", "Yerli insanların portretləri"
,Elman Nəbiyev (1950–),"Lerik təbiəti silsiləsi"
Qax,Faiq Əhmədov (1954–),"Qax mənzərələri", "Natürmort", "Tarixi abidələr"
,Rəhman Qasımov,"Qax mənzərələri"
`;

export const TRANSLATIONS = {
  az: {
    title: "Azərbaycan İrsi",
    subtitle: "İntellektual Mədəniyyət Xəritəsi",
    selectRegionTitle: "Bölgə Seçin",
    selectRegionDesc: "Azərbaycanın zəngin mədəni irsini və rəssamlarını kəşf etmək üçün xəritədən bir region seçin.",
    loading: "Məlumatlar toplanır...",
    errorTitle: "Xəta Baş Verdi",
    errorDesc: "Məlumatları əldə etmək mümkün olmadı.",
    historyTitle: "Tarixi İcmal",
    dialectTitle: "Dialekt",
    musicTitle: "Musiqi & İfa",
    craftsTitle: "Xalq Sənətkarlığı",
    artistsTitle: "Rəssamlar və Əsərləri",
    noImage: "Görüntü yoxdur",
    loadingImage: "Görüntü yüklənir...",
    noData: "Bu region üzrə məlumat tapılmadı.",
    feedbackBtn: "Rəy Bildir",
    registerBtn: "Qeydiyyat",
    regionSelectTitle: "Region Seçimi",
    footer: "© 2025 Azərbaycanın Unudulmuş İrsi.",
    welcomeTitle: "Sənətkarlar və İrs",
    welcomeDesc: "Region seçərək həmin bölgəyə aid məşhur rəssamları, sənətkarlığı və tarixi öyrənin.",
    famousWorks: "Məşhur Əsərlər",
    mapView: "Xəritə Görünüşü",
    listView: "Siyahı Görünüşü",
    searchPlaceholder: "Region axtar...",
    // API Key Translations
    apiKeyButton: "API Açar",
    apiKeyModalTitle: "API Açar Tələb Olunur",
    apiKeyModalDesc: "Bu tətbiq məzmunu yaratmaq üçün Google Gemini API istifadə edir. Məlumatlar yalnız sessiya müddətində saxlanılır.",
    apiKeyPlaceholder: "Google Gemini API Açarınızı bura yapışdırın...",
    getKeyLink: "Açar əldə et (Get Key)",
    submitBtn: "Daxil ol",
    securityNote: "Təhlükəsizlik: API açarınız serverdə saxlanılmır. Səhifəni yeniləsəniz, yenidən daxil etməli olacaqsınız.",
    sessionExpired: "Sessiya bitdi. Təhlükəsizlik üçün API açarı silindi.",
    // Modals
    feedbackModalTitle: "Rəy Bildirin",
    feedbackModalDesc: "Tətbiqi inkişaf etdirmək üçün fikirləriniz önəmlidir.",
    rateExperience: "Təcrübənizi qiymətləndirin",
    yourComment: "Şərhiniz",
    commentPlaceholder: "Təklif və iradlarınızı bura yaza bilərsiniz...",
    sendBtn: "Göndər",
    thankYou: "Təşəkkür edirik!",
    feedbackSuccess: "Rəyiniz uğurla qeydə alındı.",
    // Registration Modal
    registrationTitle: "Səyahət Qeydiyyatı",
    registrationDesc: "Azərbaycanın dilbər guşələrinə səyahət üçün qeydiyyatdan keçin.",
    nameLabel: "Adınız",
    emailLabel: "E-poçt",
    passwordLabel: "Şifrə",
    destinationLabel: "Gediləcək Yer (Xəritədən seçin)",
    selectFromMap: "Zəhmət olmasa xəritədən bir region seçin",
    registerSubmit: "Tamamla",
    registrationSuccess: "Qeydiyyat uğurla tamamlandı!",
  },
  en: {
    title: "Azerbaijan Heritage",
    subtitle: "Intellectual Cultural Map",
    selectRegionTitle: "Select a Region",
    selectRegionDesc: "Select a region from the map to discover Azerbaijan's rich cultural heritage and artists.",
    loading: "Gathering data...",
    errorTitle: "Error Occurred",
    errorDesc: "Could not retrieve data.",
    historyTitle: "Historical Overview",
    dialectTitle: "Dialect",
    musicTitle: "Music & Performance",
    craftsTitle: "Folk Crafts",
    artistsTitle: "Artists and Works",
    noImage: "No image",
    loadingImage: "Loading image...",
    noData: "No data found for this region.",
    feedbackBtn: "Feedback",
    registerBtn: "Register",
    regionSelectTitle: "Region Selection",
    footer: "© 2025 Forgotten Heritage of Azerbaijan.",
    welcomeTitle: "Artists and Heritage",
    welcomeDesc: "Learn about famous artists, craftsmanship, and history by selecting a region.",
    famousWorks: "Famous Works",
    mapView: "Map View",
    listView: "List View",
    searchPlaceholder: "Search region...",
    // API Key Translations
    apiKeyButton: "API Key",
    apiKeyModalTitle: "API Key Required",
    apiKeyModalDesc: "This application uses Google Gemini API to generate content. Data is stored only for the session duration.",
    apiKeyPlaceholder: "Paste your Google Gemini API Key here...",
    getKeyLink: "Get Key",
    submitBtn: "Enter",
    securityNote: "Security: Your API key is not stored on a server. If you refresh the page, you will need to enter it again.",
    sessionExpired: "Session expired. API key cleared for security.",
    // Modals
    feedbackModalTitle: "Give Feedback",
    feedbackModalDesc: "Your feedback is important for improving the application.",
    rateExperience: "Rate your experience",
    yourComment: "Your Comment",
    commentPlaceholder: "You can write your suggestions and comments here...",
    sendBtn: "Send",
    thankYou: "Thank you!",
    feedbackSuccess: "Your feedback has been successfully recorded.",
    // Registration Modal
    registrationTitle: "Travel Registration",
    registrationDesc: "Register for a trip to the beautiful corners of Azerbaijan.",
    nameLabel: "Name",
    emailLabel: "Email",
    passwordLabel: "Password",
    destinationLabel: "Destination (Select from Map)",
    selectFromMap: "Please select a region from the map",
    registerSubmit: "Complete",
    registrationSuccess: "Registration completed successfully!",
  }
};
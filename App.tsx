import React, { useState, useEffect, useRef } from 'react';
import { REGIONS_DATA, TRANSLATIONS } from './constants';
import { Region, RegionData, Language } from './types';
import InfoPanel from './components/InfoPanel';
import FeedbackModal from './components/FeedbackModal';
import RegistrationModal from './components/RegistrationModal';
import ApiKeyModal from './components/ApiKeyModal';
import { fetchRegionData } from './services/geminiService';

const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutes

const App: React.FC = () => {
  // STRICT MODE: Initialize empty to force entry on every reload.
  // We check process.env.API_KEY for development convenience, but normally this will be empty in client browser.
  const [apiKey, setApiKey] = useState<string>(() => {
    try {
      return process.env.API_KEY || '';
    } catch (e) {
      return '';
    }
  });
  
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [regionData, setRegionData] = useState<RegionData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('az');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Timer ref for inactivity
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentRegions = REGIONS_DATA[language];
  const t = TRANSLATIONS[language];

  const filteredRegions = currentRegions.filter(region => 
    region.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Inactivity Logic
  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    
    if (apiKey && !process.env.API_KEY) { 
      inactivityTimer.current = setTimeout(() => {
        handleLogout();
        alert(t.sessionExpired);
      }, INACTIVITY_LIMIT_MS);
    }
  };

  const handleLogout = () => {
    setApiKey('');
    setSelectedRegion(null);
    setRegionData(null);
  };

  useEffect(() => {
    if (apiKey) {
        const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, resetInactivityTimer));
        resetInactivityTimer();
        return () => {
          if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
          events.forEach(event => window.removeEventListener(event, resetInactivityTimer));
        };
    }
  }, [apiKey, language]);


  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    setIsApiKeyModalOpen(false);
  };

  const handleRegionSelect = async (region: Region) => {
    if (!apiKey) return;

    setSelectedRegion(region);
    setLoading(true);
    setError(null);
    setRegionData(null);
    setSearchQuery('');

    if (window.innerWidth < 1024) {
        document.getElementById('info-panel-wrapper')?.scrollIntoView({ behavior: 'smooth' });
    }

    try {
      const data = await fetchRegionData(region.name, language, apiKey);
      setRegionData(data);
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || '';
      if (
        errMsg.includes('400') || 
        errMsg.includes('403') || 
        errMsg.includes('API key') || 
        errMsg.includes('key not valid')
      ) {
        alert("The API Key provided is invalid or expired. Please enter a valid Google Gemini API Key.");
        handleLogout(); 
        return;
      }
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'az' ? 'en' : 'az');
    setSelectedRegion(null);
    setRegionData(null);
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  // STRICT BLOCKING MODE
  if (!apiKey) {
    return (
      <div className="min-h-screen bg-[#f9f5f0] dark:bg-gray-900 flex items-center justify-center relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Azerbaijan_adm_location_map.svg/1024px-Azerbaijan_adm_location_map.svg.png" 
              alt="Background" 
              className="w-3/4 max-w-2xl h-auto grayscale" 
            />
        </div>
        
        <div className="absolute top-4 right-4 z-50">
             <button 
                onClick={toggleLanguage} 
                className="text-xs font-bold bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 px-3 py-2 rounded transition border border-gray-300 dark:border-gray-600 shadow-sm"
             >
                {language.toUpperCase()}
             </button>
        </div>

        <ApiKeyModal 
          isOpen={true} 
          onSave={handleSaveApiKey} 
          translations={t} 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen text-gray-900 dark:text-gray-100 bg-[#f9f5f0] dark:bg-gray-900 transition-colors duration-300">
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onSave={handleSaveApiKey} 
        onClose={() => setIsApiKeyModalOpen(false)}
        translations={t} 
      />
      
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} translations={t} />
      <RegistrationModal 
        isOpen={isRegistrationOpen} 
        onClose={() => setIsRegistrationOpen(false)} 
        translations={t} 
        regions={currentRegions}
      />

      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 p-4 animate-fadeIn backdrop-blur-sm"
          onClick={() => setZoomedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2 bg-white/10 rounded-full transition-colors"
            onClick={() => setZoomedImage(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <img 
            src={zoomedImage} 
            className="max-w-full max-h-full rounded-lg shadow-2xl object-contain" 
            alt="Zoomed Content" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      <header className="bg-gradient-to-r from-brand-blue via-brand-red to-brand-green text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl md:text-2xl font-bold font-serif">{t.title}</h1>
          </div>

          <div className="flex-grow max-w-md w-full relative">
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 text-white placeholder-blue-200 border border-white/20 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
             <button
               onClick={() => setIsApiKeyModalOpen(true)}
               className="text-xs bg-white/20 hover:bg-white/30 px-3 py-2 rounded transition flex items-center gap-1.5 whitespace-nowrap"
             >
               <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
               {t.apiKeyButton}
             </button>
             <button onClick={toggleTheme} className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-2 rounded transition border border-transparent hover:border-white/30 w-10 h-9 flex items-center justify-center">
                {isDarkMode ? "Light" : "Dark"}
             </button>
             <button onClick={toggleLanguage} className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-2 rounded transition border border-transparent hover:border-white/30 w-10 text-center">
                {language.toUpperCase()}
             </button>
             <button onClick={() => setIsRegistrationOpen(true)} className="text-xs bg-brand-gold hover:bg-yellow-600 text-white dark:text-gray-900 font-bold px-3 py-2 rounded transition flex items-center gap-1.5 shadow-md whitespace-nowrap">
                {t.registerBtn}
             </button>
             <button onClick={() => setIsFeedbackOpen(true)} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-2 rounded transition flex items-center gap-1.5 font-medium whitespace-nowrap">
                {t.feedbackBtn}
             </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-brand-blue dark:text-blue-300 mb-3">{t.welcomeTitle}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t.welcomeDesc}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center mb-2 px-1">
              <h3 className="font-bold text-gray-700 dark:text-gray-300">{t.regionSelectTitle}</h3>
              <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                <button onClick={() => setViewMode('map')} className={`p-2 rounded-md transition ${viewMode === 'map' ? 'bg-brand-blue text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{t.mapView}</button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-brand-blue text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{t.listView}</button>
              </div>
            </div>

            <div className={`${viewMode === 'map' ? 'block' : 'hidden'} transition-opacity duration-300`}>
              <div className="relative w-full aspect-[4/3] bg-blue-50/30 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-blue-200 dark:border-gray-700 overflow-hidden shadow-inner transition-colors duration-300">
                <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 pointer-events-none z-0">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Azerbaijan_adm_location_map.svg/1024px-Azerbaijan_adm_location_map.svg.png" 
                    alt="Azerbaijan Map" 
                    className="w-full h-full object-contain opacity-70 dark:opacity-50 transition-opacity duration-300 grayscale"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.1)) grayscale(100%)' }}
                  />
                </div>
                <div className="absolute bottom-4 left-4 text-xs text-gray-400 dark:text-gray-500 italic z-0">* Xəritə sxematikdir / Map is schematic</div>

                {filteredRegions.map((region) => {
                  const isSelected = selectedRegion?.id === region.id;
                  return (
                    <button
                      key={region.id}
                      onClick={() => handleRegionSelect(region)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-10 ${isSelected ? 'z-20 scale-110' : ''}`}
                      style={{ left: `${region.coordinates.x}%`, top: `${region.coordinates.y}%` }}
                    >
                      <div className={`flex flex-col items-center justify-center ${isSelected ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300 ${isSelected ? 'bg-brand-red text-white ring-4 ring-red-200 dark:ring-red-900' : 'bg-white dark:bg-gray-700 text-brand-blue dark:text-blue-300 hover:bg-brand-blue hover:text-white dark:hover:bg-blue-600'}`}>
                          <svg className="w-5 h-5" fill={isSelected ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                        </div>
                        <span className={`mt-2 px-3 py-1 rounded-full text-xs md:text-sm font-bold shadow-sm whitespace-nowrap transition-colors ${isSelected ? 'bg-brand-blue text-white' : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 group-hover:bg-white group-hover:text-brand-blue'}`}>{region.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`${viewMode === 'list' ? 'grid' : 'hidden'} grid-cols-1 sm:grid-cols-2 gap-3 transition-opacity duration-300`}>
              {filteredRegions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleRegionSelect(region)}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 flex flex-col ${selectedRegion?.id === region.id ? 'bg-brand-blue text-white border-brand-blue shadow-md' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-brand-blue dark:hover:border-blue-400 hover:shadow-sm'}`}
                >
                  <span className="font-bold text-lg">{region.name}</span>
                  <span className={`text-xs mt-1 ${selectedRegion?.id === region.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>{region.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5" id="info-panel-wrapper">
            <InfoPanel 
                region={selectedRegion} 
                data={regionData} 
                loading={loading} 
                error={error} 
                onImageClick={setZoomedImage}
                translations={t}
                apiKey={apiKey}
            />
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 dark:bg-black text-gray-400 py-6 text-center text-sm mt-12 border-t border-gray-700 transition-colors">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
};

export default App;
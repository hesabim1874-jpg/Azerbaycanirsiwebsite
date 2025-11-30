import React, { useState, useEffect } from 'react';
import { Region, RegionData } from '../types';
import { generateImage } from '../services/geminiService';
import { TRANSLATIONS } from '../constants';

interface InfoPanelProps {
  region: Region | null;
  data: RegionData | null;
  loading: boolean;
  error: string | null;
  onImageClick: (url: string) => void;
  translations: typeof TRANSLATIONS.az;
  apiKey: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ region, data, loading, error, onImageClick, translations, apiKey }) => {
  const [historyImage, setHistoryImage] = useState<string | null>(null);
  const [craftsImage, setCraftsImage] = useState<string | null>(null);
  const [artistImages, setArtistImages] = useState<{ [key: number]: string | null }>({});
  const [failedArtists, setFailedArtists] = useState<Set<number>>(new Set());
  const [workImages, setWorkImages] = useState<{ [key: string]: string | null }>({});
  const [failedWorks, setFailedWorks] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    setHistoryImage(null);
    setCraftsImage(null);
    setArtistImages({});
    setFailedArtists(new Set());
    setWorkImages({});
    setFailedWorks(new Set());
    setLoadingImages(false);
  }, [region]);

  const isQuotaError = (e: any) => {
    const msg = (e.message || '').toLowerCase();
    const code = e.code || e.status || e.error?.code;
    return (
        code === 429 || 
        code === 'RESOURCE_EXHAUSTED' || 
        msg.includes('quota') || 
        msg.includes('exhausted') ||
        msg.includes('429')
    );
  };

  useEffect(() => {
    if (!region || !data || !apiKey) return;
    
    let isMounted = true;
    let stopLoading = false;
    setLoadingImages(true);

    const loadImages = async () => {
      if (isMounted && !stopLoading) {
        try {
          const prompt = `Historical landmarks, ancient architecture, scenic landscape of ${region.name} region, Azerbaijan. Photorealistic, cinematic lighting.`;
          const url = await generateImage(prompt, apiKey);
          if (isMounted) setHistoryImage(url);
        } catch (e: any) {
          console.error("History image failed", e);
          if (isMounted) setHistoryImage(region.placeholderImg);
          if (isQuotaError(e)) stopLoading = true;
        }
      }

      if (isMounted && !stopLoading) {
        try {
          const prompt = `Traditional Azerbaijani craftsmanship from ${region.name}: ${data.crafts}. Detailed, close up, high quality studio photo.`;
          const url = await generateImage(prompt, apiKey);
          if (isMounted) setCraftsImage(url);
        } catch (e: any) {
          console.error("Crafts image failed", e);
          if (isQuotaError(e)) stopLoading = true;
        }
      }

      if (isMounted) setLoadingImages(false);
      
      for (let idx = 0; idx < data.artists.length; idx++) {
        if (!isMounted || stopLoading) break;
        const artist = data.artists[idx];

        try {
          const prompt = `Portrait of Azerbaijani artist ${artist.name} (${artist.period}). Famous works: ${artist.famousWorks.join(', ')}. Artistic style, oil painting or classic photography, high quality.`;
          const url = await generateImage(prompt, apiKey);
          if (isMounted) setArtistImages(prev => ({ ...prev, [idx]: url }));
        } catch (e: any) {
          console.error(`Artist image failed for ${idx}`, e);
          if (isMounted) setFailedArtists(prev => new Set(prev).add(idx));
          if (isQuotaError(e)) {
            console.warn("Quota exhausted, stopping further image generation.");
            stopLoading = true;
            break;
          }
        }

        for (let wIdx = 0; wIdx < artist.famousWorks.length; wIdx++) {
            if (!isMounted || stopLoading) break;
            const work = artist.famousWorks[wIdx];
            const workKey = `${idx}-${wIdx}`;

            try {
                const prompt = `The artwork titled "${work}" by Azerbaijani artist ${artist.name}. High quality, detailed art reproduction, oil painting style.`;
                const url = await generateImage(prompt, apiKey);
                if (isMounted) setWorkImages(prev => ({ ...prev, [workKey]: url }));
            } catch (e: any) {
                console.error(`Work image failed for ${work}`, e);
                if (isMounted) setFailedWorks(prev => new Set(prev).add(workKey));
                if (isQuotaError(e)) {
                    console.warn("Quota exhausted, stopping further image generation.");
                    stopLoading = true;
                    break;
                }
            }
        }
      }
    };

    loadImages();

    return () => { isMounted = false; };
  }, [data, region, apiKey]);

  if (!region) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm min-h-[400px] transition-colors">
        <div className="w-20 h-20 bg-brand-cream dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{translations.selectRegionTitle}</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs">{translations.selectRegionDesc}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full relative overflow-hidden bg-gray-900 rounded-2xl shadow-xl min-h-[600px]">
        <img src={region.placeholderImg} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[10s] animate-pulse" alt={region.name} />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-8 text-center backdrop-blur-sm bg-black/30">
          <h2 className="text-4xl font-serif font-bold mb-4 tracking-wide shadow-black drop-shadow-lg">{region.name}</h2>
          <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
            <svg className="w-6 h-6 text-brand-gold animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span className="text-sm font-medium tracking-wide">{translations.loading}</span>
          </div>
          <p className="mt-4 text-sm text-gray-200 max-w-xs opacity-90">{region.description}</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800 text-center min-h-[400px]">
        <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">{translations.errorTitle}</h3>
        <p className="text-red-600 dark:text-red-300 mb-4">{error || translations.errorDesc}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-fadeIn h-full flex flex-col max-h-[calc(100vh-200px)] lg:max-h-[800px] transition-colors">
      <div className="bg-brand-blue dark:bg-blue-900 text-white p-6 relative overflow-hidden shrink-0 min-h-[160px] flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
             <img src={historyImage || region.placeholderImg} alt={`${region.name} region`} className="w-full h-full object-cover transition-opacity duration-700 opacity-40 hover:opacity-50" />
             <div className="absolute inset-0 bg-gradient-to-t from-brand-blue dark:from-blue-900 via-brand-blue/80 dark:via-blue-900/80 to-transparent"></div>
        </div>
        <h2 className="text-4xl font-serif font-bold relative z-10 shadow-sm drop-shadow-md">{region.name}</h2>
        <p className="text-blue-100 mt-2 relative z-10 text-sm font-medium drop-shadow-sm">{translations.title}</p>
      </div>
      
      <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar flex-grow text-gray-600 dark:text-gray-300">
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400 font-bold">#</span>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 flex-grow pb-1">{translations.historyTitle}</h3>
          </div>
          <div className="mb-4 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm h-48 w-full bg-gray-100 dark:bg-gray-700 relative group">
            {historyImage ? (
                <img src={historyImage} className="w-full h-full object-cover animate-fadeIn cursor-zoom-in" alt="History" onClick={() => onImageClick(historyImage)} />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                    {loadingImages ? translations.loadingImage : translations.noImage}
                </div>
            )}
          </div>
          <p className="leading-relaxed text-sm text-justify">{data.history}</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">{translations.dialectTitle}</h4>
            <p className="text-sm">{data.dialectFeatures}</p>
          </section>
          <section className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">{translations.musicTitle}</h4>
            <p className="text-sm">{data.music}</p>
          </section>
        </div>

        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 font-bold">#</span>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 flex-grow pb-1">{translations.craftsTitle}</h3>
          </div>
          {craftsImage && (
             <div className="mb-4 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm h-48 w-full bg-gray-100 dark:bg-gray-700 relative">
                 <img src={craftsImage} className="w-full h-full object-cover animate-fadeIn cursor-zoom-in" alt="Crafts" onClick={() => onImageClick(craftsImage)} />
             </div>
          )}
          <p className="text-sm">{data.crafts}</p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-brand-green dark:text-green-400 font-bold">#</span>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 flex-grow pb-1">{translations.artistsTitle}</h3>
          </div>
          
          <div className="space-y-8">
            {data.artists.map((artist, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg dark:hover:shadow-gray-700/50 transition-all duration-300 relative flex flex-col">
                    <div className="flex flex-col sm:flex-row border-b border-gray-100 dark:border-gray-700">
                        <div className="sm:w-32 h-48 sm:h-auto relative bg-gray-100 dark:bg-gray-700 shrink-0 border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-gray-700 group">
                            {artistImages[idx] ? (
                                <img src={artistImages[idx]!} alt={artist.name} className="w-full h-full object-cover animate-fadeIn cursor-zoom-in" onClick={() => onImageClick(artistImages[idx]!)} />
                            ) : failedArtists.has(idx) ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 p-2 text-center">
                                    <span className="text-[10px] leading-tight">{translations.noImage}</span>
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 p-2">...</div>
                            )}
                        </div>
                        <div className="p-4 flex-grow relative">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                 <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{artist.name}</h4>
                                 <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full whitespace-nowrap">{artist.period}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50/50 dark:bg-gray-700/30">
                        <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">{translations.famousWorks}:</h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {artist.famousWorks.map((work, wIdx) => {
                                const workKey = `${idx}-${wIdx}`;
                                const imgUrl = workImages[workKey];
                                const isFailed = failedWorks.has(workKey);
                                
                                return (
                                    <div key={wIdx} className="group relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-all">
                                        <div className="aspect-[4/3] w-full relative overflow-hidden bg-gray-100 dark:bg-gray-600">
                                            {imgUrl ? (
                                                <img src={imgUrl} alt={work} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 animate-fadeIn cursor-zoom-in" onClick={(e) => { e.stopPropagation(); onImageClick(imgUrl); }} />
                                            ) : isFailed ? (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700 text-gray-300 dark:text-gray-500 p-1 text-center">
                                                     <span className="text-[9px]">{translations.noImage}</span>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-600">...</div>
                                            )}
                                        </div>
                                        <div className="p-2 border-t border-gray-100 dark:border-gray-600">
                                            <p className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-200 leading-tight line-clamp-2" title={work}>{work}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            ))}
            {data.artists.length === 0 && <p className="text-gray-500 dark:text-gray-400 italic text-sm">{translations.noData}</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default InfoPanel;
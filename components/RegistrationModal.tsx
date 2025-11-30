import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';
import { Region } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations: typeof TRANSLATIONS.az;
  regions: Region[];
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, translations, regions }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<Region | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password && selectedDestination) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setEmail('');
        setPassword('');
        setSelectedDestination(null);
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 max-w-4xl w-full border-t-4 border-brand-green relative transition-colors my-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-20"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>

        {submitted ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{translations.thankYou}</h3>
            <p className="text-gray-600 dark:text-gray-300">{translations.registrationSuccess}</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{translations.registrationTitle}</h2>
              <form onSubmit={handleSubmit} className="space-y-4 flex-grow flex flex-col">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={translations.nameLabel} className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={translations.emailLabel} className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={translations.passwordLabel} className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                <button type="submit" disabled={!name || !email || !password || !selectedDestination} className="w-full bg-brand-green text-white font-bold py-3.5 rounded-lg disabled:opacity-50 mt-auto">{translations.registerSubmit}</button>
              </form>
            </div>

            <div className="w-full lg:w-2/3">
                 <div className="relative w-full aspect-[4/3] bg-blue-50/30 dark:bg-gray-800/50 rounded-xl border-2 border-brand-green/20">
                    <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none z-0">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Azerbaijan_adm_location_map.svg/1024px-Azerbaijan_adm_location_map.svg.png" className="w-full h-full object-contain opacity-70 dark:opacity-50 grayscale" />
                    </div>
                    {regions.map((region) => {
                        const isSelected = selectedDestination?.id === region.id;
                        return (
                            <button key={region.id} type="button" onClick={() => setSelectedDestination(region)} className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 ${isSelected ? 'z-20 scale-110' : ''}`} style={{ left: `${region.coordinates.x}%`, top: `${region.coordinates.y}%` }}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors ${isSelected ? 'bg-brand-red text-white' : 'bg-white text-brand-green hover:bg-brand-green hover:text-white'}`}>
                                    <span className="text-[10px]">{region.name.substring(0, 2)}</span>
                                </div>
                            </button>
                        );
                    })}
                 </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationModal;
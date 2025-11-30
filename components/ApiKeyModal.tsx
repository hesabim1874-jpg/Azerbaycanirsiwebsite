import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
  isOpen: boolean;
  onClose?: () => void;
  translations: typeof TRANSLATIONS.az;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave, isOpen, onClose, translations }) => {
  const [key, setKey] = useState('');

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && key) {
      onSave(key);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full border-t-4 border-brand-blue dark:border-blue-500 relative transition-colors">
        
        {/* Only show close button if onClose is provided (i.e., not in blocking mode) */}
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="text-center mb-6">
          <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full inline-block mb-4">
            <svg className="w-8 h-8 text-brand-blue dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{translations.apiKeyModalTitle}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">{translations.apiKeyModalDesc}</p>
        </div>
        <div className="space-y-4">
          <div>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-blue outline-none transition-colors"
              placeholder={translations.apiKeyPlaceholder}
              autoFocus
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-brand-blue dark:text-blue-400 hover:underline">
                {translations.getKeyLink}
              </a>
            </p>
          </div>
          <button
            onClick={() => key && onSave(key)}
            className="w-full bg-brand-blue hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg disabled:opacity-50"
            disabled={!key}
          >
            {translations.submitBtn}
          </button>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/50 rounded-lg p-3 mt-4">
            <p className="text-xs text-yellow-700 dark:text-yellow-400 text-center flex items-center justify-center gap-2">
               <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
               {translations.securityNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations: typeof TRANSLATIONS.az;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, translations }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setComment('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full border-t-4 border-brand-gold relative transition-colors">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        {submitted ? (
          <div className="text-center py-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{translations.thankYou}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{translations.feedbackSuccess}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white">{translations.feedbackModalTitle}</h2>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className={`text-3xl ${rating >= star ? 'text-brand-gold' : 'text-gray-300'}`}>★</button>
              ))}
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white" placeholder={translations.commentPlaceholder} required></textarea>
            <button type="submit" disabled={rating === 0} className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg disabled:opacity-50">{translations.sendBtn}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
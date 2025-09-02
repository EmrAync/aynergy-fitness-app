// src/components/ai/AiAssistant.jsx
import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useLanguage } from '../../contexts/LanguageContext';
import Spinner from '../common/Spinner';

const AiAssistant = ({ pageContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const { t } = useLanguage();

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer('');
    try {
      const functions = getFunctions();
      const askAiAssistant = httpsCallable(functions, 'askAiAssistant');
      const response = await askAiAssistant({ question, context: pageContext });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Error calling AI assistant:", error);
      setAnswer(t('aiError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl hover:scale-110 transition-transform"
        aria-label={t('aiAssistantAriaLabel')}
      >
        ✨
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-sm bg-white rounded-2xl shadow-2xl border flex flex-col z-50">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-bold text-lg">{t('aiAssistantTitle')}</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
      </div>
      <div className="p-4 flex-grow h-64 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">{answer || t('aiWelcomeMessage')}</p>
        )}
      </div>
      <form onSubmit={handleAsk} className="p-4 border-t flex space-x-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t('aiPlaceholder')}
          className="flex-grow mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button type="submit" className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300" disabled={isLoading}>
          {t('aiAskButton')}
        </button>
      </form>
    </div>
  );
};

export default AiAssistant;
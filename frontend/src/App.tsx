import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { UploadSection } from './components/UploadSection';
import { IdentificationView } from './components/IdentificationView';
import { QuestionnaireView } from './components/QuestionnaireView';
import { ResultView } from './components/ResultView';
import { ManualSelectModal } from './components/ManualSelectModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { EducationalSection } from './components/EducationalSection';
import { Footer } from './components/Footer';

import type {
  DeviceAnalysis,
  ConditionAnswers,
  RecommendationResponse,
  HistoryItem,
} from './types';
import {
  analyzeDevicePhoto,
  fetchRecommendation,
  getLocalHistory,
  saveLocalHistoryItem,
  clearLocalHistory,
} from './services/api';

export const App: React.FC = () => {
  // Step state: 'upload' | 'identification' | 'questionnaire' | 'result'
  const [step, setStep] = useState<'upload' | 'identification' | 'questionnaire' | 'result'>('upload');

  const [device, setDevice] = useState<DeviceAnalysis | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);

  // Modals
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    setHistoryItems(getLocalHistory());
  }, []);

  // Handle Photo Upload
  const handleFileSelected = async (file: File) => {
    setIsLoading(true);
    setStep('identification');
    const preview = URL.createObjectURL(file);
    setImagePreviewUrl(preview);

    try {
      const analysis = await analyzeDevicePhoto(file);
      setDevice(analysis);
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Manual Fallback Choice
  const handleManualDeviceSelected = (manualDevice: DeviceAnalysis) => {
    setDevice(manualDevice);
    setImagePreviewUrl(null);
    setStep('questionnaire');
  };

  // Handle Questionnaire Submission
  const handleAnswersSubmitted = async (answers: ConditionAnswers) => {
    if (!device) return;
    setIsLoading(true);

    try {
      const rec = await fetchRecommendation(device, answers);
      setRecommendation(rec);
      setStep('result');

      // Save to localStorage history
      const updatedHistory = saveLocalHistoryItem({
        device_type: device.device_type,
        brand: device.brand,
        visible_condition: device.visible_condition,
        recommendation: rec.recommendation,
        confidence: rec.confidence,
      });
      setHistoryItems(updatedHistory);
    } catch (err) {
      console.error('Recommendation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setDevice(null);
    setRecommendation(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    clearLocalHistory();
    setHistoryItems([]);
  };

  const scrollToTool = () => {
    const el = document.getElementById('upload-tool');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation */}
      <Navbar
        historyCount={historyItems.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onManualSelect={() => setIsManualModalOpen(true)}
        onReset={handleReset}
      />

      <main className="flex-1">
        {/* Always show Hero on Upload step */}
        {step === 'upload' && (
          <>
            <Hero onAnalyzeClick={scrollToTool} />
            <UploadSection
              onFileSelected={handleFileSelected}
              onManualSelect={() => setIsManualModalOpen(true)}
              isLoading={isLoading}
            />
            <EducationalSection />
          </>
        )}

        {/* Identification Step */}
        {step === 'identification' && (
          <IdentificationView
            device={device}
            imagePreviewUrl={imagePreviewUrl}
            isLoading={isLoading}
            onProceedToQuestions={() => setStep('questionnaire')}
            onEditDevice={() => setIsManualModalOpen(true)}
            onReset={handleReset}
          />
        )}

        {/* Condition Questionnaire Step */}
        {step === 'questionnaire' && device && (
          <QuestionnaireView
            device={device}
            onSubmitAnswers={handleAnswersSubmitted}
            onBack={() => setStep(imagePreviewUrl ? 'identification' : 'upload')}
            isLoading={isLoading}
          />
        )}

        {/* Final Recommendation Result Step */}
        {step === 'result' && recommendation && (
          <ResultView result={recommendation} onReset={handleReset} />
        )}
      </main>

      {/* Manual Selection Fallback Modal */}
      <ManualSelectModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSelectDevice={handleManualDeviceSelected}
      />

      {/* Local History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={historyItems}
        onClear={handleClearHistory}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default App;

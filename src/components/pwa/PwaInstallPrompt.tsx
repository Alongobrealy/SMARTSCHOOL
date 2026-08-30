import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Laptop, Check, X, Share, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PwaInstallPrompt: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showIosInstructions, setShowIosInstructions] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);

  useEffect(() => {
    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosInstructions(true);
      return;
    }

    if (!deferredPrompt) {
      // Fallback instructions if prompt not available directly
      alert("Pour installer EDU-CONGO sur votre appareil :\n1. Ouvrez le menu de votre navigateur (les 3 points en haut à droite)\n2. Cliquez sur 'Installer l'application' ou 'Ajouter à l'écran d'accueil'.");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled || dismissed) return null;

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleInstallClick}
        className="px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
        title="Installer l'application sur votre écran d'accueil (Offline-Ready)"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Installer l'App</span>
      </button>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white border border-indigo-500/30 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/30 rounded-xl border border-indigo-400/30 shrink-0">
            <Smartphone className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Installer l'Application EDU-CONGO (PWA)</span>
              <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                100% Hors-Ligne
              </span>
            </h4>
            <p className="text-xs text-indigo-200/80 mt-0.5">
              Accédez à vos élèves, saisissez les paiements et imprimez les reçus sans connexion Internet directement depuis votre écran d'accueil.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Installer Maintenant</span>
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-2 text-indigo-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Masquer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIosInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 text-slate-800 dark:text-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-600" />
                Installer sur iPhone / iPad (Safari)
              </h3>
              <button
                onClick={() => setShowIosInstructions(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Pour installer EDU-CONGO comme application native sur iOS :
            </p>

            <ol className="text-xs space-y-3 text-slate-700 dark:text-slate-300 list-decimal list-inside bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <li className="flex items-start gap-2">
                <span>1. Appuyez sur le bouton <strong>Partager</strong></span>
                <Share className="w-4 h-4 text-indigo-600 inline" />
                <span>dans la barre du bas de Safari.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>2. Faites défiler vers le bas et sélectionnez <strong>"Sur l'écran d'accueil"</strong></span>
                <PlusSquare className="w-4 h-4 text-indigo-600 inline" />
              </li>
              <li>
                <span>3. Confirmez en appuyant sur <strong>"Ajouter"</strong> en haut à droite.</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIosInstructions(false)}
              className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition-colors"
            >
              J'ai compris
            </button>
          </div>
        </div>
      )}
    </>
  );
};

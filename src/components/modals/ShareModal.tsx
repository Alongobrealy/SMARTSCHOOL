import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  Share2, 
  ShieldCheck, 
  Sparkles,
  Smartphone,
  Laptop,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface ShareModalProps {
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ onClose }) => {
  const [copiedDev, setCopiedDev] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Dynamic origin detection with fallback
  const originUrl = typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null' && window.location.origin.startsWith('http')
    ? window.location.origin
    : 'https://ais-dev-27bch3y3x4rstnqlwsjbxe-677987865776.europe-west2.run.app';

  const devUrl = 'https://ais-dev-27bch3y3x4rstnqlwsjbxe-677987865776.europe-west2.run.app';
  const sharedUrl = 'https://ais-pre-27bch3y3x4rstnqlwsjbxe-677987865776.europe-west2.run.app';

  const handleCopy = (text: string, isShare: boolean = false) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        // Fallback for older browsers / iframe restrictions
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      });
    }

    if (isShare) {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } else {
      setCopiedDev(true);
      setTimeout(() => setCopiedDev(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white  text-[#050505]  w-full max-w-xl rounded-lg border border-[#E4E6EB]  shadow-2xl overflow-hidden flex flex-col my-6 animate-in fade-in zoom-in-95 duration-200 transition-colors">
        
        {/* Header */}
        <div className="bg-[#1877F2] text-white px-6 py-5 flex items-center justify-between border-b border-[#E4E6EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1877F2] border border-[#E4E6EB] flex items-center justify-center font-bold text-white shadow-md">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1877F2] uppercase tracking-widest">
                  EDU-CONGO • Accès Navigateur
                </span>
                <span className="text-[10px] bg-[#1877F2] text-white px-2 py-0.5 rounded-lg font-bold">
                  En Ligne
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Liens Directs de Test & Démonstration
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#65676B] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5 text-xs max-h-[75vh] overflow-y-auto">
          
          {/* Main Direct Action Card */}
          <div className="bg-[#1877F2]   border-2 border-[#E4E6EB]  rounded-lg p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-[#1877F2]  flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1877F2] " />
                Lien Principal de Test (Session Active)
              </span>
              <span className="text-[10px] bg-[#1877F2] text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                Recommandé
              </span>
            </div>
            
            <p className="text-[#65676B]  leading-relaxed text-xs">
              Ce lien ouvre l'application directement dans un nouvel onglet avec l'ensemble des données scolaires (étudiants, présences, notes, paiements FCFA MoMo) actives.
            </p>

            <div className="flex items-center gap-2 bg-white  p-2.5 rounded-xl border border-[#E4E6EB] ">
              <input
                type="text"
                readOnly
                value={devUrl}
                className="flex-1 bg-transparent font-mono text-[#050505]  text-[11px] outline-none select-all px-1"
              />
              <button
                onClick={() => handleCopy(devUrl, false)}
                className="px-3 py-2 bg-[#F0F2F5]  hover:bg-[#F0F2F5] text-[#050505]  rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Copier le lien"
              >
                {copiedDev ? <Check className="w-3.5 h-3.5 text-[#1877F2]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDev ? 'Copié !' : 'Copier'}</span>
              </button>

              <a
                href={devUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#1877F2] hover:bg-[#1877F2] text-white rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-105"
              >
                <span>Ouvrir</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Secondary Link: Shared/Preview URL */}
          <div className="flex flex-col gap-2 bg-[#F0F2F5]  p-4 rounded-lg border border-[#E4E6EB] ">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#050505]  uppercase tracking-wider text-[11px]">
                Lien Public Partageable (Preview) :
              </label>
              <span className="text-[#65676B]  text-[10px]">Version partagée</span>
            </div>

            <div className="flex items-center gap-2 bg-white  p-2 rounded-xl border border-[#E4E6EB] ">
              <input
                type="text"
                readOnly
                value={sharedUrl}
                className="flex-1 bg-transparent font-mono text-[#050505]  text-[11px] outline-none select-all px-1"
              />
              <button
                onClick={() => handleCopy(sharedUrl, true)}
                className="px-3 py-1.5 bg-[#F0F2F5]  hover:bg-[#F0F2F5] text-[#050505]  rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Copier le lien"
              >
                {copiedShare ? <Check className="w-3.5 h-3.5 text-[#1877F2]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedShare ? 'Copié !' : 'Copier'}</span>
              </button>

              <a
                href={sharedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#F0F2F5]  hover:bg-[#F0F2F5] text-[#1877F2]  rounded-lg transition-colors cursor-pointer"
                title="Ouvrir le lien partagé"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Help Guide if blocked */}
          <div className="bg-amber-50  border border-amber-200  rounded-lg p-4 flex items-start gap-3 text-amber-900 ">
            <AlertCircle className="w-5 h-5 text-amber-600  shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-bold text-xs text-amber-950 ">
                Astuce si la fenêtre contextuelle est bloquée par votre navigateur :
              </span>
              <p className="text-[11px] text-amber-900  leading-relaxed">
                1. Cliquez sur <strong>« Copier »</strong> puis collez directement l'adresse dans un nouvel onglet de Chrome/Safari/Edge.<br />
                2. Ou utilisez l'icône <strong>« Ouvrir dans un nouvel onglet » (↗)</strong> située dans la barre supérieure de l'interface Google AI Studio.
              </p>
            </div>
          </div>

          {/* Compatibility */}
          <div className="border-t border-[#E4E6EB]  pt-3 grid grid-cols-2 gap-3 text-[#65676B]  text-[11px]">
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#1877F2]  shrink-0" />
              <span>Optimisé Ordinateur (Plein écran)</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#1877F2]  shrink-0" />
              <span>Compatible Mobile & Tablette</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#F0F2F5]  px-6 py-4 border-t border-[#E4E6EB]  flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-[#65676B] ">
            <ShieldCheck className="w-4 h-4 text-[#1877F2] " />
            <span>Serveur Cloud Run actif • Port 3000</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#F0F2F5]  hover:bg-[#F0F2F5] text-[#050505]  rounded-xl font-semibold cursor-pointer text-xs"
            >
              Fermer
            </button>
            <a
              href={devUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#1877F2] hover:bg-[#1877F2] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer text-xs shadow-sm hover:scale-105 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ouvrir dans le Navigateur
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

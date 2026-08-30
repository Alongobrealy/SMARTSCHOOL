import React from 'react';
import { X, Printer, CheckCircle2, QrCode, Building2, Lock } from 'lucide-react';
import { FeePayment, SchoolConfig, UserRole } from '../../types';

interface ReceiptModalProps {
  payment: FeePayment | null;
  schoolConfig?: SchoolConfig;
  currentRole?: UserRole;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ 
  payment, 
  schoolConfig,
  currentRole = 'direction',
  onClose 
}) => {
  if (!payment) return null;

  const canPrint = currentRole !== 'parent' && currentRole !== 'eleve';

  const schoolName = schoolConfig?.name || 'Établissement Scolaire';
  const schoolCity = schoolConfig?.city || 'Brazzaville';
  const schoolAgrement = schoolConfig?.agrementNumber || 'Arrêté N° 0482/MEPPSA';

  const handlePrint = () => {
    if (!canPrint) return;
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white  text-[#050505]  w-full max-w-lg rounded-lg shadow-2xl border border-[#E4E6EB]  overflow-hidden flex flex-col my-8 transition-colors duration-200">
        
        {/* Modal Header */}
        <div className="bg-white  text-white px-6 py-4 flex items-center justify-between border-b border-[#E4E6EB]">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#1877F2]" />
            <h3 className="font-bold text-base">Reçu Officiel de Caisse • EDU-CONGO</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white text-[#65676B] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Read-Only Notice for Parents & Students */}
        {!canPrint && (
          <div className="bg-amber-50  border-b border-amber-200  px-6 py-2.5 flex items-center gap-2 text-xs font-semibold text-amber-800 ">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Mode Consultation Sécurisée : Reçu consultable en lecture seule. L'original avec cachet de caisse est délivré à l'économat.</span>
          </div>
        )}

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-6 flex flex-col gap-6 text-sm bg-white ">
          {/* Header of Receipt */}
          <div className="border-b border-[#E4E6EB]  pb-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#1877F2]  uppercase tracking-tight">
                {schoolName} - {schoolCity}
              </h2>
              <p className="text-xs text-[#65676B]  font-medium">RÉPUBLIQUE DU CONGO • {schoolAgrement} • Système EDU-CONGO</p>
              <p className="text-xs text-[#65676B] ">Service de la Comptabilité & Trésorerie Centrale ({schoolCity})</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-[#E7F3FF]  text-[#1877F2]  text-xs font-bold px-2.5 py-1 rounded-md border border-[#E4E6EB] ">
                PAYÉ / VALIDÉ
              </span>
              <p className="text-xs text-[#65676B]  mt-1 font-mono">{payment.numeroRecu}</p>
            </div>
          </div>

          {/* Student & Payment Details */}
          <div className="grid grid-cols-2 gap-4 bg-[#F0F2F5]  p-4 rounded-xl border border-[#E4E6EB]  text-xs">
            <div>
              <span className="text-[#65676B]  font-medium">Bénéficiaire (Élève/Étudiant) :</span>
              <p className="font-bold text-[#050505]  text-sm mt-0.5">{payment.studentName}</p>
            </div>
            <div>
              <span className="text-[#65676B]  font-medium">Classe / Niveau :</span>
              <p className="font-bold text-[#050505]  text-sm mt-0.5">{payment.classe}</p>
            </div>
            <div>
              <span className="text-[#65676B]  font-medium">Motif de Paiement :</span>
              <p className="font-bold text-[#050505]  mt-0.5">{payment.motif}</p>
            </div>
            <div>
              <span className="text-[#65676B]  font-medium">Mode de Règlement :</span>
              <p className="font-bold text-[#050505]  mt-0.5">{payment.modePaiement}</p>
            </div>
            <div>
              <span className="text-[#65676B]  font-medium">Réf. Transaction :</span>
              <p className="font-mono text-[#050505]  mt-0.5">{payment.referenceTransaction || 'N/A'}</p>
            </div>
            <div>
              <span className="text-[#65676B]  font-medium">Date d'encaissement :</span>
              <p className="font-bold text-[#050505]  mt-0.5">{payment.datePaiement}</p>
            </div>
          </div>

          {/* Amount Box */}
          <div className="bg-[#E7F3FF]/70  border-2 border-[#E4E6EB]  rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1877F2] ">Montant Reçu</span>
              <p className="text-2xl font-black text-[#1877F2] ">{payment.montant.toLocaleString()} FCFA</p>
            </div>
            <div className="text-right">
              <CheckCircle2 className="w-8 h-8 text-[#1877F2]  inline" />
            </div>
          </div>

          {/* Footer & Stamps */}
          <div className="grid grid-cols-2 gap-4 items-end pt-2 border-t border-dashed border-[#E4E6EB]  text-xs">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#65676B]  font-mono text-[10px]">
                <QrCode className="w-12 h-12 text-[#050505] " />
                <div>
                  <p className="font-bold text-[#050505] ">Authenticité Certifiée</p>
                  <p className="text-[#65676B] ">Scanner pour valider</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <span className="text-[#65676B]  font-semibold block text-[11px] mb-6">Le Caissier Autorisé</span>
              <span className="font-bold text-[#1877F2]  text-xs border-b border-[#E4E6EB]  pb-0.5">
                {payment.caissier}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-[#F0F2F5]  px-6 py-4 border-t border-[#E4E6EB]  flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#050505]  bg-white  border border-[#E4E6EB]  rounded-xl hover:bg-[#F0F2F5] transition-colors cursor-pointer"
          >
            Fermer
          </button>
          {canPrint && (
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-[#1877F2] rounded-xl hover:bg-[#1877F2] flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Imprimer le Reçu
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

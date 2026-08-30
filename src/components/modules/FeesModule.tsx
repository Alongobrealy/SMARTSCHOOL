import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  DollarSign, 
  ArrowUpRight, 
  Send,
  Building,
  Smartphone,
  Wallet,
  TrendingUp
} from 'lucide-react';
import { Student, FeePayment } from '../../types';
import { ReceiptModal } from '../modals/ReceiptModal';
import { MonthlyPaymentAnalyticsCharts } from '../dashboard/MonthlyPaymentAnalyticsCharts';

interface FeesModuleProps {
  students: Student[];
  payments: FeePayment[];
  onAddPayment: (payment: FeePayment) => void;
}

export const FeesModule: React.FC<FeesModuleProps> = ({
  students,
  payments,
  onAddPayment
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'recouvrement' | 'transactions'>('analytics');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<FeePayment | null>(null);
  
  // Payment Form Modal State
  const [showAddPaymentModal, setShowAddPaymentModal] = useState<boolean>(false);
  const [formStudentId, setFormStudentId] = useState<string>(students[0]?.id || '');
  const [formMotif, setFormMotif] = useState<FeePayment['motif']>('Écolage / Frais de Scolarité');
  const [formMontant, setFormMontant] = useState<string>('50000');
  const [formMode, setFormMode] = useState<FeePayment['modePaiement']>('MTN Mobile Money');
  const [formRef, setFormRef] = useState<string>('MOMO-BZV-');

  // Financial Stats
  const totalFeesExpected = students.reduce((sum, s) => sum + s.fraisTotal, 0);
  const totalFeesCollected = students.reduce((sum, s) => sum + s.fraisPayes, 0);
  const totalOutstanding = totalFeesExpected - totalFeesCollected;
  const recoveryRate = totalFeesExpected > 0 ? Math.round((totalFeesCollected / totalFeesExpected) * 100) : 0;

  const filteredStudents = students.filter(s => 
    s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.classe.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === formStudentId);
    if (!st) return;

    const amount = parseFloat(formMontant) || 0;
    const newPayment: FeePayment = {
      id: `pay-${Date.now()}`,
      numeroRecu: `REC-2026-BZV-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: st.id,
      studentName: `${st.nom} ${st.prenom}`,
      classe: st.classe,
      motif: formMotif,
      montant: amount,
      datePaiement: new Date().toISOString().split('T')[0],
      modePaiement: formMode,
      referenceTransaction: formRef || 'CASH-BZV',
      statut: 'Validé',
      caissier: 'M. Christian POATY (Caisse Centrale Brazzaville)'
    };

    // Update student paid amount in memory
    st.fraisPayes = Math.min(st.fraisTotal, st.fraisPayes + amount);

    onAddPayment(newPayment);
    setShowAddPaymentModal(false);
    setSelectedPaymentForReceipt(newPayment);
  };

  const handleSendWhatsAppReminder = (student: Student) => {
    const reste = student.fraisTotal - student.fraisPayes;
    const cleanPhone = student.telephoneParent.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Bonjour M./Mme ${student.nomParent}, la comptabilité de l'établissement (Brazzaville) vous informe qu'un solde de ${reste.toLocaleString()} FCFA reste à régulariser pour les frais d'écolage de votre enfant ${student.nom} ${student.prenom} (${student.classe}). Merci de procéder au paiement à la caisse centrale ou par MTN MoMo / Airtel Money.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white  p-4 sm:p-6 rounded-lg border border-[#E4E6EB]  shadow-sm transition-colors duration-200 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#1877F2]  font-bold text-xs uppercase tracking-wider">
            <CreditCard className="w-4 h-4" /> Module Caisse & Frais Scolaires (Écolage FCFA)
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#050505]  mt-1">Gestion des Recouvrements & Émission des Reçus</h2>
          <p className="text-xs text-[#65676B]  mt-1">
            Encaissez les frais par MTN MoMo, Airtel Money, Banque ou Espèces, générez des reçus avec QR Code et envoyez des relances WhatsApp Congo (+242).
          </p>
        </div>

        <div className="flex items-center justify-center w-full md:w-auto">
          <button
            onClick={() => setShowAddPaymentModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#1877F2] hover:bg-[#1877F2] text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Encaisser un Paiement
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white  border border-[#E4E6EB]  p-5 rounded-lg shadow-sm flex flex-col justify-between transition-colors duration-200">
          <span className="text-xs text-[#65676B]  font-bold uppercase tracking-wider">Budget Total Attendu</span>
          <p className="text-2xl font-bold text-[#050505]  mt-2">{totalFeesExpected.toLocaleString()} FCFA</p>
          <span className="text-[11px] text-[#65676B]  mt-1">Année Académique 2026-2027</span>
        </div>

        <div className="bg-white  border border-[#E4E6EB]  p-5 rounded-lg shadow-sm flex flex-col justify-between transition-colors duration-200">
          <span className="text-xs text-[#1877F2]  font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Total Encaissé</span>
            <CheckCircle2 className="w-4 h-4" />
          </span>
          <p className="text-2xl font-bold text-[#1877F2]  mt-2">{totalFeesCollected.toLocaleString()} FCFA</p>
          <span className="text-[11px] text-[#1877F2]  font-semibold mt-1">Taux de Recouvrement : {recoveryRate}%</span>
        </div>

        <div className="bg-white  border border-[#E4E6EB]  p-5 rounded-lg shadow-sm flex flex-col justify-between transition-colors duration-200">
          <span className="text-xs text-amber-600  font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Reste à Recouvrer</span>
            <AlertTriangle className="w-4 h-4" />
          </span>
          <p className="text-2xl font-bold text-amber-600  mt-2">{totalOutstanding.toLocaleString()} FCFA</p>
          <span className="text-[11px] text-amber-600  font-medium mt-1">{students.filter(s => s.fraisPayes < s.fraisTotal).length} élèves avec solde restant</span>
        </div>

        <div className="bg-white  border border-[#E4E6EB]  p-5 rounded-lg shadow-sm flex flex-col justify-between transition-colors duration-200">
          <span className="text-xs text-[#1877F2]  font-bold uppercase tracking-wider">Reçus Émis ce mois</span>
          <p className="text-2xl font-bold text-[#1877F2]  mt-2">{payments.length} Reçus</p>
          <span className="text-[11px] text-[#65676B]  mt-1">100% numérotés et authentifiés</span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white  p-4 sm:p-5 rounded-lg border border-[#E4E6EB]  shadow-sm text-xs transition-colors duration-200">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-[#1877F2] text-white shadow-xs'
                : 'bg-[#F0F2F5]  text-[#65676B]  hover:text-[#050505] hover:bg-[#F0F2F5]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Graphiques & Évolution Mensuelle</span>
          </button>
          <button
            onClick={() => setActiveTab('recouvrement')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'recouvrement'
                ? 'bg-[#1877F2] text-white shadow-xs'
                : 'bg-[#F0F2F5]  text-[#65676B]  hover:text-[#050505] hover:bg-[#F0F2F5]'
            }`}
          >
            Situation par Élève & Relances WhatsApp (+242)
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-[#1877F2] text-white shadow-xs'
                : 'bg-[#F0F2F5]  text-[#65676B]  hover:text-[#050505] hover:bg-[#F0F2F5]'
            }`}
          >
            Journal des Reçus de Caisse
          </button>
        </div>

        {activeTab !== 'analytics' && (
          <div className="relative">
            <Search className="w-4 h-4 text-[#65676B] absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher élève, matricule, classe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-72 bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
        )}
      </div>

      {/* Tab 1: Financial Charts & Monthly Payment Evolution */}
      {activeTab === 'analytics' && (
        <MonthlyPaymentAnalyticsCharts
          payments={payments}
          students={students}
          title="Évolution Mensuelle des Règlements d'Écolage (FCFA)"
          subtitle="Suivi graphique des recouvrements sur 12 mois, analyse comparative par canaux MTN / Airtel / Banques et répartition par classe"
        />
      )}

      {/* Tab 2: Recovery status per student */}
      {activeTab === 'recouvrement' && (
        <div className="bg-white  border border-[#E4E6EB]  rounded-lg shadow-sm overflow-hidden transition-colors duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F0F2F5]  text-[#65676B]  font-bold uppercase tracking-wider border-b border-[#E4E6EB]  text-[11px]">
                  <th className="p-3.5 sm:px-6">Élève / Étudiant</th>
                  <th className="p-3.5">Classe</th>
                  <th className="p-3.5">Parent / Contact (+242)</th>
                  <th className="p-3.5 text-right">Total Écolage</th>
                  <th className="p-3.5 text-right">Total Payé</th>
                  <th className="p-3.5 text-right">Reste</th>
                  <th className="p-3.5 text-center">État</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100  text-[#050505] ">
                {filteredStudents.map((student) => {
                  const reste = student.fraisTotal - student.fraisPayes;
                  const isFullyPaid = reste <= 0;

                  return (
                    <tr key={student.id} className="hover:bg-[#F0F2F5]/70 transition-colors">
                      <td className="p-3.5 sm:px-6">
                        <div className="font-bold text-[#050505] ">{student.nom} {student.prenom}</div>
                        <div className="text-[10px] font-mono text-[#65676B] ">{student.matricule}</div>
                      </td>
                      <td className="p-3.5 text-[#65676B]  font-medium">{student.classe}</td>
                      <td className="p-3.5">
                        <div className="text-[#050505]  font-medium">{student.nomParent}</div>
                        <div className="text-[11px] text-[#65676B]  font-mono">{student.telephoneParent}</div>
                      </td>
                      <td className="p-3.5 text-right font-bold text-[#050505] ">{student.fraisTotal.toLocaleString()} FCFA</td>
                      <td className="p-3.5 text-right font-bold text-[#1877F2] ">{student.fraisPayes.toLocaleString()} FCFA</td>
                      <td className="p-3.5 text-right font-bold text-amber-600 ">{reste.toLocaleString()} FCFA</td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                          isFullyPaid
                            ? 'bg-[#E7F3FF]  text-[#1877F2]  border-[#E4E6EB] '
                            : 'bg-amber-50  text-amber-700  border-amber-200 '
                        }`}>
                          {isFullyPaid ? 'Soldé (100%)' : `Reste ${reste.toLocaleString()} FCFA`}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        {!isFullyPaid ? (
                          <button
                            onClick={() => handleSendWhatsAppReminder(student)}
                            className="px-3 py-1.5 bg-[#1877F2] hover:bg-[#1877F2] text-white rounded-xl font-bold text-[11px] flex items-center gap-1.5 mx-auto transition-colors cursor-pointer shadow-2xs"
                          >
                            <Send className="w-3 h-3" />
                            Relance WhatsApp
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#1877F2]  font-bold">En règle ✓</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Transactions & Receipts Journal */}
      {activeTab === 'transactions' && (
        <div className="bg-white  border border-[#E4E6EB]  rounded-lg shadow-sm overflow-hidden transition-colors duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F0F2F5]  text-[#65676B]  font-bold uppercase tracking-wider border-b border-[#E4E6EB]  text-[11px]">
                  <th className="p-3.5 sm:px-6">N° Reçu</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Élève</th>
                  <th className="p-3.5">Motif</th>
                  <th className="p-3.5">Mode de Paiement</th>
                  <th className="p-3.5 text-right">Montant</th>
                  <th className="p-3.5 text-center">Reçu Officiel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100  text-[#050505] ">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F0F2F5]/70 transition-colors">
                    <td className="p-3.5 sm:px-6 font-mono font-bold text-[#1877F2] ">{p.numeroRecu}</td>
                    <td className="p-3.5 text-[#65676B] ">{p.datePaiement}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-[#050505] ">{p.studentName}</div>
                      <div className="text-[10px] text-[#65676B] ">{p.classe}</div>
                    </td>
                    <td className="p-3.5 text-[#050505]  font-medium">{p.motif}</td>
                    <td className="p-3.5">
                      <span className="bg-[#F0F2F5]  px-2.5 py-1 rounded-lg text-[#050505]  font-medium text-[11px] border border-[#E4E6EB] ">
                        {p.modePaiement}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-bold text-[#1877F2]  text-sm">
                      {p.montant.toLocaleString()} FCFA
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setSelectedPaymentForReceipt(p)}
                        className="px-3 py-1.5 bg-[#E7F3FF]  hover:bg-[#E7F3FF][#1877F2] text-[#1877F2]  rounded-xl font-bold text-[11px] border border-[#E4E6EB]  inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Imprimer Reçu
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 bg-white backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white  text-[#050505]  w-full max-w-md rounded-lg border border-[#E4E6EB]  shadow-2xl p-6 flex flex-col gap-4">
            <h3 className="font-bold text-base text-[#050505]  border-b border-[#E4E6EB]  pb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#1877F2] " />
              Enregistrement d'un Encaissement (Congo)
            </h3>

            <form onSubmit={handleSavePayment} className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="text-[#050505]  font-semibold mb-1 block">Sélectionner l'Élève :</label>
                <select
                  value={formStudentId}
                  onChange={(e) => setFormStudentId(e.target.value)}
                  className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  required
                >
                  {students.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.nom} {st.prenom} ({st.classe}) - Reste: {(st.fraisTotal - st.fraisPayes).toLocaleString()} FCFA
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#050505]  font-semibold mb-1 block">Motif d'Encaissement :</label>
                <select
                  value={formMotif}
                  onChange={(e) => setFormMotif(e.target.value as any)}
                  className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Écolage / Frais de Scolarité">Écolage / Frais de Scolarité</option>
                  <option value="Frais Inscription">Frais d'Inscription / Réinscription</option>
                  <option value="Frais Examen (BEPC / BAC)">Frais Dossier Examen (BEPC / BAC)</option>
                  <option value="Transport">Transport Scolaire</option>
                  <option value="Cantine">Cantine Scolaire</option>
                  <option value="Uniforme">Uniforme & Écussons</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#050505]  font-semibold mb-1 block">Montant Payé (FCFA) :</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={formMontant}
                    onChange={(e) => setFormMontant(e.target.value)}
                    className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#1877F2]  rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#050505]  font-semibold mb-1 block">Mode de Règlement :</label>
                  <select
                    value={formMode}
                    onChange={(e) => setFormMode(e.target.value as any)}
                    className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="MTN Mobile Money">MTN Mobile Money (MoMo)</option>
                    <option value="Airtel Money">Airtel Money Congo</option>
                    <option value="Espèces">Espèces (Caisse Centrale)</option>
                    <option value="Virement Bancaire">Virement Bancaire (BGFI/BPC/LCB)</option>
                    <option value="Chèque">Chèque Bancaire</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#050505]  font-semibold mb-1 block">Référence de Transaction :</label>
                <input
                  type="text"
                  value={formRef}
                  onChange={(e) => setFormRef(e.target.value)}
                  placeholder="Ex: MOMO-BZV-8849201 ou VIR-BGFI-229"
                  className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E6EB] ">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(false)}
                  className="px-4 py-2 bg-[#F0F2F5]  hover:bg-[#F0F2F5] text-[#050505]  rounded-xl font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1877F2] hover:bg-[#1877F2] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  Valider & Générer Reçu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedPaymentForReceipt && (
        <ReceiptModal
          payment={selectedPaymentForReceipt}
          onClose={() => setSelectedPaymentForReceipt(null)}
        />
      )}

    </div>
  );
};

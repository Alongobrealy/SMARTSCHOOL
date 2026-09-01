import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  Send, 
  DollarSign, 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  ShieldAlert, 
  Users, 
  Sparkles, 
  ExternalLink,
  Receipt,
  X
} from 'lucide-react';
import { Student } from '../../types';
import confetti from 'canvas-confetti';

interface OverdueFeesAlertWidgetProps {
  students: Student[];
  schoolName?: string;
  onOpenPaymentModal?: (student: Student) => void;
  onSendBulkReminders?: (overdueCount: number, totalAmount: number) => void;
}

export const OverdueFeesAlertWidget: React.FC<OverdueFeesAlertWidgetProps> = ({
  students,
  schoolName = 'Établissement Scolaire',
  onOpenPaymentModal,
  onSendBulkReminders
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'moderate'>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isBulkSending, setIsBulkSending] = useState<boolean>(false);
  const [bulkSentSuccess, setBulkSentSuccess] = useState<boolean>(false);
  const [relanceSentMap, setRelanceSentMap] = useState<Record<string, boolean>>({});
  const [selectedStudentForAlert, setSelectedStudentForAlert] = useState<Student | null>(null);

  // Identify students in arrears
  const overdueStudents = useMemo(() => {
    return students
      .filter((s) => s.fraisTotal > s.fraisPayes)
      .map((s) => {
        const resteAPayer = s.fraisTotal - s.fraisPayes;
        const pourcentagePaye = Math.round((s.fraisPayes / s.fraisTotal) * 100);
        // Overdue severity: Critical if debt >= 50,000 FCFA or less than 50% paid
        const isCritical = resteAPayer >= 50000 || pourcentagePaye < 50;
        
        return {
          ...s,
          resteAPayer,
          pourcentagePaye,
          isCritical,
          severity: isCritical ? ('critical' as const) : ('moderate' as const)
        };
      })
      .sort((a, b) => b.resteAPayer - a.resteAPayer);
  }, [students]);

  // Calculations
  const totalOverdueAmount = useMemo(() => {
    return overdueStudents.reduce((sum, s) => sum + s.resteAPayer, 0);
  }, [overdueStudents]);

  const criticalCount = useMemo(() => {
    return overdueStudents.filter((s) => s.isCritical).length;
  }, [overdueStudents]);

  const moderateCount = useMemo(() => {
    return overdueStudents.filter((s) => !s.isCritical).length;
  }, [overdueStudents]);

  const totalStudentsCount = students.length;
  const overduePercentage = totalStudentsCount > 0 
    ? Math.round((overdueStudents.length / totalStudentsCount) * 100) 
    : 0;

  // Available classes
  const classes = useMemo(() => {
    return Array.from(new Set(students.map((s) => s.classe)));
  }, [students]);

  // Filtered students
  const filteredOverdue = useMemo(() => {
    return overdueStudents.filter((s) => {
      const matchSearch = 
        s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nomParent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.classe.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchSeverity = 
        filterSeverity === 'all' ? true : s.severity === filterSeverity;
      
      const matchClass = 
        selectedClass === 'all' ? true : s.classe === selectedClass;

      return matchSearch && matchSeverity && matchClass;
    });
  }, [overdueStudents, searchTerm, filterSeverity, selectedClass]);

  // Action: Single WhatsApp Reminder
  const generateWhatsAppUrl = (student: typeof overdueStudents[0]) => {
    const cleanPhone = student.telephoneParent.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `🏛️ *${schoolName} - Avis de Relance Frais Scolaires*\n\n` +
      `Bonjour *${student.nomParent}*,\n\n` +
      `Nous vous informons que la scolarité de votre enfant *${student.prenom} ${student.nom}* (${student.classe}, Matricule: ${student.matricule}) présente un solde restant de *${student.resteAPayer.toLocaleString()} FCFA* (Déjà réglé: ${student.fraisPayes.toLocaleString()} FCFA sur ${student.fraisTotal.toLocaleString()} FCFA).\n\n` +
      `💳 *Modes de règlement autorisés :*\n` +
      `• MTN Mobile Money Congo (+242 06 895 83 77)\n` +
      `• Airtel Money Congo (+242 05 523 78 90)\n` +
      `• Caisse Centrale de l'établissement\n\n` +
      `Merci de régulariser la situation dans les meilleurs délais pour garantir la sérénité des études de l'élève.\n\n` +
      `_Service Comptabilité & Direction Générale_`
    );
    return `https://wa.me/${cleanPhone.startsWith('242') ? cleanPhone : '242' + cleanPhone}?text=${message}`;
  };

  // Action: Single Relance Trigger
  const handleTriggerRelance = (studentId: string) => {
    setRelanceSentMap((prev) => ({ ...prev, [studentId]: true }));
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  // Action: Bulk reminder campaign
  const handleTriggerBulkReminders = () => {
    if (isBulkSending || overdueStudents.length === 0) return;
    setIsBulkSending(true);
    setBulkSentSuccess(false);

    setTimeout(() => {
      setIsBulkSending(false);
      setBulkSentSuccess(true);
      
      const newMap: Record<string, boolean> = {};
      overdueStudents.forEach((s) => {
        newMap[s.id] = true;
      });
      setRelanceSentMap(newMap);

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 }
      });

      if (onSendBulkReminders) {
        onSendBulkReminders(overdueStudents.length, totalOverdueAmount);
      }
    }, 1200);
  };

  if (overdueStudents.length === 0) {
    return (
      <div className="bg-blue-50/80  border border-slate-200  rounded-lg p-5 shadow-xs flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50  text-blue-600  flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-blue-600  text-sm">
              Tous les frais scolaires sont à jour !
            </h3>
            <p className="text-xs text-blue-600 ">
              Aucun élève n'est actuellement en retard de paiement sur l'ensemble de l'établissement.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold bg-blue-50  text-blue-600  px-3 py-1 rounded-lg">
          100% Recouvert
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white  border-2 border-rose-500/40  rounded-lg shadow-md overflow-hidden transition-all duration-200">
      
      {/* Alert Header Banner */}
      <div className="bg-blue-600    px-5 sm:px-6 py-4 border-b border-rose-200/80  flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/30 shrink-0 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-md shadow-2xs">
                Alerte Caisse & Recouvrement
              </span>
              <span className="text-xs font-bold text-rose-700 ">
                {overdueStudents.length} Élève{overdueStudents.length > 1 ? 's' : ''} en Retard de Règlement ({overduePercentage}% de l'effectif)
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800  mt-0.5">
              Impayés en Souffrance : <span className="text-rose-600  font-mono">{totalOverdueAmount.toLocaleString()} FCFA</span>
            </h3>
          </div>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleTriggerBulkReminders}
            disabled={isBulkSending}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
            title="Lancer une campagne de relance groupée par SMS et WhatsApp"
          >
            <Send className={`w-3.5 h-3.5 ${isBulkSending ? 'animate-spin' : ''}`} />
            <span>
              {isBulkSending ? 'Envoi en cours...' : `Relance Groupée (${overdueStudents.length} Parents)`}
            </span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-slate-50  text-slate-800  hover:bg-slate-50 transition-colors cursor-pointer"
            title={isExpanded ? 'Réduire la vue détaillée' : 'Déplier la vue détaillée'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {bulkSentSuccess && (
        <div className="bg-blue-600 text-white text-xs font-semibold px-6 py-2.5 flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Campagne de relance WhatsApp & SMS envoyée avec succès aux {overdueStudents.length} parents d'élèves !</span>
          </div>
          <button 
            onClick={() => setBulkSentSuccess(false)}
            className="text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Severity Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100  border-b border-slate-200  text-xs">
        
        {/* Critical Arrears */}
        <div 
          onClick={() => setFilterSeverity(filterSeverity === 'critical' ? 'all' : 'critical')}
          className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
            filterSeverity === 'critical' ? 'bg-rose-50/70 ' : 'hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-lg bg-rose-500 animate-ping"></div>
            <div>
              <span className="font-bold text-slate-800  block">Retards Critiques (≥ 50k FCFA)</span>
              <span className="text-[11px] text-rose-600  font-semibold">Priorité 1 de relance</span>
            </div>
          </div>
          <span className="text-base font-extrabold text-rose-600  font-mono bg-rose-100  px-2.5 py-0.5 rounded-lg">
            {criticalCount}
          </span>
        </div>

        {/* Moderate Arrears */}
        <div 
          onClick={() => setFilterSeverity(filterSeverity === 'moderate' ? 'all' : 'moderate')}
          className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
            filterSeverity === 'moderate' ? 'bg-amber-50/70 ' : 'hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-lg bg-amber-500"></div>
            <div>
              <span className="font-bold text-slate-800  block">Soldes Partiels (&lt; 50k FCFA)</span>
              <span className="text-[11px] text-amber-600  font-semibold">Relance de routine</span>
            </div>
          </div>
          <span className="text-base font-extrabold text-amber-600  font-mono bg-amber-100  px-2.5 py-0.5 rounded-lg">
            {moderateCount}
          </span>
        </div>

        {/* Total students up to date */}
        <div className="p-4 flex items-center justify-between bg-slate-50/50 ">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-lg bg-blue-600"></div>
            <div>
              <span className="font-bold text-slate-800  block">Élèves Totalement à Jour</span>
              <span className="text-[11px] text-blue-600  font-semibold">Situation saine</span>
            </div>
          </div>
          <span className="text-base font-extrabold text-blue-600  font-mono bg-blue-50  px-2.5 py-0.5 rounded-lg">
            {totalStudentsCount - overdueStudents.length}
          </span>
        </div>

      </div>

      {/* Expandable Table Content */}
      {isExpanded && (
        <div className="p-5 sm:p-6 flex flex-col gap-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher élève, parent, matricule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50  border border-slate-200  text-slate-800  rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-slate-50  border border-slate-200  text-slate-800  rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
              >
                <option value="all">Toutes les Classes</option>
                {classes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="text-slate-500  text-xs font-semibold text-right">
              Affichage : {filteredOverdue.length} sur {overdueStudents.length} retardataires
            </div>
          </div>

          {/* Student Arrears Table */}
          <div className="border border-slate-200  rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Élève & Classe</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Contact Parent (+242)</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Frais Scolarité</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Réglé (FCFA)</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Reste Dû</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Gravité</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Actions de Relance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 ">
                  {filteredOverdue.map((st) => {
                    const isRelanceSent = relanceSentMap[st.id];
                    return (
                      <tr 
                        key={st.id} 
                        className={`transition-colors ${
                          st.isCritical 
                            ? 'hover:bg-rose-50/50/20 bg-rose-50/20 ' 
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              st.isCritical ? 'bg-rose-100  text-rose-700 ' : 'bg-amber-100  text-amber-700 '
                            }`}>
                              {st.prenom.charAt(0)}{st.nom.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800  block">
                                {st.nom} {st.prenom}
                              </span>
                              <span className="text-[11px] text-slate-500  font-mono">
                                {st.classe} • {st.matricule}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800  block">{st.nomParent}</span>
                          <span className="text-[11px] text-blue-600  font-mono flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {st.telephoneParent}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-medium text-slate-800 ">
                          {st.fraisTotal.toLocaleString()} FCFA
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-bold text-blue-600 ">
                          {st.fraisPayes.toLocaleString()} FCFA
                          <span className="block text-[10px] text-slate-500 font-normal">({st.pourcentagePaye}%)</span>
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-extrabold text-rose-600  text-sm">
                          -{st.resteAPayer.toLocaleString()} FCFA
                        </td>

                        <td className="py-3 px-4 text-center">
                          {st.isCritical ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-rose-100  text-rose-700  border border-rose-300 ">
                              <span className="w-1.5 h-1.5 rounded-lg bg-rose-500"></span>
                              Critique
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-100  text-amber-700  border border-amber-300 ">
                              <span className="w-1.5 h-1.5 rounded-lg bg-amber-500"></span>
                              Partiel
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* WhatsApp Direct Link */}
                            <a
                              href={generateWhatsAppUrl(st)}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => handleTriggerRelance(st.id)}
                              className="p-1.5 bg-blue-50 hover:bg-blue-50#2563eb text-blue-600  border border-slate-200  rounded-lg transition-colors cursor-pointer"
                              title="Relancer immédiatement le parent sur WhatsApp avec le montant pré-rempli"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>

                            {/* SMS Direct Notification */}
                            <button
                              onClick={() => handleTriggerRelance(st.id)}
                              className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                                isRelanceSent
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-slate-50 hover:bg-slate-50 text-slate-800  border-slate-200 '
                              }`}
                              title={isRelanceSent ? 'Alerte SMS déjà envoyée' : 'Envoyer un SMS de relance certifié'}
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>

                            {/* Encaisser Direct Button */}
                            {onOpenPaymentModal && (
                              <button
                                onClick={() => onOpenPaymentModal(st)}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-600 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                                title="Encaisser un versement pour cet élève"
                              >
                                <Receipt className="w-3 h-3" />
                                <span>Encaisser</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Summary Notice */}
          <div className="bg-slate-50  p-3.5 rounded-xl border border-slate-200  flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 ">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Les relances WhatsApp intègrent automatiquement le matricule, le nom de l'élève, la classe et les instructions de paiement MTN Mobile Money / Airtel Money Congo (+242).
              </span>
            </div>
            <span className="font-mono font-bold text-slate-800  shrink-0">
              Total à encaisser : {totalOverdueAmount.toLocaleString()} FCFA
            </span>
          </div>

        </div>
      )}

    </div>
  );
};

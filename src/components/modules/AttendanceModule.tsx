import React, { useState } from 'react';
import { 
  UserCheck, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Send, 
  Users, 
  Calendar, 
  Filter, 
  MessageSquare, 
  Sparkles,
  Phone,
  Check
} from 'lucide-react';
import { Student, AttendanceRecord } from '../../types';

interface AttendanceModuleProps {
  students: Student[];
  attendanceList: AttendanceRecord[];
  onUpdateAttendance: (newRecords: AttendanceRecord[]) => void;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  students,
  attendanceList,
  onUpdateAttendance
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('Terminale S1');
  const [selectedMatiere, setSelectedMatiere] = useState<string>('Mathématiques');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-25');
  const [notificationSentModal, setNotificationSentModal] = useState<boolean>(false);
  const [simulatedNotifications, setSimulatedNotifications] = useState<any[]>([]);

  const filteredStudents = students.filter(s => s.classe === selectedClass);

  // Get current attendance state for the students
  const getStatusForStudent = (studentId: string): 'present' | 'absent_non_justifie' | 'retard' | 'justifie' => {
    const rec = attendanceList.find(a => a.studentId === studentId && a.date === selectedDate && a.matiere === selectedMatiere);
    return rec ? rec.statut : 'present';
  };

  const handleSetStatus = (student: Student, newStatus: 'present' | 'absent_non_justifie' | 'retard' | 'justifie') => {
    const existingIndex = attendanceList.findIndex(a => a.studentId === student.id && a.date === selectedDate && a.matiere === selectedMatiere);
    let updatedList = [...attendanceList];

    if (existingIndex >= 0) {
      updatedList[existingIndex] = {
        ...updatedList[existingIndex],
        statut: newStatus
      };
    } else {
      updatedList.push({
        id: `att-${Date.now()}-${student.id}`,
        studentId: student.id,
        studentName: `${student.nom} ${student.prenom}`,
        classe: student.classe,
        date: selectedDate,
        matiere: selectedMatiere,
        statut: newStatus,
        heure: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        parentNotifie: false
      });
    }

    onUpdateAttendance(updatedList);
  };

  const handleMarkAllPresent = () => {
    let updatedList = [...attendanceList];
    filteredStudents.forEach(student => {
      const idx = updatedList.findIndex(a => a.studentId === student.id && a.date === selectedDate && a.matiere === selectedMatiere);
      if (idx >= 0) {
        updatedList[idx] = { ...updatedList[idx], statut: 'present' };
      } else {
        updatedList.push({
          id: `att-${Date.now()}-${student.id}`,
          studentId: student.id,
          studentName: `${student.nom} ${student.prenom}`,
          classe: student.classe,
          date: selectedDate,
          matiere: selectedMatiere,
          statut: 'present',
          heure: '08:00',
          parentNotifie: false
        });
      }
    });
    onUpdateAttendance(updatedList);
  };

  const handleNotifyParents = () => {
    const notices: any[] = [];
    filteredStudents.forEach(student => {
      const status = getStatusForStudent(student.id);
      if (status === 'absent_non_justifie' || status === 'retard') {
        const text = status === 'absent_non_justifie'
          ? `ALERTE PRÉSENCE : M./Mme ${student.nomParent}, votre enfant ${student.nom} ${student.prenom} a été marqué ABSENT(E) non justifié(e) ce ${selectedDate} au cours de ${selectedMatiere}. Contactez l'administration si besoin.`
          : `AVIS DE RETARD : M./Mme ${student.nomParent}, votre enfant ${student.nom} ${student.prenom} est arrivé(e) EN RETARD en classe ce ${selectedDate} au cours de ${selectedMatiere}.`;
        
        notices.push({
          parent: student.nomParent,
          telephone: student.telephoneParent,
          student: `${student.nom} ${student.prenom}`,
          message: text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    });

    setSimulatedNotifications(notices);
    setNotificationSentModal(true);
  };

  const total = filteredStudents.length;
  const presentCount = filteredStudents.filter(s => getStatusForStudent(s.id) === 'present').length;
  const absentCount = filteredStudents.filter(s => getStatusForStudent(s.id) === 'absent_non_justifie').length;
  const lateCount = filteredStudents.filter(s => getStatusForStudent(s.id) === 'retard').length;
  const rate = total > 0 ? Math.round((presentCount / total) * 100) : 100;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header & Description */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white  p-4 sm:p-6 rounded-lg border border-[#E4E6EB]  shadow-sm transition-colors duration-200 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#1877F2]  font-bold text-xs uppercase tracking-wider">
            <UserCheck className="w-4 h-4" /> Module de Présence Numérique
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#050505]  mt-1">Appel Numérique & Suivi d'Assiduité</h2>
          <p className="text-xs text-[#65676B]  mt-1">
            Fini les fiches papier. Effectuez l'appel en 30 secondes et envoyez les rapports automatiques aux parents.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handleMarkAllPresent}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-[#F0F2F5] hover:bg-[#F0F2F5] text-[#050505]  text-xs font-semibold rounded-xl border border-[#E4E6EB]  flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <Check className="w-3.5 h-3.5 text-[#1877F2] " />
            Tout Marquer Présent
          </button>

          <button
            onClick={handleNotifyParents}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#1877F2] hover:bg-[#1877F2] text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            Notifier Parents ({absentCount + lateCount})
          </button>
        </div>
      </div>

      {/* Filter Bar & Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white  p-4 sm:p-5 rounded-lg border border-[#E4E6EB]  shadow-sm text-xs transition-colors duration-200">
        <div>
          <label className="text-[#65676B]  font-semibold mb-1 block">Classe / Niveau :</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors cursor-pointer font-semibold"
          >
            <option value="Terminale S1">Terminale D (Lycée)</option>
            <option value="3ème Scientifique">3ème A (Collège)</option>
            <option value="CM2 A">CM2 A (Primaire)</option>
            <option value="Grande Section">Grande Section (Maternelle)</option>
            <option value="Électricité 1ère Année">Électricité 1ère Année (Formation Pro)</option>
          </select>
        </div>

        <div>
          <label className="text-[#65676B]  font-semibold mb-1 block">Matière / Cours :</label>
          <select
            value={selectedMatiere}
            onChange={(e) => setSelectedMatiere(e.target.value)}
            className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors cursor-pointer"
          >
            <option value="Mathématiques">Mathématiques</option>
            <option value="Physique-Chimie">Physique-Chimie</option>
            <option value="Programmation Web & Mobile">Programmation Web & Mobile</option>
            <option value="Français">Français</option>
          </select>
        </div>

        <div>
          <label className="text-[#65676B]  font-semibold mb-1 block">Date du cours :</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white  border border-[#E4E6EB]  p-4 rounded-lg shadow-sm flex items-center gap-3.5 transition-colors duration-200">
          <div className="w-10 h-10 rounded-xl bg-[#E7F3FF]  text-[#1877F2]  border border-[#E4E6EB]  flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#65676B]  font-bold uppercase tracking-wider">Effectif</span>
            <p className="text-xl font-bold text-[#050505] ">{total} Élèves</p>
          </div>
        </div>

        <div className="bg-white  border border-[#E4E6EB]  p-4 rounded-lg shadow-sm flex items-center gap-3.5 transition-colors duration-200">
          <div className="w-10 h-10 rounded-xl bg-[#E7F3FF]  text-[#1877F2]  border border-[#E4E6EB]  flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#65676B]  font-bold uppercase tracking-wider">Présents</span>
            <p className="text-xl font-bold text-[#1877F2] ">{presentCount} ({rate}%)</p>
          </div>
        </div>

        <div className="bg-white  border border-[#E4E6EB]  p-4 rounded-lg shadow-sm flex items-center gap-3.5 transition-colors duration-200">
          <div className="w-10 h-10 rounded-xl bg-rose-50  text-rose-600  border border-rose-100  flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#65676B]  font-bold uppercase tracking-wider">Absents</span>
            <p className="text-xl font-bold text-rose-600 ">{absentCount}</p>
          </div>
        </div>

        <div className="bg-white  border border-[#E4E6EB]  p-4 rounded-lg shadow-sm flex items-center gap-3.5 transition-colors duration-200">
          <div className="w-10 h-10 rounded-xl bg-amber-50  text-amber-600  border border-amber-100  flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#65676B]  font-bold uppercase tracking-wider">Retards</span>
            <p className="text-xl font-bold text-amber-600 ">{lateCount}</p>
          </div>
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="bg-white  border border-[#E4E6EB]  rounded-lg shadow-sm overflow-hidden transition-colors duration-200">
        <div className="px-6 py-4 border-b border-[#E4E6EB]  flex items-center justify-between">
          <h3 className="font-bold text-[#050505]  text-sm flex items-center gap-2">
            <span>Liste d'Appel : {selectedClass}</span>
            <span className="text-xs font-normal text-[#65676B] ">({selectedMatiere} - {selectedDate})</span>
          </h3>
          <span className="text-xs text-[#1877F2]  font-semibold">Cliquez sur un statut pour modifier</span>
        </div>

        <div className="divide-y divide-slate-100 ">
          {filteredStudents.map((student) => {
            const status = getStatusForStudent(student.id);

            return (
              <div
                key={student.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F0F2F5]/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F0F2F5]  border border-[#E4E6EB]  flex items-center justify-center text-[#050505]  font-bold text-xs">
                    {student.prenom[0]}{student.nom[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#050505]  text-sm">{student.nom} {student.prenom}</span>
                      <span className="text-[10px] font-mono text-[#65676B]  bg-[#F0F2F5]  px-1.5 py-0.5 rounded border border-[#E4E6EB] ">
                        {student.matricule}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#65676B]  mt-0.5">
                      <span>Parent: {student.nomParent}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#65676B]  font-medium">
                        <Phone className="w-3 h-3 text-[#1877F2] " />
                        {student.telephoneParent}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSetStatus(student, 'present')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      status === 'present'
                        ? 'bg-[#1877F2] text-white shadow-xs font-bold'
                        : 'bg-[#F0F2F5]  text-[#65676B]  hover:text-[#050505] hover:bg-[#F0F2F5]'
                    }`}
                  >
                    Présent
                  </button>

                  <button
                    onClick={() => handleSetStatus(student, 'retard')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      status === 'retard'
                        ? 'bg-amber-600 text-white shadow-xs font-bold'
                        : 'bg-[#F0F2F5]  text-[#65676B]  hover:text-[#050505] hover:bg-[#F0F2F5]'
                    }`}
                  >
                    Retard
                  </button>

                  <button
                    onClick={() => handleSetStatus(student, 'absent_non_justifie')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      status === 'absent_non_justifie'
                        ? 'bg-rose-600 text-white shadow-xs font-bold'
                        : 'bg-[#F0F2F5]  text-[#65676B]  hover:text-[#050505] hover:bg-[#F0F2F5]'
                    }`}
                  >
                    Absent
                  </button>

                  <button
                    onClick={() => handleSetStatus(student, 'justifie')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      status === 'justifie'
                        ? 'bg-[#1877F2] text-white shadow-xs font-bold'
                        : 'bg-[#F0F2F5]  text-[#65676B]  hover:text-[#050505] hover:bg-[#F0F2F5]'
                    }`}
                  >
                    Justifié
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Simulated SMS / WhatsApp Dispatch Notification Modal */}
      {notificationSentModal && (
        <div className="fixed inset-0 z-50 bg-white backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white  text-[#050505]  w-full max-w-lg rounded-lg border border-[#E4E6EB]  shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#E4E6EB]  pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E7F3FF]  text-[#1877F2]  flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#050505]  text-sm">Notifications Parents Expédiées</h4>
                  <p className="text-xs text-[#65676B] ">Passerelle SMS & WhatsApp Connectée</p>
                </div>
              </div>
              <span className="text-xs bg-[#E7F3FF]  text-[#1877F2]  px-2.5 py-0.5 rounded-lg font-bold border border-[#E4E6EB] ">
                {simulatedNotifications.length} Envoyés
              </span>
            </div>

            <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
              {simulatedNotifications.length > 0 ? (
                simulatedNotifications.map((notif, idx) => (
                  <div key={idx} className="bg-[#F0F2F5]  border border-[#E4E6EB]  p-3 rounded-xl text-xs flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1877F2]  flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> {notif.parent} ({notif.telephone})
                      </span>
                      <span className="text-[10px] text-[#65676B]  font-medium">{notif.time}</span>
                    </div>
                    <p className="text-[#050505]  text-[11px] bg-white  p-2.5 rounded-lg border border-[#E4E6EB]  font-mono">
                      "{notif.message}"
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#65676B]  text-center py-4">
                  Aucun retard ou absence détecté pour cette classe. Tous les élèves sont présents ! 🎉
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setNotificationSentModal(false)}
                className="px-4 py-2 bg-[#1877F2] hover:bg-[#1877F2] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
              >
                Fermer & Continuer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

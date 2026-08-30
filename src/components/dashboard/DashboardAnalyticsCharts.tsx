import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RechartsPie, 
  Pie, 
  Cell, 
  Legend, 
  ReferenceLine
} from 'recharts';
import { 
  GraduationCap, 
  CreditCard, 
  BarChart3, 
  PieChart as PieIcon, 
  CheckCircle2, 
  TrendingUp
} from 'lucide-react';
import { Student, GradeEntry, FeePayment } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface DashboardAnalyticsChartsProps {
  students: Student[];
  grades: GradeEntry[];
  payments: FeePayment[];
}

export const DashboardAnalyticsCharts: React.FC<DashboardAnalyticsChartsProps> = ({
  students,
  grades,
  payments,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [successChartType, setSuccessChartType] = useState<'bar' | 'donut'>('bar');
  const [paymentsChartType, setPaymentsChartType] = useState<'bar' | 'donut'>('bar');
  const [selectedTerm, setSelectedTerm] = useState<string>('all');

  // 1. COMPUTE SUCCESS RATE PER CLASS
  const classSuccessData = useMemo(() => {
    const classes: string[] = Array.from(new Set(students.map(s => s.classe)));

    return classes.map((classeName: string) => {
      const classStudents = students.filter(s => s.classe === classeName);
      let passedCount = 0;
      let totalAverageSum = 0;
      let evaluatedStudentsCount = 0;

      classStudents.forEach(student => {
        const studentGrades = grades.filter(g => 
          g.studentId === student.id && (selectedTerm === 'all' || g.semestre === selectedTerm)
        );

        if (studentGrades.length > 0) {
          evaluatedStudentsCount++;
          const totalPts = studentGrades.reduce((sum, g) => {
            const avg = (g.noteDevoir + g.noteExamen) / 2;
            return sum + (avg * g.coefficient);
          }, 0);
          const totalCoef = studentGrades.reduce((sum, g) => sum + g.coefficient, 0);
          const studentAvg = totalCoef > 0 ? totalPts / totalCoef : 0;

          totalAverageSum += studentAvg;
          if (studentAvg >= 10) {
            passedCount++;
          }
        }
      });

      const effectiveEvaluated = evaluatedStudentsCount;
      const tauxReussite = effectiveEvaluated > 0 ? Math.round((passedCount / effectiveEvaluated) * 100) : 0;
      const moyenneClasse = effectiveEvaluated > 0 ? Number((totalAverageSum / effectiveEvaluated).toFixed(1)) : 0;

      return {
        classe: classeName,
        shortName: classeName.length > 14 ? classeName.substring(0, 12) + '...' : classeName,
        tauxReussite,
        moyenneClasse,
        totalEleves: classStudents.length,
        admis: passedCount,
        rattrapage: Math.max(0, classStudents.length - passedCount),
      };
    });
  }, [students, grades, selectedTerm]);

  // Overall mention distribution for circular chart
  const mentionDistribution = useMemo(() => {
    let tresBien = 0; // >= 16
    let bien = 0; // 14 - 15.9
    let assezBien = 0; // 12 - 13.9
    let passable = 0; // 10 - 11.9
    let aRenforcer = 0; // < 10

    students.forEach(student => {
      const studentGrades = grades.filter(g => g.studentId === student.id);
      if (studentGrades.length > 0) {
        const totalPts = studentGrades.reduce((sum, g) => sum + ((g.noteDevoir + g.noteExamen) / 2 * g.coefficient), 0);
        const totalCoef = studentGrades.reduce((sum, g) => sum + g.coefficient, 0);
        const avg = totalCoef > 0 ? totalPts / totalCoef : 0;
        
        if (avg >= 16) tresBien++;
        else if (avg >= 14) bien++;
        else if (avg >= 12) assezBien++;
        else if (avg >= 10) passable++;
        else aRenforcer++;
      }
    });

    return [
      { name: 'Très Bien (≥16/20)', value: tresBien, color: '#6366F1' },
      { name: 'Bien (14-15.9)', value: bien, color: '#10B981' },
      { name: 'Assez Bien (12-13.9)', value: assezBien, color: '#06B6D4' },
      { name: 'Passable (10-11.9)', value: passable, color: '#F59E0B' },
      { name: 'À renforcer (<10)', value: aRenforcer, color: '#EF4444' },
    ].filter(item => item.value > 0);
  }, [students, grades]);

  // 2. COMPUTE MONTHLY PAYMENT EVOLUTION IN FCFA
  const monthlyPaymentData = useMemo(() => {
    const months = [
      { key: '10', name: 'Oct', full: 'Octobre' },
      { key: '11', name: 'Nov', full: 'Novembre' },
      { key: '12', name: 'Déc', full: 'Décembre' },
      { key: '01', name: 'Janv', full: 'Janvier' },
      { key: '02', name: 'Févr', full: 'Février' },
      { key: '03', name: 'Mars', full: 'Mars' },
      { key: '04', name: 'Avr', full: 'Avril' },
      { key: '05', name: 'Mai', full: 'Mai' },
      { key: '06', name: 'Juin', full: 'Juin' },
      { key: '07', name: 'Juil', full: 'Juillet' },
      { key: '08', name: 'Août', full: 'Août' },
      { key: '09', name: 'Sept', full: 'Septembre' },
    ];

    const totalExpectedFromStudents = students.reduce((sum, s) => sum + s.fraisTotal, 0);
    const monthlyTarget = students.length > 0 ? Math.round(totalExpectedFromStudents / 9) : 0;

    return months.map(m => {
      const monthPayments = payments.filter(p => {
        if (!p.datePaiement) return false;
        return p.datePaiement.split('-')[1] === m.key;
      });

      const encaisse = monthPayments.reduce((sum, p) => sum + p.montant, 0);

      return {
        mois: m.name,
        nomComplet: m.full,
        encaisse,
        encaisseK: Math.round(encaisse / 1000),
        objectif: monthlyTarget,
        tauxRecouvrement: monthlyTarget > 0 ? Math.min(100, Math.round((encaisse / monthlyTarget) * 100)) : 0,
      };
    });
  }, [payments, students]);

  // Payment methods breakdown
  const paymentMethodsData = useMemo(() => {
    let mtnMoMo = 0;
    let airtelMoney = 0;
    let virement = 0;
    let especes = 0;

    payments.forEach(p => {
      if (p.modePaiement === 'MTN Mobile Money') mtnMoMo += p.montant;
      else if (p.modePaiement === 'Airtel Money') airtelMoney += p.montant;
      else if (p.modePaiement === 'Virement Bancaire') virement += p.montant;
      else especes += p.montant;
    });

    return [
      { name: 'MTN Mobile Money (MoMo Congo)', value: mtnMoMo, color: '#FBBF24' },
      { name: 'Airtel Money Congo', value: airtelMoney, color: '#EF4444' },
      { name: 'Caisse Centrale (Espèces)', value: especes, color: '#10B981' },
      { name: 'Virement Bancaire (BGFI / BPC / LCB)', value: virement, color: '#6366F1' },
    ].filter(i => i.value > 0);
  }, [payments]);

  const globalSuccessRate = useMemo(() => {
    if (classSuccessData.length === 0) return 0;
    const sumRates = classSuccessData.reduce((acc, c) => acc + c.tauxReussite, 0);
    return Math.round(sumRates / classSuccessData.length);
  }, [classSuccessData]);

  const totalCollectedSum = useMemo(() => {
    return payments.reduce((acc, p) => acc + p.montant, 0);
  }, [payments]);

  const gridStroke = isDark ? '#334155' : '#E2E8F0';
  const axisTextColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. VISUALISATION : TAUX DE RÉUSSITE PAR CLASSE */}
      <div className="bg-white  rounded-lg shadow-sm border border-[#E4E6EB]  p-5 sm:p-6 flex flex-col justify-between gap-4 transition-colors duration-200">
        
        {/* Header with Title and Mode Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E6EB]  pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#E7F3FF]  text-[#1877F2]  border border-[#E4E6EB] ">
                <GraduationCap className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-[#050505]  text-base">Taux de Réussite par Classe (Brazzaville)</h3>
                <p className="text-xs text-[#65676B] ">Performance académique & validation des moyennes (≥ 10/20)</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Chart toggle */}
            <div className="flex items-center bg-[#F0F2F5]  p-1 rounded-xl border border-[#E4E6EB]  text-xs">
              <button
                type="button"
                onClick={() => setSuccessChartType('bar')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  successChartType === 'bar'
                    ? 'bg-white  text-[#1877F2]  shadow-xs'
                    : 'text-[#65676B]  hover:text-[#050505]'
                }`}
                title="Affichage en barres"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Barres</span>
              </button>
              <button
                type="button"
                onClick={() => setSuccessChartType('donut')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  successChartType === 'donut'
                    ? 'bg-white  text-[#1877F2]  shadow-xs'
                    : 'text-[#65676B]  hover:text-[#050505]'
                }`}
                title="Affichage circulaire"
              >
                <PieIcon className="w-3.5 h-3.5" />
                <span>Mentions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Highlight KPI Pills */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#F0F2F5]  rounded-xl p-3 border border-[#E4E6EB] ">
            <span className="text-[11px] font-semibold text-[#65676B]  block uppercase">Moyenne Globale</span>
            <span className="text-xl font-bold text-[#1877F2] ">{globalSuccessRate}%</span>
            <span className="text-[10px] text-[#1877F2]  font-medium block">Taux d'admissibilité</span>
          </div>
          <div className="bg-[#F0F2F5]  rounded-xl p-3 border border-[#E4E6EB] ">
            <span className="text-[11px] font-semibold text-[#65676B]  block uppercase">Classes Suivies</span>
            <span className="text-xl font-bold text-[#050505] ">{classSuccessData.length}</span>
            <span className="text-[10px] text-[#65676B]  font-medium block">Sections actives</span>
          </div>
          <div className="bg-[#F0F2F5]  rounded-xl p-3 border border-[#E4E6EB] ">
            <span className="text-[11px] font-semibold text-[#65676B]  block uppercase">Objectif MEPPSA</span>
            <span className="text-xl font-bold text-[#1877F2] ">85%</span>
            <span className="text-[10px] text-[#65676B]  font-medium block">Seuil d'excellence</span>
          </div>
        </div>

        {/* Chart View */}
        <div className="w-full h-64 mt-2">
          {successChartType === 'bar' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={classSuccessData}
                margin={{ top: 15, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis 
                  dataKey="shortName" 
                  tick={{ fill: axisTextColor, fontSize: 11, fontWeight: 500 }}
                  axisLine={{ stroke: isDark ? '#475569' : '#CBD5E1' }}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fill: axisTextColor, fontSize: 11 }}
                  unit="%" 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white text-white p-3 rounded-xl shadow-lg border border-[#E4E6EB] text-xs">
                          <p className="font-bold text-sm text-[#1877F2]">{data.classe}</p>
                          <div className="mt-1.5 flex flex-col gap-1">
                            <p className="text-[#65676B]">
                              Taux de réussite : <span className="font-bold text-[#1877F2]">{data.tauxReussite}%</span>
                            </p>
                            <p className="text-[#65676B]">
                              Moyenne de classe : <span className="font-semibold text-white">{data.moyenneClasse} / 20</span>
                            </p>
                            <p className="text-[#65676B] text-[11px]">
                              Effectif : {data.admis} admis / {data.totalEleves} élèves
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={80} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Seuil 80%', fill: '#10B981', fontSize: 10, position: 'right' }} />
                <Bar 
                  dataKey="tauxReussite" 
                  name="Taux de réussite (%)" 
                  fill="#4F46E5" 
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                >
                  {classSuccessData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.tauxReussite >= 80 ? (isDark ? '#6366F1' : '#4F46E5') : entry.tauxReussite >= 65 ? '#818CF8' : '#F59E0B'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={mentionDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {mentionDistribution.map((entry, index) => (
                    <Cell key={`cell-pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: number, name: string) => [`${val} élève(s)`, name]}
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0F172A' : '#1E293B', 
                    borderColor: isDark ? '#334155' : '#475569', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    fontSize: '12px' 
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-[#65676B]  font-medium">{value}</span>}
                />
              </RechartsPie>
            </ResponsiveContainer>
          )}
        </div>

        {/* Footer info note */}
        <div className="pt-3 border-t border-[#E4E6EB]  flex items-center justify-between text-[11px] text-[#65676B] ">
          <span className="flex items-center gap-1 text-[#1877F2]  font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1877F2] " />
            Bulletins calculés automatiquement (Brazzaville)
          </span>
          <span className="font-semibold text-[#1877F2] ">
            Année Académique 2026-2027
          </span>
        </div>

      </div>

      {/* 2. VISUALISATION : ÉVOLUTION DES PAIEMENTS MENSUELS */}
      <div className="bg-white  rounded-lg shadow-sm border border-[#E4E6EB]  p-5 sm:p-6 flex flex-col justify-between gap-4 transition-colors duration-200">
        
        {/* Header with Title and Mode Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E6EB]  pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#E7F3FF]  text-[#1877F2]  border border-[#E4E6EB] ">
                <CreditCard className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-[#050505]  text-base">Évolution des Paiements d'Écolage (FCFA)</h3>
                <p className="text-xs text-[#65676B] ">Flux d'encaissement mensuel & canaux de paiement Congo</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Chart toggle */}
            <div className="flex items-center bg-[#F0F2F5]  p-1 rounded-xl border border-[#E4E6EB]  text-xs">
              <button
                type="button"
                onClick={() => setPaymentsChartType('bar')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  paymentsChartType === 'bar'
                    ? 'bg-white  text-[#1877F2]  shadow-xs'
                    : 'text-[#65676B]  hover:text-[#050505]'
                }`}
                title="Affichage en barres"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Mensuel</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentsChartType('donut')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  paymentsChartType === 'donut'
                    ? 'bg-white  text-[#1877F2]  shadow-xs'
                    : 'text-[#65676B]  hover:text-[#050505]'
                }`}
                title="Répartition par mode de paiement"
              >
                <PieIcon className="w-3.5 h-3.5" />
                <span>Canaux</span>
              </button>
            </div>
          </div>
        </div>

        {/* Highlight KPI Pills */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#F0F2F5]  rounded-xl p-3 border border-[#E4E6EB] ">
            <span className="text-[11px] font-semibold text-[#65676B]  block uppercase">Ce Mois (Août)</span>
            <span className="text-xl font-bold text-[#1877F2] ">+{totalCollectedSum.toLocaleString()} FCFA</span>
            <span className="text-[10px] text-[#65676B]  font-medium block">Total encaissé</span>
          </div>
          <div className="bg-[#F0F2F5]  rounded-xl p-3 border border-[#E4E6EB] ">
            <span className="text-[11px] font-semibold text-[#65676B]  block uppercase">Total Transactions</span>
            <span className="text-xl font-bold text-[#050505] ">{payments.length} Reçus</span>
            <span className="text-[10px] text-[#1877F2]  font-medium block">100% Authentifiés</span>
          </div>
          <div className="bg-[#F0F2F5]  rounded-xl p-3 border border-[#E4E6EB] ">
            <span className="text-[11px] font-semibold text-[#65676B]  block uppercase">Canal Principal</span>
            <span className="text-xl font-bold text-[#1877F2] ">MTN MoMo</span>
            <span className="text-[10px] text-[#1877F2]  font-medium block">65% des règlements</span>
          </div>
        </div>

        {/* Chart View */}
        <div className="w-full h-64 mt-2">
          {paymentsChartType === 'bar' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyPaymentData}
                margin={{ top: 15, right: 10, left: -5, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis 
                  dataKey="mois" 
                  tick={{ fill: axisTextColor, fontSize: 11, fontWeight: 500 }}
                  axisLine={{ stroke: isDark ? '#475569' : '#CBD5E1' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: axisTextColor, fontSize: 10 }}
                  tickFormatter={(val) => `${Math.round(val / 1000)}k`}
                  unit="" 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white text-white p-3 rounded-xl shadow-lg border border-[#E4E6EB] text-xs">
                          <p className="font-bold text-sm text-[#1877F2]">{data.nomComplet}</p>
                          <div className="mt-1.5 flex flex-col gap-1">
                            <p className="text-[#65676B]">
                              Encaissé : <span className="font-bold text-white">{data.encaisse.toLocaleString()} FCFA</span>
                            </p>
                            <p className="text-[#65676B]">
                              Prévisionnel : <span className="font-semibold text-[#65676B]">{data.objectif.toLocaleString()} FCFA</span>
                            </p>
                            <p className="text-[#1877F2] text-[11px] font-semibold">
                              Taux de recouvrement : {data.tauxRecouvrement}%
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="encaisse" 
                  name="Encaissé (FCFA)" 
                  fill={isDark ? '#34D399' : '#10B981'} 
                  radius={[8, 8, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-pay-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: number, name: string) => [`${val.toLocaleString()} FCFA`, name]}
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0F172A' : '#1E293B', 
                    borderColor: isDark ? '#334155' : '#475569', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    fontSize: '12px' 
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-[#65676B]  font-medium">{value}</span>}
                />
              </RechartsPie>
            </ResponsiveContainer>
          )}
        </div>

        {/* Footer info note */}
        <div className="pt-3 border-t border-[#E4E6EB]  flex items-center justify-between text-[11px] text-[#65676B] ">
          <span className="flex items-center gap-1 text-[#65676B]  font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-[#1877F2] " />
            Traçabilité caisse & Mobile Money (MTN / Airtel) certifiée
          </span>
          <span className="font-semibold text-[#1877F2] ">
            Export Bilan Comptable dispo
          </span>
        </div>

      </div>

    </div>
  );
};

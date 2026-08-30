import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPie,
  Pie,
  Cell,
  ReferenceLine
} from 'recharts';
import {
  CreditCard,
  TrendingUp,
  DollarSign,
  PieChart as PieIcon,
  BarChart3,
  Activity,
  Smartphone,
  Building,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Layers,
  Sparkles,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Student, FeePayment, ExpenseItem } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface MonthlyPaymentAnalyticsChartsProps {
  payments: FeePayment[];
  students: Student[];
  expenses?: ExpenseItem[];
  title?: string;
  subtitle?: string;
  showExpenseComparison?: boolean;
}

export const MonthlyPaymentAnalyticsCharts: React.FC<MonthlyPaymentAnalyticsChartsProps> = ({
  payments,
  students,
  expenses = [],
  title = "Évolution & Analyse des Flux Financiers d'Écolage",
  subtitle = "Visualisation interactive des encaissements mensuels, prévisions, canaux de paiement et trésorerie (FCFA)",
  showExpenseComparison = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeView, setActiveView] = useState<'evolution' | 'cumulative' | 'channels' | 'classes' | 'cashflow'>('evolution');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [showTargetLine, setShowTargetLine] = useState<boolean>(true);

  // 1. CALCUL DES DONNÉES MENSUELLES (Octobre 2026 à Septembre 2027)
  const monthlyData = useMemo(() => {
    const monthsDef = [
      { key: '10', name: 'Oct', fullName: 'Octobre 2026' },
      { key: '11', name: 'Nov', fullName: 'Novembre 2026' },
      { key: '12', name: 'Déc', fullName: 'Décembre 2026' },
      { key: '01', name: 'Janv', fullName: 'Janvier 2027' },
      { key: '02', name: 'Févr', fullName: 'Février 2027' },
      { key: '03', name: 'Mars', fullName: 'Mars 2027' },
      { key: '04', name: 'Avr', fullName: 'Avril 2027' },
      { key: '05', name: 'Mai', fullName: 'Mai 2027' },
      { key: '06', name: 'Juin', fullName: 'Juin 2027' },
      { key: '07', name: 'Juil', fullName: 'Juillet 2027' },
      { key: '08', name: 'Août', fullName: 'Août 2027' },
      { key: '09', name: 'Sept', fullName: 'Septembre 2027' },
    ];

    // Compute expected monthly target from enrolled students
    const totalExpectedFromStudents = students.reduce((sum, s) => sum + s.fraisTotal, 0);
    const monthlyTargetBudget = students.length > 0 ? Math.round(totalExpectedFromStudents / 9) : 0;

    let cumuleEncaisses = 0;
    let cumuleObjectif = 0;
    let cumuleDepenses = 0;

    return monthsDef.map((m) => {
      // Find real payments in this month
      const monthPayments = payments.filter(p => {
        if (!p.datePaiement) return false;
        const monthPart = p.datePaiement.split('-')[1];
        return monthPart === m.key;
      });

      const monthExpenses = expenses.filter(e => {
        if (!e.date) return false;
        const monthPart = e.date.split('-')[1];
        return monthPart === m.key;
      });

      let encaisse = monthPayments.reduce((sum, p) => {
        if (filterChannel !== 'all' && p.modePaiement !== filterChannel) return sum;
        return sum + p.montant;
      }, 0);

      let depense = monthExpenses.reduce((sum, e) => sum + e.montant, 0);
      const target = monthlyTargetBudget;

      const resteARecouvrer = Math.max(0, target - encaisse);
      const tauxRecouvrement = target > 0 ? Math.min(100, Math.round((encaisse / target) * 100)) : 0;
      const soldeNet = encaisse - depense;

      cumuleEncaisses += encaisse;
      cumuleObjectif += target;
      cumuleDepenses += depense;

      const momo = monthPayments.filter(p => p.modePaiement === 'MTN Mobile Money').reduce((sum, p) => sum + p.montant, 0);
      const airtel = monthPayments.filter(p => p.modePaiement === 'Airtel Money').reduce((sum, p) => sum + p.montant, 0);
      const banque = monthPayments.filter(p => p.modePaiement === 'Virement Bancaire').reduce((sum, p) => sum + p.montant, 0);
      const especes = monthPayments.filter(p => p.modePaiement === 'Espèces').reduce((sum, p) => sum + p.montant, 0);

      return {
        mois: m.name,
        nomComplet: m.fullName,
        encaisse,
        objectif: target,
        resteARecouvrer,
        tauxRecouvrement,
        depense,
        soldeNet,
        cumuleEncaisses,
        cumuleObjectif,
        cumuleDepenses,
        momo,
        airtel,
        banque,
        especes,
      };
    });
  }, [payments, expenses, students, filterChannel]);

  // 2. RÉPARTITION PAR CANAUX DE PAIEMENT
  const channelData = useMemo(() => {
    let mtn = 0;
    let airtel = 0;
    let banque = 0;
    let especes = 0;

    payments.forEach((p) => {
      if (p.modePaiement === 'MTN Mobile Money') mtn += p.montant;
      else if (p.modePaiement === 'Airtel Money') airtel += p.montant;
      else if (p.modePaiement === 'Virement Bancaire') banque += p.montant;
      else especes += p.montant;
    });

    const total = mtn + airtel + banque + especes;

    return [
      { name: 'MTN Mobile Money Congo', shortName: 'MTN MoMo', value: mtn, color: '#F59E0B', percentage: total > 0 ? Math.round((mtn / total) * 100) : 0, icon: Smartphone },
      { name: 'Airtel Money Congo', shortName: 'Airtel Money', value: airtel, color: '#EF4444', percentage: total > 0 ? Math.round((airtel / total) * 100) : 0, icon: Smartphone },
      { name: 'Virement Bancaire (BGFI / BPC / LCB)', shortName: 'Banque', value: banque, color: '#6366F1', percentage: total > 0 ? Math.round((banque / total) * 100) : 0, icon: Building },
      { name: 'Caisse Centrale (Espèces)', shortName: 'Espèces', value: especes, color: '#10B981', percentage: total > 0 ? Math.round((especes / total) * 100) : 0, icon: Wallet },
    ];
  }, [payments]);

  // 3. STATUT DE RECOUVREMENT PAR CLASSE
  const classRecoveryData = useMemo(() => {
    const classes: string[] = Array.from(new Set(students.map((s) => s.classe)));

    return classes.map((classeName: string) => {
      const classStudents = students.filter((s) => s.classe === classeName);
      const totalAttendu = classStudents.reduce((sum, s) => sum + s.fraisTotal, 0);
      const totalPaye = classStudents.reduce((sum, s) => sum + s.fraisPayes, 0);
      const reste = Math.max(0, totalAttendu - totalPaye);
      const taux = totalAttendu > 0 ? Math.round((totalPaye / totalAttendu) * 100) : 0;

      return {
        classe: classeName,
        shortName: classeName.length > 14 ? classeName.substring(0, 12) + '...' : classeName,
        totalAttendu,
        totalPaye,
        reste,
        taux,
        eleves: classStudents.length,
        aJour: classStudents.filter((s) => s.fraisPayes >= s.fraisTotal).length,
      };
    });
  }, [students]);

  // Totaux globaux
  const totalAnnualTarget = useMemo(() => monthlyData.reduce((sum, m) => sum + m.objectif, 0), [monthlyData]);
  const totalAnnualCollected = useMemo(() => monthlyData.reduce((sum, m) => sum + m.encaisse, 0), [monthlyData]);
  const totalAnnualExpenses = useMemo(() => monthlyData.reduce((sum, m) => sum + m.depense, 0), [monthlyData]);
  const netGlobalLiquidity = totalAnnualCollected - totalAnnualExpenses;
  const globalAnnualRate = Math.round((totalAnnualCollected / totalAnnualTarget) * 100);

  const gridStroke = isDark ? '#334155' : '#E2E8F0';
  const axisTextColor = isDark ? '#94A3B8' : '#64748B';

  const formatFCFA = (val: number) => {
    return `${val.toLocaleString()} FCFA`;
  };

  const formatK = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${Math.round(val / 1000)}k`;
    return `${val}`;
  };

  return (
    <div className="bg-white  rounded-lg border border-[#E4E6EB]  shadow-sm p-5 sm:p-6 flex flex-col gap-6 transition-colors duration-200">
      
      {/* 1. Header & Navigation Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E4E6EB]  pb-5">
        <div>
          <div className="flex items-center gap-2 text-[#1877F2]  font-bold text-xs uppercase tracking-wider">
            <span className="p-1 rounded-md bg-[#E7F3FF]  border border-[#E4E6EB] ">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span>Tableau de Bord Financier & Statistiques Recharts</span>
          </div>
          <h3 className="text-xl font-bold text-[#050505]  mt-1">{title}</h3>
          <p className="text-xs text-[#65676B]  mt-0.5">{subtitle}</p>
        </div>

        {/* View Selection Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F0F2F5]  p-1.5 rounded-xl border border-[#E4E6EB]  text-xs">
          <button
            onClick={() => setActiveView('evolution')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeView === 'evolution'
                ? 'bg-[#1877F2] text-white shadow-xs'
                : 'text-[#65676B]  hover:text-[#050505]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Évolution Mensuelle</span>
          </button>

          <button
            onClick={() => setActiveView('cumulative')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeView === 'cumulative'
                ? 'bg-[#1877F2] text-white shadow-xs'
                : 'text-[#65676B]  hover:text-[#050505]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cumul & Objectifs</span>
          </button>

          <button
            onClick={() => setActiveView('channels')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeView === 'channels'
                ? 'bg-[#1877F2] text-white shadow-xs'
                : 'text-[#65676B]  hover:text-[#050505]'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Canaux MoMo & Banques</span>
          </button>

          <button
            onClick={() => setActiveView('classes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeView === 'classes'
                ? 'bg-[#1877F2] text-white shadow-xs'
                : 'text-[#65676B]  hover:text-[#050505]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Par Classe</span>
          </button>

          {showExpenseComparison && (
            <button
              onClick={() => setActiveView('cashflow')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeView === 'cashflow'
                  ? 'bg-[#1877F2] text-white shadow-xs'
                  : 'text-[#65676B]  hover:text-[#050505]'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Trésorerie & Marge</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#F0F2F5]  p-4 rounded-xl border border-[#E4E6EB] ">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#65676B]  uppercase">Recettes Encaissées</span>
            <ArrowDownLeft className="w-4 h-4 text-[#1877F2]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1877F2]  mt-1">
            {totalAnnualCollected.toLocaleString()} FCFA
          </p>
          <span className="text-[10px] text-[#1877F2]  font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" />
            {globalAnnualRate}% du budget prévisionnel
          </span>
        </div>

        <div className="bg-[#F0F2F5]  p-4 rounded-xl border border-[#E4E6EB] ">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#65676B]  uppercase">Budget Annuel Prévu</span>
            <Calendar className="w-4 h-4 text-[#1877F2]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#050505]  mt-1">
            {totalAnnualTarget.toLocaleString()} FCFA
          </p>
          <span className="text-[10px] text-[#65676B]  font-medium mt-0.5">
            12 mois de scolarité (Brazzaville)
          </span>
        </div>

        <div className="bg-[#F0F2F5]  p-4 rounded-xl border border-[#E4E6EB] ">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#65676B]  uppercase">Dépenses Cumulées</span>
            <ArrowUpRight className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-rose-600  mt-1">
            {totalAnnualExpenses.toLocaleString()} FCFA
          </p>
          <span className="text-[10px] text-rose-700  font-semibold mt-0.5">
            Salaires, fournitures, maintenance
          </span>
        </div>

        <div className="bg-[#F0F2F5]  p-4 rounded-xl border border-[#E4E6EB] ">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#65676B]  uppercase">Solde Net Trésorerie</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1877F2]  mt-1">
            +{netGlobalLiquidity.toLocaleString()} FCFA
          </p>
          <span className="text-[10px] text-[#1877F2]  font-bold mt-0.5">
            Marge de liquidité saine
          </span>
        </div>
      </div>

      {/* 3. Subheader Filter & Chart Display Options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {activeView === 'evolution' && (
            <>
              {/* Channel filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#65676B]  font-medium">Canal :</span>
                <select
                  value={filterChannel}
                  onChange={(e) => setFilterChannel(e.target.value)}
                  className="bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer"
                >
                  <option value="all">Tous les canaux de paiement</option>
                  <option value="MTN Mobile Money">MTN Mobile Money (+242)</option>
                  <option value="Airtel Money">Airtel Money Congo</option>
                  <option value="Virement Bancaire">Virement Bancaire</option>
                  <option value="Espèces">Espèces Caisse</option>
                </select>
              </div>

              {/* Chart type toggle */}
              <div className="flex items-center bg-[#F0F2F5]  p-0.5 rounded-lg border border-[#E4E6EB] ">
                <button
                  type="button"
                  onClick={() => setChartType('area')}
                  className={`px-2 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                    chartType === 'area'
                      ? 'bg-white  text-[#1877F2]  shadow-2xs'
                      : 'text-[#65676B] '
                  }`}
                >
                  Aires
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('bar')}
                  className={`px-2 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                    chartType === 'bar'
                      ? 'bg-white  text-[#1877F2]  shadow-2xs'
                      : 'text-[#65676B] '
                  }`}
                >
                  Barres
                </button>
              </div>

              {/* Target Line toggle */}
              <label className="flex items-center gap-1.5 text-[#65676B]  cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showTargetLine}
                  onChange={(e) => setShowTargetLine(e.target.checked)}
                  className="rounded border-[#E4E6EB] text-[#1877F2] focus:ring-emerald-500 cursor-pointer"
                />
                <span>Ligne Objectif Prévu</span>
              </label>
            </>
          )}
        </div>

        <div className="text-[11px] text-[#65676B]  flex items-center gap-1.5 self-end sm:self-auto">
          <span className="w-2 h-2 rounded-lg bg-[#1877F2] animate-pulse"></span>
          <span>Devise : <strong>Franc CFA (XAF)</strong> • Synchronisé Caisse Centrale</span>
        </div>
      </div>

      {/* 4. MAIN RECHARTS CANVAS */}
      <div className="w-full h-80 sm:h-96">
        
        {/* VIEW 1: ÉVOLUTION MENSUELLE DES ENCAISSEMENTS */}
        {activeView === 'evolution' && (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart
                data={monthlyData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorEncaisse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? '#10B981' : '#059669'} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={isDark ? '#10B981' : '#059669'} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorObjectif" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis 
                  dataKey="mois" 
                  tick={{ fill: axisTextColor, fontSize: 11, fontWeight: 500 }}
                  axisLine={{ stroke: isDark ? '#475569' : '#CBD5E1' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: axisTextColor, fontSize: 10 }}
                  tickFormatter={formatK}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white text-white p-3.5 rounded-xl shadow-xl border border-[#E4E6EB] text-xs flex flex-col gap-1.5 min-w-[220px]">
                          <div className="flex items-center justify-between border-b border-[#E4E6EB] pb-1.5">
                            <span className="font-bold text-sm text-[#1877F2]">{data.nomComplet}</span>
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-950 text-[#1877F2] border border-[#E4E6EB]">
                              {data.tauxRecouvrement}% Recouvré
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[#65676B]">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-lg bg-[#1877F2]"></span>
                              Encaissé :
                            </span>
                            <span className="font-bold text-white font-mono">{data.encaisse.toLocaleString()} FCFA</span>
                          </div>
                          <div className="flex justify-between items-center text-[#65676B]">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-lg bg-[#1877F2]"></span>
                              Objectif Prévu :
                            </span>
                            <span className="font-semibold text-[#65676B] font-mono">{data.objectif.toLocaleString()} FCFA</span>
                          </div>
                          <div className="flex justify-between items-center text-amber-400 pt-1 border-t border-[#E4E6EB]">
                            <span>Reste à percevoir :</span>
                            <span className="font-bold font-mono">{data.resteARecouvrer.toLocaleString()} FCFA</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-[#65676B]  font-medium">{value}</span>}
                />
                <Area 
                  type="monotone" 
                  dataKey="encaisse" 
                  name="Encaissé Réel (FCFA)" 
                  stroke={isDark ? '#34D399' : '#059669'} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorEncaisse)" 
                />
                {showTargetLine && (
                  <Area 
                    type="monotone" 
                    dataKey="objectif" 
                    name="Objectif Budgétaire (FCFA)" 
                    stroke="#818CF8" 
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorObjectif)" 
                  />
                )}
              </AreaChart>
            ) : (
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
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
                  tickFormatter={formatK}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: number) => [`${val.toLocaleString()} FCFA`, '']}
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#1E293B',
                    borderColor: isDark ? '#334155' : '#475569',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="rect"
                  formatter={(value) => <span className="text-xs text-[#65676B]  font-medium">{value}</span>}
                />
                <Bar 
                  dataKey="encaisse" 
                  name="Encaissé Réel (FCFA)" 
                  fill={isDark ? '#34D399' : '#10B981'} 
                  radius={[6, 6, 0, 0]} 
                  barSize={18}
                />
                <Bar 
                  dataKey="resteARecouvrer" 
                  name="Reste à Recouvrer" 
                  fill={isDark ? '#F59E0B' : '#FBBF24'} 
                  radius={[6, 6, 0, 0]} 
                  barSize={18}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}

        {/* VIEW 2: CUMULATIF & S-CURVE */}
        {activeView === 'cumulative' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorCumul" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
              <XAxis 
                dataKey="mois" 
                tick={{ fill: axisTextColor, fontSize: 11 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: axisTextColor, fontSize: 10 }}
                tickFormatter={formatK}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white text-white p-3.5 rounded-xl shadow-xl border border-[#E4E6EB] text-xs flex flex-col gap-1 min-w-[240px]">
                        <p className="font-bold text-sm text-[#1877F2]">{data.nomComplet}</p>
                        <p className="text-[#65676B]">
                          Cumul Encaissé : <span className="font-bold text-white font-mono">{data.cumuleEncaisses.toLocaleString()} FCFA</span>
                        </p>
                        <p className="text-[#65676B]">
                          Objectif Annuel Visé : <span className="font-semibold text-[#65676B] font-mono">{data.cumuleObjectif.toLocaleString()} FCFA</span>
                        </p>
                        <p className="text-[#1877F2] text-[11px] font-bold mt-1">
                          Progression Globale : {Math.round((data.cumuleEncaisses / totalAnnualTarget) * 100)}% de l'année
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area 
                type="monotone" 
                dataKey="cumuleEncaisses" 
                name="Cumul Encaissé (FCFA)" 
                stroke="#10B981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCumul)" 
              />
              <Line 
                type="monotone" 
                dataKey="cumuleObjectif" 
                name="Trajectoire Budgétaire Prévue" 
                stroke="#6366F1" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {/* VIEW 3: RÉPARTITION PAR CANAUX CONGO */}
        {activeView === 'channels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-chan-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number, name: string) => [`${val.toLocaleString()} FCFA`, name]}
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#1E293B',
                    borderColor: isDark ? '#334155' : '#475569',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>

            {/* Detailed Channel Breakdown Cards */}
            <div className="flex flex-col gap-2.5">
              <h4 className="text-xs font-bold text-[#050505]  uppercase tracking-wider">
                Répartition des encaissements par canal (+242)
              </h4>
              {channelData.map((chan) => (
                <div 
                  key={chan.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F0F2F5]  border border-[#E4E6EB]  text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-3 h-3 rounded-lg shrink-0" 
                      style={{ backgroundColor: chan.color }}
                    />
                    <div>
                      <p className="font-bold text-[#050505] ">{chan.name}</p>
                      <p className="text-[10px] text-[#65676B] ">{chan.percentage}% du total encaissé</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-[#050505]  text-sm">
                      {chan.value.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: STATUT PAR CLASSE */}
        {activeView === 'classes' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={classRecoveryData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
              <XAxis 
                type="number" 
                tick={{ fill: axisTextColor, fontSize: 10 }}
                tickFormatter={formatK}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                type="category" 
                dataKey="shortName" 
                tick={{ fill: axisTextColor, fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white text-white p-3 rounded-xl shadow-lg border border-[#E4E6EB] text-xs flex flex-col gap-1 min-w-[200px]">
                        <p className="font-bold text-sm text-[#1877F2]">{data.classe}</p>
                        <p className="text-[#65676B]">
                          Payé : <span className="font-bold text-[#1877F2] font-mono">{data.totalPaye.toLocaleString()} FCFA</span>
                        </p>
                        <p className="text-[#65676B]">
                          Total Exigible : <span className="font-semibold text-[#65676B] font-mono">{data.totalAttendu.toLocaleString()} FCFA</span>
                        </p>
                        <p className="text-amber-300">
                          Reste : <span className="font-bold font-mono">{data.reste.toLocaleString()} FCFA</span>
                        </p>
                        <p className="text-[#1877F2] text-[11px] font-bold mt-1">
                          Taux de Recouvrement : {data.taux}% ({data.aJour}/{data.eleves} élèves soldés)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="rect" />
              <Bar 
                dataKey="totalPaye" 
                name="Encaissé (FCFA)" 
                fill="#10B981" 
                stackId="a" 
                radius={[0, 0, 0, 0]} 
                barSize={20}
              />
              <Bar 
                dataKey="reste" 
                name="Reste à Recouvrer (FCFA)" 
                fill="#F59E0B" 
                stackId="a" 
                radius={[0, 6, 6, 0]} 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* VIEW 5: TRÉSORERIE RECETTES VS DÉPENSES VS SOLDE NET */}
        {activeView === 'cashflow' && showExpenseComparison && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={monthlyData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
              <XAxis 
                dataKey="mois" 
                tick={{ fill: axisTextColor, fontSize: 11 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: axisTextColor, fontSize: 10 }}
                tickFormatter={formatK}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white text-white p-3.5 rounded-xl shadow-xl border border-[#E4E6EB] text-xs flex flex-col gap-1.5 min-w-[220px]">
                        <p className="font-bold text-sm text-[#1877F2]">{data.nomComplet}</p>
                        <div className="flex justify-between items-center text-[#1877F2]">
                          <span>Recettes d'Écolage :</span>
                          <span className="font-bold font-mono">+{data.encaisse.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between items-center text-rose-400">
                          <span>Dépenses & Salaires :</span>
                          <span className="font-bold font-mono">-{data.depense.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between items-center text-[#1877F2] pt-1 border-t border-[#E4E6EB] font-bold">
                          <span>Solde Net du Mois :</span>
                          <span className="font-mono">+{data.soldeNet.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar 
                dataKey="encaisse" 
                name="Recettes Encaissées (+)" 
                fill="#10B981" 
                radius={[6, 6, 0, 0]} 
                barSize={16}
              />
              <Bar 
                dataKey="depense" 
                name="Dépenses d'Exploitation (-)" 
                fill="#EF4444" 
                radius={[6, 6, 0, 0]} 
                barSize={16}
              />
              <Line 
                type="monotone" 
                dataKey="soldeNet" 
                name="Solde Net Disponible" 
                stroke="#6366F1" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#6366F1' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

      </div>

      {/* 5. Footer Insights & Action Strip */}
      <div className="pt-4 border-t border-[#E4E6EB]  flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#65676B] ">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-[#E7F3FF]  text-[#1877F2] ">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span>
            <strong>Analyse Prédictive :</strong> Pic de recouvrement observé en Décembre & Juin (examens d'État BEPC/BAC).
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(monthlyData, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", "rapport_financier_mensuel_edusmart_2026_2027.json");
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="px-3 py-1.5 bg-[#F0F2F5]  hover:bg-[#F0F2F5] text-[#050505]  rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Exporter Données (JSON)
          </button>
        </div>
      </div>

    </div>
  );
};

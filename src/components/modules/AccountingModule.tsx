import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileSpreadsheet, 
  PieChart as PieIcon, 
  ArrowDownLeft, 
  ArrowUpRight,
  ShieldCheck,
  BarChart3,
  Layers,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ExpenseItem, FeePayment, Student } from '../../types';
import { MonthlyPaymentAnalyticsCharts } from '../dashboard/MonthlyPaymentAnalyticsCharts';
import { useTheme } from '../../context/ThemeContext';

interface AccountingModuleProps {
  payments: FeePayment[];
  expenses: ExpenseItem[];
  students?: Student[];
  onAddExpense: (expense: ExpenseItem) => void;
}

export const AccountingModule: React.FC<AccountingModuleProps> = ({
  payments,
  expenses,
  students = [],
  onAddExpense
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'analytics' | 'journal'>('analytics');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<boolean>(false);
  const [expenseTitle, setExpenseTitle] = useState<string>('');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseItem['categorie']>('Maintenance');
  const [expenseAmount, setExpenseAmount] = useState<string>('75000');
  const [expenseBeneficiary, setExpenseBeneficiary] = useState<string>('');

  const totalRevenues = payments.reduce((sum, p) => sum + p.montant, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.montant, 0);
  const netSolde = totalRevenues - totalExpenses;

  // Expense breakdown by category
  const expenseCategoryData = useMemo(() => {
    const categoriesMap: Record<string, number> = {};
    expenses.forEach((e) => {
      categoriesMap[e.categorie] = (categoriesMap[e.categorie] || 0) + e.montant;
    });

    const colors: Record<string, string> = {
      'Salaires': '#6366F1',
      'Maintenance': '#F59E0B',
      'Fournitures': '#06B6D4',
      'Énergie & Eau': '#EF4444',
      'Activités Pédagogiques': '#10B981',
      'Autre': '#8B5CF6'
    };

    return Object.entries(categoriesMap).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#94A3B8'
    }));
  }, [expenses]);

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      titre: expenseTitle,
      categorie: expenseCategory,
      montant: parseFloat(expenseAmount) || 0,
      date: new Date().toISOString().split('T')[0],
      beneficiaire: expenseBeneficiary || 'Prestataire / Fournisseur Brazzaville',
      statut: 'Payé'
    };

    onAddExpense(newExpense);
    setShowAddExpenseModal(false);
    setExpenseTitle('');
    setExpenseBeneficiary('');
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white  p-4 sm:p-6 rounded-lg border border-[#E4E6EB]  shadow-sm transition-colors duration-200 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#1877F2]  font-bold text-xs uppercase tracking-wider">
            <Calculator className="w-4 h-4" /> Module Comptabilité Générale & Trésorerie (FCFA)
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#050505]  mt-1">États Financiers & Grand Livre de Trésorerie</h2>
          <p className="text-xs text-[#65676B]  mt-1">
            Suivi des recettes d'écolage, charges d'exploitation, salaires du personnel et solde de trésorerie en temps réel (Brazzaville).
          </p>
        </div>

        <div className="flex items-center justify-center w-full md:w-auto">
          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Engager une Dépense
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white  border border-[#E4E6EB]  p-5 rounded-lg shadow-sm flex flex-col justify-between transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1877F2]  uppercase tracking-wider">Total Recettes Encaissées</span>
            <div className="w-8 h-8 rounded-lg bg-[#E7F3FF]  text-[#1877F2]  border border-[#E4E6EB]  flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#1877F2]  mt-3">+{totalRevenues.toLocaleString()} FCFA</p>
          <span className="text-[11px] text-[#65676B]  mt-1">{payments.length} encaissements validés</span>
        </div>

        <div className="bg-white  border border-[#E4E6EB]  p-5 rounded-lg shadow-sm flex flex-col justify-between transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600  uppercase tracking-wider">Total Dépenses Engagées</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50  text-rose-600  border border-rose-100  flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-rose-600  mt-3">-{totalExpenses.toLocaleString()} FCFA</p>
          <span className="text-[11px] text-[#65676B]  mt-1">{expenses.length} dépenses enregistrées</span>
        </div>

        <div className={`p-5 rounded-lg border shadow-sm flex flex-col justify-between transition-colors duration-200 ${
          netSolde >= 0 
            ? 'bg-[#E7F3FF]/70  border-[#E4E6EB] ' 
            : 'bg-rose-50/70  border-rose-200 '
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1877F2]  uppercase tracking-wider">Solde Net Disponible</span>
            <ShieldCheck className="w-5 h-5 text-[#1877F2] " />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#1877F2]  mt-3">{netSolde.toLocaleString()} FCFA</p>
          <span className="text-[11px] text-[#1877F2]  font-medium mt-1">Disponibilité Caisse & Comptes Bancaires</span>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center gap-2 bg-white  p-2 rounded-lg border border-[#E4E6EB]  shadow-sm text-xs transition-colors duration-200">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-[#1877F2] text-white shadow-xs'
              : 'text-[#65676B]  hover:bg-[#F0F2F5]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Graphiques & Évolution Mensuelle des Paiements (Recharts)</span>
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'journal'
              ? 'bg-[#1877F2] text-white shadow-xs'
              : 'text-[#65676B]  hover:bg-[#F0F2F5]'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Grand Livre des Écritures (Recettes & Dépenses)</span>
        </button>
      </div>

      {/* Tab 1: Analytics & Recharts Charts */}
      {activeTab === 'analytics' && (
        <div className="flex flex-col gap-6">
          <MonthlyPaymentAnalyticsCharts
            payments={payments}
            students={students}
            expenses={expenses}
            showExpenseComparison={true}
            title="Évolution Mensuelle des Flux Financiers (FCFA)"
            subtitle="Recettes d'écolage mensuelles vs Dépenses de fonctionnement vs Solde de trésorerie"
          />

          {/* Additional Expense Breakdown Chart */}
          <div className="bg-white  rounded-lg border border-[#E4E6EB]  shadow-sm p-5 sm:p-6 transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-[#E4E6EB]  pb-4 mb-4">
              <div>
                <h3 className="font-bold text-[#050505]  text-base flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-rose-500" />
                  Répartition des Charges & Dépenses par Poste (FCFA)
                </h3>
                <p className="text-xs text-[#65676B] ">Ventilation analytique des sorties de caisse</p>
              </div>
              <span className="text-xs font-bold text-rose-600  font-mono">
                Total: -{totalExpenses.toLocaleString()} FCFA
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={expenseCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {expenseCategoryData.map((entry, index) => (
                        <Cell key={`cell-exp-${index}`} fill={entry.color} />
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
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      formatter={(value) => <span className="text-xs text-[#65676B]  font-medium">{value}</span>}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col gap-2">
                {expenseCategoryData.map((cat) => (
                  <div 
                    key={cat.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F0F2F5]  border border-[#E4E6EB]  text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-lg shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="font-bold text-[#050505] ">{cat.name}</span>
                    </div>
                    <span className="font-mono font-bold text-[#050505] ">
                      {cat.value.toLocaleString()} FCFA
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Financial Ledger (Recettes & Dépenses) */}
      {activeTab === 'journal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recettes récentes */}
          <div className="bg-white  border border-[#E4E6EB]  rounded-lg shadow-sm overflow-hidden transition-colors duration-200">
            <div className="px-6 py-4 border-b border-[#E4E6EB]  flex items-center justify-between">
              <h3 className="font-bold text-[#050505]  text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-lg bg-[#1877F2]"></span>
                Recettes Récentes d'Écolage (Entrées)
              </h3>
              <span className="text-xs text-[#1877F2]  font-bold">+{totalRevenues.toLocaleString()} FCFA</span>
            </div>

            <div className="divide-y divide-slate-100 ">
              {payments.slice(0, 5).map((p) => (
                <div key={p.id} className="p-4 sm:px-6 flex items-center justify-between text-xs hover:bg-[#F0F2F5]/70 transition-colors">
                  <div>
                    <p className="font-bold text-[#050505] ">{p.studentName}</p>
                    <p className="text-[11px] text-[#65676B]  mt-0.5">{p.motif} • {p.datePaiement}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-[#1877F2]  text-sm">+{p.montant.toLocaleString()} FCFA</span>
                    <p className="text-[10px] text-[#65676B]  font-medium">{p.modePaiement}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dépenses récentes */}
          <div className="bg-white  border border-[#E4E6EB]  rounded-lg shadow-sm overflow-hidden transition-colors duration-200">
            <div className="px-6 py-4 border-b border-[#E4E6EB]  flex items-center justify-between">
              <h3 className="font-bold text-[#050505]  text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-lg bg-rose-500"></span>
                Dépenses & Charges (Sorties)
              </h3>
              <span className="text-xs text-rose-600  font-bold">-{totalExpenses.toLocaleString()} FCFA</span>
            </div>

            <div className="divide-y divide-slate-100 ">
              {expenses.map((e) => (
                <div key={e.id} className="p-4 sm:px-6 flex items-center justify-between text-xs hover:bg-[#F0F2F5]/70 transition-colors">
                  <div>
                    <p className="font-bold text-[#050505] ">{e.titre}</p>
                    <p className="text-[11px] text-[#65676B]  mt-0.5">{e.categorie} • {e.beneficiaire}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-rose-600  text-sm">-{e.montant.toLocaleString()} FCFA</span>
                    <p className="text-[10px] text-[#65676B]  font-medium">{e.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-white backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white  text-[#050505]  w-full max-w-md rounded-lg border border-[#E4E6EB]  shadow-2xl p-6 flex flex-col gap-4">
            <h3 className="font-bold text-base text-[#050505]  border-b border-[#E4E6EB]  pb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-rose-600 " />
              Enregistrement d'une Dépense
            </h3>

            <form onSubmit={handleSaveExpense} className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="text-[#050505]  font-semibold mb-1 block">Libellé de la dépense :</label>
                <input
                  type="text"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="Ex: Achat fournitures de bureau & rames à Moungali"
                  className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#050505]  font-semibold mb-1 block">Catégorie :</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Salaires">Salaires & Vacations</option>
                    <option value="Maintenance">Maintenance & Travaux</option>
                    <option value="Fournitures">Fournitures & Imprimerie</option>
                    <option value="Énergie & Eau">Énergie (E2C / Carburant) & Eau (LCDE)</option>
                    <option value="Activités Pédagogiques">Activités Pédagogiques & Examens</option>
                    <option value="Autre">Autre charge</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#050505]  font-semibold mb-1 block">Montant (FCFA) :</label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-rose-600  rounded-xl px-3 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[#050505]  font-semibold mb-1 block">Bénéficiaire / Prestataire :</label>
                <input
                  type="text"
                  value={expenseBeneficiary}
                  onChange={(e) => setExpenseBeneficiary(e.target.value)}
                  placeholder="Ex: Librairie des Plateaux, E2C Brazzaville, Station Total..."
                  className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E6EB] ">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 bg-[#F0F2F5]  hover:bg-[#F0F2F5] text-[#050505]  rounded-xl font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-sm cursor-pointer"
                >
                  Valider la Dépense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};


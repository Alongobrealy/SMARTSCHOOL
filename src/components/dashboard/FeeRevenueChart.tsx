import React, { useMemo } from 'react';
import { FeePayment } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface FeeRevenueChartProps {
  payments: FeePayment[];
}

export const FeeRevenueChart: React.FC<FeeRevenueChartProps> = ({ payments }) => {
  // Aggregate data by month
  const data = useMemo(() => {
    // Basic mapping of numeric month to French abbreviation
    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    
    // Create an initial structure for the 12 months (or just the school year starting in September)
    // For simplicity, we'll aggregate all given payments by month string
    const map = new Map<number, number>();
    
    // Initialize all 12 months to 0
    for (let i = 0; i < 12; i++) {
      map.set(i, 0);
    }
    
    // Only count Validated payments
    payments.forEach(payment => {
      if (payment.statut === 'Validé' && payment.datePaiement) {
        // Assume date is in YYYY-MM-DD or parseable format
        const date = new Date(payment.datePaiement);
        if (!isNaN(date.getTime())) {
          const m = date.getMonth();
          map.set(m, (map.get(m) || 0) + payment.montant);
        }
      }
    });

    // Reorder starting from September (month 8) to August (month 7) to reflect an academic year
    const orderedData = [];
    const academicYearStart = 8; // September
    for (let i = 0; i < 12; i++) {
      const currentMonth = (academicYearStart + i) % 12;
      orderedData.push({
        name: monthNames[currentMonth],
        total: map.get(currentMonth) || 0
      });
    }

    return orderedData;
  }, [payments]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white  border border-[#E4E6EB]  p-3 rounded-xl shadow-lg">
          <p className="text-[#65676B]  font-bold mb-1">{label}</p>
          <p className="text-[#1877F2]  font-black">
            {payload[0].value.toLocaleString()} FCFA
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white  border border-[#E4E6EB]  p-5 rounded-lg shadow-sm transition-colors duration-200 flex flex-col w-full h-[400px]">
      <div className="mb-4">
        <h3 className="text-lg font-black text-[#050505] ">Évolution des Encaissements</h3>
        <p className="text-xs text-[#65676B] ">Paiements validés par mois (Année Académique)</p>
      </div>
      
      <div className="flex-1 w-full h-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000)}k`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
            <Bar 
              dataKey="total" 
              fill="#10b981" 
              radius={[6, 6, 0, 0]} 
              barSize={32}
              activeBar={{ fill: '#059669' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

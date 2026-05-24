import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useApp } from '../../context/AppContext';

const COLORS = ['#4CAF50', '#FFC107', '#FF5722', '#2196F3', '#9C27B0', '#FF9800', '#795548', '#607D8B'];

const ExpenseChart: React.FC = () => {
  const { transactions } = useApp();

  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const existing = acc.find(item => item.name === transaction.category);
      if (existing) {
        existing.value += transaction.amount;
      } else {
        acc.push({ name: transaction.category, value: transaction.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Expenses by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={expenseData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {expenseData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const MonthlyTrendChart: React.FC = () => {
  const { transactions } = useApp();

  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = transaction.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const existing = acc.find(item => item.month === month);
    
    if (existing) {
      if (transaction.type === 'income') {
        existing.income += transaction.amount;
      } else {
        existing.expenses += transaction.amount;
      }
    } else {
      acc.push({
        month,
        income: transaction.type === 'income' ? transaction.amount : 0,
        expenses: transaction.type === 'expense' ? transaction.amount : 0,
      });
    }
    
    return acc;
  }, [] as { month: string; income: number; expenses: number }[]);

  // Sort by date
  monthlyData.sort((a, b) => {
    const dateA = new Date(a.month);
    const dateB = new Date(b.month);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Monthly Income vs Expenses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            formatter={(value: number, name: string) => [
              `$${value.toFixed(2)}`, 
              name === 'income' ? 'Income' : 'Expenses'
            ]}
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '6px',
              color: '#F9FAFB'
            }}
          />
          <Legend />
          <Bar dataKey="income" fill="#4CAF50" name="Income" />
          <Bar dataKey="expenses" fill="#FF5722" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const DashboardCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ExpenseChart />
      <MonthlyTrendChart />
    </div>
  );
};

export default DashboardCharts;

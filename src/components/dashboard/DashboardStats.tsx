import React from 'react';
import { useApp } from '../../context/AppContext';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const StatsCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}> = ({ title, value, icon, color, trend }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {trend.value}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const DashboardStats: React.FC = () => {
  const { stats } = useApp();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Balance"
        value={formatCurrency(stats.balance)}
        icon={<DollarSign className="h-6 w-6 text-white" />}
        color="bg-primary"
        trend={{
          value: formatCurrency(stats.monthlyBalance),
          isPositive: stats.monthlyBalance >= 0,
        }}
      />
      <StatsCard
        title="Total Income"
        value={formatCurrency(stats.totalIncome)}
        icon={<TrendingUp className="h-6 w-6 text-white" />}
        color="bg-green-500"
        trend={{
          value: formatCurrency(stats.monthlyIncome),
          isPositive: true,
        }}
      />
      <StatsCard
        title="Total Expenses"
        value={formatCurrency(stats.totalExpenses)}
        icon={<TrendingDown className="h-6 w-6 text-white" />}
        color="bg-red-500"
        trend={{
          value: formatCurrency(stats.monthlyExpenses),
          isPositive: false,
        }}
      />
      <StatsCard
        title="This Month"
        value={formatCurrency(stats.monthlyBalance)}
        icon={<Calendar className="h-6 w-6 text-white" />}
        color="bg-accent"
        trend={{
          value: stats.monthlyBalance >= 0 ? 'Positive' : 'Negative',
          isPositive: stats.monthlyBalance >= 0,
        }}
      />
    </div>
  );
};

export default DashboardStats;

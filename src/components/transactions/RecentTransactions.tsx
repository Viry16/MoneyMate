import React from 'react';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const RecentTransactions: React.FC = () => {
  const { transactions } = useApp();

  const recentTransactions = transactions.slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
      
      {recentTransactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No transactions yet</p>
          <p className="text-sm text-gray-500 mt-1">Add your first transaction to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{transaction.description}</p>
                  <p className="text-gray-400 text-xs">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
                <p className="text-gray-500 text-xs">{formatDate(transaction.date)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;

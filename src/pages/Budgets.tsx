import React from 'react';

const Budgets: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Budgets</h1>
        <p className="text-gray-400 mt-2">Plan and track your spending limits</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Budget Planning</h2>
        <p className="text-gray-400">Budget planning features coming soon!</p>
        <p className="text-gray-500 text-sm mt-2">This will include monthly budget setting, spending alerts, and budget vs actual reports.</p>
      </div>
    </div>
  );
};

export default Budgets;

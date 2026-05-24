import React from 'react';
import { useApp } from '../context/AppContext';
import DashboardStats from '../components/dashboard/DashboardStats';
import DashboardCharts from '../components/charts/DashboardCharts';
import RecentTransactions from '../components/transactions/RecentTransactions';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { loading } = useApp();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back! Here's your financial overview.</p>
      </div>

      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCharts />
        </div>
        <div>
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

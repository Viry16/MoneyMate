import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { transactions } = useApp();

  const handleExportCSV = () => {
    const filename = `moneymate-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(transactions, filename);
  };

  const handleExportPDF = async () => {
    const filename = `moneymate-transactions-${new Date().toISOString().split('T')[0]}.pdf`;
    await exportToPDF(transactions, filename);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 mt-2">Manage your account settings</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Name
            </label>
            <p className="text-white">{user?.displayName || 'Not set'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <p className="text-white">{user?.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              User ID
            </label>
            <p className="text-gray-400 text-sm font-mono">{user?.uid}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Export Data</h2>
        <p className="text-gray-400 mb-4">Export your transaction data for backup or analysis.</p>
        
        <div className="flex space-x-4">
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Export to CSV
          </button>
          <button 
            onClick={handleExportPDF}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            Export to PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

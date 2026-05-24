import { Transaction } from '../types';

export const exportToCSV = (transactions: Transaction[], filename: string = 'transactions.csv') => {
  const headers = ['Date', 'Type', 'Description', 'Category', 'Amount'];
  
  const csvContent = [
    headers.join(','),
    ...transactions.map(transaction => [
      transaction.date.toLocaleDateString(),
      transaction.type,
      `"${transaction.description}"`,
      transaction.category,
      transaction.amount
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToPDF = async (transactions: Transaction[], filename: string = 'transactions.pdf') => {
  const jsPDF = (await import('jspdf')).default;
  const { format } = await import('date-fns');
  
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Transaction Report', 20, 20);
  
  // Add date range
  doc.setFontSize(12);
  const startDate = transactions.length > 0 ? format(transactions[transactions.length - 1].date, 'MMM dd, yyyy') : 'N/A';
  const endDate = transactions.length > 0 ? format(transactions[0].date, 'MMM dd, yyyy') : 'N/A';
  doc.text(`Date Range: ${startDate} - ${endDate}`, 20, 30);
  
  // Add summary
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  
  doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 20, 40);
  doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 20, 50);
  doc.text(`Balance: $${balance.toFixed(2)}`, 20, 60);
  
  // Add transactions table
  let yPosition = 80;
  const pageHeight = doc.internal.pageSize.height;
  
  // Table headers
  doc.setFontSize(10);
  doc.text('Date', 20, yPosition);
  doc.text('Type', 50, yPosition);
  doc.text('Description', 70, yPosition);
  doc.text('Category', 120, yPosition);
  doc.text('Amount', 160, yPosition);
  
  yPosition += 10;
  
  // Add transactions
  transactions.forEach((transaction, index) => {
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.text(format(transaction.date, 'MMM dd'), 20, yPosition);
    doc.text(transaction.type, 50, yPosition);
    doc.text(transaction.description.substring(0, 20), 70, yPosition);
    doc.text(transaction.category, 120, yPosition);
    doc.text(`$${transaction.amount.toFixed(2)}`, 160, yPosition);
    
    yPosition += 8;
  });
  
  // Save the PDF
  doc.save(filename);
};

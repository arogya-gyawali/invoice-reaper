// frontend/components/StatsPanel.jsx
export default function StatsPanel({ invoices = [] }) {
  if (!invoices.length)
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center text-gray-400">
        Loading invoice stats...
      </div>
    );

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const avgOverdue = Math.round(
    invoices.reduce((s, inv) => s + inv.days_overdue, 0) / invoices.length
  );

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex justify-around text-center shadow-md">
      <div>
        <p className="text-gray-400 text-sm">Total Invoices</p>
        <p className="text-2xl font-bold text-white">{invoices.length}</p>
      </div>
      <div>
        <p className="text-gray-400 text-sm">Total Outstanding</p>
        <p className="text-2xl font-bold text-amber-400">${totalAmount.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-gray-400 text-sm">Avg. Days Overdue</p>
        <p className="text-2xl font-bold text-red-400">{avgOverdue} days</p>
      </div>
    </div>
  );
}

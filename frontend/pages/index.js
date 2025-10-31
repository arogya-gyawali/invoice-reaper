import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import StatsPanel from "../components/StatsPanel";


export default function Home() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");



  // Fetch overdue invoices from Flask backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/invoices")
      .then((res) => res.json())
      .then((data) => setInvoices(data))
      .catch((err) => console.error("Error fetching invoices:", err));
  }, []);

  // Send reminders to all clients
  const sendReminders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/reap", { method: "POST" });
      const data = await res.json();
      toast.success(`Sent ${data.summary.length} reminders successfully`);
    } catch (err) {
      toast.error("Failed to send reminders");
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-slate-900 text-gray-100 p-8">
      <Toaster position="top-right" />

      <h1 className="text-4xl font-bold mb-6 text-red-400">Invoice Reaper 👻</h1>
      <div className="mb-8">
        <StatsPanel invoices={invoices} />
      </div>


      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-400">
          {invoices.length
            ? `${invoices.length} overdue invoices found`
            : "Loading invoices..."}
        </p>
        <button
          onClick={sendReminders}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          {loading ? "Sending..." : "Send Reminders"}
        </button>
      </div>

      {statusMsg && (
        <div className="mb-6 text-sm text-emerald-400 font-medium">{statusMsg}</div>
      )}

      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
        {invoices.map((inv) => (
          <div
            key={inv.invoice_id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-white">{inv.client}</h2>
            <p className="text-gray-400 text-sm">Invoice #{inv.invoice_id}</p>
            <p className="mt-2 text-lg text-amber-400 font-medium">${inv.amount}</p>
            <p className="text-gray-400 text-sm mt-1">{inv.days_overdue} days overdue</p>
            <p className="text-gray-500 text-xs mt-2">Due date: {inv.due_date}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import StatsPanel from "../components/StatsPanel";

export default function Home() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("professional");

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
    toast.loading("The Reaper is crafting your reminders...", { id: "reaper" });

    try {
      const res = await fetch("http://127.0.0.1:5000/api/reap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tone }),
      });
      const data = await res.json();

      toast.success(
        `👻 Sent ${data.summary.length} reminders (${tone} tone)`,
        { id: "reaper" }
      );
    } catch (err) {
      toast.error("❌ Failed to send reminders", { id: "reaper" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-gray-100 p-8 font-inter">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-red-400 tracking-wide">
          Invoice Reaper 👻
        </h1>
        <select
          onChange={(e) => setTone(e.target.value)}
          value={tone}
          className="bg-slate-800 border border-slate-700 text-gray-200 px-3 py-2 rounded-md text-sm shadow hover:border-red-400 transition"
        >
          <option value="friendly">Friendly</option>
          <option value="professional">Professional</option>
          <option value="spooky">Spooky 👻</option>
        </select>
      </div>

      {/* Stats panel */}
      <div className="mb-10">
        <StatsPanel invoices={invoices} />
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-8">
        <p
          className={`text-gray-400 ${
            invoices.length ? "" : "animate-pulse"
          }`}
        >
          {invoices.length
            ? `${invoices.length} overdue invoices found`
            : "Summoning overdue data..."}
        </p>
        <button
          onClick={sendReminders}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white px-5 py-2 rounded-lg shadow-md transition-all hover:scale-[1.02]"
        >
          {loading ? "Reaping..." : "Send Reminders"}
        </button>
      </div>

      {/* Invoice Cards */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-5">
        {invoices.map((inv) => (
          <div
            key={inv.invoice_id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow hover:shadow-amber-400/20 hover:-translate-y-1 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-white">
              {inv.client}
            </h2>
            <p className="text-gray-400 text-sm">Invoice #{inv.invoice_id}</p>
            <p className="mt-3 text-lg text-amber-400 font-medium">
              ${inv.amount}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {inv.days_overdue} days overdue
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Due date: {inv.due_date}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm border-t border-slate-800 pt-6">
        Made with ❤️ by Aarogya | AgentMail HackHalloween 2025
      </footer>
    </main>
  );
}

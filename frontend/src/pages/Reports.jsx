import { useState } from "react";
import api from "../services/api";

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const generatePDF = async () => {
    setLoading(true);
    setMsg("");

    try {
      const res = await api.get("/reports/pdf", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `AquaSense-Report-${Date.now()}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setMsg("✅ Report downloaded successfully!");
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4">
          📄 Generate Report
        </h2>

        <button
          onClick={generatePDF}
          disabled={loading}
          className="w-full bg-primary text-white rounded-lg py-2.5 text-sm"
        >
          {loading ? "Generating..." : "⬇️ Download PDF Report"}
        </button>

        {msg && (
          <p className="text-xs text-center mt-3">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
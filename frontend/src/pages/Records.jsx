import { useState } from 'react'
import { useRecords } from '../hooks/useWaterData'
import api from '../services/api'

export default function Records() {
  const {
  records = [],
  loading = false,
  createRecord,
  deleteRecord
} = useRecords() || {}
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ date: '', liters: '', location: '', department: 'General', notes: '' })
  const [importing, setImporting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await createRecord(form)
    setForm({ date: '', liters: '', location: '', department: 'General', notes: '' })
    setShowForm(false)
  }
  const handleCSV = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setImporting(true);

  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await api.post(
      "/water/import",
      fd,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert(res.data.message);

    window.location.reload();

  }catch (err) {
  console.log("FULL ERROR:", err);
  console.log("RESPONSE:", err.response);
  console.log("DATA:", err.response?.data);

  alert(
    JSON.stringify(err.response?.data) ||
    err.message
  );
} finally {
    setImporting(false);
  }
};

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
  {records?.length || 0} records
</span>
        <div className="flex gap-2">
          <label className="cursor-pointer bg-white border border-gray-200 text-gray-700 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors">
            {importing ? 'Importing...' : '⬆️ Import CSV'}
            <input type="file" accept=".csv" className="hidden" onChange={handleCSV} />
          </label>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-primary text-white rounded-lg px-4 py-2 text-sm hover:bg-primary-dark transition-colors">
            + Add Record
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-medium text-gray-900 mb-4">New Water Record</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {[['date','Date','date'],['liters','Liters','number'],['location','Location','text'],].map(([k,l,t]) => (
              <div key={k}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input type={t} required value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
              <select value={form.department} onChange={e => setForm({...form,department:e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                {['General','Facilities','Cafeteria','Sports','Admin','Hostel'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
              <input type="text" value={form.notes} onChange={e => setForm({...form,notes:e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="col-span-2 flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading...</div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Date','Liters','Location','Department','Notes',''].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(records || []).map(r => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{r.liters.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600">{r.location}</td>
                  <td className="px-4 py-3 text-gray-600">{r.department}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{r.notes || '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteRecord(r._id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

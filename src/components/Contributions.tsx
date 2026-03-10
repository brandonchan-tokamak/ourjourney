import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, TrendingUp } from 'lucide-react';

export default function Contributions() {
  const [items, setItems] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ person: 'Soso', amount: 0, month: new Date().toISOString().slice(0, 7), notes: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ person: '', amount: 0, month: '', notes: '' });

  const fetchContributions = () => {
    fetch('/api/contributions')
      .then(res => res.json())
      .then(data => setItems(data));
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  const handleAdd = async () => {
    if (!newItem.person || !newItem.amount) return;
    await fetch('/api/contributions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
    setIsAdding(false);
    setNewItem({ person: 'Soso', amount: 0, month: new Date().toISOString().slice(0, 7), notes: '' });
    fetchContributions();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/contributions/${id}`, { method: 'DELETE' });
    fetchContributions();
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditForm({ person: item.person, amount: item.amount, month: item.month, notes: item.notes || '' });
  };

  const handleUpdate = async () => {
    await fetch(`/api/contributions/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    });
    setEditingId(null);
    fetchContributions();
  };

  const totalContributions = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-display font-bold text-slate-800">Contributions Tracker</h2>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Add Contribution
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-lg font-medium">Total Saved (SGD)</h3>
          <p className="text-6xl font-display font-bold text-blue-600 mt-2">S${totalContributions.toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-lg font-medium">Total Saved (USD)</h3>
          <p className="text-6xl font-display font-bold text-indigo-600 mt-2">US${(totalContributions * 0.74).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Person</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isAdding && (
                <tr className="bg-blue-50/50">
                  <td className="px-6 py-4">
                    <input 
                      type="month" 
                      value={newItem.month} 
                      onChange={e => setNewItem({...newItem, month: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={newItem.person} 
                      onChange={e => setNewItem({...newItem, person: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="Soso">Soso</option>
                      <option value="Jojo">Jojo</option>
                      <option value="Soso & Jojo">Soso & Jojo</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      value={newItem.notes} 
                      onChange={e => setNewItem({...newItem, notes: e.target.value})}
                      placeholder="Optional notes"
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="number" 
                      value={newItem.amount || ''} 
                      onChange={e => setNewItem({...newItem, amount: Number(e.target.value)})}
                      placeholder="0"
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={handleAdd} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Save size={16} /></button>
                      <button onClick={() => setIsAdding(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md"><X size={16} /></button>
                    </div>
                  </td>
                </tr>
              )}

              {items.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  {editingId === item.id ? (
                    <>
                      <td className="px-6 py-4">
                        <input 
                          type="month" 
                          value={editForm.month} 
                          onChange={e => setEditForm({...editForm, month: e.target.value})}
                          className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={editForm.person} 
                          onChange={e => setEditForm({...editForm, person: e.target.value})}
                          className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                          <option value="Soso">Soso</option>
                          <option value="Jojo">Jojo</option>
                          <option value="Soso & Jojo">Soso & Jojo</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="text" 
                          value={editForm.notes} 
                          onChange={e => setEditForm({...editForm, notes: e.target.value})}
                          className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="number" 
                          value={editForm.amount} 
                          onChange={e => setEditForm({...editForm, amount: Number(e.target.value)})}
                          className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button onClick={handleUpdate} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Save size={16} /></button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md"><X size={16} /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        {new Date(item.month + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${item.person === 'Soso' ? 'bg-blue-100 text-blue-700' : item.person === 'Jojo' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'}`}>
                          {item.person}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.notes}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800 text-right">${item.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: 1 }}>
                          <button onClick={() => startEdit(item)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              
              {items.length === 0 && !isAdding && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No contributions yet. Start saving for the dream home!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

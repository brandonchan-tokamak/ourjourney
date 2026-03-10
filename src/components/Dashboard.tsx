import React, { useEffect, useState } from 'react';
import { View } from '../App';
import { ArrowRight, Image as ImageIcon, Youtube, FileText } from 'lucide-react';

export default function Dashboard({ setCurrentView }: { setCurrentView: (v: View) => void }) {
  const [stats, setStats] = useState({ totalItems: 0, totalContributions: 0 });
  const [recentItems, setRecentItems] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/items').then(res => res.json()),
      fetch('/api/contributions').then(res => res.json())
    ]).then(([items, contributions]) => {
      setStats({
        totalItems: items.length,
        totalContributions: contributions.reduce((acc: number, curr: any) => acc + curr.amount, 0)
      });
      setRecentItems(items.slice(0, 3));
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-display font-bold text-slate-800">Welcome back!</h2>
        <p className="text-slate-500 mt-2">Here's an overview of your renovation planning.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium">Total Inspiration Items</h3>
          <p className="text-4xl font-display font-bold text-slate-800 mt-2">{stats.totalItems}</p>
          <button onClick={() => setCurrentView('inspiration')} className="text-blue-600 text-sm font-medium mt-4 flex items-center hover:text-blue-700">
            View all <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium">Total Saved</h3>
          <p className="text-4xl font-display font-bold text-slate-800 mt-2">${stats.totalContributions.toLocaleString()}</p>
          <button onClick={() => setCurrentView('contributions')} className="text-blue-600 text-sm font-medium mt-4 flex items-center hover:text-blue-700">
            Manage contributions <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium">Savings Target</h3>
          <div className="flex justify-between mt-2 mb-1">
            <span className="text-sm font-medium text-slate-600">${stats.totalContributions.toLocaleString()} saved</span>
            <span className="text-sm font-medium text-slate-400">$80,000 goal</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full mt-2 overflow-hidden flex">
            <div 
              className="bg-blue-500 h-full" 
              style={{ width: `${Math.min((stats.totalContributions / 80000) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-display font-bold text-slate-800 mb-4">Recent Inspiration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
              {item.type === 'image' && (
                <div className="h-48 overflow-hidden bg-slate-50 flex items-center justify-center">
                  {item.content ? (
                    <img src={item.content} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<div class="text-slate-400 flex flex-col items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><span class="text-xs">Image unavailable</span></div>'; }} />
                  ) : (
                    <div className="text-slate-400 flex flex-col items-center">
                      <ImageIcon size={24} className="mb-2" />
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                </div>
              )}
              {item.type === 'youtube' && (
                <div className="h-48 bg-slate-100 flex items-center justify-center">
                  <Youtube size={48} className="text-red-500 opacity-50" />
                </div>
              )}
              {item.type === 'note' && (
                <div className="h-48 bg-blue-50 p-6 overflow-hidden">
                  <p className="text-slate-700 text-sm line-clamp-6">{item.content}</p>
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    {item.type === 'image' && <ImageIcon size={14} className="text-slate-400" />}
                    {item.type === 'youtube' && <Youtube size={14} className="text-slate-400" />}
                    {item.type === 'note' && <FileText size={14} className="text-slate-400" />}
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.room}</span>
                  </div>
                  <h4 className="font-medium text-slate-800">{item.title}</h4>
                </div>
              </div>
            </div>
          ))}
          {recentItems.length === 0 && (
            <div className="col-span-3 text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500">No inspiration added yet.</p>
              <button onClick={() => setCurrentView('inspiration')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Add your first idea
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

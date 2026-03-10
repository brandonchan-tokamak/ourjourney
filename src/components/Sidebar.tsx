import React from 'react';
import { Home, Lightbulb, PiggyBank, Sofa } from 'lucide-react';
import { View } from '../App';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'inspiration', label: 'Inspiration', icon: Lightbulb },
    { id: 'furniture', label: 'Furniture', icon: Sofa },
    { id: 'contributions', label: 'Contributions', icon: PiggyBank },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-100 flex flex-col">
      <div className="p-6">
        <h1 className="text-3xl font-display font-bold tracking-tight text-slate-50">Our Journey</h1>
        <p className="text-blue-400 text-sm mt-1 font-medium">Soso & Jojo</p>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">BTO COUNTDOWN</div>
          <div className="text-2xl font-display font-bold text-blue-400">
            {(() => {
              const targetDate = new Date('2029-10-01T00:00:00');
              const now = new Date();
              const diffTime = Math.max(0, targetDate.getTime() - now.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const years = Math.floor(diffDays / 365);
              const days = diffDays % 365;
              return `${years} Year(s) ${days} Days`;
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

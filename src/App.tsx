import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Inspiration from './components/Inspiration';
import Furniture from './components/Furniture';
import Contributions from './components/Contributions';
import Sidebar from './components/Sidebar';

export type View = 'dashboard' | 'inspiration' | 'furniture' | 'contributions';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 overflow-y-auto p-8">
        {currentView === 'dashboard' && <Dashboard setCurrentView={setCurrentView} />}
        {currentView === 'inspiration' && <Inspiration />}
        {currentView === 'furniture' && <Furniture />}
        {currentView === 'contributions' && <Contributions />}
      </main>
    </div>
  );
}

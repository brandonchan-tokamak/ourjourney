import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Image as ImageIcon, Link as LinkIcon, Trash2, ExternalLink } from 'lucide-react';

const ROOMS = ['All', 'Kitchen', 'Living Room', 'Master Bedroom', 'Guest Bedroom', 'Master Bath', 'Guest Bath', 'Study'];

export default function Furniture() {
  const [items, setItems] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = () => {
    fetch(`/api/furniture?room=${activeRoom}`)
      .then(res => res.json())
      .then(data => setItems(data));
  };

  useEffect(() => {
    fetchItems();
  }, [activeRoom]);

  const handleDelete = async (id: number) => {
    await fetch(`/api/furniture/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-800">Furniture Finds</h2>
          <p className="text-slate-500 mt-2">Save cool furniture findings, links, and notes.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Add Furniture
        </button>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {ROOMS.map(room => (
          <button
            key={room}
            onClick={() => setActiveRoom(room)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeRoom === room 
                ? 'bg-slate-800 text-white' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {room}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group relative flex flex-col">
            <button 
              onClick={() => handleDelete(item.id)}
              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </button>
            
            <div className="h-48 bg-slate-50 flex items-center justify-center overflow-hidden">
              {item.image_url ? (
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<div class="text-slate-400 flex flex-col items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><span class="text-xs">Image unavailable</span></div>'; }} />
              ) : (
                <div className="text-slate-400 flex flex-col items-center">
                  <ImageIcon size={24} className="mb-2" />
                  <span className="text-xs">No image</span>
                </div>
              )}
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded-md">
                  {item.room}
                </span>
              </div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-slate-800 text-lg leading-tight pr-2">{item.title}</h4>
                {item.price > 0 && (
                  <span className="font-semibold text-blue-600 whitespace-nowrap">${item.price.toLocaleString()}</span>
                )}
              </div>
              
              {item.notes && (
                <p className="text-slate-600 text-sm mb-4 flex-1">{item.notes}</p>
              )}
              
              {item.url && (
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mt-auto"
                >
                  <ExternalLink size={14} className="mr-1" />
                  View Item
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
            <SofaIcon size={24} />
          </div>
          <h3 className="text-lg font-medium text-slate-800">No furniture found</h3>
          <p className="text-slate-500 mt-1">Add some cool findings to get started.</p>
        </div>
      )}

      {isModalOpen && <AddFurnitureModal onClose={() => setIsModalOpen(false)} onAdd={fetchItems} />}
    </div>
  );
}

function SofaIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
      <path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z" />
      <path d="M4 18v2" />
      <path d="M20 18v2" />
      <path d="M12 4v9" />
    </svg>
  );
}

function AddFurnitureModal({ onClose, onAdd }: { onClose: () => void, onAdd: () => void }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [room, setRoom] = useState('Living Room');
  const [price, setPrice] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    await fetch('/api/furniture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, url, image_url: imageUrl, notes, room, price: Number(price) || 0 })
    });
    
    onAdd();
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, data: base64data })
        });
        const data = await res.json();
        setImageUrl(data.url);
      } catch (err) {
        console.error('Upload failed', err);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-xl font-display font-bold text-slate-800">Add Furniture</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Mid-century Leather Sofa"
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400">$</span>
                </div>
                <input 
                  type="number" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Room</label>
              <select 
                value={room} 
                onChange={e => setRoom(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {ROOMS.filter(r => r !== 'All').map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Web Link (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon size={16} className="text-slate-400" />
              </div>
              <input 
                type="url" 
                value={url} 
                onChange={e => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image (Optional)</label>
            <div className="mt-1">
              {imageUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200">
                  <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover" />
                  <button 
                    type="button" 
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-slate-600 hover:text-red-500 shadow-sm"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <ImageIcon size={20} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-600">
                    {isUploading ? 'Uploading...' : 'Click to upload image'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
            <textarea 
              value={notes} 
              onChange={e => setNotes(e.target.value)}
              placeholder="Dimensions, price, thoughts..."
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            />
          </div>

          <div className="pt-2 flex space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isUploading || !title}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Furniture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

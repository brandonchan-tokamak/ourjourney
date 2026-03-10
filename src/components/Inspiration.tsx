import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Image as ImageIcon, Youtube, FileText, Trash2 } from 'lucide-react';

const ROOMS = ['All', 'Kitchen', 'Living Room', 'Master Bedroom', 'Guest Bedroom', 'Master Bath', 'Guest Bath', 'Study'];

export default function Inspiration() {
  const [items, setItems] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = () => {
    fetch(`/api/items?room=${activeRoom}`)
      .then(res => res.json())
      .then(data => setItems(data));
  };

  useEffect(() => {
    fetchItems();
  }, [activeRoom]);

  const handleDelete = async (id: number) => {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-800">Inspiration Board</h2>
          <p className="text-slate-500 mt-2">Collect ideas, videos, and notes for your renovation.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Add Idea
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

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {items.map(item => (
          <div key={item.id} className="break-inside-avoid bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group relative">
            <button 
              onClick={() => handleDelete(item.id)}
              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </button>
            
            {item.type === 'image' && (
              <div className="w-full bg-slate-50 flex items-center justify-center min-h-[120px]">
                {item.content ? (
                  <img src={item.content} alt={item.title} className="w-full h-auto" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<div class="text-slate-400 flex flex-col items-center py-8"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><span class="text-xs">Image unavailable</span></div>'; }} />
                ) : (
                  <div className="text-slate-400 flex flex-col items-center py-8">
                    <ImageIcon size={24} className="mb-2" />
                    <span className="text-xs">No image</span>
                  </div>
                )}
              </div>
            )}
            
            {item.type === 'youtube' && (
              <div className="aspect-video w-full">
                <iframe 
                  src={`https://www.youtube.com/embed/${getYouTubeID(item.content)}`} 
                  title={item.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
            {item.type === 'note' && (
              <div className="p-6 bg-blue-50/50">
                <p className="text-slate-700 whitespace-pre-wrap">{item.content}</p>
              </div>
            )}

            <div className="p-4 border-t border-slate-50">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded-md">
                  {item.room}
                </span>
              </div>
              {item.title && <h4 className="font-medium text-slate-800 mt-2">{item.title}</h4>}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
            <ImageIcon size={24} />
          </div>
          <h3 className="text-lg font-medium text-slate-800">No inspiration found</h3>
          <p className="text-slate-500 mt-1">Add some ideas to get started.</p>
        </div>
      )}

      {isModalOpen && <AddItemModal onClose={() => setIsModalOpen(false)} onAdd={fetchItems} />}
    </div>
  );
}

function getYouTubeID(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function AddItemModal({ onClose, onAdd }: { onClose: () => void, onAdd: () => void }) {
  const [type, setType] = useState<'image' | 'youtube' | 'note'>('image');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [room, setRoom] = useState('Kitchen');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && type !== 'image') return;
    
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, title, content, room })
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
        setContent(data.url);
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
          <h3 className="text-xl font-display font-bold text-slate-800">Add Inspiration</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'image', icon: ImageIcon, label: 'Image' },
                { id: 'youtube', icon: Youtube, label: 'Video' },
                { id: 'note', icon: FileText, label: 'Note' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { setType(t.id as any); setContent(''); }}
                  className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-colors ${
                    type === t.id 
                      ? 'bg-slate-900 border-slate-900 text-white' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <t.icon size={20} className="mb-1" />
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              ))}
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title (Optional)</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Dream Kitchen Island"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {type === 'image' ? 'Image' : type === 'youtube' ? 'YouTube URL' : 'Note Content'}
            </label>
            
            {type === 'image' ? (
              <div className="mt-1">
                {content ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200">
                    <img src={content} alt="Preview" className="w-full h-40 object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setContent('')}
                      className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-slate-600 hover:text-red-500 shadow-sm"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <ImageIcon size={24} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-sm font-medium text-slate-600">
                      {isUploading ? 'Uploading...' : 'Click to upload image'}
                    </p>
                  </div>
                )}
              </div>
            ) : type === 'youtube' ? (
              <input 
                type="url" 
                value={content} 
                onChange={e => setContent(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            ) : (
              <textarea 
                value={content} 
                onChange={e => setContent(e.target.value)}
                placeholder="Write your thoughts here..."
                required
                rows={4}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              />
            )}
          </div>

          <div className="pt-4 flex space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isUploading || (!content && type !== 'image')}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Idea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

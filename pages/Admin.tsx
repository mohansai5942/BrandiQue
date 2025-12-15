import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Settings, Search, X, Check, Upload, BarChart3, Heart, Layers, Image as ImageIcon, Sparkles, Filter, LogOut } from 'lucide-react';
import { usePrompts } from '../context/PromptContext';
import { useAuth } from '../context/AuthContext';
import { Prompt, CategoryType } from '../types';

// --- Local Components ---

const StatCard = ({ label, value, icon: Icon, delay, color }: any) => (
  <div 
    className="relative overflow-hidden bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 rounded-2xl p-6 group opacity-0 animate-fade-up shadow-sm dark:shadow-none transition-colors duration-300"
    style={{ animationDelay: delay }}
  >
    <div className={`absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500 ${color}`}>
        <Icon size={80} />
    </div>
    <div className="relative z-10 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/5 group-hover:scale-110 transition-transform duration-300 ${color}`}>
            <Icon size={24} className={color.replace('text-', 'text-')} />
        </div>
        <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
        </div>
    </div>
    {/* Bottom Glow */}
    <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-50 ${color.replace('text-', 'text-')}`}></div>
  </div>
);

const InputField = ({ label, name, value, onChange, type = "text", placeholder, required = false }: any) => (
  <div className="group">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-neon-purple transition-colors">{label}</label>
    {type === 'textarea' ? (
        <textarea 
            name={name} 
            value={value} 
            onChange={onChange} 
            required={required}
            rows={4} 
            className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-neon-purple focus:shadow-[0_0_15px_rgba(176,38,255,0.2)] transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-700"
            placeholder={placeholder}
        />
    ) : (
        <input 
            type={type} 
            name={name} 
            value={value} 
            onChange={onChange} 
            required={required}
            className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-neon-purple focus:shadow-[0_0_15px_rgba(176,38,255,0.2)] transition-all placeholder:text-gray-400 dark:placeholder:text-gray-700"
            placeholder={placeholder}
        />
    )}
  </div>
);

const Admin: React.FC = () => {
  const { prompts, addPrompt, updatePrompt, deletePrompt } = usePrompts();
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<Partial<Prompt> | null>(null);
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);

  // Stats
  const totalLikes = prompts.reduce((acc, curr) => acc + curr.likes, 0);
  const categoriesCount = new Set(prompts.map(p => p.category)).size;

  // Form State
  const [formData, setFormData] = useState<Partial<Prompt>>({
    title: '',
    category: 'Men',
    description: '',
    promptText: '',
    imageUrl: '',
    style: '',
  });

  const filteredPrompts = prompts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      category: 'Men',
      description: '',
      promptText: '',
      imageUrl: '',
      style: '',
    });
    setCurrentPrompt(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prompt: Prompt) => {
    setFormData(prompt);
    setCurrentPrompt(prompt);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setPromptToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPrompt && currentPrompt.id) {
      updatePrompt(currentPrompt.id, formData);
    } else {
      addPrompt(formData as Omit<Prompt, 'id' | 'likes'>);
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (promptToDelete) {
      deletePrompt(promptToDelete);
      setIsDeleteModalOpen(false);
      setPromptToDelete(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-[1600px] mx-auto w-full relative">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gray-50 dark:bg-transparent">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-neon-purple/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 opacity-0 animate-fade-up">
         <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your creative prompts and monitor performance.</p>
         </div>
         <div className="flex items-center gap-3">
             <button 
              onClick={logout}
              className="p-3 rounded-xl bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-500/50 transition-all group"
              title="Logout"
            >
               <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
             <button 
              onClick={handleOpenAdd}
              className="bg-neon-purple text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-purple-600 transition-all shadow-neon hover:shadow-neon-strong hover:-translate-y-1 font-bold group"
            >
               <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
                 <Plus size={16} /> 
               </div>
               Add New Prompt
            </button>
         </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
         <StatCard label="Total Prompts" value={prompts.length} icon={ImageIcon} delay="100ms" color="text-blue-500" />
         <StatCard label="Total Likes" value={totalLikes.toLocaleString()} icon={Heart} delay="200ms" color="text-pink-500" />
         <StatCard label="Categories" value={categoriesCount} icon={Layers} delay="300ms" color="text-yellow-500" />
         <StatCard label="Engagement" value="High" icon={BarChart3} delay="400ms" color="text-green-500" />
      </div>

      {/* Table Section */}
      <div className="glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 opacity-0 animate-fade-up delay-500 flex flex-col min-h-[600px] shadow-sm dark:shadow-none">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-[#0A0C11]/50 backdrop-blur-md sticky top-0 z-20">
           <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Filter size={16} />
              <span className="font-medium">All Prompts</span>
              <span className="bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded-full text-xs text-gray-700 dark:text-white">{filteredPrompts.length}</span>
           </div>

           <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative group w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-neon-purple transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search by title, category..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple focus:shadow-[0_0_15px_rgba(160,32,240,0.2)] transition-all duration-300"
                />
              </div>
              <button className="p-2.5 bg-white dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-white/30 transition-all">
                <Settings size={18} />
              </button>
           </div>
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-gray-100 dark:bg-[#0F1320] text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-white/5">
            <div className="col-span-4">Prompt Details</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Style</div>
            <div className="col-span-2">Performance</div>
            <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0A0C11]/30">
          {filteredPrompts.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredPrompts.map((prompt, idx) => (
                   <div 
                     key={prompt.id} 
                     className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-gray-50 dark:hover:bg-white/[0.02] group transition-colors duration-200 opacity-0 animate-fade-up"
                     style={{ animationDelay: `${idx * 50}ms` }}
                   >
                      {/* Image & Title */}
                      <div className="col-span-4 flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 group-hover:border-neon-purple/50 transition-colors">
                          <img src={prompt.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-neon-purple transition-colors line-clamp-1">{prompt.title}</h4>
                          <p className="text-xs text-gray-500 line-clamp-1">{prompt.description}</p>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="col-span-2">
                         <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                            prompt.category === 'Men' ? 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20' :
                            prompt.category === 'Women' ? 'bg-pink-500/10 text-pink-500 dark:text-pink-400 border-pink-500/20' :
                            'bg-purple-500/10 text-purple-500 dark:text-purple-400 border-purple-500/20'
                         }`}>
                            {prompt.category}
                         </span>
                      </div>

                      {/* Style */}
                      <div className="col-span-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{prompt.style || '-'}</span>
                      </div>

                      {/* Stats */}
                      <div className="col-span-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                         <Heart size={14} className="text-red-500 fill-red-500/20" />
                         <span>{prompt.likes}</span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                         <button 
                            onClick={() => handleOpenEdit(prompt)} 
                            className="p-2 rounded-lg bg-gray-100 dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-neon-purple hover:shadow-[0_0_10px_rgba(160,32,240,0.3)] transition-all"
                            title="Edit"
                         >
                            <Edit2 size={14} />
                         </button>
                         <button 
                            onClick={() => handleOpenDelete(prompt.id)} 
                            className="p-2 rounded-lg bg-gray-100 dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-500/50 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all"
                            title="Delete"
                         >
                            <Trash2 size={14} />
                         </button>
                      </div>
                   </div>
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Search size={48} className="mb-4 opacity-20" />
                <p>No prompts found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
        
        {/* Table Footer */}
        <div className="px-8 py-4 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0F1320] text-xs text-gray-500 flex justify-between items-center">
            <span>Showing {filteredPrompts.length} of {prompts.length} Prompts</span>
            <div className="flex gap-2">
                <button className="px-3 py-1 rounded bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 transition">Previous</button>
                <button className="px-3 py-1 rounded bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 transition">Next</button>
            </div>
        </div>
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/80 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-4xl rounded-[24px] border border-gray-200 dark:border-white/10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row animate-scale-in max-h-[90vh]">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/10 dark:bg-black/40 hover:bg-black/20 dark:hover:bg-white/10 rounded-full text-black dark:text-white transition-colors border border-black/5 dark:border-white/5"
            >
              <X size={20} />
            </button>
            
            {/* Left: Preview Panel */}
            <div className="w-full md:w-2/5 bg-gray-50 dark:bg-[#05070A] border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/10 p-8 flex flex-col justify-center items-center relative">
               <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent pointer-events-none"></div>
               <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest absolute top-6 left-6">Live Preview</h3>
               
               {/* Card Preview */}
               <div className="w-full max-w-[280px] bg-white dark:bg-[#0F1320] rounded-[20px] border border-gray-200 dark:border-white/10 p-3 shadow-2xl relative">
                  <div className="aspect-[4/5] bg-gray-100 dark:bg-[#0A0C11] rounded-xl mb-3 overflow-hidden relative">
                    {formData.imageUrl ? (
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                            <ImageIcon size={32} />
                            <span className="text-xs">No Image</span>
                        </div>
                    )}
                    {/* Tag Overlay */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur rounded text-[8px] font-bold uppercase text-white border border-white/10">
                        {formData.category || 'Category'}
                    </div>
                  </div>
                  <div className="space-y-2 px-1">
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-white/10 rounded animate-pulse">
                         {formData.title && <div className="bg-transparent text-gray-900 dark:text-white text-xs font-bold -mt-1">{formData.title}</div>}
                      </div>
                      <div className="h-3 w-full bg-gray-100 dark:bg-white/5 rounded animate-pulse">
                         {formData.description && <div className="bg-transparent text-gray-500 dark:text-gray-400 text-[10px] -mt-0.5 line-clamp-2">{formData.description}</div>}
                      </div>
                  </div>
               </div>
            </div>

            {/* Right: Form Panel */}
            <div className="w-full md:w-3/5 p-8 overflow-y-auto">
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                  {currentPrompt ? <Edit2 size={20} className="text-neon-purple" /> : <Plus size={20} className="text-neon-purple" />}
                  {currentPrompt ? 'Edit Prompt' : 'Create New Prompt'}
               </h2>
               <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Fill in the details below to publish your prompt.</p>

               <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                     <InputField label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Cyberpunk City" required />
                     <div className="group">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                        <select 
                            name="category" 
                            value={formData.category} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-neon-purple focus:shadow-[0_0_15px_rgba(176,38,255,0.2)] transition-all appearance-none cursor-pointer"
                        >
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Couple">Couple</option>
                        </select>
                     </div>
                  </div>

                  <InputField label="Short Description" name="description" value={formData.description} onChange={handleChange} placeholder="Brief summary of the visual..." required />
                  
                  <InputField label="Full Prompt Command" name="promptText" type="textarea" value={formData.promptText} onChange={handleChange} placeholder="The exact prompt text to be copied..." required />

                  <div className="grid grid-cols-2 gap-5">
                      <InputField label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." required />
                      <InputField label="Style Tag" name="style" value={formData.style} onChange={handleChange} placeholder="e.g. Cinematic" />
                  </div>

                  <div className="pt-6 flex justify-end gap-3 border-t border-gray-200 dark:border-white/5 mt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm font-bold">Cancel</button>
                    <button type="submit" className="px-8 py-3 rounded-xl bg-neon-purple hover:bg-purple-600 text-white transition-all text-sm font-bold shadow-lg hover:shadow-[0_0_20px_rgba(160,32,240,0.4)] flex items-center gap-2">
                        <Check size={16} /> Save Prompt
                    </button>
                  </div>
               </form>
            </div>

          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/90 dark:bg-black/90 backdrop-blur-md animate-fade-in">
           <div className="bg-white dark:bg-[#0F1320] w-full max-w-sm rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl dark:shadow-[0_0_50px_rgba(239,68,68,0.2)] p-8 text-center animate-scale-in relative overflow-hidden">
              {/* Red Glow Bg */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/10 blur-[50px] pointer-events-none"></div>
              
              <div className="w-20 h-20 bg-red-500/10 dark:bg-gradient-to-br dark:from-red-500/20 dark:to-transparent border border-red-500/20 dark:border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner relative z-10">
                 <Trash2 size={36} className="text-red-500" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">Delete Prompt?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed relative z-10">
                 Are you sure you want to remove this prompt permanently? This action cannot be undone.
              </p>
              
              <div className="flex justify-center gap-3 relative z-10">
                 <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white text-sm font-bold transition-colors">Cancel</button>
                 <button onClick={handleConfirmDelete} className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-500/30 transition-all hover:scale-105">Yes, Delete It</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
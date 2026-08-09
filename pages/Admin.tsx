import React, { useState, useEffect } from 'react';
import { Trash2, Settings, Search, X, Check, BarChart3, LogOut, MessageSquare, Mail, DollarSign, RefreshCw, Clock, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Message } from '../types';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const Admin: React.FC = () => {
  const { logout, changePassword } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messageSearchTerm, setMessageSearchTerm] = useState('');
  const [isMessageDetailOpen, setIsMessageDetailOpen] = useState(false);

  // States for custom delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // States for Password Change modal
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'messages'));
      const messagesList: Message[] = [];
      querySnapshot.forEach((doc) => {
        messagesList.push({ id: doc.id, ...doc.data() } as Message);
      });
      // Sort messages by createdAt descending
      messagesList.sort((a, b) => {
        const valA = a.createdAt || a.id;
        const valB = b.createdAt || b.id;
        return valB.localeCompare(valA);
      });
      setMessages(messagesList);
    } catch (error) {
      console.error("Error fetching messages from Firestore: ", error);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        setIsMessageDetailOpen(false);
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };

  const filteredMessages = messages.filter(msg => {
    const term = messageSearchTerm.toLowerCase();
    return (
      (msg.name || '').toLowerCase().includes(term) ||
      (msg.email || '').toLowerCase().includes(term) ||
      (msg.service || '').toLowerCase().includes(term) ||
      (msg.message || '').toLowerCase().includes(term)
    );
  });

  // Helper function to format date as DD/MM/YYYY
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '-';
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return '-';
    }
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
          <p className="text-gray-500 dark:text-gray-400">Monitor your contact submissions, lead budgets, and client inquiries.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsChangePasswordOpen(true)}
            className="p-3 rounded-xl bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-neon-purple hover:border-neon-purple/40 transition-all flex items-center gap-2 font-bold text-sm"
          >
            <Key size={18} />
            Change Password
          </button>
          <button 
            onClick={logout}
            className="p-3 rounded-xl bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-500/50 transition-all group flex items-center gap-2 font-bold text-sm"
            title="Logout"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Contact Messages Section */}
      <div className="glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 opacity-0 animate-fade-up flex flex-col min-h-[500px] shadow-sm dark:shadow-none">
        
        {/* Messages Toolbar */}
        <div className="p-6 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-[#0A0C11]/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <MessageSquare size={16} />
            <span className="font-medium">All Lead Inquiries</span>
            <span className="bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded-full text-xs text-gray-700 dark:text-white">{filteredMessages.length}</span>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-neon-purple transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search by name, email, service..." 
                value={messageSearchTerm}
                onChange={(e) => setMessageSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple focus:shadow-[0_0_15px_rgba(160,32,240,0.2)] transition-all duration-300"
              />
            </div>
            <button 
              onClick={fetchMessages}
              className="p-2.5 bg-white dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-white/30 transition-all flex items-center justify-center gap-2"
              title="Refresh Leads"
            >
              <RefreshCw size={18} className={messagesLoading ? "animate-spin text-neon-purple" : ""} />
            </button>
          </div>
        </div>

        {/* Messages Table Header */}
        <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-gray-100 dark:bg-[#0F1320] text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-white/5">
          <div className="col-span-3">User Info</div>
          <div className="col-span-3">Service Required</div>
          <div className="col-span-2">Budget</div>
          <div className="col-span-2">Submitted At</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Messages Table Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0A0C11]/30">
          {messagesLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <RefreshCw className="w-12 h-12 text-neon-purple animate-spin mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-light">Connecting to BrandiQue database and loading messages...</p>
            </div>
          ) : filteredMessages.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredMessages.map((msg, idx) => (
                <div 
                  key={msg.id} 
                  className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-gray-50 dark:hover:bg-white/[0.02] group transition-colors duration-200 opacity-0 animate-fade-up"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  {/* Name & Email */}
                  <div className="col-span-3">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-neon-purple transition-colors">{msg.name}</h4>
                    <a href={`mailto:${msg.email}`} className="text-xs text-gray-500 hover:underline">{msg.email}</a>
                  </div>

                  {/* Service Required */}
                  <div className="col-span-3">
                    <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border bg-neon-purple/10 text-neon-purple border-neon-purple/20">
                      {msg.service || 'Web Development'}
                    </span>
                  </div>

                  {/* Budget */}
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{msg.budget || 'Not specified'}</span>
                  </div>

                  {/* Submitted At */}
                  <div className="col-span-2 flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>{msg.createdAt ? formatDate(msg.createdAt) : '-'}</span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex justify-end gap-2">
                    <button 
                      onClick={() => {
                        setSelectedMessage(msg);
                        setIsMessageDetailOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-neon-purple hover:shadow-[0_0_10px_rgba(160,32,240,0.3)] transition-all"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => setDeletingId(msg.id)} 
                      className="p-2 rounded-lg bg-gray-100 dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-500/50 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all"
                      title="Delete Submission"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <MessageSquare size={48} className="mb-4 opacity-20" />
              <p>No inquiries found matching "{messageSearchTerm}"</p>
            </div>
          )}
        </div>

        {/* Messages Table Footer */}
        <div className="px-8 py-4 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0F1320] text-xs text-gray-500 flex justify-between items-center">
          <span>Showing {filteredMessages.length} of {messages.length} Submissions</span>
        </div>
      </div>

      {/* --- PASSWORD CHANGE MODAL --- */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-md rounded-[24px] border border-gray-200 dark:border-white/10 shadow-2xl p-8 relative animate-scale-in">
            <button 
              onClick={() => {
                setIsChangePasswordOpen(false);
                setOldPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                setPassError('');
                setPassSuccess('');
              }}
              className="absolute top-4 right-4 p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-black dark:text-white transition-colors"
            >
              <X size={18} />
            </button>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Key size={22} className="text-neon-purple" />
              Change Password
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Update your BrandiQue Admin credentials.</p>

            <form onSubmit={(e) => {
              e.preventDefault();
              setPassError('');
              setPassSuccess('');

              if (newPassword !== confirmNewPassword) {
                setPassError('New passwords do not match.');
                return;
              }

              const result = changePassword(oldPassword, newPassword);
              if (result.success) {
                setPassSuccess(result.message);
                setOldPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                setTimeout(() => {
                  setIsChangePasswordOpen(false);
                  setPassSuccess('');
                }, 1500);
              } else {
                setPassError(result.message);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Old Password</label>
                <input 
                  type="password" 
                  value={oldPassword} 
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmNewPassword} 
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                />
              </div>

              {passError && <p className="text-xs text-red-500 font-medium">{passError}</p>}
              {passSuccess && <p className="text-xs text-green-500 font-medium">{passSuccess}</p>}

              <button 
                type="submit"
                className="w-full py-3 mt-2 bg-neon-purple hover:bg-neon-purple/90 text-white font-bold rounded-xl shadow-lg shadow-neon-purple/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- CUSTOM DELETE CONFIRMATION MODAL --- */}
      {deletingId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Lead Submission?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Are you sure you want to delete this lead inquiry? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors text-sm font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (deletingId) {
                    await handleDeleteMessage(deletingId);
                    setDeletingId(null);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all text-sm font-bold shadow-lg shadow-red-600/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MESSAGE DETAIL MODAL --- */}
      {isMessageDetailOpen && selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/80 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-2xl rounded-[24px] border border-gray-200 dark:border-white/10 shadow-2xl relative overflow-hidden flex flex-col animate-scale-in max-h-[90vh]">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsMessageDetailOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/10 dark:bg-black/40 hover:bg-black/20 dark:hover:bg-white/10 rounded-full text-black dark:text-white transition-colors border border-black/5 dark:border-white/5"
            >
              <X size={20} />
            </button>
            
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-[#0A0C11]/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Message Detail</h2>
                  <p className="text-xs text-gray-500">Submitted on {selectedMessage.createdAt ? formatDate(selectedMessage.createdAt) : 'Unknown Date'}</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">From Name</h4>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedMessage.name}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</h4>
                  <a href={`mailto:${selectedMessage.email}`} className="text-sm font-semibold text-neon-purple hover:underline flex items-center gap-1.5">
                    <Mail size={14} />
                    {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Required Service</h4>
                  <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border bg-neon-purple/10 text-neon-purple border-neon-purple/20">
                    {selectedMessage.service}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Estimated Budget</h4>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-1.5 mt-1">
                    <DollarSign size={14} />
                    {selectedMessage.budget}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-white/5">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Detailed Message</h4>
                <div className="p-4 bg-gray-50 dark:bg-[#05070A] rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-[#0A0C11]/50 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setDeletingId(selectedMessage.id);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm font-bold flex items-center gap-1.5"
              >
                <Trash2 size={16} /> Delete Submission
              </button>
              <button 
                onClick={() => setIsMessageDetailOpen(false)} 
                className="px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors text-sm font-bold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;

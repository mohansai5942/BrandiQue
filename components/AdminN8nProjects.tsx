import React, { useState } from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { N8nWorkflowViewer } from './N8nWorkflowViewer';
import { N8nProject, N8nProjectForm } from '../types';
import { 
  Bot, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  Code2, 
  Sparkles, 
  Layers, 
  Eye, 
  X, 
  Save, 
  RefreshCw,
  Tag,
  AlertCircle,
  ExternalLink,
  CheckSquare,
  Square,
  FileText,
  RotateCcw,
  Mail,
  Phone,
  Calendar,
  User,
  MessageSquare
} from 'lucide-react';

const SAMPLE_N8N_JSON = `{
  "nodes": [
    {
      "id": "1",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "position": [100, 200]
    },
    {
      "id": "2",
      "name": "AI Agent Router",
      "type": "n8n-nodes-base.agent",
      "position": [360, 200]
    },
    {
      "id": "3",
      "name": "OpenAI Chat Model",
      "type": "n8n-nodes-base.lmChatOpenAi",
      "position": [280, 360]
    },
    {
      "id": "4",
      "name": "Buffer Memory",
      "type": "n8n-nodes-base.memoryBufferWindow",
      "position": [440, 360]
    },
    {
      "id": "5",
      "name": "Send Telegram Msg",
      "type": "n8n-nodes-base.telegram",
      "position": [640, 200]
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [[{ "node": "AI Agent Router", "type": "main", "index": 0 }]]
    },
    "AI Agent Router": {
      "main": [[{ "node": "Send Telegram Msg", "type": "main", "index": 0 }]]
    },
    "OpenAI Chat Model": {
      "ai_languageModel": [[{ "node": "AI Agent Router", "type": "ai_languageModel", "index": 0 }]]
    },
    "Buffer Memory": {
      "ai_memory": [[{ "node": "AI Agent Router", "type": "ai_memory", "index": 0 }]]
    }
  }
}`;

export function AdminN8nProjects() {
  const { 
    n8nProjects, 
    addN8nProject, 
    updateN8nProject, 
    deleteN8nProject, 
    restoreN8nProject,
    permanentlyDeleteN8nProject,
    loadingN8nProjects,
    n8nForms,
    deleteN8nFormSubmission,
    loadingN8nForms
  } = useSiteSettings();

  const [activeSubTab, setActiveSubTab] = useState<'workflows' | 'forms' | 'recycleBin'>('workflows');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<N8nProject | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [desc, setDesc] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [testWorkflowUrl, setTestWorkflowUrl] = useState('');
  const [allowClientRequest, setAllowClientRequest] = useState(true);
  const [workflowJson, setWorkflowJson] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewProject, setPreviewProject] = useState<N8nProject | null>(null);

  // Delete Confirmation Modal State
  const [deleteConfirmProject, setDeleteConfirmProject] = useState<N8nProject | null>(null);
  const [permanentDeleteConfirmProject, setPermanentDeleteConfirmProject] = useState<N8nProject | null>(null);

  const activeN8nProjects = n8nProjects.filter(p => !p.isDeleted);
  const deletedN8nProjects = n8nProjects.filter(p => p.isDeleted);
  const activeN8nForms = n8nForms.filter(f => !f.isDeleted);

  const filteredProjects = activeN8nProjects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredForms = activeN8nForms.filter(f =>
    (f.projectTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.phone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.message || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDeletedProjects = deletedN8nProjects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setTitle('');
    setCategory('AI & Automation');
    setDesc('');
    setTagsInput('n8n, Automation, AI Agent');
    setTestWorkflowUrl('');
    setAllowClientRequest(true);
    setWorkflowJson(SAMPLE_N8N_JSON);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: N8nProject) => {
    setEditingProject(project);
    setTitle(project.title);
    setCategory(project.category || 'AI & Automation');
    setDesc(project.desc);
    setTagsInput(project.tags ? project.tags.join(', ') : '');
    setTestWorkflowUrl(project.testWorkflowUrl || '');
    setAllowClientRequest(project.allowClientRequest !== false);
    setWorkflowJson(project.workflowJson);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(workflowJson);
      setWorkflowJson(JSON.stringify(parsed, null, 2));
      setFormError(null);
    } catch (e: any) {
      setFormError('Invalid JSON syntax. Unable to format.');
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        JSON.parse(text); // Verify JSON validity
        setWorkflowJson(text);
        setFormError(null);
      }
    } catch (e: any) {
      setFormError('Clipboard content is not valid JSON.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }
    if (!workflowJson.trim()) {
      setFormError('Workflow JSON code is required');
      return;
    }

    try {
      JSON.parse(workflowJson);
    } catch (e: any) {
      setFormError('Invalid n8n JSON syntax: ' + e.message);
      return;
    }

    const tagsArr = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    let formattedTestUrl = testWorkflowUrl.trim();
    if (formattedTestUrl && !/^https?:\/\//i.test(formattedTestUrl)) {
      formattedTestUrl = 'https://' + formattedTestUrl;
    }

    if (editingProject) {
      await updateN8nProject(editingProject.id, {
        title: title.trim(),
        category: category.trim(),
        desc: desc.trim(),
        tags: tagsArr,
        testWorkflowUrl: formattedTestUrl,
        allowClientRequest,
        workflowJson: workflowJson.trim()
      });
    } else {
      await addN8nProject({
        title: title.trim(),
        category: category.trim() || 'AI & Automation',
        desc: desc.trim(),
        tags: tagsArr,
        testWorkflowUrl: formattedTestUrl,
        allowClientRequest,
        workflowJson: workflowJson.trim(),
        createdAt: new Date().toISOString()
      });
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmProject) return;
    await deleteN8nProject(deleteConfirmProject.id);
    setDeleteConfirmProject(null);
  };

  const handleConfirmPermanentDelete = async () => {
    if (!permanentDeleteConfirmProject) return;
    await permanentlyDeleteN8nProject(permanentDeleteConfirmProject.id);
    setPermanentDeleteConfirmProject(null);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tab Bar */}
      <div className="bg-white dark:bg-[#0F1320] p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
              <Bot size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                n8n Projects & Automation Workflows
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Manage visual workflows, client inquiry submissions, and test links
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-[#161B2E] border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            <button
              onClick={handleOpenAddModal}
              className="shrink-0 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus size={16} />
              Add n8n Project
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/5 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('workflows')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'workflows'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-gray-100 dark:bg-[#161B2E] text-gray-600 dark:text-gray-400 hover:text-white'
            }`}
          >
            <Bot size={14} />
            Workflows ({activeN8nProjects.length})
          </button>

          <button
            onClick={() => setActiveSubTab('forms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'forms'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-gray-100 dark:bg-[#161B2E] text-gray-600 dark:text-gray-400 hover:text-white'
            }`}
          >
            <FileText size={14} />
            n8n Projects Forms ({activeN8nForms.length})
            {activeN8nForms.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-white text-orange-600 rounded-full font-extrabold">
                {activeN8nForms.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('recycleBin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'recycleBin'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-gray-100 dark:bg-[#161B2E] text-gray-600 dark:text-gray-400 hover:text-white'
            }`}
          >
            <Trash2 size={14} />
            Recycle Bin ({deletedN8nProjects.length})
          </button>
        </div>
      </div>

      {/* TAB 1: WORKFLOWS GRID */}
      {activeSubTab === 'workflows' && (
        loadingN8nProjects ? (
          <div className="flex items-center justify-center p-12 text-gray-400 text-sm gap-2">
            <RefreshCw className="animate-spin w-5 h-5 text-orange-500" />
            <span>Loading n8n projects...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white dark:bg-[#0F1320] rounded-2xl border border-gray-200 dark:border-white/10 p-12 text-center">
            <Bot className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              No n8n Workflows Found
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-4">
              {searchQuery ? 'No n8n workflows match your search query.' : 'Click "Add n8n Project" to publish your first n8n workflow canvas project.'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl shadow-md hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
              >
                <Plus size={14} />
                Add First n8n Workflow
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => {
              let nodeCount = project.nodeCount || 0;
              try {
                if (!nodeCount && project.workflowJson) {
                  const parsed = JSON.parse(project.workflowJson);
                  nodeCount = (parsed.nodes || []).length;
                }
              } catch (e) {}

              return (
                <div 
                  key={project.id}
                  className="bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Mini Canvas Preview */}
                  <div className="h-44 bg-[#17181c] relative overflow-hidden border-b border-gray-200 dark:border-white/10">
                    <N8nWorkflowViewer workflowJson={project.workflowJson} height="100%" showControls={false} fitPadding={0.18} />
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 bg-[#1f2024]/90 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-orange-400 flex items-center gap-1 shadow-md">
                        <Layers size={11} />
                        {nodeCount} Nodes
                      </span>
                    </div>

                    {project.testWorkflowUrl && (
                      <div className="absolute top-3 left-3 z-20">
                        <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold rounded-md flex items-center gap-1">
                          <ExternalLink size={10} />
                          Test Link Ready
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md">
                          {project.category || 'n8n Workflow'}
                        </span>
                        {project.allowClientRequest !== false && (
                          <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckSquare size={10} /> Client Form On
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-orange-500 transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {project.desc || 'Interactive n8n visual automation workflow project.'}
                      </p>

                      {/* Test link info */}
                      {project.testWorkflowUrl && (
                        <div className="mt-2 text-[11px] text-gray-400 truncate flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1.5 rounded-lg">
                          <ExternalLink size={11} className="text-orange-400 shrink-0" />
                          <span className="truncate">{project.testWorkflowUrl}</span>
                        </div>
                      )}

                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {project.tags.slice(0, 4).map((tag, idx) => (
                            <span 
                              key={idx}
                              className="text-[10px] bg-gray-100 dark:bg-[#161B2E] text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md flex items-center gap-1"
                            >
                              <Tag size={9} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 dark:border-white/5 gap-2">
                      <button
                        onClick={() => setPreviewProject(project)}
                        className="text-xs text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <Eye size={14} />
                        Full Preview
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyText(project.workflowJson, project.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                          title="Copy n8n JSON"
                        >
                          {copiedId === project.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(project)}
                          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors"
                          title="Edit Workflow"
                        >
                          <Edit3 size={14} />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmProject(project)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Workflow"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* TAB 2: N8N PROJECTS FORMS (SUBMISSIONS) */}
      {activeSubTab === 'forms' && (
        loadingN8nForms ? (
          <div className="flex items-center justify-center p-12 text-gray-400 text-sm gap-2">
            <RefreshCw className="animate-spin w-5 h-5 text-orange-500" />
            <span>Loading form submissions...</span>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="bg-white dark:bg-[#0F1320] rounded-2xl border border-gray-200 dark:border-white/10 p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              No Client Inquiries Found
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              {searchQuery ? 'No form submissions match your search.' : 'When clients click "Want this for your business?" on an n8n project on the website, their submissions will appear here.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredForms.map(formItem => (
              <div
                key={formItem.id}
                className="bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100 dark:border-white/5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500 dark:text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-md">
                        Project: {formItem.projectTitle || 'n8n Workflow'}
                      </span>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mt-2 flex items-center gap-2">
                        <User size={16} className="text-orange-400 shrink-0" />
                        {formItem.name}
                      </h4>
                    </div>

                    <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(formItem.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Mandatory Details: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Mail size={14} className="text-orange-400 shrink-0" />
                        <div className="overflow-hidden">
                          <p className="text-[9px] uppercase font-bold text-gray-400">Email Address *</p>
                          <a href={`mailto:${formItem.email}`} className="text-xs font-semibold text-gray-900 dark:text-white hover:text-orange-400 truncate block">
                            {formItem.email}
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyText(formItem.email, `email-${formItem.id}`)}
                        className="p-1 text-gray-400 hover:text-white"
                        title="Copy Email"
                      >
                        {copiedId === `email-${formItem.id}` ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    </div>

                    <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Phone size={14} className="text-emerald-400 shrink-0" />
                        <div className="overflow-hidden">
                          <p className="text-[9px] uppercase font-bold text-gray-400">Phone Number *</p>
                          <a href={`tel:${formItem.phone}`} className="text-xs font-semibold text-gray-900 dark:text-white hover:text-emerald-400 truncate block">
                            {formItem.phone}
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyText(formItem.phone, `phone-${formItem.id}`)}
                        className="p-1 text-gray-400 hover:text-white"
                        title="Copy Phone"
                      >
                        {copiedId === `phone-${formItem.id}` ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  {/* Message */}
                  {formItem.message && (
                    <div className="bg-gray-50 dark:bg-white/[0.03] p-3 rounded-xl border border-gray-100 dark:border-white/5">
                      <p className="text-[9px] uppercase font-bold text-gray-400 flex items-center gap-1 mb-1">
                        <MessageSquare size={11} /> Client Requirements / Notes
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
                        "{formItem.message}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-end pt-4 mt-4 border-t border-gray-100 dark:border-white/5">
                  <button
                    onClick={() => deleteN8nFormSubmission(formItem.id)}
                    className="text-xs text-red-500 hover:text-red-400 font-medium flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 size={13} />
                    Delete Submission
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* TAB 3: RECYCLE BIN */}
      {activeSubTab === 'recycleBin' && (
        filteredDeletedProjects.length === 0 ? (
          <div className="bg-white dark:bg-[#0F1320] rounded-2xl border border-gray-200 dark:border-white/10 p-12 text-center">
            <Trash2 className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              n8n Projects Recycle Bin Empty
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Deleted n8n projects will be safely stored here before permanent removal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeletedProjects.map(project => (
              <div 
                key={project.id}
                className="bg-white dark:bg-[#0F1320] border border-red-500/20 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md">
                      Deleted Workflow
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      {project.deletedAt ? new Date(project.deletedAt).toLocaleDateString() : ''}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {project.title}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {project.desc || 'n8n workflow project'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 dark:border-white/5 gap-2">
                  <button
                    onClick={() => restoreN8nProject(project.id)}
                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw size={13} />
                    Restore Workflow
                  </button>

                  <button
                    onClick={() => setPermanentDeleteConfirmProject(project)}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 size={13} />
                    Delete Forever
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* CONFIRMATION MODAL ON SOFT DELETE */}
      {deleteConfirmProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#13151b] border border-red-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete n8n Project?</h3>
                <p className="text-xs text-gray-400">Are you sure you want to proceed?</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed bg-white/5 p-3 rounded-xl">
              Project <strong className="text-white">"{deleteConfirmProject.title}"</strong> will be moved to the n8n Recycle Bin. You can restore it anytime.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmProject(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all"
              >
                <Trash2 size={14} />
                Move to Recycle Bin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL ON PERMANENT DELETE */}
      {permanentDeleteConfirmProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#13151b] border border-red-600/50 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Permanently Delete Workflow?</h3>
                <p className="text-xs text-red-400">Warning: This action cannot be undone!</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed bg-red-950/20 border border-red-800/30 p-3 rounded-xl">
              Are you sure you want to permanently delete <strong className="text-white">"{permanentDeleteConfirmProject.title}"</strong> from the database? It will be erased forever.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPermanentDeleteConfirmProject(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPermanentDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all"
              >
                <Trash2 size={14} />
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL with Live Split Canvas Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-[#13151b] border border-white/10 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#191b22]">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">
                  {editingProject ? 'Edit n8n Project Workflow' : 'Add New n8n Project Workflow'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Split View */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 p-6 gap-6">
              {/* Form Input Side */}
              <form onSubmit={handleSave} className="space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                      Workflow Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g., Telegram AI Customer Bot Agent"
                      className="w-full px-3.5 py-2.5 bg-[#1a1c24] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                        Category
                      </label>
                      <input
                        type="text"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        placeholder="e.g., AI Agents, Automation, CRM"
                        className="w-full px-3.5 py-2.5 bg-[#1a1c24] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={tagsInput}
                        onChange={e => setTagsInput(e.target.value)}
                        placeholder="n8n, Telegram, AI Agent, Webhook"
                        className="w-full px-3.5 py-2.5 bg-[#1a1c24] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      />
                    </div>
                  </div>

                  {/* Test n8n Workflow URL / Webhook Link */}
                  <div>
                    <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <ExternalLink size={13} />
                      Test n8n Workflow Link
                    </label>
                    <input
                      type="url"
                      value={testWorkflowUrl}
                      onChange={e => setTestWorkflowUrl(e.target.value)}
                      placeholder="e.g. https://n8n.yourdomain.com/webhook-test/..."
                      className="w-full px-3.5 py-2.5 bg-[#1a1c24] border border-orange-500/30 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      Adds a "Test Workflow" button on the website workflow modal so visitors can test this workflow.
                    </p>
                  </div>

                  {/* Checkbox: Enable Client Inquiry Form */}
                  <div className="bg-[#1a1c24] p-3 rounded-xl border border-white/10 flex items-center justify-between cursor-pointer" onClick={() => setAllowClientRequest(!allowClientRequest)}>
                    <div className="flex items-center gap-2">
                      <button type="button" className="text-orange-400">
                        {allowClientRequest ? <CheckSquare size={18} /> : <Square size={18} className="text-gray-500" />}
                      </button>
                      <div>
                        <p className="text-xs font-bold text-white">Enable Client Inquiry Form</p>
                        <p className="text-[10px] text-gray-400">Allows website visitors to request custom setup for this workflow (phone & email mandatory).</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={desc}
                      onChange={e => setDesc(e.target.value)}
                      placeholder="Brief summary of what this n8n workflow automates..."
                      className="w-full px-3.5 py-2.5 bg-[#1a1c24] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
                    />
                  </div>

                  {/* n8n JSON Code Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Code2 size={14} className="text-orange-400" />
                        n8n Workflow JSON Code *
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handlePasteClipboard}
                          className="text-[10px] text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md transition-colors"
                        >
                          Paste Clipboard
                        </button>
                        <button
                          type="button"
                          onClick={handleFormatJson}
                          className="text-[10px] text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 px-2.5 py-1 rounded-md transition-colors"
                        >
                          Format JSON
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={8}
                      value={workflowJson}
                      onChange={e => setWorkflowJson(e.target.value)}
                      placeholder="Paste your n8n export JSON code here..."
                      className="w-full px-3.5 py-2.5 bg-[#161820] border border-white/10 rounded-xl text-[11px] font-mono text-emerald-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      required
                    />
                  </div>

                  {formError && (
                    <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{formError}</span>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-700 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Save size={15} />
                    {editingProject ? 'Save Changes' : 'Publish n8n Project'}
                  </button>
                </div>
              </form>

              {/* Side Live Canvas Preview */}
              <div className="flex flex-col h-full bg-[#17181c] rounded-xl border border-white/10 p-3 min-h-[380px]">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 px-2">
                  <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-orange-400" />
                    Live Canvas Preview
                  </span>
                  <span className="text-[10px] text-orange-400 font-medium">
                    Drag nodes to adjust positions
                  </span>
                </div>

                <div className="flex-1 w-full relative min-h-[320px]">
                  <N8nWorkflowViewer 
                    workflowJson={workflowJson} 
                    onWorkflowJsonChange={(newJson) => setWorkflowJson(newJson)}
                    height="100%" 
                    showControls={true}
                    readOnly={false}
                    fitPadding={0.15}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL PREVIEW MODAL */}
      {previewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#13151b] border border-white/10 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#191b22]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md">
                  {previewProject.category || 'n8n Workflow'}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {previewProject.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {previewProject.testWorkflowUrl && (
                  <a
                    href={previewProject.testWorkflowUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-md shadow-orange-500/20"
                  >
                    <ExternalLink size={13} />
                    Test Workflow
                  </a>
                )}
                <button
                  onClick={() => handleCopyText(previewProject.workflowJson, 'preview')}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copiedId === 'preview' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  Copy JSON
                </button>
                <button
                  onClick={() => setPreviewProject(null)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 relative w-full h-full bg-[#17181c]">
              <N8nWorkflowViewer workflowJson={previewProject.workflowJson} height="100%" showControls={true} fitPadding={0.15} />
            </div>

            {previewProject.desc && (
              <div className="p-4 bg-[#191b22] border-t border-white/10 text-xs text-gray-300">
                <p>{previewProject.desc}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

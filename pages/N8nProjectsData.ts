import { N8nProject } from '../types';

export const INITIAL_N8N_PROJECTS: N8nProject[] = [
  {
    id: 'n8n-quotation-generator',
    title: 'Quotation Generator from Sheets',
    category: 'Document & Sales Automation',
    desc: 'Automated quotation generation engine triggered by Google Sheets entries. Generates customized PDF quotes, attaches branding elements, and emails clients instantly.',
    tags: ['n8n', 'Google Sheets', 'PDF Generator', 'Gmail', 'Sales'],
    nodeCount: 5,
    isDeleted: false,
    createdAt: '2026-09-10T00:00:00.000Z',
    workflowJson: JSON.stringify({
      nodes: [
        { id: '1', name: 'Google Sheets Trigger', type: 'n8n-nodes-base.googleSheetsTrigger', position: [100, 200] },
        { id: '2', name: 'Format Client Quote Data', type: 'n8n-nodes-base.code', position: [320, 200] },
        { id: '3', name: 'Generate Branded PDF', type: 'n8n-nodes-base.htmlToPdf', position: [540, 200] },
        { id: '4', name: 'Save to Google Drive', type: 'n8n-nodes-base.googleDrive', position: [760, 160] },
        { id: '5', name: 'Email Quote to Client', type: 'n8n-nodes-base.gmail', position: [760, 280] }
      ],
      connections: {
        'Google Sheets Trigger': { main: [[{ node: 'Format Client Quote Data', type: 'main', index: 0 }]] },
        'Format Client Quote Data': { main: [[{ node: 'Generate Branded PDF', type: 'main', index: 0 }]] },
        'Generate Branded PDF': { main: [
          [{ node: 'Save to Google Drive', type: 'main', index: 0 }],
          [{ node: 'Email Quote to Client', type: 'main', index: 0 }]
        ] }
      }
    }, null, 2)
  },
  {
    id: 'n8n-instagram-posting',
    title: 'Automatic Instagram Posting',
    category: 'Social Media Automation',
    desc: '24/7 automated Instagram content publisher. Fetches scheduled media from Google Drive or Airtable, formats captions with AI hashtags, and posts directly via Instagram Graph API.',
    tags: ['n8n', 'Instagram API', 'AI Caption', 'Google Drive', 'Social Media'],
    nodeCount: 5,
    isDeleted: false,
    createdAt: '2026-09-09T00:00:00.000Z',
    workflowJson: JSON.stringify({
      nodes: [
        { id: '1', name: 'Schedule Content Trigger', type: 'n8n-nodes-base.cronTrigger', position: [100, 200] },
        { id: '2', name: 'Fetch Scheduled Media', type: 'n8n-nodes-base.airtable', position: [320, 200] },
        { id: '3', name: 'Generate AI Hashtags & Caption', type: 'n8n-nodes-base.openAi', position: [540, 200] },
        { id: '4', name: 'Publish to Instagram Business', type: 'n8n-nodes-base.instagram', position: [760, 200] },
        { id: '5', name: 'Log Published Status', type: 'n8n-nodes-base.googleSheets', position: [980, 200] }
      ],
      connections: {
        'Schedule Content Trigger': { main: [[{ node: 'Fetch Scheduled Media', type: 'main', index: 0 }]] },
        'Fetch Scheduled Media': { main: [[{ node: 'Generate AI Hashtags & Caption', type: 'main', index: 0 }]] },
        'Generate AI Hashtags & Caption': { main: [[{ node: 'Publish to Instagram Business', type: 'main', index: 0 }]] },
        'Publish to Instagram Business': { main: [[{ node: 'Log Published Status', type: 'main', index: 0 }]] }
      }
    }, null, 2)
  },
  {
    id: 'n8n-demo-1',
    title: 'Telegram AI Customer Assistant Agent',
    category: 'AI Agents & Automation',
    desc: 'Automated Telegram Bot powered by OpenAI Chat Model and vector memory for instant customer inquiry routing and FAQ replies.',
    tags: ['n8n', 'Telegram', 'AI Agent', 'OpenAI', 'Memory'],
    nodeCount: 6,
    isDeleted: false,
    createdAt: '2026-09-01T00:00:00.000Z',
    workflowJson: JSON.stringify({
      nodes: [
        { id: '1', name: 'Telegram Trigger', type: 'n8n-nodes-base.telegramTrigger', position: [100, 200] },
        { id: '2', name: 'AI Agent Router', type: 'n8n-nodes-base.agent', position: [380, 200] },
        { id: '3', name: 'OpenAI GPT-4o Model', type: 'n8n-nodes-base.lmChatOpenAi', position: [300, 360] },
        { id: '4', name: 'Window Buffer Memory', type: 'n8n-nodes-base.memoryBufferWindow', position: [460, 360] },
        { id: '5', name: 'Database Lookup Tool', type: 'n8n-nodes-base.toolAirtable', position: [600, 360] },
        { id: '6', name: 'Telegram Reply', type: 'n8n-nodes-base.telegram', position: [680, 200] }
      ],
      connections: {
        'Telegram Trigger': { main: [[{ node: 'AI Agent Router', type: 'main', index: 0 }]] },
        'AI Agent Router': { main: [[{ node: 'Telegram Reply', type: 'main', index: 0 }]] },
        'OpenAI GPT-4o Model': { ai_languageModel: [[{ node: 'AI Agent Router', type: 'ai_languageModel', index: 0 }]] },
        'Window Buffer Memory': { ai_memory: [[{ node: 'AI Agent Router', type: 'ai_memory', index: 0 }]] },
        'Database Lookup Tool': { ai_tool: [[{ node: 'AI Agent Router', type: 'ai_tool', index: 0 }]] }
      }
    }, null, 2)
  },
  {
    id: 'n8n-demo-2',
    title: 'Lead Generation Webhook & CRM Sync',
    category: 'Lead Automation',
    desc: 'Capture inbound lead webhooks, enrich profile data, filter qualified leads, and sync directly to CRM and team notifications.',
    tags: ['Webhook', 'CRM', 'Lead Gen', 'HTTP Request', 'Filter'],
    nodeCount: 5,
    isDeleted: false,
    createdAt: '2026-09-02T00:00:00.000Z',
    workflowJson: JSON.stringify({
      nodes: [
        { id: 'node-1', name: 'Inbound Lead Webhook', type: 'n8n-nodes-base.webhook', position: [100, 220] },
        { id: 'node-2', name: 'Clean Lead Data', type: 'n8n-nodes-base.code', position: [320, 220] },
        { id: 'node-3', name: 'Filter Qualified Budget', type: 'n8n-nodes-base.filter', position: [540, 220] },
        { id: 'node-4', name: 'Enrich via HTTP API', type: 'n8n-nodes-base.httpRequest', position: [760, 160] },
        { id: 'node-5', name: 'Sync to Database CRM', type: 'n8n-nodes-base.airtable', position: [980, 160] }
      ],
      connections: {
        'Inbound Lead Webhook': { main: [[{ node: 'Clean Lead Data', type: 'main', index: 0 }]] },
        'Clean Lead Data': { main: [[{ node: 'Filter Qualified Budget', type: 'main', index: 0 }]] },
        'Filter Qualified Budget': { main: [[{ node: 'Enrich via HTTP API', type: 'main', index: 0 }]] },
        'Enrich via HTTP API': { main: [[{ node: 'Sync to Database CRM', type: 'main', index: 0 }]] }
      }
    }, null, 2)
  }
];

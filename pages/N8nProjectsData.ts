import { N8nProject } from '../types';

export const INITIAL_N8N_PROJECTS: N8nProject[] = [
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
        {
          id: '1',
          name: 'Telegram Trigger',
          type: 'n8n-nodes-base.telegramTrigger',
          position: [100, 200]
        },
        {
          id: '2',
          name: 'AI Agent Router',
          type: 'n8n-nodes-base.agent',
          position: [380, 200]
        },
        {
          id: '3',
          name: 'OpenAI GPT-4o Model',
          type: 'n8n-nodes-base.lmChatOpenAi',
          position: [300, 360]
        },
        {
          id: '4',
          name: 'Window Buffer Memory',
          type: 'n8n-nodes-base.memoryBufferWindow',
          position: [460, 360]
        },
        {
          id: '5',
          name: 'Database Lookup Tool',
          type: 'n8n-nodes-base.toolAirtable',
          position: [600, 360]
        },
        {
          id: '6',
          name: 'Telegram Reply',
          type: 'n8n-nodes-base.telegram',
          position: [680, 200]
        }
      ],
      connections: {
        'Telegram Trigger': {
          main: [
            [{ node: 'AI Agent Router', type: 'main', index: 0 }]
          ]
        },
        'AI Agent Router': {
          main: [
            [{ node: 'Telegram Reply', type: 'main', index: 0 }]
          ]
        },
        'OpenAI GPT-4o Model': {
          ai_languageModel: [
            [{ node: 'AI Agent Router', type: 'ai_languageModel', index: 0 }]
          ]
        },
        'Window Buffer Memory': {
          ai_memory: [
            [{ node: 'AI Agent Router', type: 'ai_memory', index: 0 }]
          ]
        },
        'Database Lookup Tool': {
          ai_tool: [
            [{ node: 'AI Agent Router', type: 'ai_tool', index: 0 }]
          ]
        }
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
        {
          id: 'node-1',
          name: 'Inbound Lead Webhook',
          type: 'n8n-nodes-base.webhook',
          position: [100, 220]
        },
        {
          id: 'node-2',
          name: 'Clean Lead Data',
          type: 'n8n-nodes-base.code',
          position: [320, 220]
        },
        {
          id: 'node-3',
          name: 'Filter Qualified Budget',
          type: 'n8n-nodes-base.filter',
          position: [540, 220]
        },
        {
          id: 'node-4',
          name: 'Enrich via HTTP API',
          type: 'n8n-nodes-base.httpRequest',
          position: [760, 160]
        },
        {
          id: 'node-5',
          name: 'Sync to Database CRM',
          type: 'n8n-nodes-base.airtable',
          position: [980, 160]
        }
      ],
      connections: {
        'Inbound Lead Webhook': {
          main: [[{ node: 'Clean Lead Data', type: 'main', index: 0 }]]
        },
        'Clean Lead Data': {
          main: [[{ node: 'Filter Qualified Budget', type: 'main', index: 0 }]]
        },
        'Filter Qualified Budget': {
          main: [[{ node: 'Enrich via HTTP API', type: 'main', index: 0 }]]
        },
        'Enrich via HTTP API': {
          main: [[{ node: 'Sync to Database CRM', type: 'main', index: 0 }]]
        }
      }
    }, null, 2)
  }
];

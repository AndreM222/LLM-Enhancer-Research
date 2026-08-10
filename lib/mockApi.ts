import { Role } from '@/components/tables/roles-columns';
import { User } from '@/components/tables/users-columns';
import { Layout } from '@/components/tables/layouts-columns';
import { DetectionSession } from '@/components/tables/detection-columns';
import { Log } from '@/components/tables/logs-columns';
import { Project } from '@/components/project-cards';
import { TagGroupDetail } from '@/app/settings/tags/[tagGroup]/page';
import { TagGroup } from '@/components/tables/tags-columns';
import { ServerActivity } from '@/components/tables/global-columns';
import { SingleSetting } from '@/components/tables/settings-columns';

export type Invoice = {
  id: string;
  date: string;
  amount: string;
  status: string;
};

export type UsageItem = {
  label: string;
  value: number;
  limit: number;
  tone: string;
};

export type Prompt = {
  id: string;
  name: string;
  accuracy: string;
  status: string;
  updated: string;
  description: string;
};

export type MarketplaceTemplate = {
  id: string;
  slug: string;
  name: string;
  creator: string;
  description: string;
  mode: string;
  baseModel: string;
  tags: string[];
  rules: number;
  rating: number;
  users: string;
  updated: string;
  featured?: boolean;
  previewImages?: string[];
};

export type SharedModel = {
  name: string;
  slug: string;
  creator: string;
  description: string;
  mode: string;
  baseModel: string;
  rules: number;
  users: string;
  rating: number;
  updated: string;
  version: string;
  tags: string[];
  previewImages: string[];
};

export type SessionDetection = {
  id: string;
  index: number;
  label: string;
  confidence: number;
  box: { x: number; y: number; w: number; h: number };
};

export type SessionImage = {
  id: string;
  title: string;
  src: string;
  detections: SessionDetection[];
};

export type Workspace = {
  name: string;
  logo: string;
  plan: string;
};

export function notificationAllOptions(): SingleSetting[] {
  return [
    {
      id: 'channel-email',
      name: 'Email',
      icon: 'Mail',
      description: 'Notifications sent to your registered email address.',
      type: 'switch',
      value: true,
    },
    {
      id: 'channel-push',
      name: 'Push notifications',
      icon: 'Smartphone',
      description: 'In-app and browser push notifications.',
      type: 'switch',
      value: true,
    },
    {
      id: 'channel-sms',
      name: 'SMS',
      icon: 'MessageSquare',
      description: 'Text messages for critical alerts only.',
      type: 'switch',
      value: false,
    },
  ];
}

const notificationChannels = [
  {
    label: 'Email',
    value: 'email',
    icon: 'Mail',
  },
  {
    label: 'Push',
    value: 'push',
    icon: 'Smartphone',
  },
  {
    label: 'SMS',
    value: 'sms',
    icon: 'MessageSquare',
  },
];

export function notificationSettingsOptions(): SingleSetting[] {
  return [
    {
      id: 'event-mentions',
      name: 'Mentions',
      description: 'When someone mentions you in a comment or note.',
      type: 'toggleGroup',
      value: {
        email: true,
        push: true,
        sms: false,
      },
      options: notificationChannels,
    },
    {
      id: 'event-comments',
      name: 'Comments on your items',
      description: 'When someone comments on an item you follow or own.',
      type: 'toggleGroup',
      value: {
        email: true,
        push: true,
        sms: false,
      },
      options: notificationChannels,
    },
    {
      id: 'event-assignments',
      name: 'Assignments',
      description: 'When you are assigned to a new item or task.',
      type: 'toggleGroup',
      value: {
        email: true,
        push: true,
        sms: false,
      },
      options: notificationChannels,
    },
    {
      id: 'event-due-dates',
      name: 'Due date reminders',
      description: 'Reminders for upcoming or overdue due dates.',
      type: 'toggleGroup',
      value: {
        email: true,
        push: true,
        sms: false,
      },
      options: notificationChannels,
    },
    {
      id: 'event-product-updates',
      name: 'Product updates & announcements',
      description: 'News about new features, improvements, and changes.',
      type: 'toggleGroup',
      value: {
        email: true,
        push: true,
        sms: false,
      },
      options: notificationChannels.map((channel) => ({
        ...channel,
        disabled: channel.value === 'sms',
      })),
    },
  ];
}

export function roleSettingsOptions(): SingleSetting[] {
  return [
    {
      id: '123',
      name: 'Manage users',
      description: 'Allow this role to manage users.',
      type: 'switch',
      value: true,
    },
    {
      id: '512412',
      name: 'Edit prompts',
      description: 'Allow this role to edit prompts.',
      type: 'switch',
      value: true,
    },
    {
      id: '66031',
      name: 'Review corrections',
      description: 'Allow this role to review corrections.',
      type: 'switch',
      value: true,
    },
    {
      id: '002834',
      name: 'View analytics',
      description: 'Allow this role to view analytics.',
      type: 'switch',
      value: true,
    },
    {
      id: '8989298278',
      name: 'Export data',
      description: 'Allow this role to export data.',
      type: 'switch',
      value: true,
    },
    {
      id: '0-340-345890',
      name: 'Export data',
      description: 'Allow this role to change settings.',
      type: 'switch',
      value: true,
    },
  ];
}

export function getModelOptions() {
  return [
    'YOLOv8',
    'YOLOv11',
    'YOLO-World',
    'RF-DETR',
    'Gemini 2.5 Flash',
    'Gemini 2.5 Pro',
    'AWS Rekognition',
    'Clarifai',
    'Ground Truth (manual)',
  ];
}

export function getGlobalActivity() {
  return {
    summary: [
      { label: 'Requests', value: '4k', delta: '541.89%', trend: [2, 4, 12, 5, 3, 4, 3] },
      { label: 'Bandwidth', value: '10.66 MB', delta: '681.34%', trend: [1, 3, 9, 4, 2, 3, 2] },
      { label: 'Sessions', value: '0', trend: [0, 0, 0, 0, 0, 0, 0] },
      { label: 'Detections', value: '0', trend: [0, 0, 0, 0, 0, 0, 0] },
    ],
    countries: [
      { name: 'France', requests: 2950, bandwidth: '8.22 MB', countryCode: 'FR' },
      { name: 'Singapore', requests: 521, bandwidth: '1.22 MB', countryCode: 'SG' },
      {
        name: 'United States of America',
        requests: 189,
        bandwidth: '372.07 kB',
        countryCode: 'US',
      },
      { name: 'Netherlands', requests: 125, bandwidth: '242.9 kB', countryCode: 'NL' },
      { name: 'United Kingdom', requests: 74, bandwidth: '171.18 kB', countryCode: 'GB' },
      { name: 'India', requests: 32, bandwidth: '77.64 kB', countryCode: 'IN' },
      { name: 'Germany', requests: 23, bandwidth: '53.87 kB', countryCode: 'DE' },
      { name: 'Taiwan', requests: 18, bandwidth: '90.21 kB', countryCode: 'TW' },
      { name: 'Turkey', requests: 16, bandwidth: '38.88 kB', countryCode: 'TR' },
      { name: 'Canada', requests: 13, bandwidth: '26.44 kB', countryCode: 'CA' },
    ],
  };
}

export function getServerActivity(): ServerActivity[] {
  return [
    {
      id: 'us-east-1',
      countryCode: 'US',
      region: 'United States East',
      status: 'healthy' as const,
      requests: 3891,
      dataTransferred: '9.4 MB',
      avgResponseMs: 142,
      lat: 39.0,
      lon: -77.5,
    },
  ];
}

export const getInvoices = (): Invoice[] => [
  { id: 'inv_001', date: 'Jul 2, 2026', amount: '$59.00', status: 'Paid' },
  { id: 'inv_002', date: 'Jun 2, 2026', amount: '$59.00', status: 'Paid' },
  { id: 'inv_003', date: 'May 2, 2026', amount: '$59.00', status: 'Paid' },
  { id: 'inv_004', date: 'Apr 2, 2026', amount: '$59.00', status: 'Paid' },
];

export const getPlanUsage = (): UsageItem[] => [
  { label: 'Models', value: 7, limit: 10, tone: 'bg-blue-500' },
  { label: 'Templates', value: 18, limit: 25, tone: 'bg-violet-500' },
  { label: 'Seats', value: 6, limit: 8, tone: 'bg-emerald-500' },
];

export const getPrompts = (): Prompt[] => [
  {
    id: 'p-001',
    name: 'Car damage detector v4',
    accuracy: '92%',
    status: 'best',
    updated: '2 hours ago',
    description: 'Improved front-bumper and fender detection with fewer false positives.',
  },
  {
    id: 'p-002',
    name: 'Car damage detector v3',
    accuracy: '88%',
    status: 'previous',
    updated: '1 day ago',
    description: 'Good baseline, but misses small scratches on dark cars.',
  },
];

export const getRoles = (): Role[] => [
  {
    id: '124123',
    name: 'Admin',
    description: 'Full access to the workspace.',
    isDefault: false,
    permissions: ['Manage users', 'Edit prompts', 'View analytics', 'Change settings'],
  },
  {
    id: '124124',
    name: 'Editor',
    description: 'Can edit prompts and review corrections.',
    isDefault: true,
    permissions: ['Edit prompts', 'Review corrections', 'View analytics'],
  },
  {
    id: '124125',
    name: 'Viewer',
    description: 'Read-only access to reports and dashboards.',
    isDefault: false,
    permissions: ['View analytics'],
  },
];

export const getUsers = (): User[] => [
  {
    id: '728ed52f',
    name: 'David',
    role: getRoles()[0].name,
    status: 'SENT',
    time: '2026-07-07T18:00:00.000Z',
    username: 'David123',
    email: 'david@gmail.com',
    avatar: '',
  },
  {
    id: '731ed57f',
    name: 'Stephanie',
    role: getRoles()[1].name,
    status: 'REJECTED',
    time: '2026-07-07T17:30:00.000Z',
    username: 'Stephanie-Flower',
    email: 'flower@gmail.com',
    avatar: '',
  },
  {
    id: '728ed54f',
    name: 'Jerry',
    role: getRoles()[2].name,
    status: 'ACCEPTED',
    time: '2026-07-07T16:45:00.000Z',
    username: 'jealing2',
    email: 'jealing@gmail.com',
    avatar: '',
  },
];

export const getMarketplaceFilters = (): string[] => [
  'All',
  'Featured',
  'Detection',
  'Classification',
  'Review',
];

export const getTags = (): TagGroupDetail[] => [
  {
    id: '123',
    name: 'Office Supplies',
    description: 'Detects clips, pencils, papers, and other office items.',
    tags: [
      {
        id: 't1',
        name: 'Clip',
        description: 'Metal or plastic paper clips.',
        color: '#ef4444',
      },
      {
        id: 't2',
        name: 'Pencil',
        description: 'Standard wooden pencils.',
        color: '#22c55e',
      },
      {
        id: 't3',
        name: 'Paper',
        description: 'Loose sheets of paper.',
        color: '#3b82f6',
      },
    ],
  },
];

export const getMarketplaceTemplates = (): MarketplaceTemplate[] => [
  {
    id: '1',
    slug: 'warehouse-safety-qa',
    name: 'Warehouse Safety QA',
    creator: 'andre m.',
    description: 'Detection-first review setup for pallet, forklift, and person workflows.',
    mode: 'Detection',
    baseModel: 'YOLOv8',
    tags: ['warehouse', 'safety', 'ppe', 'review'],
    rules: 14,
    rating: 4.9,
    users: '2.4k',
    updated: '2 days ago',
    featured: true,
    previewImages: ['/session-preview.jpg', '/session-preview.jpg', '/session-preview.jpg'],
  },
  {
    id: '2',
    slug: 'retail-shelf-audit',
    name: 'Retail Shelf Audit',
    creator: 'maya labs',
    description: 'Fast tagging flow for stockouts, shelf gaps, and product placement checks.',
    mode: 'Classification',
    baseModel: 'ConvNeXt',
    tags: ['retail', 'audit', 'inventory'],
    rules: 8,
    rating: 4.7,
    users: '1.1k',
    updated: '5 days ago',
    previewImages: ['/session-preview.jpg', '/session-preview.jpg'],
  },
  {
    id: '3',
    slug: 'construction-risk-scan',
    name: 'Construction Risk Scan',
    creator: 'field ops',
    description: 'A reusable starting point for hazard labeling and compliance review.',
    mode: 'Detection',
    baseModel: 'RT-DETR',
    tags: ['construction', 'hazard', 'compliance'],
    rules: 11,
    rating: 4.8,
    users: '980',
    updated: '1 week ago',
  },
  {
    id: '4',
    slug: 'medical-image-triage',
    name: 'Medical Image Triage',
    creator: 'northstar ai',
    description: 'Clean triage pipeline for fast labeling and expert escalation.',
    mode: 'Review',
    baseModel: 'ViT',
    tags: ['medical', 'triage', 'review'],
    rules: 16,
    rating: 4.6,
    users: '620',
    updated: '3 days ago',
    previewImages: ['/session-preview.jpg'],
  },
];

export const getSharedModel = (): SharedModel => ({
  name: 'Warehouse Safety QA',
  slug: 'warehouse-safety-qa',
  creator: 'andre m.',
  description:
    'Detection-first setup for pallet, forklift, and person workflows with reusable rules and tags.',
  mode: 'Detection',
  baseModel: 'YOLOv8',
  rules: 14,
  users: '2.4k',
  rating: 4.9,
  updated: '2 days ago',
  version: 'v1.3',
  tags: ['warehouse', 'safety', 'ppe', 'review'],
  previewImages: ['/session-preview.jpg', '/session-preview.jpg', '/session-preview.jpg'],
});

export const getProjectTags = (): TagGroup[] => [
  {
    id: '1232',
    name: 'Japanese',
    description: 'Japanese stuff',
    total: 23,
  },
  {
    id: '1235',
    name: 'Scratches',
    description: 'Scratches stuff',
    total: 9,
  },
];

export const getProjectUsers = (): User[] => [
  {
    id: '728ed52f',
    name: 'David',
    role: 'Japan',
    status: 'SENT',
    time: '2026-07-07T18:00:00.000Z',
    username: 'David123',
    email: 'david@gmail.com',
    avatar: '',
  },
  {
    id: '731ed57f',
    name: 'Stephanie',
    role: 'Scratches',
    status: 'REJECTED',
    time: '2026-07-07T17:30:00.000Z',
    username: 'Stephanie-Flower',
    email: 'flower@gmail.com',
    avatar: '',
  },
  {
    id: '728ed54f',
    name: 'Jerry',
    role: 'Scratches',
    status: 'ACCEPTED',
    time: '2026-07-07T16:45:00.000Z',
    username: 'jealing2',
    email: 'jealing@gmail.com',
    avatar: '',
  },
];

export const getProjectLayouts = (): Layout[] => [
  {
    id: '1232',
    name: 'Cars',
    description: 'Analyzing cars',
    total: 11,
  },
  {
    id: '1235',
    name: 'Drawings',
    description: 'Analyzing strokes',
    total: 9,
  },
];

export const getProjectServers = (): ServerActivity[] => [
  {
    id: 'us-east-1',
    region: 'United States East',
    countryCode: 'US',
    status: 'healthy',
    requests: 3891,
    dataTransferred: '9.4 MB',
    avgResponseMs: 142,
    lat: 39.0,
    lon: -77.5,
  },
];

export const getDetectionSessions = (): DetectionSession[] => [
  {
    id: 'S-1042',
    images: 18,
    type: 'People detection',
    detections: 64,
    status: 'completed',
    time: '2026-07-07 09:12',
  },
  {
    id: 'S-1043',
    images: 6,
    type: 'Face detection',
    detections: 11,
    status: 'review',
    time: '2026-07-07 10:05',
  },
  {
    id: 'S-1044',
    images: 24,
    type: 'Vehicle detection',
    detections: 38,
    status: 'processing',
    time: '2026-07-07 11:18',
  },
  {
    id: 'S-1045',
    images: 9,
    type: 'Damage detection',
    detections: 7,
    status: 'failed',
    time: '2026-07-07 11:43',
  },
];

export const getSessionImages = (): SessionImage[] => [
  {
    id: 'img-1',
    title: 'Entrance view',
    src: '/session-preview.jpg',
    detections: [
      { id: '1', index: 0, label: 'Pallet', confidence: 43, box: { x: 12, y: 28, w: 34, h: 28 } },
      { id: '2', index: 1, label: 'Pallet', confidence: 47, box: { x: 38, y: 12, w: 32, h: 24 } },
      { id: '3', index: 2, label: 'Forklift', confidence: 59, box: { x: 64, y: 30, w: 26, h: 30 } },
      { id: '4', index: 3, label: 'Person', confidence: 77, box: { x: 18, y: 18, w: 10, h: 18 } },
    ],
  },
  {
    id: 'img-2',
    title: 'Loading dock',
    src: '/session-preview.jpg',
    detections: [
      { id: '5', index: 0, label: 'Pallet', confidence: 66, box: { x: 16, y: 42, w: 28, h: 24 } },
      { id: '6', index: 1, label: 'Forklift', confidence: 82, box: { x: 54, y: 25, w: 24, h: 28 } },
      { id: '7', index: 2, label: 'Person', confidence: 71, box: { x: 22, y: 16, w: 9, h: 19 } },
    ],
  },
  {
    id: 'img-3',
    title: 'Storage aisle',
    src: '/session-preview.jpg',
    detections: [
      { id: '8', index: 0, label: 'Pallet', confidence: 52, box: { x: 11, y: 35, w: 30, h: 25 } },
      { id: '9', index: 1, label: 'Pallet', confidence: 61, box: { x: 46, y: 22, w: 26, h: 23 } },
      { id: '10', index: 2, label: 'Person', confidence: 79, box: { x: 71, y: 20, w: 9, h: 18 } },
    ],
  },
];

export const getAccountUser = () => ({
  name: 'Jacke Myres',
  email: 'Jacke@gmail.com',
  avatar: 'https://github.com/shadcn.png',
});

export const getWorkspace = (): Workspace[] => [
  {
    name: 'Acme Inc',
    logo: '',
    plan: 'Enterprise',
  },
  {
    name: 'Acme Corp.',
    logo: '',
    plan: 'Startup',
  },
  {
    name: 'Evil Corp.',
    logo: '',
    plan: 'Free',
  },
];

export const getLogs = (): Log[] => [
  {
    id: '728ed52f',
    type: 'GET',
    request: '/api/server/connect',
    status: 200,
    time: '2026-08-07T04:10:32.118Z',
    response: {
      connected: true,
      server: 'workspace-api',
      version: '1.4.2',
    },
  },
  {
    id: '728ed54f',
    type: 'DELETE',
    request: '/api/server/user',
    status: 500,
    time: '2026-08-07T04:10:32.118Z',
    response: {
      deleted: false,
    },
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'The user could not be deleted because the server encountered an unexpected error.',
      details: {
        userId: 'usr_1044',
        service: 'workspace-api',
      },
    },
  },
  {
    id: 'njkk234',
    type: 'POST',
    request: '/api/server/user',
    status: 300,
    time: '2026-08-07T04:10:32.118Z',
    response: {
      deleted: false,
    },
  },
  {
    id: '728ed55f',
    type: 'PUSH',
    request: '/api/server/user',
    status: 100,
    time: '2026-08-07T04:10:32.118Z',
    response: {
      message: 'Request received and is being processed.',
    },
  },
  {
    id: '728ed56f',
    type: 'PATCH',
    request: '/api/server/user',
    status: 400,
    time: '2026-08-07T04:10:32.118Z',
    response: {
      deleted: false,
    },
    error: {
      code: 'INVALID_REQUEST',
      message: 'The request is missing the required user identifier.',
      details: {
        field: 'userId',
        reason: 'This field is required.',
      },
    },
  },
];

export const getProjectCards = (): Project[] => [
  {
    id: 'area',
    title: 'Area',
    total: 23,
    state: 'online',
    description: 'Reducing the detection area for focused car inspections.',
    model: 'Gemini',
    icon: 'Folder',
    color: '#7c3aed',
    usage: [
      {
        id: '1',
        name: 'Data Usage',
        description: 'Total data usage of the AI model',
        usedData: 1.24,
        maxData: 100,
        dataType: 'GB',
      },
      {
        id: '2',
        name: 'Image Optimization',
        description:
          'The number of image transformations that were requested from your Deployments.',
        usedData: 12,
        maxData: 100,
        dataType: 'K',
      },
      {
        id: '3',
        name: 'Fast Memory',
        description: 'Total memory usage for optimization.',
        usedData: 12,
        maxData: 64,
        dataType: 'GB',
      },
      {
        id: '4',
        name: 'Fast Memory',
        description: 'Total memory usage for optimization.',
        usedData: 12,
        maxData: 64,
        dataType: 'GB',
      },
    ],
  },
  {
    id: 'simple',
    title: 'Simple',
    total: 23,
    state: 'processing',
    description: 'Simple parsing rules for clean, minimal detections.',
    model: 'GPT',
    icon: 'Globe',
    color: '#ef4444',
    usage: [
      {
        id: '1',
        name: 'Data Usage',
        description: 'Total data usage of the AI model',
        usedData: 1.24,
        maxData: 100,
        dataType: 'GB',
      },
      {
        id: '2',
        name: 'Image Optimization',
        description:
          'The number of image transformations that were requested from your Deployments.',
        usedData: 12,
        maxData: 100,
        dataType: 'K',
      },
      {
        id: '3',
        name: 'Fast Memory',
        description: 'Total memory usage for optimization.',
        usedData: 12,
        maxData: 64,
        dataType: 'GB',
      },
      {
        id: '4',
        name: 'Fast Memory',
        description: 'Total memory usage for optimization.',
        usedData: 12,
        maxData: 64,
        dataType: 'GB',
      },
    ],
  },
  {
    id: 'tags',
    title: 'Tags',
    total: 23,
    state: 'online',
    description: 'Uses tags to specialize what the project should look for.',
    model: 'Gemini',
    icon: 'ClipboardList',
    color: '#0ea5e9',
    usage: [
      {
        id: '1',
        name: 'Data Usage',
        description: 'Total data usage of the AI model',
        usedData: 1.24,
        maxData: 100,
        dataType: 'GB',
      },
      {
        id: '2',
        name: 'Image Optimization',
        description:
          'The number of image transformations that were requested from your Deployments.',
        usedData: 12,
        maxData: 100,
        dataType: 'K',
      },
      {
        id: '3',
        name: 'Fast Memory',
        description: 'Total memory usage for optimization.',
        usedData: 12,
        maxData: 64,
        dataType: 'GB',
      },
      {
        id: '4',
        name: 'Fast Memory',
        description: 'Total memory usage for optimization.',
        usedData: 12,
        maxData: 64,
        dataType: 'GB',
      },
    ],
  },
];

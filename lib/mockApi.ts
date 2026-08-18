import { Role } from '@/components/tables/roles-columns';
import { User } from '@/components/tables/users-columns';
import { LayoutTableData } from '@/components/tables/layouts-columns';
import { DetectionSession } from '@/components/tables/detection-columns';
import { Log } from '@/components/tables/logs-columns';
import { Project } from '@/components/project-cards';
import { TagGroupDetail } from '@/app/settings/tags/[tagGroup]/page';
import { TagGroup } from '@/components/tables/tags-columns';
import { ServerActivity } from '@/components/tables/global-columns';
import { SingleSetting } from '@/components/tables/settings-columns';
import { Invoice } from '@/components/tables/invoice-table';
import { GraphLink, GraphNode, NodeCategory as GraphGroups } from '@/components/linkGraph';
import { Edge, Node } from '@xyflow/react';
import { SecretKey } from '@/components/tables/secrets-columns';

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
  sessionId: string;
  title: string;
  src: string;
  detections: SessionDetection[];
};

export type LayoutStep = {
  id: string;
  position: number;
  title: string;
  description: string;
  thumbnail?: string;
  required: boolean;
  mode: 'detection' | 'ocr';
};

export type SessionLayout = {
  id: string;
  layoutStep: LayoutStep[];
};

export type DetectionLayer = {
  id: string;
  projectId: string;
  position: number;
  model: string;
  tagIds: string[];
};

export type Workspace = {
  name: string;
  logo: string;
  plan: string;
};

export type ProjectLinkedSession = {
  id: string;
  projectId: string;
  sessionId: string;
};

export function getSecretKeys(): SecretKey[] {
  return [
    {
      id: 'key-001',
      name: 'Development worker',
      description: 'Used by the local detection worker.',
      prefix: 'sk_test_',
      lastFour: 'a91f',
      createdAt: '2026-08-01T12:00:00.000Z',
      lastUsedAt: '2026-08-12T18:42:00.000Z',
      status: 'active',
      permissions: ['view-detections', 'view-sessions', 'create-sessions', 'run-detection'],
    },
    {
      id: 'key-002',
      name: 'Analytics dashboard',
      description: 'Read-only access for reporting.',
      prefix: 'sk_live_',
      lastFour: 'c204',
      createdAt: '2026-07-20T09:30:00.000Z',
      lastUsedAt: '2026-08-10T15:20:00.000Z',
      status: 'active',
      permissions: ['view-detections', 'view-sessions', 'view-analytics'],
    },
  ];
}

export function secretKeySettingsOptions(): SingleSetting[] {
  return [
    {
      id: 'view-detections',
      name: 'View detections',
      description: 'Read detection results and bounding-box information.',
      type: 'switch',
      value: true,
    },
    {
      id: 'create-sessions',
      name: 'Create sessions',
      description: 'Create new sessions and submit images for processing.',
      type: 'switch',
      value: false,
    },
    {
      id: 'view-sessions',
      name: 'View sessions',
      description: 'Read session metadata, status, and processing results.',
      type: 'switch',
      value: true,
    },
    {
      id: 'update-detections',
      name: 'Update detections',
      description: 'Modify, correct, add, or remove detection results.',
      type: 'switch',
      value: false,
    },
    {
      id: 'run-detection',
      name: 'Run detection',
      description: 'Start detection processing for an existing session.',
      type: 'switch',
      value: false,
    },
    {
      id: 'view-project',
      name: 'View project',
      description: 'Read project details and configured resources.',
      type: 'switch',
      value: true,
    },
    {
      id: 'manage-layouts',
      name: 'Manage layouts',
      description: 'Create, update, and delete session layouts.',
      type: 'switch',
      value: false,
    },
    {
      id: 'manage-tags',
      name: 'Manage tags',
      description: 'Create, update, and delete detection tags.',
      type: 'switch',
      value: false,
    },
    {
      id: 'view-analytics',
      name: 'View analytics',
      description: 'Read project analytics and usage metrics.',
      type: 'switch',
      value: false,
    },
    {
      id: 'export-data',
      name: 'Export data',
      description: 'Export sessions, detections, and analytics data.',
      type: 'switch',
      value: false,
    },
    {
      id: 'manage-settings',
      name: 'Manage settings',
      description: 'Update project and workspace settings.',
      type: 'switch',
      value: false,
    },
  ];
}

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

const ALL_TAG_GROUPS: TagGroup[] = [
  {
    id: 'japanese-1',
    name: 'Japanese',
    description: 'Japanese stuff',
    total: 23,
  },
  {
    id: 'scratches-1',
    name: 'Scratches',
    description: 'Scratches stuff',
    total: 9,
  },
];

const ALL_USERS: User[] = [
  {
    id: '728ed52f',
    name: 'David',
    roleId: '124123',
    status: 'SENT',
    time: '2026-07-07T18:00:00.000Z',
    username: 'David123',
    email: 'david@gmail.com',
    avatar: '',
  },
  {
    id: '731ed57f',
    name: 'Stephanie',
    roleId: '124124',
    status: 'REJECTED',
    time: '2026-07-07T17:30:00.000Z',
    username: 'Stephanie-Flower',
    email: 'flower@gmail.com',
    avatar: '',
  },
  {
    id: '728ed54f',
    name: 'Jerry',
    roleId: '124125',
    status: 'ACCEPTED',
    time: '2026-07-07T16:45:00.000Z',
    username: 'jealing2',
    email: 'jealing@gmail.com',
    avatar: '',
  },
];

const ALL_ROLES: Role[] = [
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

const ALL_LAYOUTS: LayoutTableData[] = [
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

const ALL_SESSION_LAYOUTS: SessionLayout[] = [
  {
    id: '12312',
    layoutStep: [
      {
        id: 'step-1',
        position: 1,
        title: 'Front of package',
        description: 'Capture the front-facing side of the package.',
        thumbnail: '',
        required: true,
        mode: 'detection',
      },
      {
        id: 'step-2',
        position: 2,
        title: 'Barcode and label',
        description: 'Capture the barcode and printed product information.',
        thumbnail: '',
        required: true,
        mode: 'ocr',
      },
      {
        id: 'step-3',
        position: 3,
        title: 'Top view',
        description: 'Capture the top of the package if visible.',
        thumbnail: '',
        required: false,
        mode: 'detection',
      },
    ],
  },
];

export const getSessionsData = (): SessionLayout[] => ALL_SESSION_LAYOUTS;

const ALL_SERVERS: ServerActivity[] = [
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
  {
    id: 'eu-west-1',
    region: 'Europe West',
    countryCode: 'GB',
    status: 'healthy',
    requests: 2187,
    dataTransferred: '6.1 MB',
    avgResponseMs: 158,
    lat: 51.5,
    lon: -0.1,
  },
];

const ALL_PROJECTS: Project[] = [
  {
    id: 'area',
    name: 'Area',
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
    tagGroupIds: ['japanese-1'],
    layoutIds: ['1232'],
    userIds: ['728ed52f', '728ed54f'],
    roleIds: ['124123', '124124'],
    serverIds: ['us-east-1'],
    linkedProjectIds: ['simple'],
  },
  {
    id: 'simple',
    name: 'Simple',
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
    tagGroupIds: ['scratches-1'],
    layoutIds: ['1235'],
    userIds: ['731ed57f'],
    roleIds: ['124124', '124125'],
    serverIds: ['eu-west-1'],
    linkedProjectIds: ['tags'],
  },
  {
    id: 'tags',
    name: 'Tags',
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
    tagGroupIds: ['1232', '1235'],
    layoutIds: ['1232', '1235'],
    userIds: ['728ed52f', '731ed57f', '728ed54f'],
    roleIds: ['124123', '124124', '124125'],
    serverIds: ['us-east-1', 'eu-west-1'],
    linkedProjectIds: [],
  },
];

const ALL_DETECTION_LAYERS: DetectionLayer[] = [
  { id: 'layer-area-1', projectId: 'area', position: 1, model: 'Gemini', tagIds: ['japanese-1'] },
  { id: 'layer-area-2', projectId: 'area', position: 2, model: 'GPT', tagIds: ['japanese-1'] },
  { id: 'layer-simple-1', projectId: 'simple', position: 1, model: 'GPT', tagIds: ['scratches-1'] },
  {
    id: 'layer-tags-1',
    projectId: 'tags',
    position: 1,
    model: 'Gemini',
    tagIds: ['japanese-1', 'scratches-1'],
  },
];

export const getProjectLayers = (projectId?: string) => {
  const layers = projectId
    ? ALL_DETECTION_LAYERS.filter((l) => l.projectId === projectId)
    : ALL_DETECTION_LAYERS;

  return layers.map((l) => ({
    id: l.id,
    position: l.position,
    model: l.model,
    tags: (l.tagIds || [])
      .map((tid) => ALL_TAG_GROUPS.find((t) => t.id === tid))
      .filter((t): t is TagGroup => Boolean(t)),
  }));
};

const ALL_SESSIONS: DetectionSession[] = [
  {
    id: 'S-1042',
    projectId: 'area',
    images: 18,
    type: 'People detection',
    detections: 64,
    status: 'completed',
    time: '2026-07-07 09:12',
  },
  {
    id: 'S-1043',
    projectId: 'area',
    images: 6,
    type: 'Face detection',
    detections: 11,
    status: 'review',
    time: '2026-07-07 10:05',
  },
  {
    id: 'S-1044',
    projectId: 'simple',
    images: 24,
    type: 'Vehicle detection',
    detections: 38,
    status: 'processing',
    time: '2026-07-07 11:18',
  },
  {
    id: 'S-1045',
    projectId: 'tags',
    images: 9,
    type: 'Damage detection',
    detections: 7,
    status: 'failed',
    time: '2026-07-07 11:43',
  },
];

const ALL_IMAGES: SessionImage[] = [
  {
    id: 'img-1',
    sessionId: 'S-1042',
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
    sessionId: 'S-1042',
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
    sessionId: 'S-1043',
    title: 'Storage aisle',
    src: '/session-preview.jpg',
    detections: [
      { id: '8', index: 0, label: 'Pallet', confidence: 52, box: { x: 11, y: 35, w: 30, h: 25 } },
      { id: '9', index: 1, label: 'Pallet', confidence: 61, box: { x: 46, y: 22, w: 26, h: 23 } },
      { id: '10', index: 2, label: 'Person', confidence: 79, box: { x: 71, y: 20, w: 9, h: 18 } },
    ],
  },
  {
    id: 'img-4',
    sessionId: 'S-1044',
    title: 'Shared aisle',
    src: '/session-preview.jpg',
    detections: [
      { id: '11', index: 0, label: 'Car', confidence: 84, box: { x: 12, y: 24, w: 42, h: 34 } },
      { id: '12', index: 1, label: 'Wheel', confidence: 71, box: { x: 54, y: 20, w: 24, h: 18 } },
    ],
  },
  {
    id: 'img-5',
    sessionId: 'S-1044',
    title: 'Roadside view',
    src: '/session-preview.jpg',
    detections: [
      { id: '13', index: 0, label: 'Car', confidence: 60, box: { x: 14, y: 32, w: 28, h: 24 } },
      { id: '14', index: 1, label: 'Person', confidence: 58, box: { x: 40, y: 28, w: 16, h: 24 } },
    ],
  },
  {
    id: 'img-6',
    sessionId: 'S-1045',
    title: 'Damaged hood',
    src: '/session-preview.jpg',
    detections: [
      { id: '15', index: 0, label: 'Dent', confidence: 71, box: { x: 15, y: 18, w: 25, h: 22 } },
      { id: '16', index: 1, label: 'Scratch', confidence: 66, box: { x: 48, y: 26, w: 22, h: 18 } },
    ],
  },
];

export const getAllNodes = (groupId?: string, projectId?: string): GraphNode[] => {
  const project = projectId ? getProjectById(projectId) : undefined;

  const connectedIds = project
    ? new Set([
        ...(project.tagGroupIds ?? []),
        ...(project.layoutIds ?? []),
        ...(project.roleIds ?? []),
        ...(project.userIds ?? []),
        ...(project.serverIds ?? []),
        ...(project.linkedProjectIds ?? []),
        project.id,
      ])
    : null;

  const keep = (id: string) => {
    return !connectedIds || connectedIds.has(id);
  };

  const connectedUserIds = project
    ? new Set(project.userIds ?? [])
    : new Set(ALL_USERS.map((user) => user.id));

  const rolesFromUsers = new Set(
    ALL_USERS.filter((user) => connectedUserIds.has(user.id))
      .map((user) => user.roleId)
      .filter((roleId): roleId is string => Boolean(roleId))
  );

  const relatedRoleIds = new Set([...(project?.roleIds ?? []), ...rolesFromUsers]);

  const nodes: GraphNode[] = [];

  ALL_PROJECTS.filter((item) => keep(item.id)).forEach((item) => {
    nodes.push({
      id: item.id,
      label: item.name,
      group: 'project',
      radius: 20,
    });
  });

  if (!groupId || groupId === 'tags') {
    ALL_TAG_GROUPS.filter((item) => keep(item.id)).forEach((item) => {
      nodes.push({
        id: item.id,
        label: item.name,
        group: 'tags',
        radius: 12,
      });
    });
  }

  if (!groupId || groupId === 'layout') {
    ALL_LAYOUTS.filter((item) => keep(item.id)).forEach((item) => {
      nodes.push({
        id: item.id,
        label: item.name,
        group: 'layout',
        radius: 18,
      });
    });
  }

  if (!groupId || groupId === 'roles' || groupId === 'users') {
    ALL_ROLES.filter((role) => {
      return keep(role.id) || relatedRoleIds.has(role.id);
    }).forEach((role) => {
      nodes.push({
        id: role.id,
        label: role.name,
        group: 'roles',
        radius: 16,
      });
    });
  }

  if (!groupId || groupId === 'users' || groupId === 'roles') {
    ALL_USERS.filter((user) => {
      if (!project) {
        return true;
      }

      return keep(user.id);
    }).forEach((user) => {
      nodes.push({
        id: user.id,
        label: user.name,
        group: 'users',
        radius: 14,
      });
    });
  }

  return nodes;
};

export const getAllLinks = (projectId?: string): GraphLink[] => {
  const links: GraphLink[] = [];

  const projectFiltered: Project[] = projectId
    ? ([getProjectById(projectId)].filter(Boolean) as Project[])
    : ALL_PROJECTS;

  const pushLinks = (srcId: string, projects: Project[]) => {
    projects.forEach((project) => {
      links.push({ source: srcId, target: project.id });
    });
  };

  ALL_TAG_GROUPS.forEach((item) => {
    pushLinks(
      item.id,
      projectFiltered.filter((p) => p.tagGroupIds?.includes(item.id))
    );
  });

  ALL_LAYOUTS.forEach((item) => {
    pushLinks(
      item.id,
      projectFiltered.filter((p) => p.layoutIds?.includes(item.id))
    );
  });

  ALL_ROLES.forEach((item) => {
    pushLinks(
      item.id,
      projectFiltered.filter((p) => p.roleIds?.includes(item.id))
    );
  });

  ALL_USERS.forEach((item) => {
    pushLinks(
      item.id,
      projectFiltered.filter((p) => p.userIds?.includes(item.id))
    );

    if (item.roleId) links.push({ source: item.id, target: item.roleId });
  });

  projectFiltered.forEach((item) => {
    item.linkedProjectIds?.forEach((linkedId) => {
      links.push({ source: item.id, target: linkedId });
    });
  });

  return links;
};

export const getProjectLinks = (
  projectId?: string,
  groupId?: string
): {
  nodes: GraphNode[];
  links: GraphLink[];
  groups: GraphGroups[];
} => {
  const nodes = getAllNodes(groupId, projectId);
  const links = getAllLinks(projectId);

  const nodeIds = new Set(nodes.map((n) => n.id));
  const safeLinks = links.filter(
    (l) => nodeIds.has(l.source as string) && nodeIds.has(l.target as string)
  );

  return {
    nodes,
    links: safeLinks,
    groups: getAllGraphGroups(),
  };
};

export const getProjectTags = (projectId?: string): TagGroup[] => {
  if (!projectId) {
    return ALL_TAG_GROUPS;
  }

  const project = getProjects().find((item) => item.id === projectId);
  return (
    project?.tagGroupIds
      ?.map((id) => ALL_TAG_GROUPS.find((tag) => tag.id === id))
      .filter((tag): tag is TagGroup => Boolean(tag)) ?? []
  );
};

export const getUsers = (): User[] => ALL_USERS;

export const getProjectUsers = (projectId?: string): User[] => {
  if (!projectId) {
    return ALL_USERS;
  }

  const project = getProjects().find((item) => item.id === projectId);
  return (
    project?.userIds
      ?.map((id) => ALL_USERS.find((user) => user.id === id))
      .filter((user): user is User => Boolean(user)) ?? []
  );
};

export const getRoles = (): Role[] => ALL_ROLES;

export const getProjectRoles = (projectId?: string): Role[] => {
  if (!projectId) {
    return ALL_ROLES;
  }

  const project = getProjects().find((item) => item.id === projectId);
  return (
    project?.roleIds
      ?.map((id) => ALL_ROLES.find((role) => role.id === id))
      .filter((role): role is Role => Boolean(role)) ?? []
  );
};

export const getProjectLayouts = (projectId?: string): LayoutTableData[] => {
  if (!projectId) {
    return ALL_LAYOUTS;
  }

  const project = getProjects().find((item) => item.id === projectId);
  return (
    project?.layoutIds
      ?.map((id) => ALL_LAYOUTS.find((layout) => layout.id === id))
      .filter((layout): layout is LayoutTableData => Boolean(layout)) ?? []
  );
};

export const getProjectServers = (projectId?: string): ServerActivity[] => {
  if (!projectId) {
    return ALL_SERVERS;
  }

  const project = getProjects().find((item) => item.id === projectId);
  return (
    project?.serverIds
      ?.map((id) => ALL_SERVERS.find((server) => server.id === id))
      .filter((server): server is ServerActivity => Boolean(server)) ?? []
  );
};

export const getProjects = (): Project[] => ALL_PROJECTS;

export const getProjectById = (projectId: string): Project | undefined =>
  getProjects().find((item) => item.id === projectId);

export const getProjectLinkedProjects = (projectId: string): Project[] => {
  const project = getProjectById(projectId);
  return (
    project?.linkedProjectIds
      ?.map((id) => getProjectById(id))
      .filter((target): target is Project => Boolean(target)) ?? []
  );
};

export const getDetectionSessions = (): DetectionSession[] => ALL_SESSIONS;

export const getDetectionSessionsByProject = (projectId: string): DetectionSession[] =>
  ALL_SESSIONS.filter((session) => session.projectId === projectId);

export const getSessionById = (sessionId: string): DetectionSession | undefined =>
  ALL_SESSIONS.find((session) => session.id === sessionId);

export const getSessionImages = (sessionId?: string): SessionImage[] =>
  sessionId ? ALL_IMAGES.filter((image) => image.sessionId === sessionId) : ALL_IMAGES;

export const getProjectSessionImages = (projectId: string): SessionImage[] => {
  const project = getProjectById(projectId);
  if (!project) {
    return [];
  }

  const availableProjectIds = [project.id, ...(project.linkedProjectIds ?? [])];
  const sessionIds = ALL_SESSIONS.filter((session) =>
    availableProjectIds.includes(session.projectId)
  ).map((session) => session.id);

  return ALL_IMAGES.filter((image) => sessionIds.includes(image.sessionId));
};

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

export const getGraphNodes = (): GraphNode[] => [
  { id: 'frontend', label: 'Next.js Frontend', group: 'tags', radius: 14 },
  { id: 'canvas', label: 'Konva Canvas', group: 'tags', radius: 10 },
  { id: 'api', label: 'API Server', group: 'layout', radius: 16 },
  { id: 'detection', label: 'Detection Service', group: 'layout', radius: 12 },
  { id: 'prompt-engine', label: 'Prompt Engine', group: 'layout', radius: 12 },
  { id: 'agent', label: 'AI Agent', group: 'roles', radius: 14 },
  { id: 'llm-optimizer', label: 'LLM Optimizer', group: 'roles', radius: 12 },
  { id: 'image-store', label: 'Image Storage', group: 'roles', radius: 10 },
  { id: 'users-detections', label: 'Detections users', group: 'users', radius: 12 },
  { id: 'users-prompts', label: 'Prompts users', group: 'users', radius: 12 },
];

export const getGraphLinks = (): GraphLink[] => [
  { source: 'frontend', target: 'api' },
  { source: 'frontend', target: 'canvas' },
  { source: 'canvas', target: 'api' },
  { source: 'api', target: 'detection' },
  { source: 'api', target: 'llm-optimizer' },
  { source: 'api', target: 'users-detections' },
  { source: 'api', target: 'image-store' },
  { source: 'detection', target: 'agent' },
  { source: 'prompt-engine', target: 'api' },
  { source: 'prompt-engine', target: 'agent' },
  { source: 'prompt-engine', target: 'users-prompts' },
  { source: 'llm-optimizer', target: 'prompt-engine' },
  { source: 'llm-optimizer', target: 'users-prompts' },
  { source: 'users-detections', target: 'canvas' },
  { source: 'image-store', target: 'detection' },
];

const EDGE_TOPOLOGY: { id: string; source: string; target: string }[] = [
  { id: 'fe-api', source: 'frontend', target: 'api' },
  { id: 'fe-canvas', source: 'frontend', target: 'canvas' },
  { id: 'canvas-api', source: 'canvas', target: 'api' },
  { id: 'api-det', source: 'api', target: 'detection' },
  { id: 'api-img', source: 'api', target: 'image-store' },
  { id: 'api-dbd', source: 'api', target: 'db-detections' },
  { id: 'api-dbp', source: 'api', target: 'db-prompts' },
  { id: 'api-llm', source: 'api', target: 'llm-optimizer' },
  { id: 'img-det', source: 'image-store', target: 'detection' },
  { id: 'dbd-canvas', source: 'db-detections', target: 'canvas' },
  { id: 'llm-pe', source: 'llm-optimizer', target: 'prompt-engine' },
  { id: 'llm-dbp', source: 'llm-optimizer', target: 'db-prompts' },
  { id: 'pe-api', source: 'prompt-engine', target: 'api' },
  { id: 'pe-dbp', source: 'prompt-engine', target: 'db-prompts' },
];

function getLayerEdges(layers: ReturnType<typeof getProjectLayers>) {
  const edges: { id: string; source: string; target: string }[] = [];
  layers.forEach((layer) => {
    const llmId = `llm-${layer.id}`;
    edges.push({ id: `det-${llmId}`, source: 'detection', target: llmId });
    edges.push({ id: `${llmId}-llmopt`, source: llmId, target: 'llm-optimizer' });
    edges.push({ id: `pe-${llmId}`, source: 'prompt-engine', target: llmId });
  });
  return edges;
}

function findPath(
  targetId: string,
  allEdges: { id: string; source: string; target: string }[]
): string[] {
  if (targetId === 'frontend') return [];

  const queue: { node: string; path: string[] }[] = [{ node: 'frontend', path: [] }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;
    if (visited.has(node)) continue;
    visited.add(node);

    for (const edge of allEdges) {
      if (edge.source === node) {
        const newPath = [...path, edge.id];
        if (edge.target === targetId) return newPath;
        queue.push({ node: edge.target, path: newPath });
      }
    }
  }

  return [];
}

function deriveNodeStatus(serviceId: string, logs: Log[]): 'online' | 'offline' | 'error' {
  const serviceLogs = logs.filter((l) => l.serviceId === serviceId);
  if (serviceLogs.length === 0) return 'offline';
  const latest = serviceLogs.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  )[0];
  if (latest.status >= 500) return 'error';
  return 'online';
}

export const getActivityForProject = (projectId?: string) => {
  const project = projectId ? getProjectById(projectId) : undefined;
  const projectLayers = projectId ? getProjectLayers(projectId) : [];
  const projectServers = project ? getProjectServers(projectId) : [];
  const logs = getLogs(projectId);

  const layerEdgeDefs = getLayerEdges(projectLayers);
  const allEdgeDefs = [...EDGE_TOPOLOGY, ...layerEdgeDefs];

  const edgeRefCount = new Map<string, Set<string>>();

  logs.forEach((log) => {
    if (!log.serviceId) return;
    const path = findPath(log.serviceId, allEdgeDefs);
    path.forEach((edgeId) => {
      if (!edgeRefCount.has(edgeId)) edgeRefCount.set(edgeId, new Set());
      edgeRefCount.get(edgeId)!.add(log.id);
    });
  });

  const activeEdgeIds = new Set(
    [...edgeRefCount.entries()].filter(([, procs]) => procs.size > 0).map(([id]) => id)
  );

  const COL = { ui: 100, api: 500, ai: 900, db: 1300, server: 1700 };
  const ROW_START = 80;
  const ROW_GAP = 200;

  const staticNodes = [
    { id: 'frontend', name: 'Next.js Frontend', icon: 'Globe', col: COL.ui, row: 0 },
    {
      id: 'canvas',
      name: 'Konva Canvas',
      icon: 'Layers',
      col: COL.ui,
      row: 1,
      volume: 'bbox editor',
    },
    { id: 'api', name: 'API Server', icon: 'Server', col: COL.api, row: 1 },
    { id: 'detection', name: 'Detection Service', icon: 'FlaskConical', col: COL.api, row: 2 },
    {
      id: 'prompt-engine',
      name: 'Prompt Engine',
      icon: 'GitBranch',
      col: COL.ai,
      row: 0,
      volume: 'best + last prompt',
    },
    { id: 'llm-optimizer', name: 'LLM Optimizer', icon: 'Cpu', col: COL.ai, row: 1 },
    {
      id: 'image-store',
      name: 'Image Storage',
      icon: 'FileImage',
      col: COL.api,
      row: 3,
      volume: 'car photos',
    },
    {
      id: 'db-detections',
      name: 'Detections DB',
      icon: 'Database',
      col: COL.db,
      row: 1,
      volume: 'ver A + B',
    },
    {
      id: 'db-prompts',
      name: 'Prompts DB',
      icon: 'ScrollText',
      col: COL.db,
      row: 2,
      volume: 'best + last',
    },
  ];

  const nodes: Node[] = staticNodes.map((n) => ({
    id: n.id,
    type: 'service',
    position: { x: n.col, y: ROW_START + n.row * ROW_GAP },
    data: {
      name: n.name,
      icon: n.icon,
      volume: n.volume,
      status: deriveNodeStatus(n.id, logs),
    },
  }));

  projectLayers.forEach((layer, i) => {
    const llmId = `llm-${layer.id}`;
    nodes.push({
      id: llmId,
      type: 'service',
      position: { x: COL.ai, y: ROW_START + (2 + i) * ROW_GAP },
      data: {
        name: `Layer ${layer.position} · ${layer.model}`,
        icon: 'Brain',
        volume: layer.tags.map((t) => t.name).join(', ') || undefined,
        status: deriveNodeStatus(llmId, logs),
      },
    });
  });

  projectServers.forEach((server, i) => {
    nodes.push({
      id: server.id,
      type: 'service',
      position: { x: COL.server, y: ROW_START + i * ROW_GAP },
      data: {
        name: server.region,
        icon: 'Server',
        volume: server.status,
        status: server.status === 'healthy' ? 'online' : 'error',
      },
    });
  });

  const edges: Edge[] = [];

  const makeEdge = (
    id: string,
    source: string,
    sourceHandle: string,
    target: string,
    targetHandle: string
  ) => ({
    id,
    source,
    sourceHandle,
    target,
    targetHandle,
    type: 'step',
    animated: activeEdgeIds.has(id),
    data: {
      active: activeEdgeIds.has(id),
      label: target,
    },
  });

  edges.push(makeEdge('fe-api', 'frontend', 'right', 'api', 'left'));
  edges.push(makeEdge('fe-canvas', 'frontend', 'bottom', 'canvas', 'top'));
  edges.push(makeEdge('canvas-api', 'canvas', 'right', 'api', 'left'));
  edges.push(makeEdge('api-det', 'api', 'bottom', 'detection', 'top'));
  edges.push(makeEdge('api-img', 'api', 'bottom', 'image-store', 'top'));
  edges.push(makeEdge('api-dbd', 'api', 'right', 'db-detections', 'left'));
  edges.push(makeEdge('api-dbp', 'api', 'right', 'db-prompts', 'left'));
  edges.push(makeEdge('api-llm', 'api', 'right', 'llm-optimizer', 'left'));
  edges.push(makeEdge('img-det', 'image-store', 'top', 'detection', 'bottom'));
  edges.push(makeEdge('dbd-canvas', 'db-detections', 'bottom', 'canvas', 'right'));
  edges.push(makeEdge('llm-pe', 'llm-optimizer', 'left', 'prompt-engine', 'right'));
  edges.push(makeEdge('llm-dbp', 'llm-optimizer', 'right', 'db-prompts', 'left'));
  edges.push(makeEdge('pe-api', 'prompt-engine', 'bottom', 'api', 'top'));
  edges.push(makeEdge('pe-dbp', 'prompt-engine', 'right', 'db-prompts', 'left'));

  projectLayers.forEach((layer) => {
    const llmId = `llm-${layer.id}`;
    edges.push(makeEdge(`det-${llmId}`, 'detection', 'right', llmId, 'left'));
    edges.push(makeEdge(`${llmId}-llmopt`, llmId, 'right', 'llm-optimizer', 'left'));
    edges.push(makeEdge(`pe-${llmId}`, 'prompt-engine', 'bottom', llmId, 'top'));
  });

  projectServers.forEach((server) => {
    edges.push(makeEdge(`server-${server.id}-api`, server.id, 'left', 'api', 'right'));
    edges.push(makeEdge(`server-${server.id}-dbd`, server.id, 'left', 'db-detections', 'right'));
    edges.push(makeEdge(`server-${server.id}-dbp`, server.id, 'left', 'db-prompts', 'right'));
  });

  return { nodes, edges };
};

export const getAllGraphGroups = (): GraphGroups[] => [
  {
    id: 'tags',
    color: '#7c6aed',
    icon: 'Tag',
    urlRoute: '/settings/tags/',
    urlQuery: '/settings/tags?search=',
  },
  {
    id: 'layout',
    color: '#4a9eff',
    icon: 'LayoutTemplate',
    urlRoute: '/settings/layouts/',
    urlQuery: '/settings/layouts?search=',
  },
  {
    id: 'roles',
    color: '#3ecf8e',
    icon: 'Key',
    urlRoute: '/settings/members/roles?role=',
    urlQuery: '/settings/members/roles?search=',
  },
  {
    id: 'users',
    color: '#f97316',
    icon: 'User',
    urlRoute: '/settings/members?user=',
    urlQuery: '/settings/members?search=',
  },
  {
    id: 'project',
    color: '#ba32c7',
    icon: 'Box',
    urlRoute: '/',
    urlQuery: '/?search=',
  },
];

const ALL_LOGS: (Log & { projectId?: string })[] = [
  {
    id: 'log-gemini-001',
    serviceId: 'gemini',
    projectId: 'area',
    type: 'POST',
    request: '/internal/gemini/process-image',
    status: 200,
    time: '2026-08-12T03:20:00.000Z',
    response: { processed: true, detections: 4, model: 'gemini-2.5-flash' },
  },
  {
    id: 'log-gemini-002',
    serviceId: 'gemini',
    projectId: 'area',
    type: 'POST',
    request: '/internal/gemini/process-image',
    status: 500,
    time: '2026-08-12T03:18:00.000Z',
    response: { processed: false },
    error: {
      code: 'MODEL_TIMEOUT',
      message: 'The model did not respond before the timeout limit.',
      details: { timeoutMs: 30000, retryable: true },
    },
  },
  {
    id: 'log-db-detections-001',
    serviceId: 'db-detections',
    projectId: 'area',
    type: 'GET',
    request: '/api/detections/session-1044',
    status: 200,
    time: '2026-08-12T03:19:58.000Z',
    response: { records: 148, version: 'B' },
  },
  {
    id: 'log-api-001',
    serviceId: 'api',
    projectId: 'area',
    type: 'POST',
    request: '/api/sessions/run-detection',
    status: 200,
    time: '2026-08-12T03:19:50.000Z',
    response: { sessionId: 'session-1044', status: 'processing' },
  },
  {
    id: 'log-image-store-001',
    serviceId: 'image-store',
    projectId: 'area',
    type: 'GET',
    request: '/storage/session-1044/images',
    status: 200,
    time: '2026-08-12T03:19:55.000Z',
    response: { images: 7, bucket: 'project-images' },
  },
  {
    id: 'log-api-002',
    serviceId: 'api',
    projectId: 'simple',
    type: 'POST',
    request: '/api/sessions/run-detection',
    status: 200,
    time: '2026-08-12T03:21:00.000Z',
    response: { sessionId: 'session-1045', status: 'processing' },
  },
  {
    id: 'log-llm-opt-001',
    serviceId: 'llm-optimizer',
    projectId: 'simple',
    type: 'POST',
    request: '/internal/llm-optimizer/improve-prompt',
    status: 200,
    time: '2026-08-12T03:21:10.000Z',
    response: { improved: true, version: 'v3.9' },
  },
  {
    id: 'log-db-prompts-001',
    serviceId: 'db-prompts',
    projectId: 'tags',
    type: 'POST',
    request: '/api/prompts/save',
    status: 200,
    time: '2026-08-12T03:22:00.000Z',
    response: { saved: true, promptId: 'p-005' },
  },
  {
    id: 'log-detection-001',
    serviceId: 'detection',
    projectId: 'tags',
    type: 'POST',
    request: '/internal/detection/run',
    status: 200,
    time: '2026-08-12T03:22:05.000Z',
    response: { detections: 12, sessionId: 'S-1045' },
  },
];

export const getLogs = (projectId?: string, serviceId?: string): Log[] => {
  return ALL_LOGS.filter((log) => {
    if (projectId && log.projectId !== projectId) return false;
    if (serviceId && log.serviceId !== serviceId) return false;
    return true;
  });
};

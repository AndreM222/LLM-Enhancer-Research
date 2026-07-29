'use client';

import { ChartAreaInteractive } from '@/components/charts';
import { getProjects } from '@/components/project-cards';
import { ProjectSwitcher } from '@/components/project-switcher';
import { Correction } from '@/components/tables/correction-columns';
import { CorrectionsTable } from '@/components/tables/corrections-table';
import { UsageTable } from '@/components/tables/usage-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FaFileExport } from 'react-icons/fa6';

type MetricProps = {
  label: string;
  value: string;
  hint?: string;
};

const correctionsData: Correction[] = [
  {
    id: '124',
    name: 'Pallet',
    detections: 3120,
    corrections: 1184,
    description: '',
  },
  {
    id: '12577',
    name: ' Forklift',
    detections: 980,
    corrections: 210,
    description: '',
  },
  {
    id: '12246',
    name: 'Person',
    detections: 1540,
    corrections: 432,
    description: '',
  },
];

const MetricItem = ({ label, value, hint }: MetricProps) => (
  <div className="space-y-1">
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <p className="text-2xl font-semibold tabular-nums">{value}</p>
    {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
  </div>
);

export default function AnalyticsPage() {
  const projects = getProjects();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <ProjectSwitcher projects={projects} />
        <Button variant="outline" title="Export analytics">
          <FaFileExport className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Overview metrics */}
      <Card>
        <CardHeader className="flex items-center justify-between pb-3">
          <div>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Last 30 days · Selected project.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <MetricItem label="Sessions" value="312" hint="Unique image runs with detections." />
            <MetricItem
              label="Detections"
              value="7,842"
              hint="Total boxes produced by the model."
            />
            <MetricItem label="Average accuracy" value="89%" hint="Across validated sessions." />
            <MetricItem
              label="Correction rate"
              value="38%"
              hint="Detections that needed human edits."
            />
          </div>
        </CardContent>
      </Card>

      {/* Main interactive multi-metric chart */}
      <ChartAreaInteractive
        title="Sessions, detections, and correction rate"
        description="Trend over the last 30 days."
        xAxisKey="day"
        dataKeys={['sessions', 'detections', 'correctionRate']}
        chartData={[
          { day: '2026-07-01', sessions: 42, detections: 730, correctionRate: 0.36 },
          { day: '2026-07-02', sessions: 38, detections: 640, correctionRate: 0.33 },
          { day: '2026-07-03', sessions: 51, detections: 810, correctionRate: 0.4 },
          { day: '2026-07-04', sessions: 47, detections: 765, correctionRate: 0.35 },
          { day: '2026-07-05', sessions: 39, detections: 702, correctionRate: 0.32 },
        ]}
        chartConfig={{
          sessions: { label: 'Sessions', color: 'var(--chart-1)' },
          detections: { label: 'Detections', color: 'var(--chart-2)' },
          correctionRate: { label: 'Correction rate', color: 'var(--chart-3)' },
        }}
      />

      {/* Breakdown cards: table + secondary chart */}
      <div className="grid gap-4 xl:grid-cols-2">
        {/* Corrections by label table */}
        <Card>
          <CardHeader>
            <CardTitle>Corrections by label</CardTitle>
            <CardDescription>Which detection types need the most review.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <CorrectionsTable data={correctionsData} onOpen={() => console.log('Open')} />
          </CardContent>
        </Card>

        {/* Sessions by environment chart */}
        <ChartAreaInteractive
          title="Sessions by environment"
          description="Where most detections are happening."
          xAxisKey="environment"
          dataKeys={['sessions']}
          chartData={[
            { environment: 'Loading dock', sessions: 108 },
            { environment: 'Entrance', sessions: 79 },
            { environment: 'Storage aisle', sessions: 63 },
          ]}
          chartConfig={{
            sessions: { label: 'Sessions', color: 'var(--chart-1)' },
          }}
        />

        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>Summary of data usage throughout the project.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <UsageTable data={projects[0].usage} onOpen={() => console.log('Open')} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

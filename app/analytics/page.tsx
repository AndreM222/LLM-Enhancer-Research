'use client';

import { ChartAreaInteractive } from '@/components/charts';
import { getProjects } from '@/components/project-cards';
import { ProjectSwitcher } from '@/components/project-switcher';
import { Correction } from '@/components/tables/correction-columns';
import { CorrectionsTable } from '@/components/tables/corrections-table';
import { UsageTable } from '@/components/tables/usage-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTags } from '@/lib/mockApi';
import { useRouter } from 'next/navigation';
import { FaFileExport } from 'react-icons/fa6';

type MetricProps = {
  label: string;
  value: string;
  hint?: string;
};

const correctionsData: Correction[] = [
  {
    id: getTags()[0].tags[0].id,
    name: getTags()[0].tags[0].name,
    detections: 3120,
    corrections: 1184,
    description: getTags()[0].tags[0].description,
  },
  {
    id: getTags()[0].tags[1].id,
    name: getTags()[0].tags[1].name,
    detections: 980,
    corrections: 210,
    description: getTags()[0].tags[1].description,
  },
  {
    id: getTags()[0].tags[2].id,
    name: getTags()[0].tags[2].name,
    detections: 1540,
    corrections: 432,
    description: getTags()[0].tags[2].description,
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
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <ProjectSwitcher projects={projects} />
        <Button variant="outline" title="Export analytics">
          <FaFileExport className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

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

      <ChartAreaInteractive
        title="Sessions, detections, and correction rate"
        description="Comparison of correction per detections."
        xAxisKey="day"
        xAxisType="date"
        dataKeys={['detections', 'corrections']}
        chartData={[
          { day: '2026-07-01', detections: 730, corrections: 500 },
          { day: '2026-07-02', detections: 640, corrections: 439 },
          { day: '2026-07-03', detections: 810, corrections: 700 },
          { day: '2026-07-04', detections: 765, corrections: 30 },
          { day: '2026-07-05', detections: 702, corrections: 40 },
        ]}
        chartConfig={{
          detections: { label: 'Detections', color: 'var(--chart-1)' },
          corrections: { label: 'Corrections', color: 'var(--chart-2)' },
        }}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Corrections by label</CardTitle>
            <CardDescription>Which detection types need the most review.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <CorrectionsTable
              data={correctionsData}
              onOpen={(id) => router.push(`/settings/tags/${id ?? ''}`)}
              pageSize={6}
            />
          </CardContent>
        </Card>

        <ChartAreaInteractive
          title="Detection by sessions"
          description="Where most detections are happening."
          xAxisKey="environment"
          xAxisType="category"
          dataKeys={['sessions']}
          chartData={[
            { environment: 'Loading dock', sessions: 108 },
            { environment: 'Entrance', sessions: 74 },
            { environment: 'Storage aisle', sessions: 63 },
          ]}
          chartConfig={{
            sessions: { label: 'Sessions', color: 'var(--chart-1)' },
          }}
        />

        <ChartAreaInteractive
          title="Sessions created"
          description="Total sessions being created."
          xAxisKey="day"
          xAxisType="date"
          dataKeys={['sessions']}
          chartData={[
            { day: '2026-07-01', sessions: 42 },
            { day: '2026-07-02', sessions: 38 },
            { day: '2026-07-03', sessions: 51 },
            { day: '2026-07-04', sessions: 47 },
            { day: '2026-07-05', sessions: 39 },
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
            <UsageTable data={projects[0].usage} pageSize={4} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

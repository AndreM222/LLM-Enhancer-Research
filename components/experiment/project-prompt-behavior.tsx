// components/prompts/project-prompt-behavior.tsx

'use client';

import { Activity, Clock3, DollarSign, Gauge, Hash, TriangleAlert } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { ProjectPromptMetric } from '@/lib/mockApi';

export function ProjectPromptBehavior({ metric }: { metric?: ProjectPromptMetric }) {
  if (!metric) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          No behavior data is available for this prompt yet.
        </CardContent>
      </Card>
    );
  }

  const successRate =
    metric.runs === 0 ? 0 : Math.round((metric.successfulRuns / metric.runs) * 100);

  const failureRate = metric.runs === 0 ? 0 : Math.round((metric.failedRuns / metric.runs) * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Project behavior</CardTitle>

          <Badge variant="outline">{metric.runs.toLocaleString()} runs</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            icon={<Gauge className="size-4" />}
            label="Accuracy"
            value={`${metric.accuracy}%`}
          />

          <MetricCard
            icon={<Activity className="size-4" />}
            label="Success rate"
            value={`${successRate}%`}
          />

          <MetricCard
            icon={<TriangleAlert className="size-4" />}
            label="Failure rate"
            value={`${failureRate}%`}
          />

          <MetricCard
            icon={<Clock3 className="size-4" />}
            label="Average latency"
            value={formatDuration(metric.averageLatencyMs)}
          />

          <MetricCard
            icon={<Hash className="size-4" />}
            label="Average tokens"
            value={(metric.averageInputTokens + metric.averageOutputTokens).toLocaleString()}
          />

          <MetricCard
            icon={<DollarSign className="size-4" />}
            label="Estimated cost"
            value={`$${metric.estimatedCost.toFixed(2)}`}
          />
        </div>

        <p className="mt-4 text-xs text-muted-foreground">Last run {metric.lastRun}</p>
      </CardContent>
    </Card>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-muted/20 p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

function formatDuration(milliseconds: number) {
  if (milliseconds < 1000) {
    return `${milliseconds} ms`;
  }

  return `${(milliseconds / 1000).toFixed(2)} s`;
}

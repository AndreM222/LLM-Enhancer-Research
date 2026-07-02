import { ChartArea } from '@/components/charts';
import PromptDiff from '@/components/promptDiff';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FaFileExport } from 'react-icons/fa6';

const MetricsCard = ({ title, value }: { title: string; value: string }) => (
  <Card>
    <CardHeader>
      <CardDescription>{title}</CardDescription>
    </CardHeader>
    <CardContent>
      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
        {value}
      </CardTitle>
    </CardContent>
  </Card>
);

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <Button variant="outline">
        <FaFileExport /> Export
      </Button>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricsCard title="Best accuracy" value="92%" />

        <MetricsCard title="Correction rate" value="38%" />

        <MetricsCard title="Prompt improvement" value="6.4%" />

        <MetricsCard title="Human edits" value="148" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartArea
          title="Accuracy over time"
          description="January - June 2024"
          xAxisKey="month"
          dataKeys={['desktop', 'mobile']}
          chartData={[
            { month: 'January', desktop: 186, mobile: 80 },
            { month: 'February', desktop: 305, mobile: 200 },
          ]}
          chartConfig={{
            desktop: { label: 'Desktop', color: 'var(--chart-1)' },
            mobile: { label: 'Mobile', color: 'var(--chart-2)' },
          }}
        />

        <ChartArea
          title="Correction breakdown"
          description="January - June 2024"
          xAxisKey="month"
          dataKeys={['desktop', 'mobile']}
          chartData={[
            { month: 'January', desktop: 186, mobile: 80 },
            { month: 'February', desktop: 305, mobile: 200 },
          ]}
          chartConfig={{
            desktop: { label: 'Desktop', color: 'var(--chart-1)' },
            mobile: { label: 'Mobile', color: 'var(--chart-2)' },
          }}
        />
      </div>

      <PromptDiff />

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border p-5">
          <h2 className="font-medium">Experiment notes</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Store observations about false positives, edge cases, and model behavior.
          </p>
        </div>
      </div>
    </div>
  );
}

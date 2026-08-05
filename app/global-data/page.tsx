'use client';

import { useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { getGlobalActivity } from '@/lib/mockApi';
import { GlobalActivityTable } from '@/components/tables/global-table';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

function MiniTrend({ data }: { data: number[] }) {
  const points = data.map((v, i) => ({ i, v }));
  return (
    <div className="h-8 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points}>
          <Area
            type="monotone"
            dataKey="v"
            stroke="var(--chart-1)"
            fill="var(--chart-1)"
            fillOpacity={0.15}
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function GlobalActivityPage() {
  const { summary, countries } = getGlobalActivity();

  const maxRequests = useMemo(() => Math.max(...countries.map((c) => c.requests)), [countries]);
  const byCountryName = useMemo(() => new Map(countries.map((c) => [c.name, c])), [countries]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-4">
        {summary.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="space-y-2 pt-6">
              <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-semibold tabular-nums">{metric.value}</p>
                {metric.delta ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-500">
                    <ArrowUpRight className="h-3 w-3" />
                    {metric.delta}
                  </span>
                ) : null}
              </div>
              <MiniTrend data={metric.trend} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="h-105 w-full bg-muted/20">
              <ComposableMap projectionConfig={{ scale: 140 }}>
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const match = byCountryName.get(geo.properties.name);
                      const intensity = match ? match.requests / maxRequests : 0;

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          style={{
                            default: {
                              fill: match
                                ? `color-mix(in srgb, var(--chart-1) ${Math.max(intensity * 100, 12)}%, transparent)`
                                : 'var(--muted)',
                              stroke: 'var(--border)',
                              strokeWidth: 0.4,
                              outline: 'none',
                            },
                            hover: {
                              fill: 'var(--chart-1)',
                              outline: 'none',
                            },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requests by country</CardTitle>
            <CardDescription>Where detection traffic is coming from.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <GlobalActivityTable data={[countries[0]]} pageSize={10} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getServerActivity } from '@/lib/mockApi';
import { ServerActivityTable } from '@/components/tables/global-table';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export default function ServerActivityPage() {
  const servers = getServerActivity();
  const maxRequests = Math.max(...servers.map((s) => s.requests));

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Server locations</CardTitle>
          <CardDescription>
            Where this project's detection infrastructure is deployed.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-105 w-full bg-muted/20">
            <ComposableMap projectionConfig={{ scale: 140 }}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: 'var(--muted)',
                          stroke: 'var(--border)',
                          strokeWidth: 0.4,
                          outline: 'none',
                        },
                      }}
                    />
                  ))
                }
              </Geographies>

              {servers.map((server) => {
                const intensity = server.requests / maxRequests;
                const radius = 6 + intensity * 10;

                return (
                  <Marker key={server.id} coordinates={[server.lon, server.lat]}>
                    <circle r={radius} fill="var(--chart-1)" fillOpacity={0.2} />
                    <circle r={4} fill="var(--chart-1)" />
                    <text
                      textAnchor="middle"
                      y={-radius - 6}
                      className="fill-foreground text-[10px] font-medium"
                    >
                      {server.region}
                    </text>
                  </Marker>
                );
              })}
            </ComposableMap>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Servers</CardTitle>
          <CardDescription>Add regions as demand shows up in Global Activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <ServerActivityTable data={servers} />
        </CardContent>
      </Card>
    </div>
  );
}

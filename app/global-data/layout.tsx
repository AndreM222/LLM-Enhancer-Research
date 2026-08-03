'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectSwitcher } from '@/components/project-switcher';
import { getProjects } from '@/components/project-cards';

const TABS = [
  { value: 'global', label: 'Global Activity', href: '/global-data' },
  { value: 'servers', label: 'Server Activity', href: '/global-data/servers' },
];

export default function ActivityLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const projects = getProjects();

  const activeTab = TABS.find((tab) => tab.href === pathname)?.value ?? TABS[0].value;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <ProjectSwitcher projects={projects} />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          const tab = TABS.find((t) => t.value === value);
          if (tab) router.push(tab.href);
        }}
      >
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {children}
    </div>
  );
}

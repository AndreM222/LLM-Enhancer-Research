'use client';

import { Project } from '@/components/project-cards';
import { ProjectSwitcher } from '@/components/project-switcher';
import PromptDiff from '@/components/promptDiff';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getProjects, getPrompts } from '@/lib/mockApi';
import { FaFileExport } from 'react-icons/fa6';

const prompts = getPrompts();

export default function Prompts() {
  const projects: Project[] = getProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <ProjectSwitcher projects={projects} />
        <Button variant="outline" title="Export analytics">
          <FaFileExport className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <PromptDiff />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {prompts.map((prompt) => (
          <Card key={prompt.id}>
            <CardHeader>
              <CardTitle>{prompt.name}</CardTitle>
              <CardAction>
                <Badge>{prompt.status}</Badge>
              </CardAction>
            </CardHeader>

            <CardContent>
              <CardDescription>{prompt.description}</CardDescription>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Accuracy</span>
                <span className="font-medium">{prompt.accuracy}</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Updated</span>
                <span>{prompt.updated}</span>
              </div>
            </CardContent>

            <CardFooter className="grid grid-cols-2 gap-1">
              <Button>View</Button>
              <Button>Compare</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

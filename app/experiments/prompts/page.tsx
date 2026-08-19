'use client';

import { useEffect, useMemo, useState } from 'react';
// import { useParams } from 'next/navigation';
import { FaFileExport } from 'react-icons/fa6';

import type { Project } from '@/components/cards/project-cards';

import { ProjectSwitcher } from '@/components/project-switcher';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { getProjectById, getProjectPromptUsage, getProjects } from '@/lib/mockApi';

import PromptDiff from '@/components/promptDiff';
import { ProjectPromptBehavior } from '@/components/experiment/project-prompt-behavior';

export default function Prompts() {
  // const params = useParams<{ project: string }>();
  // const projectId = params.project;
  const params = getProjects()[0].id;
  const projectId = params;

  const projects: Project[] = getProjects();
  const project = getProjectById(projectId);

  const promptUsage = useMemo(() => getProjectPromptUsage(projectId), [projectId]);

  const uniquePromptUsage = useMemo(() => {
    const seen = new Set<string>();

    return promptUsage.filter((usage) => {
      if (seen.has(usage.prompt.id)) {
        return false;
      }

      seen.add(usage.prompt.id);
      return true;
    });
  }, [promptUsage]);

  const [selectedPromptId, setSelectedPromptId] = useState<string>();

  useEffect(() => {
    setSelectedPromptId((currentId) => {
      if (currentId && uniquePromptUsage.some((usage) => usage.prompt.id === currentId)) {
        return currentId;
      }

      return uniquePromptUsage[0]?.prompt.id;
    });
  }, [uniquePromptUsage]);

  const selectedUsage = uniquePromptUsage.find((usage) => usage.prompt.id === selectedPromptId);

  if (!project) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project not found</CardTitle>

          <CardDescription>This project does not exist or is no longer available.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">Prompts</h1>

            <Badge variant="outline">{project.name}</Badge>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Review the LLM prompts used by this project&apos;s layouts and monitor their behavior.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ProjectSwitcher projects={projects} />

          <Button variant="outline" title="Export prompts">
            <FaFileExport className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {uniquePromptUsage.length === 0 ? (
        <NoProjectPrompts />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {uniquePromptUsage.map((usage) => {
              const isSelected = usage.prompt.id === selectedPromptId;

              const usageLocations = promptUsage.filter(
                (item) => item.prompt.id === usage.prompt.id
              );

              return (
                <button
                  key={usage.prompt.id}
                  type="button"
                  onClick={() => setSelectedPromptId(usage.prompt.id)}
                  className="text-left"
                >
                  <Card
                    className={
                      isSelected
                        ? 'h-full border-primary ring-2 ring-primary/20'
                        : 'h-full transition-colors hover:border-primary/50'
                    }
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <CardTitle className="truncate text-base">{usage.prompt.name}</CardTitle>

                          <CardDescription className="mt-1">
                            {usageLocations.length > 1
                              ? `${usageLocations.length} layout locations`
                              : usage.layout.name}
                          </CardDescription>
                        </div>

                        <Badge variant="outline">{usage.prompt.model}</Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {usage.prompt.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {usageLocations.map((location) => (
                          <Badge
                            key={`${location.layout.id}-${location.step?.id ?? 'layout'}`}
                            variant="secondary"
                          >
                            {location.layout.name}
                            {location.step ? ` · ${location.step.title}` : ''}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <PromptStat
                          label="Accuracy"
                          value={usage.metric ? `${usage.metric.accuracy}%` : '—'}
                        />

                        <PromptStat
                          label="Runs"
                          value={usage.metric ? usage.metric.runs.toLocaleString() : '—'}
                        />

                        <PromptStat label="Version" value={usage.prompt.version} />

                        <PromptStat label="Last run" value={usage.metric?.lastRun ?? 'Never'} />
                      </div>

                      <div className="rounded-lg border bg-muted/20 p-3">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                          Prompt preview
                        </p>

                        <pre className="max-h-32 overflow-auto whitespace-pre-wrap text-xs leading-5">
                          {usage.prompt.content}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              );
            })}
          </div>

          {selectedUsage && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {promptUsage
                  .filter((usage) => usage.prompt.id === selectedUsage.prompt.id)
                  .map((usage) => (
                    <Badge
                      key={`${usage.layout.id}-${usage.step?.id ?? 'layout'}`}
                      variant="outline"
                    >
                      {usage.layout.name}
                      {usage.step ? ` · ${usage.step.title}` : ' · Layout-level'}
                    </Badge>
                  ))}
              </div>

              <ProjectPromptBehavior metric={selectedUsage.metric} />

              <PromptDiff
                promptName={selectedUsage.prompt.name}
                current={{
                  id: selectedUsage.prompt.id,
                  version: selectedUsage.prompt.version,
                  accuracy: selectedUsage.metric?.accuracy ?? 0,
                  content: selectedUsage.prompt.content,
                  updated: selectedUsage.prompt.updated,
                }}
                previous={{
                  id: `${selectedUsage.prompt.id}-previous`,
                  version: getPreviousVersion(selectedUsage.prompt.version),
                  accuracy: Math.max((selectedUsage.metric?.accuracy ?? 0) - 3, 0),
                  content:
                    'Look for visible issues in the image and return bounding boxes for detected problems.',
                  updated: 'Previous version',
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PromptStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/20 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 truncate font-medium">{value}</p>
    </div>
  );
}

function getPreviousVersion(version: string) {
  const match = version.match(/^v(\d+)$/);

  if (!match) {
    return 'Previous';
  }

  const previous = Math.max(Number(match[1]) - 1, 1);

  return `v${previous}`;
}

function NoProjectPrompts() {
  return (
    <Card>
      <CardContent className="flex min-h-60 flex-col items-center justify-center text-center">
        <div className="rounded-full bg-muted p-3">
          <FaFileExport className="size-5 text-muted-foreground" />
        </div>

        <h2 className="mt-4 font-semibold">No LLM prompts configured</h2>

        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          This project&apos;s connected layouts do not currently use Gemini or another LLM-based
          processing step.
        </p>
      </CardContent>
    </Card>
  );
}

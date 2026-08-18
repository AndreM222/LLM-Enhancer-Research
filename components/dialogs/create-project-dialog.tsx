'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Project, ProjectIcon } from '@/components/cards/project-cards';

import { ProjectIconDialog, type IconName } from '@/components/dialogs/project-icon';

import { ProjectBanner } from '@/components/project-switcher';

export type CreateProjectInput = {
  name: string;
  copyFromId: string;
  icon: IconName;
  color: string;
};

type ProjectCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  onCreate: (input: CreateProjectInput) => void;
};

const DEFAULT_ICON: IconName = 'Folder';
const DEFAULT_COLOR = '#7c3aed';

export function ProjectCreateDialog({
  open,
  onOpenChange,
  projects,
  onCreate,
}: ProjectCreateDialogProps) {
  const [projectName, setProjectName] = useState('');
  const [copyFromId, setCopyFromId] = useState('none');
  const [selectedIcon, setSelectedIcon] = useState<IconName>(DEFAULT_ICON);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [iconDialogOpen, setIconDialogOpen] = useState(false);

  const resetForm = () => {
    setProjectName('');
    setCopyFromId('none');
    setSelectedIcon(DEFAULT_ICON);
    setSelectedColor(DEFAULT_COLOR);
    setIconDialogOpen(false);
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value);

    if (!value) {
      resetForm();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = projectName.trim();

    if (!name) {
      toast.error('Project name is required.');
      return;
    }

    onCreate({
      name,
      copyFromId,
      icon: selectedIcon,
      color: selectedColor,
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create project</DialogTitle>

              <DialogDescription>
                Give your project a name and optionally copy the settings from an existing project.
                You&apos;ll be taken to settings after creation.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 py-5">
              <div className="flex items-center gap-4 rounded-xl border p-4">
                <ProjectIcon icon={selectedIcon} color={selectedColor} size="md" />

                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="truncate text-sm font-medium">{selectedIcon}</p>

                  <p className="text-xs text-muted-foreground">{selectedColor}</p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIconDialogOpen(true)}
                >
                  Change icon
                </Button>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="project-name">Project name</Label>

                <Input
                  id="project-name"
                  placeholder="e.g. Japan Damage Detection"
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  maxLength={48}
                  autoFocus
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="copy-from">Copy settings from</Label>

                <Select value={copyFromId} onValueChange={setCopyFromId}>
                  <SelectTrigger id="copy-from">
                    <SelectValue placeholder="Start from scratch" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">Start from scratch</SelectItem>

                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <ProjectBanner
                          icon={project.icon}
                          name={project.name}
                          description={project.description}
                          color={project.color}
                          size="xs"
                        />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {copyFromId !== 'none' && (
                  <p className="text-xs text-muted-foreground">
                    Layers, tags, layouts, and settings will be copied. You can adjust everything
                    after creation.
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>

              <Button type="submit" disabled={!projectName.trim()}>
                Create project
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ProjectIconDialog
        open={iconDialogOpen}
        onOpenChange={setIconDialogOpen}
        value={{
          icon: selectedIcon,
          color: selectedColor,
        }}
        onSave={(next) => {
          setSelectedIcon(next.icon);
          setSelectedColor(next.color);
        }}
      />
    </>
  );
}

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconName, ProjectIconDialog } from '@/components/dialogs/project-icon';
import { Suspense, useEffect, useState } from 'react';
import { TagGroup } from '@/components/tables/tags-columns';
import { User } from '@/components/tables/users-columns';
import { LinkUsersTable } from '@/components/tables/users-table';
import { LinkLayoutsTable } from '@/components/tables/layouts-table';
import { LayoutTableData } from '@/components/tables/layouts-columns';
import LinkGraph from '@/components/linkGraph';
import {
  getProjectTags,
  getProjectUsers,
  getUsers,
  getProjectRoles,
  getProjectLayouts,
  getProjectServers,
  getProjectLinkedProjects,
  getRoles,
  getProjects,
  getProjectLinks,
  getProjectLayers,
} from '@/lib/mockApi';
import { LinkServerTable } from '@/components/tables/global-table';
import { ServerActivity, StatusIndicator } from '@/components/tables/global-columns';
import { Project, ProjectIcon } from '@/components/cards/project-cards';
import { Plus } from 'lucide-react';
import { LinkDetectionTable } from '@/components/tables/detection-table';
import Flag from 'react-world-flags';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'motion/react';
import { AccountBanner } from '@/components/account-banner';
import { Role } from '@/components/tables/roles-columns';
import { LinkedRolesTable } from '@/components/tables/roles-table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ProjectBanner } from '@/components/project-switcher';
import { AddRow } from '@/components/forms/table-input';
import { LayerCard } from '@/components/cards/layer-cards';

const tagsList: TagGroup[] = getProjectTags();

type DetectionLayer = {
  id: string;
  position: number;
  model: string;
  tags: TagGroup[];
};

function ProjectSettingsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { project } = useParams<{ project: string }>();
  const { nodes, groups, links } = getProjectLinks(project);
  const allUsers: User[] = getUsers();
  const allRoles: Role[] = getRoles();
  const allLayouts: LayoutTableData[] = getProjectLayouts();
  const allServers: ServerActivity[] = getProjectServers();
  const allProjects: Project[] = getProjects();

  const projectItems: Project | undefined = allProjects.find((curr) => curr.id === project);
  const projectUsers: User[] = getProjectUsers(project ?? '');
  const projectRoles: Role[] = getProjectRoles(project ?? '');
  const projectLayouts: LayoutTableData[] = getProjectLayouts(project ?? '');
  const projectServers: ServerActivity[] = getProjectServers(project ?? '');
  const projectLinksData: Project[] = project ? getProjectLinkedProjects(project) : [];

  const [openIcon, setOpenIcon] = useState(searchParams.get('dialog') === 'project-icon');
  const [selectedIcon, setSelectedIcon] = useState<IconName>(projectItems?.icon ?? 'Folder');
  const [selectedColor, setSelectedColor] = useState(projectItems?.color ?? '');
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  const initialLayers = getProjectLayers(project ?? '');
  const [layers, setLayers] = useState<DetectionLayer[]>(
    initialLayers && initialLayers.length
      ? initialLayers
      : [{ id: crypto.randomUUID(), position: 1, model: 'YOLOv8', tags: tagsList ?? [] }]
  );
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>(projectUsers);
  const [userValue, setUserValue] = useState('');

  const [roles, setRoles] = useState<Role[]>(projectRoles);
  const [roleValue, setRoleValue] = useState('');

  const [layouts, setLayouts] = useState<LayoutTableData[]>(projectLayouts);
  const [layoutValue, setLayoutValue] = useState('');

  const [servers, setServers] = useState<ServerActivity[]>(projectServers);
  const [serverValue, setServerValue] = useState('');

  const [projectLinks, setProjectLinks] = useState<Project[]>(projectLinksData);
  const [projectLinkValue, setProjectLinkValue] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const canDelete = deleteConfirm === projectItems?.name;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(
    searchParams.get('dialog') === 'delete-project'
  );

  useEffect(() => {
    setOpenIcon(searchParams.get('dialog') === 'project-icon');
    setDeleteDialogOpen(searchParams.get('dialog') === 'delete-project');
  }, [searchParams]);

  const handleDeleteProject = () => {
    if (!canDelete) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('dialog', 'delete-project');
    router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    toast.error('Project deleted.');
    setDeleteDialogOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('dialog');
    router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
  };

  const swapLayers = (indexA: number, indexB: number) => {
    setLayers((prev) => {
      const next = [...prev];
      [next[indexA], next[indexB]] = [next[indexB], next[indexA]];
      return next.map((l, i) => ({ ...l, position: i + 1 }));
    });
  };

  const reorderLayers = (layers: DetectionLayer[]) =>
    layers.map((layer, index) => ({
      ...layer,
      position: index + 1,
    }));

  const handleLayerDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;

    setLayers((prev) => {
      const from = prev.findIndex((l) => l.id === draggedId);
      const to = prev.findIndex((l) => l.id === targetId);

      if (from < 0 || to < 0) return prev;

      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);

      return reorderLayers(next);
    });

    setDraggedId(null);
    setDragOverId(null);
  };

  const moveLayerLeft = (id: string) => {
    const i = layers.findIndex((l) => l.id === id);
    if (i > 0) swapLayers(i - 1, i);
  };

  const moveLayerRight = (id: string) => {
    const i = layers.findIndex((l) => l.id === id);
    if (i < layers.length - 1) swapLayers(i, i + 1);
  };

  const addLayer = () => {
    setLayers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), position: prev.length + 1, model: '', tags: [] },
    ]);
  };

  const removeLayer = (id: string) => {
    setLayers((prev) => {
      const next = prev.filter((l) => l.id !== id);
      return next.map((l, i) => ({ ...l, position: i + 1 }));
    });
  };

  const setLayerModel = (id: string, model: string) =>
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, model } : l)));

  const addTagToLayer = (layerId: string, tag: TagGroup) =>
    setLayers((prev) =>
      prev.map((l) =>
        l.id === layerId && !l.tags.some((t) => t.id === tag.id)
          ? { ...l, tags: [...l.tags, tag] }
          : l
      )
    );

  const removeTagFromLayer = (layerId: string, tagId: string) =>
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, tags: l.tags.filter((t) => t.id !== tagId) } : l))
    );

  const selectedUser = allUsers.find((u) => u.id === userValue) ?? null;
  const selectedRole = allRoles.find((u) => u.id === roleValue) ?? null;
  const selectedLayout = allLayouts.find((l) => l.id === layoutValue) ?? null;
  const selectedServer = allServers.find((s) => s.id === serverValue) ?? null;
  const selectedProjectLink = allProjects.find((p) => p.id === projectLinkValue) ?? null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project identity</CardTitle>
          <CardDescription>
            Edit the project name, description, icon, and brand color.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <ProjectIcon icon={selectedIcon} color={selectedColor} size="md" />
            <div className="space-y-1">
              <p className="font-medium">Current icon: {selectedIcon}</p>
              <p className="text-sm text-muted-foreground">Color: {selectedColor}</p>
            </div>
            <div className="ml-auto">
              <Button
                variant="outline"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('dialog', 'project-icon');
                  router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, {
                    scroll: false,
                  });
                  setOpenIcon(true);
                }}
              >
                Change icon
              </Button>
              <ProjectIconDialog
                open={openIcon}
                onOpenChange={(open) => {
                  setOpenIcon(open);
                  const params = new URLSearchParams(searchParams.toString());
                  if (open) params.set('dialog', 'project-icon');
                  else params.delete('dialog');
                  router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, {
                    scroll: false,
                  });
                }}
                value={{ icon: selectedIcon, color: selectedColor }}
                onSave={(next) => {
                  setSelectedIcon(next.icon);
                  setSelectedColor(next.color);
                }}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              placeholder={projectItems?.name}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              maxLength={32}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-description">Description</Label>
            <Input
              id="project-description"
              placeholder={projectItems?.description}
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <CardDescription>Please use 32 characters at maximum.</CardDescription>
          <Button disabled={!projectName.trim()} onClick={() => toast.success('Project saved.')}>
            Save
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>List of users with permission to interact.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AddRow
            items={allUsers}
            value={(() => {
              const user = allUsers.find((curr) => curr.id === userValue);

              return user ? `${user?.name ?? 'Unknown'} · ${user?.email ?? ''}` : '';
            })()}
            onValueChange={setUserValue}
            placeholder="Search users..."
            disabled={!selectedUser}
            onAdd={() => {
              if (!selectedUser || users.some((u) => u.id === selectedUser.id)) return;
              setUsers((prev) => [...prev, selectedUser]);
              setUserValue('');
              toast.success(`${selectedUser.name} added.`);
            }}
            renderItem={(curr) => <AccountBanner user={curr} />}
          />
          <LinkUsersTable
            pageSize={4}
            data={users}
            onDelete={(id) => {
              setUsers((prev) => prev.filter((u) => u.id !== id));
              toast.success('User removed.');
            }}
            onOpen={() => router.push('/')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>List of roles with permission to interact.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AddRow
            items={allRoles}
            value={(() => {
              const role = allRoles.find((curr) => curr.id === roleValue);

              return role?.name ?? '';
            })()}
            onValueChange={setRoleValue}
            placeholder="Search users..."
            disabled={!selectedRole}
            onAdd={() => {
              if (!selectedRole || roles.some((u) => u.id === selectedRole.id)) return;
              setRoles((prev) => [...prev, selectedRole]);
              setRoleValue('');
              toast.success(`${selectedRole.name} added.`);
            }}
            renderItem={(curr) => (
              <span className="flex flex-col">
                <span>{curr.name}</span>
                <span className="text-xs text-muted-foreground">{curr.description}</span>
              </span>
            )}
          />
          <LinkedRolesTable
            pageSize={4}
            data={roles}
            onDelete={(id) => {
              setRoles((prev) => prev.filter((u) => u.id !== id));
              toast.success('Role removed.');
            }}
            onOpen={() => router.push('/')}
          />
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Detection layers</CardTitle>
              <CardDescription>
                Each layer detects within boxes found by the layer before it.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addLayer} className="shrink-0">
              <Plus className="mr-2 h-4 w-4" /> Add layer
            </Button>
          </div>
        </CardHeader>
        <CardContent className="min-w-0">
          <ScrollArea>
            <div className="flex gap-4 p-2">
              <AnimatePresence initial={false} mode="popLayout">
                {layers.map((layer, index) => (
                  <LayerCard
                    key={layer.id}
                    layer={layer}
                    index={index}
                    total={layers.length}
                    allTags={tagsList}
                    onMoveLeft={moveLayerLeft}
                    onMoveRight={moveLayerRight}
                    onRemoveLayer={removeLayer}
                    onSetModel={setLayerModel}
                    onAddTag={addTagToLayer}
                    onRemoveTag={removeTagFromLayer}
                    draggedId={draggedId}
                    dragOverId={dragOverId}
                    setDragStart={setDraggedId}
                    setDragEnd={() => {
                      setDraggedId(null);
                      setDragOverId(null);
                    }}
                    setDragOver={setDragOverId}
                    onDrop={handleLayerDrop}
                  />
                ))}
              </AnimatePresence>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layouts</CardTitle>
          <CardDescription>Add layouts that modify how this project behaves.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AddRow
            items={allLayouts}
            value={(() => {
              const layout = allLayouts.find((curr) => curr.id === layoutValue);
              return layout?.name ?? '';
            })()}
            onValueChange={setLayoutValue}
            placeholder="Search layouts..."
            disabled={!selectedLayout}
            onAdd={() => {
              if (!selectedLayout || layouts.some((l) => l.id === selectedLayout.id)) return;
              setLayouts((prev) => [...prev, selectedLayout]);
              setLayoutValue('');
              toast.success(`${selectedLayout.name} added.`);
            }}
            renderItem={(l) => (
              <span className="flex flex-col">
                <span>{l.name}</span>
                <span className="text-xs text-muted-foreground">{l.description}</span>
              </span>
            )}
          />
          <LinkLayoutsTable
            pageSize={4}
            data={layouts}
            onDelete={(id) => {
              setLayouts((prev) => prev.filter((l) => l.id !== id));
              toast.success('Layout removed.');
            }}
            onOpen={() => router.push('/')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Servers</CardTitle>
          <CardDescription>Add servers for regions this project runs on.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AddRow
            items={allServers}
            value={(() => {
              const server = allServers.find((curr) => curr.id === serverValue);

              return server?.region ?? '';
            })()}
            onValueChange={setServerValue}
            placeholder="Search servers..."
            disabled={!selectedServer}
            onAdd={() => {
              if (!selectedServer || servers.some((s) => s.id === selectedServer.id)) return;
              setServers((prev) => [...prev, selectedServer]);
              setServerValue('');
              toast.success(`${selectedServer.region} added.`);
            }}
            renderItem={(s) => (
              <span className="flex items-center gap-2">
                <Flag code={s.countryCode} className="w-4 h-4" />
                <span className="flex flex-col">
                  <span>{s.region}</span>
                  <StatusIndicator status={s.status} />
                </span>
              </span>
            )}
          />
          <LinkServerTable
            pageSize={4}
            data={servers}
            onDelete={(id) => {
              setServers((prev) => prev.filter((s) => s.id !== id));
              toast.success('Server removed.');
            }}
            onOpen={() => router.push('/')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Linked Projects</CardTitle>
          <CardDescription>Add projects to link images.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AddRow
            items={allProjects}
            value={(() => {
              const project = allProjects.find((curr) => curr.id === projectLinkValue);

              return project?.name ?? '';
            })()}
            onValueChange={setProjectLinkValue}
            placeholder="Search projects..."
            disabled={!selectedProjectLink}
            onAdd={() => {
              if (!selectedProjectLink || projectLinks.some((p) => p.id === selectedProjectLink.id))
                return;
              setProjectLinks((prev) => [...prev, selectedProjectLink]);
              setProjectLinkValue('');
              toast.success(`${selectedProjectLink.name} linked.`);
            }}
            renderItem={(p) => (
              <ProjectBanner
                icon={p.icon}
                name={p.name}
                description={p.description}
                color={p.color}
                maxDescription={30}
                size="xs"
              />
            )}
          />
          <LinkDetectionTable
            pageSize={4}
            data={projectLinks}
            onDelete={(id) => {
              setProjectLinks((prev) => prev.filter((p) => p.id !== id));
              toast.success('Project unlinked.');
            }}
            onOpen={(id) => router.replace(`/${id}`)}
          />
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Delete Project</CardTitle>
          <CardDescription>This action is permanent and cannot be reversed.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder={projectItems?.name}
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
          />
        </CardContent>
        <CardFooter className="justify-between">
          <CardDescription>
            Type <b>{projectItems?.name}</b> to confirm deletion.
          </CardDescription>
          <Button variant="destructive" disabled={!canDelete} onClick={handleDeleteProject}>
            Delete Project
          </Button>

          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={(open) => {
              setDeleteDialogOpen(open);
              const params = new URLSearchParams(searchParams.toString());
              if (open) params.set('dialog', 'delete-project');
              else params.delete('dialog');
              router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, {
                scroll: false,
              });
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete <b>{projectItems?.name}</b>'s project and all
                  associated data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleConfirmDelete}
                >
                  Yes, delete project {projectItems?.name}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      <LinkGraph nodes={nodes} groups={groups} links={links} />
    </div>
  );
}

export default function ProjectSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
          Loading project settings...
        </div>
      }
    >
      <ProjectSettingsPageContent />
    </Suspense>
  );
}

'use client';

import {
  Card,
  CardAction,
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
import { useState } from 'react';
import { LinkTagGroupTable } from '@/components/tables/tags-table';
import { TagGroup } from '@/components/tables/tags-columns';
import { User } from '@/components/tables/users-columns';
import { LinkUsersTable } from '@/components/tables/users-table';
import { LinkLayoutsTable } from '@/components/tables/layouts-table';
import { Layout } from '@/components/tables/layouts-columns';
import LinkGraph from '@/components/linkGraph';
import {
  getProjectTags,
  getProjectUsers,
  getProjectLayouts,
  getProjectServers,
  getModelOptions,
  getRoles,
} from '@/lib/mockApi';
import { LinkServerTable } from '@/components/tables/global-table';
import { ServerActivity, ServerIndicator } from '@/components/tables/global-columns';
import { getProjects, Project, ProjectIcon } from '@/components/project-cards';
import { ChevronLeft, ChevronRight, Layers, Plus, X } from 'lucide-react';
import { LinkDetectionTable } from '@/components/tables/detection-table';
import Flag from 'react-world-flags';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ButtonGroup } from '@/components/ui/button-group';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
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

const tagsList: TagGroup[] = getProjectTags();
const usersList: User[] = getProjectUsers();
const rolesList: Role[] = getRoles();
const layoutList: Layout[] = getProjectLayouts();
const serversList: ServerActivity[] = getProjectServers();
const projectsList: Project[] = getProjects();

const MODEL_OPTIONS = getModelOptions();

type DetectionLayer = {
  id: string;
  position: number;
  model: string;
  tags: TagGroup[];
};

export function AddRow<T extends { id: string }>({
  items,
  value,
  onValueChange,
  onAdd,
  disabled,
  placeholder,
  renderItem,
}: {
  items: T[];
  value: string;
  onValueChange: (v: string) => void;
  onAdd: () => void;
  disabled: boolean;
  placeholder: string;
  renderItem: (item: T) => React.ReactNode;
}) {
  return (
    <div className="flex gap-2">
      <Combobox value={value} onValueChange={(value) => onValueChange(value ?? '')}>
        <ComboboxInput placeholder={placeholder} className="w-full" />
        <ComboboxContent>
          <ComboboxList>
            {items ? (
              items.map((item) => (
                <ComboboxItem key={item.id} value={item.id}>
                  {renderItem(item)}
                </ComboboxItem>
              ))
            ) : (
              <ComboboxEmpty>No results found.</ComboboxEmpty>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Button onClick={onAdd} disabled={disabled} className="shrink-0">
        <Plus className="h-4 w-4 mr-1" /> Add
      </Button>
    </div>
  );
}

function LayerCard({
  layer,
  index,
  total,
  allTags,
  onMoveLeft,
  onMoveRight,
  onRemoveLayer,
  onSetModel,
  onAddTag,
  onRemoveTag,
}: {
  layer: DetectionLayer;
  index: number;
  total: number;
  allTags: TagGroup[];
  onMoveLeft: (id: string) => void;
  onMoveRight: (id: string) => void;
  onRemoveLayer: (id: string) => void;
  onSetModel: (id: string, model: string) => void;
  onAddTag: (layerId: string, tag: TagGroup) => void;
  onRemoveTag: (layerId: string, tagId: string) => void;
}) {
  const [tagValue, setTagValue] = useState('');

  const selectedTag = allTags.find((t) => t.id === tagValue) ?? null;

  const addTag = () => {
    if (!selectedTag) return;
    onAddTag(layer.id, selectedTag);
    setTagValue('');
  };

  return (
    <motion.div
      layout
      layoutId={layer.id}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
    >
      <Card className="flex w-96 shrink-0 flex-col">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <CardTitle>
              <Layers className="h-4 w-4" />
            </CardTitle>
            <Badge variant="outline">Layer {layer.position}</Badge>
          </div>

          <CardDescription>
            {index === 0
              ? 'Detects across the full image.'
              : `Detects only inside boxes found by Layer ${index}.`}
          </CardDescription>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Model</Label>
            <Combobox
              value={layer.model}
              onValueChange={(value) => onSetModel(layer.id, value ?? '')}
            >
              <ComboboxInput placeholder="Select model..." className="w-60" />
              <ComboboxContent>
                <ComboboxList>
                  {MODEL_OPTIONS ? (
                    MODEL_OPTIONS.map((m) => (
                      <ComboboxItem key={m} value={m}>
                        {m}
                      </ComboboxItem>
                    ))
                  ) : (
                    <ComboboxEmpty>No model found.</ComboboxEmpty>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <CardAction>
            <ButtonGroup>
              {index === total - 1 && (
                <Button variant="outline" size="icon" onClick={() => onMoveLeft(layer.id)}>
                  <ChevronLeft />
                </Button>
              )}
              {index === 0 && (
                <Button variant="outline" size="icon" onClick={() => onMoveRight(layer.id)}>
                  <ChevronRight />
                </Button>
              )}
              {index > 0 && (
                <Button variant="destructive" size="icon" onClick={() => onRemoveLayer(layer.id)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </ButtonGroup>
          </CardAction>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-3">
          <div className="flex gap-2">
            <Combobox value={tagValue} onValueChange={(value) => setTagValue(value ?? '')}>
              <ComboboxInput placeholder="Add tag..." className="w-full" />
              <ComboboxContent>
                <ComboboxList>
                  {allTags ? (
                    allTags.map((t) => (
                      <ComboboxItem key={t.id} value={t.name}>
                        {t.name}
                      </ComboboxItem>
                    ))
                  ) : (
                    <ComboboxEmpty>No tags found.</ComboboxEmpty>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <Button onClick={addTag} disabled={!selectedTag} size="sm" className="shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <LinkTagGroupTable
            pageSize={4}
            data={layer.tags}
            onDelete={(id) => onRemoveTag(layer.id, id)}
            onOpen={() => {}}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ProjectSettings() {
  const router = useRouter();
  const { project } = useParams<{ project: string }>();
  const projectItems: Project | undefined = getProjects().find((curr) => curr.id === project);

  const [openIcon, setOpenIcon] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconName>(projectItems?.icon ?? 'Folder');
  const [selectedColor, setSelectedColor] = useState(projectItems?.color ?? '');
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  const [layers, setLayers] = useState<DetectionLayer[]>([
    { id: crypto.randomUUID(), position: 1, model: 'YOLOv8', tags: tagsList ?? [] },
  ]);

  const [users, setUsers] = useState<User[]>(usersList ?? []);
  const [userValue, setUserValue] = useState('');

  const [roles, setRoles] = useState<Role[]>(rolesList ?? []);
  const [roleValue, setRoleValue] = useState('');

  const [layouts, setLayouts] = useState<Layout[]>(layoutList ?? []);
  const [layoutValue, setLayoutValue] = useState('');

  const [servers, setServers] = useState<ServerActivity[]>(serversList ?? []);
  const [serverValue, setServerValue] = useState('');

  const [projectLinks, setProjectLinks] = useState<Project[]>(projectsList ?? []);
  const [projectLinkValue, setProjectLinkValue] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const canDelete = deleteConfirm === projectItems?.title;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteProject = () => {
    if (!canDelete) return;
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    toast.error('Project deleted.');
    setDeleteDialogOpen(false);
  };

  const swapLayers = (indexA: number, indexB: number) => {
    setLayers((prev) => {
      const next = [...prev];
      [next[indexA], next[indexB]] = [next[indexB], next[indexA]];
      return next.map((l, i) => ({ ...l, position: i + 1 }));
    });
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

  const selectedUser = usersList.find((u) => u.id === userValue) ?? null;
  const selectedRole = rolesList.find((u) => u.id === roleValue) ?? null;
  const selectedLayout = layoutList.find((l) => l.id === layoutValue) ?? null;
  const selectedServer = serversList.find((s) => s.id === serverValue) ?? null;
  const selectedProjectLink = projectsList.find((p) => p.id === projectLinkValue) ?? null;

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
            <ProjectIcon icon={selectedIcon} color={selectedColor} className="h-16 w-16" />
            <div className="space-y-1">
              <p className="font-medium">Current icon: {selectedIcon}</p>
              <p className="text-sm text-muted-foreground">Color: {selectedColor}</p>
            </div>
            <div className="ml-auto">
              <Button variant="outline" onClick={() => setOpenIcon(true)}>
                Change icon
              </Button>
              <ProjectIconDialog
                open={openIcon}
                onOpenChange={setOpenIcon}
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
              placeholder={projectItems?.title}
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
            items={usersList}
            value={(() => {
              const user = usersList.find((curr) => curr.id === userValue);

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
            items={rolesList}
            value={(() => {
              const role = rolesList.find((curr) => curr.id === roleValue);

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
              <AnimatePresence initial={false}>
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
            items={layoutList}
            value={(() => {
              const layout = layoutList.find((curr) => curr.id === layoutValue);
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
            items={serversList}
            value={(() => {
              const server = serversList.find((curr) => curr.id === serverValue);

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
                  <ServerIndicator status={s.status} />
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
            items={projectsList}
            value={(() => {
              const project = projectsList.find((curr) => curr.id === projectLinkValue);

              return project?.title ?? '';
            })()}
            onValueChange={setProjectLinkValue}
            placeholder="Search projects..."
            disabled={!selectedProjectLink}
            onAdd={() => {
              if (!selectedProjectLink || projectLinks.some((p) => p.id === selectedProjectLink.id))
                return;
              setProjectLinks((prev) => [...prev, selectedProjectLink]);
              setProjectLinkValue('');
              toast.success(`${selectedProjectLink.title} linked.`);
            }}
            renderItem={(p) => (
              <span className="flex items-center gap-2">
                <ProjectIcon icon={p.icon} color={p.color} className="w-6 h-6 rounded-md" />
                <span className="flex flex-col">
                  <span>{p.title}</span>
                  <span className="text-xs text-muted-foreground">{p.description}</span>
                </span>
              </span>
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
            placeholder={projectItems?.title}
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
          />
        </CardContent>
        <CardFooter className="justify-between">
          <CardDescription>
            Type <b>{projectItems?.title}</b> to confirm deletion.
          </CardDescription>
          <Button variant="destructive" disabled={!canDelete} onClick={handleDeleteProject}>
            Delete Project
          </Button>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete <b>{projectItems?.title}</b>'s project and all
                  associated data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleConfirmDelete}
                >
                  Yes, delete project {projectItems?.title}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      <LinkGraph />
    </div>
  );
}

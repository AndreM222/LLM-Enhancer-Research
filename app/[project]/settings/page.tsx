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
import { useMemo, useState } from 'react';
import { LinkTagGroupTable } from '@/components/tables/tags-table';
import { TagGroup } from '@/components/tables/tags-columns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
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
} from '@/lib/mockApi';
import { LinkServerTable } from '@/components/tables/global-table';
import { ServerActivity, ServerIndicator } from '@/components/tables/global-columns';
import { getProjects, Project, ProjectIcon } from '@/components/project-cards';
import { Check, ChevronDown, ChevronLeft, ChevronRight, Layers, Plus, X } from 'lucide-react';
import { LinkDetectionTable } from '@/components/tables/detection-table';
import Flag from 'react-world-flags';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ButtonGroup } from '@/components/ui/button-group';

const tagsList: TagGroup[] = getProjectTags();
const usersList: User[] = getProjectUsers();
const layoutList: Layout[] = getProjectLayouts();
const serversList: ServerActivity[] = getProjectServers();
const projectsList: Project[] = getProjects();

// ---- Detection layers ----

type DetectionLayer = {
  id: string;
  position: number;
  model: string;
  tags: TagGroup[];
};

const MODEL_OPTIONS = [
  'YOLOv8',
  'YOLOv11',
  'YOLO-World',
  'RF-DETR',
  'Gemini 2.5 Flash',
  'Gemini 2.5 Pro',
  'AWS Rekognition',
  'Clarifai',
  'Ground Truth (manual)',
];

function ModelCombobox({ value, onChange }: { value: string; onChange: (model: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = MODEL_OPTIONS.filter((m) => m.toLowerCase().includes(query.toLowerCase()));
  const exactMatch = MODEL_OPTIONS.some((m) => m.toLowerCase() === query.trim().toLowerCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          size="sm"
          className="w-full justify-between gap-2"
        >
          <span className="truncate">{value || 'Select model...'}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search or type a model..."
          />
          <CommandList>
            <CommandGroup>
              {filtered.map((model) => (
                <CommandItem
                  key={model}
                  value={model}
                  onSelect={() => {
                    onChange(model);
                    setQuery('');
                    setOpen(false);
                  }}
                  data-checked={value === model}
                >
                  <Check
                    className={cn('mr-2 h-4 w-4', value === model ? 'opacity-100' : 'opacity-0')}
                  />
                  {model}
                </CommandItem>
              ))}
              {query.trim() && !exactMatch && (
                <CommandItem
                  value={query}
                  onSelect={() => {
                    onChange(query.trim());
                    setQuery('');
                    setOpen(false);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Use "{query.trim()}"
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function LayerCard({
  layer,
  index,
  lastIndex,
  allTags,
  onRemoveLayer,
  onSetModel,
  onAddTag,
  onRemoveTag,
}: {
  layer: DetectionLayer;
  index: number;
  lastIndex: number;
  allTags: TagGroup[];
  onRemoveLayer: (id: string) => void;
  onSetModel: (id: string, model: string) => void;
  onAddTag: (layerId: string, tag: TagGroup) => void;
  onRemoveTag: (layerId: string, tagId: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TagGroup | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allTags;
    return allTags.filter((t) => t.name.toLowerCase().includes(q));
  }, [query, allTags]);

  const add = () => {
    if (!selected) return;
    onAddTag(layer.id, selected);
    setSelected(null);
    setQuery('');
    setOpen(false);
  };

  return (
    <Card className="flex w-100 shrink-0 flex-col">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center gap-2">
          <CardTitle>
            <Layers />
          </CardTitle>
          <Badge variant="outline">{layer.position}</Badge>
        </div>

        <CardDescription>
          {index === 0
            ? 'Detects across the full image.'
            : `Detects only inside boxes found by Layer ${index}.`}
        </CardDescription>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Model</Label>
          <ModelCombobox value={layer.model} onChange={(model) => onSetModel(layer.id, model)} />
        </div>
        <CardAction>
          <ButtonGroup>
            {index > 0 && (
              <Button variant="outline" size="icon" onClick={() => onRemoveLayer(layer.id)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {index < lastIndex - 1 && (
              <Button variant="outline" size="icon" onClick={() => onRemoveLayer(layer.id)}>
                <ChevronRight className="h-4 w-4" />
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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                size="sm"
                className="h-9 flex-1 justify-between gap-2"
              >
                <span className="truncate">{selected?.name ?? 'Add tag...'}</span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <div className="border-b p-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tags..."
                  autoFocus
                />
              </div>
              <div className="max-h-64 overflow-auto p-1">
                {filtered.length === 0 ? (
                  <div className="px-3 py-6 text-sm text-muted-foreground">No tags found.</div>
                ) : (
                  filtered.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        setSelected(tag);
                        setQuery(tag.name);
                        setOpen(false);
                      }}
                      className={cn(
                        'flex w-full items-center rounded-md px-3 py-2 text-left text-sm hover:bg-muted',
                        selected?.id === tag.id && 'bg-muted'
                      )}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4 shrink-0',
                          selected?.id === tag.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {tag.name}
                    </button>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={add} disabled={!selected} className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <LinkTagGroupTable
          pageSize={4}
          data={layer.tags}
          onDelete={(id) => onRemoveTag(layer.id, id)}
          onOpen={() => console.log('opened')}
        />
      </CardContent>
    </Card>
  );
}

export default function ProjectSettings() {
  const [openIcon, setOpenIcon] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconName>('Folder');
  const [selectedColor, setSelectedColor] = useState('#7c3aed');

  const [layers, setLayers] = useState<DetectionLayer[]>([
    { id: crypto.randomUUID(), position: 1, model: 'YOLOv8', tags: tagsList ?? [] },
  ]);

  const [queryUser, setQueryUser] = useState('');
  const [openUsers, setOpenUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(usersList ?? []);

  const [queryTemplate, setQueryTemplate] = useState('');
  const [openLayouts, setOpenLayouts] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Layout | null>(null);
  const [layouts, setLayouts] = useState<Layout[]>(layoutList ?? []);

  const [queryServer, setQueryServer] = useState('');
  const [openServers, setOpenServers] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerActivity | null>(null);
  const [servers, setServers] = useState<ServerActivity[]>(serversList ?? []);

  const [queryProjectLink, setQueryProjectLink] = useState('');
  const [openProjectLinks, setOpenProjectLinks] = useState(false);
  const [selectedProjectLink, setSelectedProjectLink] = useState<Project | null>(null);
  const [projectLinks, setProjectLinks] = useState<Project[]>(projectsList ?? []);

  const filteredUsers = useMemo(() => {
    const q = queryUser.trim().toLowerCase();
    if (!q) return users;
    return users.filter((user) => user.name.toLowerCase().includes(q));
  }, [queryUser, users]);

  const filteredTemplate = useMemo(() => {
    const q = queryTemplate.trim().toLowerCase();
    if (!q) return layoutList;
    return layoutList.filter((template) => template.name.toLowerCase().includes(q));
  }, [queryTemplate]);

  const filteredServer = useMemo(() => {
    const q = queryServer.trim().toLowerCase();
    if (!q) return serversList;
    return serversList.filter((template) => template.region.toLowerCase().includes(q));
  }, [queryServer]);

  const filteredProjectLink = useMemo(() => {
    const q = queryProjectLink.trim().toLowerCase();
    if (!q) return projectsList;
    return projectsList.filter((template) => template.title.toLowerCase().includes(q));
  }, [queryProjectLink]);

  const addLayer = () => {
    setLayers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), position: prev.length + 1, model: '', tags: [] },
    ]);
  };

  const removeLayer = (id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
  };

  const setLayerModel = (id: string, model: string) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, model } : l)));
  };

  const addTagToLayer = (layerId: string, tag: TagGroup) => {
    setLayers((prev) =>
      prev.map((l) =>
        l.id === layerId && !l.tags.some((t) => t.id === tag.id)
          ? { ...l, tags: [...l.tags, tag] }
          : l
      )
    );
  };

  const removeTagFromLayer = (layerId: string, tagId: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, tags: l.tags.filter((t) => t.id !== tagId) } : l))
    );
  };

  const addUser = () => {
    if (!selectedUser) return;
    if (users.includes(selectedUser)) return;
    setUsers((prev) => [...prev, selectedUser]);
    setSelectedUser(null);
    setQueryUser('');
    setOpenUsers(false);
  };

  const addTemplate = () => {
    if (!selectedTemplate) return;
    if (layouts.includes(selectedTemplate)) return;
    setLayouts((prev) => [...prev, selectedTemplate]);
    setSelectedTemplate(null);
    setQueryTemplate('');
  };

  const addServer = () => {
    if (!selectedServer) return;
    if (servers.includes(selectedServer)) return;
    setServers((prev) => [...prev, selectedServer]);
    setSelectedServer(null);
    setQueryServer('');
  };

  const addProject = () => {
    if (!selectedProjectLink) return;
    if (projectLinks.includes(selectedProjectLink)) return;
    setProjectLinks((prev) => [...prev, selectedProjectLink]);
    setSelectedProjectLink(null);
    setQueryProjectLink('');
  };

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
              <p className="font-medium">Current icon: Folder</p>
              <p className="text-sm text-muted-foreground">
                This icon represents the project in lists and headers.
              </p>
              <p className="text-sm text-muted-foreground">Color: #7c3aed</p>
            </div>

            <div className="ml-auto">
              <Button variant="outline" onClick={() => setOpenIcon(true)}>
                Change icon
              </Button>
              <ProjectIconDialog
                open={openIcon}
                onOpenChange={setOpenIcon}
                value={{ icon: 'Folder', color: '#7c3aed' }}
                onSave={(next) => {
                  setSelectedIcon(next.icon);
                  setSelectedColor(next.color);
                }}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input id="project-name" placeholder="Japan People" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-description">Description</Label>
            <Input
              id="project-description"
              placeholder="Focused on people in Japan with specific tag rules."
            />
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <CardDescription>Please use 32 characters at maximum.</CardDescription>
          <Button>Save</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>List of users with permission to interact.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Search and add users</Label>

          <div className="flex gap-2">
            <Popover open={openUsers} onOpenChange={setOpenUsers}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openUsers}
                  className="h-10 flex-1 justify-between gap-2"
                >
                  <span className="truncate">
                    {selectedUser?.name ?? 'Type to search users...'}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-(--radix-popper-anchor-width) p-0" align="start">
                <div className="border-b p-2">
                  <Input
                    value={queryUser}
                    onChange={(e) => setQueryUser(e.target.value)}
                    placeholder="Search users..."
                    autoFocus
                  />
                </div>

                <div className="max-h-64 overflow-auto p-1">
                  {filteredUsers.length === 0 ? (
                    <div className="px-3 py-6 text-sm text-muted-foreground">No tags found.</div>
                  ) : (
                    filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setSelectedUser(user);
                          setQueryUser(user.name);
                          setOpenUsers(false);
                        }}
                        className={cn(
                          'flex w-full items-center rounded-md px-3 py-2 text-left text-sm hover:bg-muted',
                          selectedUser?.id === user.id && 'bg-muted'
                        )}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4 shrink-0',
                            selectedUser?.id === user.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.role}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Button onClick={addUser} disabled={!selectedUser} className="shrink-0 h-auto">
              <Plus /> Add
            </Button>
          </div>

          <LinkUsersTable
            pageSize={4}
            data={usersList}
            onDelete={(id) => {
              setUsers((prev) => prev.filter((t) => t.id !== id));
            }}
            onOpen={() => console.log('opened')}
          />
        </CardContent>
      </Card>

      <Card className='min-w-0"'>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Detection layers</CardTitle>
              <CardDescription>
                Each layer detects within the boxes found by the layer before it — e.g. Layer 1
                finds cars, Layer 2 finds damage only inside those car boxes.
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
              {layers.map((layer, index) => (
                <LayerCard
                  key={layer.id}
                  layer={layer}
                  index={index}
                  lastIndex={layers.length}
                  allTags={tagsList}
                  onRemoveLayer={removeLayer}
                  onSetModel={setLayerModel}
                  onAddTag={addTagToLayer}
                  onRemoveTag={removeTagFromLayer}
                />
              ))}
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
          <Label>Search and add layouts</Label>

          <div className="flex gap-2">
            <Popover open={openLayouts} onOpenChange={setOpenLayouts}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openLayouts}
                  className="h-10 flex-1 justify-between gap-2"
                >
                  <span className="truncate">
                    {selectedTemplate?.name ?? 'Type to search layouts...'}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-(--radix-popper-anchor-width) p-0" align="start">
                <div className="border-b p-2">
                  <Input
                    value={queryTemplate}
                    onChange={(e) => setQueryTemplate(e.target.value)}
                    placeholder="Search layouts..."
                    autoFocus
                  />
                </div>

                <div className="max-h-64 overflow-auto p-1">
                  {filteredTemplate.length === 0 ? (
                    <div className="px-3 py-6 text-sm text-muted-foreground">No layouts found.</div>
                  ) : (
                    filteredTemplate.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setQueryTemplate(template.name);
                          setOpenLayouts(false);
                        }}
                        className={cn(
                          'flex w-full items-center rounded-md px-3 py-2 text-left text-sm hover:bg-muted',
                          selectedTemplate?.id === template.id && 'bg-muted'
                        )}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4 shrink-0',
                            selectedTemplate?.id === template.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{template.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {template.description}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Button onClick={addTemplate} disabled={!selectedTemplate} className="shrink-0 h-auto">
              <Plus /> Add
            </Button>
          </div>

          <LinkLayoutsTable
            data={layoutList}
            onDelete={(id) => {
              setLayouts((prev) => prev.filter((t) => t.id !== id));
            }}
            onOpen={() => console.log('opened')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Servers</CardTitle>
          <CardDescription>
            Add servers for regions this project to run on for speed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Search and add server</Label>

          <div className="flex gap-2">
            <Popover open={openServers} onOpenChange={setOpenServers}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openServers}
                  className="h-10 flex-1 justify-between gap-2"
                >
                  <span className="truncate">
                    {selectedServer?.region ?? 'Type to search servers...'}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-(--radix-popper-anchor-width) p-0" align="start">
                <div className="border-b p-2">
                  <Input
                    value={queryServer}
                    onChange={(e) => setQueryServer(e.target.value)}
                    placeholder="Search servers..."
                    autoFocus
                  />
                </div>

                <div className="max-h-64 overflow-auto p-1">
                  {filteredServer.length === 0 ? (
                    <div className="px-3 py-6 text-sm text-muted-foreground">No servers found.</div>
                  ) : (
                    filteredServer.map((server) => (
                      <button
                        key={server.id}
                        type="button"
                        onClick={() => {
                          setSelectedServer(server);
                          setQueryServer(server.region);
                          setOpenServers(false);
                        }}
                        className={cn(
                          'flex w-full items-center rounded-md px-3 py-2 text-left text-sm hover:bg-muted',
                          selectedServer?.id === server.id && 'bg-muted'
                        )}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4 shrink-0',
                            selectedServer?.id === server.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1">
                            <Flag code={server.countryCode} className="w-4 h-4" />
                            {server.region}
                          </span>

                          <span>
                            <ServerIndicator status={server.status} />
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Button onClick={addServer} disabled={!selectedServer} className="shrink-0 h-auto">
              <Plus /> Add
            </Button>
          </div>

          <LinkServerTable
            data={serversList}
            onDelete={(id) => {
              setServers((prev) => prev.filter((t) => t.id !== id));
            }}
            onOpen={() => console.log('opened')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Linked Projects</CardTitle>
          <CardDescription>Add projects to link images.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Search and add projects</Label>

          <div className="flex gap-2">
            <Popover open={openProjectLinks} onOpenChange={setOpenProjectLinks}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openProjectLinks}
                  className="h-10 flex-1 justify-between gap-2"
                >
                  <span className="truncate">
                    {selectedProjectLink?.title ?? 'Type to search projects...'}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-(--radix-popper-anchor-width) p-0" align="start">
                <div className="border-b p-2">
                  <Input
                    value={queryProjectLink}
                    onChange={(e) => setQueryProjectLink(e.target.value)}
                    placeholder="Search projects..."
                    autoFocus
                  />
                </div>

                <div className="max-h-64 overflow-auto p-1">
                  {filteredProjectLink.length === 0 ? (
                    <div className="px-3 py-6 text-sm text-muted-foreground">
                      No projects found.
                    </div>
                  ) : (
                    filteredProjectLink.map((project) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => {
                          setSelectedProjectLink(project);
                          setQueryProjectLink(project.title);
                          setOpenProjectLinks(false);
                        }}
                        className={cn(
                          'flex w-full items-center rounded-md px-3 py-2 text-left text-sm hover:bg-muted',
                          selectedProjectLink?.id === project.id && 'bg-muted'
                        )}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4 shrink-0',
                            selectedProjectLink?.id === project.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1">
                            <ProjectIcon
                              icon={project.icon}
                              color={project.color}
                              className="w-7 h-7 rounded-md"
                            />
                            {project.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {project.description}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              onClick={addProject}
              disabled={!selectedProjectLink}
              className="shrink-0 h-auto"
            >
              <Plus /> Add
            </Button>
          </div>

          <LinkDetectionTable
            data={projectsList}
            onDelete={(id) => {
              setProjectLinks((prev) => prev.filter((t) => t.id !== id));
            }}
            onOpen={() => console.log('opened')}
          />
        </CardContent>
      </Card>
      <LinkGraph />
    </div>
  );
}

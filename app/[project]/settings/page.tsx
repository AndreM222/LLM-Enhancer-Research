'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { IconName, ProjectIconDialog } from '@/components/dialogs/project-icon';
import { useMemo, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { LinkTagGroupTable } from '@/components/tables/tags-table';
import { TagGroup } from '@/components/tables/tags-columns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { User } from '@/components/tables/users-columns';
import { LinkUsersTable } from '@/components/tables/users-table';
import { LinkTemplateTable } from '@/components/tables/templates-table';
import { Template } from '@/components/tables/templates-columns';
import LinkGraph from '@/components/linkGraph';

import {
  getProjectTags,
  getProjectUsers,
  getProjectTemplates,
  getProjectServers,
} from '@/lib/mockApi';
import { LinkServerTable } from '@/components/tables/global-table';
import { ServerActivity } from '@/components/tables/global-columns';

const tagsList: TagGroup[] = getProjectTags();
const usersList: User[] = getProjectUsers();
const templatesList: Template[] = getProjectTemplates();
const serversList: ServerActivity[] = getProjectServers();

export default function Project() {
  const [openIcon, setOpenIcon] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconName>('Folder');
  const [selectedColor, setSelectedColor] = useState('#7c3aed');

  const [queryTag, setQueryTag] = useState('');
  const [openTagGroups, setOpenTagGroups] = useState(false);
  const [selectedTagGroup, setSelectedTagGroup] = useState<TagGroup | null>(null);
  const [tags, setTags] = useState<TagGroup[]>(tagsList ?? []);

  const [queryUser, setQueryUser] = useState('');
  const [openUsers, setOpenUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(usersList ?? []);

  const [queryTemplate, setQueryTemplate] = useState('');
  const [openTemplates, setOpenTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>(templatesList ?? []);

  const [queryServer, setQueryServer] = useState('');
  const [openServers, setOpenServers] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerActivity | null>(null);
  const [servers, setServers] = useState<ServerActivity[]>(serversList ?? []);

  const Selected = LucideIcons[selectedIcon] as React.ComponentType<{ className?: string }>;

  const filteredTags = useMemo(() => {
    const q = queryTag.trim().toLowerCase();
    if (!q) return tagsList;
    return tagsList.filter((tag) => tag.name.toLowerCase().includes(q));
  }, [queryTag]);

  const filteredUsers = useMemo(() => {
    const q = queryUser.trim().toLowerCase();
    if (!q) return users;
    return users.filter((user) => user.name.toLowerCase().includes(q));
  }, [queryUser]);

  const filteredTemplate = useMemo(() => {
    const q = queryTemplate.trim().toLowerCase();
    if (!q) return templatesList;
    return templatesList.filter((template) => template.name.toLowerCase().includes(q));
  }, [queryTemplate]);

  const filteredServer = useMemo(() => {
    const q = queryServer.trim().toLowerCase();
    if (!q) return serversList;
    return serversList.filter((template) => template.region.toLowerCase().includes(q));
  }, [queryServer]);

  const addTag = () => {
    if (!selectedTagGroup) return;
    if (tags.includes(selectedTagGroup)) return;
    setTags((prev) => [...prev, selectedTagGroup]);
    setSelectedTagGroup(null);
    setQueryTag('');
    setOpenTagGroups(false);
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
    if (templates.includes(selectedTemplate)) return;
    setTemplates((prev) => [...prev, selectedTemplate]);
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
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl border"
              style={{ backgroundColor: `${selectedColor}20`, color: selectedColor }}
            >
              <Selected />
            </div>

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
            <Textarea
              id="project-description"
              placeholder="Focused on people in Japan with specific tag rules."
            />
          </div>
        </CardContent>
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
                  <LucideIcons.ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
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
                          setOpenTagGroups(false);
                        }}
                        className={cn(
                          'flex w-full items-center rounded-md px-3 py-2 text-left text-sm hover:bg-muted',
                          selectedUser?.id === user.id && 'bg-muted'
                        )}
                      >
                        <LucideIcons.Check
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
              <LucideIcons.Plus /> Add
            </Button>
          </div>

          <LinkUsersTable
            data={users}
            onDelete={(id) => {
              setUsers((prev) => prev.filter((t) => t.id !== id));
            }}
            onOpen={() => console.log('opened')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>Add tags that modify how this project behaves.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Search and add tag</Label>

          <div className="flex gap-2">
            <Popover open={openTagGroups} onOpenChange={setOpenTagGroups}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openTagGroups}
                  className="h-10 flex-1 justify-between gap-2"
                >
                  <span className="truncate">
                    {selectedTagGroup?.name ?? 'Type to search tags...'}
                  </span>
                  <LucideIcons.ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-(--radix-popper-anchor-width) p-0" align="start">
                <div className="border-b p-2">
                  <Input
                    value={queryTag}
                    onChange={(e) => setQueryTag(e.target.value)}
                    placeholder="Search tags..."
                    autoFocus
                  />
                </div>

                <div className="max-h-64 overflow-auto p-1">
                  {filteredTags.length === 0 ? (
                    <div className="px-3 py-6 text-sm text-muted-foreground">No tags found.</div>
                  ) : (
                    filteredTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          setSelectedTagGroup(tag);
                          setQueryTag(tag.name);
                          setOpenTagGroups(false);
                        }}
                        className={cn(
                          'flex w-full items-center rounded-md px-3 py-2 text-left text-sm hover:bg-muted',
                          selectedTagGroup?.id === tag.id && 'bg-muted'
                        )}
                      >
                        <LucideIcons.Check
                          className={cn(
                            'mr-2 h-4 w-4 shrink-0',
                            selectedTagGroup?.id === tag.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{tag.name}</span>
                          <span className="text-xs text-muted-foreground">{tag.description}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Button onClick={addTag} disabled={!selectedTagGroup} className="shrink-0 h-auto">
              <LucideIcons.Plus /> Add
            </Button>
          </div>

          <LinkTagGroupTable
            data={tags}
            onDelete={(id) => {
              setTags((prev) => prev.filter((t) => t.id !== id));
            }}
            onOpen={() => console.log('opened')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <CardDescription>Add templates that modify how this project behaves.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Search and add templates</Label>

          <div className="flex gap-2">
            <Popover open={openTemplates} onOpenChange={setOpenTemplates}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openTemplates}
                  className="h-10 flex-1 justify-between gap-2"
                >
                  <span className="truncate">
                    {selectedTemplate?.name ?? 'Type to search templates...'}
                  </span>
                  <LucideIcons.ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-(--radix-popper-anchor-width) p-0" align="start">
                <div className="border-b p-2">
                  <Input
                    value={queryTemplate}
                    onChange={(e) => setQueryTemplate(e.target.value)}
                    placeholder="Search templates..."
                    autoFocus
                  />
                </div>

                <div className="max-h-64 overflow-auto p-1">
                  {filteredTemplate.length === 0 ? (
                    <div className="px-3 py-6 text-sm text-muted-foreground">
                      No templates found.
                    </div>
                  ) : (
                    filteredTemplate.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setQueryTemplate(template.name);
                          setOpenTemplates(false);
                        }}
                        className={cn(
                          'flex w-full items-center rounded-md px-3 py-2 text-left text-sm hover:bg-muted',
                          selectedTemplate?.id === template.id && 'bg-muted'
                        )}
                      >
                        <LucideIcons.Check
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
              <LucideIcons.Plus /> Add
            </Button>
          </div>

          <LinkTemplateTable
            data={templates}
            onDelete={(id) => {
              setTemplates((prev) => prev.filter((t) => t.id !== id));
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
                  <LucideIcons.ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
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
                        <LucideIcons.Check
                          className={cn(
                            'mr-2 h-4 w-4 shrink-0',
                            selectedServer?.id === server.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{server.region}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Button onClick={addServer} disabled={!selectedServer} className="shrink-0 h-auto">
              <LucideIcons.Plus /> Add
            </Button>
          </div>

          <LinkServerTable
            data={servers}
            onDelete={(id) => {
              setServers((prev) => prev.filter((t) => t.id !== id));
            }}
            onOpen={() => console.log('opened')}
          />
        </CardContent>
      </Card>
      <LinkGraph />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Check, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type UserRole = 'ADMIN' | 'MEMBER' | 'VIEWER';

export type MockUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
};

type Props = {
  existingUsers: MockUser[];
  onInvite: (user: MockUser | { emailOrUsername: string; role: UserRole }) => void;
  onEditRole?: (user: MockUser, newRole: UserRole) => void;
  trigger?: React.ReactNode;
};

export function InviteUserDialog({ existingUsers, onInvite, onEditRole, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [role, setRole] = useState<UserRole>('MEMBER');

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedUser(null);
      setRole('MEMBER');
    }
  }, [open]);

  const filteredUsers =
    query.length > 0
      ? existingUsers.filter(
          (u) =>
            u.email.toLowerCase().includes(query.toLowerCase()) ||
            u.username.toLowerCase().includes(query.toLowerCase()) ||
            u.name.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  const isExistingUser = !!selectedUser;

  const handleSelectUser = (user: MockUser) => {
    setSelectedUser(user);
    setRole(user.role);
    setOpenCombobox(false);
  };

  const handleInviteNewUser = () => {
    if (!query.trim()) return;
    onInvite({ emailOrUsername: query.trim(), role });
    setOpen(false);
  };

  const handleInviteExistingUser = () => {
    if (!selectedUser) return;
    onInvite(selectedUser);
    setOpen(false);
  };

  const handleUpdateRole = () => {
    if (!selectedUser || !onEditRole) return;
    onEditRole(selectedUser, role);
    setOpen(false);
  };

  const handleSubmit = () => {
    if (isExistingUser) {
      if (onEditRole) {
        handleUpdateRole();
      } else {
        handleInviteExistingUser();
      }
    } else {
      handleInviteNewUser();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button>Invite user</Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isExistingUser && onEditRole ? 'Edit user role' : 'Invite user'}
          </DialogTitle>
          <DialogDescription>
            {isExistingUser && onEditRole
              ? 'Change the role for this user.'
              : 'Invite someone by username or email. If they already have an account, they’ll just join. Otherwise, they’ll get an invite to create one.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* User selector */}
          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCombobox}
                className="w-full justify-between"
              >
                {selectedUser ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={selectedUser.avatarUrl} />
                      <AvatarFallback>{selectedUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{selectedUser.name}</span>
                    <Badge variant="secondary">{selectedUser.role}</Badge>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Search by username, name, or email…</span>
                )}
                <UserPlus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput value={query} onValueChange={setQuery} placeholder="Search users…" />
                <CommandList>
                  <CommandEmpty>
                    {query.trim() ? (
                      <div className="py-3 text-center text-sm">
                        No existing user found.
                        <div className="mt-1 text-muted-foreground">
                          Will invite “{query}” as a new user.
                        </div>
                      </div>
                    ) : (
                      'Start typing to search users.'
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredUsers.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.id}
                        onSelect={() => handleSelectUser(user)}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{user.name}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {user.username} · {user.email}
                            </p>
                          </div>
                        </div>
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            selectedUser?.id === user.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Role selector */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Role</label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="VIEWER">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              (!selectedUser && !query.trim()) ||
              (isExistingUser && !onEditRole && selectedUser !== null)
            }
          >
            {isExistingUser && onEditRole
              ? 'Save role'
              : selectedUser
                ? 'Invite user'
                : 'Invite new user'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

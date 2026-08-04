'use client';

import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AccountBanner } from '../account-banner';
import { User } from '../tables/users-columns';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  existingUsers: User[];
  onInvite: (user: User | { emailOrUsername: string; role: string }) => void;
  onEditRole?: (user: User, newRole: string) => void;
  trigger?: React.ReactNode;
};

export function InviteUserDialog({ existingUsers, onInvite, onEditRole, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [role, setRole] = useState<string>('MEMBER');

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
  const trimmedQuery = query.trim();
  const isValidEmail = EMAIL_REGEX.test(trimmedQuery);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setOpenCombobox(false);
  };

  const handleInviteNewUser = () => {
    if (!isValidEmail) return;
    onInvite({ emailOrUsername: trimmedQuery, role });
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

      <DialogContent className="sm:max-w-125">
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
          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCombobox}
                className="w-full justify-between py-6"
              >
                {selectedUser ? (
                  <AccountBanner user={selectedUser} />
                ) : (
                  <span className="text-muted-foreground">Search by username, name, or email…</span>
                )}
                <div className="flex gap-1 items-center">
                  <UserPlus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  <span className="text-red-500">*</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-75 p-0">
              <Command shouldFilter={false}>
                <CommandInput value={query} onValueChange={setQuery} placeholder="Search users…" />
                <CommandList>
                  <CommandEmpty>
                    {trimmedQuery ? (
                      isValidEmail ? (
                        <div className="py-3 text-center text-sm">
                          No existing user found.
                          <div className="mt-1 text-muted-foreground">
                            Will invite “{trimmedQuery}” as a new user.
                          </div>
                        </div>
                      ) : (
                        <div className="py-3 text-center text-sm text-muted-foreground">
                          Enter a valid email to invite a new user.
                        </div>
                      )
                    ) : (
                      'Start typing to search users.'
                    )}
                  </CommandEmpty>
                  <CommandGroup className="w-full">
                    {filteredUsers.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.id}
                        onSelect={() => handleSelectUser(user)}
                        className="flex justify-between w-full"
                        data-checked={selectedUser?.id === user.id}
                      >
                        <AccountBanner user={user} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Role <span className="text-red-500">*</span>
            </label>
            <Select value={role} onValueChange={(v) => setRole(v as string)}>
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
            disabled={!selectedUser && !isValidEmail}
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

'use client';

import * as React from 'react';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { InputGroup, InputGroupAddon } from './ui/input-group';
import { Kbd } from './ui/kbd';
import { getNavigationItems } from './app-navigation';
import { useRouter } from 'next/navigation';

const SEARCHBAR_KEYBOARD_SHORTCUT = '/';

export function SearchBar() {
  const [open, setOpen] = React.useState(false);
  const items = getNavigationItems();
  const router = useRouter();

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SEARCHBAR_KEYBOARD_SHORTCUT) {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit" asChild>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-start" className="mr-10">
            Type <Kbd>/</Kbd> to search
          </InputGroupAddon>
        </InputGroup>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type for searching..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {items.map((currGroup, i) => (
              <div key={currGroup.group}>
                <CommandGroup heading={currGroup.group}>
                  {currGroup.tabs.map((currItem) => (
                    <CommandItem
                      key={currItem.title}
                      onSelect={() => {
                        router.push(currItem.url);
                        setOpen(false);
                      }}
                    >
                      {currItem.icon}
                      <span className="block">
                        {currItem.title}
                        <div className="opacity-40">{currItem.description}</div>
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                {i < items.length - 1 && <CommandSeparator />}
              </div>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}

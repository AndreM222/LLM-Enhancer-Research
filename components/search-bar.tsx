'use client';

import * as React from 'react';

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
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group';
import { getNavigationItems, NavItem } from '@/components/app-navigation';
import { useRouter } from 'next/navigation';
import { getProjects } from '@/lib/mockApi';
import { Project, ProjectIcon } from '@/components/cards/project-cards';
import { Box, ChevronRight, SearchIcon } from 'lucide-react';
import { ShortcutView } from '@/components/shortcuts';

const SEARCHBAR_KEYBOARD_SHORTCUT = 'k';
const CLEAN_COMMAND_SHORTCUT = 'Backspace';

const FILTER_COMMANDS = ['>', '/'];

function getSearchItems(
  command: string,
  setCommand: (val: string) => void
): {
  group: string;
  tabs: NavItem[];
}[] {
  let newItems: {
    group: string;
    tabs: NavItem[];
  }[] = [];

  const setNavigations = () => {
    const navItems = getNavigationItems();

    newItems = navItems;
  };

  const setProjects = () => {
    const projectItems: Project[] = getProjects();

    if (projectItems.length > 0) {
      let currItem: { group: string; tabs: NavItem[] } = {
        group: 'Projects',
        tabs: [],
      };

      projectItems.map((item) => {
        currItem.tabs.push({
          title: item.name,
          description: item.description,
          url: `/${item.id}`,
          icon: item.icon,
          isActive: true,
          color: item.color,
        });
      });

      newItems.push(currItem);
    }
  };

  switch (command) {
    case '>':
      setProjects();
      break;

    case '/':
      setNavigations();
      setProjects();
      setCommand('');
      break;

    default:
      setNavigations();
      setProjects();
      break;
  }

  return newItems;
}

export function SearchBar() {
  const [open, setOpen] = React.useState(false);
  const [command, setCommand] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [navItems, setNavItems] = React.useState(getSearchItems(command, setCommand));
  const router = useRouter();

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!open && event.key === SEARCHBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
        return;
      }

      if (
        open &&
        event.key === CLEAN_COMMAND_SHORTCUT &&
        search.length === 0 &&
        command.length > 0
      ) {
        event.preventDefault();
        setCommand('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, search, command]); // all three in deps so it's never stale

  React.useEffect(() => {
    setNavItems(getSearchItems(command, setCommand));
  }, [command]);

  const handeCommands = (searchVal: string) => {
    const matchedKeyword = FILTER_COMMANDS.find((keyword) => searchVal.startsWith(keyword + ' '));

    if (matchedKeyword) {
      let remainingText = searchVal.slice(matchedKeyword.length);

      remainingText = remainingText.trimStart();

      setSearch(remainingText);
      setCommand(matchedKeyword);

      return;
    }

    setSearch(searchVal);
  };

  function SearchIndicator({ command }: { command: string }) {
    switch (command) {
      case '>':
        return <Box />;

      default:
        return <SearchIcon />;
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit" asChild>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-start" className="mr-10">
            Type <ShortcutView shortcut="Meta+k" />
            to search
          </InputGroupAddon>
        </InputGroup>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholderContent={
              command ? (
                <span className="flex items-center gap-1">
                  Type <ShortcutView shortcut="slash+space" />
                  to search all...
                </span>
              ) : (
                'Type for searching...'
              )
            }
            searchIcon={
              <span className={command && 'text-white'}>
                <SearchIndicator command={command} />
              </span>
            }
            value={search}
            onValueChange={handeCommands}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {navItems.map((currGroup, i) => (
              <div key={currGroup.group}>
                <CommandGroup heading={currGroup.group}>
                  {currGroup.tabs.map((currItem) => (
                    <CommandItem
                      key={currItem.title}
                      onSelect={() => {
                        router.push(currItem.url);
                        setOpen(false);
                      }}
                      className="gap-2"
                    >
                      <ProjectIcon icon={currItem.icon} color={currItem.color} size="sm" />
                      <div className="flex w-full space-x-1 justify-between">
                        <span className="block">
                          {currItem.title}
                          <div className="opacity-40">{currItem.description}</div>
                        </span>
                        <ChevronRight className="self-center" />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                {i < navItems.length - 1 && <CommandSeparator />}
              </div>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}

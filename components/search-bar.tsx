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
import { InputGroup, InputGroupAddon } from './ui/input-group';
import { Kbd } from './ui/kbd';
import { getNavigationItems, NavItem } from './app-navigation';
import { useRouter } from 'next/navigation';
import { getProjects } from './project-cards';
import * as LucideIcons from 'lucide-react';

const SEARCHBAR_KEYBOARD_SHORTCUT = '/';
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
    const projectItems = getProjects();

    if (projectItems.length > 0) {
      let currItem: { group: string; tabs: NavItem[] } = {
        group: 'Projects',
        tabs: [],
      };

      projectItems.map((item) => {
        const CurrIcon = LucideIcons[item.icon] as React.ComponentType<{ className?: string }>;
        currItem.tabs.push({
          title: item.title,
          description: item.description,
          url: `/${item.id}`,
          icon: <CurrIcon />,
          isActive: true,
          iconBg: item.color,
          iconFg: item.color,
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
      if (!open && event.key === SEARCHBAR_KEYBOARD_SHORTCUT) {
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
        return <LucideIcons.Box />;

      default:
        return <LucideIcons.SearchIcon />;
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit" asChild>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <LucideIcons.SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-start" className="mr-10">
            Type <Kbd>/</Kbd> to search
          </InputGroupAddon>
        </InputGroup>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholderContent={
              command ? (
                <span className="flex items-center gap-1">
                  Type <Kbd>/</Kbd> +{' '}
                  <Kbd>
                    <LucideIcons.Space />{' '}
                  </Kbd>
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
                      <div
                        className="flex min-h-10 min-w-10 items-center justify-center size-6 rounded-xl border"
                        style={{ backgroundColor: `${currItem.iconBg}20`, color: currItem.iconFg }}
                      >
                        {currItem.icon}
                      </div>
                      <div className="flex w-full space-x-1 justify-between">
                        <span className="block">
                          {currItem.title}
                          <div className="opacity-40">{currItem.description}</div>
                        </span>
                        <LucideIcons.ChevronRight className="self-center" />
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

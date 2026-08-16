import { Kbd, KbdGroup } from '@/components/ui/kbd';
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  Command,
  CornerDownLeftIcon,
  DeleteIcon,
  Space,
} from 'lucide-react';
export type ShortcutKey = 'Meta' | 'Ctrl' | 'Alt' | 'Shift' | string;

export type Shortcut = {
  keys: ShortcutKey[];
};

export function parseShortcut(shortcut: string): Shortcut {
  return {
    keys: shortcut
      .split('+')
      .map((k) => k.trim())
      .filter(Boolean),
  };
}

function ShortcutKey({ keyName }: { keyName: string }) {
  switch (keyName.toLowerCase()) {
    case 'meta':
    case 'cmd':
    case 'command':
      return (
        <Kbd>
          <Command className="size-3" />
        </Kbd>
      );

    case 'ctrl':
    case 'control':
      return <Kbd>Ctrl</Kbd>;

    case 'slash':
      return <Kbd>/</Kbd>;

    case 'shift':
      return <Kbd>Shift</Kbd>;

    case 'alt':
    case 'option':
      return <Kbd>Alt</Kbd>;

    case 'enter':
      return (
        <Kbd>
          <CornerDownLeftIcon className="size-3" />
        </Kbd>
      );

    case 'delete':
      return (
        <Kbd>
          <DeleteIcon className="size-3" />
        </Kbd>
      );

    case 'arrowup':
      return (
        <Kbd>
          <ArrowUpIcon className="size-3" />
        </Kbd>
      );

    case 'arrowdown':
      return (
        <Kbd>
          <ArrowDownIcon className="size-3" />
        </Kbd>
      );

    case 'arrowleft':
      return (
        <Kbd>
          <ArrowLeftIcon className="size-3" />
        </Kbd>
      );

    case 'arrowright':
      return (
        <Kbd>
          <ArrowRightIcon className="size-3" />
        </Kbd>
      );

    case 'space':
      return (
        <Kbd>
          <Space className="size-3" />
        </Kbd>
      );

    case 'tab':
      return <Kbd>Tab</Kbd>;

    case 'esc':
    case 'escape':
      return <Kbd>Esc</Kbd>;

    default:
      return <Kbd>{keyName.toUpperCase()}</Kbd>;
  }
}

export function ShortcutView({ shortcut }: { shortcut: Shortcut | string }) {
  const parsed = typeof shortcut === 'string' ? parseShortcut(shortcut) : shortcut;

  return (
    <KbdGroup>
      {parsed.keys.map((key) => (
        <ShortcutKey key={key} keyName={key} />
      ))}
    </KbdGroup>
  );
}

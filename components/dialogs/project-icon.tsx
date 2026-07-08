'use client';

import { useMemo, useState } from 'react';
import { Check, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

export type IconName = keyof typeof LucideIcons;

const ICONS: IconName[] = [
  'Folder',
  'Globe',
  'Users',
  'Tag',
  'Sparkles',
  'Shield',
  'Camera',
  'Image',
  'Search',
  'Database',
  'Layers3',
  'Settings',
  'Star',
  'ClipboardList',
  'Brain',
];

const COLORS = ['#7c3aed', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

export function ProjectIconDialog({
  open,
  onOpenChange,
  value,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: { icon: IconName; color: string };
  onSave: (next: { icon: IconName; color: string }) => void;
}) {
  const [search, setSearch] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<IconName>(value?.icon ?? 'Folder');
  const [selectedColor, setSelectedColor] = useState(value?.color ?? '#7c3aed');

  const filteredIcons = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ICONS;
    return ICONS.filter((icon) => icon.toLowerCase().includes(q));
  }, [search]);

  const Selected = LucideIcons[selectedIcon] as React.ComponentType<{ className?: string }>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choose project icon</DialogTitle>
          <DialogDescription>
            Pick a icon and a color to represent this project across the app.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="grid gap-2">
              <Label htmlFor="icon-search">Search icons</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="icon-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Lucide icons..."
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${selectedColor}20`, color: selectedColor }}
              >
                <Selected className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium">{selectedIcon}</p>
                <p className="text-xs text-muted-foreground">{selectedColor}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Icon</Label>
            <div className="grid max-h-72 grid-cols-2 gap-2 overflow-auto rounded-xl border p-2 sm:grid-cols-3 md:grid-cols-4">
              {filteredIcons.map((iconName) => {
                const Icon = LucideIcons[iconName] as React.ComponentType<{ className?: string }>;
                const active = selectedIcon === iconName;

                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={cn(
                      'flex flex-col items-center justify-center gap-2 rounded-lg border p-3 text-xs transition-colors',
                      active ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="line-clamp-1">{iconName}</span>
                    {active ? <Check className="h-3.5 w-3.5" /> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => {
                const active = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      'h-10 w-10 rounded-full border transition-transform',
                      active && 'scale-110 ring-2 ring-primary ring-offset-2'
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                );
              })}
            </div>

            <div className="grid gap-2 sm:max-w-xs">
              <Label htmlFor="color-input">Custom hex</Label>
              <Input
                id="color-input"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                placeholder="#7c3aed"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave({ icon: selectedIcon, color: selectedColor });
              onOpenChange(false);
            }}
          >
            Save icon
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

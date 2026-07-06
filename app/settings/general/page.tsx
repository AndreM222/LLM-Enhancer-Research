'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Computer, Moon, Sun } from 'lucide-react';

export default function GeneralSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select defaultValue="en">
            <SelectTrigger>
              <SelectValue placeholder="Choose language" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme mode</CardTitle>
          <CardDescription>Use dark theme by default.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleGroup
            type="single"
            value={theme}
            onValueChange={(value) => {
              if (value) setTheme(value);
            }}
            className="rounded-xl border p-1"
          >
            <ToggleGroupItem
              value="light"
              aria-label="Light theme"
              className="gap-2 rounded-lg px-3"
            >
              <Sun className="h-4 w-4" />
              <span className="text-sm">Light</span>
            </ToggleGroupItem>

            <ToggleGroupItem value="dark" aria-label="Dark theme" className="gap-2 rounded-lg px-3">
              <Moon className="h-4 w-4" />
              <span className="text-sm">Dark</span>
            </ToggleGroupItem>

            <ToggleGroupItem
              value="system"
              aria-label="System theme"
              className="gap-2 rounded-lg px-3"
            >
              <Computer className="h-4 w-4" />
              <span className="text-sm">System</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

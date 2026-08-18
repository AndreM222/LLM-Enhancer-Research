'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';

export function AddRow<T extends { id: string }>({
  items,
  value,
  onValueChange,
  onAdd,
  disabled,
  placeholder,
  renderItem,
}: {
  items: T[];
  value: string;
  onValueChange: (v: string) => void;
  onAdd: () => void;
  disabled: boolean;
  placeholder: string;
  renderItem: (item: T) => React.ReactNode;
}) {
  return (
    <div className="flex gap-2">
      <Combobox value={value} onValueChange={(value) => onValueChange(value ?? '')}>
        <ComboboxInput placeholder={placeholder} className="w-full" />
        <ComboboxContent>
          <ComboboxList>
            {items ? (
              items.map((item) => (
                <ComboboxItem key={item.id} value={item.id}>
                  {renderItem(item)}
                </ComboboxItem>
              ))
            ) : (
              <ComboboxEmpty>No results found.</ComboboxEmpty>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Button onClick={onAdd} disabled={disabled} className="shrink-0">
        <Plus className="h-4 w-4 mr-1" /> Add
      </Button>
    </div>
  );
}

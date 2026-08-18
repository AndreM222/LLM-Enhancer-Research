'use client';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { LinkTagGroupTable } from '@/components/tables/tags-table';
import { TagGroup } from '@/components/tables/tags-columns';
import { getModelOptions } from '@/lib/mockApi';
import { ChevronLeft, ChevronRight, GripHorizontal, Layers, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ButtonGroup } from '@/components/ui/button-group';
import { motion } from 'motion/react';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';

const MODEL_OPTIONS = getModelOptions();

type DetectionLayer = {
  id: string;
  position: number;
  model: string;
  tags: TagGroup[];
};

export function LayerCard({
  layer,
  index,
  total,
  allTags,
  onMoveLeft,
  onMoveRight,
  onRemoveLayer,
  onSetModel,
  onAddTag,
  onRemoveTag,
  draggedId,
  dragOverId,
  setDragStart,
  setDragEnd,
  setDragOver,
  onDrop,
}: {
  layer: DetectionLayer;
  index: number;
  total: number;
  allTags: TagGroup[];
  onMoveLeft: (id: string) => void;
  onMoveRight: (id: string) => void;
  onRemoveLayer: (id: string) => void;
  onSetModel: (id: string, model: string) => void;
  onAddTag: (layerId: string, tag: TagGroup) => void;
  onRemoveTag: (layerId: string, tagId: string) => void;
  draggedId: string | null;
  dragOverId: string | null;
  setDragStart: (id: string) => void;
  setDragEnd: () => void;
  setDragOver: (id: string) => void;
  onDrop: (id: string) => void;
}) {
  const [tagValue, setTagValue] = useState('');

  const selectedTag = allTags.find((t) => t.id === tagValue) ?? null;

  const addTag = () => {
    if (!selectedTag) return;
    onAddTag(layer.id, selectedTag);
    setTagValue('');
  };

  const isDragging = draggedId === layer.id;

  return (
    <motion.div
      layout
      layoutId={layer.id}
      initial={{ opacity: 0, x: 20, scale: 0.98 }}
      animate={{
        opacity: isDragging ? 0.4 : 1,
        scale: isDragging ? 0.95 : 1,
        x: 0,
      }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      draggable
      onDragStart={() => setDragStart(layer.id)}
      onDragEnd={setDragEnd}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(layer.id);
      }}
      onDragLeave={() => setDragOver('')}
      onDrop={() => onDrop(layer.id)}
      className={[
        'group flex gap-3 rounded-xl bg-card transition-colors',
        draggedId === layer.id ? 'opacity-40 scale-95' : '',
        dragOverId === layer.id && draggedId !== layer.id
          ? 'border-primary bg-primary/5'
          : 'hover:border-primary/40',
      ].join(' ')}
      style={{
        cursor: draggedId === layer.id ? 'grabbing' : 'default',
      }}
    >
      <Card
        className={[
          'flex w-96 shrink-0 flex-col transition-all duration-200',
          dragOverId === layer.id && draggedId !== layer.id
            ? 'border-primary bg-primary/5'
            : 'hover:border-primary/40',
        ].join(' ')}
      >
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <motion.div
              className="rounded-md p-1 text-muted-foreground hover:bg-muted cursor-grab active:cursor-grabbing"
              whileTap={{ scale: 0.9 }}
            >
              <GripHorizontal className="h-5 w-5" />
            </motion.div>
            <CardTitle>
              <Layers className="h-4 w-4" />
            </CardTitle>
            <Badge variant="outline">Layer {layer.position}</Badge>
          </div>

          <CardDescription>
            {index === 0
              ? 'Detects across the full image.'
              : `Detects only inside boxes found by Layer ${index}.`}
          </CardDescription>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Model</Label>
            <Combobox
              value={layer.model}
              onValueChange={(value) => onSetModel(layer.id, value ?? '')}
            >
              <ComboboxInput placeholder="Select model..." className="w-60" />
              <ComboboxContent>
                <ComboboxList>
                  {MODEL_OPTIONS ? (
                    MODEL_OPTIONS.map((m) => (
                      <ComboboxItem key={m} value={m}>
                        {m}
                      </ComboboxItem>
                    ))
                  ) : (
                    <ComboboxEmpty>No model found.</ComboboxEmpty>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <CardAction>
            <ButtonGroup>
              {index > 0 && (
                <Button variant="outline" size="icon" onClick={() => onMoveLeft(layer.id)}>
                  <ChevronLeft />
                </Button>
              )}
              {index < total - 1 && (
                <Button variant="outline" size="icon" onClick={() => onMoveRight(layer.id)}>
                  <ChevronRight />
                </Button>
              )}
              {index > 0 && (
                <Button variant="destructive" size="icon" onClick={() => onRemoveLayer(layer.id)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </ButtonGroup>
          </CardAction>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-3">
          <div className="flex gap-2">
            <Combobox value={tagValue} onValueChange={(value) => setTagValue(value ?? '')}>
              <ComboboxInput placeholder="Add tag..." className="w-full" />
              <ComboboxContent>
                <ComboboxList>
                  {allTags ? (
                    allTags.map((t) => (
                      <ComboboxItem key={t.id} value={t.name}>
                        {t.name}
                      </ComboboxItem>
                    ))
                  ) : (
                    <ComboboxEmpty>No tags found.</ComboboxEmpty>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <Button onClick={addTag} disabled={!selectedTag} size="sm" className="shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <LinkTagGroupTable
            pageSize={4}
            data={layer.tags}
            onDelete={(id) => onRemoveTag(layer.id, id)}
            onOpen={() => {}}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

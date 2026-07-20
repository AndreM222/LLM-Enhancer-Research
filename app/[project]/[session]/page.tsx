'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  ImageOff,
  Pencil,
  Trash2,
} from 'lucide-react';
import { MdDeselect, MdSelectAll } from 'react-icons/md';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/app-navigation';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type Detection = {
  id: string;
  index: number;
  label: string;
  confidence: number;
  box: { x: number; y: number; w: number; h: number };
};

type SessionImage = {
  id: string;
  title: string;
  src: string;
  detections: Detection[];
};

type FilterValue = 'All' | 'Pallet' | 'Forklift' | 'Person';
type SortBy = 'index' | 'confidence';
type SortDir = 'asc' | 'desc';
type DeletePhase = 'idle' | 'fill' | 'flash' | 'remove';

const FILTERS: FilterValue[] = ['All', 'Pallet', 'Forklift', 'Person'];

const INITIAL_IMAGES: SessionImage[] = [
  {
    id: 'img-1',
    title: 'Entrance view',
    src: '/session-preview.jpg',
    detections: [
      {
        id: '1',
        index: 0,
        label: 'Pallet',
        confidence: 43,
        box: { x: 12, y: 28, w: 34, h: 28 },
      },
      {
        id: '2',
        index: 1,
        label: 'Pallet',
        confidence: 47,
        box: { x: 38, y: 12, w: 32, h: 24 },
      },
      {
        id: '3',
        index: 2,
        label: 'Forklift',
        confidence: 59,
        box: { x: 64, y: 30, w: 26, h: 30 },
      },
      {
        id: '4',
        index: 3,
        label: 'Person',
        confidence: 77,
        box: { x: 18, y: 18, w: 10, h: 18 },
      },
    ],
  },
  {
    id: 'img-2',
    title: 'Loading dock',
    src: '/session-preview.jpg',
    detections: [
      {
        id: '5',
        index: 0,
        label: 'Pallet',
        confidence: 66,
        box: { x: 16, y: 42, w: 28, h: 24 },
      },
      {
        id: '6',
        index: 1,
        label: 'Forklift',
        confidence: 82,
        box: { x: 54, y: 25, w: 24, h: 28 },
      },
      {
        id: '7',
        index: 2,
        label: 'Person',
        confidence: 71,
        box: { x: 22, y: 16, w: 9, h: 19 },
      },
    ],
  },
  {
    id: 'img-3',
    title: 'Storage aisle',
    src: '/session-preview.jpg',
    detections: [
      {
        id: '8',
        index: 0,
        label: 'Pallet',
        confidence: 52,
        box: { x: 11, y: 35, w: 30, h: 25 },
      },
      {
        id: '9',
        index: 1,
        label: 'Pallet',
        confidence: 61,
        box: { x: 46, y: 22, w: 26, h: 23 },
      },
      {
        id: '10',
        index: 2,
        label: 'Person',
        confidence: 79,
        box: { x: 71, y: 20, w: 9, h: 18 },
      },
    ],
  },
];

export default function Session() {
  const [images, setImages] = useState(INITIAL_IMAGES);
  const [activeImageId, setActiveImageId] = useState(INITIAL_IMAGES[0].id);
  const [sortBy, setSortBy] = useState<SortBy>('index');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filter, setFilter] = useState<FilterValue>('All');
  const [editMode, setEditMode] = useState(false);
  const [deletePhaseById, setDeletePhaseById] = useState<Record<string, DeletePhase>>({});

  // Per-image UI state (fixed selection/hiding logic)
  const [hiddenByImage, setHiddenByImage] = useState<Record<string, string[]>>({});
  const [selectedByImage, setSelectedByImage] = useState<Record<string, string[]>>({});

  const [imgErrorById, setImgErrorById] = useState<Record<string, boolean>>({});

  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);
  const session = paths.pop();
  const project = paths.pop();

  const activeImage = images.find((img) => img.id === activeImageId) ?? images[0];
  const detections = activeImage?.detections ?? [];

  // Derive current image's hidden/selected arrays
  const hiddenId = hiddenByImage[activeImageId] ?? [];
  const selectedId = selectedByImage[activeImageId] ?? [];

  const selectedCount = selectedId.length;
  const allSelected = detections.length > 0 && selectedId.length === detections.length;
  const someSelected = selectedId.length > 0 && selectedId.length < detections.length;
  const allHidden = detections.length > 0 && hiddenId.length === detections.length;

  const visibleDetections = useMemo(() => {
    const filtered = filter === 'All' ? detections : detections.filter((d) => d.label === filter);
    return [...filtered].sort((a, b) => {
      const aValue = sortBy === 'index' ? a.index : a.confidence;
      const bValue = sortBy === 'index' ? b.index : b.confidence;
      return sortDir === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [detections, filter, sortBy, sortDir]);

  const updateActiveImageDetections = (updater: (dets: Detection[]) => Detection[]) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === activeImageId ? { ...img, detections: updater(img.detections) } : img
      )
    );
  };

  const toggleSelected = (id: string) => {
    setSelectedByImage((prev) => {
      const current = prev[activeImageId] ?? [];
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      return { ...prev, [activeImageId]: next };
    });
  };

  const toggleHidden = (id: string) => {
    setHiddenByImage((prev) => {
      const current = prev[activeImageId] ?? [];
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      return { ...prev, [activeImageId]: next };
    });
  };

  const toggleHideAll = () => {
    setHiddenByImage((prev) => {
      const current = prev[activeImageId] ?? [];
      const next = current.length === detections.length ? [] : detections.map((item) => item.id);
      return { ...prev, [activeImageId]: next };
    });
  };

  const toggleSelectAll = () => {
    setSelectedByImage((prev) => {
      const current = prev[activeImageId] ?? [];
      const next = current.length === detections.length ? [] : detections.map((item) => item.id);
      return { ...prev, [activeImageId]: next };
    });
  };

  const requestDelete = (id: string) => {
    setDeletePhaseById((prev) => ({ ...prev, [id]: 'fill' }));

    window.setTimeout(() => {
      setDeletePhaseById((prev) => ({ ...prev, [id]: 'flash' }));
    }, 280);

    window.setTimeout(() => {
      setDeletePhaseById((prev) => ({ ...prev, [id]: 'remove' }));
    }, 520);

    window.setTimeout(() => {
      updateActiveImageDetections((prev) => prev.filter((d) => d.id !== id));

      // Clean up hidden/selected state for deleted detection
      setHiddenByImage((prev) => {
        const current = prev[activeImageId] ?? [];
        return { ...prev, [activeImageId]: current.filter((item) => item !== id) };
      });
      setSelectedByImage((prev) => {
        const current = prev[activeImageId] ?? [];
        return { ...prev, [activeImageId]: current.filter((item) => item !== id) };
      });

      setDeletePhaseById((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 720);
  };

  const sortedName = sortBy === 'index' ? 'Index' : 'Confidence';

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <PageHeader
          newTitle={session?.toUpperCase()}
          newDescription={`${session?.toUpperCase()} session image detections`}
        />

        <Button variant="outline" size="sm" asChild>
          <Link href={`/${project}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="overflow-hidden flex h-full flex-col">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Session preview</CardTitle>
                <CardDescription>Click detections to highlight matching boxes.</CardDescription>
              </div>
              <Badge variant="secondary">{selectedCount} selected</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 flex-1">
            <div className="relative h-105 overflow-hidden rounded-xl border bg-card">
              {imgErrorById[activeImageId] ? (
                <div className="flex h-full items-center justify-center gap-2 text-muted-foreground">
                  <ImageOff className="h-5 w-5" />
                  <span>Image not found</span>
                </div>
              ) : (
                <>
                  <Image
                    src={activeImage?.src ?? '/session-preview.jpg'}
                    alt={activeImage?.title ?? 'Session preview'}
                    fill
                    className="object-cover opacity-95"
                    onError={() => setImgErrorById((prev) => ({ ...prev, [activeImageId]: true }))}
                  />

                  <svg
                    viewBox="0 0 100 100"
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    preserveAspectRatio="none"
                  >
                    <AnimatePresence>
                      {detections.map((area) => {
                        const isSelected =
                          selectedId.includes(area.id) && !hiddenId.includes(area.id);
                        const isHidden = hiddenId.includes(area.id);

                        return (
                          <motion.g
                            key={area.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: isHidden ? 0.15 : 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                          >
                            <motion.rect
                              x={area.box.x}
                              y={area.box.y}
                              width={area.box.w}
                              height={area.box.h}
                              rx="1.5"
                              ry="1.5"
                              initial={false}
                              animate={{
                                fill: isSelected ? 'rgba(34,197,94,0.20)' : 'rgba(34,197,94,0.08)',
                                stroke: isSelected ? '#22c55e' : 'rgba(34,197,94,0.55)',
                                strokeWidth: isSelected ? 0.2 : 0.1,
                              }}
                              transition={{ duration: 0.18 }}
                              style={{ pointerEvents: 'visiblePainted', cursor: 'pointer' }}
                              onTap={() => toggleSelected(area.id)}
                              whileTap={{ scale: 0.99 }}
                            />
                          </motion.g>
                        );
                      })}
                    </AnimatePresence>
                  </svg>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3 lg:grid-cols-4">
              {[
                { label: 'Session', value: 'S-1044' },
                { label: 'File Name', value: 'Red-Vehicle' },
                { label: 'Type', value: 'PNG' },
                { label: 'Size', value: '125 MB' },
                { label: 'Resolution', value: '1920 x 1080' },
                { label: 'Creation Date', value: 'Mar 6, 2026 at 3:04 PM' },
                { label: 'Modified Date', value: 'Mar 6, 2026 at 3:04 PM' },
                { label: 'Detections', value: detections.length },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  layout
                  whileHover={{ y: -2 }}
                  className="rounded-lg border p-3"
                >
                  <p className="text-muted-foreground">{item.label}</p>
                  <p className="mt-1 font-semibold">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t bg-muted/20 px-6 py-4">
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete session
            </Button>
            <Button variant="outline">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Detections</CardTitle>
                <CardDescription>
                  Select boxes, hide items, sort, and filter by type.
                </CardDescription>
              </div>
              <Badge variant="outline">
                {sortedName} · {sortDir}
              </Badge>
            </div>

            <Card className="overflow-hidden">
              <CardContent>
                <ScrollArea>
                  <div className="space-x-3 flex">
                    {images.map((img) => {
                      const isActive = img.id === activeImageId;
                      const hasError = !!imgErrorById[img.id];

                      return (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => setActiveImageId(img.id)}
                          className={cn(
                            'group w-25 overflow-hidden rounded-2xl border text-left transition',
                            isActive ? 'border-primary ring-2 ring-primary/20' : 'hover:bg-muted/50'
                          )}
                        >
                          <div className="relative h-15 w-full bg-muted/30">
                            {hasError ? (
                              <div className="flex h-full items-center justify-center gap-2 text-xs text-muted-foreground">
                                <ImageOff className="h-3 w-3" />
                              </div>
                            ) : (
                              <Image
                                src={img.src}
                                alt={img.title}
                                fill
                                className="object-cover"
                                onError={() =>
                                  setImgErrorById((prev) => ({ ...prev, [img.id]: true }))
                                }
                              />
                            )}
                            <Badge variant="secondary" className="top-1 right-1 absolute">
                              {img.detections.length}
                            </Badge>
                          </div>

                          <div className="m-3 flex items-center justify-between gap-2 text-xs">
                            <p className="font-medium">{img.title}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>

            <div className="flex flex-wrap items-center gap-2">
              <motion.div whileTap={{ scale: 0.94 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                  title="Flip sort order"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </motion.div>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
                <SelectTrigger className="w-35">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="index">Index</SelectItem>
                  <SelectItem value="confidence">Confidence</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filter} onValueChange={(v) => setFilter(v as FilterValue)}>
                <SelectTrigger className="w-35">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  {FILTERS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="ml-auto flex items-center gap-2">
                <motion.div whileTap={{ scale: 0.94 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleHideAll}
                    title={allHidden ? 'Show all' : 'Hide all'}
                  >
                    {allHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.94 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleSelectAll}
                    title={allSelected ? 'Deselect all' : 'Select all'}
                  >
                    {someSelected ? (
                      <MdDeselect className="h-4 w-4" />
                    ) : (
                      <MdSelectAll className="h-4 w-4" />
                    )}
                  </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.94 }}>
                  <Button
                    variant={editMode ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setEditMode((prev) => !prev)}
                    title="Edit detections"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-2 h-full">
            <ScrollArea className="min-h-100 pr-3">
              <AnimatePresence initial={false} mode="popLayout">
                {visibleDetections.map((item) => {
                  const isSelected = selectedId.includes(item.id) && !hiddenId.includes(item.id);
                  const isHidden = hiddenId.includes(item.id);
                  const deletePhase = deletePhaseById[item.id] ?? 'idle';
                  const deleting = deletePhase !== 'idle';

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={
                        deletePhase === 'fill'
                          ? { opacity: 1, scale: 1 }
                          : deletePhase === 'flash'
                            ? { opacity: [1, 0.92, 1], scale: [1, 1.01, 1] }
                            : deletePhase === 'remove'
                              ? { opacity: 0, x: 28, scale: 0.96 }
                              : { opacity: isHidden ? 0.45 : 1, y: 0, scale: 1 }
                      }
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="relative space-y-1"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSelected(item.id)}
                        className={cn(
                          'relative flex w-full items-center justify-between overflow-hidden rounded-xl border px-4 py-3 text-left transition',
                          isSelected && 'border-zinc-500 bg-zinc-500/10',
                          !isSelected && 'hover:bg-muted/50',
                          isHidden && 'opacity-45',
                          deleting && 'pointer-events-none'
                        )}
                      >
                        <motion.div
                          className="absolute inset-y-0 right-0 rounded-xl"
                          style={{ backgroundColor: 'hsl(var(--destructive))' }}
                          initial={false}
                          animate={{ width: deletePhase === 'idle' ? 0 : '100%' }}
                          transition={{ duration: 0.34, ease: 'easeOut' }}
                        />

                        <div className="relative z-10 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {item.index}: {item.label}
                            </p>
                            <Badge variant="outline">{item.confidence}%</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {editMode
                              ? 'Edit mode enabled: drag, add, or remove boxes on the image.'
                              : 'Click to select and highlight box.'}
                          </p>
                        </div>
                      </button>

                      <div className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex items-center gap-1">
                        <button
                          type="button"
                          className="rounded-md p-2 hover:bg-muted"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleHidden(item.id);
                          }}
                          title={hiddenId.includes(item.id) ? 'Show detection' : 'Hide detection'}
                        >
                          {hiddenId.includes(item.id) ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>

                        {editMode ? (
                          <button
                            type="button"
                            className="rounded-md p-2 text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              requestDelete(item.id);
                            }}
                            title="Delete detection"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </ScrollArea>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t bg-muted/20 px-6 py-4">
            <Button variant="outline" asChild>
              <Link href="/projects">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/projects">
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

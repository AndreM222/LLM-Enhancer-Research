'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { type DateRange } from 'react-day-picker';
import {
  ArrowRight,
  CalendarIcon,
  ImageOff,
  Plus,
  Search,
  SlidersHorizontal,
  Star,
  Tag,
  Upload,
  Users,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  getMarketplaceTemplates,
  getMarketplaceFilters,
  getProjects,
  MarketplaceTemplate,
} from '@/lib/mockApi';
import { ProjectIcon, type Project } from '@/components/project-cards';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';

const templates: MarketplaceTemplate[] = getMarketplaceTemplates();
const filters = getMarketplaceFilters();
const allProjects: Project[] = getProjects();

// ── template card ────────────────────────────────────────────────────────────

function TemplateCard({
  item,
  imgErrors,
  onImgError,
}: {
  item: ReturnType<typeof getMarketplaceTemplates>[number];
  imgErrors: Record<string, boolean>;
  onImgError: (key: string) => void;
}) {
  return (
    <Link href={`/marketplace/${item.slug}`} className="group block">
      <Card className="overflow-hidden transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg">
        {/* images */}
        <div className="relative overflow-hidden border-b bg-muted/20">
          {item.previewImages?.length ? (
            <div className="grid gap-1 p-2">
              <div className="relative h-40 w-full overflow-hidden rounded-xl">
                {imgErrors[`${item.id}-0`] ? (
                  <div className="flex h-full items-center justify-center gap-2 text-muted-foreground">
                    <ImageOff className="h-5 w-5" />
                    <span>Image not found</span>
                  </div>
                ) : (
                  <Image
                    src={item.previewImages[0] ?? '/session-preview.jpg'}
                    alt={item.name}
                    fill
                    className="object-cover"
                    onError={() => onImgError(`${item.id}-0`)}
                  />
                )}
              </div>
              {item.previewImages.length > 1 && (
                <div className="grid grid-cols-3 gap-1">
                  {item.previewImages.slice(1, 4).map((src, i) => (
                    <div key={i} className="relative h-16 overflow-hidden rounded-lg">
                      {imgErrors[`${item.id}-${i + 1}`] ? (
                        <div className="flex h-full items-center justify-center border rounded-lg text-muted-foreground">
                          <ImageOff className="h-4 w-4" />
                        </div>
                      ) : (
                        <Image
                          src={src ?? '/session-preview.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                          onError={() => onImgError(`${item.id}-${i + 1}`)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-44 items-center justify-center p-6">
              <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed text-sm text-muted-foreground">
                No preview images
              </div>
            </div>
          )}
          <div className="absolute left-3 top-3 flex gap-2">
            {item.featured && <Badge>Featured</Badge>}
            <Badge variant="secondary">{item.mode}</Badge>
          </div>
        </div>

        <CardHeader className="space-y-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              {item.name}
              <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
            </CardTitle>
            <CardDescription className="mt-1">{item.description}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                <Tag className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl border p-3">
              <p className="text-muted-foreground">Base</p>
              <p className="mt-1 font-medium">{item.baseModel}</p>
            </div>
            <div className="rounded-xl border p-3">
              <p className="text-muted-foreground">Rules</p>
              <p className="mt-1 font-medium">{item.rules}</p>
            </div>
            <div className="rounded-xl border p-3">
              <p className="text-muted-foreground">Rating</p>
              <p className="mt-1 flex items-center gap-1 font-medium">
                <Star className="h-3.5 w-3.5 fill-current text-yellow-500" />
                {item.rating}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>by {item.creator}</span>
            <span>{item.updated}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {item.users} uses
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

import PublishDialog from '@/components/dialogs/publish-dialog';

// ── main page ─────────────────────────────────────────────────────────────────

export default function Marketplace() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('search') ?? '');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [publishOpen, setPublishOpen] = useState(searchParams.get('dialog') === 'publish');
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const dialog = searchParams.get('dialog');
    setPublishOpen(dialog === 'publish');
    setQuery(searchParams.get('search') ?? '');
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) params.set('search', query);
    else params.delete('search');
    router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
  }, [query]);

  const onImgError = (key: string) => setImgErrors((prev) => ({ ...prev, [key]: true }));

  const toggleFilter = (f: string) =>
    setActiveFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  const filtered = useMemo(() => {
    return templates.filter((item) => {
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));

      const matchesFilter =
        activeFilters.length === 0 ||
        activeFilters.every((f) => (f === 'Featured' ? item.featured : item.mode === f));

      return matchesQuery && matchesFilter;
    });
  }, [query, activeFilters]);

  return (
    <div className="space-y-8">
      {/* hero bar */}
      <section className="rounded-3xl border bg-linear-to-br from-background via-background to-muted/30 p-6 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* browse filters dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Browse filters
                {activeFilters.length > 0 && (
                  <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="start">
              <DropdownMenuLabel>Filter templates</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-2 py-1">
                Type
              </DropdownMenuLabel>
              {filters.map((f) => (
                <DropdownMenuCheckboxItem
                  key={f}
                  checked={activeFilters.includes(f)}
                  onCheckedChange={() => toggleFilter(f)}
                >
                  {f}
                </DropdownMenuCheckboxItem>
              ))}

              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-2 py-1">
                Date range
              </DropdownMenuLabel>
              <div className="px-2 pb-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start gap-2 font-normal">
                      <CalendarIcon className="h-4 w-4" />
                      {dateRange?.from
                        ? dateRange.to
                          ? `${format(dateRange.from, 'LLL dd, y')} – ${format(dateRange.to, 'LLL dd, y')}`
                          : format(dateRange.from, 'LLL dd, y')
                        : 'Pick a date range'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                {dateRange && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 w-full text-muted-foreground"
                    onClick={() => setDateRange(undefined)}
                  >
                    Clear date range
                  </Button>
                )}
              </div>

              {activeFilters.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="px-2 pb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-muted-foreground"
                      onClick={() => setActiveFilters([])}
                    >
                      Clear all filters
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="gap-2" onClick={() => setPublishOpen(true)}>
            Publish template <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* active filter chips */}
        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {activeFilters.map((f) => (
              <Badge
                key={f}
                variant="secondary"
                className="gap-1 cursor-pointer"
                onClick={() => toggleFilter(f)}
              >
                {f} <X className="h-3 w-3" />
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-6 relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates, tags, or creators..."
            className="pl-9"
          />
        </div>
      </section>

      {/* grid + sidebar */}
      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {activeFilters.length > 0 ? 'Filtered templates' : 'Featured templates'}
            </h2>
            <p className="text-sm text-muted-foreground">{filtered.length} results</p>
          </div>

          {filtered.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed text-muted-foreground">
              No templates match your filters.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((item) => (
                <TemplateCard
                  key={item.id}
                  item={item}
                  imgErrors={imgErrors}
                  onImgError={onImgError}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Publish a template</CardTitle>
              <CardDescription>
                Share your model setup without exposing private training images.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Include your mode, tags, rules, base model, and recommended workflow.</p>
              <p>Optional preview images help others understand the template before cloning it.</p>
              <p>
                The marketplace shares configuration and preview media only, not source training
                data.
              </p>
              <Button className="w-full gap-2 mt-2" onClick={() => setPublishOpen(true)}>
                <Plus className="h-4 w-4" /> Publish template
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What gets shared</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Mode configuration</p>
              <p>• Tags and labels</p>
              <p>• Rules and validation logic</p>
              <p>• Base model metadata</p>
              <p>• Optional preview images</p>
            </CardContent>
          </Card>
        </aside>
      </section>

      <PublishDialog open={publishOpen} onOpenChange={setPublishOpen} />
    </div>
  );
}

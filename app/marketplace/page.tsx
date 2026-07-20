'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, Search, SlidersHorizontal, Tag, Users, Star, Eye } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Template = {
  id: string;
  slug: string;
  name: string;
  creator: string;
  description: string;
  mode: string;
  baseModel: string;
  tags: string[];
  rules: number;
  rating: number;
  users: string;
  updated: string;
  featured?: boolean;
  previewImages?: string[];
};

const templates: Template[] = [
  {
    id: '1',
    slug: 'warehouse-safety-qa',
    name: 'Warehouse Safety QA',
    creator: 'andre m.',
    description: 'Detection-first review setup for pallet, forklift, and person workflows.',
    mode: 'Detection',
    baseModel: 'YOLOv8',
    tags: ['warehouse', 'safety', 'ppe', 'review'],
    rules: 14,
    rating: 4.9,
    users: '2.4k',
    updated: '2 days ago',
    featured: true,
    previewImages: ['/session-preview.jpg', '/session-preview.jpg', '/session-preview.jpg'],
  },
  {
    id: '2',
    slug: 'retail-shelf-audit',
    name: 'Retail Shelf Audit',
    creator: 'maya labs',
    description: 'Fast tagging flow for stockouts, shelf gaps, and product placement checks.',
    mode: 'Classification',
    baseModel: 'ConvNeXt',
    tags: ['retail', 'audit', 'inventory'],
    rules: 8,
    rating: 4.7,
    users: '1.1k',
    updated: '5 days ago',
    previewImages: ['/session-preview.jpg', '/session-preview.jpg'],
  },
  {
    id: '3',
    slug: 'construction-risk-scan',
    name: 'Construction Risk Scan',
    creator: 'field ops',
    description: 'A reusable starting point for hazard labeling and compliance review.',
    mode: 'Detection',
    baseModel: 'RT-DETR',
    tags: ['construction', 'hazard', 'compliance'],
    rules: 11,
    rating: 4.8,
    users: '980',
    updated: '1 week ago',
  },
  {
    id: '4',
    slug: 'medical-image-triage',
    name: 'Medical Image Triage',
    creator: 'northstar ai',
    description: 'Clean triage pipeline for fast labeling and expert escalation.',
    mode: 'Review',
    baseModel: 'ViT',
    tags: ['medical', 'triage', 'review'],
    rules: 16,
    rating: 4.6,
    users: '620',
    updated: '3 days ago',
    previewImages: ['/session-preview.jpg'],
  },
];

const filters = ['All', 'Featured', 'Detection', 'Classification', 'Review'];

export default function Marketplace() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    return templates.filter((item) => {
      const matchesQuery =
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));

      const matchesFilter =
        filter === 'All' ? true : filter === 'Featured' ? item.featured : item.mode === filter;

      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border bg-linear-to-br from-background via-background to-muted/30 p-6 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Browse filters
          </Button>
          <Button className="gap-2">
            Publish template
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates, tags, or creators..."
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <Button
                key={item}
                variant={filter === item ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Featured templates</h2>
            <p className="text-sm text-muted-foreground">{filtered.length} results</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((item) => (
              <Link key={item.id} href={`/marketplace/${item.slug}`} className="group block">
                <Card className="overflow-hidden transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg">
                  <div className="relative overflow-hidden border-b bg-muted/20">
                    {item.previewImages?.length ? (
                      <div className="grid gap-1 p-2">
                        <img
                          src={item.previewImages[0]}
                          alt={`${item.name} preview`}
                          className="h-40 w-full rounded-xl object-cover"
                        />
                        {item.previewImages.length > 1 ? (
                          <div className="grid grid-cols-3 gap-1">
                            {item.previewImages.slice(1, 4).map((src, index) => (
                              <img
                                key={index}
                                src={src}
                                alt={`${item.name} preview ${index + 2}`}
                                className="h-14 w-full rounded-lg object-cover"
                              />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="flex h-45 items-center justify-center p-6">
                        <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed text-sm text-muted-foreground">
                          No preview images
                        </div>
                      </div>
                    )}

                    <div className="absolute left-3 top-3 flex gap-2">
                      {item.featured ? <Badge>Featured</Badge> : null}
                      <Badge variant="secondary">{item.mode}</Badge>
                    </div>
                  </div>

                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {item.name}
                          <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </CardTitle>
                        <CardDescription className="mt-1">{item.description}</CardDescription>
                      </div>
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {item.users} uses
                      </div>

                      <Button className="gap-2" variant="outline" type="button">
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
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
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Copy,
  Download,
  Star,
  Tag,
  Users,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getSharedModel } from '@/lib/mockApi';

const model = getSharedModel();

export default function SharedModel() {
  const [selectedImage, setSelectedImage] = useState(0);

  const activeImage = useMemo(
    () => model.previewImages[selectedImage] ?? model.previewImages[0],
    [selectedImage]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Button variant="outline" size="icon" asChild>
          <Link href="/marketplace">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <span>Marketplace</span>
        <ArrowRight className="h-4 w-4" />
        <span>{model.name}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <div className="border-b bg-muted/20 p-3">
            <img
              src={activeImage}
              alt={`${model.name} preview ${selectedImage + 1}`}
              className="h-105 w-full rounded-2xl object-cover"
            />
          </div>

          <CardContent className="space-y-3 p-4">
            <div className="grid grid-cols-3 gap-2">
              {model.previewImages.map((src, index) => (
                <button
                  key={src + index}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    'overflow-hidden rounded-xl border transition',
                    selectedImage === index
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border'
                  )}
                >
                  <img
                    src={src}
                    alt={`${model.name} thumbnail ${index + 1}`}
                    className="h-20 w-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {model.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                {model.mode}
              </Badge>
              <CardTitle className="text-2xl">{model.name}</CardTitle>
              <CardDescription>{model.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border p-3">
                  <p className="text-muted-foreground">Author</p>
                  <p className="mt-1 font-medium">{model.creator}</p>
                </div>
                <div className="rounded-xl border p-3">
                  <p className="text-muted-foreground">Base model</p>
                  <p className="mt-1 font-medium">{model.baseModel}</p>
                </div>
                <div className="rounded-xl border p-3">
                  <p className="text-muted-foreground">Rules</p>
                  <p className="mt-1 font-medium">{model.rules}</p>
                </div>
                <div className="rounded-xl border p-3">
                  <p className="text-muted-foreground">Version</p>
                  <p className="mt-1 font-medium">{model.version}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl border p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Uses
                  </div>
                  <p className="mt-1 font-medium">{model.users}</p>
                </div>
                <div className="rounded-xl border p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Star className="h-4 w-4" />
                    Rating
                  </div>
                  <p className="mt-1 font-medium">{model.rating}</p>
                </div>
                <div className="rounded-xl border p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    Updated
                  </div>
                  <p className="mt-1 font-medium">{model.updated}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What is shared</CardTitle>
              <CardDescription>
                Only configuration, labels, rules, and optional preview images are shared.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Mode setup and workflow rules</p>
              <p>• Tags and label structure</p>
              <p>• Base model and version metadata</p>
              <p>• Optional preview gallery</p>
              <p>• No raw training images</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button className="gap-2">
              <Copy className="h-4 w-4" />
              Clone template
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export setup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

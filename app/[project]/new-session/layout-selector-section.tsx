'use client';

import { ChevronLeft, ChevronRight, ImagePlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { SessionLayoutGroup } from '@/lib/mockApi';

export function LayoutSection({
  layouts,
  selectedLayoutId,
  onLayoutChange,
  onBack,
  onContinue,
}: {
  layouts: SessionLayoutGroup[];
  selectedLayoutId: string;
  onLayoutChange: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose a layout</CardTitle>
        <CardDescription>
          Select the ordered picture layout you want to use for this session.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {layouts.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No layouts available</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect a layout to this project before creating a session.
            </p>
          </div>
        ) : (
          <RadioGroup
            value={selectedLayoutId}
            onValueChange={onLayoutChange}
            className="grid gap-3 md:grid-cols-2"
          >
            {layouts.map((layout) => (
              <Label
                key={layout.id}
                htmlFor={layout.id}
                className={cn(
                  'cursor-pointer rounded-xl border p-4 transition-colors',
                  selectedLayoutId === layout.id && 'border-primary bg-primary/5'
                )}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem id={layout.id} value={layout.id} className="mt-1" />

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{layout.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{layout.description}</p>

                    <div className="mt-3 flex flex-wrap gap-1">
                      <Badge variant="secondary">{layout.steps.length} pictures</Badge>

                      <Badge variant="outline">
                        {layout.steps.filter((step) => step.required).length} required
                      </Badge>
                    </div>

                    <div className="mt-4 space-y-2">
                      {layout.steps.map((step) => (
                        <div
                          key={step.id}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px]">
                            {step.position}
                          </span>
                          <span>{step.title}</span>
                          {!step.required && <span className="ml-auto">Optional</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Label>
            ))}
          </RadioGroup>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button onClick={onContinue} disabled={layouts.length === 0}>
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

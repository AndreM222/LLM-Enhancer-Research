'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PageItems } from '@/components/app-sidebar';
import { buttonVariants } from '@/components/ui/button';

export default function SettingsLayout() {
  const items = PageItems();

  return (
    <nav className="flex flex-col gap-2">
      {items?.map((item) => {
        if (!item.isactive) return null;

        return (
          <Link
            key={item.url}
            href={item.url}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'h-auto w-full justify-start rounded-xl border px-4 py-3 text-left transition-colors',
              'border-primary/20 bg-primary/10 text-primary hover:bg-primary/10'
            )}
          >
            <div className="flex w-full flex-col items-start gap-1">
              <span className="text-sm font-medium">{item.title}</span>
              {item.description ? (
                <span className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {item.description}
                </span>
              ) : null}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

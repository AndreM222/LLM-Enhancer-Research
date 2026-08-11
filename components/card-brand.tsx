import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Check, ShieldQuestionMark, Trash2 } from 'lucide-react';
import { useRef } from 'react';
import { FaApple, FaGoogle } from 'react-icons/fa6';

export type CardBrand =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'apple_pay'
  | 'google_pay'
  | 'unknown';

export function detectBrand(raw: string): CardBrand {
  const d = raw.replace(/\D/g, '');
  if ('apple_pay' === d) return 'apple_pay';
  if ('google_pay' === d) return 'google_pay';
  if (d.startsWith('4')) return 'visa';
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return 'mastercard';
  if (/^3[47]/.test(d)) return 'amex';
  if (/^6(?:011|5)/.test(d)) return 'discover';
  return 'unknown';
}

export function getBrandLabel(brand: CardBrand): string {
  const map: Record<CardBrand, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'Amex',
    discover: 'Discover',
    apple_pay: 'Apple',
    google_pay: 'Google',
    unknown: 'Card',
  };
  return map[brand];
}

export function CardBrandIcon({ brand, className }: { brand: CardBrand; className?: string }) {
  if (brand === 'visa')
    return (
      <svg viewBox="0 0 48 16" className={className} aria-label="Visa">
        <text x="0" y="14" fontSize="16" fontWeight="bold" fontFamily="Arial" fill="white">
          VISA
        </text>
      </svg>
    );

  if (brand === 'mastercard')
    return (
      <svg viewBox="0 0 38 24" className={className} aria-label="Mastercard">
        <circle cx="13" cy="12" r="12" fill="#EB001B" />
        <circle cx="25" cy="12" r="12" fill="#F79E1B" />
        <path d="M19 4.8a12 12 0 0 1 0 14.4A12 12 0 0 1 19 4.8z" fill="#FF5F00" />
      </svg>
    );

  if (brand === 'amex')
    return (
      <svg viewBox="0 0 48 16" className={className} aria-label="American Express">
        <rect width="48" height="16" rx="2" fill="#2E77BC" />
        <text x="4" y="13" rx="2" fontSize="13" fontWeight="bold" fontFamily="Arial" fill="white">
          AMEX
        </text>
      </svg>
    );

  if (brand === 'discover')
    return (
      <svg viewBox="0 0 48 16" className={className} aria-label="Discover">
        <rect width="48" height="16" rx="2" fill="#231F20" />
        <circle cx="40" cy="8" r="8" fill="#F76F20" />
        <text x="4" y="12" fontSize="8" fontWeight="bold" fontFamily="Arial" fill="white">
          DISCOVER
        </text>
      </svg>
    );

  // ── wallet brands — rendered as plain divs, not SVG ──
  if (brand === 'apple_pay')
    return (
      <div className={cn('flex items-center justify-end', className)}>
        <FaApple className="h-4 w-auto text-white" />
        <span className="ml-1 text-white font-semibold text-sm tracking-tight">Pay</span>
      </div>
    );

  if (brand === 'google_pay')
    return (
      <div className={cn('flex items-center justify-end', className)}>
        <FaGoogle className="h-4 w-auto text-white" />
        <span className="ml-1 text-white font-semibold text-sm tracking-tight">Pay</span>
      </div>
    );

  return (
    <div className={cn('flex items-center justify-end', className)}>
      <ShieldQuestionMark className="h-full w-auto text-white" />
    </div>
  );
}

// Visual card component — looks like a physical card
export function PaymentCardVisual({
  card,
  isSelected,
  onSelect,
  onSetDefault,
  onRemove,
  showActions = true,
}: {
  card: {
    id: string;
    last4: string;
    brand: CardBrand;
    expiry: string;
    isDefault: boolean;
    name: string;
  };
  isSelected?: boolean;
  onSelect?: () => void;
  onSetDefault?: () => void;
  onRemove?: () => void;
  showActions?: boolean;
}) {
  const gradients: Record<CardBrand, string> = {
    visa: 'from-[#1a1f71] to-[#2563eb]',
    mastercard: 'from-[#1a1a1a] to-[#374151]',
    amex: 'from-[#1d4ed8] to-[#2e77bc]',
    discover: 'from-[#1c1917] to-[#292524]',
    apple_pay: 'from-[#7c7c7e] to-[#ededed]', // Apple dark
    google_pay: 'from-[#4285F4] to-[#0F9D58]', // Google blue→green
    unknown: 'from-[#18181b] to-[#3f3f46]',
  };

  const boundingRef = useRef<DOMRect | null>(null);

  return (
    <div className="space-y-2 grid justify-self-center w-full perspective-midrange">
      <button
        onMouseLeave={() => (boundingRef.current = null)}
        onMouseEnter={(e) => {
          boundingRef.current = e.currentTarget.getBoundingClientRect();
        }}
        onMouseMove={(e) => {
          if (!boundingRef.current) return;
          const x = e.clientX - boundingRef.current.left;
          const y = e.clientY - boundingRef.current.top;
          const xPercentage = x / boundingRef.current.width;
          const yPercentage = y / boundingRef.current.height;
          e.currentTarget.style.setProperty('--x-rotation', `${(0.5 - yPercentage) * 20}deg`);
          e.currentTarget.style.setProperty('--y-rotation', `${(xPercentage - 0.5) * 20}deg`);
        }}
        type="button"
        onClick={onSelect}
        className={cn(
          'hover:rotate-x-(--x-rotation) hover:rotate-y-(--y-rotation) ease-out',
          'relative justify-self-center w-full max-w-80 rounded-2xl p-5 text-left transition-all duration-200 self-center',
          `bg-linear-to-br ${gradients[card.brand]}`,
          isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
          onSelect && 'cursor-pointer hover:scale-[1.01]'
        )}
      >
        <>
          <div className="mb-6 flex items-start justify-between">
            <div className="h-8 w-11 rounded-md bg-stone-700/80 shadow-inner" />
            <CardBrandIcon brand={card.brand} className="h-7 w-12" />
          </div>

          <p className="text-sm tracking-[0.2em] text-white/90">•••• •••• •••• {card.last4}</p>
          <p className="text-sm tracking-[0.2em] text-white/90">{card.name}</p>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/50">Expires</p>
              <p className="text-sm font-medium text-white/80">{card.expiry}</p>
            </div>
            {card.isDefault && (
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/20">
                Default
              </Badge>
            )}
          </div>
        </>

        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-tr from-white/5 via-white/10 to-transparent" />
      </button>

      {showActions && (
        <div className="flex gap-2 px-1">
          {!card.isDefault && onSetDefault && (
            <Button size="sm" variant="outline" className="gap-1.5" onClick={onSetDefault}>
              <Check className="h-3.5 w-3.5" /> Set default
            </Button>
          )}
          {onRemove && (
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={onRemove}
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

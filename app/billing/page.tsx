'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Check, CreditCard, Plus, ShieldCheck, Trash2, Wallet } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { getInvoices, getPlanUsage } from '@/lib/mockApi';
import { Progress } from '@/components/ui/progress';
import { InvoiceTable } from '@/components/tables/invoice-columns';

const invoices = getInvoices();
const usage = getPlanUsage();

type PaymentCard = {
  id: string;
  last4: string;
  brand: string;
  expiry: string;
  isDefault: boolean;
};

type CardForm = {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
  country: string;
  address1: string;
  taxType: string;
  taxId: string;
  useBillingAsTeamPrimary: boolean;
};

const INITIAL_CARDS: PaymentCard[] = [
  { id: 'card-1', last4: '4242', brand: 'Visa', expiry: '09/28', isDefault: true },
];

const EMPTY_FORM: CardForm = {
  number: '',
  expiry: '',
  cvc: '',
  name: '',
  country: 'US',
  address1: '',
  taxType: 'VAT',
  taxId: '',
  useBillingAsTeamPrimary: true,
};

function maskNumber(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function detectBrand(raw: string) {
  const d = raw.replace(/\D/g, '');
  if (d.startsWith('4')) return 'Visa';
  if (/^5[1-5]/.test(d)) return 'Mastercard';
  if (/^3[47]/.test(d)) return 'Amex';
  return 'Card';
}

export default function BillingDialogPage() {
  const [cards, setCards] = useState<PaymentCard[]>(INITIAL_CARDS);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CardForm>(EMPTY_FORM);

  const totalUsage = useMemo(
    () =>
      Math.round(
        (usage.reduce((sum, item) => sum + item.value / item.limit, 0) / usage.length) * 100
      ),
    []
  );

  const defaultCard = cards.find((card) => card.isDefault);

  const setDefault = (id: string) => {
    setCards((prev) => prev.map((c) => ({ ...c, isDefault: c.id === id })));
    toast.success('Default card updated.');
  };

  const removeCard = (id: string) => {
    setCards((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (next.length === 0) return next;
      if (!next.some((c) => c.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
    toast.success('Card removed.');
  };

  const handleAdd = (e: React.SubmitEvent) => {
    e.preventDefault();

    const digits = form.number.replace(/\D/g, '');
    if (digits.length < 13) {
      toast.error('Enter a valid card number.');
      return;
    }
    if (!form.expiry.match(/^\d{2}\/\d{2}$/)) {
      toast.error('Enter expiry as MM/YY.');
      return;
    }
    if (!form.cvc.match(/^\d{3,4}$/)) {
      toast.error('Enter a valid CVC.');
      return;
    }
    if (!form.name.trim()) {
      toast.error('Enter the cardholder name.');
      return;
    }
    if (!form.address1.trim()) {
      toast.error('Enter a billing address.');
      return;
    }

    const newCard: PaymentCard = {
      id: `card-${Date.now()}`,
      last4: digits.slice(-4),
      brand: detectBrand(form.number),
      expiry: form.expiry,
      isDefault: cards.length === 0,
    };

    setCards((prev) => [...prev, newCard]);
    setForm(EMPTY_FORM);
    setOpen(false);
    toast.success(`${newCard.brand} ending in ${newCard.last4} added.`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Current plan</CardTitle>
              <CardDescription>Next billing date: Aug 2, 2026</CardDescription>
            </div>
            <Badge>Pro</Badge>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Monthly price</p>
                  <p className="mt-2 text-2xl font-semibold">$59</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Billing status</p>
                  <p className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    Active
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usage</CardTitle>
                <CardDescription>Summary of data usage throughout the project.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Plan usage</p>
                    <p className="text-sm text-muted-foreground">{totalUsage}% average used</p>
                  </div>
                  <Progress value={totalUsage} className="h-2" />
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {usage.map((item) => {
                    const percent = Math.round((item.value / item.limit) * 100);
                    return (
                      <Card key={item.label}>
                        <CardHeader>
                          <CardTitle className="text-sm text-muted-foreground">
                            {item.label}
                          </CardTitle>
                          <CardAction>
                            <div className={cn('h-2.5 w-2.5 rounded-full', item.tone)} />
                          </CardAction>
                        </CardHeader>
                        <CardContent>
                          <p className="mt-2 text-lg font-semibold">
                            {item.value} / {item.limit}
                          </p>
                          <Progress value={percent} className="mt-3 h-2" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice history</CardTitle>
            <CardDescription>Download past billing receipts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <InvoiceTable data={invoices} pageSize={10} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <CardTitle>Payment methods</CardTitle>
            <CardDescription>The default card is charged on renewal.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className={cn(
                  'rounded-xl border p-4 transition-colors',
                  card.isDefault && 'border-primary/40 bg-primary/5'
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border p-2">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {card.brand} ending in {card.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">Expires {card.expiry}</p>
                    </div>
                  </div>

                  {card.isDefault ? <Badge variant="outline">Default</Badge> : null}
                </div>

                <div className="mt-3 flex gap-2">
                  {!card.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => setDefault(card.id)}
                    >
                      <Check className="h-3.5 w-3.5" />
                      Set default
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-auto gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeCard(card.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full gap-2" onClick={() => setOpen(true)}>
              <Wallet className="h-4 w-4" />
              Add payment method
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing note</CardTitle>
            <CardDescription>Keep usage and invoices visible to reduce surprises.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              Overage charges are shown clearly before checkout or renewal.
            </p>
            {defaultCard && (
              <p className="font-medium text-foreground">
                Next charge goes to {defaultCard.brand} ···· {defaultCard.last4}.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl">
          <form onSubmit={handleAdd}>
            <DialogHeader>
              <DialogTitle>Add payment method</DialogTitle>
              <DialogDescription>
                Add a card, billing address, and tax info for your subscription.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-5">
                <div className="rounded-2xl border bg-muted/20 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Button variant="default" size="sm" type="button" className="gap-2">
                      <CreditCard className="h-4 w-4" />
                      Card
                    </Button>
                    <Button variant="outline" size="sm" type="button" className="gap-2">
                      <Wallet className="h-4 w-4" />
                      Google Pay
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="card-number">Card number</Label>
                      <Input
                        id="card-number"
                        placeholder="1234 1234 1234 1234"
                        value={form.number}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            number: maskNumber(e.target.value),
                          }))
                        }
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor="card-expiry">Expiration date</Label>
                        <Input
                          id="card-expiry"
                          placeholder="MM / YY"
                          value={form.expiry}
                          maxLength={5}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, '');
                            if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                            setForm((p) => ({ ...p, expiry: v }));
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="card-cvc">Security code</Label>
                        <Input
                          id="card-cvc"
                          placeholder="CVC"
                          value={form.cvc}
                          maxLength={4}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              cvc: e.target.value.replace(/\D/g, ''),
                            }))
                          }
                        />
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      By providing your card information, you allow us to charge your card for
                      future payments in accordance with our terms.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="full-name">Full name</Label>
                    <Input
                      id="full-name"
                      placeholder="Andre Mossi"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="country">Country or region</Label>
                    <Select
                      value={form.country}
                      onValueChange={(value) => setForm((p) => ({ ...p, country: value }))}
                    >
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="address1">Address line 1</Label>
                    <Input
                      id="address1"
                      placeholder="123 Main St"
                      value={form.address1}
                      onChange={(e) => setForm((p) => ({ ...p, address1: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border p-3">
                    <Checkbox
                      checked={form.useBillingAsTeamPrimary}
                      onCheckedChange={(checked) =>
                        setForm((p) => ({
                          ...p,
                          useBillingAsTeamPrimary: checked === true,
                        }))
                      }
                      id="use-billing"
                    />
                    <div className="grid gap-1">
                      <Label htmlFor="use-billing" className="leading-none">
                        Use the billing address as my team&apos;s primary address
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Applies this address to your organization&apos;s profile.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Tax ID (optional)</Label>
                    <div className="grid grid-cols-[180px_1fr] gap-3">
                      <Select
                        value={form.taxType}
                        onValueChange={(value) => setForm((p) => ({ ...p, taxType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VAT">EU VAT number</SelectItem>
                          <SelectItem value="GST">GST number</SelectItem>
                          <SelectItem value="TIN">TIN</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="DE000000000"
                        value={form.taxId}
                        onChange={(e) => setForm((p) => ({ ...p, taxId: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-medium">Included credit</p>
                    <p className="text-sm text-muted-foreground">$20</p>
                  </div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-medium">Free domain with Pro</p>
                    <p className="text-sm text-muted-foreground">$0</p>
                  </div>
                </div>

                <div className="rounded-2xl border p-4 text-sm text-muted-foreground">
                  <p>
                    Upon clicking <span className="font-medium text-foreground">Upgrade</span>,
                    you&apos;ll be charged immediately and then every month, until you cancel.
                  </p>
                  <p className="mt-3">
                    On-demand usage beyond the included credit will be charged in arrears on your
                    next invoice.
                  </p>
                </div>

                <div className="rounded-2xl border p-4">
                  <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Product</span>
                    <span>Cost</span>
                  </div>

                  <div className="rounded-lg bg-muted/30 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Pro plan</p>
                      <p className="font-medium">$59/mo</p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Includes team collaboration and improved performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="min-w-32">
                Upgrade
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

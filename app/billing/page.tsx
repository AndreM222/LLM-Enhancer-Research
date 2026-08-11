'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CreditCard, ShieldCheck, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'motion/react';

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
import { getGlobalActivity, getInvoices, getPlanUsage } from '@/lib/mockApi';
import { Progress } from '@/components/ui/progress';
import { InvoiceTable } from '@/components/tables/invoice-columns';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Flag from 'react-world-flags';
import {
  CardBrand,
  CardBrandIcon,
  PaymentCardVisual,
  detectBrand,
  getBrandLabel,
} from '@/components/card-brand';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAvailableWallets } from '@/hooks/payment-method';
import { ScrollArea } from '@/components/ui/scroll-area';

const invoices = getInvoices();
const usage = getPlanUsage();

type PaymentCard = {
  id: string;
  last4: string;
  brand: CardBrand;
  expiry: string;
  isDefault: boolean;
  name: string;
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
  { id: 'card-1', last4: '4242', brand: 'visa', expiry: '09/28', isDefault: true, name: 'Jerry' },
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

export default function BillingPage() {
  const [cards, setCards] = useState<PaymentCard[]>(INITIAL_CARDS);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<CardForm>(EMPTY_FORM);
  const { wallets, loading } = useAvailableWallets();
  const [paymentTab, setPaymentTab] = useState<'card' | 'apple_pay' | 'google_pay'>('card');

  // reset to card if selected wallet becomes unavailable
  useEffect(() => {
    if (paymentTab !== 'card' && !wallets.includes(paymentTab)) {
      setPaymentTab('card');
    }
  }, [wallets, paymentTab]);

  const { countries } = getGlobalActivity();

  const totalUsage = useMemo(
    () => Math.round((usage.reduce((sum, i) => sum + i.value / i.limit, 0) / usage.length) * 100),
    []
  );

  const defaultCard = cards.find((c) => c.isDefault);
  const liveBrand = detectBrand(form.number);
  const deletingCard = cards.find((c) => c.id === deleteId);

  const setDefault = (id: string) => {
    setCards((prev) => prev.map((c) => ({ ...c, isDefault: c.id === id })));
    toast.success('Default card updated.');
  };

  const confirmRemove = () => {
    if (!deleteId) return;
    setCards((prev) => {
      const next = prev.filter((c) => c.id !== deleteId);
      if (next.length && !next.some((c) => c.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
    setDeleteId(null);
    toast.success('Card removed.');
  };

  const handleAdd = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (paymentTab === 'apple_pay' || paymentTab === 'google_pay') {
      const newCard: PaymentCard = {
        id: `card-${Date.now()}`,
        last4: '0000',
        brand: paymentTab,
        expiry: '——',
        isDefault: cards.length === 0,
        name: form.name,
      };
      setCards((prev) => [...prev, newCard]);
      setAddOpen(false);
      toast.success(`${getBrandLabel(paymentTab)} added.`);
      return;
    }

    const digits = form.number.replace(/\D/g, '');
    if (digits.length < 13) {
      toast.error('Enter a valid card number.');
      return;
    }

    const name = form.name.trim();
    if (name.length < 4) {
      toast.error('Enter a valid name.');
      return;
    }
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
          <CardContent>
            <InvoiceTable data={invoices} pageSize={10} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment methods</CardTitle>
            <CardDescription>The default card is charged on renewal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence initial={false} mode="popLayout">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  layoutId={card.id}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                >
                  <PaymentCardVisual
                    card={card}
                    onSetDefault={() => setDefault(card.id)}
                    onRemove={() => setDeleteId(card.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {cards.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No payment methods on file.
              </p>
            )}

            <Button variant="outline" className="w-full gap-2" onClick={() => setAddOpen(true)}>
              <Wallet className="h-4 w-4" /> Add payment method
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
                Next charge goes to {getBrandLabel(defaultCard.brand)} ···· {defaultCard.last4}.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-3xl">
          <form onSubmit={handleAdd}>
            <DialogHeader>
              <DialogTitle>Add payment method</DialogTitle>
              <DialogDescription>
                Add a card, billing address, and tax info for your subscription.
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-200" type="scroll">
              <div className="grid gap-6 py-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-5">
                  <div className="rounded-2xl border bg-muted/20 p-4">
                    <div className="mb-4">
                      <Tabs
                        value={paymentTab}
                        onValueChange={(v) => {
                          if (v !== 'card') setForm(EMPTY_FORM);
                          setPaymentTab(v as typeof paymentTab);
                        }}
                      >
                        <TabsList>
                          <TabsTrigger value="card">
                            <CreditCard className="h-4 w-4 mr-1.5" /> Card
                          </TabsTrigger>

                          {!loading && wallets.includes('apple_pay') && (
                            <TabsTrigger value="apple_pay">
                              <svg viewBox="0 0 50 20" className="h-4 w-8" aria-label="Apple Pay">
                                <text
                                  x="0"
                                  y="14"
                                  fontSize="13"
                                  fontWeight="600"
                                  fontFamily="-apple-system, sans-serif"
                                  fill="currentColor"
                                ></text>
                              </svg>
                              Apple Pay
                            </TabsTrigger>
                          )}

                          {!loading && wallets.includes('google_pay') && (
                            <TabsTrigger value="google_pay">
                              <svg viewBox="0 0 41 17" className="h-4 w-8" aria-label="Google Pay">
                                <text
                                  x="0"
                                  y="13"
                                  fontSize="11"
                                  fontWeight="500"
                                  fontFamily="Arial"
                                  fill="currentColor"
                                >
                                  G Pay
                                </text>
                              </svg>
                              Google Pay
                            </TabsTrigger>
                          )}
                        </TabsList>
                      </Tabs>
                    </div>

                    {paymentTab === 'card' && (
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="card-number">Card number</Label>
                          <div className="relative">
                            <Input
                              id="card-number"
                              placeholder="1234 1234 1234 1234"
                              value={form.number}
                              onChange={(e) =>
                                setForm((p) => ({ ...p, number: maskNumber(e.target.value) }))
                              }
                              maxLength={19}
                              className="pr-28"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              {liveBrand !== 'unknown' ? (
                                <CardBrandIcon brand={liveBrand} className="h-5 w-8" />
                              ) : (
                                <>
                                  <CardBrandIcon brand="visa" className="h-4 w-7 opacity-30" />
                                  <CardBrandIcon
                                    brand="mastercard"
                                    className="h-4 w-6 opacity-30"
                                  />
                                  <CardBrandIcon brand="amex" className="h-4 w-6 opacity-30" />
                                  <CardBrandIcon brand="discover" className="h-4 w-6 opacity-30" />
                                </>
                              )}
                            </div>
                          </div>
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
                                setForm((p) => ({ ...p, cvc: e.target.value.replace(/\D/g, '') }))
                              }
                            />
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          By providing your card information, you allow us to charge your card for
                          future payments in accordance with our terms.
                        </p>
                      </div>
                    )}

                    {paymentTab === 'apple_pay' && (
                      <div className="flex flex-col items-center gap-4 py-6">
                        <p className="text-sm text-muted-foreground text-center">
                          You'll be prompted to confirm payment with Face ID or Touch ID.
                        </p>
                        <button
                          type="button"
                          className="w-full rounded-xl bg-black text-white py-3 px-6 text-sm font-medium flex items-center justify-center gap-2 hover:bg-black/90 transition-colors"
                          onClick={() => toast.info('Apple Pay flow would trigger here.')}
                        >
                          <svg
                            viewBox="0 0 50 20"
                            className="h-5 w-10 fill-white"
                            aria-label="Apple Pay"
                          >
                            <text
                              x="0"
                              y="15"
                              fontSize="14"
                              fontWeight="600"
                              fontFamily="-apple-system, sans-serif"
                            >
                              Pay
                            </text>
                          </svg>
                        </button>
                        <p className="text-xs text-muted-foreground">
                          Apple Pay is available on this device via Safari.
                        </p>
                      </div>
                    )}

                    {paymentTab === 'google_pay' && (
                      <div className="flex flex-col items-center gap-4 py-6">
                        <p className="text-sm text-muted-foreground text-center">
                          You'll be prompted to confirm payment with your Google account.
                        </p>
                        <button
                          type="button"
                          className="w-full rounded-xl border border-border bg-white dark:bg-zinc-900 py-3 px-6 text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                          onClick={() => toast.info('Google Pay flow would trigger here.')}
                        >
                          <svg viewBox="0 0 41 17" className="h-5 w-10" aria-label="Google Pay">
                            <text
                              x="0"
                              y="13"
                              fontSize="12"
                              fontWeight="500"
                              fontFamily="Arial"
                              fill="currentColor"
                            >
                              G Pay
                            </text>
                          </svg>
                        </button>
                        <p className="text-xs text-muted-foreground">
                          Google Pay is available on this device.
                        </p>
                      </div>
                    )}
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
                        onValueChange={(v) => setForm((p) => ({ ...p, country: v }))}
                      >
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((item) => (
                            <SelectItem value={item.countryCode} key={item.countryCode}>
                              <Flag className="h-4 w-4 inline mr-2" code={item.countryCode} />{' '}
                              {item.name}
                            </SelectItem>
                          ))}
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
                        onCheckedChange={(v) =>
                          setForm((p) => ({ ...p, useBillingAsTeamPrimary: v === true }))
                        }
                        id="use-billing"
                      />
                      <div>
                        <Label htmlFor="use-billing" className="leading-none">
                          Use the billing address as my team's primary address
                        </Label>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Applies this address to your organization's profile.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Tax ID (optional)</Label>
                      <div className="grid grid-cols-[180px_1fr] gap-3">
                        <Select
                          value={form.taxType}
                          onValueChange={(v) => setForm((p) => ({ ...p, taxType: v }))}
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
                  {(form.number || paymentTab !== 'card') && (
                    <PaymentCardVisual
                      card={{
                        id: 'preview',
                        last4:
                          form.number.replace(/\D/g, '').slice(-4) || paymentTab === 'card'
                            ? '····'
                            : '0000',
                        brand: form.number
                          ? liveBrand
                          : paymentTab === 'card'
                            ? 'unknown'
                            : paymentTab,
                        name: form.name || '---',
                        expiry: form.expiry || 'MM/YY',
                        isDefault: false,
                      }}
                      showActions={false}
                    />
                  )}

                  <div className="rounded-2xl border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Included credit</p>
                      <p className="text-sm text-muted-foreground">$20</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Free domain with Pro</p>
                      <p className="text-sm text-muted-foreground">$0</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border p-4 text-sm text-muted-foreground space-y-3">
                    <p>
                      Upon clicking <span className="font-medium text-foreground">Upgrade</span>,
                      you'll be charged immediately and then every month, until you cancel.
                    </p>
                    <p>
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
            </ScrollArea>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAddOpen(false);
                  setForm(EMPTY_FORM);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="min-w-32">
                Upgrade
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(v) => {
          if (!v) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove card?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingCard?.isDefault && cards.length > 1
                ? 'This is your default card. The next card on file will become the default.'
                : `This will permanently remove ${getBrandLabel(deletingCard?.brand ?? 'unknown')} ending in ${deletingCard?.last4}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmRemove}
            >
              Remove card
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { CreditCard, Wallet as WalletIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import Flag from 'react-world-flags';
import { CardBrand, detectBrand, getBrandLabel } from '@/components/card-brand';
import { useAvailableWallets } from '@/hooks/payment-method';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type PaymentCard = {
  id: string;
  last4: string;
  brand: CardBrand;
  expiry: string;
  isDefault: boolean;
  name: string;
};

const EMPTY_FORM = {
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

export default function AddPaymentDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (card: PaymentCard) => void;
}) {
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const { wallets, loading } = useAvailableWallets();
  const [paymentTab, setPaymentTab] = useState<'card' | 'apple_pay' | 'google_pay'>('card');

  useEffect(() => {
    if (paymentTab !== 'card' && !wallets.includes(paymentTab)) {
      setPaymentTab('card');
    }
  }, [wallets, paymentTab]);

  const liveBrand = detectBrand(form.number || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentTab === 'apple_pay' || paymentTab === 'google_pay') {
      const newCard: PaymentCard = {
        id: `card-${Date.now()}`,
        last4: '0000',
        brand: paymentTab,
        expiry: '——',
        isDefault: false,
        name: form.name,
      };
      onAdd(newCard);
      onOpenChange(false);
      toast.success(`${getBrandLabel(paymentTab)} added.`);
      setForm(EMPTY_FORM);
      return;
    }

    const digits = (form.number || '').replace(/\D/g, '');
    if (digits.length < 13) {
      toast.error('Enter a valid card number.');
      return;
    }

    const name = (form.name || '').trim();
    if (name.length < 2) {
      toast.error('Enter a valid name.');
      return;
    }

    const newCard: PaymentCard = {
      id: `card-${Date.now()}`,
      last4: digits.slice(-4),
      brand: liveBrand === 'unknown' ? 'visa' : liveBrand,
      expiry: form.expiry || 'MM/YY',
      isDefault: false,
      name: name,
    };

    onAdd(newCard);
    onOpenChange(false);
    setForm(EMPTY_FORM);
    toast.success(`${getBrandLabel(newCard.brand)} added.`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add payment method</DialogTitle>
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
                        setPaymentTab(v as any);
                      }}
                    >
                      <TabsList>
                        <TabsTrigger value="card">
                          <CreditCard className="h-4 w-4 mr-1.5" /> Card
                        </TabsTrigger>

                        {!loading && wallets.includes('apple_pay') && (
                          <TabsTrigger value="apple_pay">Apple Pay</TabsTrigger>
                        )}

                        {!loading && wallets.includes('google_pay') && (
                          <TabsTrigger value="google_pay">Google Pay</TabsTrigger>
                        )}
                      </TabsList>
                    </Tabs>
                  </div>

                  {paymentTab === 'card' && (
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="card-number">Card number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 1234 1234 1234"
                          value={form.number}
                          onChange={(e) => setForm((p: any) => ({ ...p, number: e.target.value }))}
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
                            onChange={(e) =>
                              setForm((p: any) => ({ ...p, expiry: e.target.value }))
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="card-cvc">Security code</Label>
                          <Input
                            id="card-cvc"
                            placeholder="CVC"
                            value={form.cvc}
                            maxLength={4}
                            onChange={(e) => setForm((p: any) => ({ ...p, cvc: e.target.value }))}
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
                        Confirm
                      </button>
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
                        Confirm
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="full-name">Full name</Label>
                    <Input
                      id="full-name"
                      placeholder="Name on card"
                      value={form.name}
                      onChange={(e) => setForm((p: any) => ({ ...p, name: e.target.value }))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="country">Country or region</Label>
                    <Select
                      value={form.country}
                      onValueChange={(v) => setForm((p: any) => ({ ...p, country: v }))}
                    >
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="address1">Address line 1</Label>
                    <Input
                      id="address1"
                      placeholder="123 Main St"
                      value={form.address1}
                      onChange={(e) => setForm((p: any) => ({ ...p, address1: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border p-3">
                    <div>
                      <Label htmlFor="use-billing" className="leading-none">
                        Use the billing address as my team's primary address
                      </Label>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Tax ID (optional)</Label>
                    <div className="grid grid-cols-[180px_1fr] gap-3">
                      <Select
                        value={form.taxType}
                        onValueChange={(v) => setForm((p: any) => ({ ...p, taxType: v }))}
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
                        onChange={(e) => setForm((p: any) => ({ ...p, taxId: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {form.number && (
                  <div className="rounded-2xl border p-4">
                    <div className="mb-2 text-sm text-muted-foreground">Card preview</div>
                    <div className="text-lg font-medium">{form.name || '---'}</div>
                    <div className="text-sm text-muted-foreground">
                      •••• {form.number.replace(/\D/g, '').slice(-4)}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border p-4 text-sm text-muted-foreground space-y-3">
                  <p>
                    Upon clicking <span className="font-medium text-foreground">Upgrade</span>,
                    you'll be charged immediately and then every month, until you cancel.
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="min-w-32">
              Upgrade
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

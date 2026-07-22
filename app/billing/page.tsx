'use client';

import { useMemo } from 'react';
import { ArrowRight, CreditCard, Download, Wallet, AlertTriangle, ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { getInvoices, getPlanUsage } from '@/lib/mockApi';

const invoices = getInvoices();
const usage = getPlanUsage();

export default function Billing() {
  const totalUsage = useMemo(
    () =>
      Math.round(
        (usage.reduce((sum, item) => sum + item.value / item.limit, 0) / usage.length) * 100
      ),
    []
  );

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
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border p-4">
                <p className="text-sm text-muted-foreground">Monthly price</p>
                <p className="mt-2 text-2xl font-semibold">$59</p>
              </div>

              <div className="rounded-2xl border p-4">
                <p className="text-sm text-muted-foreground">Seats</p>
                <p className="mt-2 text-2xl font-semibold">6 / 8</p>
              </div>

              <div className="rounded-2xl border p-4">
                <p className="text-sm text-muted-foreground">Billing status</p>
                <p className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  Active
                </p>
              </div>
            </div>

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
                  <div key={item.label} className="rounded-2xl border p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <span className={cn('h-2.5 w-2.5 rounded-full', item.tone)} />
                    </div>
                    <p className="mt-2 text-lg font-semibold">
                      {item.value} / {item.limit}
                    </p>
                    <Progress value={percent} className="mt-3 h-2" />
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="gap-2">
                Upgrade plan
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline">Manage seats</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice history</CardTitle>
            <CardDescription>
              Download past billing receipts and view payment records.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{invoice.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment method</CardTitle>
            <CardDescription>Update the card used for subscription billing.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border p-2">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 09/28</p>
                  </div>
                </div>
                <Badge variant="outline">Default</Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full gap-2">
              <Wallet className="h-4 w-4" />
              Update payment method
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
              <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />
              Overage charges should be shown clearly before checkout or renewal.
            </p>
            <p>Show upcoming renewal date and metered usage if your plan supports it.</p>
            <p>That helps users understand charges without leaving the billing page.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

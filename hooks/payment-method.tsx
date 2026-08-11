'use client';

import { useEffect, useState } from 'react';

export type WalletType = 'apple_pay' | 'google_pay' | null;

export function useAvailableWallets() {
  const [wallets, setWallets] = useState<WalletType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function detect() {
      const detected: WalletType[] = [];

      if (
        typeof window !== 'undefined' &&
        'ApplePaySession' in window &&
        (window as any).ApplePaySession?.canMakePayments()
      ) {
        detected.push('apple_pay');
      }

      if (typeof window !== 'undefined' && 'PaymentRequest' in window) {
        try {
          const request = new PaymentRequest([{ supportedMethods: 'https://google.com/pay' }], {
            total: { label: 'Test', amount: { currency: 'USD', value: '0' } },
          });
          const canPay = await request.canMakePayment();
          if (canPay) detected.push('google_pay');
        } catch {}
      }

      setWallets(detected);
      setLoading(false);
    }

    detect();
  }, []);

  return { wallets, loading };
}

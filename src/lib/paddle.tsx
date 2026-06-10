"use client";

import { useEffect, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";

let paddleInstance: Paddle | null = null;

export function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle | null>(paddleInstance);

  useEffect(() => {
    if (paddleInstance) {
      queueMicrotask(() => {
        setPaddle(paddleInstance);
      });
      return;
    }

    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) return;

    const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "production"
      ? "production"
      : "sandbox";

    initializePaddle({
      token,
      environment,
    }).then((instance) => {
      if (instance) {
        paddleInstance = instance;
        setPaddle(instance);
      }
    });
  }, []);

  return paddle;
}

export type PaddleCheckoutOptions = {
  priceId: string;
  quantity?: number;
  customerEmail?: string;
  customData?: Record<string, string>;
};

export function openCheckout(paddle: Paddle | null, options: PaddleCheckoutOptions | string) {
  const opts: PaddleCheckoutOptions =
    typeof options === "string" ? { priceId: options } : options;
  if (!paddle || !opts.priceId) return;

  paddle.Checkout.open({
    items: [{ priceId: opts.priceId, quantity: opts.quantity ?? 1 }],
    ...(opts.customerEmail ? { customer: { email: opts.customerEmail } } : {}),
    ...(opts.customData ? { customData: opts.customData } : {}),
  });
}

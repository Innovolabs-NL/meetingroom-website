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

export function openCheckout(paddle: Paddle | null, priceId: string) {
  if (!paddle || !priceId) return;
  paddle.Checkout.open({ items: [{ priceId, quantity: 1 }] });
}

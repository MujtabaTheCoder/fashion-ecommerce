import React, { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { OrderSuccessView } from "@/components/checkout/OrderSuccessView";

export const metadata = {
  title: "Order Confirmation · ATELIER",
  description: "Thank you for your acquisition.",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-background py-12 md:py-20">
      <Container as="section">
        <Suspense
          fallback={
            <div className="py-20 text-center text-sm text-muted">
              Loading order confirmation...
            </div>
          }
        >
          <OrderSuccessView />
        </Suspense>
      </Container>
    </div>
  );
}

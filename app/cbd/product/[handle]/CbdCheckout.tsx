"use client";

import { Button } from "../../../../components/Button";
import { usePlausible } from "next-plausible";

export const CbdCheckout = ({
  checkoutUrl,
  handle,
  children,
}: {
  checkoutUrl: string;
  handle: string;
  children?: React.ReactNode;
}) => {
  const plausible = usePlausible();

  const handleBuyNow = async () => {
    plausible("CBDCheckoutTest", { props: { handle } });

    window.location.href = checkoutUrl;
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:static md:z-0 flex justify-center">
      <Button className="w-full py-3 px-5 text-2xl" onClick={handleBuyNow}>
        {children}
      </Button>
    </div>
  );
};

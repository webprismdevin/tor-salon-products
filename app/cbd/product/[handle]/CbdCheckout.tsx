"use client";

import { Button } from "../../../../components/Button";
import { usePlausible } from "next-plausible";

export const CbdCheckout = ({
  checkoutUrl,
  handle,
  children,
  className,
}: {
  checkoutUrl: string;
  handle: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  const plausible = usePlausible();

  const handleBuyNow = async () => {
    plausible("CBDCheckoutTest", { props: { handle } });

    window.location.href = checkoutUrl;
  };

  return (
    <div className={`${className} flex justify-center items-center`}>
      <Button className="w-full py-2 px-3 text-2xl font-heading" onClick={handleBuyNow}>
        {children}
      </Button>
    </div>
  );
};

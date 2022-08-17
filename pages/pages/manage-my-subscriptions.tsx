import { Box } from "@chakra-ui/react";
import Script from "next/script";

export default function ManageSubscription() {
  return (
    <Box>
      <Script
        src="https://cdn-widgetsrepository.yotpo.com/v1/loader/bz5Tc1enx8u57VXYMgErAGV7J82jXdFXoIImJx6l"
        type="text/javascript"
      />
      {/* @ts-ignore */}
      <div className="yotpo-widget-instance" data-yotpo-instance-id="216917" widget-type="SubscriptionsCustomerPortal" storefront-theme="dawn" injection="auto"></div>
    </Box>
  );
}

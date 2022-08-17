import { Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

export default function SubscriptionPlan({ sellingPlan, setSubscriptionPlan, subscriptionPlan }: any) {

  return (
    <RadioGroup onChange={setSubscriptionPlan} value={subscriptionPlan} p={4}>
      <Stack>
        <Text>Subscribe &amp; save! Get 5% off every order!</Text>
        <Radio value={"none"}>No subscription</Radio>
        {sellingPlan.edges.map((plan:any) => <Radio key={plan.node.id} value={plan.node.id}>{plan.node.name}</Radio>)}
      </Stack>
    </RadioGroup>
  );
}

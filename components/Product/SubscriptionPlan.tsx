import {
  Box,
  Stack,
  useRadio,
  HStack,
  useRadioGroup,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

declare interface SellingPlan {
  node: {
    name: string;
    id: string;
    options: any;
  };
}

export default function SubscriptionPlan({
  sellingPlan,
  setSubscriptionPlan,
  subscriptionPlan,
}: any) {
  // const options = sellingPlan.edges.map((plan:SellingPlan) => plan.node.id);
  const options = ["Subscribe & Save", "One Time"];
  const [subscribe, setSubscribe] = useState(options[0]);

  useEffect(() => {
    if (subscribe === options[1]) {
      setSubscriptionPlan("");
    }
    if (subscribe === options[0]) {
      setSubscriptionPlan(sellingPlan.edges[0].node.id);
    }
  }, [subscribe]);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "subscriptionOption",
    defaultValue: options[0],
    onChange: (value) => setSubscribe(value),
  });

  const group = getRootProps();

  return (
    <Stack>
      <HStack {...group}>
        {options.map((value: any) => {
          const radio = getRadioProps({ value });
          return (
            <RadioCard key={value} {...radio}>
              {value}
            </RadioCard>
          );
        })}
      </HStack>
      {subscribe === options[0] && (
        <SubscriptionOptions
          subscriptionOptions={sellingPlan.edges}
          setSubscriptionPlan={setSubscriptionPlan}
        />
      )}
    </Stack>
  );
}

function SubscriptionOptions({
  subscriptionOptions,
  setSubscriptionPlan,
}: any) {
  return (
    <select
      className="py-3 px-3 border-2 border-black"
      onChange={(e) => setSubscriptionPlan(e.target.value)}
    >
      {subscriptionOptions.map((option: SellingPlan) => (
        <option key={option.node.id} value={option.node.id}>
          {option.node.name}
        </option>
      ))}
    </select>
  );
}

function RadioCard(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <label className="flex-1">
      <input {...input} />
      <Box
        textAlign="center"
        {...checkbox}
        w="full"
        cursor="pointer"
        borderWidth="1px"
        boxShadow="md"
        _checked={{
          bg: "gray.600",
          color: "white",
          borderColor: "gray.600",
        }}
        // _focus={{
        //   boxShadow: "outline",
        // }}
        px={5}
        py={2}
      >
        {props.children}
      </Box>
    </label>
  );
}

import {
  Box,
  Radio,
  RadioGroup,
  Stack,
  Text,
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
  const options = ["Subscribe & Save!", "One-time Purchase"];
  const [subscribe, setSubscribe] = useState(options[0]);

  useEffect(() => {
    if(subscribe === options[1]){
      setSubscriptionPlan("")
    }
    if(subscribe === options[0]){
      setSubscriptionPlan(sellingPlan.edges[0].node.id)
    }
  }, [subscribe])

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
        <SubscriptionOptions subscriptionOptions={sellingPlan.edges} setSubscriptionPlan={setSubscriptionPlan} />
      )}
    </Stack>
  );
}

function SubscriptionOptions({subscriptionOptions, setSubscriptionPlan}:any) {

    const options = subscriptionOptions.map((plan:SellingPlan) => plan.node.id);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "subscriptionOption",
    defaultValue: options[0],
    onChange: (value) => setSubscriptionPlan(value),
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      {options.map((value: any) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio}>
            {subscriptionOptions.filter((option:SellingPlan) => value === option.node.id)[0].node.name}
          </RadioCard>
        );
      })}
    </HStack>
  );
}

function RadioCard(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "black",
          color: "white",
          borderColor: "black",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={2}
      >
        {props.children}
      </Box>
    </Box>
  );
}

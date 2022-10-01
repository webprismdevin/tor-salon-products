import { Box, HStack, useRadio, useRadioGroup } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { VariantContext } from "../../lib/pages/variant-context";

export function Swatches({ variants }: any) {
  const { variant, updateVariant } = useContext(VariantContext);

  useEffect(() => {
    if (variant === "") {
      updateVariant(variants[0].node.id);
    }
  }, []);

  return <VariantSwatches variants={variants} />;
}

function VariantSwatches({ variants }: { variants: [any] }) {
  const { updateVariant } = useContext(VariantContext);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "variant",
    defaultValue: variants[0].node.id,
    onChange: (value) => updateVariant(value),
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      {variants.map((variant: { node: { id: string; title: string } }) => {
        const radio = getRadioProps({ value: variant.node.id });
        return (
          <Swatch key={variant.node.id} {...radio}>
            {variant.node.title}
          </Swatch>
        );
      })}
    </HStack>
  );
}

function Swatch(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  const swatchBackgrounds = {
    curly: "#E4D5D4",
    fineThin: "#E4E2DB",
    mediumThick: "#D7E1DC",
  };

  function swatchColor() {
    switch (true) {
      case props.children.includes("Medium"):
        return { bg: swatchBackgrounds.mediumThick, text: "#000000" };
      case props.children.includes("Fine"):
        return { bg: swatchBackgrounds.fineThin, text: "#000000" };
      case props.children.includes("Curly"):
        return { bg: swatchBackgrounds.curly, text: "#000000" };
      default:
        return { bg: "#000000", text: "#ffffff" };
    }
  }

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
          bg: swatchColor().bg,
          color: swatchColor().text,
          borderColor: swatchColor().bg,
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}

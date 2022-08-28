import {
  AspectRatio,
  Box,
  Button,
  Heading,
  HStack,
  Select,
  Stack,
  useRadio,
  useRadioGroup,
  Text,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import addToCart from "../../lib/Cart/addToCart";
import CartContext from "../../lib/CartContext";
import { imageBuilder } from "../../lib/sanity";
import { ImageContext, VariantContext } from "../../pages/pages/[slug]";
import { SanityColorTheme, SanityImageReference } from "../../types/sanity";
import PortableText from "../PortableText/PortableText";

export function HeroWithProduct({ hero, productImages, body }: any) {
  const product = hero.content[0].product.store;
  const { variant } = useContext(VariantContext);
  const { setImage } = useContext(ImageContext);

  useEffect(() => {
    const selectedVariant = product.variants.filter(
      (v: any) => v.store.gid === variant
    )[0]?.store;

    setImage({ url: selectedVariant?.previewImageUrl });
  }, [variant]);

  return (
    <div>
      <Box p={20}>
        <Stack direction={["column", "row"]} spacing={16} align="flex-start">
          <Box w="full">
            <MainImage />
            <ImageList images={productImages.product.images.edges} />
          </Box>
          <Stack spacing={4} w="full">
            {hero.topHeroReview && <HeroReview review={hero.topHeroReview} />}
            <Heading size="xl">{hero.title}</Heading>
            <Pricebox variants={product.variants} />
            <Box
              dangerouslySetInnerHTML={{
                __html: product.descriptionHtml,
              }}
            />
            {product.variants.length > 1 && (
              <VariantSelect variants={product.variants} />
            )}
            <AddToCart />
            <Modules modules={hero.modules} />
            <PortableText blocks={body} />
          </Stack>
        </Stack>
      </Box>
    </div>
  );
}

function Pricebox({ variants }: any) {
  const { variant } = useContext(VariantContext);

  const selectedVariant = variants.filter(
    (v: any) => v.store.gid === variant
  )[0]?.store;

  const savings = Math.ceil(
    (1 - selectedVariant?.price / selectedVariant?.compareAtPrice) * 100
  );

  return (
    <HStack spacing={2}>
      <Text fontSize="3xl" fontWeight={400}>
        ${selectedVariant?.price}
      </Text>
      <Text fontSize="3xl" fontWeight={400} textDecor={"line-through"}>
        ${selectedVariant?.compareAtPrice}
      </Text>
      <Text textTransform={"uppercase"}>A {savings}% savings!</Text>
    </HStack>
  );
}

function MainImage() {
  const { image } = useContext(ImageContext);

  return (
    <AspectRatio
      flexShrink={0}
      ratio={1 / 1}
      borderRadius={10}
      overflow={"hidden"}
    >
      <Image
        src={image.url}
        alt={image.altText}
        objectFit="cover"
        layout="fill"
      />
    </AspectRatio>
  );
}

export interface ImageProps {
  node: {
    url: string;
    height: number;
    width: number;
    altText: string;
  };
}

function ImageList({ images }: any) {
  const { setImage } = useContext(ImageContext);

  return (
    <SimpleGrid templateColumns={"repeat(4, 1fr)"} gap={6} mt={8}>
      {images.map((image: ImageProps) => (
        <GridItem
          key={image.node.url}
          colSpan={1}
          overflow={"hidden"}
          borderRadius={10}
          onClick={() => setImage(image.node)}
          cursor={"pointer"}
        >
          <AspectRatio ratio={1 / 1} width="100%" maxWidth={"100%"}>
            <Image
              src={image.node.url}
              alt=""
              objectFit="cover"
              layout="fill"
            />
          </AspectRatio>
        </GridItem>
      ))}
    </SimpleGrid>
  );
}

export function VariantSelect({ variants }: any) {
  const { variant, updateVariant } = useContext(VariantContext);

  useEffect(() => {
    if (variant === "") {
      updateVariant(variants[0].store.gid);
    }
  }, []);

  return <VariantSwatches variants={variants} />;
}

function VariantSwatches({ variants }: { variants: [any] }) {
  const { updateVariant } = useContext(VariantContext);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "variant",
    defaultValue: variants[0].store.gid,
    onChange: (value) => updateVariant(value),
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      {variants.map((variant: { store: { gid: string; title: string } }) => {
        const radio = getRadioProps({ value: variant.store.gid });
        return (
          <Swatch key={variant.store.gid} {...radio}>
            {variant.store.title}
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

const selectQty = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function AddToCart() {
  const { variant } = useContext(VariantContext);
  const { cart, setCart } = useContext(CartContext);
  const [qty, setQty] = useState<any>(1);

  async function handleAddToCart() {
    const response = await addToCart(cart.id, variant, qty, "");

    setCart({
      ...cart,
      status: "dirty",
      lines: response.cartLinesAdd.cart.lines,
    });
  }

  return (
    <HStack spacing={0} w="full">
      <Select
        maxW={20}
        borderTopRightRadius={0}
        borderBottomRightRadius={0}
        onChange={(event) => setQty(parseInt(event.target.value))}
        size="lg"
        textAlign={"center"}
      >
        {selectQty.map((num: number) => (
          <option key={num}>{num}</option>
        ))}
      </Select>
      <Button
        borderBottomLeftRadius={0}
        borderTopLeftRadius={0}
        size="lg"
        onClick={handleAddToCart}
        flexGrow={1}
      >
        Add To Cart
      </Button>
    </HStack>
  );
}

declare interface ModuleProps {
  _type: string;
  _key: string;
  text: string;
  iconGroups?: [any];
}

function Modules({ modules }: { modules: [ModuleProps] }) {
  return (
    <React.Fragment>
      {modules.map((module: ModuleProps) => {
        switch (module._type) {
          case "trustIcons":
            return <TrustIcons key={module._key} groups={module.iconGroups} />;
          case "guaranteeText":
            return (
              <Text
                textTransform="uppercase"
                fontWeight={500}
                key={module._key}
                width="full"
              >
                {module.text}
              </Text>
            );
          default:
            return;
        }
      })}
    </React.Fragment>
  );
}

export interface TrustIconGroup {
  _key: string;
  icon: SanityImageReference;
  text: string;
}

function TrustIcons({ groups }: any) {
  return (
    <Stack spacing={3}>
      {groups.map((group: TrustIconGroup) => (
        <HStack key={group._key}>
          <AspectRatio ratio={1 / 1} height={"24px"} width={"24px"}>
            <Image
              src={imageBuilder(group.icon).url()}
              alt={group.text}
              layout="fill"
              objectFit="contain"
            />
          </AspectRatio>
          <Text>{group.text}</Text>
        </HStack>
      ))}
    </Stack>
  );
}

export interface SanityReview {
  format: string;
  review: {
    rating: number;
    content: string;
    name: string;
  };
  colorTheme: SanityColorTheme;
}

function HeroReview({ review }: { review: SanityReview }) {
  switch (review.format) {
    case "callout":
      return (
        <CalloutReview review={review.review} colorTheme={review.colorTheme} />
      );
    default:
      return <div></div>;
  }
}

function CalloutReview({ review, colorTheme }: any) {
  return (
    <Box
      w="full"
      textAlign={"center"}
      p={8}
      bg={colorTheme.background.hex}
      color={colorTheme.text.hex}
    >
      <Text fontSize="2xl">{review.content}</Text>
      <Text fontSize="md">{review.name}</Text>
    </Box>
  );
}

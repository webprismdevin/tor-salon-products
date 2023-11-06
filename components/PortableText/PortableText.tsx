"use client";
import BlockContent from "@sanity/block-content-to-react";
// import type { Block as SanityBlock } from "@sanity/types";
import AccordionBlock from "./Blocks/Accordion";
// import LinkEmailAnnotation from './annotations/LinkEmail';
// import LinkExternalAnnotation from './annotations/LinkExternal';
// import LinkInternalAnnotation from './annotations/LinkInternal';
import Block from "./Blocks/Block";
// import ListBlock from './blocks/List';
import ImagesBlock from "./Blocks/ImagesBlock";
import { SanityColorTheme, SanityProductWithVariant } from "../../types/sanity";
import type {
  PortableTextBlock,
  PortableTextMarkDefinition,
} from "@portabletext/types";
import {
  Box,
  Text,
  chakra,
  AspectRatio,
  Stack,
  Button,
  Link,
} from "@chakra-ui/react";
import { AnimatePresence, motion, useCycle } from "framer-motion";
import NextImage from "next/legacy/image";
import NextLink from "next/link";
import useAddToCart from "../../lib/useAddToCart";
import { useState } from "react";
import { stat } from "fs";

type Props = {
  blocks: any[];
  className?: string;
  centered?: boolean;
  colorTheme?: SanityColorTheme;
};

export default function PortableText({
  blocks,
  className,
  centered,
  colorTheme,
}: Props) {
  return (
    <BlockContent
      blocks={blocks}
      renderContainerOnSingleChild
      projectId="c53k64ci"
      dataset="production"
      serializers={{
        // Lists
        // list: ListBlock,
        // Marks
        marks: {
          // annotationLinkEmail: LinkEmailAnnotation,
          // annotationLinkExternal: LinkExternalAnnotation,
          // annotationLinkInternal: LinkInternalAnnotation,
          annotationProduct: (props: any) => (
            <ProductAnnotation colorTheme={colorTheme} {...props} />
          ),
        },
        // Block types
        types: {
          block: Block,
          blockAccordion: AccordionBlock,
          blockImages: (props: any) => (
            <ImagesBlock centered={true} {...props} />
          ),
          signupForm: (props: any) => <EmailSignupFrom {...props.node} />,
          customHtml: (props: any) => (
            <Box
              w="full"
              className="customHtml"
              dangerouslySetInnerHTML={{ __html: props.node.html }}
            />
          ),
        },
      }}
    />
  );
}

const EmailSignupFrom = (props: any) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("clean"); // clean | loading | success | error

  const submitForm = async () => {
    setStatus("loading");

    const response = await fetch("/api/new-subscriber", {
      method: "POST",
      body: JSON.stringify({
        email,
        tags: props.tags.length > 0 ? [...props.tags] : [],
      }),
    });

    if (response.ok) {
      setStatus("success");
      resetForm();
    } else {
      setStatus("error");
    }
  };

  const resetForm = () => {
    setTimeout(() => {
      setEmail("");
      setStatus("clean");
    }, 2000);
  };

  return (
    <div
      className={`flex flex-col lg:flex-row gap-2 place-items-start ${
        status === "loading" ? "animate-pulse" : ""
      } ${status === "success" ? "text-green-500" : ""} ${
        status === "error" ? "text-red-500" : ""
      }`}
    >
      <input
        type="email"
        placeholder={props.placeholder ?? "Enter your email address"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 py-2 px-4 border-b-2 border-black"
      />
      <button
        className="flex-0 py-2 px-4 bg-black text-white hover:bg-transparent hover:text-black border-b-2 border-black"
        onClick={submitForm}
      >
        {props.buttonText ?? "Subscribe"}
      </button>
    </div>
  );
};

type ProductAnnotationProps = PortableTextBlock & {
  colorTheme?: SanityColorTheme;
  mark: PortableTextMarkDefinition & {
    linkAction: "addToCart" | "buyNow" | "link";
    productWithVariant: SanityProductWithVariant;
    quantity?: number;
  };
  children: any;
};

const MotionBox = motion(Box);

export const ProductAnnotation = ({
  children,
  colorTheme,
  mark,
}: ProductAnnotationProps) => {
  const { productWithVariant } = mark;
  const [open, cycleOpen] = useCycle(false, true);
  const { singleAddToCart, instantCheckout } = useAddToCart();

  const product = productWithVariant.product.store;
  const hasVariant = productWithVariant.variant;

  const variant = hasVariant
    ? productWithVariant.variant.store
    : productWithVariant.product.store;

  const variantId = hasVariant
    ? productWithVariant.variant?.store?.gid
    : productWithVariant.product.store.variants[0].store.gid;

  return (
    <Box
      display={"inline"}
      overflow={"auto"}
      pos="relative"
      onMouseEnter={() => cycleOpen()}
      onMouseLeave={() => cycleOpen()}
    >
      <chakra.span
        bg={colorTheme?.background.hex}
        px={colorTheme ? 1 : 0}
        textDecor={colorTheme ? "none" : "underline"}
        textDecorationStyle={"dashed"}
      >
        {children[0]}
      </chakra.span>
      <AnimatePresence>
        {open && (
          <MotionBox
            pos="absolute"
            bg="white"
            shadow="md"
            borderRadius={10}
            bottom={8}
            p={4}
            left={0}
            zIndex={2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <Stack spacing={6}>
              <AspectRatio ratio={1 / 1} w={198}>
                <NextImage
                  src={
                    variant.previewImageUrl
                      ? variant.previewImageUrl
                      : product.previewImageUrl
                  }
                  layout="fill"
                  loading="eager"
                />
              </AspectRatio>
              <Box>
                <NextLink href={`/product/${product.slug.current}`}>
                  <Link fontWeight={500}>{product.title}</Link>
                </NextLink>
                {productWithVariant.variant && (
                  <Text color={"blackAlpha.600"}>{variant.title}</Text>
                )}
                <Text>
                  {productWithVariant.variant ? (
                    <span>${variant.price}</span>
                  ) : (
                    <span>
                      ${product.priceRange.minVariantPrice}
                      {product.priceRange.minVariantPrice !==
                        product.priceRange.maxVariantPrice &&
                        "- $" + product.priceRange.maxVariantPrice}
                    </span>
                  )}
                </Text>
              </Box>
              <Stack direction="row">
                <Button onClick={() => singleAddToCart(variantId)}>
                  Add To Cart
                </Button>
                <Button onClick={() => instantCheckout(variantId)}>
                  Buy Now
                </Button>
              </Stack>
            </Stack>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};

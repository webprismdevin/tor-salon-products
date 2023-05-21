import BlockContent from "@sanity/block-content-to-react";
import type { Block as SanityBlock } from "@sanity/types";
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
import { usePlausible } from "next-plausible";
import { useState } from "react";

type Props = {
  blocks: SanityBlock[];
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
      // className={clsx('portableText', className)}
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
          customHtml: (props: any) => (
            <Box
              w="full"
              className="customHtml"
              dangerouslySetInnerHTML={{ __html: props.node.html }}
            />
          ),
          signupForm: (props: any) => <SignupForm {...props} />,
        },
      }}
    />
  );
}

const SignupForm = (data: any) => {
  const { tags } = data.node;

  const plausible = usePlausible();
  console.log(tags);

  const handleSubmit = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    const data = {
      name: {
        firstname: event.target.first.value,
        lastname: event.target.last.value,
      },
      email: event.target.email.value,
      tags: event.target.tags.value,
    };

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data);

    // API endpoint where we send form data.
    const endpoint = "/api/new-subscriber";

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();
    alert(`Is this your full name: ${result.data}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="First Name" name="first" />
      <input type="text" placeholder="Last Name" name="last" />
      <input
        type="email"
        placeholder="Email"
        name="email"
        pattern="^\S+@\S+$"
      />
      {tags &&
        tags.map((tag: string) => (
          <input key={tag} type="hidden" name="tags" value={tag} />
        ))}
      <input type="submit" value="Submit" />
    </form>
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

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
  Container,
  IconButton,
} from "@chakra-ui/react";
import { wrap } from "@popmotion/popcorn";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { RatingStar } from "rating-star";
import React, { useContext, useEffect, useState } from "react";
import {
  AiOutlineDoubleLeft,
  AiOutlineDoubleRight,
} from "react-icons/ai";
import addToCart from "../../lib/Cart/addToCart";
import CartContext from "../../lib/CartContext";
import { imageBuilder } from "../../lib/sanity";
import { ImageContext, VariantContext } from "../../pages/pages/[slug]";
import { SanityColorTheme, SanityImageReference } from "../../types/sanity";
import PortableText from "../PortableText/PortableText";

export function HeroWithProduct({ hero, productImages, body, reviews }: any) {
  const product = hero.content[0].product.store;
  const { variant } = useContext(VariantContext);
  const { setImage } = useContext(ImageContext);

  const scoreAverage =
    reviews.reduce((acc: number, obj: any) => acc + obj.score, 0) /
    reviews.length;

  useEffect(() => {
    const selectedVariant = product.variants.filter(
      (v: any) => v.store.gid === variant
    )[0]?.store;

    setImage({ url: selectedVariant?.previewImageUrl });
  }, [variant]);

  function handleReviewScroll() {
    let element = document.getElementById("page_all_reviews");
    let headerOffset = 80;
    let elementPosition = element?.getBoundingClientRect().top;
    let offsetPosition = elementPosition! + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  return (
    <div>
      <Box py={[4, 10]}>
        <Container maxW="container.xl">
          <Stack
            direction={["column", "row"]}
            spacing={[4, 16]}
            align={["center", "flex-start"]}
          >
            <Box display={["initial", null, null, "none"]} w="full">
              {reviews && (
                <Stack
                  onClick={handleReviewScroll}
                  direction="row"
                  align="flex-start"
                  mb={1}
                >
                  <RatingStar
                    id={"hero_rating_star_mobile"}
                    rating={scoreAverage}
                    size={20}
                  />
                  <Text>{reviews.length} Reviews</Text>
                </Stack>
              )}
              <Heading size="xl">{hero.title}</Heading>
            </Box>
            <Box
              w={[320, "full"]}
              pos={["static", null, null, "sticky"]}
              top={24}
            >
              <MainImage images={productImages.product.images.edges} />
              <ImageList images={productImages.product.images.edges} />
            </Box>
            <Stack
              spacing={4}
              display={["initial", null, null, "none"]}
              w="full"
            >
              <Pricebox variants={product.variants} />
              {product.variants.length > 1 && (
                <VariantSwatches variants={product.variants} />
              )}
              <AddToCart />
            </Stack>
            <Stack spacing={4} w="full">
              {hero.topHeroReview && <HeroReview review={hero.topHeroReview} />}
              <Box display={["none", null, null, "initial"]}>
                {reviews && (
                  <Stack
                    onClick={handleReviewScroll}
                    direction="row"
                    align="center"
                    mb={1}
                  >
                    <RatingStar
                      id={"hero_rating_star"}
                      rating={scoreAverage}
                      size={20}
                    />
                    <Text>{reviews.length} Reviews</Text>
                  </Stack>
                )}
                <Heading size="xl">{hero.title}</Heading>
              </Box>
              <Stack spacing={4} display={["none", null, null, "initial"]}>
                <Pricebox variants={product.variants} />
                <Box
                  dangerouslySetInnerHTML={{
                    __html: product.descriptionHtml,
                  }}
                />
                {product.variants.length > 1 && (
                  <VariantSwatches variants={product.variants} />
                )}
                <AddToCart />
              </Stack>
              {hero.modules && <Modules modules={hero.modules} />}
              <PortableText blocks={body} />
            </Stack>
          </Stack>
        </Container>
      </Box>
    </div>
  );
}

export function Pricebox({ variants }: any) {
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
      <Text fontSize="2xl" fontWeight={400} color={"blackAlpha.600"} textDecor={"line-through"}>
        ${selectedVariant?.compareAtPrice}
      </Text>
      <Text color={"red.700"} textTransform={"uppercase"}>A {savings}% savings!</Text>
    </HStack>
  );
}

const MotionAspect = motion(AspectRatio);

function MainImage({ images }: { images: [any] }) {
  const { image, setImage } = useContext(ImageContext);

  const [[page, direction], setPage] = useState([0, 0]);
  const index = wrap(0, images.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    setImage(images[index].node)
  }, [page])

  return (
    <Box pos="relative">
      <IconButton
        aria-label="Previous photo"
        variant={"ghost"}
        onClick={() => paginate(-1)}
        as={AiOutlineDoubleLeft}
        boxSize={8}
        pos="absolute"
        zIndex={2}
        top={[150, 250]}
        left={2}
        opacity={0.6}
      />
      <AnimatePresence initial={true} custom={direction} exitBeforeEnter={true}>
        <MotionAspect
          flexShrink={0}
          ratio={1 / 1}
          borderRadius={10}
          overflow={"hidden"}
          custom={direction}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: { duration: 0.2 },
          }}
          exit={{
            opacity: 0,
          }}
          key={page}
        >
          <Image
            src={image?.url}
            alt={image?.altText}
            objectFit="cover"
            layout="fill"
            priority
          />
        </MotionAspect>
      </AnimatePresence>
      <IconButton
        aria-label="Next photo"
        variant={"ghost"}
        onClick={() => paginate(1)}
        as={AiOutlineDoubleRight}
        boxSize={8}
        pos="absolute"
        zIndex={2}
        top={[150, 250]}
        right={2}
        opacity={0.6}
      />
    </Box>
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
    <SimpleGrid
      templateColumns={"repeat(4, 1fr)"}
      gap={6}
      mt={8}
      display={["none", "grid"]}
    >
      {images.map((image: ImageProps, index: number) => (
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
              priority={index < 4 ? true : false}
            />
          </AspectRatio>
        </GridItem>
      ))}
    </SimpleGrid>
  );
}

export function VariantSwatches({ variants }: { variants: [any] }) {
  const { variant, updateVariant } = useContext(VariantContext);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "variant",
    defaultValue: "",
    value: variant,
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
        px={[3, 5]}
        py={[2, 3]}
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
    <Stack w="full">
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
      <Text textTransform="uppercase" fontWeight={500} width="full" textAlign={"center"}>100% Money-back Guarantee</Text>
    </Stack>
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
      p={8}
      bg={colorTheme.background.hex}
      color={colorTheme.text.hex}
    >
      <Text fontSize={["lg", "xl"]} textAlign={"justify"}>
        &quot;{review.content}&quot;
      </Text>
      <Text
        fontSize="md"
        textAlign={"center"}
        mt={2}
        fontStyle={"italic"}
        color={"blackAlpha.700"}
      >
        {review.name}
      </Text>
    </Box>
  );
}

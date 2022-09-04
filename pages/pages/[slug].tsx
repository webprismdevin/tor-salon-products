import {
  Box,
  Container,
  Heading,
  List,
  ListItem,
  Stack,
  Text,
} from "@chakra-ui/react";
import { GetStaticProps } from "next";
import Head from "next/head";
import React, { createContext, useState } from "react";
import {
  AddToCart,
  HeroWithProduct,
  Pricebox,
  VariantSelect,
} from "../../components/Page/Hero";
import BigTextBlock from "../../components/Page/BigTextBlock";
import FeaturedInformation from "../../components/Page/FeaturedInformation";
import PortableText from "../../components/PortableText/PortableText";
import ReviewSlider from "../../components/ReviewSlider";
import {
  productFragment,
  productImageFragment,
} from "../../lib/fragments/productImageFragment";
import graphClient from "../../lib/graph-client";
import { sanity } from "../../lib/sanity";
import ReviewSection from "../../components/Page/ReviewSection";

export const VariantContext = createContext<any>({
  variant: "",
  updateVariant: () => null,
});

export const ImageContext = createContext<any>({
  image: {},
  setImage: () => null,
});

export default function Page({ page, productImages, reviews }: any) {
  const [variant, updateVariant] = useState<string>(() => {
    if (page?.showHero && page?.hero.content[0].product) {
      return page.hero.content[0].product.store.variants[0].store.gid;
    }
  });

  const [image, setImage] = useState<string>(() => {
    if (page?.showHero && productImages) {
      return productImages.product.featuredImage;
    }
  });

  return (
    <div>
      {/* <Head>
        <title>{page.title}</title>
      </Head> */}
      <VariantContext.Provider value={{ variant, updateVariant }}>
        <ImageContext.Provider value={{ image, setImage }}>
          <Container maxW="container.xl">
            {page?.showHero && (
              <HeroWithProduct
                hero={page.hero}
                productImages={productImages}
                body={page?.body}
                reviews={reviews}
              />
            )}
          </Container>
        </ImageContext.Provider>
        {!page?.showHero && page?.body && (
          <Container maxW="container.lg">
            <PortableText blocks={page?.body} />
          </Container>
        )}
        <PageHairTypes />
        {page?.modules && <Modules modules={page.modules} />}
        {page?.additionalBuyButton && (
          <SecondBuyButton
            product={page?.showHero && page.hero.content[0].product.store}
          />
        )}
        {page?.showAllReviews && <ReviewSection reviews={reviews} />}
      </VariantContext.Provider>
    </div>
  );
}

export function SecondBuyButton({ product }: any) {
  return (
    <Box>
      <Container centerContent py={20}>
        <Stack spacing={3} align="center">
          <Pricebox variants={product.variants} />
          <VariantSelect variants={product.variants} />
          <AddToCart />
          <Text textTransform="uppercase" fontWeight={500} width="full" textAlign={"center"}>100% Money-back Guarantee</Text>
        </Stack>
      </Container>
    </Box>
  );
}

export function Modules({ modules }: any) {
  return (
    <React.Fragment>
      {modules.map((module: any) => {
        switch (module._type) {
          case "featuredInformation":
            return <FeaturedInformation key={module._key} module={module} />;
          case "bigTextBlock":
            return <BigTextBlock key={module._key} module={module} />;
          case "module.reviewSlider":
            return <ReviewSlider reviews={module.reviews} />
          default:
            return null;
        }
      })}
    </React.Fragment>
  );
}

export function PageHairTypes() {
  return (
    <Box px={8}>
      <Heading as="h2" fontFamily={"Futura"} mb={6} textAlign={"center"}>
        Designed By Hair Type. Formulated For Results.
      </Heading>
      <Stack
        spacing={8}
        direction={["column", null, "row"]}
        w="full"
        justify="center"
      >
        <Stack align="center" py={16} flexGrow={1} bg="brand.curly">
          <Text fontSize={24} mb={3}>
            Curly
          </Text>
          <List>
            <ListItem>Balanced curls</ListItem>
            <ListItem>Increased definition</ListItem>
            <ListItem>Add bounce and shine</ListItem>
            <ListItem>Real moisture</ListItem>
            <ListItem>Breakage &amp; frizz protection</ListItem>
          </List>
        </Stack>
        <Stack align="center" py={16} flexGrow={1} bg="brand.fineThin">
          <Text fontSize={24} mb={3}>
            Fine/Thin
          </Text>
          <List>
            <ListItem>Voluptous volume</ListItem>
            <ListItem>Soft touch</ListItem>
            <ListItem>Naturally detangling</ListItem>
            <ListItem>Add shine</ListItem>
            <ListItem>Fuller styling</ListItem>
          </List>
        </Stack>
        <Stack align="center" py={16} flexGrow={1} bg="brand.mediumThick">
          <Text fontSize={24} mb={3}>
            Medium/Thick
          </Text>
          <List>
            <ListItem>Add shine</ListItem>
            <ListItem>Easily managed thick hair</ListItem>
            <ListItem>Real moisture</ListItem>
            <ListItem>No added weight</ListItem>
            <ListItem>Sexier second day hair</ListItem>
          </List>
        </Stack>
      </Stack>
    </Box>
  );
}

export const getStaticPaths = async () => {
  const query = `*[ _type == "page"]`;

  const pages = await sanity.fetch(query);

  return {
    paths: pages.map((page: any) => ({
      params: {
        slug: page.slug.current,
      },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[ _type == "page" && slug.current == "${params?.slug}"][0]
    {
        ...,
        hero {
            ...,
            topHeroReview {
              ...,
              colorTheme ->
            },   
            content[] {
                ...,
                product-> {
                    ...,
                    store {
                        ...,
                        variants[]->
                    }
                }
            }, 
        },
        modules[] {
          ...,
          reviews[]->
        }
    }`;

  const page = await sanity.fetch(query);

  const productImages = await graphClient.request(productImageFragment, {
    id: page.hero?.content[0].product?.store.gid,
  });

  const product = await graphClient.request(productFragment, {
    id: page.hero?.content[0].product?.store.gid,
  });

  const utoken = "kZl7BZ4R7OWf9Rq2hpXpFThQ2OGuS1xzzkjV89vJ";

  const reviewResponse = await fetch(
    `https://api.yotpo.com/v1/apps/${process.env.YOTPO_APP_KEY}/reviews?deleted=false&utoken=${utoken}&count=100`
  ).then((Response) => Response.json());

  return {
    props: {
      page,
      productImages,
      product,
      reviews: reviewResponse.reviews,
    },
    revalidate: 10,
  };
};

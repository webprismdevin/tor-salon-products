import {
  Container,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { GetStaticProps } from "next";
import Head from "next/head";
import React, { createContext, useEffect, useState } from "react";
import {
  HeroWithProduct,
} from "../../components/Page/Hero";
import PortableText from "../../components/PortableText/PortableText";
import {
  productImageFragment,
} from "../../lib/fragments/productImageFragment";
import graphClient from "../../lib/graph-client";
import { imageBuilder, sanity } from "../../lib/sanity";
import { useRouter } from "next/router";
import { Modules } from "../../components/Page/Modules";

import dynamic from "next/dynamic";

const ReviewSection = dynamic(() => import("../../components/Page/ReviewSection"))
const HairTypes = dynamic(() => import("../../components/Page/HairTypes"))
const SecondBuyButton = dynamic(() => import("../../components/Page/SecondBuyButton"))

export const VariantContext = createContext<any>({
  variant: "",
  updateVariant: () => null,
});

export const ImageContext = createContext<any>({
  image: {},
  setImage: () => null,
});

export default function Page({ page, productImages, reviews }: any) {
  const router = useRouter()
  const [variant, updateVariant] = useState<string>(() => {
    if (page?.showHero && page?.hero.content[0].product) {
      return page.hero.content[0].product.store.variants[0].store.gid;
    }
  });

  const [image, setImage] = useState<any>(() => {
    if (page?.showHero) {
      return  { url: page.hero.content[0].product.store.variants[0].store.previewImageUrl } 
    }
  });

  useEffect(() => {
    console.log(page.seo)
  }, [])

  return (
    <div>
      <Head>
        <title>{page.seo?.title ? page.seo?.title : page.title}</title>
        <meta name="description" content={page.seo?.description} />
        <meta property="og:title" content={page.seo?.title ? page.seo?.title : page.title} />
        <meta property="og:type" content="website" />
        {page.seo?.image && <meta property="og:image" content={imageBuilder(page.seo?.image).height(630).width(1200).url()} />}
        <meta property="og:url" content={router.pathname} />
      </Head>
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
        <HairTypes />
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

export const getStaticPaths = async () => {
  const query = `*[ _type == "page"]`;

  const pages = await sanity.fetch(query);

  return {
    paths: pages.map((page: any) => ({
      params: {
        slug: page.slug.current,
      },
    })),
    fallback: false,
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


  const utoken = "kZl7BZ4R7OWf9Rq2hpXpFThQ2OGuS1xzzkjV89vJ";

  const reviewResponse = await fetch(
    `https://api.yotpo.com/v1/apps/${process.env.YOTPO_APP_KEY}/reviews?deleted=false&utoken=${utoken}&count=100`
  ).then((Response) => Response.json());

  return {
    props: {
      page,
      productImages,
      reviews: reviewResponse.reviews,
    },
    revalidate: 10,
  };
};

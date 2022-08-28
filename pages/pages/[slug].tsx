import { Box, Container } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import Head from "next/head";
import { createContext, useState } from "react";
import { HeroWithProduct } from "../../components/Page/Hero";
import PortableText from "../../components/PortableText/PortableText";
import {
  productFragment,
  productImageFragment,
} from "../../lib/fragments/productImageFragment";
import graphClient from "../../lib/graph-client";
import { sanity } from "../../lib/sanity";

export const VariantContext = createContext<any>({
  variant: "",
  updateVariant: () => null,
});

export const ImageContext = createContext<any>({
  image: {},
  setImage: () => null,
});

export default function Page({ page, productImages }: any) {
  const [variant, updateVariant] = useState<string>(() => {
    if (page.showHero && page.hero.content[0].product) {
      return page.hero.content[0].product.store.variants[0].store.gid;
    }
  });

  const [image, setImage] = useState<string>(() => {
    if (page.showHero && productImages) {
      return productImages.product.featuredImage;
    }
  });

  return (
    <div>
      <Head>
        <title>{page.seo ? page.seo.title : page.title}</title>
      </Head>
      <VariantContext.Provider value={{ variant, updateVariant }}>
        <ImageContext.Provider value={{ image, setImage }}>
          <Container maxW="container.xl">
            {page.showHero && (
              <HeroWithProduct hero={page.hero} productImages={productImages} body={page.body} />
            )}
          </Container>
        </ImageContext.Provider>
        {!page.showHero && <Container maxW="container.lg">
          <PortableText blocks={page.body} />
        </Container>}
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
        }
    }`;

  const page = await sanity.fetch(query);

  const productImages = await graphClient.request(productImageFragment, {
    id: page.hero?.content[0].product?.store.gid,
  });

  const product = await graphClient.request(productFragment, {
    id: page.hero?.content[0].product?.store.gid,
  });

  return {
    props: {
      page,
      productImages,
      product
    },
    revalidate: 10,
  };
};

import { Container, Heading } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import Head from "next/head";
import React, { Suspense, useEffect, useState } from "react";
import HeroWithProduct from "../../components/Page/HeroWithProduct";
import HeroImage from "../../components/Page/HeroImage";
import PortableText from "../../components/PortableText/PortableText";
import graphClient from "../../lib/graph-client";
import { productImageFragment } from "../../lib/fragments/productImageFragment";
import { imageBuilder, sanity } from "../../lib/sanity";
import { useRouter } from "next/router";
import { VariantContext } from "../../lib/pages/variant-context";
import { ImageContext } from "../../lib/pages/image-context";
import dynamic from "next/dynamic";

const Modules = dynamic(() => import("../../components/Page/Modules"), {
  suspense: true,
});

export default function Page({ page, productImages, bottomline }: any) {
  const router = useRouter();
  const [variant, updateVariant] = useState<string>(() => {
    if (page?.showHero && page.hero.content[0]._type === "productWithVariant") {
      return page.hero.content[0].product.store.variants[0].store.gid;
    }
  });

  const [image, setImage] = useState<any>(() => {
    if (page?.showHero && page.hero.content[0]._type === "productWithVariant") {
      return {
        url: page.hero.content[0].product.store.variants[0].store
          .previewImageUrl,
      };
    }
  });

  useEffect(() => {
    const content_type =
      page?.showHero && page.hero.content[0]._type === "productWithVariant"
        ? "product"
        : "product_group";

    if (window.dataLayer) {
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: "view-item",
        eventModel: {
          content_type,
          content_ids: [page.slug.current],
          content_name: page.title,
          currency: "USD",
        },
        eventCallback: () => console.log("event fired"),
      });
    }
  }, []);

  const heroTypeIsProduct = page.hero?.content[0]?._type === "productWithVariant";

  return (
    <div>
      <Head>
        <title>{page.seo?.title ? page.seo?.title : page.title}</title>
        <meta name="description" content={page.seo?.description} />
        <meta
          property="og:title"
          content={page.seo?.title ? page.seo?.title : page.title}
        />
        <meta property="og:type" content="website" />
        {page.seo?.image && (
          <meta
            property="og:image"
            content={imageBuilder(page.seo?.image)
              .height(630)
              .width(1200)
              .url()}
          />
        )}
        <meta property="og:url" content={router.pathname} />
      </Head>
      <VariantContext.Provider value={{ variant, updateVariant }}>
        <ImageContext.Provider value={{ image, setImage }}>
          {page?.showHero && heroTypeIsProduct && (
            <HeroWithProduct
              hero={page.hero}
              productImages={productImages}
              body={page?.body}
              bottomline={bottomline}
            />
          )}
          {page?.showHero &&
            page?.hero.content[0]._type === "imageWithProductHotspots" && (
              <HeroImage content={page.hero.content[0]} />
            )}
        </ImageContext.Provider>
        {page.hero?.content[0]._type !== "productWithVariant" && (
          <Container maxW="container.lg" py={16}>
            <Heading as="h1">{page.title}</Heading>
            <PortableText colorTheme={page.colorTheme} blocks={page.body} />
          </Container>
        )}
        <Suspense fallback={`Loading...`}>
          {page?.modules && (
            <Modules
              modules={page.modules}
              product={page?.showHero && page.hero.content[0]?.product.store}
            />
          )}
        </Suspense>
      </VariantContext.Provider>
    </div>
  );
}

export const getStaticPaths = async () => {
  const query = `*[ _type == "page"]{ title, slug }`;

  const pages = await sanity.fetch(query);

  return {
    paths: pages.map((doc: any) => ({
      params: { slug: doc.slug.current },
    })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[ _type == "page" && slug.current == "${params?.slug}"][0]
    {
        ...,
        colorTheme->,
        hero {
            ...,
            modules[] {
              ...,
              colorTheme->
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
        body[] {
          ...,
          markDefs[] {
            ...,
            productWithVariant {
              ...,
              product-> {
                ...,
                store {
                  ...,
                  variants[]->
                }
              },
              variant->
            }
          },
        },
        modules[] {
          ...,
          reviews[]->
        }
    }`;

  const page = await sanity.fetch(query);

  const heroTypeIsProduct = page.hero?.content[0]._type === "productWithVariant";

  let productImages;
  if (heroTypeIsProduct) {
    productImages = await graphClient.request(productImageFragment, {
      id: page.hero?.content[0].product?.store.gid,
    });
  } else {
    productImages = null;
  }

  let reviewResponse, scoreAverage, reviewCount;

  if (heroTypeIsProduct) {
    reviewResponse = await fetch(
      `https://api.yotpo.com/v1/apps/${process.env.YOTPO_APP_KEY}/reviews?deleted=false&utoken=${process.env.YOTPO_UTOKEN}&count=100`
    ).then((Response) => Response.json());

    scoreAverage =
      reviewResponse.reviews.reduce(
        (acc: number, obj: any) => acc + obj.score,
        0
      ) / reviewResponse.reviews.length;

    reviewCount = reviewResponse.reviews.length;
  } else {
    reviewResponse = null, scoreAverage = null, reviewCount = null
  }

  return {
    props: {
      page,
      productImages,
      reviews: reviewResponse ? reviewResponse.reviews : null,
      bottomline: {
        scoreAverage,
        reviewCount,
      },
    },
    revalidate: 10,
  };
};

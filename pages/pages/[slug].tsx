import { Box, Container } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import Head from "next/head";
import { createContext, useState } from "react";
import { HeroWithProduct } from "../../components/Page/Hero";
import PortableText from "../../components/PortableText/PortableText";
import { sanity } from "../../lib/sanity";

export const VariantContext = createContext<any>({
  variant: "",
  updateVariant: () => null,
});

export default function Page({ page }: any) {
  const [variant, updateVariant] = useState<string>("");

  return (
    <div>
      <Head>
        <title>{page.seo ? page.seo.title : page.title}</title>
      </Head>
      <VariantContext.Provider value={{ variant, updateVariant }}>
        <Container maxW="container.xl">
          {page.showHero && <HeroWithProduct hero={page.hero} />}
        </Container>
        <Container maxW="container.lg">
          <PortableText blocks={page.body} />
        </Container>
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
            content[] {
                ...,
                product-> {
                    ...,
                    store {
                        ...,
                        variants[]->
                    }
                }
            }
        }
    }`;

  const page = await sanity.fetch(query);

  return {
    props: {
      page,
    },
    revalidate: 10,
  };
};

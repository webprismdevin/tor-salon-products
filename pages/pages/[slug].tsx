import { GetStaticProps } from "next";
import Head from "next/head";
import React from "react";
import { MODULE_FRAGMENT, sanity } from "../../lib/sanity";
import Modules from "../../components/Modules/Modules";

export default function Page({ page }: any) {
  return (
    <div>
      <Head>
        <title>{page.seo?.title ?? page.title}</title>
        <meta name="description" content={page?.description} />
      </Head>
      <Modules modules={page.modules} />
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
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const page = await sanity.fetch(query, { slug: params?.slug });

  return {
    props: {
      page,
    },
    revalidate: 10,
  };
};

const query = `*[ _type == "page" && slug.current == $slug ][0]
{
  ...,
  ${MODULE_FRAGMENT}
}`;

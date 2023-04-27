import { GetStaticProps } from "next";
import Head from "next/head";
import React, { Suspense, useEffect, useState } from "react";
import { imageBuilder, sanity } from "../../lib/sanity";
import dynamic from "next/dynamic";

const Modules = dynamic(() => import("../../components/Page/Modules"), {
  suspense: true,
});

export default function Page({ page }: any) {
  return (
    <>
      <Seo page={page} /> {/* SEO */}
      <Suspense fallback={<div>Loading...</div>}>
        <Modules modules={page.modules} />
      </Suspense>
    </>
  );
}

const Seo = ({ page }: any) => {
  return (
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
          content={imageBuilder(page.seo?.image).height(630).width(1200).url()}
        />
      )}
      <meta
        property="og:url"
        content={`https://www.torsalonproducts.com/pages/${page.slug.current}`}
      />
    </Head>
  );
};

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
  const query = `*[ _type == "page" && slug.current == "${params?.slug}"][0]{
    ...,
    modules[]
  }`;

  const page = await sanity.fetch(query);

  return {
    props: {
      page,
    },
    revalidate: 10,
  };
};

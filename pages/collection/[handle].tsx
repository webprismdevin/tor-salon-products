import Head from "next/head";
import { gql } from "graphql-request";
import getCollections from "../../lib/get-collections";
import { AnalyticsPageType } from "@shopify/hydrogen-react";
import ProductCard from "../../components/Modules/ProductGrid_v2/ProductCard";
import graphClient from "../../lib/graph-client";

export default function CollectionPage({
  handle,
  data,
  analytics,
}: {
  handle: string;
  data: any;
  analytics?: any;
}) {
  if (!data) return null;

  return (
    <>
      <Head>
        <title>{`${data.title} | TOR Salon Products`}</title>
        <meta
          name="description"
          content={`${data.description.substring(0, 200)}...`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "${data.title}",
              "description": "${data.description}"
            }`,
          }}
        />
      </Head>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12 place-items-center mx-auto p-4 md:p-12">
        {data.products.edges.map((p: any) => (
          <div key={p.node.id}>
            <ProductCard
              product={{
                gid: p.node.id,
                title: p.node.title,
                featuredImage: p.node.images.edges[0].node.url,
                price: p.node.priceRange.minVariantPrice.amount,
                handle: p.node.handle,
                variantId: p.node.variants.edges[0].node.id,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const result = await getCollections("home");

  return {
    paths: result.collections.edges.map((edge: any) => ({
      params: { handle: edge.node.handle },
    })),
    fallback: true,
  };
}

export async function getStaticProps(context: any) {
  const handle = context.params.handle;

  const res: any = await graphClient.request(collection_query, {
    handle: handle,
  });

  if (res.errors) {
    console.log(JSON.stringify(res.errors, null, 2));
    throw Error("Unable to retrieve Shopify Products. Please check logs");
  }

  return {
    props: {
      handle: handle,
      data: res.collection,
      analytics: {
        pageType: AnalyticsPageType.collection,
        resourceId: res.collection.id,
        collectionHandle: handle,
      },
    },
    revalidate: 60,
  };
}

export const collection_query = gql`
  query getCollection($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      descriptionHtml
      image {
        url
      }
      products(first: 100) {
        edges {
          node {
            id
            title
            description
            handle
            variants(first: 2) {
              edges {
                node {
                  id
                }
              }
            }
            images(first: 2) {
              edges {
                node {
                  url
                }
              }
            }
            priceRange {
              maxVariantPrice {
                amount
              }
              minVariantPrice {
                amount
              }
            }
            compareAtPriceRange {
              maxVariantPrice {
                amount
              }
            }
          }
        }
      }
    }
  }
`;

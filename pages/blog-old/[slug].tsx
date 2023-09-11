import { GetStaticProps } from "next";
import { Container, Box, Heading, AspectRatio, Image } from "@chakra-ui/react";
import Head from "next/head";
import { imageBuilder } from "../../lib/sanity";
import RichContent from "components/RichContent";

const BlogPost = ({ post }: any) => {
  return (
    <article>
      <Head>
        <title>{post.title}</title>
      </Head>
      <Box py={20}>
        <Container>
          {post.mainImage && (
            <AspectRatio ratio={3 / 2} mb={6}>
              <Image
                src={imageBuilder(post.mainImage).url()}
                alt={post.title}
              />
            </AspectRatio>
          )}
          <Heading as="h1" size="2xl">
            {post.title}
          </Heading>
          <RichContent
            // colorTheme={post.colorTheme}
            blocks={post.body}
          />
        </Container>
      </Box>
    </article>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const pageSlug = params?.slug;
  const query = encodeURIComponent(
    `*[ _type == "post" && slug.current == "${pageSlug}"]{
      ...,
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
    }`
  );

  const url = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/production?query=${query}`;
  const result = await fetch(url).then((res) => res.json());
  const returnedPost = result.result[0];

  return {
    props: {
      post: returnedPost,
    },
    revalidate: 10,
  };
};

export async function getStaticPaths() {
  const query = encodeURIComponent(
    `*[ _type == "post"] | order(_createdAt asc) { slug }`
  );

  const url = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/production?query=${query}`;
  const result = await fetch(url).then((res) => res.json());
  const allPosts = result.result;

  return {
    paths:
      allPosts?.map((post: any) => ({
        params: {
          slug: post.slug.current,
        },
      })) || [],
    fallback: "blocking",
  };
}

export default BlogPost;

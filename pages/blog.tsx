import { GetStaticProps } from "next";
import Head from "next/head";
import {
  Box,
  Stack,
  Text,
  AspectRatio,
  Image,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react";
import { imageBuilder } from "../lib/sanity";
import NextLink from "next/link";
import { Heading } from "components/Heading";
import Link from "next/link";

const Posts = ({ posts }: any) => {
  return (
    <Box>
      <Head>
        <title>Blog</title>
        <meta
          name="description"
          content="Join us as we share stories about building the TOR business and brand, life as entreprenuers, and of course, articles about the science behind hair, trends and other news!"
        />
      </Head>
      <SimpleGrid templateColumns={"repeat(3, 1fr)"}>
        {posts.map((post: any) => (
          <GridItem
            colSpan={[3, 1]}
            key={post._id}
            className="blog_article"
            pos="relative"
            justifySelf={"stretch"}
          >
            <Link
              href={`/blog/${post.slug.current}`}
              className="cursor-pointer"
            >
              <AspectRatio
                position="relative"
                zIndex={0}
                ratio={3 / 3}
                height={[200, 400]}
              >
                <Image
                  src={imageBuilder(post.mainImage).url()!}
                  alt="blog post photo"
                  objectFit="cover"
                />
              </AspectRatio>
            </Link>
            <Stack pos="relative" zIndex={1} p={[4, 8]} align="flex-start">
              <Link href={`/blog/${post.slug.current}`}>
                <Heading as="h3">{post.title}</Heading>
              </Link>
              <p className="py-2 flex-1">{post.subtitle}</p>
              <Link
                href={`/blog/${post.slug.current}`}
                className="py-2 border-b-2 border-black hover:decoration-none"
              >
                Read more →
              </Link>
            </Stack>
          </GridItem>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = encodeURIComponent(
    `*[ _type == "post" ] | order (_createdAt desc)`
  );

  const url = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/production?query=${query}`;
  const result = await fetch(url).then((res) => res.json());
  const allPosts = result.result;

  return {
    props: {
      posts: allPosts,
    },
    revalidate: 10,
  };
};

export default Posts;

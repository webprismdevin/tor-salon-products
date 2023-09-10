import { GetStaticProps } from "next";
import Head from "next/head";
import {
  Box,
  Stack,
  Heading,
  Text,
  AspectRatio,
  Image,
  Link,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react";
import { imageBuilder } from "../lib/sanity";
import NextLink from 'next/link';

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
          <GridItem colSpan={[3, 1]} key={post._id} className="blog_article" pos="relative">
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
            <Stack pos="relative" zIndex={1} p={[4, 8]} align="flex-start">
              <Heading size="lg">{post.title}</Heading>
              <Text mt={2}>{post.subtitle}</Text>
              <NextLink href={`/blog/${post.slug.current}`} legacyBehavior>
                <Link py={2} _hover={{textDecor: "none"}} borderBottom="1px solid black">Read more →</Link>
              </NextLink>
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

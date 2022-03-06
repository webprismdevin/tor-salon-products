import { GetStaticProps } from "next";
import Head from "next/head";
import { Box, Stack, Heading, Text, Container, AspectRatio, Image, Button, VStack, Divider } from "@chakra-ui/react"
import { imageBuilder } from "../lib/sanity";
import { useRouter } from "next/router";

const Posts = ({ posts }: any) => {
  const router = useRouter();

  return (
    <Box>
      <Head>
        <title>Blog</title>
      </Head>
      <Container centerContent maxW="container.xl" p={[4, 20]} mt={20}>
        <Heading>Blog</Heading>
        <Divider my={10}/>
        <Stack
          spacing={["24px", "36px"]}
          alignItems="center"
          justifyContent="center"
          direction={["column"]}
          flexWrap="wrap"
          pb={16}
        >
          {posts.map((post:any) => (
            <Box
              shadow="base"
              key={post._id}
              p={8}
              maxW={["full", "80%"]}
            >
              <Stack direction={['column', 'row']} alignItems={"flex-start"}>
                <AspectRatio ratio={3/2} minH={['auto',200]} minW={['100%', 300]}>
                    <Image src={imageBuilder(post.mainImage).url()!} alt="blog post photo" objectFit="cover"/>
                </AspectRatio>
                <VStack pl={[0, 8]} alignItems={"flex-start"} spacing={3} minW={['auto', 300]}>
                    <Heading size="lg">
                      {post.title}
                    </Heading>
                    <Text mt={2}>{post.subtitle}</Text>
                    <Button onClick={() => router.push(`/blog/${post.slug.current}`)}>Read more →</Button>
                </VStack>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = encodeURIComponent(
    `*[ _type == "post" ] | order (publishedAt desc)`
  );

  const url = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/production?query=${query}`;
  const result = await fetch(url).then((res) => res.json());
  const allPosts = result.result;

  return {
    props: {
      posts: allPosts,
    },
    revalidate: 60,
  };
};

export default Posts;

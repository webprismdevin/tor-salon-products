import { GetStaticProps } from "next";
import Head from "next/head";
import { Box, Stack, Heading, Text, Container, AspectRatio, Image, Button, VStack, Divider, HStack } from "@chakra-ui/react"
import { imageBuilder } from "../lib/sanity";
import { useRouter } from "next/router";

const Posts = ({ posts }: any) => {
  const router = useRouter();

  return (
    <Box>
      <Head>
        <title>Blog</title>
        <meta name="description" content="Join us as we share stories about building the TOR business and brand, life as entreprenuers, and of course, articles about the science behind hair, trends and other news!" />
      </Head>
      <Container centerContent maxW="container.lg" p={[4, 0]} mt={20}>
        <Heading as={"h1"} mb={16} size="2xl">TOR Blog</Heading>
        <Stack
          spacing={["24px", "36px"]}
          alignItems="center"
          justifyContent="center"
          direction={["column"]}
          pb={16}
          w="full"
        >
          {posts.map((post:any) => (
            <Box
              shadow="base"
              border={"1px solid rgba(0, 0, 0, 0.05)"}
              key={post._id}
              maxW={["full"]}
              w="full"
            >
              <Stack direction={['column', 'row']} alignItems={"flex-start"} w="100%">
                <AspectRatio ratio={3/2} minH={['auto', '100%']} minW={['100%', 400]}>
                    <Image src={imageBuilder(post.mainImage).url()!} alt="blog post photo" objectFit="cover"/>
                </AspectRatio>
                <VStack py={8} px={[2, 8]} alignItems={"flex-start"} spacing={3} minW={['auto']}>
                    <Heading size="lg">
                      {post.title}
                    </Heading>
                    <Text mt={2}>{post.subtitle}</Text>
                    <Button onClick={() => router.push(`/blog/${post.slug.current}`)}>Read more →</Button>
                    <HStack></HStack>
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
    `*[ _type == "post" ] | order (_createdAt desc)`
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

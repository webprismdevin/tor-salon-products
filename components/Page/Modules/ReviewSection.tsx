import {
  AspectRatio,
  Box,
  Container,
  Divider,
  Heading,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  Textarea,
  Stack,
  useToast,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { RatingStar } from "rating-star";
import { useState, Fragment } from "react";
import useSWR from "swr";
import Loader from "../../Loader";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ReviewSection() {
  const { data, error } = useSWR(
    `https://api.yotpo.com/v1/apps/${process.env.NEXT_PUBLIC_YOTPO_APP_KEY}/reviews?deleted=false&utoken=${process.env.NEXT_PUBLIC_YOTPO_UTOKEN}&count=100`,
    fetcher
  );

  if (!data) {
    return (
      <Container centerContent>
        <Loader />
      </Container>
    );
  }

  if (error) {
    return (
      <Container centerContent>
        <Text>We couldn&apos;t load reviews...</Text>
      </Container>
    );
  }

  const scoreAverage =
    data.reviews.reduce((acc: number, obj: any) => acc + obj.score, 0) /
    data.reviews.length;

  return (
    <Container
      maxW="container.lg"
      id={"page_all_reviews"}
      pb={20}
      centerContent
      key={"reviews_section_page"}
    >
      <Box w="full" py={12}>
        <Heading size="xl" textAlign={"center"} fontFamily={"Futura"} mb={12}>
          What People Are Saying
        </Heading>
        <HStack justify="space-between">
          <HStack align="flex-start">
            <Text lineHeight={1} fontFamily={"Futura"} fontSize="6xl" mr={4}>
              {scoreAverage}
            </Text>
            <Stack spacing={0}>
              <RatingStar
                id={`bottomLine-review-star`}
                rating={scoreAverage}
                size={32}
                colors={{ mask: "#000000", stroke: "#000000" }}
              />
              <Text fontStyle={"italic"}>
                Based on {data.reviews.length} reviews
              </Text>
            </Stack>
          </HStack>
          {/* <Button onClick={onOpen}>Write A Review</Button> */}
        </HStack>
        <Divider mt={6} />
      </Box>
      <Stack w="full" spacing={12}>
        {data.reviews.map((r: any, index: number) => {
          const colorArray = [
            "brand.curly",
            "brand.fineThin",
            "brand.mediumThick",
          ];

          return (
            <Stack direction="row" key={r.id} spacing={8}>
              <Stack flexShrink={0}>
                <AspectRatio ratio={1 / 1} w="64px">
                  <Box borderRadius={"100%"} bgColor={colorArray[index % 3]}>
                    <Text
                      textTransform={"uppercase"}
                      fontFamily="Futura"
                      fontSize="xl"
                    >
                      {r.name.split(" ")[0].substring(0, 1)}
                      {r.name.split(" ")[1]?.substring(0, 1)}
                    </Text>
                  </Box>
                </AspectRatio>
                <Text fontStyle={"italic"} textTransform="capitalize">
                  {r.name}
                </Text>
                <Text color="green">Verified Buyer</Text>
              </Stack>
              <Stack spacing={3} w="full" align="flex-start">
                <Stack
                  direction="row"
                  justify={"space-between"}
                  w="full"
                  fontStyle={"italic"}
                  color="blackAlpha.600"
                >
                  <RatingStar
                    id={`reviews_section_page--${r.id.toString()}`}
                    size={16}
                    rating={r.score}
                  />
                  <Text>{dayjs(r.created_at).format("MMM DD, YYYY")}</Text>
                </Stack>
                <Text
                  fontSize="2xl"
                  textTransform={"capitalize"}
                  dangerouslySetInnerHTML={{
                    __html: r.title,
                  }}
                />
                <Text
                  dangerouslySetInnerHTML={{
                    __html: r.content,
                  }}
                ></Text>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Container>
  );
}
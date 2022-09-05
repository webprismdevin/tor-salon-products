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
import { useState } from "react";

export default function ReviewSection({ reviews, handle, gid }: any) {
  const scoreAverage =
    reviews.reduce((acc: number, obj: any) => acc + obj.score, 0) /
    reviews.length;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [review, setReview] = useState("");
  const [title, setTitle] = useState("");
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  function onSubmit() {
    if (name && email && review && title) {
      setSubmitting(true);
      fetch("https://api.yotpo.com/v1/widget/reviews", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appkey: "bz5Tc1enx8u57VXYMgErAGV7J82jXdFXoIImJx6l",
          domain: "tor-salon-products.myshopify.com",
          sku: gid,
          product_title: handle,
          display_name: name,
          email: email,
          is_incentivized: false,
          review_content: review,
          review_title: title,
          review_score: rating,
        }),
      })
        .then((res) => res.json())
        .then((response) => {
          setSubmitting(false);
          if (response.code === 200) {
            toast({
              title: "Thank you for your review!",
              description:
                "Your review has been received and will be published soon!",
            });
            setEmail("");
            setReview("");
            setTitle("");
            setEmail("");
            setName("");
          }
        });
    }
  }

  return (
    <>
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
                  Based on {reviews.length} reviews
                </Text>
              </Stack>
            </HStack>
            <Button onClick={onOpen}>Write A Review</Button>
          </HStack>
          <Divider mt={6} />
        </Box>
        <Stack w="full" spacing={12}>
          {reviews.map((r: any, index: number) => {
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
                  <Stack direction="row" justify={"space-between"} w="full" fontStyle={"italic"} color="blackAlpha.600">
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Write A Review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <Stack align="flex-start">
                <Box w="full">
                  <Text mr={2}>Score</Text>
                  <RatingStar
                    id={"review_rating"}
                    clickable
                    maxScore={5}
                    rating={rating}
                    onRatingChange={(score) => setRating(score)}
                  />
                </Box>
                <Box w="full">
                  <Text>Review Title</Text>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Review title"
                  />
                </Box>
                <Box w="full">
                  <Text>Your name</Text>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </Box>
                <Box w="full">
                  <Text>Your email</Text>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                  />
                </Box>
                <Box w="full">
                  <Text>Your review</Text>
                  <Textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Enter your review"
                  />
                </Box>
              </Stack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={submitting}
              loadingText="Submitting..."
              onClick={onSubmit}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

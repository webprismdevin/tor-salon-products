import {
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Link,
  Button,
  Input,
  Textarea,
  Stack,
  Select,
  Toast,
  useToast,
} from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import { RatingStar } from "rating-star";
import { useState } from "react";

declare interface ReviewSubmitProps {
  handle: string //shopify product handle
  gid: string // shopify product gid
}

export default function ReviewSubmit({ handle, gid }: ReviewSubmitProps) {
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
            "Accept": "application/json",
            "Content-Type": "application/json"
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
            setEmail("")
            setReview("")
            setTitle("")
            setEmail("")
            setName("")
          }
        });
    }
  }

  return (
    <>
      <Button w="full" onClick={onOpen} leftIcon={<AiFillEdit />} variant="ghost">
        Write A Review
      </Button>
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

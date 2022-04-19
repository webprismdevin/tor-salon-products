import {
  Box,
  Input,
  Stack,
  Heading,
  Text,
  BoxProps,
  InputGroup,
  InputRightElement,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";

const MotionBox = motion<BoxProps>(Box);

export default function MailingList() {
  const [popupShown, setShown] = useState(false);
  const controls = useAnimation();
  const [email, setEmail] = useState("");
  const [formStatus, setStatus] = useState("clean");

  useEffect(() => {
    const height = document.body.scrollHeight;
    const trigger = height / 3;

    if (!popupShown) controls.start("initial");

    const interval = setInterval(() => {
      if (window.scrollY > trigger && !popupShown) {
        console.log(popupShown);
        controls.start("animate");
        setShown(true);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [popupShown]);

  const animationVariants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 1008,
    },
    close: {
      x: 0,
    },
  };

  async function subscribe() {
    setStatus("loading");

    const response = await fetch("/api/addsubscriber", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    }).then((res) => res.json());

    if (!response) {
      setStatus("failure");
    }

    if (response) {
      setStatus("success");
    }
  }

  function handleEnter(event: any) {
    if (event.code === "Enter") {
      subscribe();
    }
  }

  return (
    <MotionBox
      pos="fixed"
      bottom={2}
      left={-1000}
      p={10}
      zIndex={2}
      bgColor="black"
      color="white"
      animate={controls}
      variants={animationVariants}
      maxW={["360px", "580px"]}
    >
      <MotionBox
        whileHover={{
          opacity: 0.6
        }}
        onClick={() => controls.start("close")}
        pos={"absolute"}
        right={4}
        top={-2}
        fontSize={36}
        cursor="pointer"
      >
        &times;
      </MotionBox>
      <Stack spacing={2}>
        <Heading>
          {formStatus === "success"
            ? "Check your inbox!"
            : "Join the TOR Community!"}
        </Heading>
        <InputGroup display={formStatus === "success" ? "none" : "inherit"}>
          <Input
            fontSize={24}
            pb={2}
            borderBottom={"4px solid white"}
            borderRadius={0}
            variant={"unstyled"}
            placeholder={"sign up now!"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleEnter}
          />
          <InputRightElement onClick={subscribe}>
            {formStatus === "loading" ? (
              <Spinner />
            ) : (
              <Icon _hover={{opacity: 0.6}} cursor="pointer" as={FiArrowRight} boxSize={6} mt={2} />
            )}
          </InputRightElement>
        </InputGroup>
        <Text>
          {formStatus === "success"
            ? "We're grateful to have you join! Check your inbox for your special discount."
            : "Special discount when you join! Get access to exclusive discounts, new product updates and more amazing content!"}
        </Text>
      </Stack>
    </MotionBox>
  );
}

"use client";
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
  Select,
} from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { usePlausible } from "next-plausible";

const MotionBox = motion<BoxProps>(Box);

declare interface MailingListSettings {
  settings: {
    title: string;
    description: string;
    delay: number;
    hiddenRoutes: [string];
  };
}

export default function MailingList({ settings }: MailingListSettings) {
  const [popupShown, setShown] = useState(false);
  const controls = useAnimation();
  const [email, setEmail] = useState("");
  const [hairType, setHairType] = useState("");
  const [formStatus, setStatus] = useState("clean");
  const plausible = usePlausible();

  useEffect(() => {
    if (!popupShown) controls.start("initial");

    const interval = setInterval(async () => {
      const isSubbed = await window.localStorage.getItem("subscribed");
      const popupShown = await window.sessionStorage.getItem("popupShown");

      if (!popupShown && isSubbed !== "true") {
        controls.start("animate");
        setShown(true);
        window.sessionStorage.setItem("popupShown", "true");
      }
    }, settings.delay);

    return () => clearInterval(interval);
  }, [popupShown]);

  const animationVariants = {
    initial: {
      y: 0,
    },
    animate: {
      y: -608,
    },
    close: {
      y: 0,
    },
  };

  async function subscribe() {
    setStatus("loading");

    plausible("Subscribe", { props: { method: "popup" } });

    const response = await fetch("/api/addsubscriber", {
      method: "POST",
      body: JSON.stringify({
        email,
        hairType,
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
      bottom={-600}
      left={2}
      p={10}
      zIndex={200}
      bgColor="black"
      color="white"
      animate={controls}
      variants={animationVariants}
      maxW={["320px", "640px"]}
    >
      <MotionBox
        whileHover={{
          opacity: 0.6,
        }}
        onClick={() => controls.start("close")}
        pos={"absolute"}
        right={4}
        top={0}
        fontSize={36}
        cursor="pointer"
      >
        &times;
      </MotionBox>
      <Stack spacing={2}>
        <Heading>
          {formStatus === "success" ? "Check your inbox!" : settings.title}
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
              <Icon
                _hover={{ opacity: 0.6 }}
                cursor="pointer"
                as={FiArrowRight}
                boxSize={6}
                mt={2}
                onClick={subscribe}
              />
            )}
          </InputRightElement>
        </InputGroup>
        {email !== "" && formStatus !== "success" && (
          <Select
            placeholder="Select your hair type"
            onChange={(e) => setHairType(e.target.value)}
          >
            <option value="Curly">Curly</option>
            <option value="Fine/Thin">Fine/Thin</option>
            <option value="Medium/Thick">Medium/Thick</option>
          </Select>
        )}
        <Text>
          {formStatus === "success"
            ? "We're grateful to have you join! Check your inbox for your special discount."
            : settings.description}
        </Text>
      </Stack>
    </MotionBox>
  );
}

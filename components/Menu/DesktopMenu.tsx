import {
  Stack,
  Text,
  Container,
  Link,
  Divider,
  BoxProps,
  Box,
} from "@chakra-ui/react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { BodyAndSkin, ByHairType, ByProductTypes, MoreLinks } from "./MenuSections";

const MotionBox = motion<BoxProps>(Box);

const variants = {
  initial: {
    display: "none",
    opacity: 0,
  },
  animate: {
    display: "inherit",
    opacity: 1,
  },
  exit: {
    display: "none",
    opacity: 0,
    transition: {
      display: { delay: 0.4 },
      opacity: { delay: 0 },
    },
  },
};

const DesktopMenu = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("initial");
  }, []);

  return (
    <>
      <Text onMouseEnter={() => controls.start("animate")}>Shop</Text>
      <AnimatePresence exitBeforeEnter={true}>
        <MotionBox
          pos="fixed"
          right={0}
          top={16}
          w="100vw"
          bg="white"
          shadow={"md"}
          py={6}
          zIndex={1}
          animate={controls}
          variants={variants}
          onMouseLeave={() => controls.start("exit")}
          px={[4, 10]}
        >
          {/* <Container maxW="container.xl"> */}
            <Stack direction="row" spacing={24}>
              <Stack>
                <Text fontSize={"xl"} fontFamily={'Futura'}>Hair Care</Text>
                <Divider />
                <Stack direction="row" spacing={12}>
                  <Stack>
                    <Text fontWeight={600}>Shop by Product Type</Text>
                    <ByProductTypes />
                  </Stack>
                  <Stack>
                    <Text fontWeight={600}>Shop by Hair Type</Text>
                    <ByHairType />
                  </Stack>
                </Stack>
              </Stack>
              <Stack>
                <Text fontSize={"xl"} fontFamily={'Futura'}>Body + Skin</Text>
                <Divider />
                <BodyAndSkin />
              </Stack>
              <Stack>
                <Text fontSize={"xl"} fontFamily={'Futura'}>More</Text>
                <Divider />
                <MoreLinks />
              </Stack>
            </Stack>
          {/* </Container> */}
        </MotionBox>
      </AnimatePresence>
    </>
  );
};

export default DesktopMenu;

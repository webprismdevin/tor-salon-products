import { Stack, Text, Divider, BoxProps, Box } from "@chakra-ui/react";
import { AnimatePresence, motion, useAnimation, useCycle } from "framer-motion";
import { ByHairType, ByProductTypes, MoreLinks } from "./MenuSections";

const MotionBox = motion<BoxProps>(Box);

const DesktopMenu = () => {
  const [open, cycleOpen] = useCycle(false, true);

  return (
    <>
      <Text
        display={["none", "inherit"]}
        onMouseEnter={() => cycleOpen()}
        order={[4, 3]}
        pl={[8]}
      >
        Shop
      </Text>
      <AnimatePresence>
        {open && (
          <MotionBox
            pos="absolute"
            right={0}
            top={20}
            w="100vw"
            bg="white"
            shadow={"md"}
            py={6}
            zIndex={1}
            onMouseLeave={() => cycleOpen()}
            initial={{opacity: 0}}
            animate={{opacity: 1, transition: {duration: 0.3}}}
            exit={{opacity: 0, transition: { delay: 0.2, duration: 0.3}}}
            px={[4, 10]}
          >
            <Stack direction="row" spacing={24}>
              <Stack>
                <Text fontSize={"xl"} fontFamily={"Futura"}>
                  Hair Care
                </Text>
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
                <Text fontSize={"xl"} fontFamily={"Futura"}>
                  More
                </Text>
                <Divider />
                <MoreLinks />
              </Stack>
            </Stack>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
};

export default DesktopMenu;

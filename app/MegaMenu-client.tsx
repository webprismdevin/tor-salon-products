"use client";

import {
  Box,
  Stack,
  Text,
  Icon,
  Link,
  BoxProps,
} from "@chakra-ui/react";
import { AnimatePresence, motion, useCycle } from "framer-motion";
import React from "react";
import NextLink from "next/link";
import { BiChevronDown } from "react-icons/bi";
import useSWR from "swr";
import { sanity } from "../lib/sanity";


const MotionBox = motion<BoxProps>(Box);

const sanityFetcher = (query: string) => sanity.fetch(query);

const settingsQuery = `*[ _type == "settings" ][0]
{ 
  menu { 
    mega_menu[]{
      ...,
      _type == 'collectionGroup' => @{ 
        collectionLinks[]-> 
      },
      _type != 'collectionGroup' => @
    },
    links[]{
      _type == 'reference' => @->,
      _type != 'reference' => @,
    }
  } 
}`;

export default function MegaMenu() {
  const [open, cycleOpen] = useCycle(false, true);
  const { data, error } = useSWR(settingsQuery, sanityFetcher);

  return (
    <React.Fragment>
      <Stack
        direction="row"
        align="center"
        onMouseEnter={() => cycleOpen()}
        gap={0}
      >
        <Text>Shop</Text>
        <Icon as={BiChevronDown} />
      </Stack>
      <AnimatePresence>
        {open && data && (
          <MotionBox
            pos="absolute"
            right={0}
            top={20}
            w="100vw"
            bg="white"
            shadow={"md"}
            pt={6}
            pb={12}
            zIndex={1}
            onMouseLeave={() => cycleOpen()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { delay: 0.2, duration: 0.3 } }}
            px={10}
          >
            <Stack direction="row" gap={16}>
              {data.menu.mega_menu
                .filter((item) => item._type === "collectionGroup")
                .map((item) => (
                  <Stack key={item._key}>
                    <Text fontWeight={600}>{item.title}</Text>
                    {item.collectionLinks!.map((link) => (
                      <NextLink
                        legacyBehavior
                        key={link._id}
                        href={`/${link._type}/${link.store.slug.current}`}
                        passHref
                      >
                        <Link>{link.store.title}</Link>
                      </NextLink>
                    ))}
                  </Stack>
                ))}
              <Stack>
                <Text fontWeight={600}>More</Text>
                {data.menu.mega_menu
                  .filter(
                    (item) =>
                      item._type === "linkExternal" ||
                      item._type === "linkInternal"
                  )
                  .map((item) => (
                    <NextLink
                      legacyBehavior
                      href={item.url}
                      key={item._key}
                      target={item.newWindow ? "_blank" : "_self"}
                    >
                      <Link>{item.title}</Link>
                    </NextLink>
                  ))}
              </Stack>
            </Stack>
          </MotionBox>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}

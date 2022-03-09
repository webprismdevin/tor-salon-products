import {
  Box,
  Flex,
  Text,
  Container,
  Heading,
  VStack,
  AspectRatio,
  Image,
  SimpleGrid,
  GridItem,
  Divider,
} from "@chakra-ui/react";
import { groq } from "next-sanity";
import { getClient, imageBuilder } from "../lib/sanity";
import Head from "next/head";
import { useState, useRef } from "react";
import { isMobile } from 'react-device-detect'

const About = ({ data }: any) => {
  return <Container centerContent py={20}>
    About
  </Container>
};

export async function getStaticProps() {
  const aboutPageQuery = groq`*[_type == "about"][0]`;

  const aboutPageData = await getClient(false).fetch(aboutPageQuery, {});

  return {
    props: {
      data: aboutPageData,
    },
  };
}

export default About;

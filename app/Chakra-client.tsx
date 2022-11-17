'use client'

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { theme as defaultTheme, ThemeConfig } from "@chakra-ui/theme";

import themeConfig from "../lib/theme";

const customTheme: ThemeConfig = extendTheme(defaultTheme, themeConfig);

export default function Chakra({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={customTheme}>{children}</ChakraProvider>;
}

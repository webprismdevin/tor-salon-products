"use client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import themeConfig from "../lib/theme";
import { theme as defaultTheme, ThemeConfig } from "@chakra-ui/theme";

const customTheme: ThemeConfig = extendTheme(defaultTheme, themeConfig);

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChakraProvider theme={customTheme}>{children}</ChakraProvider>;
}

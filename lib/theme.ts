import { mode } from "@chakra-ui/theme-tools";

const themeConfig = {
  useSystemColorMode: false,
  initialColorMode: "light",
  colors: {
    brand: {
      black: "#000000",
      white: "#FFFFFF",
      rose: "#E4D5D4",
      alabaster: "#E4E2DB",
      platinum: "#D7E1DC",
      curly: "#E4D5D4",
      fineThin: "#E4E2DB",
      mediumThick: "#D7E1DC"

    },
  },
  fonts: {
    heading: "ApercuPro, sans-serif",
    body: "ApercuPro, sans-serif",
  },
  components: {
    Button: {
      variants: {
        solid: (props: any) => ({
          bg: mode("black", "white")(props),
          color: mode("whiteAlpha.900", "whiteAlpha.900")(props),
          _hover: {
            color: mode("black", "whiteAlpha.900")(props),
            // bg: mode("brand.lightBlue", "brand.darkBlue")(props)
          },
        }),
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 300,
      },
      sizes: {
        "4xl": {
          fontSize: ["6xl", null, "120px"],
        },
        "2xl": {
          fontSize: ["4xl", null, "56px"],
        },
      },
    },
  },
};

export default themeConfig;

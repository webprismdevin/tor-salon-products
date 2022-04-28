import {
  Container,
  Box,
  Heading,
  Button,
  Stack,
  HStack,
  Text,
  Image,
  Icon,
  GridItem,
  SimpleGrid,
  Textarea,
  Input,
} from "@chakra-ui/react";
import { FiBookOpen, FiCreditCard, FiGift } from "react-icons/fi";
import { useState, useRef } from "react";
import { useFormik } from "formik";
import Head from "next/head";

export default function SalonFinder() {
  const applyNowRef = useRef<null | HTMLDivElement>(null);

  return (
    <Box bgColor={"black"} color={"white"}>
      <Head>
        <title>Salon Professionals | TOR Salon Products</title>
        <meta name="description"  content="TOR Salon Products was started by a haircare industry veteran, with a strong understanding of stylist and salons challenges, and over a decade helping salons formulate products for their clients." />
      </Head>
      <Box pt={[20, 40]} pb={60} pos="relative" h={["auto", 1400]}>
        <Image
          src="/images/professionals/professionals-main.png"
          alt="salon photo and graphic"
          pos={["static", "absolute"]}
          right={0}
          top={460}
        />
        <Container maxW="container.xl">
          <Stack spacing={2} align="flex-start">
            <Heading
              as="h1"
              fontSize={22}
              textTransform="uppercase"
              fontFamily={"Futura"}
              mixBlendMode={"difference"}
            >
              Salons + Stylists
            </Heading>
            <Heading mixBlendMode={"difference"} fontSize={[64, 84]}>
              Become a TOR Pro
            </Heading>
            <Button onClick={() => applyNowRef && applyNowRef.current && applyNowRef.current.scrollIntoView({behavior: 'smooth'})} bgColor={"white"} color={"black"}>
              Apply Now →
            </Button>
          </Stack>
        </Container>
      </Box>
      <Container pb={[0, 40]} maxW="container.xl">
        <Stack
          spacing={8}
          p={8}
          maxW={["auto", "560px"]}
          bgColor="brand.rose"
          color="black"
        >
          <Heading>Pro Benefits -</Heading>
          <Stack spacing={6}>
            <HStack align="flex-start" spacing={4}>
              <Icon mt={1} as={FiBookOpen} boxSize={8} />
              <Box>
                <Heading size="md" mb={2} fontWeight={600}>
                  Education
                </Heading>
                <Text>
                  Get one-on-one, or group, product and hair-care sessions led by founder and head chemist, Shannon Tor.
                </Text>
              </Box>
            </HStack>
            <Box>
              <HStack align="flex-start" spacing={4}>
                <Icon mt={1} as={FiCreditCard} boxSize={8} />
                <Box>
                  <Heading size="md" mb={2} fontWeight={600}>
                    Wholesale Pricing
                  </Heading>
                  <Text>
                    Exclusive wholesale discounts on all salon products, both back-bar and for retail.
                  </Text>
                </Box>
              </HStack>
            </Box>
            <Box>
              <HStack align="flex-start" spacing={4}>
                <Icon mt={1} as={FiGift} boxSize={8} />
                <Box>
                  <Heading size="md" mb={2} fontWeight={600}>
                    Special Offers
                  </Heading>
                  <Text>
                    Receive special offers and incentives for sharing your TOR stories, seasonal discounts, and more! Have a product idea? We&apos;ll see if we can make it specifically for your clients.
                  </Text>
                </Box>
              </HStack>
            </Box>
          </Stack>
        </Stack>
      </Container>
      <Container maxW="container.sm" pb={60} pt={[40, null]} textAlign={"center"} ref={applyNowRef}>
        <Stack w="full" spacing={6}>
          <Heading>Apply Now!</Heading>
          <Text>Get amazing benefits as a TOR Pro!</Text>
          <ContactForm />
        </Stack>
      </Container>
    </Box>
  );
}

function ContactForm() {
  const [formStatus, setStatus] = useState("unsubmitted");

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      howDidYouHear: "",
      message: "",
    },
    onSubmit: async (values) => {
      let response = await fetch("/api/pro-apply", {
        method: "POST",
        body: JSON.stringify(values),
      });

      console.log(response);

      if (response.status === 200) {
        formik.resetForm();
        formik.setSubmitting(false);
        setStatus("submitted");
      } else if (response.status === 500) {
        formik.setSubmitting(false);
        setStatus("error");
      }
    },
  });

  if (formStatus === "submitted")
    return (
      <Box shadow="xl" p={8} border="1px solid" borderColor={"gray.100"}>
        <Stack spacing={4}>
          <Heading>Thank you for your application!</Heading>
          <Text>
            Someone from our team will reach out to you as soon as we&apos;ve
            been able to review your submission.
          </Text>
        </Stack>
      </Box>
    );

  return (
    <form onSubmit={formik.handleSubmit}>
      {formStatus === "error" && (
        <Text py={4}>
          Something went wrong! You can{" "}
          <a onClick={() => window.Tawk_API.maximize()}>
            click here to contact us
          </a>{" "}
          directly if the form continues to fail.
        </Text>
      )}
      <SimpleGrid templateColumns={`repeat(2, 1fr)`} gap={6} w="full">
        <GridItem colSpan={[2, 1]}>
          <Input
            placeholder="first name"
            name="first_name"
            onChange={formik.handleChange}
            value={formik.values.first_name}
          />
        </GridItem>
        <GridItem colSpan={[2, 1]}>
          <Input
            placeholder="last name"
            name="last_name"
            onChange={formik.handleChange}
            value={formik.values.last_name}
          />
        </GridItem>
        <GridItem colSpan={[2]}>
          <Input
            placeholder="phone number"
            name="phone"
            onChange={formik.handleChange}
            value={formik.values.phone}
          />
        </GridItem>
        <GridItem colSpan={[2]}>
          <Input
            name="email"
            type="email"
            placeholder="email address"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
        </GridItem>
        <GridItem colSpan={[2]}>
          <Input
            placeholder="how did you hear about TOR?"
            // rows={5}
            name="howDidYouHear"
            onChange={formik.handleChange}
            value={formik.values.howDidYouHear}
          />
        </GridItem>
        <GridItem colSpan={[2]}>
          <Textarea
            placeholder="enter any additional message or questions"
            rows={5}
            name="message"
            onChange={formik.handleChange}
            value={formik.values.message}
          />
        </GridItem>
        <GridItem textAlign={"center"} colSpan={2}>
          <Button
            isLoading={formik.isSubmitting}
            type="submit"
            loadingText="Submitting..."
            bgColor={"white"}
            color={"black"}
            _hover={{
              bgColor: "transparent",
              outlineColor: "white",
              outlineStyle: "inset",
              color: "white",
            }}
          >
            Submit ✓
          </Button>
        </GridItem>
      </SimpleGrid>
    </form>
  );
}

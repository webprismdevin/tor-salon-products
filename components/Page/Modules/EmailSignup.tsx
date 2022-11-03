import {
  Box,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Input,
  Button,
  Container,
  SimpleGrid,
  GridItem,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

export default function EmailSignup({
  title,
  showName,
  tags,
  formMessages,
}: {
  title: string;
  showName: boolean;
  tags: [string];
  formMessages?: any;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState({
    firstname: "",
    lastname: "",
  });
  const [formStatus, setStatus] = useState("unsubmitted");
  const toast = useToast();

  const isError = email === "";

  const handleSubmit = async () => {
    const result = await fetch("/api/new-subscriber", {
      method: "POST",
      body: JSON.stringify({
        email,
        name,
        tags,
      }),
    }).then((res) => res.json());

    if(result.data === "created" || result.data == "updated"){
      setStatus("submitted");
    }

    if(window.dataLayer){
      window.dataLayer.push({
        event: "join_email_list",
        signUpMethod: `email_signup_${encodeURIComponent(title)}`,
        callback: () => {
          console.log("fired join_email_list event to GTM");
          window.localStorage.setItem("subscribed", "true");
        },
      });
      window.dataLayer.push({
        event: "generate_lead",
        currency: 'USD',
        value: 0,
        callback: () => {
          window.localStorage.setItem("subscribed", "true");
        },
      });
    }

    console.log(result);

    if (result.error) {
      toast({
        title: "Something didn't work.",
        description:
          "Please try again. If the issue consists, please contact us via the chat button in the bottom right corner.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Container>
      <Heading
        as="h2"
        size="lg"
        mb={4}
        textAlign={["center", null, null, "left"]}
      >
        {title ? title : ""}
      </Heading>
      <Text></Text>
      {formStatus === "unsubmitted" && (
        <FormControl>
          {showName && (
            <SimpleGrid templateColumns={"repeat(2, 1fr)"} gap={6}>
              <GridItem colSpan={1}>
                <FormLabel>First Name</FormLabel>
                <Input
                  type="text"
                  value={name.firstname}
                  onChange={(e: any) =>
                    setName({
                      ...name,
                      firstname: e.target.value,
                    })
                  }
                />
              </GridItem>
              <GridItem colSpan={1}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  type="text"
                  value={name.lastname}
                  onChange={(e: any) =>
                    setName({
                      ...name,
                      lastname: e.target.value,
                    })
                  }
                />
              </GridItem>
            </SimpleGrid>
          )}
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            placeholder="Enter your email address"
          />
          {!isError ? (
            <FormHelperText>
              Enter the email you&apos;d like to recieve updates at.
            </FormHelperText>
          ) : (
            <FormErrorMessage>This field is required</FormErrorMessage>
          )}
          <Button w="full" size="lg" mt={2} onClick={handleSubmit} isDisabled={isError}>
            Submit
          </Button>
        </FormControl>
      )}
      {formStatus === "submitted" && (
        <Box>
          <Heading as="h3" size="md" mb={4}>{formMessages.success}</Heading>
        </Box>
      )}
    </Container>
  );
}

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

    if (
      result.data.customerCreate.userErrors[0]?.message ===
      "Email has already been taken"
    ) {
      toast({
        title: "You're already signed up!",
        description: formMessages?.alreadyOnList
          ? formMessages.alreadyOnList
          : "You're already signed up for our emails!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else if (result.data.customerCreate.userErrors.length === 0) {
      toast({
        title: "You're signed up!",
        description: formMessages?.success
          ? formMessages.success
          : "You're now signed up for our emails!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }

    if(result.error) {
        toast({
            title: "Something went wrong",
            description: formMessages?.error
            ? formMessages.error
            : "Something went wrong, please try again later.",
            status: "error",
            duration: 9000,
            isClosable: true,
        });
    }
  };

  return (
    <Container py={20}>
      <Heading as="h2" size="lg" mb={4}>
        {title ? title : ""}
      </Heading>
      <Text></Text>
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
        />
        {!isError ? (
          <FormHelperText>
            Enter the email you&apos;d like to recieve updates at.
          </FormHelperText>
        ) : (
          <FormErrorMessage>This field is required</FormErrorMessage>
        )}
        <Button mt={2} onClick={handleSubmit} isDisabled={isError}>
          Submit
        </Button>
      </FormControl>
    </Container>
  );
}

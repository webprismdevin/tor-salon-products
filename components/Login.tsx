import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Stack
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import AuthContext from "../lib/auth-context";

export default function Login() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [show, toggle] = useState(false);
  const [loginFailed, setFailed] = useState(false);
  const [email, handleEmail] = useState("");
  const [password, handlePassword] = useState("");

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Log in to TOR</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
                <Input
                  isInvalid={loginFailed}
                  placeholder="Enter your email"
                  size="md"
                  value={email}
                  onChange={(e) => handleEmail(e.target.value)}
                />
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={show ? "text" : "password"}
                    isInvalid={loginFailed}
                    placeholder={"Enter your password"}
                    value={password}
                    onChange={(e) => handlePassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={() => toggle(!show)}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
            </Stack>
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

import {
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  useDisclosure,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Heading,
} from "@chakra-ui/react";
import { NextRouter } from "next/router";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export function Search({ router }: { router: NextRouter }) {
  const [searchValue, setSearchValue] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      router.push(`/search/${searchValue}`);
      onClose();
      setSearchValue("");
    }
  };

  return (
    <>
      <Icon
        as={AiOutlineSearch}
        boxSize={6}
        onClick={onOpen}
        _hover={{
          opacity: 0.4,
        }}
        transition={"opacity 200ms ease"}
      />
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent py={4} mx={4}>
          <ModalCloseButton />
          <ModalHeader>
            <Heading>Search TOR</Heading>
          </ModalHeader>
          <ModalBody>
            <InputGroup>
              <InputLeftElement>
                <Icon as={AiOutlineSearch} />
              </InputLeftElement>
              <Input
                variant="outline"
                placeholder="Whatcha need?"
                onKeyDown={handleKeyDown}
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
              />
            </InputGroup>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

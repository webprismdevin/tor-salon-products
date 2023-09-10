import { AiOutlineInfoCircle } from 'react-icons/ai'
import { HStack, Text, Tooltip, Icon } from '@chakra-ui/react'

export default function ShopPayInstallments() {
  return (
    <HStack justify={"center"} w="full">
      <Text fontSize={"xs"}>Pay in 4 installments. Interest-free.</Text>
      <Tooltip
        label="Purchase now and pay later with Shop Pay Installments. Most approvals are instant, and pay no interest or fees with on-time payments."
        aria-label="Purchase now and pay later with Shop Pay Installments. Most approvals are instant, and pay no interest or fees with on-time payments."
      >
        <span>
          <Icon as={AiOutlineInfoCircle} />
        </span>
      </Tooltip>
    </HStack>
  );
}

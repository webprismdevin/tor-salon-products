import { Stack, Text, AspectRatio } from "@chakra-ui/react"
import NextImage from 'next/image'
import { imageBuilder } from "../../../lib/sanity"
import { SanityImageReference } from "../../../types/sanity"

export interface BigTextBlockProps {
    image: SanityImageReference
    bigText: string
    smallText: string
}

export default function BigTextBlock({module}: {module: BigTextBlockProps}){
    return <Stack direction={["column-reverse", null, null, "row"]} bgColor={"brand.black"}>
        <Stack color="brand.fineThin" p={[8, null, 8, null, 20]}>
            <Text fontSize={"5xl"}>{module.bigText}</Text>
            <Text>{module.smallText}</Text>
        </Stack>
        <AspectRatio minW={['full', null, null, "50%"]} maxW={['full', null, null, "50%"]}>
            <NextImage src={imageBuilder(module.image).url()} layout="fill" objectFit="cover" />
        </AspectRatio>
    </Stack>
}